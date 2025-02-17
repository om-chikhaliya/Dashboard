import { useEffect, useState } from "react";
import Checkbox from "./ui/Checkbox";
import {
  Settings,
  Grid,
  List,
} from "react-feather";
import { Box } from "react-feather";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { storeOptions, statusOptions, getTotalItemsInOrder } from "./helper/constant";
import { ClipLoader } from "react-spinners";
import Header from "./Header";
import img1 from "../assets/noorder.png"
import api from "./helper/api";


const tasks = [
  { id: 1, title: "Schedule post Dusk&Dawn", completed: true },
  { id: 2, title: "Design post for Holi", completed: true },
  { id: 3, title: "Brainstorming new project", completed: false },
  { id: 4, title: "Re-Branding Discussion", completed: false },
];



function OrderCard({ order, setSelectAllOrders, selectedOrders, setSelectedOrders, filteredOrders }) {


  // Handle individual order selection
  const handleOrderSelection = (id, checked) => {
    setSelectedOrders((prev) =>
      checked ? [...prev, id] : prev.filter((orderId) => orderId !== id)
    )
    setSelectAllOrders(
      checked && selectedOrders.length + 1 === filteredOrders.length
    )
  }


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
            O no.#{order.order_id}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-medium">{order.brickosys_order_id}</h3>
        </div>
        <p className="text-gray-600 text-sm">{new Date(order.order_on).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}</p>
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
          {order.total_price}
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
        >
          Start Pick Up
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const [orders, setOrders] = useState([])
  const [selectedStores, setSelectedStores] = useState(storeOptions)
  const [selectAllStatuses, setSelectAllStatuses] = useState(true)
  const [selectedStatuses, setSelectedStatuses] = useState(statusOptions.flatMap((status) => status.values)) // Initially select all
  const [selectAllOrders, setSelectAllOrders] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/order/sync");
        console.log("sync order: ", res.data)
        const response = await api.get("/order");
        console.log(response.data)
        setFilteredOrders(response.data);
        setOrders(response.data);

        // console.log(response.data)
        // console.log(filteredOrders);
      } catch (err) {
        // setError(err.message); // Save error message to state
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();


  }, [])

  useEffect(() => {

    const filtered = orders.filter((order) => {

      // console.log(order.order_id)
      const matchesSearch =
        !searchTerm ||
        order.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_id.toString().includes(searchTerm) ||
        new Date(order.order_on).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStore = selectedStores.includes(
        order.platform === "BL" ? "BL" : "BO"
      )

      const matchesStatus = selectedStatuses.includes(order.status)



      return matchesSearch && matchesStore && matchesStatus
    })

    setFilteredOrders(filtered)

  }, [orders, searchTerm, selectedStores, selectedStatuses])

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const handleStoreChange = (store, checked) => {
    setSelectedStores(
      checked
        ? [...selectedStores, store]
        : selectedStores.filter((s) => s !== store)
    )
  }

  const handleSelectAllStatuses = (checked) => {
    // setSelectAllStatuses(checked)
    // setSelectedStatuses(checked ? statusOptions : [])
    setSelectAllStatuses(checked);
    setSelectedStatuses(
      checked ? statusOptions.flatMap((status) => status.values) : []
    ); // Select or deselect all statuses
  }

  // Handle individual status selection
  const handleStatusChange = (status, isChecked) => {
    // const updatedStatuses = checked
    //   ? [...selectedStatuses, status]
    //   : selectedStatuses.filter((s) => s !== status)
    // setSelectedStatuses(updatedStatuses)
    // setSelectAllStatuses(updatedStatuses.length === statusOptions.length)

    const updatedStatuses = isChecked
      ? [...selectedStatuses, ...status.values] // Add values when checked
      : selectedStatuses.filter((value) => !status.values.includes(value)); // Remove values when unchecked

    setSelectedStatuses(updatedStatuses);
    setSelectAllStatuses(
      updatedStatuses.length === statusOptions.flatMap((status) => status.values).length
    ); // Update "Select All" checkbox
  }

  const handleSelectAllOrders = (checked) => {
    setSelectAllOrders(checked)
    setSelectedOrders(checked ? filteredOrders.map((order) => order.brickosys_order_id) : [])
  }

  // Handle individual order selection
  const handleOrderSelection = (id, checked) => {
    setSelectedOrders((prev) =>
      checked ? [...prev, id] : prev.filter((orderId) => orderId !== id)
    )
    setSelectAllOrders(
      checked && selectedOrders.length + 1 === filteredOrders.length
    )
  }


  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  
    // Convert selected date to YYYY-MM-DD (local format)
    const selectedDateString = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
  
    // Filter orders based on the selected date
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.order_on).toLocaleDateString("en-CA"); // "YYYY-MM-DD"
      return orderDate === selectedDateString;
    });
  
    setFilteredOrders(filtered);
  };
  

  const handleStartPicking = () => {
    if (selectedOrders.length > 0) {
      console.log(selectedOrders)
      const orderIds = selectedOrders.join(',');
      window.location.href = `/pickorders?brickosys_orderId=${orderIds}`;  // Using window.location.href
    }
  };

  return (
    <div className="py-6 pt-0">
      <Header handleSearch={handleSearch} searchTerm={searchTerm}></Header>
      <div className="bg-white rounded-xl p-6 card-shadow mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-md font-semibold">Stores</span>
          </div>

          {/* Store checkboxes */}
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

          {/* Order status */}
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
      </div>

      {/* Order list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div
            className={`${viewMode === "grid"
              ? "bg-white rounded-xl p-6 card-shadow"
              : "bg-white rounded-xl p-6 card-shadow"
              }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-md font-semibold mb-4">
                In Progress Orders
              </span>
              <div className="flex gap-2">
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
                {loading ? <div className="flex justify-center items-center h-96 min-w-fit">
                  <ClipLoader size={50} color={"#AAFF00"} loading={loading} />
                </div> :
                  <>
                    {!loading && filteredOrders.length === 0 ? <div className="flex justify-center items-center h-96 min-w-fit"><img src={img1}></img></div> :
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-400">
                            <th className="text-left py-3 px-2 text-sm text-left font-medium">
                              <Checkbox
                                checked={selectAllOrders}
                                onChange={(checked) => handleSelectAllOrders(checked)}
                                className="border-gray-500"
                              />
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium">
                              Order#
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
                            <th className="text-left py-3 px-4 text-sm font-medium">

                            </th>
                            {/* <th className="text-left py-3 px-4 text-sm text-right font-medium">
                        Payment
                      </th> */}
                            <th className="text-left py-3 px-4 text-sm text-right font-medium">
                              Total
                            </th>
                            <th className="text-left py-3 px-4 text-sm text-right font-medium">
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody >
                          {filteredOrders.map((order) => (
                            <tr key={order.brickosys_order_id} className="border-b border-gray-700">
                              <td className="p-2">
                                <Checkbox
                                  checked={selectedOrders.includes(order.brickosys_order_id)}
                                  onChange={(checked) =>
                                    handleOrderSelection(order.brickosys_order_id, checked)
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
                              <td className="p-2 text-center">{order.platform}</td>
                              <td className="p-2">{new Date(order.order_on).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}</td>
                              <td className="p-2">
                                {order.items.length} / {getTotalItemsInOrder(order)}
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
                                  className={`px-2 py-1 rounded text-sm ${order.status.includes('PACKED', 'PAID')
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
                    }</>
                }
              </div>

            ) : (<>{!loading && filteredOrders.length === 0 ? <div className="flex justify-center items-center h-96 min-w-96"><img src={img1}></img></div> :
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.brickosys_order_id} order={order}
                    setSelectAllOrders={setSelectAllOrders}
                    selectedOrders={selectedOrders} setSelectedOrders={setSelectedOrders}
                    filteredOrders={filteredOrders}
                  />
                ))}
              </div>
            }
            </>
            )}
            {
              selectedOrders.length > 0 && <StartPickUpButton onClick={handleStartPicking} /> // setSelectAllOrders, selectedOrders, setSelectedOrders, filteredOrders
            }

          </div>
        </div>

        {/* Calendar and Task sections */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-4 card-shadow">
            {/* <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <button className="text-purple-600 border-b-2 border-purple-600 pb-1">
                  Monthly
                </button>
                <button className="text-gray-500 pb-1">Daily</button>
              </div>
              <div className="flex gap-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronDown size={20} />
                </button>
              </div>
            </div> */}
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="w-full border-none"
            />
          </div>

          <div className="bg-white rounded-xl p-4 card-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Task</h2>
              <button className="p-1 rounded hover:bg-gray-100">
                <Settings size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <label key={task.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="mt-1 rounded"
                    onChange={() => { }}
                  />
                  <span
                    className={
                      task.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {task.title}
                  </span>
                </label>
              ))}
            </div>
            <button className="w-full mt-4 bg-black text-white rounded-lg py-2">
              Schedule Task
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default OrderPageContent;
