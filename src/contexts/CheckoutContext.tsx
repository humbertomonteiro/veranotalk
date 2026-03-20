// import {
//   createContext,
//   useState,
//   useEffect,
//   type Dispatch,
//   type ReactNode,
//   type SetStateAction,
// } from "react";
// import { DashboardService } from "../services/dashboard";
// import { type ParticipantProps, type CheckoutProps } from "../domain/entities";

// export type EnhancedParticipant = ParticipantProps & {
//   checkout?: CheckoutProps;
// };

// // 2. Tipo do contexto exposto
// type CheckoutContextType = {
//   stats: StatsType | undefined;
//   setStats: Dispatch<SetStateAction<StatsType | undefined>>;
//   fetchStats: () => Promise<void>;
//   fetchData: () => Promise<void>;
//   lastUpdated: string;
//   checkout: CheckoutProps | undefined;
//   setCheckout: (data: CheckoutProps) => void;
//   checkouts: EnhancedParticipant[];
//   setCheckouts: (data: EnhancedParticipant[]) => void;
//   loading: boolean;
//   setLoading: Dispatch<SetStateAction<boolean>>;
//   generateParticipantsPDF: (fields: string[]) => Promise<void>;
//   ticketDefault: number;
//   setTicketDefault: Dispatch<SetStateAction<number>>;
//   ticketDouble: number;
//   setTicketDouble: Dispatch<SetStateAction<number>>;
//   ticketGroup: number;
//   setTicketGroup: Dispatch<SetStateAction<number>>;
//   generateParticipantsExcel: (
//     fields: string[],
//     status: "all" | "approved" | "rejected" | "processing",
//     dateRange?: DateRange,
//     sortBy?: "nome" | "data",
//   ) => Promise<void>;
// };

// type StatsType = {
//   totalValue: number;
//   totalApprovedCheckouts: number;
//   totalParticipantsInApproved: number;
//   totalParticipants: number;
//   pendingCheckouts: number;
//   checkedInParticipants: number;
// };

// type DateRange = {
//   startDate: string;
//   endDate: string;
// };

// // 3. Criação do contexto
// export const CheckoutContext = createContext<CheckoutContextType | undefined>(
//   undefined,
// );

// // 4. Provider
// type Props = {
//   children: ReactNode;
// };

// export const CheckoutProvider = ({ children }: Props) => {
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState<StatsType | undefined>(undefined);
//   const [lastUpdated, setLastUpdated] = useState<string>("");
//   const [checkout, setCheckout] = useState<CheckoutProps>();
//   const [checkouts, setCheckouts] = useState<EnhancedParticipant[]>([]);
//   const [ticketDefault, setTicketDefault] = useState(499);
//   const [ticketDouble, setTicketDouble] = useState(399);
//   const [ticketGroup, setTicketGroup] = useState(349);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const dashboardService = new DashboardService();
//       const statsData = await dashboardService.getStats();
//       setStats(statsData as any);
//       setLastUpdated(new Date().toLocaleTimeString());
//     } catch (err) {
//       console.error("Erro ao buscar estatísticas:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const dashboardService = new DashboardService();
//       const participantsData = await dashboardService.getParticipants({});
//       const checkoutsData = await dashboardService.getCheckouts({});

//       const checkoutMap = checkoutsData.reduce(
//         (map, checkout) => {
//           map[checkout.id!] = checkout;
//           return map;
//         },
//         {} as { [key: string]: CheckoutProps },
//       );

//       const enhancedParticipants: EnhancedParticipant[] = participantsData.map(
//         (participant) => ({
//           ...participant,
//           checkout: checkoutMap[participant.checkoutId],
//         }),
//       );

//       setCheckouts(enhancedParticipants);
//     } catch (err) {
//       console.error("Erro ao buscar dados:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const escapeLatex = (text: string | undefined | null): string => {
//     if (!text) return "";
//     return text
//       .replace(/&/g, "\\&")
//       .replace(/%/g, "\\%")
//       .replace(/#/g, "\\#")
//       .replace(/\$/g, "\\$")
//       .replace(/_/g, "\\_")
//       .replace(/{/g, "\\{")
//       .replace(/}/g, "\\}")
//       .replace(/~/g, "\\textasciitilde{}")
//       .replace(/\^/g, "\\textasciicircum{}")
//       .replace(/\\/g, "\\textbackslash{}");
//   };

