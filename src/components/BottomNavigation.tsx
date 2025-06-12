
import { BookOpen, Mic, PenTool, User, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      icon: BookOpen,
      label: "Library",
      path: "/library"
    },
    {
      icon: PenTool,
      label: "Write",
      path: "/write"
    },
    {
      icon: Calendar,
      label: "Daily",
      path: "/daily"
    },
    {
      icon: Mic,
      label: "Recite",
      path: "/recite"
    },
    user ? {
      icon: User,
      label: "Profile",
      path: "/profile"
    } : {
      icon: User,
      label: "Sign In",
      path: "/login"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-purple-100 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive 
                  ? "text-purple-600 bg-purple-50" 
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              )}
            >
              <item.icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
