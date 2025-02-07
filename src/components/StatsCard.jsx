import { useState, useEffect } from "react";
import { ShoppingCart, Package, RefreshCw } from "react-feather";
import { CircleLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

function StatsCard() {

  const [summary, setSummary] = useState(
    [
      {
        name: "BrickLink",
        isPrimary: true,
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
    ])

  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(true); // State to track loading status
  const [syncInProgress, setSyncInProgress] = useState(false); // State to track sync progress

  useEffect(() => {
    // Function to fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/inventory-summary");
        const currentTime = dayjs();
        setSummary([
          {
            name: "BrickLink",
            isPrimary: true,
            lastChecked: dayjs(currentTime).fromNow(),
            stats: {
              orders: response.data.BricklinkTotalOrders,
              lots: response.data.bricklinktotalLots,
              items: response.data.BricklinkTotalQuantity,
            },
          },
          {
            name: "BrickOwl",
            isPrimary: false,
            lastChecked: dayjs(currentTime).fromNow(),
            stats: {
              orders: response.data.BrickOwlTotalOrders,
              lots: response.data.BrickowlTotalLots,
              items: response.data.BrickOwlTotalQuantity,
            },
          },
        ]); // Save response data to state
      } catch (err) {
        setError(err.message); // Save error message to state
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData(); // Call the function on page load
  }, []); // Empty dependency array ensures this runs only once

  dayjs.extend(relativeTime);
  const syncInventory = async () => {

    try {
      setSyncInProgress(true);

      const sync = await axios.get('http://localhost:4000/api/synchronize-inventory');

      const response = await axios.get("http://localhost:4000/api/inventory-summary");
      const currentTime = dayjs();
      setSummary([
        {
          name: "BrickLink",
          isPrimary: true,
          lastChecked: dayjs(currentTime).fromNow(),
          stats: {
            orders: response.data.BricklinkTotalOrders,
            lots: response.data.bricklinktotalLots,
            items: response.data.BricklinkTotalQuantity,
          },
        },
        {
          name: "BrickOwl",
          isPrimary: false,
          lastChecked: dayjs(currentTime).fromNow(),
          stats: {
            orders: response.data.BrickOwlTotalOrders,
            lots: response.data.BrickowlTotalLots,
            items: response.data.BrickOwlTotalQuantity,
          },
        },
      ]); // Save response data to state

      toast.success("Sync completed successfully!");

    }
    catch (error) {
      console.log(error)
      toast.error("Sync failed. Please try again.");
    }
    finally {
      setSyncInProgress(false);
    }
  };


  if (loading) return (
    // <div className="grid bg-white rounded-xl p-6 card-shadow pb-0">
    //   <div className="flex justify-between items-center mb-6 w-full">
    //     <span className="text-md font-semibold">Store Synchronisation</span>
    //   </div>
    //   <hr className="border-gray-400" />
    //   <div className="flex justify-center items-center py-4 border-gray-800 h-40">
    //     <CircleLoader size={50} color={"#AAFF00"} loading={loading} />
    //   </div>
    // </div>

    <div className="grid bg-white rounded-xl p-6 card-shadow pb-0">
      <div className="flex justify-between items-center mb-6 w-full">
        <span className="text-md font-semibold">Store Synchronisation</span>
        <button className="flex items-center gap-2 text-gray-400 hover:text-black" onClick={syncInventory}>
          <RefreshCw size={18} className={`h-4 w-4 ${syncInProgress && 'animate-spin'}`} />
          <span className="text-sm">Sync Inventory</span>
        </button>
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
              <p className="text-[12px] text-gray-500 mt-1">
                Orders checked {store.lastChecked}
              </p>
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
  );  // Show loading message while waiting for data

  if (syncInProgress) return (
    <div className="grid bg-white rounded-xl p-6 card-shadow pb-0">
      <div className="flex justify-between items-center mb-6 w-full">
        <span className="text-md font-semibold">Store Synchronisation</span>
        <button className="flex items-center gap-2 text-gray-400 hover:text-black" onClick={syncInventory}>
          <RefreshCw size={18} className={`h-4 w-4 ${syncInProgress && 'animate-spin'}`} />
          <span className="text-sm">Sync Inventory</span>
        </button>
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
              <p className="text-[12px] text-gray-500 mt-1">
                Orders checked {store.lastChecked}
              </p>
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
  );


  return (
    <div className="grid bg-white rounded-xl p-6 card-shadow pb-0">
      <div className="flex justify-between items-center mb-6 w-full">
        <span className="text-md font-semibold">Store Synchronisation</span>
        <button className="flex items-center gap-2 text-gray-400 hover:text-black" onClick={syncInventory}>
          <RefreshCw size={18} className={`h-4 w-4 ${syncInProgress && 'animate-spin'}`} />
          <span className="text-sm">Sync Inventory</span>
        </button>
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
              <p className="text-[12px] text-gray-500 mt-1">
                Orders checked {store.lastChecked}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span className="text-sm">{store.stats.orders} orders</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={18} />
                <span className="text-sm">
                  {store.stats.lots} lots · {store.stats.items} items
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsCard;
