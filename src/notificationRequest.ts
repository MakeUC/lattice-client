export default async function() {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if(permission !== 'granted'){
    console.error( new Error('Permission not granted for Notification'));
  }
}