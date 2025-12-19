"use client";

import { useEffect } from "react";

export default function GoogleAds() {
  useEffect(() => {
    // Check if user has consented to all cookies
    const checkConsent = () => {
      if (typeof window === "undefined") return false;
      const consent = localStorage.getItem("cookie-consent");
      return consent === "all";
    };

    // Function to load Google Ads script dynamically
    const loadGoogleAdsScript = () => {
      if (typeof window === "undefined") return;

      // Check if script is already loaded
      const existingScript = document.querySelector(
        'script[src*="googletagmanager.com/gtag/js?id=AW-17816842200"]'
      );
      if (existingScript) {
        // Script already loaded, just ensure gtag is initialized
        if (!(window as any).gtag) {
          (window as any).dataLayer = (window as any).dataLayer || [];
          function gtag(...args: any[]) {
            ((window as any).dataLayer as any[]).push(args);
          }
          (window as any).gtag = gtag;
        }
        return;
      }

      // Load the gtag.js script
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=AW-17816842200";
      document.head.appendChild(script);

      // Initialize dataLayer and gtag function
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        ((window as any).dataLayer as any[]).push(args);
      }
      (window as any).gtag = gtag;

      script.onload = () => {
        gtag("js", new Date());
        gtag("config", "AW-17816842200");
      };
    };

    // Function to initialize Google Ads tracking
    const initGoogleAds = () => {
      if (checkConsent()) {
        loadGoogleAdsScript();
      }
    };

    // Initialize if consent already given
    initGoogleAds();

    // Listen for storage changes (when user accepts cookies)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cookie-consent" && e.newValue === "all") {
        initGoogleAds();
      }
    };

    // Listen for custom event from CookieConsent component
    const handleConsentEvent = () => {
      initGoogleAds();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cookieConsentUpdated", handleConsentEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cookieConsentUpdated", handleConsentEvent);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