//   const generateParticipantsPDF = async (fields: string[]) => {
//     try {
//       // Validar campos
//       const validFields = ["nome", "documento", "email", "celular", "cupom"];
//       const selectedFields = fields.filter((field) =>
//         validFields.includes(field),
//       );
//       if (selectedFields.length === 0) {
//         throw new Error("Nenhum campo válido selecionado");
//       }

//       // Ordenar participantes por nome
//       const sortedParticipants = [...checkouts].sort((a, b) =>
//         a.name.localeCompare(b.name),
//       );

//       // Mapeamento de campos para cabeçalhos da tabela
//       const fieldToHeader: { [key: string]: string } = {
//         nome: "Nome",
//         documento: "Documento",
//         email: "E-mail",
//         celular: "Celular",
//         cupom: "Cupom",
//         valor: "Valor",
//         data: "Data",
//         status: "Status",
//       };

//       // Mapeamento de campos para dados
//       const fieldToData = (participant: EnhancedParticipant, field: string) => {
//         switch (field) {
//           case "nome":
//             return escapeLatex(participant.name);
//           case "documento":
//             return escapeLatex(participant.document);
//           case "email":
//             return escapeLatex(participant.email);
//           case "celular":
//             return escapeLatex(participant.phone);
//           case "cupom":
//             return escapeLatex(participant.checkout?.couponCode);
//           case "valor":
//             return escapeLatex(participant.checkout?.totalAmount?.toFixed(2));
//           case "data":
//             return escapeLatex(
//               participant.checkout?.createdAt?.toLocaleDateString(),
//             );
//           case "status":
//             return escapeLatex(participant.checkout?.status);
//           default:
//             return "";
//         }
//       };

//       // Gerar colunas da tabela
//       const columnSpec = selectedFields.map(() => "X").join(" | ");
//       const headers = selectedFields
//         .map((field) => fieldToHeader[field])
//         .join(" & ");

//       // Gerar linhas da tabela
//       const rows = sortedParticipants
//         .map((participant) =>
//           selectedFields
//             .map((field) => fieldToData(participant, field))
//             .join(" & "),
//         )
//         .join(" \\\\ \\hline\n");

//       // Data e hora atuais
//       const currentDate = new Date().toLocaleString("pt-BR");

//       // Código LaTeX
//       const latexContent = `
// \\documentclass[a4paper,12pt]{article}
// \\usepackage[utf8]{inputenc}
// \\usepackage[T1]{fontenc}
// \\usepackage{lmodern}
// \\usepackage[margin=1in]{geometry}
// \\usepackage{tabularx}
// \\usepackage{booktabs}
// \\usepackage{helvet}
// \\renewcommand{\\familydefault}{\\sfdefault}

// \\begin{document}

// \\begin{center}
//   \\textbf{\\large Relatório de Participantes} \\\\
//   Gerado em: ${escapeLatex(currentDate)}
// \\end{center}

// \\vspace{1em}

// \\noindent
// \\begin{tabularx}{\\textwidth}{| ${columnSpec} |}
//   \\hline
//   ${headers} \\\\
//   \\hline
//   ${rows}
//   \\end{tabularx}

// \\end{document}
// `;

//       // Gerar PDF como blob
//       const response = await fetch("https://latexonline.cc/compile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: latexContent, compiler: "pdflatex" }),
//       });

