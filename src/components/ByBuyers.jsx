import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const buyers = [
  {
    name: "Sarah Miller",
    email: "sarah.m@example.com",
    avatar: "/placeholder.svg",
    orders: 12,
    lastOrder: "2 hours ago",
  },
  {
    name: "John Cooper",
    email: "john.c@example.com",
    avatar: "/placeholder.svg",
    orders: 8,
    lastOrder: "5 hours ago",
  },
  {
    name: "Emma Wilson",
    email: "emma.w@example.com",
    avatar: "/placeholder.svg",
    orders: 15,
    lastOrder: "1 day ago",
  },
  {
    name: "Michael Brown",
    email: "michael.b@example.com",
    avatar: "/placeholder.svg",
    orders: 6,
    lastOrder: "3 days ago",
  },
];

export function ByBuyers() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="p-4 ">
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-title)" }}
        >
          By Buyers
        </h2>
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-simple)" }}
        >
          Active buyers list
        </p>
      </div>
      <hr
        className="border-gray-400 mt-2"
        style={{ marginLeft: "1rem", marginRight: "1rem" }}
      />
      <ScrollArea className="h-[calc(100%-64px)]">
        <div className="p-2 space-y-2">
          {buyers.map((buyer, index) => (
            <div
              key={index}
              className="flex flex-col p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className="flex items-center justify-between mb-2"
                style={{ fontFamily: "var(--font-simple)" }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={buyer.avatar} alt={buyer.name} />
                    <AvatarFallback>
                      {buyer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{buyer.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {buyer.email}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium">{buyer.orders} orders</span>
                <span className="text-muted-foreground">{buyer.lastOrder}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
