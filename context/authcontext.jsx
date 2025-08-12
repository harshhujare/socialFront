import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "../src/lib/api";
import { useNavigate } from "react-router-dom";

const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

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
      if (IsLoggedIn && !user) {
        try {
          const res = await api.get("/auth/check");
          setUser(res.data.user);

          
        } catch (err) {
          console.log("got error");
          SetIsLoggedIn(false);
        }
      }
    };

    checkAuth();
  }, [IsLoggedIn]);
  useEffect(() => {
    localStorage.setItem("isLoggedIn", IsLoggedIn);
    localStorage.setItem("user", JSON.stringify(user));
  }, [IsLoggedIn, user]);

  
  const signup = async (fullname, email, password) => {
    try {
      console.log("net");
      const res = await api.post(
        "/user/signup",
        { fullname, email, password }
      );
      console.log("first");
      if (res.data.success) {
        setUser(res.data.user);
        SetIsLoggedIn(true);
        return { success: true };
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
        setUser(null);
        SetIsLoggedIn(false);
        setUserId(null);
        navigate("/");
      }
    } catch (err) {
      console.log("error is error", err);
      
    }
  };

  
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
    }),
    [IsLoggedIn, user]
  );
  return <Authcontext.Provider value={value}>{children}</Authcontext.Provider>;
};
export const useAuth = () => useContext(Authcontext);
