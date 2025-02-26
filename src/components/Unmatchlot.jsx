import { useState, useEffect } from "react";
import { fomartImageSrcString, getContrastTextColor } from "./helper/constant";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import api from "./helper/api";


export function Unmatchlot() {

    const [unmatchlots, setUnmatchlots] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const fetchUnmatchlot = async () => {
        try {

            // Call the API with the extracted order IDs
            const response = await api.get(`/inventory/failed-syncs`);
            console.log(response.data)

            setUnmatchlots(response.data);

        } catch (error) {
            console.log("something went wrong!", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {

        fetchUnmatchlot();

    }, [])


    return (
        <>
            <div className="app">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}></Sidebar>
                <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""} `}>
                    <div className="flex-1">
                        <Header />
                        <ToastContainer position="bottom-center" />
                        {isLoading ? <div className="flex justify-center items-center h-fit-screen"><ClipLoader className="" size={50} color={"#AAFF00"} /></div> :
                            <div className="">
                                {/* <div className="lg:col-span-2"> */}
                                {/* Item Details section */}
                                {/* <PickUpItems /> */}

                                <div className="flex-1 bg-gray-50">
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {unmatchlots.failedItems.length === 0 ? <div className="flex items-center justify-center min-h-full">no items</div> : unmatchlots.failedItems.map((item, index) => (
                                                <div
                                                    className="space-y-4 click_element_smooth_hover"
                                                    key={item?.sku}
                                                >
                                                    <div
                                                        className={`rounded-lg bg-white border border-gray-200 shadow-sm`}
                                                    >
                                                        <div className="p-4 md:p-6">
                                                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                                                {/* Image */}
                                                                <div className="w-full md:w-[250px] lg:w-[300px] flex items-center justify-center">
                                                                    <div className="overflow-hidden rounded-lg border border-gray-300 h-fit w-full">
                                                                        {/* {item.color_code !== "N/A" ? (
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
                                                                        )} */}

                                                                        <img
                                                                            src={fomartImageSrcString(item?.type, item?.color_id, item?.sku, item?.brickosys_order_id) || item?.image}
                                                                            alt=""
                                                                            className="h-[180px] md:h-[200px] w-full object-contain"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 space-y-4 md:space-y-6">
                                                                    {/* Title Section */}
                                                                    <div className="space-y-2">
                                                                        <div className="bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 w-fit rounded-lg">
                                                                            {item?.type}
                                                                        </div>
                                                                        {/* <h2 className="text-lg md:text-xl text-gray-800 font-semibold">{item?.item_name}</h2> */}
                                                                        <p className="text-sm text-gray-600 ml-1"> <span className="font-bold">Design Id: </span>{item?.sku}</p>
                                                                        <p className="text-sm text-gray-600 ml-1"> <span className="font-bold">Price: </span>{item?.price}</p>
                                                                    </div>

                                                                    {/* Location and Pick Section */}
                                                                    <div
                                                                        className="flex flex-col md:flex-row gap-2 md:gap-4"
                                                                        onClick={(e) => e.stopPropagation()} // Prevent toggleItemProcessed
                                                                    >

                                                                        <>
                                                                            {/* Location */}
                                                                            <div className="flex-1">
                                                                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                                                                    LOCATION
                                                                                </label>
                                                                                <div className="rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-base text-gray-800 h-10">
                                                                                    {item?.remarks || ""}
                                                                                </div>
                                                                            </div>

                                                                            {/* Pick */}
                                                                            <div>
                                                                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                                                                    PICK
                                                                                </label>
                                                                                <div className="flex items-center">
                                                                                    <span className="h-10 w-16 border border-gray-300 bg-gray-50 text-base relative pt-2 pl-2 text-gray-800 rounded-l-lg">
                                                                                        {item?.quantity}
                                                                                    </span>
                                                                                    {/* <span className="text-lg font-medium text-purple-600 bg-purple-100 h-10 w-10 pt-2 text-center rounded-r-lg">
                                                                                        {findOrderIndexForItem(allOrders, item.item_id, item.order_id)?.orderIndex + 1}
                                                                                    </span> */}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}

                                        </div>


                                    </div>
                                </div>
                                {/* </div> */}

                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
