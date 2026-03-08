import { Search, Bell } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface AdminHeaderProps {
  title: string;
  subtitle: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { user } = useAuth();

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "";
  };

  return (
    <header className="flex items-center justify-between bg-[#ffffff] border-b border-[#f3f1f1] px-8 py-4 z-10 sticky top-0">
      <div className="flex flex-col">
        <h2 className="text-[#1e1414] text-xl font-bold leading-tight">
          {title}
        </h2>
        <p className="text-[#806b6b] text-sm font-normal mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#806b6b]">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search orders, items..."
            className="w-full bg-[#f3f1f1] border-transparent rounded-lg pl-10 pr-4 py-2 text-sm text-[#1e1414] placeholder-[#806b6b] focus:ring-2 focus:ring-[#7b2d2d] focus:outline-none transition-all"
          />
        </div>

        <button className="relative p-2 rounded-lg bg-[#f3f1f1] hover:bg-gray-200 text-[#1e1414] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#7b2d2d] rounded-full border-2 border-[#ffffff]"></span>
        </button>

        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-[#f3f1f1] cursor-pointer shrink-0">
          <div className="w-full h-full bg-[#1B4332] flex items-center justify-center text-white font-bold">
            {getInitials()}
          </div>
        </div>
      </div>
    </header>
  );
}
