import PickUpItems from "./PickUpItem";
import OrdersDetails from "./OrdersDetails";
import Header from "./Header";
import axios from "axios";
import { getTotalLotsAndItems, getTotalItemsInOrder, findOrderIndexForItem, fomartImageSrcString, getContrastTextColor } from "./helper/constant";
import { useState, useEffect } from "react";
import {
  Calendar,
  Bell,
  MessageCircle,
  ExternalLink,
  Box,
  ArrowRight
} from "react-feather";
import { Link } from "react-router-dom";
import ProgressBar from "./ui/ProgressBar";
import DisplayItems from "./ui/DisplayItems";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

export default function PickUpItemsPage() {
  // const [allOrders, setAllOrders] = useState([]); // all the orders we chose to pick
  // const [totalLotsAndItems, setTotalLotsAndItems] = useState({});
  // const [missingItems, setMissingItems] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [missingItemInput, setMissingItemInput] = useState(false);
  // const [processedItems, setProcessedItems] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // all the orders we chose to pick
  const [currentActiveItem, setcurrentActiveItem] = useState(); //for detailed view of an item next to pick.
  const [processedItems, setProcessedItems] = useState([]); //Ids of items that are picked
  const [allItems, setAllItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [totalLotsAndItems, setTotalLotsAndItems] = useState({})
  const [saveAndContinueLoading, setSaveAndContinueLoading] = useState(false)
  const [processOrdersLoader, setProcessOrdersLoader] = useState(false)
  const [missingItemInput, setMissingItemInput] = useState(false);
  const [missingNote, setMissingNote] = useState("");
  const [missingItems, setMissingItems] = useState([]);

  const fetchOrders = async () => {
    try {
      // Extract the current URL's query parameters
      const searchParams = new URLSearchParams(window.location.search);

      // Get the brickosys_order_ids parameter and split it into an array
      const idsParam = searchParams.get('brickosys_orderId') || '';

      // Call the API with the extracted order IDs
      const response = await axios.get(`http://localhost:4000/api/pick-orders?brickosys_order_ids=${idsParam}`);
      const orders = response.data;


      setAllOrders(orders);
      setTotalLotsAndItems(getTotalLotsAndItems(orders))

      const missingItemsArray = []; // Initialize an array for missing items

      orders.forEach((order) => {
        order.items.forEach((item) => {
          if (item.picked === true || item.picked === 'true') {
            toggleItemProcessed(item.itemId, order.orderObject.orderId, order.brickosysId);
          }

          // Check for missing items based on the note field
          if (item.note && item.note.trim() !== '') {
            missingItemsArray.push({
              itemId: item.itemId,
              orderId: order.orderObject.orderId,
              brickosysId: order.brickosysId,
              note: item.note,
            });
          }
        });
      });

      // Update the state for missing items
      setMissingItems(missingItemsArray);


    } catch (error) {
      console.log("something went wrong!", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  useEffect(() => {

    const itemsArray = allOrders.flatMap((order) =>
      order.orderObject.items.map((item) => ({
        ...item,
        orderId: order.orderObject.orderId,
        brickosysId: order.brickosysId
      }))
    );

    const sortedRemainingItems = itemsArray.sort((a, b) => {
      if (a.location < b.location) return -1;
      if (a.location > b.location) return 1;
      return 0;
    });

    // Find the first unprocessed and non-missing item
    const nextActiveItem = sortedRemainingItems.find(
      (item) =>
        !processedItems.some(
          (processedItem) =>
            processedItem.itemId === item.itemId &&
            processedItem.orderId === item.orderId
        ) &&
        !missingItems.some(
          (missingItem) =>
            missingItem.itemId === item.itemId &&
            missingItem.orderId === item.orderId
        )
    );

    setAllItems(itemsArray);
    setcurrentActiveItem(nextActiveItem || null); // Set to null if all items are processed or missing
  }, [allOrders, processedItems, missingItems]);


  useEffect(() => {
    const item = missingItems.find((missingItem) => missingItem.itemId == currentActiveItem?.itemId);
    setMissingNote((prev) => item?.note || '');


  }, [currentActiveItem])

  const toggleItemProcessed = (itemId, orderId, note = '') => {
    // clickAudio();

    const brickosysId = findBrickOsysId(itemId, orderId)
    setMissingItemInput(false);

    setProcessedItems((prev) => {
      const exists = prev.some(
        (item) => item.itemId === itemId && item.orderId === orderId
      );

      if (exists) {
        // Remove the item if it already exists
        return prev.filter(
          (item) => !(item.itemId === itemId && item.orderId === orderId)
        );
      } else {
        // Add the item if it does not exist

        return [...prev, { orderId, itemId, brickosysId, note }];
      }
    });
  };

  const calculateProgress = () => {
    let packedItems = 0;
    let packedLots = 0;
    let packedOrders = 0;
    let packedOrdersIds = [];

    // This will track order-wise progress
    const orderProgress = {};

    // Loop through each order
    allOrders.forEach((order) => {
      let pickedItemsInOrder = 0; // Counter for picked items in this order
      let pickedLotsInOrder = 0; // Counter for picked lots in this order
      let lotPackedTracker = [];

      // Initialize order's progress if not yet initialized
      if (!orderProgress[order.orderObject.orderId]) {
        orderProgress[order.orderObject.orderId] = {
          pickedItems: 0,
          pickedLots: 0,
          completed: 0, // Add completed field for order
        };
      }

      // Loop through each item (lot) in the order
      order.orderObject.items.forEach((item) => {
        // Check if the item is processed (picked)
        const isItemProcessed = processedItems.some(
          (processedItem) => processedItem.itemId === item.itemId && processedItem.orderId === order.orderObject.orderId
        );

        // If the item is processed, increment the picked items counter by its quantity
        if (isItemProcessed) {
          packedItems += item.qty; // Add the qty of the item to the packed items total
          pickedItemsInOrder += item.qty; // Increment picked items for this order

          // Check if this lot is fully processed (i.e., all qty of the item is picked)
          const totalQtyForLot = item.qty; // Since each item is a lot, its qty is the total quantity of that lot

          // If the total quantity of the item has been processed, mark this lot as packed
          if (lotPackedTracker[item.itemId]) {
            lotPackedTracker[item.itemId] += item.qty;
          } else {
            lotPackedTracker[item.itemId] = item.qty;
          }

          if (lotPackedTracker[item.itemId] >= totalQtyForLot) {
            packedLots += 1;
            pickedLotsInOrder += 1;
          }
        }
      });

      // Update the order's progress
      orderProgress[order.orderObject.orderId].pickedItems = pickedItemsInOrder;
      orderProgress[order.orderObject.orderId].pickedLots = pickedLotsInOrder;

      // Calculate order progress based on both items and lots
      const totalItemsInOrder = order.orderObject.items.reduce((acc, item) => acc + item.qty, 0); // Total items in the order
      const totalLotsInOrder = order.orderObject.items.length; // Total lots (items in the order)

      const orderItemsCompletion = Math.round((pickedItemsInOrder / totalItemsInOrder) * 100);
      const orderLotsCompletion = Math.round((pickedLotsInOrder / totalLotsInOrder) * 100);

      // Calculate order progress by averaging items and lots completion
      orderProgress[order.orderObject.orderId].completed = Math.round((orderItemsCompletion + orderLotsCompletion) / 2);

      // After checking all items in the order, check if the order is fully packed
      const allItemsPackedInOrder = order.orderObject.items.every((item) =>
        processedItems.some(
          (processedItem) =>
            processedItem.itemId === item.itemId &&
            processedItem.orderId === order.orderObject.orderId
        )
      );

      if (allItemsPackedInOrder) {
        packedOrders += 1; // Increment packed orders if all items in the order are packed
        packedOrdersIds.push(order.brickosysId)
      }
    });

    // Overall completion based on both items and lots
    const totalItems = allOrders.reduce((acc, order) => acc + order.orderObject.items.reduce((acc, item) => acc + item.qty, 0), 0);
    const totalLots = allOrders.reduce((acc, order) => acc + order.orderObject.items.length, 0); // Total number of lots (items)

    const overallItemsCompletion = Math.round((packedItems / totalItems) * 100);
    const overallLotsCompletion = Math.round((packedLots / totalLots) * 100);

    // Calculate overall progress based on both items and lots
    const overallCompleted = Math.round((overallItemsCompletion + overallLotsCompletion) / 2);

    return {
      packedItems,  // Total number of items packed (considering quantity)
      packedLots,    // Total number of lots packed (count of processed lots)
      packedOrders,  // Total number of orders fully packed
      orderProgress,  // Order-wise progress based on items
      overallCompleted,  // Overall completion based on both items and lots
      packedOrdersIds
    };
  };

  const handleProcessOrders = async () => {
    try {
      setProcessOrdersLoader((prev) => !prev)
      // Step 1: Fetch the picked order IDs
      const { packedOrdersIds } = calculateProgress();

      // Step 2: Extract order details for the picked IDs from the `allOrders` state
      const updates = allOrders
        .filter(order => packedOrdersIds.includes(order.brickosysId))
        .map(order => ({
          source: order.orderFrom, // Replace with actual field name
          brickosysId: order.brickosysId, // Replace with actual field name
          status: "PACKED", // Set the desired status
          pickUpDate: new Date().toISOString(), // Use the current date/time or a specific value
          pickUpBy: "holboxai", // Replace with actual logic to get the picker name
        }));


      // Step 3: Construct the API request body
      const body = updates;

      // Step 4: Call the API to update order status
      const response = await axios.post('http://localhost:4000/api/update-order-status', body);


      if (response.data.statusCode != 200) {

        toast.error("Could not update status!");
      }
      // Step 5: Handle success response
      else {
        handleContinueLater();
        if (response.data.failures.length <= 0) {
          toast.success("All Order status updated successfully!");
        }
        else {
          toast.success("Order status updated successfully!");
          for (let i = 0; i < response.data.failures.length; i++) {
            const failure = response.data.failures[i];
            toast.error(`Could not update status of order ${failure.brickosysId}: ${failure.error}`);
          }

        }

      }
    } catch (error) {
      // Step 6: Handle error response
      toast.error("Something went wrong!");
    }
    finally {
      setProcessOrdersLoader(false)
    }
  };

  const handleContinueLater = async () => {
    setSaveAndContinueLoading((prev) => !prev);
    // Save current progress in our database so person can come later and continue.
    try {
      // Step 1: Prepare body object which has all the processed Items with one additional property 'isPicked'

      const pickedItems = allOrders.flatMap(order =>
        order.items.map(item => ({
          brickosysId: order.brickosysId,
          itemId: item.itemId,
          note: missingItems.find(
            missingItem => missingItem.orderId == order.brickosysId && missingItem.itemId == item.itemId
          )?.note,
          isPicked: processedItems.some(
            processedItem => processedItem.brickosysId === order.brickosysId && processedItem.itemId === item.itemId
          ) ? 'true' : 'false',
        }))
      );

      // Step 3: Construct the API request body
      const body = pickedItems;

      // Step 4: Call the API to update order status
      const response = await axios.post('http://localhost:4000/api/update-item-progress', body);

      if (response.data.failures.length <= 0) {
        toast.success("Progress saved successfully.");
      }
      else {
        toast.success("Progress saved successfully.");
        for (let i = 0; i < response.data.failures.length; i++) {
          const failure = response.data.failures[i];
          toast.error(`Could not save details for few items!`);
        }


      }
    } catch (error) {
      // Step 6: Handle error response
      console.log(error);

      toast.error("Something went wrong!");
    }
    finally {
      setSaveAndContinueLoading(false);
    }

  }


  const toggleMissingItems = async (orderId, itemId, missingNote, operation) => {
    try {
      if (operation == 'add') {
        if (!missingNote.trim()) {
          toast.error("Missing note cannot be empty.");
          return;
        }

        // Update the `missingItems` state
        setMissingItems((prev) => {
          const itemIndex = prev.findIndex(
            (item) => item.orderId === orderId && item.itemId === itemId
          );

          // If the item already exists, update its note
          if (itemIndex !== -1) {
            const updatedItems = [...prev];
            updatedItems[itemIndex].note = missingNote;
            return updatedItems;
          }

          // Otherwise, add a new entry for the missing item
          return [...prev, { orderId, itemId, note: missingNote }];
        });

      }

      else if (operation === "remove") {
        // Remove the item from the `missingItems` state
        setMissingItems((prev) =>
          prev.filter(
            (item) => !(item.orderId === orderId && item.itemId === itemId)
          )
        );
      }

    } catch (error) {
      console.error("Error adding missing note:", error);
      toast.error("Something went wrong while updating the note.");
    }
  };

  const findBrickOsysId = (itemId, orderId) => {
    const order = allOrders.find((order) => order.orderObject.orderId === orderId);

    if (order) {
      const itemExists = order.orderObject.items.some((item) => item.itemId === itemId);
      if (itemExists) {
        return order.brickosysId; // Return the brickosysId if both match
      }
    }
    return null; // Return null if no match found
  };

  const expandItem = (item) => {

    setcurrentActiveItem(item)
  }

  return (
    <div className="flex-1">
      <Header />
      <ToastContainer position="bottom-center" />
      {isLoading ? <div className="flex justify-center items-center h-fit-screen"><ClipLoader className="" size={50} color={"#AAFF00"} /></div> :
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* Item Details section */}
          {/* <PickUpItems /> */}

          <div className="flex-1 bg-gray-50">
            <div className="p-6">
              <h2 className="text-md font-semibold mb-6">Pick Up Items</h2>

              <div className="space-y-3">
                {allItems.map((item, index) => (
                  item.itemId === currentActiveItem?.itemId ? (
                    <div
                      className="space-y-4 click_element_smooth_hover"
                      key={item.itemId}
                      onClick={(e) =>
                        !missingNote ? toggleItemProcessed(item.itemId, item.orderId, item.note) : expandItem(item)
                      }
                    >
                      <div className={`rounded-lg ${missingNote ? "bg-red-100" : "bg-white border border-gray-200 shadow-sm"}`}>
                        <div className="p-6">
                          <div className="flex gap-6">
                            {/* Image */}
                            <div className="w-[300px] flex items-center">
                              <div className="overflow-hidden rounded-lg border border-gray-300 h-fit">
                                {item.color_code !== "N/A" ? (
                                  <div
                                    className="rounded-t-lg p-2 text-center font-medium text-white w-[300px]"
                                    style={{
                                      backgroundColor: `#${item.color_code}`,
                                      color: getContrastTextColor(item.color.toLowerCase()),
                                    }}
                                  >
                                    {item.color.toUpperCase()}
                                  </div>
                                ) : (
                                  <div
                                    className="rounded-t-lg p-2 text-center font-medium text-black w-[300px] bg-gray-200"
                                  >
                                    {item.color.toUpperCase()}
                                  </div>
                                )}

                                <img
                                  src={fomartImageSrcString(item.itemType, item.colorId, item.SKU) || `https:` + item.img}
                                  alt="Minifigure Shield"
                                  className="h-[200px] w-full object-contain"
                                />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-6">
                              {/* Title Section */}
                              <div className="space-y-2">
                                <div className="bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 w-fit rounded-lg">
                                  {item.itemType}
                                </div>
                                <h2 className="text-xl text-gray-800 font-semibold">
                                  {item.itemName}
                                </h2>
                                <p className="text-sm text-gray-600">{item.SKU}</p>
                              </div>

                              {/* Location and Pick Section */}
                              <div
                                className="flex gap-4"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent the toggleItemProcessed function from being called
                                }}
                              >
                                {!missingItemInput ? (
                                  <>
                                    {/* Location */}
                                    <div className="flex-1 flex-col">
                                      <label className="mb-1 block text-xs font-medium text-gray-700">
                                        LOCATION
                                      </label>
                                      <div className="rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-base text-gray-800 h-10">
                                        {item.location}
                                      </div>
                                    </div>

                                    {/* Pick */}
                                    <div>
                                      <label className="mb-1 block text-xs font-medium text-gray-700">
                                        PICK
                                      </label>
                                      <div className="flex items-center">
                                        <span className="h-10 w-16 border border-gray-300 bg-gray-50 text-base relative pt-2 pl-2 text-gray-800 rounded-l-lg">
                                          {item.qty}
                                        </span>
                                        <span className="text-lg font-medium text-purple-600 bg-purple-100 h-10 w-10 pt-2 text-center rounded-r-lg">
                                          {findOrderIndexForItem(allOrders, item.itemId, item.orderId)?.orderIndex + 1}
                                        </span>
                                      </div>
                                    </div>

                                  </>
                                ) : (
                                  <>
                                    <div className="flex-1">
                                      <label className="mb-2 block text-sm font-medium text-gray-700">
                                        NOTES
                                      </label>
                                      <textarea
                                        type="text"
                                        value={missingNote}
                                        onChange={(e) => setMissingNote(e.target.value)}
                                        className="rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-800 h-[60px] w-full"
                                        placeholder="Enter Notes"
                                      />

                                      <div className="flex space-x-2">
                                        <button
                                          className="mt-2 flex justify-center min-w-[80px] items-center bg-purple-100 text-purple-600 h-8 px-3 py-1 rounded-md text-xs cursor-pointer"
                                          onClick={() =>
                                            toggleMissingItems(item.orderId, item.itemId, missingNote, "add")
                                          }
                                        >
                                          Add Note
                                        </button>
                                        <button
                                          className="mt-2 flex justify-center min-w-[80px] items-center bg-green-100 text-green-600 h-8 px-3 py-1 rounded-md text-xs cursor-pointer"
                                          onClick={() =>
                                            toggleMissingItems(item.orderId, item.itemId, missingNote, "remove")
                                          }
                                        >
                                          Remove Notes
                                        </button>

                                      </div>

                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Missing/Problem Section */}
                              <div className="flex items-center gap-2 text-sm">
                                <span
                                  className="text-gray-500 hover:text-gray-800 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMissingItemInput((prev) => !prev);
                                  }}
                                >
                                  Missing / Problem
                                </span>
                              </div>

                              {/* Remaining Count */}
                              {/* <div className="text-sm text-gray-600">2 REMAINING (demo)</div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <DisplayItems
                      pool={
                        processedItems?.some(
                          (processedItem) =>
                            processedItem.itemId === item.itemId &&
                            processedItem.orderId === item.orderId
                        )
                          ? "processed"
                          : missingItems?.some(
                            (missingItem) =>
                              missingItem.itemId === item.itemId &&
                              missingItem.orderId === item.orderId
                          )
                            ? "missing"
                            : undefined
                      }
                      item={item}
                      key={item.itemId}
                      allOrders={allOrders}
                      expandItem={expandItem}
                      toggleItemProcessed={toggleItemProcessed}
                    />
                  )
                ))}


              </div>

              {/* <div className="mt-6 flex justify-center">
                <Link to="/orders">
                  <button className="bg-blue-600 text-sm text-white font-semibold px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    Finish Pick Up <ArrowRight size={18} />
                  </button>
                </Link>
              </div> */}
              {calculateProgress().packedOrders > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleProcessOrders}
                    className="bg-blue-600 text-sm text-white font-semibold px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    {processOrdersLoader
                      ? 'Processing...'
                      : `Process ${calculateProgress().packedOrders} Order${calculateProgress().packedOrders > 1 ? 's' : ''}`}
                    <ArrowRight size={18} />

                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Item Details section end */}

        </div>
        <div className="col-span-1">

          {/* OrdersDetails section */}
          {/* <OrdersDetails allOrders={allOrders}/> */}
          <div className="flex-1 bg-gray-50 min-h-screen">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
                <div className="flex items-center gap-6">
                  <button className="relative">
                    <Calendar className="w-6 h-6 text-[#6366F1]" />
                  </button>
                  <button className="relative">
                    <Bell className="w-6 h-6 text-[#6366F1]" />
                  </button>
                  <button className="relative">
                    <MessageCircle className="w-6 h-6 text-[#6366F1]" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {allOrders.map((order, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-black text-white px-3 py-1 rounded-md text-sm font-semibold">
                            O no.#{order.brickosysId}
                          </div>
                          {/* <Link to={`/order/${order.orderObject.orderId}`}>
                            <ExternalLink size={14} className="text-gray-500" />
                          </Link> */}
                        </div>
                        <span className="text-sm mt-2 font-semibold">
                          {order.orderObject.buyer}
                        </span>
                        <br />
                        <span className="text-xs font-semibold text-gray-500">
                          {order.orderObject.orderDate}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-600">
                            Payment : {order.orderObject.paymentStatus}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                            {order.orderObject.status}
                          </span>
                          {/* <span className="ml-auto text-sm font-semibold   text-gray-600">
                            {order.orderObject.status}
                          </span> */}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-[#F9F9F9] rounded-lg p-4 flex justify-center gap-8">
                      <div className="flex items-center gap-2">
                        <Box className="text-black" size={20} />
                        <span className="text-sm font-semibold text-black">
                          {calculateProgress().orderProgress[order.orderObject.orderId].pickedLots || 0} / {order.orderObject.items.length} lots
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Box className="text-black" size={20} />
                        <span className=" text-sm font-semibold text-black">
                          {calculateProgress().orderProgress[order.orderObject.orderId].pickedItems || 0} / {getTotalItemsInOrder(order)} items
                        </span>
                      </div>
                    </div>

                    <ProgressBar progress={calculateProgress().orderProgress[order.orderObject.orderId].completed} />

                    <div className="absolute top-6 right-6">
                      <span className="text-md font-medium text-gray-400">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button className="bg-blue-600 text-sm font-semibold text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleContinueLater}>
                  {saveAndContinueLoading ? 'Saving...' : 'Continue Later'}
                </button>
              </div>
            </div>
          </div>
          {/* OrderDetails Section end */}

        </div>
      </div>
}
    </div>
  );
}
