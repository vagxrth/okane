import { 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Users, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
  
interface User {
  id: string;
  name: string;
  email: string;
}
  
interface DashboardSidebarProps {
  users: User[];
  onTransferClick: (user: User) => void;
}
  
export const DashboardSidebar = ({ users, onTransferClick }: DashboardSidebarProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      {/* Toggle Button */}
      <button
        className={clsx(
          "fixed z-50 top-1/2 -translate-y-1/2 left-5 p-4 rounded-full shadow-xl glass-morphism bg-gradient-to-br from-primary/90 to-primary text-white",
          "transition-all duration-300 hover:scale-110 ring-2 ring-primary/50 border-2 border-white/20",
        )}
        aria-label={open ? "Close user sidebar" : "Open user sidebar"}
        onClick={() => setOpen((v) => !v)}
        style={{ boxShadow: "0 4px 16px 0 rgb(155 135 245 / 60%)" }}
      >
        {open ? <ToggleLeft className="w-7 h-7" /> : <ToggleRight className="w-7 h-7" />}
      </button>
  
      {/* Sidebar Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
        tabIndex={-1}
      />
  
      {/* Sliding Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-[22rem] max-w-[90vw] flex flex-col",
          "bg-gradient-to-tr from-[#1a1f2c]/90 via-[#23233c]/90 to-[#9b87f5]/30 dark:bg-[#23233c]/80 backdrop-blur-xl border-r border-primary/15 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ boxShadow: "rgba(155, 135, 245, 0.18) 0px 8px 32px" }}
        aria-label="Choose user to send money"
        tabIndex={open ? 0 : -1}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-7 py-7 border-b border-white/10 bg-gradient-to-r from-[#1a1f2c]/80 via-transparent to-white/5">
          <Users className="w-6 h-6 text-primary" />
          <span className="font-extrabold text-lg text-white tracking-tight drop-shadow text-gradient-primary">All Users</span>
        </div>

        <SidebarContent className="flex-1 overflow-y-auto scrollbar-none p-0 bg-transparent">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {users.map((user) => (
                  <SidebarMenuItem key={user.id}>
                    <SidebarMenuButton
                      className="w-full !rounded-xl bg-gradient-to-tr from-[#23233c]/70 via-[#292b41]/45 to-[#9b87f5]/20 shadow-md hover:scale-[1.04] transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 border border-white/10 my-3 px-6 py-4"
                      onClick={() => onTransferClick(user)}
                    >
                      <span className="text-base font-semibold text-white tracking-tight drop-shadow">{user.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User count, prettified */}
        <div className="py-6 px-7 border-t border-white/10 bg-gradient-to-r from-[#1a1f2c]/70 via-[#23233c]/50 to-transparent flex items-center justify-end">
          <span className="inline-flex items-center gap-2 bg-gradient-to-tr from-primary/70 to-[#9b87f5]/60 text-white font-bold px-4 py-1 rounded-full shadow backdrop-blur-lg ring-1 ring-white/20 text-sm">
            <Users className="w-4 h-4 text-white/90" />
            {users.length === 1 ? "1 user" : `${users.length} users`}
          </span>
        </div>
      </aside>
    </>
  );
};