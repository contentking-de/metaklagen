/**
 * Google Ads Conversion Tracking
 * Reports a conversion event to Google Ads
 * @param url Optional URL to redirect to after conversion is reported
 * @returns void
 */
export function gtag_report_conversion(url?: string): void {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return;
  }
  
  // Check if user has consented to all cookies
  const consent = localStorage.getItem("cookie-consent");
  if (consent !== "all") {
    // No consent, proceed with normal flow
    if (url) {
      window.location.href = url;
    }
    return;
  }

  // Check if gtag is available
  if (typeof (window as any).gtag !== "function") {
    console.warn("Google Ads gtag is not loaded");
    if (url) {
      window.location.href = url;
    }
    return;
  }

  const callback = () => {
    if (typeof url !== "undefined" && url) {
      window.location.href = url;
    }
  };

  (window as any).gtag("event", "conversion", {
    send_to: "AW-17816842200/Zo-YCLa--tMbENjf3a9C",
    value: 1.0,
    currency: "EUR",
    event_callback: url ? callback : undefined,
  });
}
