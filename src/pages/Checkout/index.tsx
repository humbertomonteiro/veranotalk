import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./checkout.module.css";
import ParticipantForm from "../../components/checkout/ParticipantForm";
import ParticipantsList from "../../components/checkout/ParticipantsList";
import PaymentInfo from "../../components/checkout/PaymentInfo";
import SummaryCard from "../../components/checkout/SummaryCard";
import { toast, ToastContainer } from "react-toastify";
import { config } from "../../config";

import useCheckout from "../../hooks/useCheckout";

export interface Participant {
  name: string;
  email: string;
  phone: string;
  document: string;
  ticketType: "all";
}

export default function Checkout() {
  const { ticketDefault, ticketDouble, ticketGroup } = useCheckout();
  const { id } = useParams<{ id: string }>();
  const isGroupTicket = id === "3";
  const isDoubleTicket = id === "2";
  const minTickets = isGroupTicket ? 5 : isDoubleTicket ? 2 : 1;

  const getBasePrice = (tickets: number) => {
    if (isGroupTicket) return ticketGroup;
    if (isDoubleTicket) return ticketDouble;
    if (tickets >= 5) return ticketGroup;
    if (tickets >= 2) return ticketDouble;
    return ticketDefault;
  };

  const [basePrice, setBasePrice] = useState(getBasePrice(minTickets));
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
  const [coupon, setCoupon] = useState({});
  const [discountTypeCoupon, setDiscountTypeCoupon] = useState<
    "fixed" | "percentage"
  >("fixed");
  const [discountValueCoupon, setDiscountValueCoupon] = useState(0);

  const ticketLabel = isGroupTicket
    ? "Ingresso de Grupo (mínimo 5 ingressos)"
    : isDoubleTicket
      ? "Ingresso Casadinha (mínimo 2 ingressos)"
      : fullTickets >= 5
        ? "Ingresso de Grupo"
        : fullTickets >= 2
          ? "Ingresso Casadinha"
          : "Ingresso Individual";

  const unitPrice = getBasePrice(fullTickets);
  const subtotal = unitPrice * fullTickets;
  const couponsAllowed = fullTickets === 1;
  const hasCoupon = couponsAllowed && Object.keys(coupon).length > 0;
  const discountAmount = hasCoupon
    ? discountTypeCoupon === "fixed"
      ? discountValueCoupon
      : subtotal * (discountValueCoupon / 100)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const totalTickets = fullTickets;

  useEffect(() => {
    const newBasePrice = getBasePrice(fullTickets);
    setBasePrice(newBasePrice);
  }, [fullTickets, id]);

  useEffect(() => {
    if (!couponsAllowed) {
      setCouponCode("");
      setCoupon({});
      setDiscountValueCoupon(0);
    } else if (id && id !== "1" && id !== "2" && id !== "3") {
      setCouponCode(id.toLowerCase());
      handleApplyCoupon(id.toLowerCase(), true);
    }
  }, [couponsAllowed, id]);

  const handleIncrement = () => {
    setFullTickets(fullTickets + 1);
  };

  const handleDecrement = () => {
    if (fullTickets <= minTickets) {
      toast.error(
        `Mínimo de ${minTickets} ingresso${
          minTickets > 1 ? "s" : ""
        } para este lote`,
      );
      return;
    }
    setFullTickets(fullTickets - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10);
    const value = Math.max(minTickets, Math.min(50, isNaN(n) ? minTickets : n));
    if (value !== n) {
      toast.error(
        `Mínimo de ${minTickets} ingresso${
          minTickets > 1 ? "s" : ""
        } e máximo de 50`,
      );
    }
    setFullTickets(value);
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
    } else {
      toast.error("Preencha todas as informações do participante");
    }
  };

  const handleRemoveParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    const newFullTickets = Math.max(minTickets, newParticipants.length);
    if (newFullTickets < minTickets) {
      toast.error(
        `Mínimo de ${minTickets} ingresso${
          minTickets > 1 ? "s" : ""
        } para este lote`,
      );
      return;
    }
    setParticipants(newParticipants);
    setFullTickets(newFullTickets);
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!couponsAllowed) {
      toast.error("Cupons são permitidos apenas para 1 ingresso");
      return;
    }
    setCouponCode(e.target.value);
  };

  const handleClearCoupon = () => {
    setCouponCode("");
    setCoupon({});
    setDiscountValueCoupon(0);
  };

  const handleApplyCoupon = async (
    code: string = couponCode,
    silent = false,
  ) => {
    if (!couponsAllowed) {
      if (!silent) toast.error("Cupons são permitidos apenas para 1 ingresso");
      return;
    }
    try {
      const response = await fetch(`${config.baseUrl}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (!silent) toast.error(errorData.error || "Erro ao validar cupom");
        return;
      }

      const data = await response.json();
      setCoupon(data.coupon);
      setDiscountTypeCoupon(data.coupon.discountType);
      setDiscountValueCoupon(data.coupon.discountValue);
      if (!silent) toast.success(`Cupom ${code} aplicado com sucesso`);
    } catch (error) {
      console.log(error);
      if (!silent) toast.error("Erro ao conectar com o servidor");
    }
  };

  return (
    <main className={styles.main}>
      <ToastContainer />
      <section className={styles.section}>
        <div className={styles.container}>
          <h1>Checkout</h1>
          <div className={styles.content}>
            <div className={styles.textContent}>
              <div className={styles.header}>
                <h3>VERANO TALK 2026</h3>
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
                          onClick={handleDecrement}
                          disabled={
                            fullTickets <= minTickets ||
                            fullTickets <= participants.length
                          }
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={minTickets}
                          max="50"
                          value={fullTickets}
                          onChange={handleInputChange}
                          className={styles.quantityInput}
                        />
                        <button
                          onClick={handleIncrement}
                          disabled={fullTickets >= 50}
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </label>
                  </div>
                  <div className={styles.ticketType}>
                    {couponsAllowed && (
                      <label>
                        <span>Cupom de Desconto</span>
                        <div className={styles.couponControls}>
                          <input
                            type="text"
                            value={couponCode}
                            onChange={handleCouponChange}
                            placeholder="Insira o código do cupom"
                            className={styles.couponInput}
                            disabled={!couponsAllowed}
                          />
                          <button
                            onClick={() => handleApplyCoupon()}
                            className={styles.couponButton}
                            disabled={!couponsAllowed}
                          >
                            Aplicar
                          </button>
                          {couponCode && (
                            <button
                              onClick={handleClearCoupon}
                              className={styles.couponButton}
                            >
                              Limpar
                            </button>
                          )}
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {totalTickets > 0 && (
                  <div className={styles.total}>
                    <div>
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div>
                        <span>Desconto:</span>
                        <span>- R$ {discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className={styles.totalAmount}>
                      <span>Total:</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
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
                totalAmount={total}
                basePrice={basePrice}
                discount={discountAmount}
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
