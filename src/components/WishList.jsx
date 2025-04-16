import { ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

import api from "./helper/api";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { toast, ToastContainer } from "react-toastify";
import { fomartImageSrcString, fomartItemSrcString } from './helper/constant'
import { ClipLoader } from "react-spinners";

export function WishList() {
    // Use React state to manage the tasks array
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isXMLProcessing, setXMLProcessing] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/order/wishlist");
                console.log('wishlist items: ', response.data)
                setItems(response.data)

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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState("");

    const openModal = (image, name) => {
        setSelectedImage(image);
        setSelectedItemName(name);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const downloadXML = () => {
        setXMLProcessing(true);
        const xmlContent = generateBrickLinkXML(items); // Replace `data` with your state variable holding the list
        const blob = new Blob([xmlContent], { type: "text/xml" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "wanted_list.xml";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setXMLProcessing(false);
    };
    const getItemTypeCode = (type) => {
        const map = {
            PART: "P",
            SET: "S",
            MINIFIG: "M",
            BOOK: "B",
            GEAR: "G",
            CATALOG: "C",
            INSTRUCTION: "I",
            BOX: "O",
        };

        return map[type?.toUpperCase()] || "P"; // fallback to 'P' (Part) if unknown
    };

    const generateBrickLinkXML = (items) => {
        let xml = `<INVENTORY>\n`;

        items.forEach((entry) => {
            const item = entry.item || {};

            xml += `  <ITEM>\n`;
            xml += `    <ITEMTYPE>${getItemTypeCode(item.type)}</ITEMTYPE>\n`;
            xml += `    <ITEMID>${item.no}</ITEMID>\n`;

            if (entry.color_id) xml += `    <COLOR>${entry.color_id}</COLOR>\n`;
            if (entry.unit_price && parseFloat(entry.unit_price) > 0) xml += `    <MAXPRICE>${parseFloat(entry.unit_price)}</MAXPRICE>\n`;
            if (entry.quantity && parseInt(entry.quantity) > 0) xml += `    <MINQTY>${parseInt(entry.quantity)}</MINQTY>\n`;
            if (entry.new_or_used) xml += `    <CONDITION>${entry.new_or_used}</CONDITION>\n`;
            if (entry.remarks) xml += `    <REMARKS>${sanitizeXML(entry.remarks)}</REMARKS>\n`;
            if (entry.description) xml += `    <REMARKS>${sanitizeXML(entry.description)}</REMARKS>\n`;
            xml += `    <NOTIFY>Y</NOTIFY>\n`;
            xml += `  </ITEM>\n`;
        });

        xml += `</INVENTORY>`;
        return xml;
    };

    const sanitizeXML = (text) => {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    };


    return (
        <div className="">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className={isSidebarOpen ? "main-content sidebar-open" : "px-4 py-4"}>
                <Header />
                <ToastContainer position="top-right" autoClose={3000} />
                

                {loading ? <div className="flex justify-center items-center h-[700px]"><ClipLoader className="" size={50} color={"#AAFF00"} /></div> : 
                <>
                <div className="flex justify-end mb-2">
                    <button
                        onClick={downloadXML}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                        {isXMLProcessing ? (
                            <ClipLoader size={20} color="#ffffff" />
                        ) : (
                            "Download XML"
                        )}
                    </button>
                </div>
                <div className="grid gap-4">
                    {items.map((item) => {
                        const isBrickOwl = "boid" in items[0]; // Check if it's a BrickOwl item
                        const itemId = isBrickOwl ? item.boid : item.item.no;
                        const itemName = isBrickOwl ? item.name : item.item.name;
                        const itemType = isBrickOwl ? item.type : item.item.type;
                        const itemQuantity = isBrickOwl ? item.qty : item.quantity;
                        const itemDescription = isBrickOwl ? item.public_note : item.description;
                        const itemRemarks = isBrickOwl ? item.personal_note : item.remarks;
                        const itemPrice = isBrickOwl ? item.price : item.unit_price;
                        const itemImage = isBrickOwl ? item.img : fomartImageSrcString(item.item.type, item.color_id, item.item.no) || item.image;
                        const itemUrl = isBrickOwl
                            ? item.url
                            : fomartItemSrcString(item.item.type, item.color_id, item.item.no);

                        return (
                            <div
                                className={`space-y-4 click_element_smooth_hover cursor-pointer`}
                                key={isBrickOwl ? item.boid : item.inventory_id}
                                onClick={() => window.open(itemUrl, "_blank")}
                            >
                                <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                            {/* Image Section */}
                                            <div className="w-full md:w-[250px] lg:w-[300px] flex items-center justify-center">
                                                <div className="overflow-hidden rounded-lg border border-gray-300 h-fit w-full">
                                                    <div className="relative flex justify-center items-center">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openModal(itemImage, itemName);
                                                            }}
                                                        >
                                                            <img
                                                                src={itemImage}
                                                                alt={itemName}
                                                                className="h-[180px] md:h-[200px] w-full object-contain cursor-pointer"
                                                                width={16}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 space-y-4 md:space-y-6">
                                                {/* Title Section */}
                                                <div className="space-y-2">
                                                    <div className="bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 w-fit rounded-lg">
                                                        {itemType}
                                                    </div>
                                                    <h2 className="text-lg md:text-xl text-gray-800 font-semibold">
                                                        {itemName}
                                                    </h2>
                                                    <p className="text-sm text-gray-600">{itemId}</p>
                                                </div>

                                                {/* Location and Pick Section */}
                                                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                                                    <>
                                                        {/* Location */}
                                                        <div className="flex-1">
                                                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                                                LOCATION
                                                            </label>
                                                            <div className="rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-base text-gray-800 h-10">
                                                                {itemRemarks || "Not Specified"}
                                                            </div>
                                                        </div>

                                                        {/* Quantity & Price */}
                                                        <div className="flex-1">
                                                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                                                QUANTITY
                                                            </label>
                                                            <div className="rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-base text-gray-800 h-10">
                                                                {itemQuantity}
                                                            </div>
                                                        </div>

                                                        <div className="flex-1">
                                                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                                                PRICE
                                                            </label>
                                                            <div className="rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-base text-gray-800 h-10">
                                                                ${itemPrice}
                                                            </div>
                                                        </div>
                                                    </>
                                                </div>

                                                {/* Description */}
                                                <p>
                                                    <span className="font-semibold">Description: </span>
                                                    {itemDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}


                    {/* Modal for Enlarged Image */}
                    {modalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeModal}>
                            <div
                                className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="absolute -top-5 -right-5 text-white text-2xl bg-gray-800 rounded-full p-2"
                                    onClick={closeModal}
                                >
                                    &times;
                                </button>
                                <img src={selectedImage} alt={selectedItemName} className="w-full h-auto rounded-lg" />
                                <h3 className="text-lg font-semibold text-center mt-4">{selectedItemName}</h3>
                            </div>
                        </div>
                    )}
                </div> </>}
            </div>
        </div>
    );
}
