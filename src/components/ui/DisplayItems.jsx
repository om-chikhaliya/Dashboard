import React, { useState } from 'react';
import { findOrderIndexForItem, fomartImageSrcString } from '../helper/constant';
import { FaSearchPlus } from 'react-icons/fa';
import colors from '../../data/color-pick-item'


function DisplayItems({ item, pool, toggleItemProcessed, allOrders, missingNote = "", expandItem, toggleMissingItems }) {
    const [modalOpen, setModalOpen] = useState(false);

    const imageSrc = fomartImageSrcString(item.item_type, item.color_id, item.sku, item.brickosys_order_id) || item.image;

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <>
            <div
                key={item.id}
                className={`flex flex-col md:flex-row items-center gap-4 rounded-lg p-4 cursor-pointer ${pool === "processed" ? "bg-green-200" : pool === "missing" ? "bg-red-200/50" : "bg-white border border-gray-200 shadow-sm"}`}
                onClick={(e) => {
                    if (pool === "missing") {
                        toggleMissingItems(item.brickosys_order_id, item.item_id, item.id, missingNote, "remove");
                    } else {
                        toggleItemProcessed(item.id, item.order_id);
                    }
                }}
            >
                {/* Image Container */}
                <div className="relative" onClick={(e) => { e.stopPropagation(); openModal(); }}>
                    <button
                        className=""
                        onClick={(e) => { e.stopPropagation(); openModal(); }}
                    >
                        <img
                            src={imageSrc}
                            alt={item.item_name}
                            className="h-16 w-16 rounded-lg object-cover cursor-pointer"
                            width={16}
                        />
                        {/* <FaSearchPlus className="text-xl" /> */}
                    </button>
                </div>

                {/* Item Details */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className={`${pool === "processed" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"} rounded-lg w-fit px-2`}>
                            {item.item_type}
                        </div>
                        <div className={`${pool === "processed" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"} rounded-lg w-fit px-2`}>
                            {item.new_or_used === "N" ? "New" : item.new_or_used === "U" ? "Used" : "N/A"}
                        </div>

                        <span className="text-zinc-600">{item.color}</span>
                        <span className="text-zinc-600">{item.sku}</span>
                    </div>
                    <h3 className="text-lg text-black-300">{item.item_name}</h3>
                    <div className="text-sm text-zinc-500">{item.location}</div>
                    {pool === "missing" && <div className="text-sm text-black-500 font-semibold">Note: {missingNote}</div>}
                </div>

                {/* Quantity and Order Index */}
                <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-800">{item.quantity}</span>
                    <div className={`rounded px-2 py-1 text-lg ${colors[findOrderIndexForItem(allOrders, item.item_id, item.order_id)?.orderIndex % colors.length]}`}>
                        {findOrderIndexForItem(allOrders, item.item_id, item.order_id)?.orderIndex + 1}
                    </div>
                </div>
            </div>

            {/* Modal for Enlarged Image */}
            {modalOpen && (
                <div className="fixed -inset-10 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeModal}>
                    <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute -top-5 -right-5 text-white text-2xl bg-gray-800 rounded-full p-2" onClick={closeModal}>&times;</button>
                        <img src={imageSrc} alt={item.item_name} className="w-full h-auto rounded-lg" />
                        <h3 className="text-lg font-semibold text-center mt-4">{item.item_name}</h3>
                    </div>
                </div>
            )}
        </>
    );
}

export default DisplayItems;

// {/* <div className="relative" onClick={(e) => { e.stopPropagation(); openModal(); }}>
//                     <button
//                         className=""
//                         onClick={(e) => { e.stopPropagation(); openModal(); }}
//                     >
//                     <img
//                         src={imageSrc}
//                         alt={item.item_name}
//                         className="h-16 w-16 rounded-lg object-cover cursor-pointer"
//                         width={16}
//                     />
//                         {/* <FaSearchPlus className="text-xl" /> */}
//                     </button>
//                 </div> */}

// {modalOpen && (
//     <div className="fixed -inset-10 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeModal}>
//         <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
//             <button className="absolute -top-5 -right-5 text-white text-2xl bg-gray-800 rounded-full p-2" onClick={closeModal}>&times;</button>
//             <img src={imageSrc} alt={item.item_name} className="w-full h-auto rounded-lg" />
//             <h3 className="text-lg font-semibold text-center mt-4">{item.item_name}</h3>
//         </div>
//     </div>
// )}