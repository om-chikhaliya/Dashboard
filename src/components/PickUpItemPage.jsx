import Header from "./Header";
import { getTotalLotsAndItems, getTotalItemsInOrder, findOrderIndexForItem, fomartImageSrcString, getContrastTextColor } from "./helper/constant";
import { useState, useEffect } from "react";
import {
  Calendar,
  Bell,
  MessageCircle,
  Box,
  ArrowRight
} from "react-feather";
import ProgressBar from "./ui/ProgressBar";
import DisplayItems from "./ui/DisplayItems";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import api from "./helper/api";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


export default function PickUpItemsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
  const [showProcessed, setShowProcessed] = useState(true);

  const navigate = useNavigate()
  const fetchOrders = async () => {
    try {
      // Extract the current URL's query parameters
      const searchParams = new URLSearchParams(window.location.search);

      // Get the brickosys_order_ids parameter and split it into an array
      const idsParam = searchParams.get('brickosys_orderId') || '';

      // Call the API with the extracted order IDs
      const response = await api.get(`/order/pick-orders?brickosys_order_ids=${idsParam}`);
      const orders = response.data;


      setAllOrders(orders);

      setTotalLotsAndItems(getTotalLotsAndItems(orders))

      const missingItemsArray = []; // Initialize an array for missing items

      orders.forEach((order) => {
        order.items.forEach((item) => {
          // if (item.picked === true || item.picked === 'true') {
          //   console.log("picked true")
          //   toggleItemProcessed(item.item_id, order.order_id, order.brickosys_order_id);
          // }

          // Check for missing items based on the note field
          if (item.note && item.note.trim() !== '') {
            missingItemsArray.push({
              item_id: item.item_id,
              order_id: order.order_id,
              brickosys_order_id: order.brickosys_order_id,
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
    if (allOrders.length > 0) {
      setProcessedItems((prevProcessed) => {
        const updatedProcessedItems = [...prevProcessed];

        allOrders.forEach((order) => {
          order.items.forEach((item) => {
            if ((item.picked === true || item.picked === 'true')) {
              // Avoid duplicate processing
              const exists = updatedProcessedItems.some(
                (pItem) => pItem.item_id === item.item_id && pItem.order_id === order.order_id
              );

              if (!exists) {

                updatedProcessedItems.push({
                  order_id: order.order_id,
                  item_id: item.item_id,
                  brickosys_order_id: order.brickosys_order_id,
                  note: item.note || '',
                });
              }
            }
          });
        });

        return updatedProcessedItems; // ✅ Return updated state only once
      });
    }
  }, [allOrders]);

  useEffect(() => {

  }, [processedItems]);


  useEffect(() => {

    const itemsArray = allOrders.flatMap((order) =>
      order.items.map((item) => ({
        ...item,
        order_id: order.order_id,
        brickosys_order_id: order.brickosys_order_id
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
            processedItem.item_id === item.item_id &&
            processedItem.order_id === item.order_id
        ) &&
        !missingItems.some(
          (missingItem) =>
            missingItem.item_id === item.item_id &&
            missingItem.order_id === item.order_id
        )
    );

    setAllItems(itemsArray);
    setcurrentActiveItem(nextActiveItem || null); // Set to null if all items are processed or missing
  }, [allOrders, processedItems, missingItems]);


  useEffect(() => {
    const item = missingItems.find((missingItem) => missingItem.item_id == currentActiveItem?.item_id);
    setMissingNote((prev) => item?.note || '');


  }, [currentActiveItem])

  const toggleItemProcessed = (item_id, order_id, note = '') => {
    // clickAudio(); 

    const brickosys_order_id = findBrickOsysId(item_id, order_id)

    setMissingItemInput(false);

    setProcessedItems((prev) => {

      const exists = prev.some(
        (item) => item.item_id === item_id && item.order_id === order_id
      );

      if (exists) {
        // Remove the item if it already exists

        return prev.filter(
          (item) => !(item.item_id === item_id && item.order_id === order_id)
        );
      } else {
        // Add the item if it does not exist

        return [...prev, { order_id, item_id, brickosys_order_id, note }];
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
      if (!orderProgress[order.order_id]) {
        orderProgress[order.order_id] = {
          pickedItems: 0,
          pickedLots: 0,
          completed: 0, // Add completed field for order
        };
      }

      // Loop through each item (lot) in the order
      order.items.forEach((item) => {
        // Check if the item is processed (picked)
        const isItemProcessed = processedItems.some(
          (processedItem) => processedItem.item_id === item.item_id && processedItem.order_id === order.order_id
        );

        // If the item is processed, increment the picked items counter by its quantity
        if (isItemProcessed) {
          packedItems += item.quantity; // Add the qty of the item to the packed items total
          pickedItemsInOrder += item.quantity; // Increment picked items for this order

          // Check if this lot is fully processed (i.e., all qty of the item is picked)
          const totalQtyForLot = item.quantity; // Since each item is a lot, its qty is the total quantity of that lot

          // If the total quantity of the item has been processed, mark this lot as packed
          if (lotPackedTracker[item.item_id]) {
            lotPackedTracker[item.item_id] += item.quantity;
          } else {
            lotPackedTracker[item.item_id] = item.quantity;
          }

          if (lotPackedTracker[item.item_id] >= totalQtyForLot) {
            packedLots += 1;
            pickedLotsInOrder += 1;
          }
        }
      });

      // Update the order's progress
      orderProgress[order.order_id].pickedItems = pickedItemsInOrder;
      orderProgress[order.order_id].pickedLots = pickedLotsInOrder;

      // Calculate order progress based on both items and lots
      const totalItemsInOrder = order.items.reduce((acc, item) => acc + item.quantity, 0); // Total items in the order
      const totalLotsInOrder = order.items.length; // Total lots (items in the order)

      const orderItemsCompletion = Math.round((pickedItemsInOrder / totalItemsInOrder) * 100);
      const orderLotsCompletion = Math.round((pickedLotsInOrder / totalLotsInOrder) * 100);

      // Calculate order progress by averaging items and lots completion
      orderProgress[order.order_id].completed = Math.round((orderItemsCompletion + orderLotsCompletion) / 2);

      // After checking all items in the order, check if the order is fully packed
      const allItemsPackedInOrder = order.items.every((item) =>
        processedItems.some(
          (processedItem) =>
            processedItem.item_id === item.item_id &&
            processedItem.order_id === order.order_id
        )
      );

      if (allItemsPackedInOrder) {
        packedOrders += 1; // Increment packed orders if all items in the order are packed
        packedOrdersIds.push(order.brickosys_order_id)
      }
    });

    // Overall completion based on both items and lots
    const totalItems = allOrders.reduce((acc, order) => acc + order.items.reduce((acc, item) => acc + item.quantity, 0), 0);
    const totalLots = allOrders.reduce((acc, order) => acc + order.items.length, 0); // Total number of lots (items)

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
        .filter(order => packedOrdersIds.includes(order.brickosys_order_id))
        .map(order => ({
          source: order.platform, // Replace with actual field name
          brickosysId: order.brickosys_order_id, // Replace with actual field name
          status: "PACKED", // Set the desired status
          pickUpDate: new Date().toISOString(), // Use the current date/time or a specific value
          pickUpBy: "holboxai", // Replace with actual logic to get the picker name
        }));


      // Step 3: Construct the API request body
      const body = updates;


      // Step 4: Call the API to update order status
      const response = await api.post('/order/update-order-status', body);


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
            toast.error(`Could not update status of order ${failure.brickosys_order_id}: ${failure.error}`);
          }

        }

      }
    } catch (error) {
      // Step 6: Handle error response
      toast.error("Something went wrong!");
    }
    finally {
      setProcessOrdersLoader(false)
      navigate('/orders')
    }
  };

  const handleContinueLater = async () => {
    setSaveAndContinueLoading((prev) => !prev);
    // Save current progress in our database so person can come later and continue.
    try {
      // Step 1: Prepare body object which has all the processed Items with one additional property 'isPicked'

      const pickedItems = allOrders.flatMap(order =>
        order.items.map(item => ({
          brickosysId: order.brickosys_order_id,
          itemId: item.item_id,
          isPicked: processedItems.some(
            processedItem => processedItem.brickosys_order_id === order.brickosys_order_id && processedItem.item_id === item.item_id
          ) ? 'true' : 'false',
          note: missingItems.find(
            missingItem => missingItem.order_id == order.order_id && missingItem.item_id == item.item_id
          )?.note,
        }))
      );

      // Step 3: Construct the API request body
      const body = pickedItems;

      // Step 4: Call the API to update order status
      const response = await api.post('/order/update-item-progress', body);

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
      navigate('/orders')
    }

  }


  // const toggleMissingItems = async (brickosys_order_id, order_id, item_id, missingNote, operation) => {

  //   try {
  //     if (operation == 'add') {
  //       if (!missingNote.trim()) {
  //         toast.error("Missing note cannot be empty.");
  //         return;
  //       }


  //       // Update the `missingItems` state
  //       setMissingItems((prev) => {
  //         const itemIndex = prev.findIndex(
  //           (item) => item.order_id === order_id && item.item_id === item_id
  //         );



  //         // If the item already exists, update its note
  //         // if (itemIndex !== -1) {
  //         //   const updatedItems = [...prev];
  //         //   updatedItems[itemIndex].note = missingNote;
  //         //   return updatedItems;
  //         // }

  //         // // Otherwise, add a new entry for the missing item
  //         // return [...prev, { order_id, item_id, note: missingNote }];

  //         if (itemIndex !== -1) {
  //           const updatedItems = [...prev];
  //           updatedItems[itemIndex] = {
  //             ...updatedItems[itemIndex], // Copy existing properties
  //             note: missingNote, // Update the note
  //           };

  //           // Debugging: Log the updated items
  //           console.log("Updated Missing Items:", updatedItems);
  //           return updatedItems;
  //         }

  //         // Otherwise, add a new entry for the missing item
  //         const newItem = { brickosys_order_id, order_id, item_id, note: missingNote };
  //         // Debugging: Log the new item
  //         console.log("Adding new item:", newItem);

  //         console.log("Final arraay: ", [...prev, newItem])

  //         return [...prev, newItem];
  //       });

  //     }

  //     else if (operation === "remove") {
  //       // Remove the item from the `missingItems` state
  //       setMissingItems((prev) =>
  //         prev.filter(
  //           (item) => !(item.order_id === order_id && item.item_id === item_id)
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error adding missing note:", error);
  //     toast.error("Something went wrong while updating the note.");
  //   }
  // };

  // ----------------------------------- Second Approach ----------------------------------------

  // const toggleMissingItems = async (brickosys_order_id, order_id, item_id, missingNote, operation) => {

  //   console.log(order_id)
  //   try {
  //     if (operation === 'add') {
  //       if (!missingNote.trim()) {
  //         toast.error("Missing note cannot be empty.");
  //         return;
  //       }

  //       // Create the new item object that contains the brickosys_order_id, order_id, item_id, and the missingNote
  //       const newItem = { brickosys_order_id, order_id, item_id, note: missingNote };
  //       setAllItems((prevAllItems) => {

  //         const updatedAllItems = prevAllItems.map((item) =>
  //           item.item_id === item_id // Find the item using brickosys_order_id
  //             ? { ...item, note: missingNote } // Update the note for that item
  //             : item
  //         );

  //         // Log the updated items
  //         console.log("Updated All Items:", updatedAllItems);
  //         return updatedAllItems;
  //       });


  //       setMissingItems((prev) => {
  //         const itemIndex = prev.findIndex(
  //           (item) => item.order_id === order_id && item.item_id === item_id
  //         );
  //         // If the item already exists, update its note
  //         if (itemIndex !== -1) {
  //           const updatedItems = [...prev];
  //           updatedItems[itemIndex].note = missingNote;
  //           return updatedItems;
  //         }

  //         // Otherwise, add a new entry for the missing item
  //         return [...prev, { order_id, item_id, note: missingNote }];
  //       });
  //     }

  //     else if (operation === "remove") {
  //       // Remove the item from the `missingItems` state
  //       setMissingItems((prev) =>
  //         prev.filter(
  //           (item) => !(item.order_id === order_id && item.item_id === item_id)
  //         )
  //       );

  //       // Remove the note from `allItems` for the corresponding item
  //       setAllItems((prevAllItems) => {
  //         const updatedAllItems = prevAllItems.map((item) =>
  //           item.order_id === order_id && item.item_id === item_id
  //             ? { ...item, note: "" } // Clear the note
  //             : item
  //         );
  //         console.log("Updated All Items after removal:", updatedAllItems);
  //         return updatedAllItems;
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error adding missing note:", error);
  //     toast.error("Something went wrong while updating the note.");
  //   }
  // };

  const toggleMissingItems = async (brickosys_order_id, order_id, item_id, missingNote, operation) => {
    try {
      // Step 1: Prepare body object which has all the processed Items with one additional property 'isPicked'

      if (operation === 'add') {
        if (!missingNote.trim()) {
          toast.error("Missing note cannot be empty.");
          return;
        }

        setMissingItems((prev) => {
          const itemIndex = prev.findIndex(
            (item) => item.order_id === order_id && item.item_id === item_id
          );

          if (itemIndex !== -1) {
            const updatedItems = [...prev];
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex], // Copy existing properties
              note: missingNote, // Update the note
            };

            // Debugging: Log the updated items
            console.log("Updated Missing Items:", updatedItems);
            return updatedItems;
          }

          // Otherwise, add a new entry for the missing item
          const newItem = { brickosys_order_id, order_id, item_id, note: missingNote };


          return [...prev, newItem];
        });
      }
      else if (operation === "remove") {
        // Remove the item from the `missingItems` state
        setMissingItems((prev) =>
          prev.filter(
            (item) => !(item.order_id === order_id && item.item_id === item_id)
          )
        );
      }
    } catch (error) {
      // Step 6: Handle error response
      console.log(error);

      toast.error("Something went wrong!");
    }
  }
  

  const helper_function = async () => {
    // Check if missingItems is not empty
    if (missingItems.length > 0) {
      const pickedItems = allOrders.flatMap(order =>
        order.items.map(item => ({
          brickosysId: order.brickosys_order_id,
          itemId: item.item_id,
          isPicked: processedItems.some(
            processedItem => processedItem.brickosys_order_id === order.brickosys_order_id && processedItem.item_id === item.item_id
          ) ? 'true' : 'false',
          note: missingItems.find(
            missingItem => missingItem.order_id == order.order_id && missingItem.item_id == item.item_id
          )?.note,
        }))
      );
  
      // If there are no picked items, don't proceed with the API call
      if (pickedItems.length > 0) {
        // Construct the API request body
        const body = pickedItems;
        
        // Call the API to update order status
        const response = await api.post('/order/update-item-progress', body);
        
      }
    }
  }
  useEffect( () => {
    // Check if missingItems is not empty
    helper_function();
    console.log(missingItems)
  }, [missingItems, allOrders]);



  const findBrickOsysId = (item_id, order_id) => {

    const order = allOrders.find((order) => order.order_id === order_id);

    if (order) {
      const itemExists = order.items.some((item) => item.item_id === item_id);
      if (itemExists) {
        return order.brickosys_order_id; // Return the brickosysId if both match
      }
    }
    return null; // Return null if no match found
  };

  const expandItem = (item) => {
    setcurrentActiveItem(item)
  }

  // const sortedItems = [
  //   ...allItems.filter(item =>
  //     missingItems?.some(missingItem =>
  //       missingItem.item_id === item.item_id && missingItem.order_id === item.order_id)
  //   ),
  //   ...allItems.filter(item =>
  //     processedItems?.some(processedItem =>
  //       processedItem.item_id === item.item_id && processedItem.order_id === item.order_id)
  //   ),
  //   ...allItems.filter(item =>
  //     !processedItems?.some(processedItem =>
  //       processedItem.item_id === item.item_id && processedItem.order_id === item.order_id) &&
  //     !missingItems?.some(missingItem =>
  //       missingItem.item_id === item.item_id && missingItem.order_id === item.order_id)
  //   )
  // ];

  const [sortedItems, setSortedItems] = useState([]);
  useEffect(()=>{ 
    setSortedItems ( [
      ...allItems.filter(item =>
        missingItems?.some(missingItem =>
          missingItem.item_id === item.item_id && missingItem.order_id === item.order_id)
      ),
      ...allItems.filter(item =>
        processedItems?.some(processedItem =>
          processedItem.item_id === item.item_id && processedItem.order_id === item.order_id)
      ),
      ...allItems.filter(item =>
        !processedItems?.some(processedItem =>
          processedItem.item_id === item.item_id && processedItem.order_id === item.order_id) &&
        !missingItems?.some(missingItem =>
          missingItem.item_id === item.item_id && missingItem.order_id === item.order_id)
      )
    ]);

  }, [allItems, missingItems])


  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}></Sidebar>
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""} `}>
        <div className="flex-1">
          <Header />
          <ToastContainer position="bottom-center" />
          {isLoading ? <div className="flex justify-center items-center h-fit-screen"><ClipLoader className="" size={50} color={"#AAFF00"} /></div> :
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Item Details section */}
                {/* <PickUpItems /> */}

                <div className="flex-1 bg-gray-50">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
                      <div className="flex items-center gap-6">
                        <button
                          className="relative"
                          onClick={() => setShowProcessed((prev) => !prev)}
                        >
                          {showProcessed ? (
                            <Eye className="w-6 h-6 text-[#6366F1]" />
                          ) : (
                            <EyeOff className="w-6 h-6 text-[#6366F1]" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {sortedItems.map((item, index) => (
                        item.id === currentActiveItem?.id ? (
                          <div
                            className="space-y-4 click_element_smooth_hover"
                            key={item.item_id}
                            onClick={(e) =>
                              !missingNote ? toggleItemProcessed(item.item_id, item.order_id, item.note) : expandItem(item)
                            }
                          >
                            <div
                              className={`rounded-lg ${missingNote ? "bg-red-100" : "bg-white border border-gray-200 shadow-sm"}`}
                            >
                              <div className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                  {/* Image */}
                                  <div className="w-full md:w-[250px] lg:w-[300px] flex items-center justify-center">
                                    <div className="overflow-hidden rounded-lg border border-gray-300 h-fit w-full">
                                      {item.color_code !== "N/A" ? (
                                        <div
                                          className="rounded-t-lg p-2 text-center font-medium text-white"
                                          style={{
                                            backgroundColor: `#${item.color_code}`,
                                            color: getContrastTextColor(item.color.toLowerCase()),
                                          }}
                                        >
                                          {item.color.toUpperCase()}
                                        </div>
                                      ) : (
                                        <div className="rounded-t-lg p-2 text-center font-medium text-black bg-gray-200">
                                          {item.color.toUpperCase()}
                                        </div>
                                      )}

                                      <img
                                        src={fomartImageSrcString(item.item_type, item.color_id, item.sku, item.brickosys_order_id) || item.image}
                                        alt="Minifigure Shield"
                                        className="h-[180px] md:h-[200px] w-full object-contain"
                                      />
                                    </div>
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 space-y-4 md:space-y-6">
                                    {/* Title Section */}
                                    <div className="space-y-2">
                                      <div className="bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 w-fit rounded-lg">
                                        {item.item_type}
                                      </div>
                                      <h2 className="text-lg md:text-xl text-gray-800 font-semibold">{item.item_name}</h2>
                                      <p className="text-sm text-gray-600">{item.sku}</p>
                                    </div>

                                    {/* Location and Pick Section */}
                                    <div
                                      className="flex flex-col md:flex-row gap-2 md:gap-4"
                                      onClick={(e) => e.stopPropagation()} // Prevent toggleItemProcessed
                                    >
                                      {!missingItemInput ? (
                                        <>
                                          {/* Location */}
                                          <div className="flex-1">
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
                                                {item.quantity}
                                              </span>
                                              <span className="text-lg font-medium text-purple-600 bg-purple-100 h-10 w-10 pt-2 text-center rounded-r-lg">
                                                {findOrderIndexForItem(allOrders, item.item_id, item.order_id)?.orderIndex + 1}
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
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
                                          <div className="flex space-x-2 mt-2">
                                            <button
                                              className="flex justify-center min-w-[80px] items-center bg-purple-100 text-purple-600 h-8 px-3 py-1 rounded-md text-xs cursor-pointer"
                                              onClick={() =>
                                                toggleMissingItems(item.brickosys_order_id, item.order_id, item.item_id, missingNote, "add")
                                              }
                                            >
                                              Add Note
                                            </button>
                                          </div>
                                        </div>
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : !showProcessed &&
                          processedItems?.some(
                            (processedItem) =>
                              processedItem.item_id === item.item_id &&
                              processedItem.order_id === item.order_id
                          ) ? null : (
                          <DisplayItems
                            pool={
                              processedItems?.some(
                                (processedItem) =>
                                  processedItem.item_id === item.item_id &&
                                  processedItem.order_id === item.order_id
                              )
                                ? "processed"
                                : missingItems?.some(
                                  (missingItem) =>
                                    missingItem.item_id === item.item_id &&
                                    missingItem.order_id === item.order_id
                                )
                                  ? "missing"
                                  : undefined
                            }
                            item={item}
                            key={item.item_id}
                            missingItems={missingItems}
                            allOrders={allOrders}
                            expandItem={expandItem}
                            toggleItemProcessed={toggleItemProcessed}
                            toggleMissingItems={toggleMissingItems}
                          />
                        )
                      ))}

                    </div>

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
              </div>

              <div className="lg:col-span-1">
                <div className="flex-1 bg-gray-50">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
                      {/* <div className="flex items-center gap-6">
                        <button className="relative">
                          <Calendar className="w-6 h-6 text-[#6366F1]" />
                        </button>
                        <button className="relative">
                          <Bell className="w-6 h-6 text-[#6366F1]" />
                        </button>
                        <button className="relative">
                          <MessageCircle className="w-6 h-6 text-[#6366F1]" />
                        </button>
                      </div> */}
                    </div>

                    <div className="space-y-4">
                      {allOrders.map((order, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-4 md:p-6 shadow-sm relative w-full"
                        >
                          {/* Order Details */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                            <div className="w-full">
                              <div className="flex items-center gap-2">
                                <div className="bg-black text-white px-3 py-1 rounded-md text-xs sm:text-sm font-semibold">
                                  Order no.#{order.order_id}
                                </div>
                              </div>
                              <span className="text-xs sm:text-sm font-semibold block mt-1">{order.platform}</span>
                              <span className="text-xs font-semibold text-gray-500 block">{new Date(order.order_on).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-600">
                                  Payment: {order.payment_method}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progress Section */}
                          <div className="mt-4 bg-[#F9F9F9] rounded-lg p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6">
                            <div className="flex items-center gap-2">
                              <Box className="text-black" size={18} />
                              <span className="text-xs sm:text-sm font-semibold text-black">
                                {calculateProgress().orderProgress[order.order_id].pickedLots || 0} / {order.items.length} lots
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Box className="text-black" size={18} />
                              <span className="text-xs sm:text-sm font-semibold text-black">
                                {calculateProgress().orderProgress[order.order_id].pickedItems || 0} / {getTotalItemsInOrder(order)} items
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <ProgressBar progress={calculateProgress().orderProgress[order.order_id].completed} />
                          </div>

                          {/* Order Number in Top Right */}
                          <div className="absolute top-3 right-3 sm:top-6 sm:right-6">
                            <span className="text-xs sm:text-sm font-medium text-gray-400">
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
      </div>
    </div>
  );
}
