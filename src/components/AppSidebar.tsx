import { NavLink, useLocation } from "react-router-dom";
import { Home, FileText, ClipboardList, ClipboardCheck, FileSignature, ChartBar, AudioLines } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Stage 1", url: "/stage1", icon: ClipboardList },
  { title: "Stage 2", url: "/stage2", icon: ClipboardCheck },
  { title: "Stage 3", url: "/stage3", icon: FileSignature },
  { title: "Analytics", url: "/analytics", icon: ChartBar },
  { title: "Report", url: "/report", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar collapsible="icon" className="bg-secondary border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>PrimaHealth</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
