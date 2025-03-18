import { useState, useEffect } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
  ComposedChart
} from "recharts";
import api from "./helper/api";
import { ClipLoader } from "react-spinners";

function SalesChart({ months }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await api.get("/order/monthly-sales");
        const result = await response.data;

        // Format sales data (convert "$0.00" to number)
        const formattedData = result.map((item) => ({
          month: item.month,
          sales: parseFloat(item.sales.replace("$", "")), // Convert sales to number
          orders: item.orders || 0, // Orders count
        }));

        // Get only last `months` months
        const filteredData = formattedData.slice(-months);

        setData(filteredData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [months]); // Re-fetch when months change

  return (
    <div className="h-[400px] w-full mt-5  p-4">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <ClipLoader size={50} color={"#AAFF00"} />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
          >
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />

            {/* X Axis (Months) */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            {/* Y Axis Left (Sales $) */}
            <YAxis
              yAxisId="left"
              tick={{ fill: "#64748b", fontSize: 12 }}
              label={{ value: "Sales ($)", angle: -90, position: "insideLeft" }}
            />

            {/* Y Axis Right (Orders) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 12 }}
              label={{ value: "Orders", angle: 90, position: "insideRight" }}
            />

            {/* Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
                      <p className="font-semibold text-gray-900">{payload[0].payload.month}</p>
                      <p className="text-green-600">💰 Sales: ${payload[0].value}</p>
                      <p className="text-blue-600">📦 Orders: {payload[1]?.value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Legend */}
            <Legend />

            {/* Bar Chart for Sales */}
            <Bar
              yAxisId="left"
              dataKey="sales"
              fill="#BBE90B" // Green color for sales
              radius={[6, 6, 0, 0]} // Rounded top corners
              barSize={40} // Adjust bar width
            />

            {/* Line Chart for Orders */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#007BFF" // Blue color for orders
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SalesChart;
