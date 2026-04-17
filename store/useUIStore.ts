import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  currentView: 'chat' | 'security' | 'enterprise' | 'settings';
  isAuthenticated: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setCurrentView: (view: 'chat' | 'security' | 'enterprise' | 'settings') => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  currentView: 'chat',
  isAuthenticated: !!localStorage.getItem('creible_session'),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setCurrentView: (view) => set({ currentView: view }),
  setIsAuthenticated: (isAuthenticated) => {
    if (isAuthenticated) {
      localStorage.setItem('creible_session', 'true');
    } else {
      localStorage.removeItem('creible_session');
    }
    set({ isAuthenticated });
  },
  logout: () => {
    localStorage.removeItem('creible_session');
    set({ isAuthenticated: false, currentView: 'chat' });
  }
}));
