export const designSource = {
  system: "UniversalUI local stack",
  manifest: "docs/adr/2026-06-04-universalui-ui-system.md",
  iconSource: "apps/app/src/assets/icons/lucide",
  posture: "dense trust dashboard",
} as const;

export const trustLevels = [
  "self-declared",
  "demo-prevalidated",
  "community-reviewed",
  "expert-mrv-ready",
] as const;
