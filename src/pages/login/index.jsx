// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import LoginHeader from './components/LoginHeader';
// import LoginForm from './components/LoginForm';
// import LoginFooter from './components/LoginFooter';
// import LoginBackground from './components/LoginBackground';
// import { toast } from "sonner";
// import { supabase } from 'lib/supabase';

// const LoginPage = () => {
//   const navigate = useNavigate();


// useEffect(() => {
//   const checkSession = async () => {
//     const { data } = await supabase.auth.getSession();
//     if (data.session) {
//       navigate("/dashboard");
//     }
//   };

//   checkSession();
// }, [navigate]);


//   return (
//     <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
//       {/* Background Elements */}
//       <LoginBackground />
      
//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-md">
//         {/* Login Card */}
//         <div className="bg-card border border-border rounded-xl elevation-3 p-8">
//           <LoginHeader />
//           <LoginForm />
//           <LoginFooter />
//         </div>
//       </div>

//       {/* Additional Background Overlay for Mobile */}
//       <div className="absolute inset-0 bg-background/50 backdrop-blur-sm lg:hidden"></div>
//     </div>
//   );
// };

// export default LoginPage;















import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import LoginFooter from "./components/LoginFooter";
import LoginBackground from "./components/LoginBackground";
import { useAuth } from "context/AuthContext";
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  // 👇 where to go after login
  const from = location.state?.from || "/";

  useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }
  }, [session, navigate, from]);

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card border border-border rounded-xl elevation-3 p-8">
          <LoginHeader />
          <LoginForm />
          <LoginFooter />
        </div>
      </div>

      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm lg:hidden"></div>
    </div>
  );
};

export default LoginPage;
