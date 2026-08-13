/* Seed order history — written to localStorage on first load via NovaStore.seedOrders */
const NOVA_SEED_ORDERS = [
  {
    id: 'NV-10284',
    date: '2026-08-14',
    status: 'Processing',
    items: [
      { productId: 1, qty: 1, color: 'Black' },
      { productId: 2, qty: 1, color: 'Charcoal' },
    ],
    subtotal: 238,
    shipping: 10,
    discount: 0,
    total: 248,
    eta: 'Aug 18 – Aug 20',
    address: { name: 'Swapnil Kumar', line1: '221B Baker Street', city: 'New Delhi', postal: '110001', phone: '+91 98765 43210' },
    payment: 'Cash on Delivery',
  },
  {
    id: 'NV-10201',
    date: '2026-08-02',
    status: 'Shipped',
    items: [{ productId: 3, qty: 1, color: 'White' }],
    subtotal: 199,
    shipping: 10,
    discount: 15,
    total: 194,
    eta: 'Aug 06 – Aug 08',
    address: { name: 'Swapnil Kumar', line1: '221B Baker Street', city: 'New Delhi', postal: '110001', phone: '+91 98765 43210' },
    payment: 'Credit / Debit Card',
  },
  {
    id: 'NV-10147',
    date: '2026-07-18',
    status: 'Delivered',
    items: [
      { productId: 5, qty: 1, color: 'Graphite' },
      { productId: 9, qty: 1, color: 'Black' },
    ],
    subtotal: 378,
    shipping: 0,
    discount: 0,
    total: 378,
    eta: 'Jul 22 – Jul 24',
    address: { name: 'Swapnil Kumar', line1: '221B Baker Street', city: 'New Delhi', postal: '110001', phone: '+91 98765 43210' },
    payment: 'Mobile Payment',
  },
];

const NOVA_ORDER_STATUS_STEPS = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
