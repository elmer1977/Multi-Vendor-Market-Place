// Placeholder for Firebase push, not used in this project.
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'New Notification', body: 'You have a new message.' };
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
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