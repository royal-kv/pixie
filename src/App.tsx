import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSession } from './hooks/useSession';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateGamePage from './pages/CreateGamePage';
import AppShell from './components/layout/AppShell';

export type Page = 'dashboard' | 'create';

function App() {
  const { user, signIn, signOut } = useAuth();
  const { session, updateSession, resetSession, openSession } = useSession();
  const [page, setPage] = useState<Page>('create');

  if (!user) {
    return <LoginPage onSignIn={signIn} />;
  }

  function handleNewGame() {
    resetSession();
    setPage('create');
  }

  function handleOpenSession(id: string) {
    openSession(id);
    setPage('create');
  }

  return (
    <AppShell
      page={page}
      onNavigate={setPage}
      email={user.email}
      onSignOut={signOut}
      title={page === 'dashboard' ? 'Dashboard' : 'Create game'}
    >
      {page === 'dashboard' ? (
        <DashboardPage onOpenSession={handleOpenSession} onNewGame={handleNewGame} />
      ) : (
        <CreateGamePage session={session} updateSession={updateSession} onStartNew={handleNewGame} />
      )}
    </AppShell>
  );
}

export default App;
