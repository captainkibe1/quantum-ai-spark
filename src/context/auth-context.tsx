import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: "admin-1",
    email: "me@admin.com",
    name: "Admin User",
    isAdmin: true
  }
];

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("ai-chat-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("ai-chat-user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(r => setTimeout(r, 1000));

    // Admin login (hardcoded credentials)
    if (email === "me@admin.com" && password === "admin.me@25") {
      const adminUser = MOCK_USERS.find(u => u.email === email);
      if (adminUser) {
        setUser(adminUser);
        localStorage.setItem("ai-chat-user", JSON.stringify(adminUser));
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        });
        setLoading(false);
        return true;
      }
    }

    // Check other users
    try {
      const storedUsers = localStorage.getItem("ai-chat-registered-users");
      const registeredUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = registeredUsers.find(u => u.email === email);
      
      if (foundUser) {
        // In a real app, we'd hash passwords and not store them in plaintext
        // This is just for demo purposes
        const storedPasswords = localStorage.getItem("ai-chat-user-passwords");
        const passwords = storedPasswords ? JSON.parse(storedPasswords) : {};
        
        if (passwords[email] === password) {
          setUser(foundUser);
          localStorage.setItem("ai-chat-user", JSON.stringify(foundUser));
          toast({
            title: "Login successful",
            description: `Welcome back, ${foundUser.name}!`,
          });
          setLoading(false);
          return true;
        }
      }
      
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(r => setTimeout(r, 1000));

    // Check if email is already taken (including admin account)
    if (MOCK_USERS.some(u => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "This email is already in use",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    try {
      // Get existing users or initialize empty array
      const storedUsers = localStorage.getItem("ai-chat-registered-users");
      const existingUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email already exists
      if (existingUsers.some(u => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "This email is already in use",
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        isAdmin: false
      };
      
      // Save user to "database"
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("ai-chat-registered-users", JSON.stringify(updatedUsers));
      
      // Store password (In a real app, passwords should be hashed)
      const storedPasswords = localStorage.getItem("ai-chat-user-passwords");
      const passwords = storedPasswords ? JSON.parse(storedPasswords) : {};
      passwords[email] = password;
      localStorage.setItem("ai-chat-user-passwords", JSON.stringify(passwords));
      
      // Log in the new user
      setUser(newUser);
      localStorage.setItem("ai-chat-user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ai-chat-user");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a UserAuthProvider");
  }
  return context;
};
