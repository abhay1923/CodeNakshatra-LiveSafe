import React, { useState, useEffect } from 'react'
import {
  Shield, LayoutDashboard, Map as MapIcon, Zap,
  BarChart3, Settings, LogOut, Search, Bell, Menu,
  AlertTriangle, Siren, Activity, Brain, Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/hooks/useAuth'
import type { Screen, UserRole } from '@/types'

import HotspotMap from '@/components/HotspotMapNew'
import Dashboard from '@/components/new-ui/Dashboard'
import Simulation from '@/components/new-ui/Simulation'
import Reports from '@/components/new-ui/Reports'
import SettingsPage from '@/components/new-ui/SettingsPage'
import LandingPage from '@/components/new-ui/LandingPage'

// ---- Nav config ----
// internal = rendered inside this shell | external = full route navigation
interface NavItemConfig {
  icon: React.ReactNode
  label: string
  key: Screen
  roles: UserRole[]
  route?: string  // if set, navigate to this route instead of switching internal screen
}

const ALL_NAV_ITEMS: NavItemConfig[] = [
  { icon: <LayoutDashboard />, label: 'Dashboard',        key: 'dashboard',  roles: ['citizen', 'police', 'admin'] },
  { icon: <MapIcon />,         label: 'Map Analysis',     key: 'hotspot',    roles: ['citizen', 'police', 'admin'] },
  { icon: <Zap />,             label: 'Prediction Models',key: 'simulation', roles: ['citizen', 'police', 'admin'] },
  { icon: <BarChart3 />,       label: 'Reports',          key: 'reports',    roles: ['citizen', 'police', 'admin'] },
  { icon: <AlertTriangle />,   label: 'Report Incident',  key: 'report',     roles: ['citizen'],             route: '/report' },
  { icon: <Siren />,           label: 'SOS Alerts',       key: 'sos',        roles: ['police', 'admin'],     route: '/sos' },
  { icon: <Activity />,        label: 'Analytics',        key: 'analytics',  roles: ['police', 'admin'],     route: '/analytics' },
  { icon: <Brain />,           label: 'ML Dashboard',     key: 'ml',         roles: ['admin'],               route: '/ml' },
  { icon: <Users />,           label: 'User Management',  key: 'users',      roles: ['admin'],               route: '/users' },
]

const ROLE_LABELS: Record<UserRole, string> = {
  citizen: 'Citizen',
  police:  'Police Officer',
  admin:   'Administrator',
}

const ROLE_COLORS: Record<UserRole, string> = {
  citizen: '#22c55e',
  police:  '#38bdf8',
  admin:   '#f59e0b',
}

// Internal screens only — the ones rendered inside this shell
type InternalScreen = 'dashboard' | 'hotspot' | 'simulation' | 'reports' | 'settings'

export default function NewApp() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [screen, setScreen] = useState<InternalScreen>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Reset to dashboard when user changes (e.g. different account login)
  useEffect(() => {
    setScreen('dashboard')
  }, [user?.id])

  const role = user?.role ?? 'citizen'
  const nav = ALL_NAV_ITEMS.filter(item => item.roles.includes(role))

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const roleColor = ROLE_COLORS[role]

  const handleNavClick = (item: NavItemConfig) => {
    if (item.route) {
      navigate(item.route)
    } else {
      setScreen(item.key as InternalScreen)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':  return <Dashboard />
      case 'hotspot':    return <HotspotMap />
      case 'simulation': return <Simulation />
      case 'reports':    return <Reports />
      case 'settings':   return <SettingsPage />
      default:           return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-slate-900 text-white flex flex-col z-50 shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800 shrink-0">
          <div className="bg-blue-600 p-2 rounded-lg shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <p className="font-bold text-base leading-tight">LiveSafe</p>
              <p className="text-[10px] text-slate-400 leading-tight">CrimePredict AI v5</p>
            </motion.div>
          )}
        </div>

        {/* Role badge */}
        {sidebarOpen && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-3 mt-3 px-3 py-2 rounded-xl border"
            style={{ borderColor: roleColor + '44', background: roleColor + '11' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: roleColor }}>
              {ROLE_LABELS[role]}
            </p>
            <p className="text-xs text-slate-300 truncate mt-0.5">{user.name}</p>
          </motion.div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {nav.map(item => (
            <NavItemButton
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={!item.route && screen === (item.key as InternalScreen)}
              collapsed={!sidebarOpen}
              onClick={() => handleNavClick(item)}
              isExternal={Boolean(item.route)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1 shrink-0">
          <NavItemButton
            icon={<Settings />}
            label="Settings"
            collapsed={!sidebarOpen}
            onClick={() => setScreen('settings')}
            active={screen === 'settings'}
            className="text-slate-400"
          />
          <NavItemButton
            icon={<LogOut />}
            label="Log Out"
            collapsed={!sidebarOpen}
            onClick={handleLogout}
            className="text-slate-400 hover:!text-red-400"
          />
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search cities, incidents, reports..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">
                  {user?.name ?? 'Guest'}
                </p>
                <p className="text-xs mt-0.5 font-medium" style={{ color: roleColor }}>
                  {ROLE_LABELS[role]}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm"
                style={{ background: roleColor }}
              >
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Screen */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function NavItemButton({
  icon, label, active = false, onClick, collapsed = false, className, isExternal = false,
}: {
  icon: React.ReactNode; label: string; active?: boolean
  onClick?: () => void; collapsed?: boolean; className?: string; isExternal?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white',
        className,
      )}
    >
      <div className={cn('shrink-0', active ? 'text-white' : 'text-slate-400 group-hover:text-white')}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      {!collapsed && (
        <span className="font-medium text-sm whitespace-nowrap flex-1 text-left">{label}</span>
      )}
      {!collapsed && isExternal && (
        <span className="text-[9px] font-bold uppercase tracking-wider opacity-40 ml-auto">→</span>
      )}
    </button>
  )
}
