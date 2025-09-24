import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authcontext"; // assuming you have a hook

const Protected = () => {
   const { IsLoggedIn} = useAuth(); // or however you expose it
// console.log(IsLoggedIn)

  return IsLoggedIn ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default Protected;
