import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "../src/lib/api";
import { useNavigate } from "react-router-dom";

const Authcontext = createContext();

export const AuthProvider = ({ children },get) => {
  const navigate = useNavigate();
const [Socket, setSocket] = useState(null)
  const [blogcount, setBlogCount] = useState(0);
  const [userid, setUserId] = useState(null);
  const [IsLoggedIn, SetIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem("isLoggedIn");
    return stored === "true";
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    let parsed = null;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch (e) {
        parsed = null; 
      }
    }
    return parsed;
  });

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
    }
  }, [user]);
 
 
 
  useEffect(() => {
    const checkAuth = async () => {
      if (!IsLoggedIn) return;
      try {
        const res = await api.get("/auth/check");
        if (res?.data?.loggedIn && res?.data?.user) {
          setUser(res.data.user);
          connectSocket();

        } else {
          SetIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.log("auth check error", err?.message || err);
        SetIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);
  useEffect(() => {
    localStorage.setItem("isLoggedIn", IsLoggedIn);
    localStorage.setItem("user", JSON.stringify(user));
  }, [IsLoggedIn, user]);
//=================//
   const login = async (email, password) => {
    try {
      console.log("context",IsLoggedIn)
      const res = await api.post(
        "/user/Login",
        {
          email,
          password
        }
      );
      if (res.data.success) {
        SetIsLoggedIn(true);
        setUser(res.data.user); // Update user state with user data from response
        navigate("/");
        connectSocket();
      }
    } catch (err) {
      console.log("error is error", err);
    }
   }

   //----------=============----------//
  const signup = async (fullname, email, password) => {
    try {
     
      const res = await api.post(
        "/user/signup",
        { fullname, email, password }
      );
     
      if (res.data.success) {
        setUser(res.data.user);
        SetIsLoggedIn(true);
        return { success: true };
        connectSocket();

      }
      return { success: false, message: res.data.error };
    } catch (err) {
      console.log("error is error", err);
      if (err?.response?.data?.error === "DUPLICATE_EMAIL") {
        return { success: false, message: "Email already exists. Please use a different email." };
      }
      return { success: false, message: err?.response?.data?.error || "Signup failed" };
    }

  };
  const handelLogout = async () => {
    try {
      const res = await api.get("/user/logout");
      if (res.data.success) {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        disconnectSocket();
        setUser(null);
        SetIsLoggedIn(false);
        setUserId(null);
        navigate("/");
      }
    } catch (err) {
      console.log("error is error", err);
      
    }
  };
const  connectSocket =()=>{



}
const  disconnectSocket =()=>{



}
  
  const value = useMemo(
    () => ({
      IsLoggedIn,
      user,
      signup,
      SetIsLoggedIn,
      blogcount,
      setBlogCount,
      userid,
      setUserId,
      handelLogout,
      login,
    }),
    [IsLoggedIn, user]
  );
  return <Authcontext.Provider value={value}>{children}</Authcontext.Provider>;
};
export const useAuth = () => useContext(Authcontext);
