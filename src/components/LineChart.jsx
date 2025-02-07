import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function LineChart() {
  const data = [
    { time: '10:30 AM', calls: 2000 },
    { time: '11:30 AM', calls: 4000 },
    { time: '12:30 AM', calls: 3000 },
    { time: '01:30 PM', calls: 5000 },
    { time: '02:30 PM', calls: 7546 },
    { time: '03:30 PM', calls: 6000 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 rounded-lg shadow-lg border">
                    <p className="text-sm font-medium">
                      {payload[0].value} calls
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#bbe90b"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              fill: '#ffffff',
              stroke: '#818cf8',
              strokeWidth: 2,
            }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;
