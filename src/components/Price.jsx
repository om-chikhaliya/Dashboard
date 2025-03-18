
import { useState, useEffect } from "react";

import api from "./helper/api";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { toast, ToastContainer } from "react-toastify";

export function Price() {


    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    
    const [selectedMonths, setSelectedMonths] = useState(1); // Months Selection
    const [pricePercentage, setPricePercentage] = useState(""); // Percentage Input
    const [priceChangeType, setPriceChangeType] = useState("Higher");
  

    const submitPriceChange = async () => {
        const adjustedPercentage = priceChangeType === "Decrease" ? -1 * pricePercentage : pricePercentage;

        console.log(selectedMonths, adjustedPercentage)

        try {
            const response = api.post("price/pricechange", {
                months: selectedMonths,
                percentage: adjustedPercentage,
            });

            toast.success("Price updates started");
        } catch (error) {
            toast.error(error.response?.data?.error || "Error updating prices");
        } 
    };



    return (
        <div className="">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>

                <Header />
                <ToastContainer position="top-right" autoClose={3000} />
                <div className=" flex items-center justify-center ">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-96 relative">
                        
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
                            
                            <button className="bg-blue-500 text-white px-4 py-2 rounded w-1/3" onClick={submitPriceChange}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
