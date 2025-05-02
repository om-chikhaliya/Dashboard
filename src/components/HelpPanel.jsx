import React from 'react';
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from "react";
import {
    ChevronDown,
    Info,
    AlertTriangle,
    CheckCircle,
    LayoutDashboard,
    ShoppingCart,
    GitCompare,
    List,
    DollarSign,
    UserCheck,
    Settings,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const HelpPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedSection, setExpandedSection] = useState("about")
    const [activeTab, setActiveTab] = useState("about")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleSection = (section) => {
        if (expandedSection === section) {
            setExpandedSection("")
        } else {
            setExpandedSection(section)
        }
    }

    if (!mounted) return null
    return (
        <div className="">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className={isSidebarOpen ? "main-content sidebar-open" : "px-4 py-4"}>
                <Header />
                <ToastContainer position="top-right" autoClose={3000} />

                <div className="w-full mx-auto p-6 bg-white font-sans">
                    {/* Custom Font */}
                    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

                    <div className="border-b-2 border-gray-200 pb-6 mb-8">
                        <motion.h1
                            className="text-4xl font-bold text-gray-800 tracking-tight"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Help & Platform Guide
                        </motion.h1>
                        <motion.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <motion.p className="text-gray-500 mt-2">
                                Everything you need to know about using Brickosys effectively
                            </motion.p>
                            <motion.a
                                href="mailto:support@brickosys.com"
                                className="text-blue-500 mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                support@brickosys.com
                            </motion.a>
                        </motion.div>

                    </div>

                    {/* Tab Navigation for larger screens */}
                    <div className="hidden md:flex mb-8 border-b border-gray-200">
                        {["about", "features", "limitations"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab)
                                    setExpandedSection(tab)
                                }}
                                className={`px-4 py-2 font-medium text-sm transition-all duration-200 relative ${activeTab === tab ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab === "about" && "What is Brickosys?"}
                                {tab === "features" && "Key Features"}
                                {tab === "limitations" && "Current Limitations"}

                                {activeTab === tab && (
                                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" layoutId="activeTab" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* About Section */}
                    <motion.div
                        className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-green-50 to-white"
                            onClick={() => toggleSection("about")}
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Info className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">What is Brickosys?</h2>
                            </div>
                            {activeTab !== "about" && <motion.div animate={{ rotate: expandedSection === "about" ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            </motion.div>}
                        </div>

                        <AnimatePresence>
                            {(expandedSection === "about" || activeTab === "about") && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-full md:w-1/3 flex justify-center">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            >
                                                <svg width="200" height="200" viewBox="0 0 200 200">
                                                    <rect
                                                        x="40"
                                                        y="40"
                                                        width="120"
                                                        height="120"
                                                        rx="10"
                                                        fill="#e6f7ef"
                                                        stroke="#34d399"
                                                        strokeWidth="2"
                                                    />
                                                    <rect x="60" y="70" width="80" height="15" rx="2" fill="#34d399" />
                                                    <rect x="60" y="95" width="80" height="15" rx="2" fill="#34d399" opacity="0.7" />
                                                    <rect x="60" y="120" width="80" height="15" rx="2" fill="#34d399" opacity="0.4" />
                                                    <circle cx="160" cy="40" r="20" fill="#34d399" opacity="0.2" />
                                                    <circle cx="40" cy="160" r="20" fill="#34d399" opacity="0.2" />
                                                </svg>
                                            </motion.div>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <p className="text-gray-700 leading-relaxed">
                                                Brickosys is a centralized management tool for LEGO resellers. It allows you to synchronize
                                                inventory, manage orders, track pricing, and streamline operations across both BrickLink and
                                                BrickOwl platforms.
                                            </p>
                                            <p className="text-gray-700 leading-relaxed mt-4">
                                                Our goal is to make store management efficient, transparent, and hassle-free by providing a unified
                                                interface for all your LEGO reselling needs.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div
                        className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-green-50 to-white"
                            onClick={() => toggleSection("features")}
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Key Features</h2>
                            </div>
                            {activeTab !== "features" && <motion.div animate={{ rotate: expandedSection === "features" ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            </motion.div>}
                        </div>

                        <AnimatePresence>
                            {(expandedSection === "features" || activeTab === "features") && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            {
                                                icon: <LayoutDashboard className="h-5 w-5 text-green-500" />,
                                                title: "Dashboard",
                                                description:
                                                    "View detailed sales analytics and order activity since you joined Brickosys. The dashboard offers insights through visual charts and summaries.",
                                            },
                                            {
                                                icon: <ShoppingCart className="h-5 w-5 text-green-500" />,
                                                title: "Orders",
                                                description:
                                                    "Manage the full order lifecycle, including status updates and processing for both BrickLink and BrickOwl orders.",
                                            },
                                            {
                                                icon: <GitCompare className="h-5 w-5 text-green-500" />,
                                                title: "Mismatch Lots",
                                                description:
                                                    "Identify and resolve inventory mismatches that occur during synchronization between platforms.",
                                            },
                                            {
                                                icon: <List className="h-5 w-5 text-green-500" />,
                                                title: "Wishlist Monitoring",
                                                description:
                                                    "Automatically track items with low stock (less than 5 units). Clicking an item takes you to its product page on your primary store.",
                                            },
                                            {
                                                icon: <DollarSign className="h-5 w-5 text-green-500" />,
                                                title: "Price Adjustment",
                                                description:
                                                    "Modify item prices by type with flexible controls. Users can choose a method (e.g. percentage) and adjust prices up or down in bulk.",
                                            },
                                            {
                                                icon: <UserCheck className="h-5 w-5 text-green-500" />,
                                                title: "User Logs",
                                                description:
                                                    "Admins can view user activity, including login times and actions such as picking or viewing items.",
                                            },
                                            {
                                                icon: <Settings className="h-5 w-5 text-green-500" />,
                                                title: "Settings",
                                                description:
                                                    "Store admins can update and manage API keys for both BrickLink and BrickOwl integrations.",
                                            },
                                        ].map((feature, index) => (
                                            <motion.div
                                                key={feature.title}
                                                className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-200"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="bg-white p-2 rounded-full shadow-sm">{feature.icon}</div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{feature.title}</h3>
                                                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Limitations Section */}
                    <motion.div
                        className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-red-50 to-white"
                            onClick={() => toggleSection("limitations")}
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Current Limitations</h2>
                            </div>
                            {activeTab !== "limitations" && <motion.div animate={{ rotate: expandedSection === "limitations" ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            </motion.div>}
                        </div>

                        <AnimatePresence>
                            {(expandedSection === "limitations" || activeTab === "limitations") && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                                            <div className="w-full md:w-1/3 flex justify-center">

                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                >
                                                    <svg width="200" height="150" viewBox="0 0 200 150">
                                                        <path d="M40,110 L100,30 L160,110 Z" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                                                        <text x="100" y="85" textAnchor="middle" fill="#ef4444" fontWeight="bold" fontSize="40">
                                                            !
                                                        </text>
                                                    </svg>
                                                </motion.div>
                                            </div>
                                            <div className="w-full md:w-2/3">
                                                <p className="text-gray-700">
                                                    While Brickosys aims to provide a comprehensive solution, there are some current limitations to be
                                                    aware of. We're actively working on addressing these in future updates.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                {
                                                    title: "Mismatch Lot Handling",
                                                    description:
                                                        "The user must manually handle mismatched lots, as Brickosys currently does not support automatic handling of lot mismatches.",
                                                },
                                                {
                                                    title: "Partial Price Change Support",
                                                    description:
                                                        "The price change feature currently supports BrickLink only. BrickOwl support is under development.",
                                                },
                                                {
                                                    title: "Data History Limitation",
                                                    description:
                                                        "Sales and order analytics are only available from the date the store was registered on Brickosys. Historical data before registration is not included.",
                                                },
                                                {
                                                    title: "Inventory Sync Limitations",
                                                    description:
                                                        (
                                                            <>
                                                                Certain inventory items are not included in the synchronization process.
                                                                <strong> Items stored in Stock Room </strong> and
                                                                <strong> items with zero quantity </strong> are not automatically synced between platforms and require manual management.
                                                            </>
                                                        ),
                                                },
                                            ].map((limitation, index) => (
                                                <motion.div
                                                    key={limitation.title}
                                                    className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-100"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                                >
                                                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">{limitation.title}</h3>
                                                        <p className="text-gray-600 text-sm mt-1">{limitation.description}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Disclaimer Section */}
                    <motion.div
                        className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Info className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Disclaimer</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Brickosys is an independent tool and is not affiliated with LEGO®, BrickLink®, or BrickOwl®. All
                                    trademarks and registered trademarks are the property of their respective owners. While we strive for
                                    accuracy, we cannot guarantee that all data synchronization will be error-free.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>

        </div>
    );
};

export default HelpPanel;
