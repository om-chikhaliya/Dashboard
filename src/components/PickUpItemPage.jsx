import Header from "./Header";
import { getTotalLotsAndItems, getTotalItemsInOrder, findOrderIndexForItem, fomartImageSrcString, getContrastTextColor, formatDateBasedOnUserLocation, decodeHtmlEntities } from "./helper/constant";
import { useState, useEffect } from "react";
import {
  Calendar,
  Bell,
  MessageCircle,
  Box,
  ArrowRight,
  ChevronLeft,
  ChevronRight
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
import colors from '../data/color-pick-item'


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
  const [missingNoteloader, setMissingNoteloader] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [isLoadingMissingItems, setIsLoadingMissingItems] = useState(false);
  const [visibleItemsCount, setVisibleItemsCount] = useState(50); // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const handleLoadMoreItems = () => {
    setVisibleItemsCount((prev) => prev + Number(itemsPerPage));
  };


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

          //   toggleItemProcessed(item.id, order.order_id, order.brickosys_order_id);
          // }

          // Check for missing items based on the note field
          if (item.note && item.note.trim() !== '') {
            missingItemsArray.push({
              id: item.id,
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
                (pItem) => pItem.id === item.id && pItem.order_id === order.order_id
              );

              if (!exists) {

                updatedProcessedItems.push({
                  order_id: order.order_id,
                  id: item.id,
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
    if (allOrders.length === 0) return;

    const { packedOrdersIds } = calculateProgress();

    // Find newly completed orders that weren’t in the previous state
    const newCompletions = packedOrdersIds.filter(
      (id) => !completedOrders.includes(id)
    );

    // Fire a toast for each newly completed order
    newCompletions.forEach((id) => {
      const order = allOrders.find((o) => o.brickosys_order_id === id);
      toast.success(`Order ${order?.order_id} has been fully picked!`);
    });

    // Update state
    if (newCompletions.length > 0) {
      setCompletedOrders((prev) => [...prev, ...newCompletions]);
    }
  }, [processedItems, allOrders]);


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
            processedItem.id === item.id &&
            processedItem.order_id === item.order_id
        ) &&
        !missingItems.some(
          (missingItem) =>
            missingItem.id === item.id &&
            missingItem.order_id === item.order_id
        )
    );

    setAllItems(itemsArray);
    setcurrentActiveItem(nextActiveItem || null); // Set to null if all items are processed or missing
  }, [allOrders, processedItems, missingItems]);


  useEffect(() => {
    const item = missingItems.find((missingItem) => missingItem.id == currentActiveItem?.id);
    setMissingNote((prev) => item?.note || '');
  }, [currentActiveItem])

  useEffect(() => {
    setSortedItems([
      ...allItems.filter(item =>
        processedItems?.some(processedItem =>
          processedItem.id === item.id && processedItem.order_id === item.order_id)
      ),
      ...allItems.filter(item =>
        !processedItems?.some(processedItem =>
          processedItem.id === item.id && processedItem.order_id === item.order_id) &&
        !missingItems?.some(missingItem =>
          missingItem.id === item.id && missingItem.order_id === item.order_id)
      ),
      ...allItems.filter(item =>
        missingItems?.some(missingItem =>
          missingItem.id === item.id && missingItem.order_id === item.order_id)
      ),
    ]);

  }, [allItems, missingItems])



  const toggleItemProcessed = (id, order_id, note = '') => {
    // clickAudio(); 

    const brickosys_order_id = findBrickOsysId(id, order_id)

    setMissingItemInput(false);

    setProcessedItems((prev) => {

      const exists = prev.some(
        (item) => item.id === id && item.order_id === order_id
      );

      if (exists) {
        // Remove the item if it already exists

        return prev.filter(
          (item) => !(item.id === id && item.order_id === order_id)
        );
      } else {
        // Add the item if it does not exist

        return [...prev, { order_id, id, brickosys_order_id, note }];
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
          (processedItem) => processedItem.id === item.id && processedItem.order_id === order.order_id
        );

        // If the item is processed, increment the picked items counter by its quantity
        if (isItemProcessed) {
          packedItems += item.quantity; // Add the qty of the item to the packed items total
          pickedItemsInOrder += item.quantity; // Increment picked items for this order

          // Check if this lot is fully processed (i.e., all qty of the item is picked)
          const totalQtyForLot = item.quantity; // Since each item is a lot, its qty is the total quantity of that lot

          // If the total quantity of the item has been processed, mark this lot as packed
          if (lotPackedTracker[item.id]) {
            lotPackedTracker[item.id] += item.quantity;
          } else {
            lotPackedTracker[item.id] = item.quantity;
          }

          if (lotPackedTracker[item.id] >= totalQtyForLot) {
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
            processedItem.id === item.id &&
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
          status: order.brickosys_order_id.includes("BO") ? "Processed" : "PACKED", // Set the desired status
          pickUpDate: new Date().toISOString(), // Use the current date/time or a specific value
          pickUpBy: localStorage.getItem("username"), // Replace with actual logic to get the picker name
        }));


      // Step 3: Construct the API request body
      const body = updates;


      const searchParams = new URLSearchParams(window.location.search);
      const idsParam = searchParams.get('brickosys_orderId') || '';

      // Step 4: Call the API to update order status
      const response = await api.post(`/order/update-order-status?brickosys_order_ids=${idsParam}`, body);


      if (response.data.statusCode != 200) {

        toast.error("Could not process the order. Please try after some time.");
      }
      // Step 5: Handle success response
      else {
        // handleContinueLater();

        const updatedItems = allOrders.flatMap(order =>
          order.items.map(item => {
            // Check if the item has changed
            const isItemPicked = processedItems.some(
              processedItem =>
                processedItem.brickosys_order_id === order.brickosys_order_id &&
                processedItem.id === item.id
            );

            const currentNote = missingItems.find(
              missingItem => missingItem.order_id == order.order_id && missingItem.id == item.id
            )?.note;

            // Only return the item if it has changed (either isPicked or note is updated)
            const hasChanges = item.isPicked !== isItemPicked || item.note !== currentNote;

            if (hasChanges) {
              return {
                brickosysId: order.brickosys_order_id,
                id: item.id,
                itemId: item.item_id,
                isPicked: isItemPicked ? 'true' : 'false',
                note: currentNote || "", // Set note if exists, otherwise empty string
              };
            }

            // If no changes, return null to exclude the item from the request
            return null;
          })
        ).filter(item => item !== null); // Filter out any null values (unchanged items)

        // If no items have been updated, skip the API request
        if (updatedItems.length === 0) {
          toast.info("You have not made any changes.");
          return; // Skip the API request if no changes
        }

        try {
          // Step 2: Construct the API request body
          const searchParams = new URLSearchParams(window.location.search);
          const idsParam = searchParams.get('brickosys_orderId') || '';

          // Step 3: Call the API to update order status with only the changed items
          const response = await api.post(`/order/update-item-progress?brickosys_order_ids=${idsParam}`, updatedItems);

          // Step 4: Handle the API response
          if (response.data.failures.length > 0) {
            for (let i = 0; i < response.data.failures.length; i++) {
              const failure = response.data.failures[i];
              toast.error(`Could not pick some items. Please check your pickup stats properly.`);
            }
          }
        } catch (error) {

          console.log(error);
          toast.error("Something went wrong!");
        }

        if (response.data.failures.length <= 0) {
          toast.success("You have picked up all the orders.");
        }
        else {
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
      setTimeout(() => {
        // Navigate to a different page (for example '/new-page')
        navigate("/orders");
        // history.push("/new-page"); // For React Router v5
      }, 2000);
    }
  };

  // const handleContinueLater = async () => {
  //   setSaveAndContinueLoading((prev) => !prev);
  //   // Save current progress in our database so person can come later and continue.
  //   try {
  //     // Step 1: Prepare body object which has all the processed Items with one additional property 'isPicked'

  //     const pickedItems = allOrders.flatMap(order =>
  //       order.items.map(item => ({
  //         brickosysId: order.brickosys_order_id,
  //         id: item.id,
  //         itemId: item.item_id,
  //         isPicked: processedItems.some(
  //           processedItem => processedItem.brickosys_order_id === order.brickosys_order_id && processedItem.id === item.id
  //         ) ? 'true' : 'false',
  //         note: missingItems.find(
  //           missingItem => missingItem.order_id == order.order_id && missingItem.id == item.id
  //         )?.note,
  //       }))
  //     );

  //     // Step 3: Construct the API request body
  //     const body = pickedItems;

  //     const searchParams = new URLSearchParams(window.location.search);
  //     const idsParam = searchParams.get('brickosys_orderId') || '';

  //     // Step 4: Call the API to update order status
  //     const response = await api.post(`/order/update-item-progress?brickosys_order_ids=${idsParam}`, body);

  //     const log_res = await api.post(`/auth/pickup-started-log?brickosys_order_ids=${idsParam}`);

  //     if (response.data.failures.length <= 0) {
  //       toast.success("Progress saved successfully.");
  //     }
  //     else {
  //       // toast.success("Progress saved successfully.");
  //       for (let i = 0; i < response.data.failures.length; i++) {
  //         const failure = response.data.failures[i];
  //         toast.error(`Could not save details for few items!`);
  //       }


  //     }
  //   } catch (error) {
  //     // Step 6: Handle error response
  //     console.log(error);

  //     toast.error("Something went wrong!");
  //   }
  //   finally {
  //     setSaveAndContinueLoading(false);
  //     setTimeout(() => {
  //       // Navigate to a different page (for example '/new-page')
  //       navigate('/orders');
  //       // history.push("/new-page"); // For React Router v5
  //     }, 2000);
  //   }

  // }

  // const toggleMissingItems = async (brickosys_order_id, item_id, id, missingNote, operation) => {
  //   try {
  //     // Step 1: Prepare body object which has all the processed Items with one additional property 'isPicked'
  //     console.log('all orders: ', allOrders)
  //     const updatedItems = allOrders.flatMap(order =>
  //       order.items.map(item => {
  //         // Check if the current item matches the provided brickosys_order_id and id
  //         if (order.brickosys_order_id === brickosys_order_id && item.id === id) {
  //           if (operation === "add") {
  //             // If the operation is 'add', update the note
  //             return {
  //               brickosysId: order.brickosys_order_id,
  //               id: item.id,
  //               itemId: item_id,
  //               isPicked: processedItems.some(
  //                 processedItem => processedItem.brickosys_order_id === order.brickosys_order_id && processedItem.id === item.id
  //               ) ? 'true' : 'false',
  //               note: missingNote// Update the note with the provided missingNote
  //             };
  //           } else if (operation === "remove") {
  //             // If the operation is 'remove', clear the note
  //             return {
  //               brickosysId: order.brickosys_order_id,
  //               id: item.id,
  //               itemId: item_id,
  //               isPicked: processedItems.some(
  //                 processedItem => processedItem.brickosys_order_id === order.brickosys_order_id && processedItem.id === item.id
  //               ) ? 'true' : 'false',
  //               note: ""// Update the note with the provided missingNote// Remove the note
  //             };
  //           }
  //         }

  //         // For all other items, keep them unchanged
  //         return {
  //           brickosysId: order.brickosys_order_id,
  //           id: item.id,
  //           itemId: item_id,
  //           isPicked: processedItems.some(
  //             processedItem => processedItem.brickosys_order_id === order.brickosys_order_id && processedItem.id === item.id
  //           ) ? 'true' : 'false',
  //           note: item.note
  //         };
  //       })
  //     );

  //     const response = await api.post('/order/update-item-progress', updatedItems);

  //     fetchOrders();

  //   } catch (error) {
  //     // Step 6: Handle error response

  //     toast.error("Something went wrong!");
  //   }

  // }
  const handleContinueLater = async () => {
    setSaveAndContinueLoading(true);

    // Step 1: Prepare body object with only the changed items
    const updatedItems = allOrders.flatMap(order =>
      order.items.map(item => {
        // Check if the item has changed
        const isItemPicked = processedItems.some(
          processedItem =>
            processedItem.brickosys_order_id === order.brickosys_order_id &&
            processedItem.id === item.id
        );

        const currentNote = missingItems.find(
          missingItem => missingItem.order_id == order.order_id && missingItem.id == item.id
        )?.note;

        // Only return the item if it has changed (either isPicked or note is updated)
        const hasChanges = item.isPicked !== isItemPicked || item.note !== currentNote;

        if (hasChanges) {
          return {
            brickosysId: order.brickosys_order_id,
            id: item.id,
            itemId: item.item_id,
            isPicked: isItemPicked ? 'true' : 'false',
            note: currentNote || "", // Set note if exists, otherwise empty string
          };
        }

        // If no changes, return null to exclude the item from the request
        return null;
      })
    ).filter(item => item !== null); // Filter out any null values (unchanged items)

    // If no items have been updated, skip the API request
    if (updatedItems.length === 0) {
      toast.info("You have not made any changes.");
      setSaveAndContinueLoading(false);
      return; // Skip the API request if no changes
    }

    try {
      // Step 2: Construct the API request body
      const searchParams = new URLSearchParams(window.location.search);
      const idsParam = searchParams.get('brickosys_orderId') || '';

      // Step 3: Call the API to update order status with only the changed items
      const response = await api.post(`/order/update-item-progress?brickosys_order_ids=${idsParam}`, updatedItems);

      // Log the pickup started event
      const log_res = await api.post(`/auth/pickup-started-log?brickosys_order_ids=${idsParam}`);

      // Step 4: Handle the API response
      if (response.data.failures.length <= 0) {
        toast.success("Pickup stats are saved. You can come back later to start where you left.");
      } else {
        for (let i = 0; i < response.data.failures.length; i++) {
          const failure = response.data.failures[i];
          toast.error(`Looks like there’s an issue with picking some items, or they're marked as missing.`);
        }
      }
    } catch (error) {
      // Step 5: Handle error response
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      // Step 6: Cleanup
      setSaveAndContinueLoading(false);
      setTimeout(() => {
        // Navigate to the orders page after 2 seconds
        navigate('/orders');
      }, 2000);
    }
  };

  const toggleMissingItems = async (brickosys_order_id, item_id, id, missingNote, operation) => {
    try {

      if (operation === 'add') {
        setMissingNoteloader(true);
        toast.success("Missing note added successfully.")
      }else{
        setIsLoadingMissingItems(true);
      }

      // Step 1: Prepare the updated items array, only including items that were changed
      const updatedItems = allOrders.flatMap(order =>
        order.items.map(item => {
          if (order.brickosys_order_id === brickosys_order_id && item.id === id) {
            let updatedItem = {
              brickosysId: order.brickosys_order_id,
              id: item.id,
              itemId: item_id,
              isPicked: processedItems.some(
                processedItem => processedItem.brickosys_order_id === order.brickosys_order_id && processedItem.id === item.id
              ) ? 'true' : 'false',
              note: operation === "add" ? missingNote : "" // Add or remove the note
            };

            // If the note was updated, return the item
            if (updatedItem.note !== item.note) {
              return updatedItem;
            }
          }

          // If no changes, return null to exclude unchanged items
          return null;
        })
      ).filter(item => item !== null); // Remove any null (unchanged items)

      // Step 2: If there are any updated items, send them to the API
      if (updatedItems.length > 0) {
        const response = await api.post('/order/update-item-progress', updatedItems);
        fetchOrders();
      }

    } catch (error) {
      // Step 3: Handle error response
      toast.error("Something went wrong!");
    } finally {
      setMissingNoteloader(false);
      setMissingItemInput((prev) => !prev);
      setIsLoadingMissingItems(false);
    }
  };


  const findBrickOsysId = (id, order_id) => {

    const order = allOrders.find((order) => order.order_id === order_id);

    if (order) {
      const itemExists = order.items.some((item) => item.id === id);
      if (itemExists) {
        return order.brickosys_order_id; // Return the brickosysId if both match
      }
    }
    return null; // Return null if no match found
  };

  const expandItem = (item) => {
    setcurrentActiveItem(item)
  }



  const openModal = (item) => { setSelectedItem(item); setModalOpen(true); }
  const closeModal = () => { setModalOpen(false); setSelectedItem(null) };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [showOrders, setShowOrders] = useState(true);


  return (
    <div className={isLoadingMissingItems ? "blur-sm pointer-events-none select-none" : ""}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}></Sidebar>
      <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>
        <div className="flex-1">
          <Header />
          <ToastContainer position="bottom-center" />
          {isLoading ? <div className="flex justify-center items-center h-[700px]"><ClipLoader className="" size={50} color={"#AAFF00"} /></div> :
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6">

              <div className={`transition-all duration-300 ${showOrders ? "lg:col-span-2" : "lg:col-span-3"}`}>
                {/* Item Details section */}
                {/* <PickUpItems /> */}

                <div className="flex-1">
                  <div className="p-6">
                    <div className="sticky top-0 mb-4 bg-white z-20 shadow-md px-6 py-3 flex justify-between items-center rounded-md">
                      <h2 className="text-lg font-semibold text-gray-800">Items</h2>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-6">
                          <button className="bg-blue-600 text-sm font-semibold text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleContinueLater} disabled={saveAndContinueLoading}>
                            {saveAndContinueLoading ? 'Saving...' : 'Continue Later'}
                          </button>
                        </div>
                        {/* Progress Summary */}
                        <div className="flex items-center gap-6 bg-gray-100 px-4 py-1 rounded-lg text-sm font-semibold text-gray-800 shadow-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-blue-600 text-base font-bold">{calculateProgress().packedOrders}</span>
                            <span className="text-gray-600">of</span>
                            <span className="text-gray-800">{allOrders.length}</span>
                            <span className="text-gray-600">Orders</span>
                          </div>

                          <div className="w-px h-5 bg-gray-400"></div> {/* Divider */}

                          <div className="flex items-center gap-1">
                            <span className="text-green-600 text-base font-bold">{calculateProgress().packedLots}</span>
                            <span className="text-gray-600">of</span>
                            <span className="text-gray-800">{totalLotsAndItems.totalLots}</span>
                            <span className="text-gray-600">Lots</span>
                          </div>

                          <div className="w-px h-5 bg-gray-400"></div> {/* Divider */}

                          <div className="flex items-center gap-1">
                            <span className="text-purple-600 text-base font-bold">{calculateProgress().packedItems}</span>
                            <span className="text-gray-600">of</span>
                            <span className="text-gray-800">{totalLotsAndItems.totalItems}</span>
                            <span className="text-gray-600">Items</span>
                          </div>
                        </div>


                        {/* Eye Icon */}
                        <button className="relative" onClick={() => setShowProcessed((prev) => !prev)}>
                          {showProcessed ? (
                            <Eye className="w-6 h-6 text-[#6366F1]" />
                          ) : (
                            <EyeOff className="w-6 h-6 text-[#6366F1]" />
                          )}
                        </button>
                      </div>
                      {/* <button
                        className="bg-gray-200 p-2 rounded-full transition-all hover:bg-gray-300 absolute -right-5"
                        onClick={() => setShowOrders((prev) => !prev)}
                      >
                        {showOrders ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                      </button> */}
                    </div>
                    <div className="space-y-3">

                      {(() => {
                        const filteredItems = showProcessed
                          ? sortedItems
                          : sortedItems.filter(
                              (item) =>
                                !processedItems?.some(
                                  (processedItem) =>
                                    processedItem.id === item.id &&
                                    processedItem.order_id === item.order_id
                                )
                            );

                        return filteredItems
                          .slice(0, visibleItemsCount)
                          .map((item, index) =>
                            item.id === currentActiveItem?.id ? (
                          <div
                            className="space-y-4 click_element_smooth_hover"
                            key={index}
                            onClick={(e) =>
                              !missingNote ? toggleItemProcessed(item.id, item.order_id, item.note) : expandItem(item)
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
                                          className="rounded-t-lg p-2 text-center font-medium"
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

                                      {/* <img
                                        src={fomartImageSrcString(item.item_type, item.color_id, item.sku, item.brickosys_order_id) || item.image}
                                        alt="Minifigure Shield"
                                        className="h-[180px] md:h-[200px] w-full object-contain"
                                      /> */}

                                      <div className="relative flex justify-center items-center" onClick={(e) => { e.stopPropagation(); openModal(); }}>
                                        <button
                                          className=""
                                          onClick={(e) => { e.stopPropagation(); openModal(item); }}
                                        >
                                          <img
                                            src={fomartImageSrcString(item.item_type, item.color_id, item.sku, item.brickosys_order_id) || item.image}
                                            alt={decodeHtmlEntities(item.item_name)}
                                            className="h-[180px] md:h-[200px] w-full object-contain cursor-pointer"
                                            width={16}
                                          />
                                          {/* <FaSearchPlus className="text-xl" /> */}
                                        </button>
                                      </div>

                                    </div>
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 space-y-4 md:space-y-6">
                                    {/* Title Section */}
                                    <div className="space-y-2">
                                      <div className="flex gap-2">
                                        <div className="bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 w-fit rounded-lg">
                                          {item.item_type}
                                        </div>
                                        <div className="bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 w-fit rounded-lg">
                                          {item.new_or_used === "N" ? "New" : item.new_or_used === "U" ? "Used" : "N/A"}
                                        </div>
                                      </div>
                                      <h2 className="text-lg md:text-xl text-gray-800 font-semibold">{decodeHtmlEntities(item.item_name)}</h2>
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
                                          <div className="flex-[3]">
                                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                              LOCATION
                                            </label>
                                            <div className="rounded-lg border border-gray-300 bg-gray-50 py-5 px-3 text-3xl text-gray-800 h-20">
                                              {item.location}
                                            </div>
                                          </div>

                                          {/* Pick */}
                                          <div className="flex-[2]">
                                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                              PICK
                                            </label>
                                            <div className="flex items-center"> 
                                              <span className="flex-[3] rounded-l-lg border border-gray-300 bg-gray-50 py-2 px-3 text-6xl text-gray-800 w-full h-20">
                                                {item.quantity}
                                              </span>
                                              <span className={`flex-[2] text-6xl border border-gray-300 font-medium ${colors[findOrderIndexForItem(allOrders, item.item_id, item.order_id)?.orderIndex % colors.length]} h-20 w-full py-2 px-3 text-center rounded-r-lg`}>
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
                                                toggleMissingItems(item.brickosys_order_id, item.item_id, item.id, missingNote, "add")
                                              }
                                            >
                                              {missingNoteloader ? <ClipLoader size={14} color="#805ad5" /> : 'Submit'}
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


                          ) : (
                          <DisplayItems
                            pool={
                              processedItems?.some(
                                (processedItem) =>
                                  processedItem.id === item.id &&
                                  processedItem.order_id === item.order_id
                              )
                                ? "processed"
                                : missingItems?.some(
                                  (missingItem) =>
                                    missingItem.id === item.id &&
                                    missingItem.order_id === item.order_id
                                )
                                  ? "missing"
                                  : undefined
                            }
                            item={item}
                            key={index}
                            missingNote={item.note}
                            allOrders={allOrders}
                            expandItem={expandItem}
                            toggleItemProcessed={toggleItemProcessed}
                            toggleMissingItems={toggleMissingItems}
                          />
                        )
                          );
                      })()}
 
                    </div>

                    {(() => {
                      const filteredItems = showProcessed
                        ? sortedItems
                        : sortedItems.filter(
                            (item) =>
                              !processedItems?.some(
                                (processedItem) =>
                                  processedItem.id === item.id &&
                                  processedItem.order_id === item.order_id
                              )
                          );

                      return (
                        visibleItemsCount < filteredItems.length && (
                          <div className="flex justify-center mt-6 items-center gap-4">
                            <select
                              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm"
                              value={itemsPerPage}
                              onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                              <option value={50}>Load 50</option>
                              <option value={100}>Load 100</option>
                              <option value={200}>Load 200</option>
                            </select>
                            <button
                              onClick={handleLoadMoreItems}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                            >
                              Load More ({Math.max(0, filteredItems.length - visibleItemsCount)} remaining)
                            </button>
                          </div>
                        )
                      );
                    })()}

                    {modalOpen && selectedItem && (
                      <div className="fixed -inset-10 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeModal}>
                        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                          <button className="absolute -top-5 -right-5 text-white text-2xl bg-gray-800 rounded-full p-2" onClick={closeModal}>&times;</button>
                          <img src={fomartImageSrcString(selectedItem.item_type, selectedItem.color_id, selectedItem.sku, selectedItem.brickosys_order_id) || selectedItem.image} alt={decodeHtmlEntities(selectedItem.item_name)} className="w-full h-auto rounded-lg max-h-[70vh] object-contain" />
                          <h3 className="text-lg font-semibold text-center mt-4">{decodeHtmlEntities(selectedItem.item_name)}</h3>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center mt-6 gap-2">
                      {calculateProgress().packedOrders > 0 && (

                        <button
                          onClick={handleProcessOrders}
                          className="bg-blue-600 text-sm text-white font-semibold px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          disabled={processOrdersLoader}
                        >
                          {processOrdersLoader
                            ? 'Processing...'
                            : `Process ${calculateProgress().packedOrders} Order${calculateProgress().packedOrders > 1 ? 's' : ''}`}
                          <ArrowRight size={18} />

                        </button>

                      )}

                      <button className="bg-blue-600 text-sm text-white font-semibold px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" onClick={handleContinueLater} disabled={saveAndContinueLoading}>
                        {saveAndContinueLoading ? 'Saving...' : 'Continue Later'}
                      </button>


                    </div>
                  </div>
                </div>
              </div>

              <button
                className={`absolute top-[160px] z-30 transition-all bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow-md  ${showOrders ? "right-8" : "right-8"
                  }`}
                onClick={() => setShowOrders((prev) => !prev)}
              >
                {showOrders ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>

              {showOrders && (<div className="lg:col-span-1 traansition-all duration-300">
                <div className="flex-1">
                  <div className="p-6">
                    <div className="sticky top-0 mb-4 bg-white z-20 shadow-md px-6 py-3 flex justify-between items-center rounded-md">

                      <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
                      {/* <div className="mt-6 flex justify-center">
                        <button className="bg-blue-600 text-sm font-semibold text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleContinueLater}>
                          {saveAndContinueLoading ? 'Saving...' : 'Continue Later'}
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
                                  {order.platform} Order {order.order_id}
                                </div>
                              </div>
                              <span className="text-xs sm:text-sm font-semibold block mt-2 ml-2"></span>
                              <span className="text-xs font-semibold  block mt-2 ml-2">{formatDateBasedOnUserLocation(order.order_on)}</span>
                              <div className="flex flex-wrap gap-2 mt-2">

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
                            <span className={`text-xs sm:text-sm font-medium ${colors[index % colors.length]} px-3 py-1 rounded-full`}>
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>


                    {/* <div className="mt-6 flex justify-center">
                      <button className="bg-blue-600 text-sm font-semibold text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleContinueLater}>
                        {saveAndContinueLoading ? 'Saving...' : 'Continue Later'}
                      </button>
                    </div> */}
                  </div>
                </div>
                {/* OrderDetails Section end */}

              </div>)}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
