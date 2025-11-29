import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CircleAlert, Home, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { Separator } from "@/components/ui/separator";

interface PaymentResultState {
  status?: string;
  transactionId?: number;
  courseId?: number;
  amount?: number;
}

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as PaymentResultState) || {};
  const isSuccess = state.status === "succeeded" || state.status === "success";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <CardHeader className="space-y-2">
            {isSuccess ? (
              <div className="flex justify-center text-green-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            ) : (
              <div className="flex justify-center text-destructive">
                <CircleAlert className="h-10 w-10" />
              </div>
            )}
            <CardTitle className="text-3xl font-bold">
              {isSuccess ? "Payment Successful" : "Payment Failed"}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? "Your course purchase is confirmed."
                : "We could not process your payment. Please try again."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              {state.transactionId && (
                <span>Transaction #{state.transactionId}</span>
              )}
              {typeof state.amount === "number" && (
                <span>Amount: ${state.amount.toFixed(2)} CAD</span>
              )}
            </div>
            <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>If payment succeeded, the course will be available under "My Courses".</p>
              <p>If it failed, you can return to the course and retry checkout.</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button onClick={() => navigate("/learner/courses")} className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              My Courses
            </Button>
            {state.courseId && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/course/${state.courseId}`)}
                className="gap-2"
              >
                Retry checkout
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default PaymentResult;
