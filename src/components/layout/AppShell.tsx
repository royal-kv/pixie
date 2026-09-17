import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import AppSidebar from './AppSidebar';
import type { Page } from '@/App';

interface Props {
  page: Page;
  onNavigate: (page: Page) => void;
  email: string;
  onSignOut: () => void;
  title: string;
  children: ReactNode;
}

export default function AppShell({ page, onNavigate, email, onSignOut, title, children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar page={page} onNavigate={onNavigate} email={email} onSignOut={onSignOut} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <h1 className="text-sm font-medium">{title}</h1>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
