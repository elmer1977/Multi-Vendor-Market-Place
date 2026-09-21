self.addEventListener("push", function (event) {
  let payload = { title: "New Notification", body: "You have a new notification." };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (error) {
      payload = { title: "New Notification", body: event.data.text() };
    }
  }

  const options = {
    body: payload.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: {
      url: payload.url || "/",
      orderId: payload.orderId,
    },
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const targetUrl = event.notification.data.url || "/Multi-Vendor-Market-Place/";
  const url = targetUrl.startsWith("http")
    ? targetUrl
    : `/Multi-Vendor-Market-Place${targetUrl.startsWith("/") ? targetUrl : `/${targetUrl}`}`;
  const clickResponsePromise = clients.openWindow(
    url
  );
  event.waitUntil(clickResponsePromise);
});
