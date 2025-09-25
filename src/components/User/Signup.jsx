import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// axios usage moved into auth context via api client
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/authcontext";
const Signup = () => {

  const {IsLoggedIn, SetIsLoggedIn, signup } = useAuth();
  if(IsLoggedIn){
    return <Navigate to="/" />
  }
  const [Name, setName] = useState("");
  const[loggingin,setloggingin]=useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPass, setShowpass] = useState(false);
  const navigate = useNavigate();

  const handelsubmit = async (e) => {
     setloggingin(true);
    e.preventDefault();

    // block submit when any validation error exists
    if (!Name || !Email || !Password || error || emailError) {
      setError(emailError || error || "Invalid details, please fill details properly");
      setloggingin(false);
    } else {
      try {
        const res = await signup(Name, Email, Password);
        if (res.success) {
          setName("");
          setEmail("");
          setPassword("");
          SetIsLoggedIn(true);
          navigate("/");
        } else {
          setError(res.message || "Signup failed");
        }
      } catch (error) {
        setError("Signup failed");
      }
      finally {
      setloggingin(false);
    }
    }
  };

  // Return a string describing the error or empty string if valid
  const validatePassword = (value) => {
    if (value.length === 0) return "";
    if (value.length < 4) return "Password must be at least 4 characters";
    if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must include a number";
    if (value.includes(" ")) return "Password must not contain spaces";
    return "";
  };

  // Email format validation: ensures local@domain.tld with a valid TLD (2+ letters)
  const validateEmail = (value) => {
    if (!value) return "Email is required";
    // local part: any non-space, non-@ chars; domain parts: alnum/hyphen; TLD: letters min 2
    const re = /^[^\s@]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    if (!re.test(value)) return "Enter a valid email (e.g. user@example.com)";
    return "";
  };

  const handelChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const passErr = validatePassword(value);
    setError(passErr);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] relative overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 ">
        <input
          value={Name}
          type="name"
          placeholder="Name"
          className="w-full my-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          required
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          value={Email}
          type="email"
          placeholder="Email"
          className="w-full px-4 my-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          required
          onChange={(e) => {
            const val = e.target.value;
            setEmail(val);
            setEmailError(validateEmail(val));
            // clear global error if email now valid
            if (emailError && !validateEmail(val)) setError("");
          }}
        />
        <div className="w-full flex justify-between my-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition">
          <input
            value={Password}
            type={showPass ? "text" : "password"}
            placeholder="password"
            required
            className="pl-4 pr-28 py-2 border-none outline-none"
            onChange={handelChange}
          />
          <span
            onClick={() => setShowpass(!showPass)}
            className="cursor-pointer flex items-center justify-center px-4 py-2 text-gray-500"
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {/* show email error first, then password/global error */}
        {emailError && <p className="text-red-600">{emailError}</p>}
        {!emailError && error && <p className="text-red-600">{error}</p>}
        {!emailError && !error && Password && <p className="text-green-600">valid password</p>}

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
              signing up...
            </span>
          ) : (
            "signup"
          )}
        </button>
        <div className=" mt-8 text-center">
          Alredy a user?{" "}
          <Link className="text-blue-500" to="/Login">
            {" "}
            Login here
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default Signup;
