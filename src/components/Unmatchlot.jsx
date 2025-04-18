import { useState, useEffect } from "react";
import { fomartImageSrcString, getContrastTextColor } from "./helper/constant";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import api from "./helper/api";
import img from '../assets/noitems.png'
import { fomartItemSrcString } from './helper/constant'
import { Link, RefreshCcw } from 'react-feather'

export function Unmatchlot() {

    const [unmatchlots, setUnmatchlots] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [boidInputs, setBoidInputs] = useState({});

    const [loadingItemId, setLoadingItemId] = useState(null);

    const fetchUnmatchlot = async () => {
        try {

            // Call the API with the extracted order IDs
            const response = await api.get(`/inventory/failed-syncs`);

            console.log('mismatch: ', response.data)


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

    const handleBoidChange = (e, id) => {
        setBoidInputs(prev => ({ ...prev, [id]: e.target.value }));
    };

    // when you click Submit
    const handleSubmitBoid = async (item) => {
        setLoadingItemId(item.inventory_id);
        const boid = boidInputs[item.inventory_id];
        if (!boid) {
            toast.warn("Please enter a BOID value first");
            setLoadingItemId(null);
            return;
        }
        try {
            const payload = {
                boid,
                inventory_id: item.inventory_id,
                lot_id: item.lot_id,
                sku: item.sku,
                color_id: item.color_id,
                type: item.type,
                quantity: item.quantity || 0,
                price: item.price || 0.0,
                name: item.name,
                remarks: item.remarks || '',
                description: item.description || '',
                full_con: item.full_con,
                new_or_used: item.new_or_used
            };
            const response = await api.post('/mapping/sku-mapping', payload);
            toast.success(response.data.message);
            // optionally clear the input:
            setBoidInputs(prev => ({ ...prev, [item.inventory_id]: "" }));
        } catch (err) {
            console.error("BOID submit failed:", err);
            toast.error("Failed to store BOID");
        } finally {
            setLoadingItemId(null);
        }
    };

    const Refreshpage = () => {
        setIsLoading(true);
        fetchUnmatchlot();
    };

    return (
        <>
            <div className="">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}></Sidebar>
                <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>
                    <div className="flex-1">
                        <Header />
                        <ToastContainer position="top-right" />
                        {isLoading ? <div className="flex justify-center items-center h-[700px]"><ClipLoader className="" size={50} color={"#AAFF00"} /></div> :
                            <div className="">
                                {/* <div className="lg:col-span-2"> */}
                                {/* Item Details section */}
                                {/* <PickUpItems /> */}
                                <div className="flex justify-end mr-6">
                                    <button
                                        onClick={Refreshpage}
                                        className="inline-flex items-center bg-green-500 text-white text-sm px-3 py-2 rounded hover:bg-green-600 transition space-x-1"
                                    >
                                        <RefreshCcw size={14} />
                                        <span>Refresh</span>
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {unmatchlots.failedItems.length === 0 ? <div className="flex items-center justify-center min-h-full"><img src={img} alt="" /></div> : unmatchlots.failedItems.map((item, index) => (
                                                <div
                                                    className="space-y-4 click_element_smooth_hover"
                                                    key={item?.inventory_id}
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
                                                                            src={fomartImageSrcString(item?.type, item?.color_id, item?.sku, item?.brickosys_order_id, item?.name) || item?.image}
                                                                            alt=""
                                                                            className="h-[180px] md:h-[200px] w-full object-contain"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 space-y-4 md:space-y-6">
                                                                    {/* Title Section */}
                                                                    <div className="space-y-2">
                                                                        <div className="flex gap-2">
                                                                            <div className="bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 w-fit rounded-lg">
                                                                                {item?.type}
                                                                            </div>
                                                                            <Link size={15} className="cursor-pointer mt-1" onClick={() => unmatchlots.primary_store === "BrickLink" ? window.open(fomartItemSrcString(item?.type, item?.color_id, item?.sku, item?.name), "_blank") : window.open(`https://www.brickowl.com/search/catalog?query=${item.sku}`, "_blank")} />
                                                                        </div>
                                                                        {/* <h2 className="text-lg md:text-xl text-gray-800 font-semibold">{item?.item_name}</h2> */}
                                                                        <p className="text-sm text-gray-600 ml-1"> <span className="font-bold">Design Id: </span>{item?.sku}</p>
                                                                        <div className="flex gap-2">
                                                                            <p className="text-sm text-gray-600 ml-1"> <span className="font-bold">Name: </span>{item?.name} </p>

                                                                            <div className="ml-auto flex items-center gap-2">
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="BOID"
                                                                                    value={boidInputs[item.inventory_id] || ""}
                                                                                    onChange={e => handleBoidChange(e, item.inventory_id)}
                                                                                    className="w-40 text-sm border px-1 py-1 rounded"
                                                                                />
                                                                                <button
                                                                                    onClick={() => handleSubmitBoid(item)}
                                                                                    disabled={loadingItemId === item.inventory_id}
                                                                                    className={`text-sm px-2 py-1 rounded text-green-800 
                                                                                            ${loadingItemId === item.inventory_id ? 'bg-green-200 cursor-not-allowed' : 'bg-green-200 hover:bg-green-200 text-green-800'}`}
                                                                                >
                                                                                    {loadingItemId === item.inventory_id
                                                                                        ? <ClipLoader size={14} color="#4CAF50" />
                                                                                        : 'Submit'
                                                                                    }

                                                                                </button>
                                                                            </div>
                                                                        </div>
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
                                                                                    QTY
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
                                                                    <p className="text-sm text-gray-600 ml-1"> <span className="font-bold">Description: </span>{item?.description}</p>
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
