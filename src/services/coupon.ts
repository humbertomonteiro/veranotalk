import { config } from "../config";

export interface CouponProps {
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  uses?: number;
  eventId?: string;
  maxUses?: number | null;
  expiresAt?: string | null;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class CouponService {
  private getAuthHeaders(): { [key: string]: string } {
    // const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      //   ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async createCoupon(couponData: CouponProps): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/coupons`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar cupom");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async validateCoupon(code: string): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/coupons/validate`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao validar cupom");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllCoupons(): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/coupons`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar cupons");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateCoupon(
    id: string,
    couponData: Partial<CouponProps>
  ): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/coupons/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar cupom");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteCoupon(id: string): Promise<void> {
    try {
      const response = await fetch(`${config.baseUrl}/coupons/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir cupom");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
