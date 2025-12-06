import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCourseDetails } from "@/hooks/useCourseDetail";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import api from "@/utils/axios";
import { PaymentTransaction } from "@/types/payment";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const CardCheckout = ({
  transaction,
  courseName,
  userEmail,
}: {
  transaction: PaymentTransaction;
  courseName?: string;
  userEmail?: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cardholderName, setCardholderName] = useState("");
  const [receiptEmail, setReceiptEmail] = useState(userEmail || "");
  const [cardError, setCardError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmPayment = async () => {
    if (!stripe || !elements) return;
    setCardError(null);

    const card = elements.getElement(CardElement);

    if (!card) {
      setCardError("Unable to load card input. Please refresh the page.");
      return;
    }

    try {
      setIsConfirming(true);
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: cardholderName || undefined,
          email: receiptEmail || undefined,
        },
      });

      if (methodError || !paymentMethod?.id) {
        setCardError(methodError?.message || "Unable to create payment method. Please try again.");
        return;
      }

      const { data } = await api.put(`/payment-transactions-confirm/${transaction.id}`, {
        payment_intent_id: transaction.payment_intent_id,
        payment_method: paymentMethod.id,
      });

      const paymentStatus = data?.data?.payment_status;

      if (paymentStatus === "succeeded") {
        toast.success("Payment successful", { description: `${courseName ?? "Course"} unlocked!` });
        navigate("/checkout/result", {
          state: {
            status: paymentStatus,
            transactionId: transaction.id,
            courseId: transaction.transaction_reference_id,
            amount: transaction.amount,
          },
        });
      } else {
        navigate("/checkout/result", {
          state: {
            status: paymentStatus || "failed",
            transactionId: transaction.id,
            courseId: transaction.transaction_reference_id,
            amount: transaction.amount,
          },
        });
      }
    } catch (error) {
      setCardError("Unable to confirm payment. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Card className="bg-white/95 p-8 rounded-3xl shadow-2xl border border-indigo-50 dark:bg-slate-900/80 dark:border-slate-800">
      <CardHeader className="space-y-3 p-0">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-slate-50">Secure checkout</CardTitle>
          <CardDescription className="text-gray-600 dark:text-slate-300">Enter your details to complete payment.</CardDescription>
        </div>
        <Separator className="bg-gray-200 dark:bg-slate-700" />
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-slate-800">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-slate-100">Card payment</p>
            <p className="text-xs">We use Stripe to process payments securely.</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-0 mt-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-slate-200">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={receiptEmail}
            onChange={(event) => setReceiptEmail(event.target.value)}
            className="h-11 rounded-xl border-gray-200 bg-white/80 text-gray-900 shadow-inner focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholder" className="text-sm font-medium text-gray-700 dark:text-slate-200">
            Cardholder name
          </Label>
          <Input
            id="cardholder"
            placeholder="Full name on card"
            value={cardholderName}
            onChange={(event) => setCardholderName(event.target.value)}
            className="h-11 rounded-xl border-gray-200 bg-white/80 text-gray-900 shadow-inner focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-indigo-50 to-indigo-100/70 p-5 shadow-md dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="mb-4 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Card information
            </div>
            <div className="flex items-center gap-1 opacity-80">
              <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-5 w-8" />
              <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-5 w-8" />
              <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-5 w-8" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>

        {cardError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-center gap-2 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>{cardError}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3 p-0 mt-6">
        <Button
          onClick={handleConfirmPayment}
          disabled={isConfirming}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConfirming ? (
            <span className="flex items-center gap-2 justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Confirming...</span>
            </span>
          ) : (
            `Pay ${Number(transaction.amount).toFixed(2)} ${transaction.currency}`
          )}
        </Button>

        <p className="text-[11px] text-center text-gray-500 dark:text-slate-400">
          By confirming, you agree to the terms of service. You might receive emails from Stripe for receipts.
        </p>
      </CardFooter>
    </Card>
  );
};

const CheckoutContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { course, loading } = useCourseDetails(Number(id));
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const { userInfo } = useAuth();

  const amountLabel = useMemo(() => {
    if (!course?.price) return "0.00";
    return Number(course.price).toFixed(2);
  }, [course?.price]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { replace: true, state: { from: `/course/${id}/checkout` } });
    }
  }, [id, navigate, userInfo]);

  const handleCreateTransaction = async () => {
    if (!course) return;
    setIsCreatingTransaction(true);

    try {
      const { data } = await api.post("/payment-transactions", {
        transaction_type: "Course",
        transaction_reference_id: course.id,
        amount: course.price,
        currency: "CAD",
      });

      const paymentTransaction: PaymentTransaction = data?.data;
      setTransaction(paymentTransaction);
      toast.success("Payment initiated", { description: "Enter your card details to continue." });
    } catch (error) {
      toast.error("Unable to start checkout", { description: "Please try again later." });
    } finally {
      setIsCreatingTransaction(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm border-b border-indigo-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <RoleBasedNavigation />
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 dark:bg-slate-900/80 dark:border-slate-800">
            <CardContent className="p-0 flex items-center gap-3 text-gray-700 dark:text-slate-200">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" /> Loading checkout details...
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm border-b border-indigo-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Checkout</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Confirm your enrollment</h1>
            <p className="text-gray-600 max-w-3xl dark:text-slate-300">Review the course summary and finish payment to access the content.</p>
          </div>

          <div className="grid lg:grid-cols-[1.05fr,1.2fr] gap-6 bg-white/70 dark:bg-slate-900/70 border border-indigo-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-sky-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-8 flex flex-col gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm dark:bg-slate-800 dark:text-sky-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Secure payment
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">{course?.title || "Course"}</h2>
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-slate-300">Review your enrollment details before continuing to payment.</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/60 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-slate-300">Total due</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-slate-50">${amountLabel} {course?.currency || "CAD"}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Course</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{course?.title}</p>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-200 dark:bg-slate-700" />
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant course unlock after payment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Securely processed by Stripe
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  onClick={handleCreateTransaction}
                  disabled={isCreatingTransaction || !course}
                >
                  {isCreatingTransaction ? (
                    <span className="flex items-center gap-2 justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Starting secure payment...</span>
                    </span>
                  ) : (
                    `Start checkout • ${amountLabel} ${course?.currency || "CAD"}`
                  )}
                </Button>
                <p className="text-xs text-gray-600 text-center dark:text-slate-400">
                  Click to initialize your payment session. No charge will be made until you confirm on the next step.
                </p>
                {transaction && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-white/60 border border-white/70 rounded-xl px-4 py-3 shadow-sm dark:bg-slate-900/60 dark:border-slate-800 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Transaction ready. Enter your payment details to finish.
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-white/90 dark:bg-slate-900/80">
              {transaction ? (
                <CardCheckout transaction={transaction} courseName={course?.title} userEmail={userInfo?.email} />
              ) : (
                <Card className="bg-white/80 dark:bg-slate-900/70 rounded-2xl border border-dashed border-indigo-200 dark:border-slate-700 h-full">
                  <CardContent className="h-full flex flex-col items-center justify-center text-center space-y-3 text-gray-600 dark:text-slate-300">
                    <AlertCircle className="h-6 w-6 text-indigo-500" />
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800 dark:text-slate-100">Start checkout to continue</p>
                      <p className="text-sm">We will generate a secure payment session once you click the button on the left.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!publishableKey) {
      toast.error("Missing Stripe publishable key", { description: "Add VITE_STRIPE_PUBLISHABLE_KEY to your env." });
    }
  }, [publishableKey]);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent key={location.key} />
    </Elements>
  );
};

export default CheckoutPage;
