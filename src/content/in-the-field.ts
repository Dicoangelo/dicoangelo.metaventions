export type FieldPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location?: string;
  year?: string;
  aspect?: "landscape" | "portrait" | "square";
};

// Order is the marquee order. Mix aspects/scenes for visual rhythm.
export const fieldPhotos: FieldPhoto[] = [
  {
    id: "aws-la-2024",
    src: "/gallery/photo-07.webp",
    alt: "Dico in front of giant AWS letters at AWS Summit Los Angeles",
    caption: "AWS Summit",
    location: "Los Angeles",
    year: "2024",
    aspect: "landscape",
  },
  {
    id: "catalyst-seattle-backdrop",
    src: "/gallery/photo-08.webp",
    alt: "Dico in front of Catalyst step-and-repeat with Seattle skyline backdrop",
    caption: "Catalyst Summit",
    location: "Seattle",
    year: "2025",
    aspect: "portrait",
  },
  {
    id: "catalyst-seattle-group",
    src: "/gallery/feature.webp",
    alt: "Dico at the Catalyst Summit ballroom table with partner-org peers",
    caption: "Catalyst Summit",
    location: "Seattle",
    year: "2025",
    aspect: "landscape",
  },
  {
    id: "bit-mural",
    src: "/gallery/photo-01.webp",
    alt: "Dico in front of a Black-in-Tech mural at a tech event",
    caption: "In the room",
    location: "",
    year: "2026",
    aspect: "portrait",
  },
  {
    id: "clazar",
    src: "/gallery/photo-03.webp",
    alt: "Dico with a partner at a Cloud Marketplaces summit holding the Clazar guide",
    caption: "Cloud Marketplaces summit",
    location: "",
    year: "2026",
    aspect: "portrait",
  },
  {
    id: "aws-workshop",
    src: "/gallery/photo-04.webp",
    alt: "Dico with the AWS workshop cohort on the staircase",
    caption: "AWS workshop",
    location: "",
    year: "2026",
    aspect: "portrait",
  },
  {
    id: "convo",
    src: "/gallery/photo-02.webp",
    alt: "Dico in conversation at an evening reception",
    caption: "In conversation",
    location: "",
    year: "2026",
    aspect: "landscape",
  },
  {
    id: "partnership-leaders",
    src: "/gallery/photo-06.webp",
    alt: "Partnership Leaders welcome card featuring Dico Angelo alongside leaders from MotherDuck, HubSpot, FrankieOne, Tipalti and others",
    caption: "Partnership Leaders cohort",
    location: "",
    year: "2024",
    aspect: "landscape",
  },
  {
    id: "ultimate-partner",
    src: "/gallery/photo-05.webp",
    alt: "Ultimate Partner Members recognition card featuring Dico Angelo",
    caption: "Ultimate Partner member",
    location: "JoinUPX",
    year: "2024",
    aspect: "square",
  },
];
