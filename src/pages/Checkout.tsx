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
import { Badge } from "@/components/ui/badge";
import { useCourseDetails } from "@/hooks/useCourseDetail";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import api from "@/utils/axios";
import { EnrollmentStatusPayload, PaymentTransaction, PaymentType } from "@/types/payment";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchEnrollmentStatusByCourseId } from "@/services/userCourses";

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
    <Card className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 dark:bg-[#111827] dark:border-gray-800">
      <CardHeader className="space-y-3 p-0">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-slate-50">Secure checkout</CardTitle>
          <CardDescription className="text-gray-600 dark:text-slate-300">Enter your details to complete payment.</CardDescription>
        </div>
        <Separator className="bg-gray-200 dark:bg-gray-800" />
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-[#1f2a3d] dark:text-orange-300">
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
            Contact (optional)
          </Label>
          <Input
            id="email"
            type="text"
            placeholder="Phone or email"
            value={receiptEmail}
            onChange={(event) => setReceiptEmail(event.target.value)}
            className="h-11 rounded-xl border-gray-200 bg-white text-gray-900 shadow-inner focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-gray-800 dark:bg-[#0f172a] dark:text-slate-100"
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
            className="h-11 rounded-xl border-gray-200 bg-white text-gray-900 shadow-inner focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-gray-800 dark:bg-[#0f172a] dark:text-slate-100"
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-[#0f172a]">
          <div className="mb-4 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-orange-500" />
              Card information
            </div>
            <div className="flex items-center gap-1 opacity-80">
              <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-5 w-8" />
              <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-5 w-8" />
              <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-5 w-8" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-inner focus-within:ring-2 focus-within:ring-orange-500 dark:border-gray-800 dark:bg-[#1a1f2e]">
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
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-orange-500 dark:hover:bg-orange-600"
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
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatusPayload | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>("FullPayment");
  const { userInfo } = useAuth();

  const coursePrice = useMemo(() => {
    if (typeof enrollmentStatus?.course_price === "number") return enrollmentStatus.course_price;
    if (typeof course?.price === "number") return course.price;
    return 0;
  }, [course?.price, enrollmentStatus?.course_price]);

  const coursePriceLabel = useMemo(() => {
    return Number(coursePrice || 0).toFixed(2);
  }, [coursePrice]);

  const normalizePaymentAmount = (rawAmount: unknown) => {
    const parsed = typeof rawAmount === "string" ? Number(rawAmount) : (rawAmount as number | undefined);

    if (typeof parsed !== "number" || Number.isNaN(parsed)) return 0;

    // Some APIs return cents; if the amount is far larger than the course price, scale it down.
    if (coursePrice > 0 && parsed > coursePrice * 1.5) {
      return parsed / 100;
    }

    return parsed;
  };

  const totalPaid = useMemo(() => {
    if (!enrollmentStatus?.payment_histories?.length) return 0;

    return enrollmentStatus.payment_histories.reduce((sum, history) => {
      const normalized = normalizePaymentAmount(history.payment_amount ?? history.PaymentAmount);
      return sum + (Number.isFinite(normalized) ? normalized : 0);
    }, 0);
  }, [coursePrice, enrollmentStatus?.payment_histories]);

  const remainingBalance = useMemo(() => {
    const remaining = coursePrice - totalPaid;
    return remaining > 0 ? remaining : 0;
  }, [coursePrice, totalPaid]);

  const nextPaymentAmount = useMemo(() => {
    if (paymentType === "FullPayment") {
      return coursePrice;
    }

    if (!enrollmentStatus) return 0;

    if (enrollmentStatus.payment_status === "PartiallyPaid") {
      const finalAmount = enrollmentStatus.final_installment_amount;
      if (typeof finalAmount === "number" && finalAmount > 0) {
        return finalAmount;
      }
      return remainingBalance > 0 ? remainingBalance : enrollmentStatus.final_installment_amount ?? coursePrice;
    }

    return enrollmentStatus.initial_installment_amount ?? coursePrice;
  }, [coursePrice, enrollmentStatus, paymentType, remainingBalance]);

  const formattedNextPayment = useMemo(() => Number(nextPaymentAmount || 0).toFixed(2), [nextPaymentAmount]);
  const isInstallmentOnly = enrollmentStatus?.payment_status === "PartiallyPaid";
  const initialInstallmentAmount = useMemo(() => {
    if (typeof enrollmentStatus?.initial_installment_amount === "number") {
      return enrollmentStatus.initial_installment_amount;
    }

    return coursePrice ? coursePrice / 2 : 0;
  }, [coursePrice, enrollmentStatus?.initial_installment_amount]);

  const finalInstallmentAmount = useMemo(() => {
    if (typeof enrollmentStatus?.final_installment_amount === "number") {
      return enrollmentStatus.final_installment_amount;
    }

    return remainingBalance;
  }, [enrollmentStatus?.final_installment_amount, remainingBalance]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { replace: true, state: { from: `/course/${id}/checkout` } });
    }
  }, [id, navigate, userInfo]);

  useEffect(() => {
    if (!id || !userInfo?.id) return;

    const loadEnrollmentStatus = async () => {
      setStatusLoading(true);
      setStatusError(null);

      try {
        const data = await fetchEnrollmentStatusByCourseId(id);
        setEnrollmentStatus(data);

        if (data?.payment_status === "Paid") {
          toast.success("You already own this course", {
            description: "Redirecting you to Continue Learning.",
          });
          navigate(`/course/${id}/learn`, { replace: true });
          return;
        }

        if (data?.payment_status === "PartiallyPaid") {
          setPaymentType("PayByInstallment");
        }
      } catch (error) {
        setStatusError("Unable to load your enrollment status. Please try again.");
      } finally {
        setStatusLoading(false);
      }
    };

    loadEnrollmentStatus();
  }, [id, navigate, userInfo?.id]);

  const handleCreateTransaction = async () => {
    if (!course || !enrollmentStatus) {
      toast.error("Missing course information", { description: "Please refresh and try again." });
      return;
    }

    const paymentAmount = Number(nextPaymentAmount || 0);

    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("No payment required", { description: "This course looks fully paid already." });
      return;
    }

    setIsCreatingTransaction(true);

    try {
      const { data } = await api.post("/payment-transactions", {
        transaction_type: "Course",
        transaction_reference_id: course.id,
        payment_type: paymentType,
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

  if (loading || statusLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 dark:bg-[#0f1419] dark:text-slate-100">
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f1419] backdrop-blur shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <RoleBasedNavigation />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 dark:bg-[#111827] dark:border-gray-800">
            <CardContent className="p-0 flex items-center gap-3 text-gray-700 dark:text-slate-200">
              <Loader2 className="h-5 w-5 animate-spin text-orange-500" /> Loading checkout details...
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (statusError) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 dark:bg-[#0f1419] dark:text-slate-100">
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f1419] backdrop-blur shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <RoleBasedNavigation />
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 dark:bg-[#111827] dark:border-gray-800">
            <CardHeader className="p-0 space-y-3">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-50">Unable to load checkout</CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-300">{statusError}</CardDescription>
            </CardHeader>
            <CardFooter className="p-0 mt-6">
              <Button onClick={() => navigate(`/course/${id}`)}>Return to course</Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#0f1419] dark:text-slate-50">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f1419] backdrop-blur shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <div className="grid lg:grid-cols-[1.05fr,1.4fr] xl:grid-cols-[1.1fr,1.6fr] gap-8 bg-white border border-gray-200 dark:bg-[#111827] dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-white p-8 flex flex-col gap-8 dark:bg-[#0f1419] lg:border-r lg:border-gray-100 dark:lg:border-gray-800">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700 shadow-sm dark:bg-orange-500/15 dark:text-orange-200">
                    <CheckCircle2 className="h-4 w-4" />
                    Secure payment
                  </div>
                  <Badge variant="outline" className="bg-white text-slate-700 border-gray-200 dark:bg-[#0f172a] dark:text-slate-100 dark:border-gray-800">
                    Status: {enrollmentStatus?.payment_status || "Unpaid"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">{course?.title || "Course"}</h2>
                
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-lg dark:border-gray-800 dark:bg-[#0f172a]">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-slate-300">Course price</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">${coursePriceLabel} CAD</p>
                    </div>
                   
                  </div>
                  <Separator className="my-4 bg-gray-200 dark:bg-gray-800" />
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant course unlock after final payment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Securely processed by Stripe
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Enrollment status updated automatically
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Payment option</p>
                  </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start h-auto py-3 border transition-all ${
                        paymentType === "FullPayment"
                          ? "bg-orange-500 text-white border-orange-500 shadow-md"
                          : "bg-white text-slate-800 border-gray-200 hover:border-orange-200 dark:bg-[#0f172a] dark:text-slate-100 dark:border-gray-800"
                      } ${isInstallmentOnly ? "cursor-not-allowed opacity-60" : ""}`}
                      onClick={() => setPaymentType("FullPayment")}
                      disabled={isInstallmentOnly}
                    >
                      <div className="text-left">
                        <p className="font-semibold">Full payment</p>
                        <p className="text-xs opacity-90">Pay ${coursePriceLabel} CAD now</p>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start h-auto py-3 border transition-all ${
                        paymentType === "PayByInstallment"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-white text-slate-800 border-gray-200 hover:border-orange-200 dark:bg-[#0f172a] dark:text-slate-100 dark:border-gray-800"
                      }`}
                      onClick={() => setPaymentType("PayByInstallment")}
                    >
                      <div className="text-left">
                        <p className="font-semibold">Pay by installment</p>
                        <p className={`text-xs ${paymentType === "PayByInstallment" ? "opacity-95 text-white" : "text-indigo-600"}`}>
                          Initial ${initialInstallmentAmount.toFixed(2)} CAD • Final ${finalInstallmentAmount.toFixed(2)} CAD
                        </p>
                      </div>
                    </Button>
                  </div>
                  {isInstallmentOnly && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-200">
                      You have already started an installment plan. Continue with the remaining balance to finish payment.
                    </p>
                  )}
                </div>

                {paymentType === "PayByInstallment" && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-md space-y-4 dark:border-gray-800 dark:bg-[#0f172a]">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-slate-100">Installment breakdown</p>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200">
                        Pay as you go
                      </Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                      <div
                        className={`rounded-xl border p-4 shadow-sm min-w-0 ${
                          enrollmentStatus?.payment_status === "Unpaid"
                            ? "bg-orange-50 border-orange-200 dark:bg-orange-500/15 dark:border-orange-900"
                            : "bg-white border-gray-200 dark:bg-[#111827] dark:border-gray-800"
                        }`}
                      >
                        <p className="text-xs text-gray-600 dark:text-slate-300">Initial installment</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-slate-50 break-words">
                          ${initialInstallmentAmount.toFixed(2)} CAD
                        </p>
                      </div>
                      <div
                        className={`rounded-xl border p-4 shadow-sm min-w-0 ${
                          enrollmentStatus?.payment_status === "PartiallyPaid"
                            ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900"
                            : "bg-white border-gray-200 dark:bg-[#111827] dark:border-gray-800"
                        }`}
                      >
                        <p className="text-xs text-gray-600 dark:text-slate-300">Finial nstallment</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-slate-50 break-words">
                          ${finalInstallmentAmount.toFixed(2)} CAD
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentType === "PayByInstallment" || enrollmentStatus?.payment_histories?.length ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-md space-y-3 dark:border-gray-800 dark:bg-[#0f172a]">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-slate-100">Payment history</p>
                      <Badge variant="outline" className="border-gray-200 text-slate-700 dark:border-gray-700 dark:text-slate-100">
                        {enrollmentStatus?.payment_histories?.length || 0} payment(s)
                      </Badge>
                    </div>
                    {enrollmentStatus?.payment_histories?.length ? (
                      <div className="space-y-3">
                        {enrollmentStatus.payment_histories.map((history, index) => {
                          const transactionId = history.payment_transaction_id ?? history.PaymentTransactionId ?? index + 1;
                          const historyAmount = history.payment_amount ?? history.PaymentAmount ?? 0;
                          const historyCurrency = history.payment_currency ?? history.PaymentCurrency ?? "CAD";
                          const historyDate = history.payment_date ?? history.PaymentDate;

                          const formattedDate = historyDate ? new Date(historyDate).toLocaleDateString() : "Date not provided";

                          return (
                            <div key={`${transactionId}-${index}`} className="flex items-center justify-between rounded-xl bg-white border border-gray-200 p-4 dark:bg-[#111827] dark:border-gray-800">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Payment #{transactionId}</p>
                                <p className="text-xs text-gray-600 dark:text-slate-400">{formattedDate}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900 dark:text-slate-50">${Number(historyAmount).toFixed(2)} {historyCurrency}</p>
                                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                                  Installment • {formattedDate}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <p>Your payment history will appear here after the first installment.</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="mt-auto space-y-3">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed dark:bg-orange-500 dark:hover:bg-orange-600"
                  onClick={handleCreateTransaction}
                  disabled={isCreatingTransaction || !course || !enrollmentStatus || nextPaymentAmount <= 0}
                >
                  {isCreatingTransaction ? (
                    <span className="flex items-center gap-2 justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Starting secure payment...</span>
                    </span>
                  ) : (
                    `Start checkout • ${formattedNextPayment} CAD`
                  )}
                </Button>
              </div>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-[#0f172a]">
              {transaction ? (
                <CardCheckout transaction={transaction} courseName={course?.title} userEmail={userInfo?.email} />
              ) : (
                <Card className="bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 h-full">
                  <CardContent className="h-full flex flex-col items-center justify-center text-center space-y-3 text-gray-600 dark:text-slate-300">
                    <AlertCircle className="h-6 w-6 text-orange-500" />
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
