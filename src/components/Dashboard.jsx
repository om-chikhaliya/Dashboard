import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatsCard from "./StatsCard";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import { ByBuyers } from "./ByBuyers";
import { Task } from "./Task";
import { RefreshCw, Repeat, ShoppingCart, Package } from "react-feather";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { BarChart } from "lucide-react";
import api from "./helper/api";
import { ClipLoader } from "react-spinners";
function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [months, setMonths] = useState(6)
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [summary, setSummary] = useState([
    {
      name: "BrickLink",
      isPrimary: false,
      lastChecked: "1 minute ago",
      stats: {
        orders: 0,
        lots: 0,
        items: 0,
      },
    },
    {
      name: "BrickOwl",
      isPrimary: false,
      lastChecked: "1 minute ago",
      stats: {
        orders: 0,
        lots: 0,
        items: 0,
      },
    },
  ]);

  const fetchAndStoreDashboard = async () => {
    try {
      const res = await api.get("/inventory/summary");
  
      const dataToStore = {
        data: res.data,
        timestamp: Date.now(), // Save current time
      };
  
      sessionStorage.setItem("dashboardData", JSON.stringify(dataToStore));
      setDashboardData(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
  
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Optionally redirect to login
      } else {
        toast.error("Failed to load dashboard data.");
      }
  
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const cached = sessionStorage.getItem("dashboardData");
  
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          const diffInMinutes = (now - timestamp) / (1000 * 60);
  
          if (diffInMinutes < 10) {
            setDashboardData(data);
            setLoading(false);
            return;
          } else {
            // Expired: remove stale data
            sessionStorage.removeItem("dashboardData");
          }
        }
  
        // If no data or expired, fetch from API
        await fetchAndStoreDashboard();
      } catch (err) {
        console.error("Dashboard fetch error", err);
        setLoading(false);
      }
    };
  
    fetchDashboard();
  }, []);
  
  

  return (

    <div className="">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />

        <div className="py-6 pt-0">
          {loading ? (
            <div className="grid bg-white rounded-xl p-6 card-shadow pb-0">
              <div className="flex justify-between items-center mb-6 w-full">
                <span className="text-md font-semibold">Store Synchronisation</span>
                <div className="flex gap-6">
                  {localStorage.getItem("role") === 'admin' && <button
                    className="flex items-center gap-1 text-gray-400"
                    disabled = {true}
                  >
                    <Repeat size={18} />
                    <span className="text-sm">Change Primary Store</span>
                  </button>}
                  <button
                    className="flex items-center gap-2 text-gray-400"
                    disabled = {true}
                  >
                    <RefreshCw size={18} className={`h-4 w-4`} />
                    <span className="text-sm">Sync Inventory</span>
                  </button>
                  
                </div>
              </div>
              <hr className="border-gray-400" />
              <div className="">
                {summary.map((store) => (
                  <div
                    key={store.name}
                    className="flex justify-between items-center py-4 border-gray-800"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{store.name}</span>
                        {store.isPrimary && (
                          <span className="px-2 py-0.5 text-xs primary-element rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">

                        <span className="text-sm bg-gray-300 animate-pulse rounded w-32 h-4"></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <ShoppingCart size={18} />
                        <span className="text-sm bg-gray-300 animate-pulse rounded w-20 h-4"></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package size={18} />
                        <span className="text-sm bg-gray-300 animate-pulse rounded w-32 h-4"></span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ) : (
            <StatsCard data={dashboardData} />
          )}


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
                {loading ? (
                  <div className="flex justify-center items-center h-72">
                    <ClipLoader size={50} color={"#AAFF00"} />
                  </div>
                ) : (
                  <LineChart months={months} salesdata={dashboardData.monthlySales} />
                )}
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
