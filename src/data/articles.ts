export interface JournalArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  tone: "ruby" | "stone" | "dusk" | "light";
  introduction: string;
  sections: ReadonlyArray<{ title: string; body: string }>;
}

export const articles: JournalArticle[] = [
  {
    slug: "warm-modernism",
    title: "The return of warm modernism",
    category: "Design",
    date: "18 July 2026",
    tone: "ruby",
    introduction:
      "A quieter architectural language is reshaping contemporary homes through warmth, proportion, and material honesty.",
    sections: [
      {
        title: "Beyond minimalism",
        body: "Warm modernism keeps the clarity of modern design while restoring tactility, softness, and a sense of human presence.",
      },
      {
        title: "Materials that age well",
        body: "Natural stone, timber, linen, and patinated metals gain character through use, allowing a home to become more personal over time.",
      },
    ],
  },
  {
    slug: "lagos-climate",
    title: "Building for the Lagos climate",
    category: "Architecture",
    date: "03 July 2026",
    tone: "stone",
    introduction:
      "Climate-responsive design can make luxury residences calmer, healthier, and more efficient.",
    sections: [
      {
        title: "Shade before cooling",
        body: "Deep terraces, screens, and careful orientation reduce solar gain while preserving generous views and daylight.",
      },
      {
        title: "Landscape as infrastructure",
        body: "Planting, permeable surfaces, and water-sensitive design help architecture work with seasonal conditions rather than against them.",
      },
    ],
  },
  {
    slug: "landscape-at-the-door",
    title: "Why landscape begins at the front door",
    category: "Living",
    date: "22 June 2026",
    tone: "dusk",
    introduction:
      "The experience of home begins long before the private residence is reached.",
    sections: [
      {
        title: "The sequence of arrival",
        body: "A considered threshold creates a gradual transition from the energy of the city to a quieter private world.",
      },
      {
        title: "Everyday nature",
        body: "Layered planting, shade, scent, and moving water make landscape part of daily life rather than a distant view.",
      },
    ],
  },
  {
    slug: "material-library",
    title: "Inside the material library",
    category: "Studio",
    date: "08 June 2026",
    tone: "light",
    introduction:
      "Every Dexta Africa project begins with a physical conversation between materials.",
    sections: [
      {
        title: "Testing in real light",
        body: "Samples are reviewed throughout the day because colour, grain, and reflectivity change profoundly as natural light moves.",
      },
      {
        title: "A disciplined palette",
        body: "Limiting the number of materials gives each one room to be understood and makes the complete environment feel composed.",
      },
    ],
  },
];
