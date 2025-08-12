import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// axios usage moved into auth context via api client
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
const Signup = () => {
  const { SetIsLoggedIn, signup } = useAuth();
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowpass] = useState(false);
  const navigate = useNavigate();

  const handelsubmit = async (e) => {
    e.preventDefault();

    if (!Name || !Email || !Password || error) {
      setError("invalid details, plese fill details properly");
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
    }
  };

  const validatePassword = (value) => {
    if (value.length === 0) return setError("");
    if (value.length < 4) return "Password must be at least 4 characters";
    if (!/[A-Z]/.test(value)) return "Must include an uppercase letter";
    if (!/[1-9]/.test(value)) return "Must include an Number";
    if (value.includes(" ")) return "Password must not contain spaces";
    return "";
  };

  const handelChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError(validatePassword(value));
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
            setEmail(e.target.value);
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
        {error && <p className="text-red-600">{error}</p>}
        {!error && Password && <p className="text-green-600">valid password</p>}

        <button
          type="submit"
          onClick={handelsubmit}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-md transition"
        >
          Signup
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
