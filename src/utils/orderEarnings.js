export const getCompletedOrderEarnings = (orders, serviceChargeRate = 0) =>
  (Array.isArray(orders) ? orders : []).reduce((earnings, order) => {
    if (order.status !== "Delivered") return earnings;

    const totalPrice = Number(order.totalPrice);
    if (!Number.isFinite(totalPrice) || totalPrice < 0) return earnings;

    const totalCents = Math.round(totalPrice * 100);
    const serviceChargeCents = Math.round(totalCents * serviceChargeRate);
    return earnings + (totalCents - serviceChargeCents) / 100;
  }, 0);
