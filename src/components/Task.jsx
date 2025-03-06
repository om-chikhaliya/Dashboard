import { ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import api from "./helper/api";

export function Task() {
  // Use React state to manage the tasks array
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const task_response = await api.get("/order/task");
        console.log(task_response.data)
        setTasks(task_response.data)

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

  // Handle checkbox toggle


  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="p-4">
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Your Tasks
        </h2>
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-simple)" }}
        >
          Check your task list below
        </p>
      </div>
      <hr
        className="border-gray-400 mt-1 mb-1 "
        style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
      />
      <ScrollArea className="h-[calc(100%-64px)]">
        <div className="p-2 space-y-2">
        {loading ? <div className="flex justify-center items-center h-32 min-w-fit">
              <ClipLoader size={50} color={"#AAFF00"} loading={loading} />
            </div> :
              <div className="space-y-3">
                {tasks.map((order) => (
                  <div key={order.order_id} className="mb-6 border-b pb-4">
                    {/* Order ID */}
                    <h2 className="text-xl font-bold mb-2">Order ID: {order.order_id}</h2>

                    {/* Items under Order */}
                    <ul className="space-y-2 list-disc pl-6">
                      {order.notes.map((note) => (
                        <li key={note.item_id} className="relative group">
                          {/* Item Name & Note */}
                          <p className="text-md font-semibold">{note.item_name}</p>
                          <p className="text-gray-500 text-sm">{note.note}</p>

                          {/* Tooltip for Item ID (Visible on Hover) */}
                          <span className="absolute left-0 -top-6 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Item ID: {note.item_id}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>}
        </div>
      </ScrollArea>
    </div>
  );
}
