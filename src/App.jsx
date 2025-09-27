import React from "react";
import Layout from "./components/UI/Layout";
import Hero from "./components/Hero";
import Signup from "./components/User/Signup";
import Add from  "./components/User/Add"
import Login from "./components/User/Login";
import Account from "./components/User/Account";
import BlogDetail from "./components/User/BlogDetail";
import Dashboard from "./components/Admin/Dashboard";
import Approvels from "./components/Admin/Approvals";
import Permissions from "./components/Admin/permissions";
import Users from "./components/Admin/Users";
import AdminLayout from "./components/Admin/AdminLayout";
import ChatBoard from "./components/User/ChatBoard";
import DebugPermissions from "./components/DebugPermissions";
import { AuthProvider } from "../context/authcontext";
import { ThemeProvider } from "./context/themecontext.jsx";

import Protected from "./Protected";
import { BrowserRouter, Route, Router, Link, Routes } from "react-router-dom";

const App = () => {
 
  return (
    <>
      <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
           <Route path="/Signup" element={<Layout>  <Signup />  </Layout>} />
          <Route path="/Login" element={<Layout><Login />  </Layout>} />
                    <Route path="/" element={<Layout><Hero /></Layout>} />
          <Route element={<Protected/>}>

          <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/users" element={<AdminLayout><Users /></AdminLayout>} />
          <Route path="/dashboard/approvals" element={<AdminLayout><Approvels /></AdminLayout>} />
          <Route path="/dashboard/permissions" element={<AdminLayout><Permissions /></AdminLayout>} />
          <Route path="/dashboard/users" element={<AdminLayout><Users /></AdminLayout>} />
          <Route path="/Add" element={<Layout><Add /></Layout>} />
         
          <Route path="/Account/:id" element={<Layout><Account /></Layout>} />
          <Route path="/blog/:id" element={<Layout><BlogDetail /></Layout>} />
          <Route path="/chat" element={<Layout><ChatBoard /></Layout>} />
          <Route path="/debug" element={<Layout><DebugPermissions /></Layout>} />
          </Route>
         
        </Routes>
        </AuthProvider>
      </ThemeProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
