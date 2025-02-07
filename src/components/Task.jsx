import { ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export function Task() {
  // Use React state to manage the tasks array
  const [tasks, setTasks] = useState([
    {
      title: "Complete monthly report",
      description: "Finish and submit the financial report for the month.",
      isCompleted: false,
    },
    {
      title: "Sync Inventory is failed",
      description: "Please sync the inventory again.",
      isCompleted: true,
    },
    {
      title: "Team meeting preparation",
      description: "Prepare the agenda for tomorrow's team meeting.",
      isCompleted: false,
    },
    {
      title: "Check the inventory",
      description: "Finalize and send design mockups for client approval.",
      isCompleted: false,
    },
  ]);

  // Handle checkbox toggle
  const handleCheckboxChange = (index) => {
    // Update the state immutably
    const updatedTasks = tasks.map((task, taskIndex) =>
      taskIndex === index
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    );
    setTasks(updatedTasks); // Update state
  };

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
        className="border-gray-400 mt-2"
        style={{ marginLeft: "1rem", marginRight: "1rem" }}
      />
      <ScrollArea className="h-[calc(100%-64px)]">
        <div className="p-2 space-y-2">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex flex-col p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleCheckboxChange(index)}
                    className="form-checkbox w-5 h-5 text-blue-600 rounded"
                  />
                  {/* Title and Description */}
                  <div>
                    <h3
                      className={`font-medium text-sm ${
                        task.isCompleted ? "line-through text-gray-400" : ""
                      }`}
                      style={{ fontFamily: "var(--font-simple)" }}
                    >
                      {task.title}
                    </h3>
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "var(--font-simple)" }}
                    >
                      {task.description}
                    </p>
                  </div>
                </div>
                {/* Chevron */}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
