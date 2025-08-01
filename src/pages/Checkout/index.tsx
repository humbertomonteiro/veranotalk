import { useState } from "react";
import styles from "./checkout.module.css";
// import Title from "../../components/shared/Title";
import ParticipantForm from "../../components/sections/ParticipantForm";
import ParticipantsList from "../../components/sections/ParticipantsList";
import PaymentInfo from "../../components/sections/PaymentInfo";
import SummaryCard from "../../components/sections/SummaryCard";

export interface Participant {
  name: string;
  email: string;
  phone: string;
  document: string;
  ticketType: "all" | "half" | "vip";
}

export default function Checkout() {
  const [fullTickets, setFullTickets] = useState(1);
  const [halfTickets, setHalfTickets] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant>({
    name: "",
    email: "",
    phone: "",
    document: "",
    ticketType: "all",
  });

  const totalTickets = fullTickets + halfTickets;
  const totalAmount = fullTickets * 499 + halfTickets * 249.5;

  const handleTicketChange = (type: "full" | "half", value: number) => {
    const newValue = Math.max(0, Math.min(50, value));

    if (type === "full") {
      // Não permitir diminuir abaixo do número de participantes full já adicionados
      const fullParticipants = participants.filter(
        (p) => p.ticketType === "all"
      ).length;
      setFullTickets(Math.max(fullParticipants, newValue));
    } else {
      // Não permitir diminuir abaixo do número de participantes half já adicionados
      const halfParticipants = participants.filter(
        (p) => p.ticketType === "half"
      ).length;
      setHalfTickets(Math.max(halfParticipants, newValue));
    }
  };

  const handleIncrement = (type: "full" | "half") => {
    handleTicketChange(type, (type === "full" ? fullTickets : halfTickets) + 1);
  };

  const handleDecrement = (type: "full" | "half") => {
    handleTicketChange(type, (type === "full" ? fullTickets : halfTickets) - 1);
  };

  const handleInputChange = (
    type: "full" | "half",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || 0;
    handleTicketChange(type, value);
  };

  const handleParticipantChange = (field: keyof Participant, value: string) => {
    setCurrentParticipant({
      ...currentParticipant,
      [field]: value,
    });
  };

  const handleAddParticipant = () => {
    if (
      currentParticipant.name &&
      currentParticipant.email &&
      currentParticipant.phone &&
      currentParticipant.document
    ) {
      setParticipants([...participants, currentParticipant]);
      setCurrentParticipant({
        name: "",
        email: "",
        phone: "",
        document: "",
        // Define o tipo automaticamente baseado no que falta preencher
        ticketType:
          participants.filter((p) => p.ticketType === "all").length <
          fullTickets
            ? "all"
            : "half",
      });
    }
  };

  const handleRemoveParticipant = (index: number) => {
    const participantToRemove = participants[index];
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);

    // Atualiza a contagem de tickets se necessário
    if (
      participantToRemove.ticketType === "all" &&
      newParticipants.filter((p) => p.ticketType === "all").length < fullTickets
    ) {
      setFullTickets(
        newParticipants.filter((p) => p.ticketType === "all").length
      );
    } else if (
      participantToRemove.ticketType === "half" &&
      newParticipants.filter((p) => p.ticketType === "half").length <
        halfTickets
    ) {
      setHalfTickets(
        newParticipants.filter((p) => p.ticketType === "half").length
      );
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h1>Checkout</h1>
          <div className={styles.content}>
            <div className={styles.textContent}>
              <div className={styles.header}>
                <h3>VERANO TALK 2025</h3>
                <div className={styles.divider}></div>
                <p className={styles.subtitle}>Checkout seguro</p>
              </div>

              <div className={styles.ticketSelection}>
                <div className={styles.ticketSelectionType}>
                  <div className={styles.ticketType}>
                    <label>
                      <span>Ingressos Inteiros (R$ 499,00)</span>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleDecrement("full")}
                          disabled={
                            fullTickets <=
                            participants.filter((p) => p.ticketType === "all")
                              .length
                          }
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={
                            participants.filter((p) => p.ticketType === "all")
                              .length
                          }
                          max="50"
                          value={fullTickets}
                          onChange={(e) => handleInputChange("full", e)}
                          className={styles.quantityInput}
                        />
                        <button
                          onClick={() => handleIncrement("full")}
                          disabled={fullTickets >= 50}
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </label>
                  </div>
                  <div className={styles.ticketType}>
                    <label>
                      <span>Ingressos Meia (R$ 249,50)</span>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleDecrement("half")}
                          disabled={
                            halfTickets <=
                            participants.filter((p) => p.ticketType === "half")
                              .length
                          }
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={
                            participants.filter((p) => p.ticketType === "half")
                              .length
                          }
                          max="50"
                          value={halfTickets}
                          onChange={(e) => handleInputChange("half", e)}
                          className={styles.quantityInput}
                        />
                        <button
                          onClick={() => handleIncrement("half")}
                          disabled={halfTickets >= 50}
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </label>
                  </div>
                </div>

                {totalTickets > 0 && (
                  <div className={styles.total}>
                    <span>Total:</span>
                    <span>R$ {totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {totalTickets > 0 && (
                <div className={styles.participantsSection}>
                  <h4>
                    Informações dos Participantes ({participants.length}/
                    {totalTickets})
                  </h4>

                  {participants.length > 0 && (
                    <ParticipantsList
                      handleRemoveParticipant={handleRemoveParticipant}
                      participants={participants}
                    />
                  )}

                  {participants.length < totalTickets && (
                    <ParticipantForm
                      currentParticipant={currentParticipant}
                      fullTickets={fullTickets}
                      halfTickets={halfTickets}
                      handleAddParticipant={handleAddParticipant}
                      handleParticipantChange={handleParticipantChange}
                      participants={participants}
                    />
                  )}
                </div>
              )}
            </div>

            <div className={styles.visualContent}>
              <SummaryCard
                fullTickets={fullTickets}
                halfTickets={halfTickets}
                totalTickets={totalTickets}
                totalAmount={totalAmount}
                participants={participants}
              />

              <PaymentInfo />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
