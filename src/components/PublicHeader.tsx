import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { RootState } from "@/redux/store";
import { logout } from '@/redux/actions/authAction';

const PublicHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate("/login");
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "transition-colors font-medium",
      isActive 
        ? "text-blue-600" 
        : "text-foreground hover:text-blue-600"
    );

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "block py-2 text-lg text-foreground transition-colors hover:text-blue-600",
      isActive && "text-blue-600 font-semibold"
    );

  return (
    <header className="bg-background/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <NavLink to="/">Fast Track Drivers Academy</NavLink>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={getLinkClass} end>Home</NavLink>
            <NavLink to="/about" className={getLinkClass}>About</NavLink>
            <NavLink to="/contact" className={getLinkClass}>Contact</NavLink>
            <NavLink to="/courses" className={getLinkClass}>Browse Courses</NavLink>
            {/* <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink> */}
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-4">
              {userInfo ? (
                <>
                  <Button
                    variant="ghost"
                    className="font-medium"
                    onClick={() => navigate("/learner/profile")}
                  >
                    <img
                      src={userInfo.user_detail?.image_path || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo.first_name+" "+userInfo.last_name)}
                      alt="avatar"
                      className="w-8 h-8 rounded-full mr-2 inline-block"
                    />
                    
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="font-medium">
                    <NavLink to="/login">Sign In</NavLink>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium">
                    <NavLink to="/register">Get Started</NavLink>
                  </Button>
                </>
              )}
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col h-full py-6">
                    <nav className="flex flex-col space-y-4">
                      <SheetClose asChild>
                        <NavLink to="/" className={mobileLinkClass} end>Home</NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/about" className={mobileLinkClass}>About</NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/contact" className={mobileLinkClass}>Contact</NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/courses" className={mobileLinkClass}>Browse Courses</NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/admin" className={mobileLinkClass}>Dashboard</NavLink>
                      </SheetClose>
                    </nav>
                    <div className="mt-auto space-y-2">
                      {userInfo ? (
                        <>
                          <SheetClose asChild>
                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-center"
                              onClick={() => navigate("/learner/profile")}>
                            
                              <img
                                src={userInfo.user_detail?.image_path || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo.first_name+" "+userInfo.last_name)}
                                alt="avatar"
                                className="w-8 h-8 rounded-full mr-2 inline-block"
                              />
                              
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button
                              onClick={handleLogout}
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium"
                            >
                              Log Out
                            </Button>
                          </SheetClose>
                        </>
                      ) : (
                        <>
                          <SheetClose asChild>
                            <Button variant="outline" asChild className="w-full">
                              <NavLink to="/login">Sign In</NavLink>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium">
                              <NavLink to="/register">Get Started</NavLink>
                            </Button>
                          </SheetClose>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default PublicHeader;