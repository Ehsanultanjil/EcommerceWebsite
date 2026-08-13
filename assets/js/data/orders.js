/* Seed order history — written to localStorage on first load via BarazStore.seedOrders */
const BARAZ_SEED_ORDERS = [
  {
    id: 'BZ-10284',
    date: '2026-08-14',
    status: 'Processing',
    items: [
      { productId: 1, qty: 1, color: 'Black' },
      { productId: 2, qty: 1, color: 'Charcoal' },
    ],
    subtotal: 23800,
    shipping: 1000,
    discount: 0,
    total: 24800,
    eta: 'Aug 18 – Aug 20',
    address: { name: 'Swapnil Kumar', line1: '221B Baker Street', city: 'New Delhi', postal: '110001', phone: '+91 98765 43210' },
    payment: 'Cash on Delivery',
  },
  {
    id: 'BZ-10201',
    date: '2026-08-02',
    status: 'Shipped',
    items: [{ productId: 3, qty: 1, color: 'White' }],
    subtotal: 19900,
    shipping: 1000,
    discount: 1500,
    total: 19400,
    eta: 'Aug 06 – Aug 08',
    address: { name: 'Swapnil Kumar', line1: '221B Baker Street', city: 'New Delhi', postal: '110001', phone: '+91 98765 43210' },
    payment: 'Credit / Debit Card',
  },
  {
    id: 'BZ-10147',
    date: '2026-07-18',
    status: 'Delivered',
    items: [
      { productId: 5, qty: 1, color: 'Graphite' },
      { productId: 9, qty: 1, color: 'Black' },
    ],
    subtotal: 37800,
    shipping: 0,
    discount: 0,
    total: 37800,
    eta: 'Jul 22 – Jul 24',
    address: { name: 'Swapnil Kumar', line1: '221B Baker Street', city: 'New Delhi', postal: '110001', phone: '+91 98765 43210' },
    payment: 'Mobile Payment',
  },
];

const BARAZ_ORDER_STATUS_STEPS = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
