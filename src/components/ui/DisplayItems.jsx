import React from 'react'

import { findOrderIndexForItem, fomartImageSrcString } from '../helper/constant';

function DisplayItems({ item, pool, toggleItemProcessed, allOrders, missingNote = "", expandItem, toggleMissingItems }) {

    return (
        pool === "processed" ? (
            <div
                key={item.item_id}
                className="flex flex-col md:flex-row items-center gap-4 rounded-lg p-4 cursor-pointer bg-green-200"
                onClick={(e) => toggleItemProcessed(item.item_id, item.order_id)}
            >
                {console.log(item)}
                <img
                    src={fomartImageSrcString(item.item_type, item.color_id, item.sku, item.brickosys_order_id) || item.image}
                    alt={item.item_name}
                    className="h-16 w-16 rounded-lg object-cover"
                    width={16}
                />
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-blue-100 text-blue-600 rounded-lg w-fit px-2">
                            {item.item_type}
                        </div>
                        <span className="text-amber-800">{item.color}</span>
                        <span className="text-zinc-600">{item.item_id}</span>
                    </div>
                    <h3 className="text-lg text-black-300">{item.item_name}</h3>
                    <div className="text-sm text-zinc-500">{item.location}</div>
                    <div className="text-sm text-zinc-500">{missingNote}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-800">{item.quantity}</span>
                    <div className="rounded bg-purple-400/20 px-2 py-1 text-lg text-purple-600">
                        {findOrderIndexForItem(allOrders, item.item_id, item.order_id)?.orderIndex + 1}
                    </div>
                </div>
            </div>
        ) : pool === "missing" ? (
            <div
                key={item.item_id}
                onClick={() => toggleMissingItems(item.order_id, item.item_id, missingNote, "remove")}
                className="flex flex-col md:flex-row items-center gap-4 rounded-lg bg-red-200/50 p-4"
            >
                {/* {item.item_type?.toLowerCase() === "part" && console.log(fomartImageSrcString(item.item_type, item.color_id, item.sku)|| `https:`+ item.img)} */}
                <img
                    src={fomartImageSrcString(item.item_type, item.color_id, item.sku, item.brickosys_order_id) || item.image}
                    alt={item.item_name}
                    className="h-16 w-16 rounded-lg object-cover"
                    width={16}
                />
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-blue-100 text-blue-600 rounded-lg w-fit px-2">
                            {item.item_type}
                        </div>
                        <span className="text-amber-800">{item.color}</span>
                        <span className="text-gray-500">{item.item_id}</span>
                    </div>
                    <h3 className="text-lg text-black-300">{item.item_name}</h3>
                    <div className="text-sm text-zinc-500">{item.location}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-800">{item.quantity}</span>
                    <div className="rounded bg-purple-400/20 px-2 py-1 text-lg text-purple-600">
                        {findOrderIndexForItem(allOrders, item.item_id, item.order_id)?.orderIndex + 1}
                    </div>
                </div>
            </div>
        ) : (
            <div
                key={item.item_id}
                className="flex flex-col md:flex-row items-center gap-4 rounded-lg bg-white border border-gray-200 shadow-sm p-4"
                onClick={(e) => toggleItemProcessed(item.item_id, item.order_id)}
            >
                {/* {item.item_type?.toLowerCase() === "part" && console.log(fomartImageSrcString(item.item_type, item.color_id, item.sku)|| `https:`+ item.img)} */}
                <img
                    src={fomartImageSrcString(item.item_type, item.color_id, item.sku, item.brickosys_order_id) ||  item.image}
                    alt={item.item_name}
                    className="h-16 w-16 rounded-lg object-cover"
                    width={16}
                />
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-orange-100 text-orange-600 rounded-lg w-fit px-2">
                            {item.item_type}
                        </div>
                        <span className="text-zinc-600">{item.color}</span>
                        <span className="text-zinc-600">{item.item_id}</span>
                    </div>
                    <h3 className="text-lg text-black-300">{item.item_name}</h3>
                    <div className="text-sm text-zinc-500">{item.location}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-800">{item.quantity}</span>
                    <div className="rounded bg-orange-400/20 px-2 py-1 text-lg text-orange-600 text-center w-full">
                        {findOrderIndexForItem(allOrders, item.item_id, item.order_id)?.orderIndex + 1}
                    </div>
                </div>
            </div>
        )
    );
}

export default DisplayItems