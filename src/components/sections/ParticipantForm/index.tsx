import styles from "./participantForm.module.css";

import type { Participant } from "../../../pages/Checkout";

interface ParticipantFormProps {
  participants: Participant[];
  currentParticipant: Participant;
  handleParticipantChange: (field: keyof Participant, value: string) => void;
  fullTickets: number;
  halfTickets: number;
  handleAddParticipant: () => void;
}

export default function ParticipantForm({
  participants,
  currentParticipant,
  handleParticipantChange,
  fullTickets,
  halfTickets,
  handleAddParticipant,
}: ParticipantFormProps) {
  return (
    <div className={styles.participantForm}>
      <h5>Adicionar Participante {participants.length + 1}</h5>

      <div className={styles.formGroup}>
        <label>Nome Completo*</label>
        <input
          type="text"
          value={currentParticipant.name}
          onChange={(e) => handleParticipantChange("name", e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Email*</label>
        <input
          type="email"
          value={currentParticipant.email}
          onChange={(e) => handleParticipantChange("email", e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Telefone*</label>
        <input
          type="tel"
          value={currentParticipant.phone}
          onChange={(e) => handleParticipantChange("phone", e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>CPF*</label>
        <input
          type="text"
          value={currentParticipant.document}
          onChange={(e) => handleParticipantChange("document", e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Tipo de Ingresso</label>
        <div className={styles.ticketTypeRadio}>
          <label>
            <input
              type="radio"
              checked={currentParticipant.ticketType === "all"}
              onChange={() => handleParticipantChange("ticketType", "all")}
              disabled={participants.length >= fullTickets}
            />
            Inteira (R$ 100,00)
            {participants.length >= fullTickets && (
              <span className={styles.disabledHint}> - Limite atingido</span>
            )}
          </label>
          <label>
            <input
              type="radio"
              checked={currentParticipant.ticketType === "half"}
              onChange={() => handleParticipantChange("ticketType", "half")}
              disabled={
                participants.filter((p) => p.ticketType === "half").length >=
                halfTickets
              }
            />
            Meia (R$ 50,00)
            {participants.filter((p) => p.ticketType === "half").length >=
              halfTickets && (
              <span className={styles.disabledHint}> - Limite atingido</span>
            )}
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddParticipant}
        className={styles.addButton}
        disabled={
          !currentParticipant.name ||
          !currentParticipant.email ||
          !currentParticipant.phone ||
          !currentParticipant.document
        }
      >
        Adicionar Participante
      </button>
    </div>
  );
}
