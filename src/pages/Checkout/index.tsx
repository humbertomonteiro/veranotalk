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
  const getBasePrice = (tickets: number) =>
    tickets >= 5
      ? 399
      : id === "1"
      ? 499
      : id === "2"
      ? 399
      : id === "3"
      ? 799
      : 499;
  const [basePrice, setBasePrice] = useState(getBasePrice(minTickets));
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
  // const [discountedAmount, setDiscountedAmount] = useState<number | null>(null);
  const [coupon, setCoupon] = useState({});
  const [discountTypeCoupon, setDiscountTypeCoupon] = useState<
    "fixed" | "percentage"
  >("fixed");
  const [discountValueCoupon, setDiscountValueCoupon] = useState(0);

  const unitPrice = getBasePrice(fullTickets);
  const subtotal = unitPrice * fullTickets;

  const couponsAllowed = fullTickets < 5; // mesmos critérios do disableCoupons
  const hasCoupon = couponsAllowed && Object.keys(coupon).length > 0;

  const discountAmount = hasCoupon
    ? discountTypeCoupon === "fixed"
      ? discountValueCoupon * fullTickets // fixo por ingresso
      : subtotal * (discountValueCoupon / 100) // percentual sobre o subtotal
    : 0;

  const total = Math.max(0, subtotal - discountAmount);

  const disableCoupons = !couponsAllowed;

  const totalTickets = fullTickets;
  // const disableCoupons = fullTickets >= 5;
  // const totalAmount =
  //   disableCoupons || discountedAmount === null
  //     ? fullTickets * basePrice
  //     : discountedAmount;

  // Sincroniza estado do cupom quando disableCoupons mudar
  useEffect(() => {
    if (disableCoupons) {
      setCouponCode("");
      // setDiscountedAmount(null);
      // setDiscount(null);
    }
  }, [disableCoupons, fullTickets, basePrice]);

  // Aplica cupom automaticamente baseado no parâmetro da URL
  useEffect(() => {
    if (id && id !== "1" && id !== "2" && id !== "3" && !disableCoupons) {
      setCouponCode(id.toLowerCase());
      handleApplyCoupon(id.toLowerCase(), true);
    }
  }, [id, disableCoupons, fullTickets]);

  const handleIncrement = (type: "full") => {
    console.log(type);
    setFullTickets(fullTickets + 1);
  };

  const handleDecrement = (type: "full") => {
    console.log(type);
    if (fullTickets <= minTickets) {
      toast.error(
        `Mínimo de ${minTickets} ingresso${
          minTickets > 1 ? "s" : ""
        } para este lote`
      );
      return;
    }
    setFullTickets(fullTickets - 1);
  };

  const handleInputChange = (
    type: "full",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const n = parseInt(e.target.value, 10);
    const value = Math.max(minTickets, Math.min(50, isNaN(n) ? minTickets : n));
    if (value !== n) {
      toast.error(
        `Mínimo de ${minTickets} ingresso${
          minTickets > 1 ? "s" : ""
        } e máximo de 50`
      );
    }
    console.log(type);
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
    if (isGroupTicket && newFullTickets < minTickets) {
      toast.error("Não é possível remover. Mínimo de 5 ingressos para grupo.");
      return;
    }
    setParticipants(newParticipants);
    setFullTickets(newFullTickets);
    const newBasePrice = getBasePrice(newFullTickets);
    setBasePrice(newBasePrice);
    if (newFullTickets >= 5) {
      // setDiscountedAmount(null);
      setCouponCode("");
    } else if (couponCode) {
      handleApplyCoupon(couponCode);
    } else {
      // setDiscountedAmount(null);
    }
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disableCoupons) {
      toast.error("Cupons não são permitidos para 5 ou mais ingressos");
      return;
    }
    setCouponCode(e.target.value);
  };

  const handleClearCoupon = () => {
    setCouponCode("");
    // setDiscountedAmount(null);
    // setDiscount(null);
  };

  const handleApplyCoupon = async (
    code: string = couponCode,
    silent = false
  ) => {
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

      // Salva apenas os metadados; o desconto é calculado no render
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
                    {!disableCoupons && (
                      <label>
                        <span>Cupom de Desconto</span>
                        <div className={styles.couponControls}>
                          <input
                            type="text"
                            value={couponCode}
                            onChange={handleCouponChange}
                            placeholder="Insira o código do cupom"
                            className={styles.couponInput}
                            disabled={disableCoupons}
                          />
                          <button
                            onClick={() => handleApplyCoupon()}
                            className={styles.couponButton}
                            disabled={disableCoupons}
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
