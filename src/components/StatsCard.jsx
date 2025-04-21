import { useState, useEffect } from "react";
import { ShoppingCart, Package, RefreshCw, Repeat, DollarSign, X, Info } from "react-feather";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
import api from "./helper/api";
import { formatDistanceToNow, isValid } from "date-fns";
import { LastSyncedat } from "./LastSyncedat";

// dayjs.extend(relativeTime);

function StatsCard({ data }) {
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
  const [hovered, setHovered] = useState({ storeIndex: null, type: null });

  const [showPriceModal, setShowPriceModal] = useState(false); // Price Modal State
  const [selectedMonths, setSelectedMonths] = useState(1); // Months Selection
  const [pricePercentage, setPricePercentage] = useState(""); // Percentage Input
  const [priceChangeType, setPriceChangeType] = useState("Higher");
  const openPriceChangeModal = () => {
    setShowPriceModal(true);
  };
  const closePriceChangeModal = () => {
    setShowPriceModal(false);
    setPricePercentage("");
  };

  const submitPriceChange = async () => {
    const adjustedPercentage = priceChangeType === "Decrease" ? -1 * pricePercentage : pricePercentage;



    try {
      const response = api.post("price/pricechange", {
        months: selectedMonths,
        percentage: adjustedPercentage,
      });

      toast.success("Price updates started");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating prices");
    } finally {
      setShowPriceModal(false);
    }
  };

  const [detailedStoreData, setDetailedStoreData] = useState(null);
  const [showModalBreakdown, setShowModalBreakdown] = useState(false);
  const [backgroundSync, setBackgroundSync] = useState(false);

  const fetchSyncStatus = async () => {
    try {
      const response = await api.get("/inventory/sync-status");
      const data = await response.data;
      setBackgroundSync(data.sync_in_progress);



    } catch (error) {
      console.error("Error fetching sync status:", error);
    }
  };

  // Set up the interval to call the API every 2 minutes
  useEffect(() => {
    fetchSyncStatus(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchSyncStatus(); // Fetch every 2 minutes
    }, 2 * 60 * 1000); // 2 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isPrimaryStoreChanging) {
      return; // Skip fetching new data if primary store is changing
    }

    const fetchData = async () => {
      try {
        // const response = await api.get("/inventory/summary");


        // const currentTime = dayjs();
        setSummary([
          {
            name: "BrickLink",
            isPrimary: data.primaryStore === "BrickOwl" ? false : true,
            lastSynced: data.lastSyncedAt,
            stats: {
              orders: data.bricklinkTotalOrders,
              lots: data.bricklinkTotalLots,
              items: data.bricklinkTotalQuantity,
              detailedLot: data.bricklinkDetailedLot,
              detailedItem: data.bricklinkDetailedItem,
              detailedPrice: data.bricklinkDetailedPrice,
            },
          },
          {
            name: "BrickOwl",
            isPrimary: data.primaryStore === "BrickLink" ? false : true,
            lastSynced: data.lastSyncedAt,
            stats: {
              orders: data.brickowlTotalOrders,
              lots: data.brickowlTotalLots,
              items: data.brickowlTotalQuantity,
              detailedLot: data.brickowlDetailedLot,
              detailedItem: data.brickowlDetailedItem,
              detailedPrice: data.brickowlDetailedPrice,
            },
          },
        ]);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isPrimaryStoreChanging]);

  const openDetailedModal = (storeName) => {
    const storeData = summary.find(store => store.name === storeName);
    setDetailedStoreData(storeData);
    setShowModalBreakdown(true);
  };

  const closeModal = () => {
    setShowModalBreakdown(false);
    setDetailedStoreData(null);
  };


  const syncInventory = async () => {
    try {
      setSyncInProgress(true);

      // First API call
      let res;
      try {
        res = await api.get("/inventory/synchronize");

        // toast.success(res.data.message)
        toast.success("Inventory sync is started in background and it will take around 20 minutes.")

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

        sessionStorage.removeItem('dashboardData');

        const dataToStore = {
          data: response.data,
          timestamp: Date.now(), // Save current time
        };

        sessionStorage.setItem("dashboardData", JSON.stringify(dataToStore));

        setBackgroundSync(true);

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
            detailedLot: response.data[`${entry.name.toLowerCase()}DetailedLot`],
            detailedItem: response.data[`${entry.name.toLowerCase()}DetailedItem`],
          },
        }))
      );

      // toast.success("Sync completed successfully!");
    } catch (error) {

      // toast.error("Sync failed. Please try again.");
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
          {/* <button className="flex items-center gap-2 text-gray-400 hover:text-black" onClick={openPriceChangeModal}>
            <DollarSign size={18} />
            <span className="text-sm">Set Avg Price</span>
          </button> */}
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
          
          {(syncInProgress || backgroundSync) && <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">

            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 1116 0A8 8 0 014 12zm8-3v6m3-3h-6" />
            </svg>

            <span>Sync in Progress...</span>
          </div>}

          {localStorage.getItem("role") === 'admin' &&

            <button
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
          {/* <button className="flex items-center gap-2 text-gray-400 hover:text-black" onClick={openPriceChangeModal}>
            <DollarSign size={18} />
            <span className="text-sm">Set Avg Price</span>
          </button> */}
        </div>
      </div>
      <hr className="border-gray-400" />
      <div>
        {summary.map((store, index) => (
          <div
            key={store.name}
            className="relative flex justify-between items-center py-4 border-gray-800"
          >
            {/* Store Name & Sync Time */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{store.name}</span>
                {store.isPrimary && (
                  <span className="px-2 py-0.5 text-xs primary-element rounded">
                    Primary
                  </span>
                )}
              </div>
              
              {store.lastSynced !== null && isValid(new Date(store?.lastSynced)) ?
                <p className="text-[12px] text-gray-500 mt-1">

                  Last Synced at {formatDistanceToNow(new Date(store?.lastSynced), { addSuffix: true })}

                </p>

                : <p className="text-[12px] text-gray-500 mt-1">

                  Inventory not synced yet.

                </p>
              }
            </div>

            {/* Orders, Lots, and Items */}
            <div className="flex items-center gap-6">
              {/* Orders */}
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span className="text-sm">{store.stats.orders} orders</span>
              </div>

              {/* Lots (Hover to Show Breakdown) */}
              <div
                className="relative flex items-center gap-2 cursor-pointer"
                onMouseEnter={() => setHovered({ storeIndex: index, type: "lots" })}
                onMouseLeave={() => setHovered({ storeIndex: null, type: null })}
              >
                <Package size={18} />
                <span className="text-sm">{store.stats.lots} lots</span>

                {/* Tooltip for Lots Breakdown */}
                {hovered.storeIndex === index && hovered.type === "lots" && (
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-48 bg-white text-black text-xs rounded-lg shadow-lg p-3 z-50">
                    <strong>Lots Breakdown</strong>
                    <ul className="mt-1 space-y-1">
                      {Object.entries(store.stats.detailedLot || {}).map(([type, count]) => (
                        <li key={type} className="flex justify-between">
                          <span className="capitalize">{type}</span>
                          <span className="font-semibold">{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Items (Hover to Show Breakdown) */}
              <div
                className="relative flex items-center gap-2 cursor-pointer"
                onMouseEnter={() => setHovered({ storeIndex: index, type: "items" })}
                onMouseLeave={() => setHovered({ storeIndex: null, type: null })}
              >
                <span className="text-sm">{store.stats.items} items</span>

                {/* Tooltip for Items Breakdown */}
                {hovered.storeIndex === index && hovered.type === "items" && (
                  <div className="absolute bottom-10 left-2/2 transform -translate-x-1/2 w-48 bg-white text-black text-xs rounded-lg shadow-lg p-3 z-50">
                    <strong>Items Breakdown</strong>
                    <ul className="mt-1 space-y-1">
                      {Object.entries(store.stats.detailedItem || {}).map(([type, count]) => (
                        <li key={type} className="flex justify-between">
                          <span className="capitalize">{type}</span>
                          <span className="font-semibold">{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                className="text-gray-500 hover:text-black"
                onClick={() => openDetailedModal(store.name)} // Call the function to open the modal
              >
                <Info size={18} />
              </button>
            </div>
          </div>
        ))}

      </div>
      {showPriceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-96 relative">
            {/* <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={closePriceChangeModal}>
              <X size={20} />
            </button> */}
            <h3 className="text-xl font-semibold mb-4">Update Item Prices</h3>
            <p className="text-sm mb-4 text-gray-700">
              Update the price of items based on the average price of
              <span className="font-medium text-gray-900"> {selectedMonths} </span> months
              by <span className="font-medium text-gray-900">{pricePercentage}%</span>
              <span className="font-medium text-gray-900"> {priceChangeType}.</span>
            </p>

            {/* Months Dropdown */}
            <label className="block text-sm font-medium text-gray-700">Select Months:</label>
            <select className="border p-2 w-full rounded-lg mb-3" value={selectedMonths} onChange={(e) => setSelectedMonths(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((month) => (
                <option key={month} value={month}>
                  {month} {month > 1 ? "Months" : "Month"}
                </option>
              ))}
            </select>

            {/* Percentage Input */}
            <label className="block text-sm font-medium text-gray-700">Percentage:</label>
            <input
              type="number"
              className="border p-2 w-full rounded-lg mb-3"
              placeholder="Enter percentage (e.g. 10, 20)"
              min="1"
              value={pricePercentage}
              onChange={(e) => setPricePercentage(e.target.value)}
            />

            {/* Increase/Decrease Dropdown */}
            <label className="block text-sm font-medium text-gray-700">Select Change Type:</label>
            <select className="border p-2 w-full rounded-lg mb-4" value={priceChangeType} onChange={(e) => setPriceChangeType(e.target.value)}>
              <option>Increase</option>
              <option>Decrease</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-between">
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded w-1/3" onClick={closePriceChangeModal}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded w-1/3" onClick={submitPriceChange}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalBreakdown && detailedStoreData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] md:w-[800px] lg:w-[1000px] max-h-[80vh] relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">
              {detailedStoreData.name} Detailed Breakdown
            </h3>

            {/* Table Wrapper */}
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Lot Count</th>
                  <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Item Count</th>
                  <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Price</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(detailedStoreData.stats.detailedLot || {}).map(([type, count]) => (
                  <tr key={type} className="border-t">
                    <td className="py-2 px-4 border-b text-sm">{type}</td>
                    <td className="py-2 px-4 border-b text-sm">{count}</td>
                    <td className="py-2 px-4 border-b text-sm">{detailedStoreData.stats.detailedItem[type]}</td>
                    <td className="py-2 px-4 border-b text-sm">${detailedStoreData.stats.detailedPrice[type].toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

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
