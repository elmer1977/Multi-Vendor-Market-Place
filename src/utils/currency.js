export const getProductPrice = (item) => {
  const originalPrice = Number(item?.originalPrice);
  if (Number.isFinite(originalPrice) && originalPrice > 0) {
    return originalPrice;
  }

  const fallbackPrice = Number(item?.discountPrice);
  return Number.isFinite(fallbackPrice) && fallbackPrice >= 0
    ? fallbackPrice
    : 0;
};

export const getOrderItemPrice = (item) => {
  const orderPrice = Number(item?.price);
  return Number.isFinite(orderPrice) ? orderPrice : getProductPrice(item);
};

export const calculateCartTotals = (cart = []) => {
  const shopSubtotals = new Map();
  let subTotalCents = 0;

  cart.forEach((item) => {
    const lineTotalCents =
      Math.round(getProductPrice(item) * 100) * Number(item.qty || 0);
    const shopId = String(item.shopId || "");
    shopSubtotals.set(
      shopId,
      (shopSubtotals.get(shopId) || 0) + lineTotalCents
    );
    subTotalCents += lineTotalCents;
  });

  const shippingCents = Array.from(shopSubtotals.values()).reduce(
    (total, shopSubtotal) => total + Math.round(shopSubtotal * 0.1),
    0
  );

  return {
    subTotalPrice: subTotalCents / 100,
    shipping: shippingCents / 100,
    totalPrice: (subTotalCents + shippingCents) / 100,
  };
};

export const formatPrice = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
