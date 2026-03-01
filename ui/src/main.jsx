import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Link,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { LayoutDashboard, Database, Activity, Settings, Zap } from 'lucide-react'
import './index.css'

const queryClient = new QueryClient()

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <aside className="sidebar">
        <div style={{ padding: '0 16px', marginBottom: '48px' }}>
          <h1 className="gradient-text" style={{ fontSize: '24px', margin: 0 }}>OffTrack</h1>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Edge Framework</p>
        </div>
        
        <nav>
          <Link to="/" className="nav-item">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/api-explorer" className="nav-item">
            <Activity size={20} /> API Explorer
          </Link>
          <Link to="/database" className="nav-item">
            <Database size={20} /> Collections
          </Link>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '24px 16px' }} />
          <Link to="/settings" className="nav-item">
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  ),
})

// Dashboard Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
})

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ todos { text } }' }),
      })
      const result = await response.json()
      return result.data.todos
    },
  })

  return (
    <div>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 700 }}>Overview</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Systems are operational</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', padding: '8px 16px', borderRadius: '30px', color: '#22c55e', fontSize: '14px', fontWeight: 600 }}>
          <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} className="ping-animate" />
          Live Connection
        </div>
      </header>

      <div className="stat-grid">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Total Records</span>
            <Database size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>1,284</div>
          <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '8px' }}>+12% from last sync</div>
        </div>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>API Latency</span>
            <Zap size={18} color="#a855f7" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>12ms</div>
          <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '8px' }}>Optimized cache</div>
        </div>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Sync Jobs</span>
            <Activity size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>Active</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Next run in 2m</div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ margin: '0 0 24px 0' }}>GraphQL Bridge Verification</h3>
        {isLoading ? (
          <p>Loading bridge data...</p>
        ) : (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>Status Response:</p>
            <code style={{ color: '#a855f7' }}>{data?.[0]?.text}</code>
          </div>
        )}
      </div>
    </div>
  )
}

// Route tree
const routeTree = rootRoute.addChildren([indexRoute])
const router = createRouter({ routeTree })

const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}
