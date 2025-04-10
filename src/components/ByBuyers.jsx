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

  const fetchAndStoreBuyers = async () => {
    try {
      const res = await api.get("/order/buyers-summary");
  
      const dataToStore = {
        data: res.data,
        timestamp: Date.now(), // Save current time
      };
  
      sessionStorage.setItem("buyerData", JSON.stringify(dataToStore));
      setBuyers(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
  
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Optionally redirect to login
      } else {
        toast.error("Failed to load dashboard data.");
      }
  
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const cached = sessionStorage.getItem("buyerData");
  
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          const diffInMinutes = (now - timestamp) / (1000 * 60);
  
          if (diffInMinutes < 10) {
            setBuyers(data);
            setLoading(false);
            return;
          } else {
            // Expired: remove stale data
            sessionStorage.removeItem("buyerData");
          }
        }
  
        // If no data or expired, fetch from API
        await fetchAndStoreBuyers();
      } catch (err) {
        console.error("Dashboard fetch error", err);
        setLoading(false);
      }
    };
  
    fetchBuyers();
  }, []);
  

  return (
    <div className="bg-white rounded-lg  overflow-hidden h-full">
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
          <p className="text-center text-gray-500 p-4">Not enough orders to get buyers list.</p>
        ) : (
          <div className="p-2 space-y-2">
            {buyers.slice(0, 5).map((buyer, index) => (
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
