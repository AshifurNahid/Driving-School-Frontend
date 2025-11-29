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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>Enter your card details to save a payment method.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardholder">Cardholder name</Label>
          <Input
            id="cardholder"
            placeholder="Full name on card"
            value={cardholderName}
            onChange={(event) => setCardholderName(event.target.value)}
          />
        </div>

        <div className="rounded-md border p-4 bg-muted/50">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Card details</span>
          </div>
          <div className="p-3 rounded-md border bg-background">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>

        {cardError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{cardError}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3">
        <Button onClick={handleSaveCard} disabled={isSavingMethod} className="w-full">
          {isSavingMethod ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Saving card
            </span>
          ) : (
            "Save card"
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={handleConfirmPayment}
          disabled={!paymentMethodId || isConfirming}
          className="w-full"
        >
          {isConfirming ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Confirming
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
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <RoleBasedNavigation />
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card>
            <CardContent className="p-6 flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading checkout details...
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase to access the course.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{course?.title || "Course"}</CardTitle>
              <CardDescription>Review your order before purchasing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Course</p>
                  <p className="text-muted-foreground text-sm">{course?.title}</p>
                </div>
                <span className="text-lg font-semibold">${amountLabel} CAD</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-bold">${amountLabel} CAD</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                className="w-full"
                onClick={handleCreateTransaction}
                disabled={isCreatingTransaction || !course}
              >
                {isCreatingTransaction ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating transaction
                  </span>
                ) : (
                  "BUY NOW"
                )}
              </Button>

              {transaction && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Transaction created. Enter card details below.</span>
                </div>
              )}
            </CardFooter>
          </Card>

          {transaction ? (
            <CardCheckout transaction={transaction} courseName={course?.title} />
          ) : (
            <Card className="bg-muted/40">
              <CardContent className="p-6 text-sm text-muted-foreground flex items-center gap-3">
                <AlertCircle className="h-4 w-4" />
                <span>Click "BUY NOW" to create a payment transaction and unlock the card form.</span>
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
