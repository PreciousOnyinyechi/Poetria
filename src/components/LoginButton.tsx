
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      navigate("/login");
    }
  };

  return (
    <Button 
      onClick={handleAuth} 
      variant="outline" 
      size="sm"
      className="flex items-center gap-2"
    >
      {user ? (
        <>
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          <span className="hidden md:inline">Sign In</span>
        </>
      )}
    </Button>
  );
};

export default LoginButton;
