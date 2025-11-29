export interface PaymentTransaction {
  id: number;
  payment_intent_id: string;
  client_secret: string;
  user_id: number;
  transaction_type: string;
  transaction_reference_id: number;
  amount: number;
  currency: string;
  payment_status: string;
}

export type PaymentStatus = "requires_payment_method" | "processing" | "succeeded" | "requires_action" | "canceled" | string;
