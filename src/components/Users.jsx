import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import api from "./helper/api";


const Users = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>
      
        <Header />

        <div>user page</div>
      </div>
    </div>
  );
};

export default Users;
