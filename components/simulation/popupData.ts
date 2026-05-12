export type PopupType =
  | "modal"
  | "toast"
  | "notification"
  | "floating-chat"
  | "top-banner"
  | "bottom-alert";

export type DangerLevel =
  | "low"
  | "medium"
  | "high";

export interface PhishingPopup {
  id: number;

  type: PopupType;

  title: string;

  message: string;

  actionText: string;

  cancelText?: string;

  dangerLevel: DangerLevel;

  revealTitle: string;

  revealMessage: string;

  tactics: string[];

  source?: string;
}

export const popupData: PhishingPopup[] = [
  {
    id: 1,

    type: "modal",

    title: "Free Netflix Premium",

    message:
      "Congratulations! You have been selected for a free 12-month Netflix Premium subscription.",

    actionText: "Claim Now",

    cancelText: "Later",

    dangerLevel: "medium",

    revealTitle: "⚠ You Got Phished!",

    revealMessage:
      "This popup used reward-based manipulation to create urgency and excitement.",

    tactics: [
      "Fake rewards",
      "Urgency",
      "Emotional manipulation",
    ],

    source: "Netflix",
  },

  {
    id: 2,

    type: "notification",

    title: "Instagram Security Alert",

    message:
      "Suspicious login attempt detected from Mumbai, India.",

    actionText: "Verify Account",

    cancelText: "Ignore",

    dangerLevel: "high",

    revealTitle: "⚠ Phishing Simulation Triggered",

    revealMessage:
      "Attackers commonly use fake security alerts to panic users into clicking malicious links.",

    tactics: [
      "Fear tactics",
      "Fake security warning",
      "Urgency",
    ],

    source: "Instagram",
  },

  {
    id: 3,

    type: "toast",

    title: "Package Delivery Failed",

    message:
      "Your shipment could not be delivered. Confirm your address now.",

    actionText: "Track Package",

    cancelText: "Close",

    dangerLevel: "medium",

    revealTitle: "⚠ Simulated Delivery Scam",

    revealMessage:
      "Fake courier messages are one of the most common phishing techniques.",

    tactics: [
      "Fake delivery issue",
      "Urgency",
      "Trust exploitation",
    ],

    source: "System",
  },

  {
    id: 4,

    type: "floating-chat",

    title: "WhatsApp Message",

    message:
      "Bro check this photo 😂😂 I can't believe this is you.",

    actionText: "Open Photo",

    cancelText: "Ignore",

    dangerLevel: "high",

    revealTitle: "⚠ Social Engineering Attempt",

    revealMessage:
      "Attackers often impersonate friends or contacts to trick victims into opening malicious links.",

    tactics: [
      "Social engineering",
      "Curiosity bait",
      "Impersonation",
    ],

    source: "WhatsApp",
  },

  {
    id: 5,

    type: "top-banner",

    title: "Google Account Expiring",

    message:
      "Your Google account session will expire today. Re-login required.",

    actionText: "Login Again",

    cancelText: "Dismiss",

    dangerLevel: "high",

    revealTitle: "⚠ Fake Authentication Prompt",

    revealMessage:
      "Phishing pages often imitate login portals to steal credentials.",

    tactics: [
      "Credential harvesting",
      "Fake login prompt",
      "Urgency",
    ],

    source: "Google",
  },

  {
    id: 6,

    type: "bottom-alert",

    title: "System Warning",

    message:
      "Your device may be infected with malware. Immediate scan recommended.",

    actionText: "Run Scan",

    cancelText: "Close",

    dangerLevel: "high",

    revealTitle: "⚠ Fake Antivirus Scam",

    revealMessage:
      "Scareware uses fear and fake system warnings to manipulate users.",

    tactics: [
      "Fear manipulation",
      "Fake malware warning",
      "Pressure tactics",
    ],

    source: "System",
  },

  {
    id: 7,

    type: "notification",

    title: "Bank Verification Required",

    message:
      "Your bank account has been temporarily restricted due to suspicious activity.",

    actionText: "Verify Now",

    cancelText: "Cancel",

    dangerLevel: "high",

    revealTitle: "⚠ Banking Phishing Attempt",

    revealMessage:
      "Financial phishing attacks often impersonate trusted banking institutions.",

    tactics: [
      "Authority impersonation",
      "Fear tactics",
      "Urgency",
    ],

    source: "Bank",
  },

  {
    id: 8,

    type: "modal",

    title: "Campus Placement Opportunity",

    message:
      "You have been shortlisted for an internship opportunity. Confirm eligibility now.",

    actionText: "View Offer",

    cancelText: "Skip",

    dangerLevel: "medium",

    revealTitle: "⚠ Fake Opportunity Scam",

    revealMessage:
      "Cybercriminals frequently exploit career opportunities to target students.",

    tactics: [
      "Career bait",
      "Trust exploitation",
      "Curiosity",
    ],

    source: "CyberSatark",
  },

  {
    id: 9,

    type: "toast",

    title: "Session Timeout",

    message:
      "Your session expired. Login again to continue securely.",

    actionText: "Continue",

    cancelText: "Dismiss",

    dangerLevel: "medium",

    revealTitle: "⚠ Session Hijack Simulation",

    revealMessage:
      "Fake session expiry popups are commonly used to steal credentials.",

    tactics: [
      "Fake authentication",
      "Urgency",
      "Credential phishing",
    ],

    source: "Google",
  },

  {
    id: 10,

    type: "floating-chat",

    title: "Telegram Notification",

    message:
      "You received a private message: 'Important exam paper leaked PDF'",

    actionText: "Open Message",

    cancelText: "Ignore",

    dangerLevel: "high",

    revealTitle: "⚠ Malicious File Bait",

    revealMessage:
      "Attackers often use curiosity and leaked-content bait to spread malware.",

    tactics: [
      "Curiosity bait",
      "Fake leaked content",
      "Social engineering",
    ],

    source: "WhatsApp",
  },

  {
    id: 11,

    type: "modal",

    title: "CyberSatark Premium Access",

    message:
      "Congratulations! You have been selected for free CyberSatark Premium membership for 1 year.",

    actionText: "Activate Access",

    cancelText: "Later",

    dangerLevel: "medium",

    revealTitle: "⚠ Reward-Based Phishing Detected",

    revealMessage:
      "Attackers frequently use fake rewards and premium upgrades to manipulate users into clicking malicious links.",

    tactics: [
      "Fake rewards",
      "Trust exploitation",
      "Excitement manipulation",
    ],

    source: "CyberSatark",
  },

  {
    id: 12,

    type: "notification",

    title: "CyberSatark Threat Alert",

    message:
      "Critical phishing attack detected on your account. Immediate verification required.",

    actionText: "Secure Account",

    cancelText: "Dismiss",

    dangerLevel: "high",

    revealTitle: "⚠ Fake Security Notification",

    revealMessage:
      "Cyber attackers often imitate security alerts to create panic and steal credentials.",

    tactics: [
      "Fear tactics",
      "Urgency",
      "Security impersonation",
    ],

    source: "CyberSatark",
  },

  {
    id: 13,

    type: "toast",

    title: "Exclusive Beta Access",

    message:
      "You were selected to test CyberSatark AI Threat Intelligence before public release.",

    actionText: "Join Beta",

    cancelText: "Close",

    dangerLevel: "medium",

    revealTitle: "⚠ Curiosity-Based Phishing Attempt",

    revealMessage:
      "Exclusive invitations and beta programs are commonly abused in phishing campaigns.",

    tactics: [
      "Curiosity bait",
      "Exclusive access lure",
      "Social engineering",
    ],

    source: "CyberSatark",
  },

  {
    id: 14,

    type: "floating-chat",

    title: "CyberSatark Team Message",

    message:
      "Your phishing awareness score ranked in the top 1%. Claim your reward badge now.",

    actionText: "Claim Badge",

    cancelText: "Ignore",

    dangerLevel: "medium",

    revealTitle: "⚠ Gamified Phishing Simulation",

    revealMessage:
      "Attackers often use fake achievements and rankings to manipulate user behavior.",

    tactics: [
      "Gamification",
      "Reward manipulation",
      "Trust exploitation",
    ],

    source: "CyberSatark",
  },

  {
    id: 15,

    type: "top-banner",

    title: "CyberSatark Giveaway",

    message:
      "Limited-time cybersecurity toolkit giveaway ending in 10 seconds. Hurry!",

    actionText: "Participate",

    cancelText: "Dismiss",

    dangerLevel: "high",

    revealTitle: "⚠ Urgency-Based Phishing Attempt",

    revealMessage:
      "Time pressure is one of the most effective phishing techniques used to bypass critical thinking.",

    tactics: [
      "Urgency",
      "Fake giveaway",
      "Pressure tactics",
    ],

    source: "CyberSatark",
  },
];