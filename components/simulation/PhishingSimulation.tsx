"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import SimulationPopup from "./SimulationPopup";

import {
  getRandomDelay,
  getRandomPopup,
  canShowPopup,
  isExcludedRoute,
  trackPopupInteraction,
} from "./popupEngine";

import { PhishingPopup } from "./popupData";

export default function PhishingSimulation() {
  const pathname = usePathname();

  const [popup, setPopup] =
    useState<PhishingPopup | null>(null);

  const [revealed, setRevealed] =
    useState(false);

  /* -------------------------------- */
  /* POPUP SCHEDULER */
  /* -------------------------------- */

  useEffect(() => {
    if (isExcludedRoute(pathname))
      return;

    let timeout: NodeJS.Timeout;

    const schedulePopup = () => {
      const delay = getRandomDelay();

      timeout = setTimeout(() => {
        if (canShowPopup()) {
          const randomPopup =
            getRandomPopup();

          if (randomPopup) {
            setPopup(randomPopup);

            setRevealed(false);
          }
        }

        schedulePopup();
      }, delay);
    };

    schedulePopup();

    return () => clearTimeout(timeout);
  }, [pathname]);

  /* -------------------------------- */
  /* ACTION CLICK */
  /* -------------------------------- */

  const handleAction = () => {
    if (!popup) return;

    trackPopupInteraction(
      popup.id,
      "clicked"
    );

    setRevealed(true);
  };

  /* -------------------------------- */
  /* CLOSE POPUP */
  /* -------------------------------- */

  const handleClose = () => {
    if (popup && !revealed) {
      trackPopupInteraction(
        popup.id,
        "closed"
      );
    }

    setPopup(null);

    setRevealed(false);
  };

  /* -------------------------------- */
  /* RENDER */
  /* -------------------------------- */

  return (
    <SimulationPopup
      popup={popup}
      onClose={handleClose}
      onAction={handleAction}
      revealed={revealed}
    />
  );
}