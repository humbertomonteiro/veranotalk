import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./checkout.module.css";
import ParticipantForm from "../../components/sections/ParticipantForm";
import ParticipantsList from "../../components/sections/ParticipantsList";
import PaymentInfo from "../../components/sections/PaymentInfo";
import SummaryCard from "../../components/sections/SummaryCard";
import { toast, ToastContainer } from "react-toastify";
import { config } from "../../config";

export interface Participant {
  name: string;
  email: string;
  phone: string;
  document: string;
  ticketType: "all";
}

export default function Checkout() {
  const { id } = useParams<{ id: string }>();
  const isGroupTicket = id === "2";
  const minTickets = isGroupTicket ? 5 : 1;
  const basePrice =
    id === "1" ? 499 : id === "2" ? 399 : id === "3" ? 799 : 499;
  const ticketLabel =
    id === "1"
      ? "1º Lote - Ingresso(s)"
      : id === "2"
      ? "2º Lote - Grupo (mínimo 5 ingressos)"
      : id === "3"
      ? "3º Lote - Ingresso(s)"
      : "1º Lote - Ingresso(s)";

  const [fullTickets, setFullTickets] = useState(minTickets);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant>({
    name: "",
    email: "",
    phone: "",
    document: "",
    ticketType: "all",
  });
  const [couponCode, setCouponCode] = useState("");
  const [originalAmount, setOriginalAmount] = useState(minTickets * basePrice);
  const [discountedAmount, setDiscountedAmount] = useState<number | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const totalTickets = fullTickets;
  const totalAmount =
    discountedAmount !== null ? discountedAmount : fullTickets * basePrice;

  // Aplica cupom automaticamente baseado no parâmetro da URL
  useEffect(() => {
    if (id && id !== "1" && id !== "2" && id !== "3") {
      setCouponCode(id.toLowerCase());
      handleApplyCoupon(id.toLowerCase());
    }
  }, [id]);

  const handleTicketChange = (type: "full", value: number) => {
    const newValue = Math.max(minTickets, Math.min(50, value));
    const fullParticipants = participants.length;
    setFullTickets(Math.max(fullParticipants, newValue));
    const newOriginalAmount = newValue * basePrice;
    setOriginalAmount(newOriginalAmount);
    setDiscountedAmount(null);
    setDiscount(null);
    setCouponCode("");
    setCouponError(null);
    console.log(type);
  };

  const handleIncrement = (type: "full") => {
    handleTicketChange(type, fullTickets + 1);
  };

  const handleDecrement = (type: "full") => {
    handleTicketChange(type, fullTickets - 1);
  };

  const handleInputChange = (
    type: "full",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || minTickets;
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
        ticketType: "all",
      });
    }
  };

  const handleRemoveParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    const newFullTickets = newParticipants.length;
    if (isGroupTicket && newFullTickets < minTickets) {
      toast.error("Não é possível remover. Mínimo de 5 ingressos para grupo.");
      return;
    }
    setParticipants(newParticipants);
    setFullTickets(newFullTickets);
    const newOriginalAmount = newFullTickets * basePrice;
    setOriginalAmount(newOriginalAmount);
    setDiscountedAmount(null);
    setDiscount(null);
    setCouponCode("");
    setCouponError(null);
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    setCouponError(null);
  };

  const handleApplyCoupon = async (code: string = couponCode) => {
    if (!code) {
      setCouponError("Por favor, insira um código de cupom");
      toast.error("Por favor, insira um código de cupom");
      return;
    }

    try {
      const response = await fetch(`${config.baseUrl}/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          eventId: "verano-talk",
          totalAmount: originalAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setCouponError(errorData.error || "Erro ao validar cupom");
        toast.error(errorData.error || "Erro ao validar cupom");
        setDiscountedAmount(null);
        setDiscount(null);
        return;
      }

      const data = await response.json();
      setDiscountedAmount(data.discountedAmount);
      setDiscount(data.discount);
      setCouponError(null);
      if (id !== "1" && id !== "2" && id !== "3") {
        console.log(`Cupom ${code} aplicado com sucesso`);
      } else {
        toast.success(`Cupom ${code} aplicado com sucesso`);
      }
    } catch (error) {
      setCouponError("Erro ao conectar com o servidor");
      toast.error("Erro ao conectar com o servidor");
      setDiscountedAmount(null);
      setDiscount(null);
    }
  };

  // const handleCheckout = async () => {
  //   if (participants.length !== totalTickets) {
  //     toast.error(
  //       "Por favor, preencha as informações de todos os participantes."
  //     );
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${config.baseUrl}/checkout`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         participants: participants,
  //         checkout: {
  //           fullTickets: totalTickets,
  //           halfTickets: 0,
  //           couponCode: couponCode || null,
  //           metadata: { eventId: "verano-talk", ticketType: id },
  //         },
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       toast.error(errorData.error || "Erro ao processar checkout");
  //       return;
  //     }

  //     const { paymentUrl } = await response.json();
  //     window.location.href = paymentUrl; // Redirect to Mercado Pago
  //   } catch (error) {
  //     toast.error("Erro ao conectar com o servidor");
  //   }
  // };

  return (
    <main className={styles.main}>
      <ToastContainer />
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
                      <span>{ticketLabel}</span>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleDecrement("full")}
                          disabled={
                            isGroupTicket
                              ? fullTickets <= minTickets
                              : fullTickets <= participants.length
                          }
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={isGroupTicket ? minTickets : participants.length}
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
                      <span>Cupom de Desconto</span>
                      <div className={styles.couponControls}>
                        <input
                          type="text"
                          value={couponCode}
                          onChange={handleCouponChange}
                          placeholder="Insira o código do cupom"
                          className={styles.couponInput}
                        />
                        <button
                          onClick={() => handleApplyCoupon()}
                          className={styles.couponButton}
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && (
                        <span className={styles.couponError}>
                          {couponError}
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                {totalTickets > 0 && (
                  <div className={styles.total}>
                    {discount !== null && discountedAmount !== null ? (
                      <>
                        <div>
                          <span>Subtotal:</span>
                          <span>R$ {originalAmount.toFixed(2)}</span>
                        </div>
                        <div>
                          <span>Desconto:</span>
                          <span>R$ {discount.toFixed(2)}</span>
                        </div>
                        <div className={styles.totalAmount}>
                          <span>Total:</span>
                          <span>R$ {discountedAmount.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <div className={styles.totalAmount}>
                        <span>Total:</span>
                        <span>R$ {totalAmount.toFixed(2)}</span>
                      </div>
                    )}
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
                      halfTickets={0}
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
                halfTickets={0}
                totalTickets={totalTickets}
                totalAmount={totalAmount}
                basePrice={basePrice}
                discount={discount}
                discountedAmount={discountedAmount}
                couponCode={couponCode}
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
