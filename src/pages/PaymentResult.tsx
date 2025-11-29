import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CircleAlert, Home, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { Separator } from "@/components/ui/separator";
import { useDispatch } from "react-redux";
import { fetchAndAddUserCourse } from "@/redux/actions/userCourseAction";
import { useAuth } from "@/hooks/useAuth";

interface PaymentResultState {
  status?: string;
  transactionId?: number;
  courseId?: number;
  amount?: number;
}

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useAuth();
  const state = (location.state as PaymentResultState) || {};
  const isSuccess = state.status === "succeeded" || state.status === "success";

  // Update Redux state when payment is successful
  useEffect(() => {
    if (isSuccess && state.courseId && userInfo?.id) {
      dispatch(fetchAndAddUserCourse(state.courseId, userInfo.id) as any);
    }
  }, [isSuccess, state.courseId, userInfo?.id, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm border-b border-indigo-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white p-10 rounded-2xl shadow-2xl text-center space-y-6 border border-indigo-100 dark:bg-slate-900/80 dark:border-slate-800">
          <CardHeader className="space-y-4 p-0">
            {isSuccess ? (
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-inner dark:bg-green-950/50 dark:text-green-300">
                <CheckCircle2 className="h-9 w-9" />
              </div>
            ) : (
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-inner dark:bg-red-950/50 dark:text-red-200">
                <CircleAlert className="h-9 w-9" />
              </div>
            )}
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-slate-50">
              {isSuccess ? "Payment Successful" : "Payment Failed"}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm dark:text-slate-300">
              {isSuccess
                ? "Your purchase is confirmed."
                : "We could not process your payment. Please try again."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 p-0">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-slate-300">
              {state.transactionId && <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200">Transaction #{state.transactionId}</span>}
              {typeof state.amount === "number" && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200">
                  Amount: ${state.amount.toFixed(2)} CAD
                </span>
              )}
            </div>
            <Separator className="bg-gray-200 dark:bg-slate-700" />
            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
              <p>{isSuccess ? "Your purchase is confirmed." : "Please retry checkout or use another card."}</p>
              <p>If it failed, you can return to the course and retry checkout.</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center p-0">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button onClick={() => navigate("/learner/profile", { state: { section: 'courses' } })} className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              My Courses
            </Button>
            {state.courseId && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/course/${state.courseId}`)}
                className="gap-2 w-full sm:w-auto bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-3 rounded-lg font-medium transition dark:bg-slate-800 dark:text-indigo-200 dark:hover:bg-slate-700"
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
