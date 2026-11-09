export const getProductPrice = (item) => {
  const originalPrice = Number(item?.originalPrice);
  if (Number.isFinite(originalPrice) && originalPrice >= 0) {
    return originalPrice;
  }

  return 0;
};

export const getOrderItemPrice = (item) => {
  const orderPrice = Number(item?.price);
  return Number.isFinite(orderPrice) ? orderPrice : getProductPrice(item);
};

export const calculateCartTotals = (cart = []) => {
  let subTotalCents = 0;

  cart.forEach((item) => {
    const lineTotalCents =
      Math.round(getProductPrice(item) * 100) * Number(item.qty || 0);
    subTotalCents += lineTotalCents;
  });

  return {
    subTotalPrice: subTotalCents / 100,
    shipping: 0,
    totalPrice: subTotalCents / 100,
  };
};

export const formatPrice = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
