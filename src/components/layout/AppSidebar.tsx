import { LayoutDashboard, Sparkles, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Page } from '@/App';

interface Props {
  page: Page;
  onNavigate: (page: Page) => void;
  email: string;
  onSignOut: () => void;
}

export default function AppSidebar({ page, onNavigate, email, onSignOut }: Props) {
  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand)] text-[var(--brand-foreground)] font-black text-sm">
            P
          </span>
          <div className="leading-tight">
            <p className="font-semibold tracking-tight">Pixie</p>
            <p className="text-[11px] text-muted-foreground">AI Game Studio</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton isActive={page === 'dashboard'} onClick={() => onNavigate('dashboard')}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={page === 'create'} onClick={() => onNavigate('create')}>
              <Sparkles />
              <span>Create game</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="gap-2 px-3 pb-3">
        <div className="flex items-center gap-2 rounded-md px-1 py-1.5">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">{email.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        </div>
        <Button variant="ghost" size="sm" className="justify-start gap-2 px-1" onClick={onSignOut}>
          <LogOut className="size-4" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
