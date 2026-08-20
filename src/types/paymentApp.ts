export type PaymentAppId =
  | "kiwi"
  | "navi"
  | "super_money"
  | "paytm"
  | "bhim"
  | "bhim_lite";

export type PaymentCategory = "upi" | "upi_lite" | "rupay";

export interface PaymentApp {
  id: PaymentAppId;
  name: string;
  category: PaymentCategory;
  recommendationEligible: boolean;
  color: string;
  bgColor: string;
  tagline: string;
}

export interface PaymentAppsConfig {
  apps: PaymentApp[];
}
