"use client";

import { useState } from "react";
import {
  Calendar,
  Bell,
  MessageCircle,
  ExternalLink,
  Box,
} from "react-feather";
import { Link } from "react-router-dom";

export default function OrdersDetails({allOrders}) {

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
          <div className="flex items-center gap-6">
            <button className="relative">
              <Calendar className="w-6 h-6 text-[#6366F1]" />
            </button>
            <button className="relative">
              <Bell className="w-6 h-6 text-[#6366F1]" />
            </button>
            <button className="relative">
              <MessageCircle className="w-6 h-6 text-[#6366F1]" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {allOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm relative"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-black text-white px-3 py-1 rounded-md text-sm font-semibold">
                      O no.#{order.brickosysId}
                    </div>
                    <Link to={`/order/${order.orderObject.orderId}`}>
                      <ExternalLink size={14} className="text-gray-500" />
                    </Link>
                  </div>
                  <span className="text-sm mt-2 font-semibold">
                    {order.orderObject.buyer}
                  </span>
                  <br />
                  <span className="text-xs font-semibold text-gray-500">
                    {order.orderObject.orderFrom}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-600">
                      High priority
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                      Medium
                    </span>
                    <span className="ml-auto text-sm font-semibold   text-gray-600">
                      {order.orderObject.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#F9F9F9] rounded-lg p-4 flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <Box className="text-black" size={20} />
                  <span className="text-sm font-semibold text-black">
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 appearance-none border-2 border-black checked:bg-black rounded:md checked:text-white checked:before:content-['✓'] checked:before:flex checked:before:justify-center checked:before:items-center focus:outline-none"
                    defaultChecked
                  />
                  <span className=" text-sm font-semibold text-black">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="absolute top-6 right-6">
                <span className="text-md font-medium text-gray-400">
                  {order.orderNumber}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button className="bg-blue-600 text-sm font-semibold text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Continue Later
          </button>
        </div>
      </div>
    </div>
  );
}
