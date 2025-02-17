import { useState, useEffect } from "react";
import { ShoppingCart, Package, RefreshCw, Repeat } from "react-feather";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "./helper/api";

dayjs.extend(relativeTime);

function StatsCard() {
  const [summary, setSummary] = useState([
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
  ]);

  const [loading, setLoading] = useState(true);
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/inventory/summary");
        console.log(response.data)
        const currentTime = dayjs();
        setSummary([
          {
            name: "BrickLink",
            isPrimary: true,
            lastChecked: dayjs(currentTime).fromNow(),
            stats: {
              orders: response.data.bricklinkTotalOrders,
              lots: response.data.bricklinkTotalLots,
              items: response.data.bricklinkTotalQuantity,
            },
          },
          {
            name: "BrickOwl",
            isPrimary: false,
            lastChecked: dayjs(currentTime).fromNow(),
            stats: {
              orders: response.data.brickOwlTotalOrders,
              lots: response.data.brickOwlTotalLots,
              items: response.data.brickOwlTotalQuantity,
            },
          },
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const syncInventory = async () => {
    try {
      setSyncInProgress(true);
      const res = await api.get("/inventory/synchronize");
      console.log(res.data)
      const response = await api.get("/inventory/summary");
      const currentTime = dayjs();
      setSummary([
        {
          name: "BrickLink",
          isPrimary: true,
          lastChecked: dayjs(currentTime).fromNow(),
          stats: {
            orders: response.data.bricklinkTotalOrders,
            lots: response.data.bricklinkTotalLots,
            items: response.data.bricklinkTotalQuantity,
          },
        },
        {
          name: "BrickOwl",
          isPrimary: false,
          lastChecked: dayjs(currentTime).fromNow(),
          stats: {
            orders: response.data.brickOwlTotalOrders,
            lots: response.data.brickOwlTotalLots,
            items: response.data.brickOwlTotalQuantity,
          },
        },
      ]);
      toast.success("Sync completed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncInProgress(false);
    }
  };


  const changePrimaryStore = async () => {
    const userConfirmed = window.confirm("Are you sure you want to change the primary store?");
    if (!userConfirmed) return; // Stop execution if the user cancels
  
    try {
      const currentPrimary = summary.find(store => store.isPrimary)?.name;
      const newPrimary = currentPrimary === "BrickLink" ? "BrickOwl" : "BrickLink";
      
      // await api.post("/keys/update-primary-store", { primary_store: newPrimary });
  
      setSummary(prevSummary => prevSummary.map(store => ({
        ...store,
        isPrimary: store.name === newPrimary
      })));
  
      toast.success("Primary store changed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to change primary store.");
    }
  };
  
  if (loading) return (
    <div className="grid bg-white rounded-xl p-6 card-shadow pb-0">
      <div className="flex justify-between items-center mb-6 w-full">
        <span className="text-md font-semibold">Store Synchronisation</span>
        <div className="flex gap-6">
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-black"
            onClick={changePrimaryStore}
          >
            <Repeat size={18} />
            <span className="text-sm">Change Primary Store</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-400 hover:text-black"
            onClick={syncInventory}
          >
            <RefreshCw size={18} className={`h-4 w-4 ${syncInProgress && "animate-spin"}`} />
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
        <div className="flex gap-6">
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-black"
            onClick={changePrimaryStore}
          >
            <Repeat size={18} />
            <span className="text-sm">Change Primary Store</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-400 hover:text-black"
            onClick={syncInventory}
          >
            <RefreshCw size={18} className={`h-4 w-4 ${syncInProgress && "animate-spin"}`} />
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
        <div className="flex gap-6">
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-black"
            onClick={changePrimaryStore}
          >
            <Repeat size={18} />
            <span className="text-sm">Change Primary Store</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-400 hover:text-black"
            onClick={syncInventory}
          >
            <RefreshCw size={18} className={`h-4 w-4 ${syncInProgress && "animate-spin"}`} />
            <span className="text-sm">Sync Inventory</span>
          </button>
        </div>
      </div>
      <hr className="border-gray-400" />
      <div>
        {summary.map((store) => (
          <div key={store.name} className="flex justify-between items-center py-4 border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{store.name}</span>
                {store.isPrimary && <span className="px-2 py-0.5 text-xs primary-element rounded">Primary</span>}
              </div>
              <p className="text-[12px] text-gray-500 mt-1">Orders checked {store.lastChecked}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span className="text-sm">{store.stats.orders} orders</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={18} />
                <span className="text-sm">{store.stats.lots} lots · {store.stats.items} items</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsCard;
