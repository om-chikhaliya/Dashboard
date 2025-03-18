import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatsCard from "./StatsCard";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import { ByBuyers } from "./ByBuyers";
import { Task } from "./Task";
import { Search, ChevronDown, User, Settings, LogOut } from "react-feather";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { BarChart } from "lucide-react";

function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [months, setMonths] = useState(6)

  return (

    <div className="">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />

        <div className="py-6 pt-0">
          <StatsCard />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 flex flex-col">
              <div className="bg-white rounded-xl p-6 card-shadow flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">Sales in last {months} Months</h2>
                  <select
                    className="border rounded-md px-3 py-1 text-gray-700"
                    value={months}
                    onChange={(e) => setMonths(parseInt(e.target.value))}
                  >
                    <option value="6">Last 6 Months</option>
                    <option value="12">Last 12 Months</option>
                  </select>
                </div>
                <LineChart months={months} />
              </div>
              {/* <div className="bg-white rounded-xl p-6 card-shadow flex-grow mt-6">
                <h2 className="font-medium mb-1">P&L</h2>
                <p className="text-sm text-gray-500 mb-4">Total profit growth of 25%</p>
                <DonutChart />
              </div> */}
            </div>

            <div className="lg:row-span-3 flex flex-col gap-6">
              {/* <div className="bg-white rounded-xl p-6 card-shadow flex-grow">
                <Task />
              </div> */}
              <div className="bg-white rounded-xl p-6 card-shadow flex-grow">
                <ByBuyers />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

export default Dashboard;
