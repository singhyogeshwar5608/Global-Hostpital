import { create } from "zustand";

export type PortalRole = "admin" | "doctor" | "lab";

interface AuthState {
  // Login page visibility
  isLoginPageOpen: boolean;
  openLoginPage: () => void;
  closeLoginPage: () => void;

  // Role selection
  selectedRole: PortalRole;
  setSelectedRole: (role: PortalRole) => void;

  // Login loading
  isLoggingIn: boolean;
  setIsLoggingIn: (v: boolean) => void;

  // Error
  loginError: string;
  setLoginError: (err: string) => void;

  // Authenticated user info
  isAuthenticated: boolean;
  authenticatedRole: PortalRole | null;
  authenticatedUser: {
    name: string;
    email: string;
    role: PortalRole;
    id?: string;
  } | null;

  // Login action (handles credential check & dispatches to correct store)
  login: (email: string, password: string, role: PortalRole) => boolean;
  logout: () => void;
}

// Demo credentials
const DEMO_CREDENTIALS: Record<PortalRole, { email: string; password: string; name: string; id?: string }> = {
  admin: {
    email: "admin@globalclinic.com",
    password: "Admin@123",
    name: "Super Admin",
  },
  doctor: {
    email: "doctor@globalclinic.com",
    password: "Doctor@123",
    name: "Dr. Raj Sharma",
    id: "DOC-1001",
  },
  lab: {
    email: "lab@globalclinic.com",
    password: "Lab@123",
    name: "Global Diagnostic Lab",
    id: "LAB-1001",
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoginPageOpen: false,
  openLoginPage: () => set({ isLoginPageOpen: true, loginError: "", selectedRole: "admin" }),
  closeLoginPage: () => set({ isLoginPageOpen: false, loginError: "", isLoggingIn: false }),

  selectedRole: "admin",
  setSelectedRole: (role) => set({ selectedRole: role, loginError: "" }),

  isLoggingIn: false,
  setIsLoggingIn: (v) => set({ isLoggingIn: v }),

  loginError: "",
  setLoginError: (err) => set({ loginError: err }),

  isAuthenticated: false,
  authenticatedRole: null,
  authenticatedUser: null,

  login: (email, password, role) => {
    const demo = DEMO_CREDENTIALS[role];

    if (
      email.toLowerCase().trim() === demo.email.toLowerCase() &&
      password === demo.password
    ) {
      set({
        isAuthenticated: true,
        authenticatedRole: role,
        authenticatedUser: {
          name: demo.name,
          email: demo.email,
          role,
          id: demo.id,
        },
        isLoginPageOpen: false,
        loginError: "",
        isLoggingIn: false,
      });
      return true;
    }

    set({
      loginError: "Invalid Email or Password",
      isLoggingIn: false,
    });
    return false;
  },

  logout: () => {
    set({
      isAuthenticated: false,
      authenticatedRole: null,
      authenticatedUser: null,
      isLoginPageOpen: false,
      loginError: "",
      isLoggingIn: false,
    });
  },
}));
