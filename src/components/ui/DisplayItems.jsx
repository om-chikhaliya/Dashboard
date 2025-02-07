import React from 'react'

import { findOrderIndexForItem, fomartImageSrcString } from '../helper/constant';

function DisplayItems({ item, pool, toggleItemProcessed, allOrders, missingNote = "", expandItem }) {

    return (
        pool === "processed" ? <div
            key={item.itemId}
            className={`flex items-center gap-4 rounded-lg p-4 cursor-pointer bg-green-200`}
            onClick={(e) => toggleItemProcessed(item.itemId, item.orderId)}
        >
            <img
                src={fomartImageSrcString(item.itemType, item.colorId, item.SKU) || `https:` + item.img}
                alt={item.itemName}
                className="h-16 w-16 rounded-lg object-cover"
                width={16}
            />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-600 rounded-lg w-fit px-2">
                        {item.itemType}
                    </div>
                    <span className="text-amber-800">{item.color}</span>
                    <span className="text-zinc-600">{item.itemId}</span>
                </div>
                <h3 className="text-lg text-black-300">{item.itemName}</h3>
                <div className="text-sm text-zinc-500">{item.location}</div>
                <div className="text-sm text-zinc-500">{missingNote}</div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xl text-gray-800">{item.qty}</span>
                <div className="rounded bg-purple-400/20 px-2 py-1 text-lg text-purple-600">
                    
                    {findOrderIndexForItem(allOrders, item.itemId, item.orderId)?.orderIndex + 1}
                    
                </div>
            </div>

        </div> : pool === "missing" ?

            // missing items
            <div
                key={item.itemId}
                onClick={() => expandItem(item)}
                className={`flex items-center gap-4 rounded-lg bg-red-200/50 p-4 click_element_smooth_hover`}
            >
                <img
                    src={fomartImageSrcString(item.itemType, item.colorId, item.SKU) || `https:` + item.img}
                    alt={item.itemName}
                    className="h-16 w-16 rounded-lg object-cover"
                    width={16}
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-600 rounded-lg w-fit px-2">
                            {item.itemType}
                        </div>
                        <span className="text-amber-800">{item.color}</span>
                        <span className="text-gray-500">{item.itemId}</span>
                    </div>
                    <h3 className="text-lg text-black-300">{item.itemName}</h3>
                    <div className="text-sm text-zinc-500">{item.location}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-800">{item.qty}</span>
                    <div className="rounded bg-purple-400/20 px-2 py-1 text-lg text-purple-600">
                        {findOrderIndexForItem(allOrders, item.itemId, item.orderId)?.orderIndex + 1}
                    </div>
                </div>
            </div>
            :

            <div
                key={item.itemId}
                className={`flex items-center gap-4 rounded-lg bg-white border border-gray-200 shadow-sm p-4 click_element_smooth_hover`}
                onClick={(e) => toggleItemProcessed(item.itemId, item.orderId)}
            >
                <img
                    src={fomartImageSrcString(item.itemType, item.colorId, item.SKU) || `https:` + item.img}
                    alt={item.itemName}
                    className="h-16 w-16 rounded-lg object-cover"
                    width={16}
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-100 text-orange-600 rounded-lg w-fit px-2">
                            {item.itemType}
                        </div>
                        <span className="text-zinc-600">{item.color}</span>
                        <span className="text-zinc-600">{item.itemId}</span>
                    </div>
                    <h3 className="text-lg text-black-300">{item.itemName}</h3>
                    <div className="text-sm text-zinc-500">{item.location}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-800">{item.qty}</span>
                    <div className="rounded bg-orange-400/20 px-2 py-1 text-lg text-orange-600 text-center w-full">
                        {findOrderIndexForItem(allOrders, item.itemId, item.orderId)?.orderIndex + 1}
                    </div>
                </div>
            </div>
    )
}

export default DisplayItems