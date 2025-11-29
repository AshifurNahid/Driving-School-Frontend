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

const CardCheckout = ({ transaction, courseName }: { transaction: PaymentTransaction; courseName?: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cardholderName, setCardholderName] = useState("");
  const [isSavingMethod, setIsSavingMethod] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSaveCard = async () => {
    if (!stripe || !elements) return;

    setIsSavingMethod(true);
    setCardError(null);

    const card = elements.getElement(CardElement);
    if (!card) {
      setCardError("Unable to load card input. Please refresh the page.");
      setIsSavingMethod(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: { name: cardholderName || undefined },
    });

    if (error) {
      setCardError(error.message || "Unable to save card details.");
      setIsSavingMethod(false);
      return;
    }

    if (paymentMethod) {
      setPaymentMethodId(paymentMethod.id);
      toast.success("Card details saved", { description: "Confirm to complete the payment." });
    }

    setIsSavingMethod(false);
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethodId) {
      setCardError("Please save a payment method first.");
      return;
    }

    try {
      setIsConfirming(true);
      const { data } = await api.put(`/payment-transactions-confirm/${transaction.id}`, {
        payment_intent_id: transaction.payment_intent_id,
        payment_method: paymentMethodId,
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
    <Card className="mt-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-indigo-100 dark:border-slate-800">
      <CardHeader className="space-y-2 p-0 mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-200">
          <CreditCard className="h-3.5 w-3.5" />
          Secure checkout
        </div>
        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-slate-50">Payment method</CardTitle>
        <CardDescription className="text-gray-600 text-sm dark:text-slate-300">
          Enter your card details to save a payment method.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        <div className="grid grid-cols-3 gap-3">
          {["Card", "iDEAL", "bancontact"].map((method) => (
            <div
              key={method}
              className="flex items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-3 text-sm font-medium text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60 dark:text-indigo-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-inner dark:bg-slate-900">
                <CreditCard className="h-4 w-4" />
              </span>
              {method}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholder" className="text-lg font-medium text-gray-700 dark:text-slate-200">
            Cardholder name
          </Label>
          <Input
            id="cardholder"
            placeholder="Full name on card"
            value={cardholderName}
            onChange={(event) => setCardholderName(event.target.value)}
            className="rounded-xl border-gray-200 bg-white/80 text-gray-900 shadow-inner focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-indigo-100/80 p-5 shadow-md dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="mb-4 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Card details
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
          onClick={handleSaveCard}
          disabled={isSavingMethod}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {isSavingMethod ? (
            <span className="flex items-center gap-2 justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Saving card...</span>
            </span>
          ) : (
            "Save card"
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={handleConfirmPayment}
          disabled={!paymentMethodId || isConfirming}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {isConfirming ? (
            <span className="flex items-center gap-2 justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Confirming...</span>
            </span>
          ) : (
            "Confirm payment"
          )}
        </Button>
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm border-b border-indigo-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <RoleBasedNavigation />
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur p-6 rounded-2xl shadow-xl border border-indigo-100 dark:border-slate-800">
            <CardContent className="p-0 flex items-center gap-3 text-gray-700 dark:text-slate-200">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" /> Loading checkout details...
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm border-b border-indigo-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-indigo-100 dark:border-slate-800">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2 dark:text-slate-50">Checkout</h1>
            <p className="text-gray-600 text-sm dark:text-slate-300">Complete your purchase to access the course.</p>
          </div>

          <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-indigo-100 dark:border-slate-800">
            <CardHeader className="p-0 mb-6 space-y-1">
              <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-slate-50">{course?.title || "Course"}</CardTitle>
              <CardDescription className="text-gray-600 text-sm dark:text-slate-300">Review your order before purchasing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-medium text-gray-700 dark:text-slate-200">Course</p>
                  <p className="text-gray-600 text-sm dark:text-slate-400">{course?.title}</p>
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-slate-50">${amountLabel} CAD</span>
              </div>
              <Separator className="bg-gray-200 dark:bg-slate-700" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-slate-400">Total</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-slate-50">${amountLabel} CAD</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 p-0 mt-6">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
                onClick={handleCreateTransaction}
                disabled={isCreatingTransaction || !course}
              >
                {isCreatingTransaction ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  "Pay " + amountLabel + " CAD"
                )}
              </Button>

              {transaction && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Transaction created. Enter card details below.</span>
                </div>
              )}
            </CardFooter>
          </Card>

          {transaction ? (
            <CardCheckout transaction={transaction} courseName={course?.title} />
          ) : (
            <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-indigo-100 dark:border-slate-800">
              <CardContent className="p-0 text-sm text-gray-600 flex items-center gap-3 dark:text-slate-300">
                <AlertCircle className="h-4 w-4 text-indigo-600" />
                <span>Click "Pay" to create a payment transaction and unlock the card form.</span>
              </CardContent>
            </Card>
          )}
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
