import { color } from "framer-motion";

export const storeOptions = ["BL", "BO"];

// export const statusOptions = [
//     "Pending (BL/BO)",
//     "Updated (BL)",
//     "Ready (BL)",
//     "Payment Submitted (BO)",
//     "Paid (BL)",
//     "Payment Received (BO)",
//     "Processing (BL/BO)",
//     "Processed (BO)",
//   ];

// export const statusOptions = [
//     // BrickLink
//     "PENDING",
//     "PROCESSING",
//     "READY",
//     "PACKED",
//     "PAID",
//     "CANCELLED",

//     // BrickOwl
//     "Pending",
//     "Payment Received",
//     "Processing",
//     "Processed",
//     "Shipped",
//     "Received"
// ];

export const statusOptions = [
    { label: "Processing (BL)", values: ["PROCESSING"] },
    { label: "Pending (BL)", values: ["PENDING"] },
    { label: "Ready (BL)", values: ["READY"] },
    { label: "Paid (BL)", values: ["PAID"] },
    { label: "Shipped (BL)", values: ["SHIPPED"] },
    { label: "Packed (BL)", values: ["PACKED"] },
    { label: "Cancelled (BL)", values: ["CANCELLED"] },
    { label: "Processing (BO)", values: ["Processing"] },
    { label: "Pending (BO)", values: ["Pending"] },
    { label: "Processed (BO)", values: ["Processed"] },
    { label: "Payment Received (BO)", values: ["Payment Received"] },
    { label: "Shipped (BO)", values: ["Shipped"] },
    { label: "Received (BO)", values: ["Received"] },
];
  
  export const ordersData = [
    {
      orderId: "26626976",
      orderFrom: "BrickLink",
      Buyer: "Sheldon Williams",
      orderDate: "4th November 2024",
      lots: [
        {
          lotId: "LOT001",
          qty: 2,
          lotName: "Building Bricks",
          lotPrice: 22.44,
          items: [
            {
              itemId: "ITEM001",
              itemName: "Red Brick 2x4",
              itemType: "New",
              SKU: "RB24",
              location: "A1-B3",
              qty: 10,
              price: 5.50,
              img: "https://img.bricklink.com/ItemImage/SN/0/4110-1.png",
              color:'black',
            },
            {
              itemId: "ITEM002",
              itemName: "Blue Brick 1x2",
              itemType: "Used",
              SKU: "BB12",
              location: "B2-C4",
              qty: 12,
              price: 16.94,
              img: "https://img.bricklink.com/ItemImage/SN/0/4617-1.png",
              color:'red',
            },
          ],
        },
      ],
      order_total: 54.48,
      shipping: 9.60,
      status: "Paid (BL)",
    },
    {
      orderId: "4891628",
      orderFrom: "BrickOwl",
      Buyer: "Ryan Fisher",
      orderDate: "4th November 2024",
      lots: [
        {
          lotId: "LOT002",
          qty: 1,
          lotName: "Technic Parts",
          lotPrice: 435.42,
          items: [
            {
              itemId: "ITEM003",
              itemName: "Technic Axle 5",
              itemType: "Used",
              SKU: "TA5",
              location: "A1-C2",
              qty: 6,
              price: 65.00,
              img: "https://img.bricklink.com/ItemImage/SN/0/4620-1.png",
              color:'blue',
            },
            {
              itemId: "ITEM004",
              itemName: "Technic Gear 40T",
              itemType: "New",
              SKU: "TG40T",
              location: "C3-D1",
              qty: 12,
              price: 370.42,
              img: "https://img.bricklink.com/ItemImage/SN/0/4652-1.png",
              color:'green',
            },
          ],
          
        },
      ],
      order_total: 440.92,
          shipping: 5.50,
          status: "Payment Received (BO)",
    },
    {
      orderId: "26626239",
      orderFrom: "BrickLink",
      Buyer: "Henry Thurber",
      orderDate: "4th November 2024",
      lots: [
        {
          lotId: "LOT003",
          qty: 12,
          lotName: "Mini Figures",
          lotPrice: 59.84,
          items: [
            {
              itemId: "ITEM005",
              itemName: "Stormtrooper Mini-Figure",
              itemType: "Used",
              SKU: "STMF01",
              location: "A1-D3",
              qty: 5,
              price: 30.00,
              img: "https://img.bricklink.com/ItemImage/SN/0/7072-1.png",
              color:'red',
            },
            {
              itemId: "ITEM006",
              itemName: "Darth Vader Mini-Figure",
              itemType: "Used",
              SKU: "DVF01",
              location: "D2-D4",
              qty: 7,
              price: 29.84,
              img: "https://img.bricklink.com/ItemImage/SN/0/5920-1.png",
              color:'black',
            },
          ],
          
        },
      ],
      order_total: 64.84,
          shipping: 5.00,
          status: "Ready (BL)",
    },
    {
      orderId: "7891234",
      orderFrom: "BrickOwl",
      Buyer: "Emily Watson",
      orderDate: "5th November 2024",
      lots: [
        {
          lotId: "LOT004",
          qty: 3,
          lotName: "Wheels and Tires",
          lotPrice: 75.00,
          items: [
            {
              itemId: "ITEM007",
              itemName: "Rubber Tire Small",
              itemType: "New",
              SKU: "RTS01",
              location: "B1-E2",
              qty: 15,
              price: 30.00,
              img: "https://img.bricklink.com/ItemImage/SN/0/kabdino-1.png",
              color:'yellow',
            },
            {
              itemId: "ITEM008",
              itemName: "Plastic Wheel Medium",
              itemType: "New",
              SKU: "PWM02",
              location: "D2-E3",
              qty: 10,
              price: 45.00,
              img: "https://img.bricklink.com/ItemImage/SN/0/3513-1.png",
              color:'black',
            },
          ],
          
        },
      ],
      order_total: 80.50,
          shipping: 5.50,
          status: "Processing (BL/BO)",
    },
    {
      orderId: "5639271",
      orderFrom: "BrickLink",
      Buyer: "Michael Brown",
      orderDate: "6th November 2024",
      lots: [
        {
          lotId: "LOT005",
          qty: 8,
          lotName: "Custom Sets",
          lotPrice: 120.00,
          items: [
            {
              itemId: "ITEM009",
              itemName: "Castle Set",
              itemType: "New",
              SKU: "CS01",
              location: "H1-F3",
              qty: 1,
              price: 120.00,
              img: "https://img.bricklink.com/ItemImage/SN/0/5494-1.png",
              color:'purple',
            },
          ],
         
        },
      ],
      order_total: 125.00,
      shipping: 5.00,
      status: "Pending (BL/BO)",
    },
  ];

  export function getTotalItemsInOrder(order) {
    return order.items.reduce(
      (totalItems, item) =>
        totalItems + item.quantity,
      0
    );
  }


  

  // for multipleorders
