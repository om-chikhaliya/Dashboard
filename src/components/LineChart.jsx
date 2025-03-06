import { useState, useEffect } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "./helper/api";

function BarChart({ months }) {
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
    <div className="h-[300px] w-full mt-5">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 rounded-lg shadow-lg border">
                      <p className="text-sm font-medium">
                        {payload[0].value} USD
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="sales"
              fill="#bbe90b" // Change color if needed
              radius={[4, 4, 0, 0]} // Rounded top corners
              barSize={40} // Adjust bar width
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default BarChart;
