function ActivityFeed() {
  const activities = [
    {
      id: 1,
      user: {
        name: 'James Anderson',
        avatar: '/placeholder.svg?height=40&width=40',
        action: 'Called "Books API" with the JavaScript webhook and commented',
      },
      timestamp: '2 mins ago',
    },
    {
      id: 2,
      user: {
        name: 'Vector Sam',
        avatar: '/placeholder.svg?height=40&width=40',
        action: 'Updated the API documentation for version 2.0',
      },
      timestamp: '5 mins ago',
    },
    {
      id: 3,
      user: {
        name: 'Nether Stone',
        avatar: '/placeholder.svg?height=40&width=40',
        action: 'Created a new webhook endpoint',
      },
      timestamp: '10 mins ago',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <img
              src={activity.user.avatar}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h3 className="text-sm font-medium">{activity.user.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {activity.user.action}
              </p>
              <span className="text-xs text-gray-400 mt-0.5 block">
                {activity.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
