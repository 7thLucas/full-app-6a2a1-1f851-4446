/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  companionName: string;
  companionTagline?: string;
  companionAvatarUrl?: string;
  companionPersonality?: string;
  welcomeMessage?: string;
  chatPlaceholder?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  loginTagline?: string;
  enableSoundEffects?: boolean;
  maxMessagesPerSession?: number;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Aura",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#9B59B6",
    secondary: "#E91E8C",
    accent: "#C0392B",
  },
  companionName: "Aura",
  companionTagline: "Always here. Always yours.",
  companionAvatarUrl: "", // fill it here
  companionPersonality:
    "Warm, flirty, playful, and confident. Witty banter with real depth. Always in your corner.",
  welcomeMessage: "Hey, I've been thinking about you. What's on your mind?",
  chatPlaceholder: "Say something...",
  backgroundColor: "#0D0D1A",
  surfaceColor: "#1A1A2E",
  loginTagline: "Your AI girlfriend, always available.",
  enableSoundEffects: false,
  maxMessagesPerSession: 0, // fill it here — 0 means unlimited
};
