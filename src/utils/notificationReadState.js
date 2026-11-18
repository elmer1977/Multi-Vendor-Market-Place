export const loadReadNotificationIds = (storageKey) => {
  const savedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");
  return Array.isArray(savedIds)
    ? savedIds.filter((id) => typeof id === "string")
    : [];
};

export const persistReadNotification = (
  storageKey,
  notificationId,
  currentIds
) => {
  const nextIds = [
    ...new Set([
      ...loadReadNotificationIds(storageKey),
      ...currentIds,
      notificationId,
    ]),
  ];
  localStorage.setItem(storageKey, JSON.stringify(nextIds));
  return nextIds;
};
