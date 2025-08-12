import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext"; 



const Login = () => {
const{SetIsLoggedIn}=useAuth();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const[loggingin,setloggingin]=useState(false);
  const[showPass,setShowpass]=useState(false);
  const navigate = useNavigate();

  const handelsubmit = async (e, validatePassword) => {
    e.preventDefault();
  setloggingin(true);
   
    if (!Email || !Password) {
      setError("invalid details, plese fill details properly");
      setloggingin(false);
      return;
    }
 
    try {
      const res = await api.post(
        "/user/Login",
        {
          email: Email,
          password: Password,
        }
      );
      if (res.data.success) {
        SetIsLoggedIn(true);
        navigate("/");
      }
 
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      console.log(error);
      const backendError = error?.response?.data;
 
      if (backendError?.message === "Wrong_Email_Password") {
        setError("wrong email or password try again");
      } else if (backendError?.message === "Validation_failed") {
        setError("server error try again");
      } else {
        setError("something went wrong, please try again");
      }
    } finally {
      setloggingin(false);
    }
    // if (validatePassword) {
    //   setError(error);
    // } 
   
  };

//   const validatePassword = (value) => {
//     if (value.length === 0) return setError("");
//     if (value.length < 4) return "Password must be at least 4 characters";
//     if (!/[A-Z]/.test(value)) return "Must include an uppercase letter";
//     if (!/[1-9]/.test(value)) return "Must include an Number";
//     if(value.includes(" ")) return "Password must not contain spaces";
//     return "";
//   };

//   const handelChange = (e) => {
//     const value = e.target.value;
//     ;
    // setError(validatePassword(value));
//   };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] relative overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8  ">
     
        <input
          value={Email}
          type="email"
          placeholder="Email"
          className="w-full mb-8 px-4 my-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div  className="w-full  mb-8  flex justify-between my-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition">
        <input
          value={Password}
          type={showPass ? "text" : "password"}
          placeholder="password"
          required
          className="pl-4 pr-28 py-2 border-none outline-none"
          onChange={(e)=>{setPassword(e.target.value)}}
        />
        <span onClick={()=>setShowpass(!showPass)} className="cursor-pointer flex items-center justify-center px-4 py-2 text-gray-500">
            {showPass ? <FaEyeSlash/> : <FaEye />}
        </span>
        </div>
        {error && <p className="text-red-600">{error}</p>}
         {/* {!error &&Password&& <p className="text-green-600">valid password</p>} */}
        
        <button
          type="submit"
          onClick={handelsubmit}
          disabled={loggingin}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-80 text-white font-semibold rounded-md shadow-md transition"
        >
          {loggingin ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
        <div className=" mt-8 text-center" >Don't have any account? <Link className="text-blue-500" to="/Signup">Signup here</Link> </div>
      </div>
    </div>
  );
};

export default Login;
