import {
  createContext,
  useState,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { DashboardService } from "../services/dashboard";
import { type ParticipantProps, type CheckoutProps } from "../domain/entities";

export type EnhancedParticipant = ParticipantProps & {
  checkout?: CheckoutProps;
};

// 2. Tipo do contexto exposto
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
};

type StatsType = {
  totalValue: number;
  totalApprovedCheckouts: number;
  totalParticipantsInApproved: number;
  totalParticipants: number;
  pendingCheckouts: number;
  checkedInParticipants: number;
};

// 3. Criação do contexto
export const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

// 4. Provider
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const dashboardService = new DashboardService();
      const statsData = await dashboardService.getStats();
      setStats(statsData as any);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const dashboardService = new DashboardService();
      const participantsData = await dashboardService.getParticipants({});
      const checkoutsData = await dashboardService.getCheckouts({});

      const checkoutMap = checkoutsData.reduce(
        (map, checkout) => {
          map[checkout.id!] = checkout;
          return map;
        },
        {} as { [key: string]: CheckoutProps },
      );

      const enhancedParticipants: EnhancedParticipant[] = participantsData.map(
        (participant) => ({
          ...participant,
          checkout: checkoutMap[participant.checkoutId],
        }),
      );

      setCheckouts(enhancedParticipants);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

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
      // Validar campos
      const validFields = ["nome", "documento", "email", "celular", "cupom"];
      const selectedFields = fields.filter((field) =>
        validFields.includes(field),
      );
      if (selectedFields.length === 0) {
        throw new Error("Nenhum campo válido selecionado");
      }

      // Ordenar participantes por nome
      const sortedParticipants = [...checkouts].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      // Mapeamento de campos para cabeçalhos da tabela
      const fieldToHeader: { [key: string]: string } = {
        nome: "Nome",
        documento: "Documento",
        email: "E-mail",
        celular: "Celular",
        cupom: "Cupom",
      };

      // Mapeamento de campos para dados
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
          default:
            return "";
        }
      };

      // Gerar colunas da tabela
      const columnSpec = selectedFields.map(() => "X").join(" | ");
      const headers = selectedFields
        .map((field) => fieldToHeader[field])
        .join(" & ");

      // Gerar linhas da tabela
      const rows = sortedParticipants
        .map((participant) =>
          selectedFields
            .map((field) => fieldToData(participant, field))
            .join(" & "),
        )
        .join(" \\\\ \\hline\n");

      // Data e hora atuais
      const currentDate = new Date().toLocaleString("pt-BR");

      // Código LaTeX
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

      // Gerar PDF como blob
      const response = await fetch("https://latexonline.cc/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: latexContent, compiler: "pdflatex" }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `participantes_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw new Error("Erro ao gerar PDF");
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
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
