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
  const appUrl = new URL(self.registration.scope);
  const requestedUrl = new URL(
    event.notification.data?.url || "/",
    appUrl.origin
  );

  if (requestedUrl.origin !== appUrl.origin) {
    event.waitUntil(clients.openWindow(appUrl.href));
    return;
  }

  let route = requestedUrl.hash
    ? requestedUrl.hash.slice(1)
    : requestedUrl.pathname;
  if (!requestedUrl.hash && route.startsWith(appUrl.pathname)) {
    route = route.slice(appUrl.pathname.length);
  }
  if (requestedUrl.search) {
    route += requestedUrl.search;
  }
  appUrl.hash = route.startsWith("/") ? route : `/${route}`;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(
      (windowClients) => {
        const appClient = windowClients.find(
          (client) => {
            const clientUrl = new URL(client.url);
            return (
              clientUrl.origin === appUrl.origin &&
              clientUrl.pathname.startsWith(
                new URL(self.registration.scope).pathname
              )
            );
          }
        );
        if (appClient) {
          return appClient
            .navigate(appUrl.href)
            .then((client) => client && client.focus());
        }
        return clients.openWindow(appUrl.href);
      }
    )
  );
});
