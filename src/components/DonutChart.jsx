import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

function DonutChart() {
  const data = [
    { name: 'New Items(36%)', value: 36, color: '#ef4444' },
    { name: 'Used Items (38%)', value: 38, color: '#3b82f6' },
    { name: 'Other (26%)', value: 100, color: '#a855f7' },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="vertical"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DonutChart;
