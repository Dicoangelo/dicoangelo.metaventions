export type FieldPhoto = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  location?: string;
  year?: string;
  aspect?: "landscape" | "portrait" | "square";
};

// Photos display in marquee order. Numeric order, feature first.
// Theme: social proof, partnership presence, conversation energy.
// Captions are optional; only add when the event/location is confirmed.
export const fieldPhotos: FieldPhoto[] = [
  {
    id: "feature",
    src: "/gallery/feature.webp",
    alt: "Dico at the Catalyst Summit ballroom table with partner-org peers",
    caption: "Catalyst Summit",
    location: "Seattle",
    year: "2025",
    aspect: "landscape",
  },
  {
    id: "p01",
    src: "/gallery/photo-01.webp",
    alt: "Dico in front of a Black-in-Tech mural at a tech event",
    aspect: "portrait",
  },
  {
    id: "p02",
    src: "/gallery/photo-02.webp",
    alt: "Dico in conversation at an evening reception",
    aspect: "square",
  },
  {
    id: "p03",
    src: "/gallery/photo-03.webp",
    alt: "Dico with a partner at a Cloud Marketplaces summit holding the Clazar guide",
    caption: "Cloud Marketplaces summit",
    aspect: "portrait",
  },
  {
    id: "p04",
    src: "/gallery/photo-04.webp",
    alt: "Dico with the AWS workshop cohort on the staircase",
    caption: "AWS workshop",
    aspect: "portrait",
  },
  {
    id: "p05",
    src: "/gallery/photo-05.webp",
    alt: "Ultimate Partner Members recognition card featuring Dico Angelo",
    caption: "Ultimate Partner member",
    location: "JoinUPX",
    year: "2024",
    aspect: "square",
  },
  {
    id: "p06",
    src: "/gallery/photo-06.webp",
    alt: "Partnership Leaders welcome card featuring Dico Angelo alongside leaders from MotherDuck, HubSpot, FrankieOne, Tipalti and others",
    caption: "Partnership Leaders cohort",
    year: "2024",
    aspect: "landscape",
  },
  {
    id: "p07",
    src: "/gallery/photo-07.webp",
    alt: "Dico in front of giant AWS letters at AWS Summit Los Angeles",
    caption: "AWS Summit",
    location: "Los Angeles",
    year: "2024",
    aspect: "landscape",
  },
  {
    id: "p08",
    src: "/gallery/photo-08.webp",
    alt: "Dico in front of Catalyst step-and-repeat with Seattle skyline backdrop",
    caption: "Catalyst Summit",
    location: "Seattle",
    year: "2025",
    aspect: "portrait",
  },
  {
    id: "p09",
    src: "/gallery/photo-09.webp",
    alt: "Dico in conversation at a private rooftop reception",
    aspect: "landscape",
  },
  {
    id: "p10",
    src: "/gallery/photo-10.webp",
    alt: "Detroit Blockchain Collective venue",
    caption: "Detroit Blockchain Collective",
    aspect: "portrait",
  },
  {
    id: "p11",
    src: "/gallery/photo-11.webp",
    alt: "Welcome to Collision conference signage",
    caption: "Collision",
    aspect: "portrait",
  },
  {
    id: "p12",
    src: "/gallery/photo-12.webp",
    alt: "Dico with two partners at an event",
    aspect: "landscape",
  },
  {
    id: "p13",
    src: "/gallery/photo-13.webp",
    alt: "Dico with a partner at a tech event",
    aspect: "portrait",
  },
  {
    id: "p14",
    src: "/gallery/photo-14.webp",
    alt: "Dico professional headshot",
    aspect: "portrait",
  },
  {
    id: "p15",
    src: "/gallery/photo-15.webp",
    alt: "Dico at the Catalyst step-and-repeat presented by Partnership Leaders, Chicago",
    caption: "Catalyst Chicago",
    location: "Chicago",
    aspect: "portrait",
  },
  {
    id: "p16",
    src: "/gallery/photo-16.webp",
    alt: "PartnerHack event with Dico and partners",
    caption: "PartnerHack",
    aspect: "portrait",
  },
  {
    id: "p17",
    src: "/gallery/photo-17.webp",
    alt: "Group photo at a Real World Assets event",
    aspect: "landscape",
  },
  {
    id: "p18",
    src: "/gallery/photo-18.webp",
    alt: "Conference group portrait at a Boston tech event",
    aspect: "landscape",
  },
  {
    id: "p19",
    src: "/gallery/photo-19.webp",
    alt: "Top Alliances Impact recognition slide naming Dico Angelo as Most Impactful Partner Support, alongside Julia Doran (Top Alliances Manager) and Andrea Della Corte (Top Program Manager)",
    caption: "Most Impactful Partner Support",
    aspect: "landscape",
  },
];
