import { useState, useEffect } from "react";
import { ShoppingCart, Package, RefreshCw, Repeat } from "react-feather";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
import api from "./helper/api";
import { LastSyncedat } from "./LastSyncedat";

// dayjs.extend(relativeTime);

function StatsCard() {
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

  const [loading, setLoading] = useState(true);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [newPrimaryStore, setNewPrimaryStore] = useState(""); // Store for the new primary store
  const [isPrimaryStoreChanging, setIsPrimaryStoreChanging] = useState(false);


  useEffect(() => {
    if (isPrimaryStoreChanging) {
      return; // Skip fetching new data if primary store is changing
    }

    const fetchData = async () => {
      try {
        const response = await api.get("/inventory/summary");
        console.log(response.data)

        // const currentTime = dayjs();
        setSummary([
          {
            name: "BrickLink",
            isPrimary: response.data.primaryStore === "BrickOwl" ? false : true,
            lastSynced: response.data.lastSyncedAt,
            stats: {
              orders: response.data.bricklinkTotalOrders,
              lots: response.data.bricklinkTotalLots,
              items: response.data.bricklinkTotalQuantity,
            },
          },
          {
            name: "BrickOwl",
            isPrimary: response.data.primaryStore === "BrickLink" ? false : true,
            lastSynced: response.data.lastSyncedAt,
            stats: {
              orders: response.data.brickowlTotalOrders,
              lots: response.data.brickowlTotalLots,
              items: response.data.brickowlTotalQuantity,
            },
          },
        ]);
      } catch (err) {
        console.error("Error fetching data:", err.response.data.error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isPrimaryStoreChanging]);

  const syncInventory = async () => {
    try {
      setSyncInProgress(true);

      // First API call
      let res;
      try {
        res = await api.get("/inventory/synchronize");
        console.log(res.data); // Log the response from synchronization
        toast.success(res.data.message)

      } catch (error) {
        toast.error(error.response.data.error);
        console.error("Error during synchronization:", error);
        setSyncInProgress(false);
        return; // Stop further execution if the first API call fails
      }

      // Second API call
      let response;
      try {
        response = await api.get("/inventory/summary");
      } catch (error) {
        toast.error(error.response.data.error);
        console.error("Error during summary fetch:", error);
        setSyncInProgress(false);
        return; // Stop further execution if the second API call fails
      }

      // If both API calls succeed, update the state
      // const currentTime = dayjs();
      setSummary((prevSummary) =>
        prevSummary.map((entry) => ({
          ...entry,
          stats: {
            orders: response.data[`${entry.name.toLowerCase()}TotalOrders`],
            lots: response.data[`${entry.name.toLowerCase()}TotalLots`],
            items: response.data[`${entry.name.toLowerCase()}TotalQuantity`],
          },
        }))
      );

      // toast.success("Sync completed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncInProgress(false);
    }
  };


  const changePrimaryStore = () => {
    const currentPrimary = summary.find(store => store.isPrimary)?.name;
    const newPrimary = currentPrimary === "BrickLink" ? "BrickOwl" : "BrickLink";
    setNewPrimaryStore(newPrimary); // Set the new primary store name
    setShowConfirmationModal(true);
  };

  const confirmChangePrimaryStore = async () => {
    const currentPrimary = summary.find(store => store.isPrimary)?.name;
    const newPrimary = currentPrimary === "BrickLink" ? "BrickOwl" : "BrickLink";

    try {

      setSummary(prevSummary => prevSummary.map(store => ({
        ...store,
        isPrimary: store.name === newPrimary
      })));

      setIsPrimaryStoreChanging(true);


      const response = await api.post("/keys/update-primary-store", { primary_store: newPrimary });

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  const cancelChangePrimaryStore = () => {
    setShowConfirmationModal(false);
    setIsPrimaryStoreChanging(false);
  };

  if (loading) return (
    <div className="grid bg-white rounded-xl p-6 card-shadow pb-0">
      <div className="flex justify-between items-center mb-6 w-full">
        <span className="text-md font-semibold">Store Synchronisation</span>
        <div className="flex gap-6">
          {localStorage.getItem("role") === 'admin' && <button
            className="flex items-center gap-1 text-gray-400 hover:text-black"
            onClick={changePrimaryStore}
          >
            <Repeat size={18} />
            <span className="text-sm">Change Primary Store</span>
          </button>}
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
  );

  return (
    <div className="grid bg-white rounded-xl p-6 card-shadow pb-0">
      <div className="flex justify-between items-center mb-6 w-full">
        <span className="text-md font-semibold">Store Synchronisation</span>
        <div className="flex gap-6">
          {localStorage.getItem("role") === 'admin' && <button
            className="flex items-center gap-1 text-gray-400 hover:text-black"
            onClick={changePrimaryStore}
          >
            <Repeat size={18} />
            <span className="text-sm">Change Primary Store</span>
          </button> }
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
              <LastSyncedat syncdate={store.lastSynced}></LastSyncedat>
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

      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-11/12 sm:w-96">
            <h3 className="text-xl font-semibold mb-4">Change Primary Store</h3>
            <p className="text-sm mb-6">Are you sure you want to change the primary store to {newPrimaryStore}?</p>
            <div className="flex justify-between">
              <button
                onClick={cancelChangePrimaryStore}
                className="text-gray-500 bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmChangePrimaryStore}
                className="text-white bg-blue-600 px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StatsCard;
