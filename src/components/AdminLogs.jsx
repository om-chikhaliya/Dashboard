import { useState, useEffect } from "react";
import api from "./helper/api";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ClipLoader } from "react-spinners";

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get("/auth/logs");
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>

                <Header />

                <div className="p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">User Activity Logs</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <ClipLoader size={50} color={"#AAFF00"} />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                                {/* Table Header */}
                                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                                    <tr>
                                        <th className="px-4 py-3 text-left border-b">User</th>
                                        <th className="px-4 py-3 text-left border-b">Action</th>
                                        <th className="px-4 py-3 text-left border-b">Order ID(s)</th>
                                        <th className="px-4 py-3 text-left border-b">Timestamp</th>
                                        {/* <th className="px-4 py-3 text-left border-b">Duration</th> */}
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="text-gray-600 text-sm divide-y divide-gray-200">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-4 py-3 font-medium">{log.User.email}</td>
                                            <td className="px-4 py-3">{log.action}</td>

                                            {/* Order IDs as Badges */}
                                            <td className="px-4 py-3">
                                                {log.order_id ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {log.order_id.split(",").map((id, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-green-100 text-green-700 px-2 py-1 text-xs font-semibold rounded-lg"
                                                            >
                                                                {id.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>

                                            <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                                            {/* <td className="px-4 py-3 text-center">
                                                {log.duration ? `${log.duration} sec` : "-"}
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>


    );
};

export default AdminLogs;
