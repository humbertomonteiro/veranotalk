import { createContext, useContext, useState, useCallback } from "react";
import { CouponService, type CouponProps } from "../services/coupon";

interface CouponContextType {
  coupons: CouponProps[];
  loadCoupons: () => Promise<void>;
  isLoading: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export default function CouponProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [coupons, setCoupons] = useState<CouponProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const couponService = new CouponService();

  const loadCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await couponService.getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error("Erro ao carregar cupons:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <CouponContext.Provider value={{ coupons, loadCoupons, isLoading }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
}
