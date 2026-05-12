"use client";

import { AnimatePresence } from "framer-motion";

import { PhishingPopup } from "./popupData";

import WhatsAppPopup from "./popups/WhatsAppPopup";
import NetflixPopup from "./popups/NetflixPopup";
import InstagramPopup from "./popups/InstagramPopup";
import GooglePopup from "./popups/GooglePopup";
import BankAlertPopup from "./popups/BankAlertPopup";
import SystemAlertPopup from "./popups/SystemAlertPopup";
import RewardPopup from "./popups/RewardPopup";

interface Props {
  popup: PhishingPopup | null;

  onClose: () => void;

  onAction: () => void;

  revealed: boolean;
}

export default function SimulationPopup({
  popup,
  onClose,
  onAction,
  revealed,
}: Props) {
  if (!popup) return null;

  const renderPopup = () => {
    const source =
      popup.source?.toLowerCase() || "";

    /* -------------------------------- */
    /* WHATSAPP */
    /* -------------------------------- */

    if (
      source.includes("whatsapp")
    ) {
      return (
        <WhatsAppPopup
          popup={popup}
          onClose={onClose}
          onAction={onAction}
          revealed={revealed}
        />
      );
    }

    /* -------------------------------- */
    /* NETFLIX */
    /* -------------------------------- */

    if (
      source.includes("netflix")
    ) {
      return (
        <NetflixPopup
          popup={popup}
          onClose={onClose}
          onAction={onAction}
          revealed={revealed}
        />
      );
    }

    /* -------------------------------- */
    /* INSTAGRAM */
    /* -------------------------------- */

    if (
      source.includes("instagram")
    ) {
      return (
        <InstagramPopup
          popup={popup}
          onClose={onClose}
          onAction={onAction}
          revealed={revealed}
        />
      );
    }

    /* -------------------------------- */
    /* GOOGLE */
    /* -------------------------------- */

    if (
      source.includes("google")
    ) {
      return (
        <GooglePopup
          popup={popup}
          onClose={onClose}
          onAction={onAction}
          revealed={revealed}
        />
      );
    }

    /* -------------------------------- */
    /* BANK */
    /* -------------------------------- */

    if (
      source.includes("bank")
    ) {
      return (
        <BankAlertPopup
          popup={popup}
          onClose={onClose}
          onAction={onAction}
          revealed={revealed}
        />
      );
    }

    /* -------------------------------- */
    /* SYSTEM */
    /* -------------------------------- */

    if (
      source.includes("system")
    ) {
      return (
        <SystemAlertPopup
          popup={popup}
          onClose={onClose}
          onAction={onAction}
          revealed={revealed}
        />
      );
    }

    /* -------------------------------- */
    /* CYBERSATARK / REWARDS */
    /* -------------------------------- */

    if (
      source.includes(
        "cybersatark"
      ) ||
      popup.type === "modal"
    ) {
      return (
        <RewardPopup
          popup={popup}
          onClose={onClose}
          onAction={onAction}
          revealed={revealed}
        />
      );
    }

    /* -------------------------------- */
    /* DEFAULT */
    /* -------------------------------- */

    return (
      <RewardPopup
        popup={popup}
        onClose={onClose}
        onAction={onAction}
        revealed={revealed}
      />
    );
  };

  return (
    <AnimatePresence>
      {renderPopup()}
    </AnimatePresence>
  );
}