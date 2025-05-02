
import { useState, useEffect } from "react";

import api from "./helper/api";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";

export function Price() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [guideType, setGuideType] = useState("sold");
    const [submitloading, setSubmitloading] = useState(false);
    const [selectedStore, setSelectedStore] = useState("BrickLink");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState(1);
    const [pricePercentage, setPricePercentage] = useState("");
    const [priceChangeType, setPriceChangeType] = useState("Increase");
    const [storeData, setStoreData] = useState({
        BrickLink: {
            detailedItem: {},
            detailedLot: {},
            detailedPrice: {},
        },
        BrickOwl: {
            detailedItem: {},
            detailedLot: {},
            detailedPrice: {},
        },
    });
    const [loading, setLoading] = useState(true);

    // Fetch detailed store data from the API
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await api.get("/inventory/bricklink-pricing-summary"); // Replace with the correct API endpoint
                setStoreData({
                    BrickLink: {
                        detailedItem: response.data.bricklinkDetailedItem,
                        detailedLot: response.data.bricklinkDetailedLot,
                        detailedPrice: response.data.bricklinkDetailedPrice,
                    },
                    BrickOwl: {
                        detailedItem: response.data.brickowlDetailedItem,
                        detailedLot: response.data.brickowlDetailedLot,
                        detailedPrice: response.data.brickowlDetailedPrice,
                    },
                });
            } catch (error) {
                console.error("Error fetching store data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, []);

    // Handle row selection
    const handleRowSelect = (rowType, isChecked) => {
        setSelectedRows((prevSelected) => {
            if (isChecked) {
                return [...prevSelected, rowType];
            } else {
                return prevSelected.filter((type) => type !== rowType);
            }
        });
    };

    // Handle tab switching for store selection
    const handleTabSwitch = (store) => {
        setSelectedStore(store);
    };

    // Submit the price change for the selected rows
    const submitPriceChange = async () => {
        setSubmitloading(true);
        
        if (selectedRows.length === 0) {
            toast.error("Select an item type to proceed.");
            setSubmitloading(false)
            return;
        }

        // Create the request payload
        const requestData = {
            months: selectedMonths,
            percentage: pricePercentage,
            itemTypes: selectedRows,
            priceChangeType: priceChangeType,
            guideType: guideType
        };


        // Call the price change API
        try {
            const response = api.post("/price/pricechange", requestData);
            toast.success(`We are updating the prices in background.`);
        } catch (error) {
            toast.error(error.response?.data?.error || "There is some issue while changing the prices.");
        }finally{
            setSubmitloading(false);
        }

        // Logic to update prices for selected rows
    };


    return (
        <div className="">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>
                <ToastContainer position="top-right" autoClose={3000} />
                <Header />
                {loading ? <div className="flex justify-center items-center h-[700px]"><ClipLoader className="" size={50} color={"#AAFF00"} /></div> :
                    <div className="bg-white p-6 rounded-xl">
                        {/* Tab Selection */}
                        <div className="flex items-center justify-center">
                            <div className="relative w-fit gap-4 mb-4 bg-gray-100 rounded-lg">
                                <button
                                    className={`py-2 px-6 rounded-t-lg transition-all duration-300 ease-in-out ${selectedStore === "BrickLink" ? "text-black" : "text-gray-500"
                                        }`}
                                    onClick={() => handleTabSwitch("BrickLink")}
                                >
                                    BrickLink
                                </button>
                                <button
                                    className={`py-2 px-6 rounded-t-lg transition-all duration-300 ease-in-out ${selectedStore === "BrickOwl" ? "text-black" : "text-gray-500"
                                        }`}
                                    onClick={() => handleTabSwitch("BrickOwl")}
                                >
                                    BrickOwl
                                </button>

                                {/* Bottom Border for Smooth Transition */}
                                <div
                                    className="absolute bottom-0 left-0 w-1/2 h-[3px] bg-[#bbe90b] transition-all duration-300 ease-in-out"
                                    style={{
                                        transform: selectedStore === "BrickLink" ? 'translateX(0)' : 'translateX(100%)',
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Table for Detailed Breakdown */}
                        <div className="flex justify-between gap-8 mb-4 mx-auto mt-5 relative">
                            {/* Table Component */}
                            <div className={`flex-1 ${selectedStore === "BrickOwl" ? "blur-sm pointer-events-none select-none" : ""}`}>
                                <table className="w-full table-auto border-collapse rounded-xl p-6 shadow-lg h-full">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Select</th>
                                            <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Type</th>
                                            <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Lot Count</th>
                                            <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Item Count</th>
                                            <th className="text-left py-2 px-4 border-b text-sm font-medium text-gray-600">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(storeData[selectedStore]?.detailedLot || {}).map(([type, count]) => (
                                            <tr key={type} className="border-t">
                                                <td className="py-2 px-4 border-b text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(type)}
                                                        onChange={(e) => handleRowSelect(type, e.target.checked)}
                                                    />
                                                </td>
                                                <td className="py-2 px-4 border-b text-sm">{type}</td>
                                                <td className="py-2 px-4 border-b text-sm">{count}</td>
                                                <td className="py-2 px-4 border-b text-sm">{storeData[selectedStore]?.detailedItem[type]}</td>
                                                <td className="py-2 px-4 border-b text-sm">${storeData[selectedStore]?.detailedPrice[type]?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {selectedStore === "BrickOwl" && (
                                <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                                    <p className="text-xl font-semibold text-gray-700">🚧 This Feature is coming soon...</p>
                                </div>
                            )}
                            {/* Price Change Component */}
                            <div className="flex-1">
                                <div className="bg-white rounded-xl p-6">
                                    <h3 className="text-xl font-semibold mb-4">Update Item Prices</h3>
                                    <p className="text-sm mb-4 text-gray-700">
                                        Update the price of items based on the{" "}
                                        {guideType === "Sold" ? (
                                            <>
                                                average price of <span className="font-medium text-gray-900">{selectedMonths} </span> month
                                                {selectedMonths > 1 && "s"}
                                            </>
                                        ) : (
                                            <>stock values</>
                                        )}{" "}
                                        by <span className="font-medium text-gray-900">{pricePercentage}%</span>{" "}
                                        <span className="font-medium text-gray-900">{priceChangeType}.</span>
                                    </p>


                                    {/* Guide Type Dropdown */}
                                    <label className="block text-sm font-medium text-gray-700">Based on:</label>
                                    <select
                                        className="border p-2 w-full rounded-lg mb-3"
                                        value={guideType}
                                        onChange={(e) => setGuideType(e.target.value)}
                                    >
                                        <option value="sold">Historical Sales data</option>
                                        <option value="stock">Current Market Price</option>
                                    </select>


                                    {/* Months Dropdown */}
                                    {guideType === "sold" && (
                                        <>
                                            <label className="block text-sm font-medium text-gray-700">Select Months:</label>
                                            <select
                                                className="border p-2 w-full rounded-lg mb-3"
                                                value={selectedMonths}
                                                onChange={(e) => setSelectedMonths(e.target.value)}
                                            >
                                                {[1, 2, 3, 4, 5, 6].map((month) => (
                                                    <option key={month} value={month}>
                                                        {month} {month > 1 ? "Months" : "Month"}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    )}


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

                                    {/* Submit Button */}
                                    <div className="flex justify-between">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded w-1/3"
                                            onClick={submitPriceChange}
                                            disabled={submitloading}
                                        >
                                            {submitloading ? <ClipLoader size={20} color={'#ffffff'}></ClipLoader> : 'Submit'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                }
            </div>
        </div>
    );
}
