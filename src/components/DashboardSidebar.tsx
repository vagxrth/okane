import { 
    Sidebar, 
    SidebarContent,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
  } from "@/components/ui/sidebar";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { Users } from "lucide-react";
  
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
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-2">
              <SidebarGroupLabel className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </SidebarGroupLabel>
              <SidebarTrigger />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {users.map((user) => (
                  <SidebarMenuItem key={user.id}>
                    <SidebarMenuButton 
                      className="w-full"
                      onClick={() => onTransferClick(user)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-medium">{user.name}</span>
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
      </Sidebar>
    );
  };