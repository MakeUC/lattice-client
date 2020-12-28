/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

self.addEventListener('activate', async () => {
  // This will be called only once when the service worker is activated.
  console.log(`I am activated thank you`);
});

self.addEventListener('push', function(event) {
  if (event.data) {
    console.log('Push event!! ', event.data.text());
    showLocalNotification('Match!', event.data.text(), self.registration);
  } else {
    console.log('Push event but no data');
  }
});

self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close();
  console.log(`notification clicked`, event);
  event.waitUntil(
    clients.matchAll({ type: `window` })
      .then(clientList => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === `/` && `focus` in client) {
            return client.focus();
          }
        }
        if(clients.openWindow) {
          return clients.openWindow(`/notifications`);
        }
      })
  );
});


const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
