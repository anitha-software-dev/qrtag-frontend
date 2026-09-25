export function determineDeviceType() {
  if (window.navigator.userAgent.match(/Android/i)) {
    return 'Android';
  } else if (window.navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    return 'iOS';
  } else {
    return 'web';
  }
}
