import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode is intentionally omitted: its dev-only double-invoked effects would double-fire
// paid Anthropic API calls (e.g. building all 3 games) on every mount.
createRoot(document.getElementById('root')!).render(<App />)