//       if (!response.ok) {
//         throw new Error("Erro ao gerar PDF");
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `participantes_${
//         new Date().toISOString().split("T")[0]
//       }.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Erro ao gerar PDF:", error);
//       throw new Error("Erro ao gerar PDF");
//     }
//   };

//   const generateParticipantsExcel = async (
//     fields: string[],
//     status: "all" | "approved" | "rejected" | "processing" = "all",
//     dateRange?: DateRange,
//     sortBy: "nome" | "data" = "nome",
//   ) => {
//     try {
//       const validFields = [
//         "nome",
//         "documento",
//         "email",
//         "celular",
//         "cupom",
//         "valor",
//         "data",
//         "status",
//         "checkoutId",
//       ] as const;

//       type FieldKey = (typeof validFields)[number];

//       const selectedFields: FieldKey[] = fields.filter(
//         (field): field is FieldKey => validFields.includes(field as FieldKey),
//       );

//       if (selectedFields.length === 0) {
//         throw new Error("Nenhum campo válido selecionado");
//       }

//       const fieldToHeader: Record<FieldKey, string> = {
//         nome: "Nome",
//         documento: "Documento",
//         email: "E-mail",
//         celular: "Celular",
//         cupom: "Cupom",
//         valor: "Valor",
//         data: "Data",
//         status: "Status",
//         checkoutId: "ID do Checkout",
//       };

//       const fieldToData = (
//         participant: EnhancedParticipant,
//         field: FieldKey,
//       ): string => {
//         switch (field) {
//           case "nome":
//             return participant.name ?? "";

//           case "documento":
//             return participant.document ?? "";

//           case "email":
//             return participant.email ?? "";

//           case "celular":
//             return participant.phone ?? "";

//           case "cupom":
//             return participant.checkout?.couponCode ?? "";

//           case "valor":
//             const amount = participant.checkout?.totalAmount;
//             const fullTickets = participant.checkout?.fullTickets ?? 1;
//             return amount != null
//               ? (amount / fullTickets).toLocaleString("pt-BR", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : "";

//           case "data":
//             const date = participant.checkout?.createdAt;
//             return date
//               ? new Date(date).toLocaleDateString("pt-BR", {
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 })
//               : "";

//           case "status":
//             return participant.checkout?.status ?? "";

//           case "checkoutId":
//             return participant.checkout?.id ?? "";

//           default:
//             return "";
//         }
//       };

//       // Filtrar participantes por status e data
//       const filteredParticipants = checkouts.filter((participant) => {
//         // Filtro de status
//         if (status !== "all" && participant.checkout?.status !== status) {
//           return false;
//         }

//         // Filtro de data
//         if (dateRange?.startDate || dateRange?.endDate) {
//           const checkoutDate = participant.checkout?.createdAt
//             ? new Date(participant.checkout.createdAt)
//             : null;

//           if (!checkoutDate) return false;

//           if (dateRange.startDate) {
//             const start = new Date(dateRange.startDate);
//             start.setHours(0, 0, 0, 0);
//             if (checkoutDate < start) return false;
//           }

//           if (dateRange.endDate) {
//             const end = new Date(dateRange.endDate);
//             end.setHours(23, 59, 59, 999);
//             if (checkoutDate > end) return false;
//           }
//         }

//         return true;
//       });

//       const sortedParticipants = [...filteredParticipants].sort((a, b) => {
//         if (sortBy === "data") {
//           const dateA = a.checkout?.createdAt
//             ? new Date(a.checkout.createdAt).getTime()
//             : 0;
//           const dateB = b.checkout?.createdAt
//             ? new Date(b.checkout.createdAt).getTime()
//             : 0;
//           return dateA - dateB; // mais antigo primeiro
//         }
//         return (a.name ?? "").localeCompare(b.name ?? ""); // A-Z
//       });

//       // Cabeçalhos
//       const headers = selectedFields.map((field) => fieldToHeader[field]);

//       // Linhas de dados
//       const rows = sortedParticipants.map((participant) =>
//         selectedFields.map((field) => fieldToData(participant, field)),
//       );

//       const worksheetData = [headers, ...rows];

//       // Import dinâmico do SheetJS
//       const XLSX = await import("xlsx");

//       const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

//       // Ajuste automático de largura das colunas
//       const colWidths = headers.map((header, colIdx) => {
//         const maxLength = Math.max(
//           header.length,
//           ...rows.map((row) => (row[colIdx] ?? "").length),
//         );
//         return { wch: maxLength + 3 };
//       });

//       worksheet["!cols"] = colWidths;

//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes");

//       // Nome do arquivo inclui o intervalo de datas se aplicável
//       const dateSuffix =
//         dateRange?.startDate && dateRange?.endDate
//           ? `_${dateRange.startDate}_a_${dateRange.endDate}`
//           : "";

//       const fileName = `participantes${dateSuffix}_${
//         new Date().toISOString().split("T")[0]
//       }.xlsx`;

//       XLSX.writeFile(workbook, fileName);
//     } catch (error) {
//       console.error("Erro ao gerar Excel:", error);
//       throw new Error("Erro ao gerar planilha de participantes");
//     }
//   };

//   return (
//     <CheckoutContext.Provider
//       value={{
//         stats,
//         setStats,
//         fetchStats,
//         fetchData,
//         lastUpdated,
//         checkout,
//         setCheckout,
//         checkouts,
//         setCheckouts,
//         loading,
//         setLoading,
//         generateParticipantsPDF,
//         ticketDefault,
//         setTicketDefault,
//         ticketDouble,
//         setTicketDouble,
//         ticketGroup,
//         setTicketGroup,
//         generateParticipantsExcel,
//       }}
//     >
//       {children}
//     </CheckoutContext.Provider>
//   );
// };
import {
  createContext,
  useState,
  useEffect,
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { DashboardService } from "../services/dashboard";
import { type ParticipantProps, type CheckoutProps } from "../domain/entities";

export type EnhancedParticipant = ParticipantProps & {
  checkout?: CheckoutProps;
};

type CheckoutContextType = {
  stats: StatsType | undefined;
  setStats: Dispatch<SetStateAction<StatsType | undefined>>;
  fetchStats: () => Promise<void>;
  fetchData: () => Promise<void>;
  lastUpdated: string;
  checkout: CheckoutProps | undefined;
  setCheckout: (data: CheckoutProps) => void;
  checkouts: EnhancedParticipant[];
  setCheckouts: (data: EnhancedParticipant[]) => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  generateParticipantsPDF: (fields: string[]) => Promise<void>;
  ticketDefault: number;
  setTicketDefault: Dispatch<SetStateAction<number>>;
  ticketDouble: number;
  setTicketDouble: Dispatch<SetStateAction<number>>;
  ticketGroup: number;
  setTicketGroup: Dispatch<SetStateAction<number>>;
  generateParticipantsExcel: (
    fields: string[],
    status: "all" | "approved" | "rejected" | "processing",
    dateRange?: DateRange,
    sortBy?: "nome" | "data",
  ) => Promise<void>;
};

type StatsType = {
  totalValue: number;
  totalApprovedCheckouts: number;
  totalParticipantsInApproved: number;
  totalParticipants: number;
  pendingCheckouts: number;
  checkedInParticipants: number;
};

type DateRange = {
  startDate: string;
  endDate: string;
};

// Tempo mínimo entre re-fetches (5 minutos)
const CACHE_TTL_MS = 5 * 60 * 1000;

export const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

type Props = {
  children: ReactNode;
};

export const CheckoutProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsType | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [checkout, setCheckout] = useState<CheckoutProps>();
  const [checkouts, setCheckouts] = useState<EnhancedParticipant[]>([]);
  const [ticketDefault, setTicketDefault] = useState(499);
  const [ticketDouble, setTicketDouble] = useState(399);
  const [ticketGroup, setTicketGroup] = useState(349);

  // Refs para controle de cache e deduplicação — não causam re-render
  const lastFetchedAt = useRef<number | null>(null);
  const isFetching = useRef(false);

  // Mount: um único efeito busca tudo de uma vez
  useEffect(() => {
    fetchAll();
  }, []);

  // ─── Fetch unificado ────────────────────────────────────────────────────────

  const fetchAll = async (force = false) => {
    // Deduplicação: ignora se já tem uma busca em andamento
    if (isFetching.current) return;

    // Cache: ignora se os dados ainda estão frescos (a menos que force=true)
    const now = Date.now();
    if (
      !force &&
      lastFetchedAt.current !== null &&
      now - lastFetchedAt.current < CACHE_TTL_MS
    ) {
      return;
    }

    isFetching.current = true;
    setLoading(true);

    try {
      const dashboardService = new DashboardService();

      // Busca paralela: stats + participantes + checkouts em uma rodada só
      const [statsData, participantsData, checkoutsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getParticipants({}),
        dashboardService.getCheckouts({}),
      ]);

      const checkoutMap = checkoutsData.reduce(
        (map, co) => {
          map[co.id!] = co;
          return map;
        },
        {} as Record<string, CheckoutProps>,
      );

      const enhancedParticipants: EnhancedParticipant[] = participantsData.map(
        (participant) => ({
          ...participant,
          checkout: checkoutMap[participant.checkoutId],
        }),
      );

      setStats(statsData as any);
      setCheckouts(enhancedParticipants);
      lastFetchedAt.current = Date.now();
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // Mantém a assinatura pública — componentes que chamam fetchStats/fetchData
  // continuam funcionando sem alteração
  const fetchStats = () => fetchAll();
  const fetchData = () => fetchAll();

  // ─── Geração de PDF ─────────────────────────────────────────────────────────

  const escapeLatex = (text: string | undefined | null): string => {
    if (!text) return "";
    return text
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/#/g, "\\#")
      .replace(/\$/g, "\\$")
      .replace(/_/g, "\\_")
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}")
      .replace(/\\/g, "\\textbackslash{}");
  };

  const generateParticipantsPDF = async (fields: string[]) => {
    try {
      const validFields = ["nome", "documento", "email", "celular", "cupom"];
      const selectedFields = fields.filter((field) =>
        validFields.includes(field),
      );
      if (selectedFields.length === 0) {
        throw new Error("Nenhum campo válido selecionado");
      }

      const sortedParticipants = [...checkouts].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const fieldToHeader: { [key: string]: string } = {
        nome: "Nome",
        documento: "Documento",
        email: "E-mail",
        celular: "Celular",
        cupom: "Cupom",
        valor: "Valor",
        data: "Data",
        status: "Status",
      };

      const fieldToData = (participant: EnhancedParticipant, field: string) => {
        switch (field) {
          case "nome":
            return escapeLatex(participant.name);
          case "documento":
            return escapeLatex(participant.document);
          case "email":
            return escapeLatex(participant.email);
          case "celular":
            return escapeLatex(participant.phone);
          case "cupom":
            return escapeLatex(participant.checkout?.couponCode);
          case "valor":
            return escapeLatex(participant.checkout?.totalAmount?.toFixed(2));
          case "data":
            return escapeLatex(
              participant.checkout?.createdAt?.toLocaleDateString(),
            );
          case "status":
            return escapeLatex(participant.checkout?.status);
          default:
            return "";
        }
      };

      const columnSpec = selectedFields.map(() => "X").join(" | ");
      const headers = selectedFields.map((f) => fieldToHeader[f]).join(" & ");
      const rows = sortedParticipants
        .map((p) => selectedFields.map((f) => fieldToData(p, f)).join(" & "))
        .join(" \\\\ \\hline\n");

      const currentDate = new Date().toLocaleString("pt-BR");
      const latexContent = `
\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=1in]{geometry}
\\usepackage{tabularx}
\\usepackage{booktabs}
\\usepackage{helvet}
\\renewcommand{\\familydefault}{\\sfdefault}

\\begin{document}

\\begin{center}
  \\textbf{\\large Relatório de Participantes} \\\\
  Gerado em: ${escapeLatex(currentDate)}
\\end{center}

\\vspace{1em}

\\noindent
\\begin{tabularx}{\\textwidth}{| ${columnSpec} |}
  \\hline
  ${headers} \\\\
  \\hline
  ${rows}
  \\end{tabularx}

\\end{document}
`;

      const response = await fetch("https://latexonline.cc/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: latexContent, compiler: "pdflatex" }),
      });

      if (!response.ok) throw new Error("Erro ao gerar PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `participantes_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw new Error("Erro ao gerar PDF");
    }
  };

  // ─── Geração de Excel ───────────────────────────────────────────────────────

  const generateParticipantsExcel = async (
    fields: string[],
    status: "all" | "approved" | "rejected" | "processing" = "all",
    dateRange?: DateRange,
    sortBy: "nome" | "data" = "nome",
  ) => {
    try {
      const validFields = [
        "nome",
        "documento",
        "email",
        "celular",
        "cupom",
        "valor",
        "data",
        "status",
        "checkoutId",
      ] as const;

      type FieldKey = (typeof validFields)[number];

      const selectedFields: FieldKey[] = fields.filter(
        (field): field is FieldKey => validFields.includes(field as FieldKey),
      );

      if (selectedFields.length === 0) {
        throw new Error("Nenhum campo válido selecionado");
      }

      const fieldToHeader: Record<FieldKey, string> = {
        nome: "Nome",
        documento: "Documento",
        email: "E-mail",
        celular: "Celular",
        cupom: "Cupom",
        valor: "Valor",
        data: "Data",
        status: "Status",
        checkoutId: "ID do Checkout",
      };

      const fieldToData = (
        participant: EnhancedParticipant,
        field: FieldKey,
      ): string => {
        switch (field) {
          case "nome":
            return participant.name ?? "";
          case "documento":
            return participant.document ?? "";
          case "email":
            return participant.email ?? "";
          case "celular":
            return participant.phone ?? "";
          case "cupom":
            return participant.checkout?.couponCode ?? "";
          case "valor": {
            const amount = participant.checkout?.totalAmount;
            const fullTickets = participant.checkout?.fullTickets ?? 1;
            return amount != null
              ? (amount / fullTickets).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "";
          }
          case "data": {
            const date = participant.checkout?.createdAt;
            return date
              ? new Date(date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "";
          }
          case "status":
            return participant.checkout?.status ?? "";
          case "checkoutId":
            return participant.checkout?.id ?? "";
          default:
            return "";
        }
      };

      const filteredParticipants = checkouts.filter((participant) => {
        if (status !== "all" && participant.checkout?.status !== status)
          return false;

        if (dateRange?.startDate || dateRange?.endDate) {
          const checkoutDate = participant.checkout?.createdAt
            ? new Date(participant.checkout.createdAt)
            : null;
          if (!checkoutDate) return false;

          if (dateRange.startDate) {
            const start = new Date(dateRange.startDate);
            start.setHours(0, 0, 0, 0);
            if (checkoutDate < start) return false;
          }
          if (dateRange.endDate) {
            const end = new Date(dateRange.endDate);
            end.setHours(23, 59, 59, 999);
            if (checkoutDate > end) return false;
          }
        }

        return true;
      });

      const sortedParticipants = [...filteredParticipants].sort((a, b) => {
        if (sortBy === "data") {
          const dateA = a.checkout?.createdAt
            ? new Date(a.checkout.createdAt).getTime()
            : 0;
          const dateB = b.checkout?.createdAt
            ? new Date(b.checkout.createdAt).getTime()
            : 0;
          return dateA - dateB;
        }
        return (a.name ?? "").localeCompare(b.name ?? "");
      });

      const headers = selectedFields.map((f) => fieldToHeader[f]);
      const rows = sortedParticipants.map((p) =>
        selectedFields.map((f) => fieldToData(p, f)),
      );
      const worksheetData = [headers, ...rows];

      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet["!cols"] = headers.map((header, colIdx) => ({
        wch:
          Math.max(
            header.length,
            ...rows.map((row) => (row[colIdx] ?? "").length),
          ) + 3,
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes");

      const dateSuffix =
        dateRange?.startDate && dateRange?.endDate
          ? `_${dateRange.startDate}_a_${dateRange.endDate}`
          : "";

      XLSX.writeFile(
        workbook,
        `participantes${dateSuffix}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Erro ao gerar Excel:", error);
      throw new Error("Erro ao gerar planilha de participantes");
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        stats,
        setStats,
        fetchStats,
        fetchData,
        lastUpdated,
        checkout,
        setCheckout,
        checkouts,
        setCheckouts,
        loading,
        setLoading,
        generateParticipantsPDF,
        ticketDefault,
        setTicketDefault,
        ticketDouble,
        setTicketDouble,
        ticketGroup,
        setTicketGroup,
        generateParticipantsExcel,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
