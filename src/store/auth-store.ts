import { create } from "zustand";

export type PortalRole = "admin" | "doctor" | "lab" | "medical" | "patient";

interface AuthenticatedUser {
  name: string;
  email: string;
  role: PortalRole;
  id?: string;
}

interface AuthState {
  isLoginPageOpen: boolean;
  openLoginPage: () => void;
  closeLoginPage: () => void;

  selectedRole: PortalRole;
  setSelectedRole: (role: PortalRole) => void;

  isLoggingIn: boolean;
  setIsLoggingIn: (v: boolean) => void;

  loginError: string;
  setLoginError: (err: string) => void;

  isAuthenticated: boolean;
  authenticatedRole: PortalRole | null;
  authenticatedUser: AuthenticatedUser | null;

  loginWithCredentials: (email: string, password: string) => boolean;
  loginWithPatientId: (patientId: string, patientName: string, patientEmail: string) => boolean;
  logout: () => void;
}

interface DemoCredential {
  email: string;
  password: string;
  name: string;
  id?: string;
}

const DEMO_CREDENTIALS: Record<string, DemoCredential> = {
  admin: {
    email: "admin@gmail.com",
    password: "admin123",
    name: "Super Admin",
  },
  doctor: {
    email: "doctor@gmail.com",
    password: "doctor123",
    name: "Dr. Raj Sharma",
    id: "DOC-1001",
  },
  lab: {
    email: "lab@globalclinic.com",
    password: "Lab@123",
    name: "Global Diagnostic Lab",
    id: "LAB-1001",
  },
  medical: {
    email: "medical@globalclinic.com",
    password: "medical123",
    name: "Medical Store Manager",
  },
};

function detectRoleByEmail(email: string): PortalRole | null {
  const normalized = email.toLowerCase().trim();
  for (const [role, cred] of Object.entries(DEMO_CREDENTIALS)) {
    if (normalized === cred.email.toLowerCase()) {
      return role as PortalRole;
    }
  }
  return null;
}

export function isPatientId(value: string): boolean {
  return /^PAT-\d{4}$/i.test(value.trim());
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoginPageOpen: false,
  selectedRole: "admin" as PortalRole,
  isLoggingIn: false,
  loginError: "",
  isAuthenticated: false,
  authenticatedRole: null,
  authenticatedUser: null,

  openLoginPage: () => set({ isLoginPageOpen: true, loginError: "", selectedRole: "admin" }),
  closeLoginPage: () => set({ isLoginPageOpen: false, loginError: "", isLoggingIn: false }),

  setSelectedRole: (role) => set({ selectedRole: role, loginError: "" }),
  setIsLoggingIn: (v) => set({ isLoggingIn: v }),
  setLoginError: (err) => set({ loginError: err }),

  loginWithCredentials: (email, password) => {
    const role = detectRoleByEmail(email);
    if (!role) {
      set({ loginError: "Invalid email or password", isLoggingIn: false });
      return false;
    }

    const demo = DEMO_CREDENTIALS[role];
    if (password !== demo.password) {
      set({ loginError: "Invalid email or password", isLoggingIn: false });
      return false;
    }

    set({
      isAuthenticated: true,
      authenticatedRole: role as PortalRole,
      authenticatedUser: {
        name: demo.name,
        email: demo.email,
        role: role as PortalRole,
        id: demo.id,
      },
      isLoginPageOpen: false,
      loginError: "",
      isLoggingIn: false,
    });
    return true;
  },

  loginWithPatientId: (patientId, patientName, patientEmail) => {
    set({
      isAuthenticated: true,
      authenticatedRole: "patient",
      authenticatedUser: {
        name: patientName,
        email: patientEmail,
        role: "patient",
        id: patientId,
      },
      isLoginPageOpen: false,
      loginError: "",
      isLoggingIn: false,
    });
    return true;
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
