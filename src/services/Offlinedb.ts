/**
 * offlineDB.ts
 * Camada de persistência offline usando IndexedDB.
 *
 * Stores:
 *   participants  – todos os participantes do evento (cache do backend)
 *   checkin_queue – check-ins feitos offline aguardando sincronização
 */

const DB_NAME = "veranotalk_offline";
const DB_VERSION = 1;

export interface OfflineParticipant {
  id: string;
  name: string;
  document: string;
  email?: string;
  ticketType: string;
  qrCode?: string;
  checkedIn: boolean;
  checkedInBy?: string;
  checkedInAt?: string;
}

export interface QueuedCheckIn {
  id: string; // participantId
  qrCode: string;
  userId: string | null;
  queuedAt: string; // ISO
  synced: boolean;
}

// ─── Abertura do banco ────────────────────────────────────────────────────────

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("participants")) {
        const store = db.createObjectStore("participants", { keyPath: "id" });
        store.createIndex("qrCode", "qrCode", { unique: false });
        store.createIndex("document", "document", { unique: false });
      }

      if (!db.objectStoreNames.contains("checkin_queue")) {
        db.createObjectStore("checkin_queue", { keyPath: "id" });
      }
    };

    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result;
      resolve(_db);
    };

    req.onerror = () => reject(req.error);
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tx(
  db: IDBDatabase,
  stores: string | string[],
  mode: IDBTransactionMode = "readonly"
) {
  return db.transaction(stores, mode);
}

function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── Participants ─────────────────────────────────────────────────────────────

/** Salva lista completa de participantes — limpa o cache anterior primeiro */
export async function saveAllParticipants(
  list: OfflineParticipant[]
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = tx(db, "participants", "readwrite");
    const store = t.objectStore("participants");
    // Limpa tudo antes de inserir para remover participantes
    // que não têm mais checkout aprovado ou foram excluídos
    store.clear();
    list.forEach((p) => store.put(p));
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

/** Busca participantes por nome, email ou CPF (busca parcial, case-insensitive) */
export async function searchParticipants(
  term: string
): Promise<OfflineParticipant[]> {
  if (!term.trim()) return [];
  const db = await openDB();
  const store = tx(db, "participants").objectStore("participants");
  const all = (await promisify(store.getAll())) as OfflineParticipant[];

  const lower = term.toLowerCase().trim();
  const onlyDigits = lower.replace(/\D/g, "");

  return all.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(lower);
    const emailMatch = (p.email ?? "").toLowerCase().includes(lower);
    const cpfMatch =
      onlyDigits.length > 0 &&
      p.document.replace(/\D/g, "").includes(onlyDigits);
    return nameMatch || emailMatch || cpfMatch;
  });
}

/** Busca participante pelo qrCode — tenta match exato e fallback por document */
export async function findParticipantByQrCode(
  qrCode: string
): Promise<OfflineParticipant | null> {
  const db = await openDB();
  const store = tx(db, "participants").objectStore("participants");

  // 1. Match exato
  const exact = await promisify(store.index("qrCode").get(qrCode));
  if (exact) return exact as OfflineParticipant;

  // 2. Fallback: extrai CPF do QR e busca por document
  const parts = qrCode.split("-");
  if (parts.length < 3 || parts[0] !== "PART") return null;

  const uuidSuffix = parts[parts.length - 1];
  const cpfRaw = parts.slice(1, -1).join("-");
  const cpfDigits = cpfRaw.replace(/\D/g, "");
  if (!cpfDigits) return null;

  const byDoc = (await promisify(store.index("document").get(cpfDigits))) as
    | OfflineParticipant
    | undefined;

  if (!byDoc || !byDoc.qrCode) return null;

  // Valida uuid do final
  const savedUuid = byDoc.qrCode.split("-").pop() ?? "";
  if (savedUuid !== uuidSuffix) return null;

  return byDoc;
}

/** Atualiza o campo checkedIn de um participante no cache local */
export async function markCheckedInLocally(
  participantId: string,
  userId: string | null,
  checkedInAt: string
): Promise<void> {
  const db = await openDB();
  const store = tx(db, "participants", "readwrite").objectStore("participants");
  const participant = (await promisify(store.get(participantId))) as
    | OfflineParticipant
    | undefined;
  if (!participant) return;
  participant.checkedIn = true;
  participant.checkedInBy = userId ?? undefined;
  participant.checkedInAt = checkedInAt;
  await promisify(store.put(participant));
}

/** Retorna todos os participantes com checkedIn=true */
export async function getAllCheckedIn(): Promise<OfflineParticipant[]> {
  const db = await openDB();
  const store = tx(db, "participants").objectStore("participants");
  const all = (await promisify(store.getAll())) as OfflineParticipant[];
  return all.filter((p) => p.checkedIn);
}

/** Conta total de participantes no cache */
export async function countParticipants(): Promise<number> {
  const db = await openDB();
  const store = tx(db, "participants").objectStore("participants");
  return promisify(store.count());
}

// ─── Check-in Queue ───────────────────────────────────────────────────────────

/** Adiciona check-in à fila de sincronização */
export async function enqueueCheckIn(item: QueuedCheckIn): Promise<void> {
  const db = await openDB();
  const store = tx(db, "checkin_queue", "readwrite").objectStore(
    "checkin_queue"
  );
  await promisify(store.put(item));
}

/** Retorna todos os check-ins pendentes (não sincronizados) */
export async function getPendingQueue(): Promise<QueuedCheckIn[]> {
  const db = await openDB();
  const store = tx(db, "checkin_queue").objectStore("checkin_queue");
  const all = (await promisify(store.getAll())) as QueuedCheckIn[];
  return all.filter((q) => !q.synced);
}

/** Marca um item da fila como sincronizado */
export async function markQueueItemSynced(
  participantId: string
): Promise<void> {
  const db = await openDB();
  const store = tx(db, "checkin_queue", "readwrite").objectStore(
    "checkin_queue"
  );
  const item = (await promisify(store.get(participantId))) as
    | QueuedCheckIn
    | undefined;
  if (!item) return;
  item.synced = true;
  await promisify(store.put(item));
}
