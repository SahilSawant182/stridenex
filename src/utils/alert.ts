let isAlertShowing = false;

export const customAlert = (message: string) => {
  if (typeof window === "undefined") return;
  if (isAlertShowing) {
    console.log(`[Alert Suppressed]: ${message}`);
    return;
  }
  isAlertShowing = true;
  setTimeout(() => {
    window.alert(message);
    isAlertShowing = false;
  }, 50);
};
