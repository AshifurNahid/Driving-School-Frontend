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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white p-10 rounded-xl shadow-lg text-center space-y-6 border border-gray-100">
          <CardHeader className="space-y-3 p-0">
            {isSuccess ? (
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            ) : (
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <CircleAlert className="h-8 w-8" />
              </div>
            )}
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {isSuccess ? "Payment Successful" : "Payment Failed"}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {isSuccess
                ? "Your purchase is confirmed."
                : "We could not process your payment. Please try again."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-0">
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              {state.transactionId && <span>Transaction #{state.transactionId}</span>}
              {typeof state.amount === "number" && <span>Amount: ${state.amount.toFixed(2)} CAD</span>}
            </div>
            <Separator className="bg-gray-200" />
            <div className="space-y-2 text-sm text-gray-600">
              <p>Your purchase is confirmed.</p>
              <p>If it failed, you can return to the course and retry checkout.</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center p-0">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              onClick={() => navigate("/learner/courses")}
              className="gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
            >
              <ShoppingBag className="h-4 w-4" />
              My Courses
            </Button>
            {state.courseId && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/course/${state.courseId}`)}
                className="gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
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
