import { useEffect, useState } from "react";
import Checkbox from "./ui/Checkbox";
import { Settings, Grid, List, Search, Trash2 } from "react-feather";
import { Box } from "react-feather";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { storeOptions, statusOptions, getTotalItemsInOrder, formatDateBasedOnUserLocation, decodeHtmlEntities } from "./helper/constant";

import { ClipLoader } from "react-spinners";
import Header from "./Header";
import img1 from "../assets/noorder.png";
import api from "./helper/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";
import Input from "./ui/Input";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { set } from "date-fns";

// const tasks = [
//   { id: 1, title: "Schedule post Dusk&Dawn", completed: true },
//   { id: 2, title: "Design post for Holi", completed: true },
//   { id: 3, title: "Brainstorming new project", completed: false },
//   { id: 4, title: "Re-Branding Discussion", completed: false },
// ];

function OrderCard({
  order,
  setSelectAllOrders,
  selectedOrders,
  setSelectedOrders,
  filteredOrders,
}) {
  // Handle individual order selection
  const handleOrderSelection = (id, checked) => {
    setSelectedOrders((prev) =>
      checked ? [...prev, id] : prev.filter((orderId) => orderId !== id)
    );
    setSelectAllOrders(
      checked && selectedOrders.length + 1 === filteredOrders.length
    );
  };

  return (
    <div className="rounded-lg p-4 border border-gray-200 shadow-sm shadow-lg  bg-white mb-6 flex flex-col h-full">
      {/* Order Details */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Checkbox
            checked={selectedOrders.includes(order.brickosys_order_id)}
            onChange={(checked) =>
              handleOrderSelection(order.brickosys_order_id, checked)
            }
            className="border-gray-500"
          />
          <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 heading-radius">
            Order {order.order_id}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          {order.brickosys_order_id.includes("BL")
            ? "Bricklink"
            : order.brickosys_order_id.includes("BO")
              ? "Brickowl"
              : order.brickosys_order_id}
        </div>
        <p className="text-gray-600 text-sm">
          {new Date(order.order_on).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Tags and Status */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`px-3 py-1 text-xs ${order.platform === "BL"
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800"
            } custom-radius`}
        >
          {order.platform}
        </span>
        <span className="bg-[#BCD3FF] text-[#0A0095] px-3 py-1 custom-radius text-xs">
          ${order.total_price}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs ${order.status === "PACKED"
            ? "bg-green-100 text-green-800"
            : order.status === "CANCELLED"
              ? "bg-red-100 text-red-800"
              : order.status === "Shipped"
                ? "bg-cyan-100 text-cyan-800"
                : "bg-orange-100 text-orange-800"
            } custom-radius`}
        >
          {order.status}
        </span>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-center gap-12 bg-gray-100 text-sm text-gray-600 -mx-4 -mb-4 px-4 py-3 rounded-b-lg mt-auto">
        {/* Lots */}
        <div className="flex items-center gap-2">
          <Box className="text-black" size={20} />
          <span className="text-sm font-semibold">
            {order.items.length} lots
          </span>
        </div>
        {/* Items */}
        <div className="flex items-center gap-2">
          <Box className="text-black" size={20} />
          <span className="text-sm font-semibold">
            {getTotalItemsInOrder(order)} items
          </span>
        </div>
      </div>
    </div>
  );
}

// Order view component
function OrderPageContent() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  function StartPickUpButton({ onClick }) {
    return (
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          // onClick={() => navigate("/pickupitems")}
          onClick={onClick}
          disabled={pickuploading}
        >
          {pickuploading ? (
            <ClipLoader size={20} color={"#ffffff"}></ClipLoader>
          ) : (
            "Start Pick Up"
          )}
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const [pickuploading, setPickuploading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedStores, setSelectedStores] = useState(storeOptions);
  // const [selectAllStatuses, setSelectAllStatuses] = useState(true)
  const [selectedStatuses, setSelectedStatuses] = useState(
    statusOptions.flatMap((status) => status.values)
  ); // Initially select all
  const [selectAllOrders, setSelectAllOrders] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for "Load More" button
  const [taskloading, setTaskloading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]);
  const [sortOption, setSortOption] = useState("date");

  const [selectAllStatuses, setSelectAllStatuses] = useState({
    BrickLink: true,
    BrickOwl: true,
  });

  const [dateRange, setDateRange] = useState([null, null]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = api.get("/order/sync");

  //       const response = await api.get("/order");

  //       const sortedOrders = response.data.sort((a, b) => {
  //         return new Date(b.order_on) - new Date(a.order_on); // Sorting by descending order (newest first)
  //       });

  //       setFilteredOrders(sortOrders(response.data, "date"));
  //       setOrders(sortedOrders);

  //       // const task_response = await api.get("/order/task");

  //       // setTasks(task_response.data)
  //       // setTaskloading(false)

  //     } catch (err) {
  //       // setError(err.message); // Save error message to state
  //       console.error("Error fetching data:", err);
  //     } finally {
  //       setLoading(false); // Stop loading spinner
  //     }
  //   };

  //   fetchData();

  // }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const task_response = await api.get("/order/task");

        setTasks(task_response.data);
      } catch (err) {
        // setError(err.message); // Save error message to state
        console.error("Error fetching data:", err);
      } finally {
        setTaskloading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  const sortOrders = (orders, criteria) => {
    return [...orders].sort((a, b) => {
      if (criteria === "date") {
        return new Date(b.order_on) - new Date(a.order_on); // Newest first
      } else if (criteria === "total") {
        return b.total_price - a.total_price; // Highest total first
      } else if (criteria === "platform") {
        return a.platform.localeCompare(b.platform); // Alphabetical order
      }
      return 0;
    });
  };

  // Handle sorting change
  const handleSortChange = (criteria) => {
    setSortOption(criteria);
    setFilteredOrders(sortOrders(filteredOrders, criteria));
    setIsDropdownOpen(false); // Close dropdown after selecting an option
  };

  const [serchList, setSerarchList] = useState([])

  useEffect(() => {

    let orderListToFilter = searchTerm.trim() ? serchList : orders
    const filtered = orderListToFilter.filter((order) => {
      // const matchesSearch =
      //   !searchTerm ||
      //   order.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   order.order_id.toString().includes(searchTerm) ||
      //   new Date(order.order_on)
      //     .toLocaleDateString("en-GB", {
      //       day: "2-digit",
      //       month: "long",
      //       year: "numeric",
      //     })
      //     .toLowerCase()
      //     .includes(searchTerm.toLowerCase()) ||
      //   order.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStore = selectedStores.includes(
        order.platform === "BL" ? "BL" : "BO"
      );

      const matchesStatus = selectedStatuses.includes(order.status);

      return matchesStore && matchesStatus;
    });

    setFilteredOrders(filtered);
  }, [orders, selectedStores, selectedStatuses, serchList]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // const handleSearch = async (value) => {

  //   setSearchTerm(value);

  //   if (!value) {
  //     setFilteredOrders([]); // reset if empty
  //     return;
  //   }

  //   try {
  //     const res = await api.get("/order/search", {
  //       params: { query: value },
  //     });

  //     console.log("Search results:", res.data);

  //     setFilteredOrders(res.data);
  //   } catch (err) {
  //     console.error("Search error:", err);
  //   }
  // };

  const [debouncedTerm, setDebouncedTerm] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch when debouncedTerm changes
  useEffect(() => {

    const controller = new AbortController();

    const fetchOrders = async () => {

      if (!debouncedTerm) {
        // setFilteredOrders(orders);
        setSerarchList([]);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get("/order/search", {
          params: { query: debouncedTerm },
          signal: controller.signal,
        });

        setSerarchList(res.data);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          console.log("Search request aborted");
        } else {
          console.error("Search error:", err);
        }
      }
      finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [debouncedTerm]);



  const handleStoreChange = (store, checked) => {
    setSelectedStores(
      checked
        ? [...selectedStores, store]
        : selectedStores.filter((s) => s !== store)
    );
    // setDateRange([null, null]);

    if (store === "BL") {
      handleSelectAllStatusesBL(checked);
    } else if (store === "BO") {
      handleSelectAllStatusesBO(checked);
    }
  };

  // const handleSelectAllStatuses = (checked) => {

  //   setSelectAllStatuses(checked);
  //   setSelectedStatuses(
  //     checked ? statusOptions.flatMap((status) => status.values) : []
  //   );

  //   setDateRange([null, null])
  // }

  const handleSelectAllStatusesBL = (checked) => {
    const BLStatuses = statusOptions
      .filter((status) => status.label.includes("(BL)"))
      .flatMap((status) => status.values);

    const updatedStatuses = checked
      ? [...selectedStatuses, ...BLStatuses] // Select all BL statuses
      : selectedStatuses.filter((status) => !BLStatuses.includes(status)); // Deselect all BL statuses

    setSelectedStatuses(updatedStatuses);

    // Directly update "Select All" state based on the checked input
    setSelectAllStatuses((prev) => ({
      ...prev,
      BrickLink: checked,
    }));

    // setDateRange([null, null]);
  };

  const handleSelectAllStatusesBO = (checked) => {
    const BOStatuses = statusOptions
      .filter((status) => status.label.includes("(BO)"))
      .flatMap((status) => status.values);

    const updatedStatuses = checked
      ? [...selectedStatuses, ...BOStatuses] // Select all BO statuses
      : selectedStatuses.filter((status) => !BOStatuses.includes(status)); // Deselect all BO statuses

    setSelectedStatuses(updatedStatuses);

    // Directly update "Select All" state based on the checked input
    setSelectAllStatuses((prev) => ({
      ...prev,
      BrickOwl: checked,
    }));

    // setDateRange([null, null]);
  };

  const handleStatusChange = (status, isChecked) => {
    const store = status.label.includes("(BL)") ? "BrickLink" : "BrickOwl";

    setSelectedStatuses((prev) => {
      const updatedStatuses = isChecked
        ? [...prev, ...status.values] // Add new statuses
        : prev.filter((value) => !status.values.includes(value)); // Remove unchecked statuses

      // Check if all statuses for the respective store are selected
      const allStatusesForStore = statusOptions
        .filter((s) =>
          s.label.includes(store === "BrickLink" ? "(BL)" : "(BO)")
        )
        .flatMap((s) => s.values);

      const isAllSelected = allStatusesForStore.every((s) =>
        updatedStatuses.includes(s)
      );

      setSelectAllStatuses((prev) => ({
        ...prev,
        [store]: isAllSelected, // Set "Select All" only for the respective store
      }));

      const hasAny = updatedStatuses.some((s) =>
        allStatusesForStore.includes(s)
      );

      setSelectedStores((prevStores) => {
        if (hasAny) {
          // add if missing
          return prevStores.includes(store === "BrickLink" ? "BL" : "BO")
            ? prevStores
            : [...prevStores, store === "BrickLink" ? "BL" : "BO"];
        } else {
          // remove
          return prevStores.filter((s) =>
            (s !== store) === "BrickLink" ? "BL" : "BO"
          );
        }
      });
      return updatedStatuses;
    });

    // setDateRange([null, null]);
  };

  // Handle individual status selection
  // const handleStatusChange = (status, isChecked) => {

  //   const updatedStatuses = isChecked
  //     ? [...selectedStatuses, ...status.values]
  //     : selectedStatuses.filter((value) => !status.values.includes(value));

  //   setSelectedStatuses(updatedStatuses);
  //   setSelectAllStatuses(
  //     updatedStatuses.length === statusOptions.flatMap((status) => status.values).length
  //   ); // Update "Select All" checkbox

  //   setDateRange([null, null])
  // }

  const handleSelectAllOrders = (checked) => {
    setSelectAllOrders(checked);
    setSelectedOrders(
      checked ? filteredOrders.map((order) => order.brickosys_order_id) : []
    );
  };

  // Handle individual order selection
  const handleOrderSelection = (id, checked) => {
    setSelectedOrders((prev) =>
      checked ? [...prev, id] : prev.filter((orderId) => orderId !== id)
    );
    setSelectAllOrders(
      // checked && selectedOrders.length + 1 === filteredOrders.length
      checked && selectedOrders.length + 1 === totalOrders
    );
  };

  const [startDate, endDate] = dateRange;
  const handleRangeChange = (value) => {
    if (Array.isArray(value)) {
      const [newStartDate, newEndDate] = value;
      setDateRange([newStartDate, newEndDate]);
    }
  };


  useEffect(() => {
    // Reset the orders whenever the date range changes
    setOrders([]);
    setFilteredOrders([]);
    fetchData();
  }, [dateRange]);


  const clearDateFilter = () => {
    setDateRange([null, null]);
    setFilteredOrders(orders); // Reset filtered orders
  };

  const handleStartPicking = () => {
    if (selectedOrders.length > 0) {
      setPickuploading(true);

      const orderIds = selectedOrders.join(",");
      // const response = api.get("/auth/pickup-started-log", {
      //   params: {
      //     brickosys_order_ids: orderIds
      //   }
      // });
      setPickuploading(false);
      window.location.href = `/pickorders?brickosys_orderId=${orderIds}`; // Using window.location.href
    }
  };

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [limit, setLimit] = useState(10); // Set the limit of items per page
  const [totalOrders, setTotalOrders] = useState(0); // Track total number of orders for pagination

  const fetchData = async () => {
    try {
      setLoading(true); // Show the loader for page load
      // Reset the orders if date range changes
      setOrders([]);  // Reset the orders state to clear previous data
      setFilteredOrders([]);  // Reset the filtered orders

      const response = await api.get("/order", {
        params: {
          limit: 30, // Number of items per load
          offset: 0, // Reset offset to 0 for fresh data
          startDate: startDate,
          endDate: endDate,
        },
      });

      if (response.data.orders.length < 10) {
        setLoadingMore(false);
      }
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
      setTotalOrders(response.data.total); // Update total orders
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };


  const handleLoadMore = async () => {
    try {
      setLoadingMore(true); // Show loader for "Load More" button

      const response = await api.get("/order", {
        params: {
          limit: 30, // Always load 30 more orders
          offset: orders.length, // Offset is based on the current number of orders
          startDate: startDate,
          endDate: endDate,
        },
      });

      // Append the new orders to the existing list

      setOrders((prevOrders) => {
        const newOrders = response.data.orders.filter(
          (order) => !prevOrders.some((prevOrder) => prevOrder.order_id === order.order_id)
        );
        return [...prevOrders, ...newOrders];
      });


      setTotalOrders(response.data.total); // Update total orders
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setLoadingMore(false); // Hide the "Load More" loader
    }
  };


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page); // Update current page
      // handleSelectAllOrders(false)
    }
  };

  const [showAlert, setShowAlert] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const toggleMissingItems = async (brickosys_order_id, item_id, id) => {
    try {
      setLoadingItemId(id); // show loader for this item

      let updatedItem = {
        brickosysId: brickosys_order_id,
        id: id,
        itemId: item_id,
        isPicked: "false",
        note: "" // remove the note
      };

      await api.post("/order/update-item-progress", [updatedItem]);

      // ✅ Update local state
      setTasks((prevTasks) =>
        prevTasks
          .map((order) =>
            order.order_id === brickosys_order_id.replace(/^bosys-[A-Z]+-/, "")
              ? {
                ...order,
                notes: order.notes.filter((note) => note.id !== id) // remove deleted note
              }
              : order
          )
          .filter((order) => order.notes.length > 0) // remove order if no notes left
      );

      toast.success("Item deleted successfully.");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoadingItemId(null);
    }
  };


  return (
    <div className="py-6 pt-0">
      <Header handleSearch={handleSearch} searchTerm={searchTerm}></Header>

      {showAlert && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 ml-6 mt-2 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            {/* Info Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>

            {/* Info Text */}
            <p className="text-sm font-medium">
              Order information is available starting from the month your
              account was created on our platform and Fresh orders are updated
              at every 10 minutes.
            </p>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="text-blue-800 hover:text-blue-900 text-lg font-bold ml-4 focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      {/* <div className="bg-white rounded-xl p-6 card-shadow mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-md font-semibold">Stores</span>
          </div>

          
          <div className="flex gap-4">

            {storeOptions.map((store) => (
              <div key={store} className="flex items-center gap-1 font-medium text-sm">
                <Checkbox
                  id={store}
                  checked={selectedStores.includes(store)}
                  onChange={(checked) => handleStoreChange(store, checked)}
                  className="border-blue-500"
                />
                <label htmlFor={store} className="ml-2 text-sm">
                  {store}
                </label>
              </div>
            ))}
          </div>

          
          <div className="space-y-3">
            <span className="text-md font-semibold">Status</span>
            <div className="flex flex-wrap gap-4 font-medium text-sm">

              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectAllStatuses}
                  onChange={(e) => handleSelectAllStatuses(e.target.checked)}
                  className="border-blue-500"
                />
                <label htmlFor="select-all" className="ml-2 text-sm">
                  Select All
                </label>
              </div>

              {statusOptions.map((status) => (
                <div key={status.label} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={status.label}
                    checked={status.values.every((value) =>
                      selectedStatuses.includes(value)
                    )} // Check if all values for this status are selected
                    onChange={(e) => handleStatusChange(status, e.target.checked)}
                    className="border-blue-500"
                  />
                  <label htmlFor={status.label} className="ml-2 text-sm">
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-4 space-y-3">
        <div className="bg-transparent rounded-xl p-6 lg:col-span-3 h-fit row-span-2">
          <div className="bg-white p-6 rounded-xl space-y-1 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-md font-semibold">Stores</span>
            </div>

            {/* Store Blocks with Respective Status Filters */}
            <div className="grid grid-cols-2 gap-6">
              {/* BrickLink Store */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox
                    id="BL"
                    checked={selectedStores.includes("BL")}
                    onChange={(checked) => handleStoreChange("BL", checked)}
                    className="border-blue-500"
                  />
                  <label htmlFor="bricklink" className="text-md font-semibold">
                    BrickLink
                  </label>
                </div>

                {/* BrickLink Statuses */}
                <div className="space-y-2">
                  <span className="text-sm font-semibold">Status</span>
                  <div className="flex flex-wrap gap-3 font-medium text-sm">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="select-all-bl"
                        checked={selectAllStatuses.BrickLink}
                        onChange={(e) =>
                          handleSelectAllStatusesBL(e.target.checked)
                        }
                        className="border-blue-500 mt-2"
                      />
                      <label
                        htmlFor="select-all-bl"
                        className="ml-2 mt-2 text-sm"
                      >
                        Select All
                      </label>
                    </div>

                    {statusOptions
                      .filter((status) => status.label.includes("(BL)"))
                      .map((status) => (
                        <div key={status.label} className="flex items-center">
                          <input
                            type="checkbox"
                            id={status.label}
                            checked={status.values.every((value) =>
                              selectedStatuses.includes(value)
                            )}
                            onChange={(e) =>
                              handleStatusChange(status, e.target.checked)
                            }
                            className="border-blue-500"
                          />
                          <label
                            htmlFor={status.label}
                            className="ml-2 text-sm"
                          >
                            {status.label.slice(0, -4)}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* BrickOwl Store */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox
                    id="BO"
                    checked={selectedStores.includes("BO")}
                    onChange={(checked) => handleStoreChange("BO", checked)}
                    className="border-blue-500"
                  />
                  <label htmlFor="brickowl" className="text-md font-semibold">
                    BrickOwl
                  </label>
                </div>

                {/* BrickOwl Statuses */}
                <div className="space-y-2">
                  <span className="text-sm font-semibold">Status</span>
                  <div className="flex flex-wrap gap-3 font-medium text-sm">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="select-all-bo"
                        checked={selectAllStatuses.BrickOwl}
                        onChange={(e) =>
                          handleSelectAllStatusesBO(e.target.checked)
                        }
                        className="border-blue-500 mt-2"
                      />
                      <label
                        htmlFor="select-all-bo"
                        className="ml-2 mt-2 text-sm"
                      >
                        Select All
                      </label>
                    </div>

                    {statusOptions
                      .filter((status) => status.label.includes("(BO)"))
                      .map((status) => (
                        <div key={status.label} className="flex items-center">
                          <input
                            type="checkbox"
                            id={status.label}
                            checked={status.values.every((value) =>
                              selectedStatuses.includes(value)
                            )}
                            onChange={(e) =>
                              handleStatusChange(status, e.target.checked)
                            }
                            className="border-blue-500"
                          />
                          <label
                            htmlFor={status.label}
                            className="ml-2 text-sm"
                          >
                            {status.label.slice(0, -4)}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div
              className={`${viewMode === "grid"
                ? "bg-white rounded-xl p-6 card-shadow"
                : "bg-white rounded-xl p-6 card-shadow"
                }`}
            >
              <div className="flex justify-between items-center mb-4">
                {/* <span className="text-md font-semibold mb-4">
                  In Progress Orders
                </span> */}
                <div className="relative">
                  <Input
                    placeholder="Search Orders"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                <div className="flex gap-2">
                  {selectedOrders.length > 0 && (
                    <button
                      onClick={handleStartPicking}
                      className="p-2 px-4 rounded flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Pick <ArrowRight size={20} />
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-2 px-4 rounded flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      Sort By <ChevronDown size={16} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-lg z-50">
                        <ul className="py-2 text-sm text-gray-700">
                          <li
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${sortOption === "date" ? "font-semibold" : ""
                              }`}
                            onClick={() => handleSortChange("date")}
                          >
                            Date (Newest)
                          </li>
                          <li
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${sortOption === "total" ? "font-semibold" : ""
                              }`}
                            onClick={() => handleSortChange("total")}
                          >
                            Total (Highest)
                          </li>
                          <li
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${sortOption === "platform" ? "font-semibold" : ""
                              }`}
                            onClick={() => handleSortChange("platform")}
                          >
                            Platform (A-Z)
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded ${viewMode === "table" ? "bg-gray-100" : ""
                      }`}
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100" : ""
                      }`}
                  >
                    <Grid size={20} />
                  </button>
                </div>
              </div>

              {viewMode === "table" ? (
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex justify-center items-center h-96 min-w-fit">
                      <ClipLoader
                        size={50}
                        color={"#AAFF00"}
                        loading={loading}
                      />

                      {/* <DotLottieReact
                        style={{ width: 270, height: 270 }}
                        src="https://lottie.host/7de87f8c-e7c8-4679-bedd-6b810cb1892a/fJE3PRnEVK.lottie"
                        loop
                        autoplay
                        loading={loading}
                        
                      /> */}
                    </div>
                  ) : (
                    <>
                      {!loading && filteredOrders.length === 0 ? (
                        <div className="flex justify-center items-center h-96 min-w-fit">
                          <img src={img1}></img>
                        </div>
                      ) : (
                        <div className="overflow-y-auto max-h-[400px]">
                          <table className="min-w-full">
                            <thead className="sticky top-0 bg-slate-100">
                              <tr className="border-b border-gray-400">
                                <th className="text-left py-3 px-2 text-sm text-left font-medium">
                                  {/* <Checkbox
                                    checked={selectAllOrders}
                                    onChange={(checked) => handleSelectAllOrders(checked)}
                                    className="border-gray-500"
                                  /> */}
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium">
                                  Order
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-medium">
                                  Platform
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium">
                                  Date
                                </th>
                                <th className="text-left py-3 px-1 text-sm font-medium">
                                  Lots/Items
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium"></th>
                                {/* <th className="text-left py-3 px-4 text-sm text-right font-medium">
                          Buyer
                        </th> */}
                                <th className="text-left py-3 px-4 text-sm text-right font-medium">
                                  Total
                                </th>
                                <th className="text-left py-3 px-4 text-sm text-right font-medium">
                                  Status
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {filteredOrders.map((order) => (
                                <tr
                                  key={order.brickosys_order_id}
                                  className="border-b border-gray-700"
                                >
                                  <td className="p-2">
                                    <Checkbox
                                      checked={selectedOrders.includes(
                                        order.brickosys_order_id
                                      )}
                                      onChange={(checked) =>
                                        handleOrderSelection(
                                          order.brickosys_order_id,
                                          checked
                                        )
                                      }
                                      className="border-gray-500"
                                    />
                                  </td>
                                  <td className="p-2">
                                    {/* <span
                              className={`mr-2 ${order.orderFrom === "BrickLink"
                                ? "text-blue-400"
                                : "text-green-400"
                                }`}
                            >
                              {order.orderFrom}
                            </span> */}
                                    {order.order_id}
                                  </td>
                                  <td className="p-2 text-center">
                                    {order.platform}
                                  </td>
                                  <td className="p-2">
                                    {formatDateBasedOnUserLocation(
                                      order.order_on
                                    )}
                                  </td>
                                  <td className="p-2">
                                    {order.items.length} /{" "}
                                    {getTotalItemsInOrder(order)}
                                  </td>
                                  <td className="p-2"></td>
                                  {/* <td className="p-2">{order.orderObject.paymentMethod}</td> */}
                                  <td className="p-4 text-right">
                                    ${order.total_price.toFixed(2)}
                                    {/* <br />
                                <span className="text-xs text-gray-500">
                                  + ${order.orderObject.shipping.toFixed(2)}
                                </span>
                                <br />
                                ${(order.total_price + order.orderObject.shipping).toFixed(2)} */}
                                  </td>
                                  <td className="p-2 text-right">
                                    <span
                                      className={`px-2 py-1 rounded text-sm ${["PACKED", "Processed"].includes(
                                        order.status
                                      )
                                        ? "bg-green-100 text-green-800"
                                        : "bg-purple-100 text-purple-800"
                                        }`}
                                    >
                                      {order.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="flex justify-center mt-4">
                            {/* <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="px-4 py-2 bg-transparent text-black rounded-r-lg disabled:text-slate-300"
                            >
                              &lt; 
                            </button>
                            <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="px-4 py-2 bg-transparent text-black rounded-r-lg disabled:text-slate-300"
                            >
                              &gt;
                            </button> */}
                            <button
                              onClick={handleLoadMore}
                              disabled={loadingMore || orders.length >= totalOrders} // Disable if already loading or all data is loaded
                              className={`px-4 py-2 bg-blue-600 text-white rounded ${orders.length >= totalOrders ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {loadingMore ? (
                                <ClipLoader size={20} color={"#FFF"} loading={true} /> // Show button loader
                              ) : (
                                "Load More"
                              )}
                            </button>

                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex justify-center items-center h-96 min-w-fit">
                      <ClipLoader
                        size={50}
                        color={"#AAFF00"}
                        loading={loading}
                      />

                      {/* <DotLottieReact
                      style={{ width: 270, height: 270 }}
                      src="https://lottie.host/7de87f8c-e7c8-4679-bedd-6b810cb1892a/fJE3PRnEVK.lottie"
                      loop
                      autoplay
                      loading={loading}
                      
                    /> */}
                    </div>
                  ) :
                    (
                      <>
                        {!loading && filteredOrders.length === 0 ? (
                          <div className="flex justify-center items-center h-96 min-w-96">
                            <img src={img1}></img>
                          </div>
                        ) : (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {filteredOrders.map((order) => (
                                <OrderCard
                                  key={order.brickosys_order_id}
                                  order={order}
                                  setSelectAllOrders={setSelectAllOrders}
                                  selectedOrders={selectedOrders}
                                  setSelectedOrders={setSelectedOrders}
                                  filteredOrders={filteredOrders}
                                />
                              ))}
                            </div>
                            <div className="flex justify-center mt-4">
                              {/* <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-transparent text-black rounded-r-lg disabled:text-slate-300"
                      >
                        &lt; 
                      </button>
                      <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-transparent text-black rounded-r-lg disabled:text-slate-300"
                      >
                        &gt; 
                      </button> */}
                              <button
                                onClick={handleLoadMore}
                                disabled={loadingMore || orders.length >= totalOrders} // Disable if already loading or all data is loaded
                                className={`px-4 py-2 bg-blue-600 text-white rounded ${orders.length >= totalOrders ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {loadingMore ? (
                                  <ClipLoader size={20} color={"#FFF"} loading={true} /> // Show button loader
                                ) : (
                                  "Load More"
                                )}
                              </button>


                            </div>
                          </div>
                        )}
                      </>
                    )}

                </div>
              )}

              {
                selectedOrders.length > 0 && (
                  <StartPickUpButton onClick={handleStartPicking} />
                ) // setSelectAllOrders, selectedOrders, setSelectedOrders, filteredOrders
              }
            </div>
          </div>
        </div>

        <div className="">
          <div className="space-y-1 mb-6 row-span-3 mt-3">
            <div className="bg-white w-full rounded-xl p-4 card-shadow">
              {/* Container with same width as calendar */}
              <div className="w-full flex flex-col items-center">
                {/* Date Picker and Clear Button inside a div with full width */}
                <div className="w-full flex items-center gap-2 mb-4">
                  <div className="flex-1">
                    <DatePicker
                      selected={startDate}
                      onChange={(update) => handleRangeChange(update)}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      maxDate={new Date()}
                      className=" p-2 border rounded-md"
                      placeholderText="Select date range"
                    />
                  </div>
                  {/* Clear Button */}
                  <button
                    onClick={clearDateFilter}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-200 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Calendar - Ensure it's same width as Date Picker */}
                <div className="w-full">
                  <Calendar
                    onChange={handleRangeChange}
                    selectRange={true}
                    value={dateRange}
                    maxDate={new Date()}
                    className="w-full border-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and Task sections */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 card-shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">Task</h2>
                {/* <button className="p-1 rounded hover:bg-gray-100">
        <Settings size={16} />
      </button> */}
              </div>

              {/* Loader when data is being fetched */}
              {taskloading && (
                <div className="flex justify-center items-center h-52 min-w-fit">
                  <ClipLoader
                    size={50}
                    color={"#AAFF00"}
                    loading={taskloading}
                  />
                </div>
              )}
              {/* Show message when no tasks are available */}
              {!taskloading &&
                (tasks.length === 0 || tasks.length === undefined) && (
                  <div className="text-center text-gray-500 text-lg h-52 font-semibold flex justify-center items-center">
                    No tasks available
                  </div>
                )}

              <div className="space-y-3">
                {/* Show tasks if available */}
                {tasks.length > 0 &&
                  tasks.map((order) => (
                    <div key={order.order_id} className="mb-6 border-b pb-4">
                      {/* Order ID */}
                      <h2 className="text-xl font-bold mb-2">Order ID: {order.order_id}</h2>

                      {/* Items under Order */}
                      <ul className="space-y-2 list-disc pl-6">
                        {order.notes.map((note) => (
                          <li key={note.item_id} className="relative group flex items-center justify-between">
                            <div>
                              {/* Item Name & Note */}
                              <p className="text-md font-semibold">
                                {decodeHtmlEntities(note.item_name)}
                              </p>
                              <p className="text-gray-500 text-sm">{note.note}</p>

                              {/* Tooltip for Item ID (Visible on Hover) */}
                              <span className="absolute left-0 -top-6 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                Item ID: {note.item_id.slice(4)}
                              </span>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() =>
                                toggleMissingItems(
                                  note.brickosysId, // brickosys_order_id
                                  note.item_id,     // item_id
                                  note.id,          // id
                                )
                              }
                              disabled={loadingItemId === note.id} // disable while deleting
                              className="ml-4 flex items-center justify-center"
                            >
                              {loadingItemId === note.id ? (
                                <ClipLoader size={14} color="#FF0000" />
                              ) : (
                                <Trash2 size={18} className="text-red-500 cursor-pointer" />
                              )}
                            </button>

                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default OrderPageContent;