export function getTotalLotsAndItems(orders) {

    return orders.reduce(
      (totals, order) => {
        const lots = order.items.length; // Count of lots in this order
        const items = order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0); // Total items in this order
  
        // Add to the overall totals
        return {
          totalLots: totals.totalLots + lots,
          totalItems: totals.totalItems + items,
        };
      },
      { totalLots: 0, totalItems: 0 } // Initial totals
    );
  }


  export const findOrderIndexForItem = (orders, itemId, orderId) => {
    // Iterate over the orders array
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      
      // Check if the current order matches the given orderId
      if (order.order_id === orderId) {
        // Check if the order contains the item (assuming items is an array in each order)
        const itemIndex = order.items.findIndex(item => item.item_id === itemId); // Adjust based on the structure of the item    
      
        // If the item is found, return the index of the item in the order
        if (itemIndex !== -1) {
          return { orderIndex: i, itemIndex }; // Return the index of the order and the item
        }
      }
    }
  }

  export const fomartImageSrcString = (type, colorid, sku, brickosys_order_id = '', name='') => {

    
    if (brickosys_order_id?.includes('BO')) {
      return null; 
    }

    if(type.toLowerCase() == 'set'){
      return `https://img.bricklink.com/ItemImage/SN/0/${sku}.png`;
    }else if(type.toLowerCase() == 'part'){
      if(colorid === null || colorid === "null") return null;
      return `https://img.bricklink.com/ItemImage/PN/${colorid}/${sku}.png`;
    }else if(type.toLowerCase() == "sticker"){
        return `https://img.bricklink.com/ItemImage/SN/0/${sku}.png`;
    }else if(type.toLowerCase().substr(0, 4) == "mini"){
      return `https://img.bricklink.com/ItemImage/MN/0/${sku}.png`;
    }else if(type.toLowerCase().substr(0, 4) == "inst"){
      if(name.toLowerCase().substr(0,4) == "mini" || sku.includes('-')){
        return `https://img.bricklink.com/ItemImage/SN/0/${sku}.png`
      }
      return `https://img.bricklink.com/ItemImage/BN/0/${sku}.png`;
    }else if(type.toLowerCase() == 'book'){
      return `https://img.bricklink.com/ItemImage/BN/0/${sku}.png`;
    }else if(type.toLowerCase() == 'gear'){
      if(colorid === null || colorid === "null") return null;
      return `https://img.bricklink.com/ItemImage/GN/${colorid}/${sku}.png`;
    }
    
  }

  export const fomartItemSrcString = (type, colorid, sku, name='') => {

    if(type.toLowerCase() == 'set'){
      return `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${sku}#T=S&O={"iconly":0}`;
    }else if(type.toLowerCase() == 'part'){
      return `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${sku}#T=C&C=${colorid}`;
    }else if(type.toLowerCase() == "sticker"){
        return `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${sku}#T=S&O={"iconly":0}`;
    }else if(type.toLowerCase().substr(0, 4) == "mini"){
      return `https://www.bricklink.com/v2/catalog/catalogitem.page?M=${sku}#T=S&O={"iconly":0}`;
    }else if(type.toLowerCase().substr(0, 4) == "inst"){
      if(name.toLowerCase().substr(0,4) == "mini" || sku.includes('-')){
        return `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${sku}#T=S&O={"iconly":0}`
      }
      return `https://www.bricklink.com/v2/catalog/catalogitem.page?B=${sku}#T=S&O={"iconly":0}`;
    }else if(type.toLowerCase() == 'book'){
      return `https://www.bricklink.com/v2/catalog/catalogitem.page?B=${sku}`;
    }else if(type.toLowerCase() == 'gear'){
      return `https://www.bricklink.com/v2/catalog/catalogitem.page?G=${sku}#T=S&C=${colorid}&O={"color":${colorid},"iconly":0}`;
    }
    
  }

  // export const getContrastTextColor = (colorName) => {
  //   return colorName.toLowerCase().split(' ').includes('gray') ? 'black' : 'white';
  // }

  export const getContrastTextColor = (colorName) => {
    const lower = colorName.toLowerCase();
  
    if (
      lower.includes("gray") ||
      lower.includes("white") ||
      lower.includes("trans-clear") ||
      lower.includes("neon yellow") ||
      lower.includes("unknown")
    ) {
      return "black";
    }
  
    return "white";
  };
  

export const formatDateBasedOnUserLocation = (date) => {
  // Get the user's time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
  
  // Format the date and time using the user's time zone
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};


export const decodeHtmlEntities = (str) => {
  if (!str) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};
