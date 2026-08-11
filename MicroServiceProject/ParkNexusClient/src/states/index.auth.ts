import {create} from "zustand";

interface IAuthState {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<IAuthState>(set => ({
    isAuthenticated: false,
    setIsAuthenticated: isAuthenticated => set({isAuthenticated}),
}));
