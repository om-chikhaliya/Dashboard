import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "./helper/api"; // Make sure you have the correct API helper imported
import { ClipLoader } from "react-spinners";

export function ByBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuyersData = async () => {
      try {
        const response = await api.get("/order/buyers-summary");
        const buyersData = response.data.map((buyer) => ({
          ...buyer,
          avatar: "/placeholder.svg", // Add default avatar
          email: `${buyer.buyer.replace(/\s+/g, "").toLowerCase()}@example.com`, // Generate a mock email
          lastOrder: "Unknown", // Placeholder for last order time (Modify if needed)
        }));

        setBuyers(buyersData);
      } catch (error) {
        console.error("Error fetching buyers:", error);
        setError("Failed to fetch buyers");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyersData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="p-4">
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
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <ClipLoader size={50} color={"#AAFF00"} />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 p-4">{error}</p>
        ) : buyers.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No buyers found</p>
        ) : (
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
                      <AvatarImage src={buyer.avatar} alt={buyer.buyer} />
                      <AvatarFallback>
                        {buyer.buyer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">{buyer.buyer}</h3>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">{buyer.platform}</span>
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">{buyer.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
