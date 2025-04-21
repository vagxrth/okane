import { 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, User, ToggleLeft, ToggleRight } from "lucide-react";
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
          "fixed z-50 top-1/2 -translate-y-1/2 left-2 p-2 rounded-full shadow-xl",
          "transition-all duration-300 hover:scale-110 ring-2 ring-white/10",
          "bg-[#23233c] dark:bg-[#23233c] text-[#9b87f5]"
        )}
        aria-label={open ? "Close user sidebar" : "Open user sidebar"}
        onClick={() => setOpen((v) => !v)}
        style={{ boxShadow: "0 4px 16px 0 rgba(35, 35, 60, 0.3)" }}
      >
        {open ? <ToggleLeft className="w-6 h-6" /> : <ToggleRight className="w-6 h-6" />}
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
          "fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] flex flex-col bg-white/80 dark:bg-[#23233c]/80 backdrop-blur-xl border-r border-primary/20 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ boxShadow: "rgba(155, 135, 245, 0.2) 0px 8px 32px" }}
        aria-label="Choose user to send money"
        tabIndex={open ? 0 : -1}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-primary/15">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-semibold text-md text-primary">All Users</span>
        </div>
  
        <SidebarContent className="flex-1 overflow-y-auto scrollbar-none p-0 bg-transparent">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {users.map((user) => (
                  <SidebarMenuItem key={user.id}>
                    <SidebarMenuButton
                      className="w-full !rounded-xl transition-all duration-100 hover:bg-primary/10 active:bg-primary/20"
                      onClick={() => onTransferClick(user)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-base font-medium text-primary">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="py-4 px-6 border-t border-primary/10 text-xs text-muted-foreground">
          {users.length} users total
        </div>
      </aside>
    </>
  );
};