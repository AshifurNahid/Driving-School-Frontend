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
  payment_type?: PaymentType;
}

export type PaymentStatus = "requires_payment_method" | "processing" | "succeeded" | "requires_action" | "canceled" | string;

export type EnrollmentPaymentStatus = "Unpaid" | "Paid" | "PartiallyPaid";

export type PaymentType = "FullPayment" | "PayByInstallment";

export interface PaymentHistory {
  payment_transaction_id?: number;
  payment_amount?: number;
  payment_currency?: string;
  payment_date?: string;
  PaymentTransactionId?: number;
  PaymentAmount?: number;
  PaymentCurrency?: string;
  PaymentDate?: string;
}

export interface EnrollmentStatusPayload {
  course_id?: number;
  course_title?: string;
  course_price?: number;
  initial_installment_amount?: number;
  final_installment_amount?: number;
  payment_status?: EnrollmentPaymentStatus;
  payment_histories?: PaymentHistory[];
}

export interface EnrollmentStatusResponse {
  status?: {
    code?: string;
    message?: string;
  };
  data?: EnrollmentStatusPayload;
}
