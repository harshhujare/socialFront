// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import api from "../lib/api";
// import { useWindowScroll } from "react-use";
// import { useRef } from "react";
// import { useAuth } from "../../context/authcontext";
// import Btn from "./Btn";
// import { hasPermission } from "../lib/permissions";

// const Nav = () => {
//   const { y: currentScrollY } = useWindowScroll();
//   const [lastScroll, setLastScroll] = useState(0);
//   const [isVisible, setIsVisible] = useState(true);
//   const { IsLoggedIn, SetIsLoggedIn, user } = useAuth();
//   const navRef = useRef(null);
//   const [canAddBlog, setCanAddBlog] = useState(false);

//   const checkLogin = async () => {
//     try {
//       const res = await api.get("/auth/check");
//       SetIsLoggedIn(res.data.loggedIn);
//     } catch (error) {
//       SetIsLoggedIn(false);
//     }
//   };

//   // Check if user can add blog
//   useEffect(() => {
//     const checkAddBlogPermission = async () => {
//       // Only check if user is logged in and has a role
//       if (!IsLoggedIn || !user?.role) {
//         setCanAddBlog(false);
//         return;
//       }

//       try {
//         // console.log('Checking addBlog permission for role:', user.role);
//         const canAdd = await hasPermission(user.role, 'addBlog');
//         console.log('Can add blog:',user.role, canAdd);
//         setCanAddBlog(canAdd);
//       } catch (error) {
//         console.error('Error checking add blog permission:', error);
//         setCanAddBlog(false);
//       }
//     };

//     checkAddBlogPermission();
//   }, [IsLoggedIn, user]);  // Depend on the entire user object to ensure it runs when user data changes

//   useEffect(() => {
    

//     if (currentScrollY === 0) {
//       setIsVisible(false);
//       navRef.current?.classList.remove("translate-y-[-100%]");
//     } else if (currentScrollY > lastScroll) {
//       setIsVisible(false);
//       navRef.current?.classList.add("translate-y-[-100%]");
//     } else if (currentScrollY < lastScroll) {
//       setIsVisible(true);
//       navRef.current?.classList.remove("translate-y-[-100%]");
//     }
//     setLastScroll(currentScrollY);
//   }, [currentScrollY, lastScroll]);

//   return (
//     <>
//       <div
//         ref={navRef}
//         className={`fixed inset-x-0 top-4 h-14 rounded z-50 border-none transition-all duration-700 sm:inset-x-6 bg-black
//           ${!isVisible ? 'bg-transparent' : 'bg-black'}
//         }`}
//       >
//         <nav className="flex justify-between items-center">
//           <div className="flex p-2 ">
//             <img src="./assets/logo.png" alt="" className="w-10 " />
//           </div>
//           <div className="flex py-3 px-2 text-white items-center justify-center gap-8">
//             <Link to="/"> Home</Link>
//             {canAddBlog && <Link to="/Add"> Post</Link>}

//             {!IsLoggedIn ? (
//               <Link to="/Signup">
//                 {" "}
//                 <Btn tital="Signup" />
//               </Link>
//             ) : (
//               <>
//               <Link to="/chat"> Messages</Link>
//               <Link to={`/Account/${user?._id}`}>Account</Link></>
              
//             )}
//           </div>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Nav;
