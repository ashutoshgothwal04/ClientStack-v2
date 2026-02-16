import { supabase } from "lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";


const AuthContext = createContext();        
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        // 🔥 Auto run pending action after login
        if (session && pendingAction) {
          pendingAction();
          setPendingAction(null);
          toast.success("Action completed 🚀");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [pendingAction]);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful 🎉");
    }
  };

  const register = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created 🎉");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        register,
        logout,
        setPendingAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
