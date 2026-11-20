export type Product = {
  id: string;
  name: string;
  category: "Home" | "Tech" | "Style";
  price: number;
  description: string;
  emoji: string;
  color: string;
  rating: string;
  label?: string;
};

export const products: Product[] = [
  {
    id: "arc-lamp",
    name: "Arc table lamp",
    category: "Home",
    price: 68,
    description:
      "A warm, quiet glow for slow evenings. The sculptural ceramic base and soft linen shade make this an easy fit on a bedside table or reading nook.",
    emoji: "🪔",
    color: "#E9E1D2",
    rating: "4.9",
    label: "BESTSELLER",
  },
  {
    id: "studio-headphones",
    name: "Studio headphones",
    category: "Tech",
    price: 124,
    description:
      "Comfortable over-ear headphones with balanced sound and thoughtful, everyday details. Made for deep focus, long playlists, and everything between.",
    emoji: "🎧",
    color: "#E1E8DE",
    rating: "4.8",
    label: "NEW",
  },
  {
    id: "daily-tote",
    name: "Daily canvas tote",
    category: "Style",
    price: 32,
    description:
      "A sturdy organic-cotton carryall with room for the market, a book, and the little things you pick up along the way.",
    emoji: "👜",
    color: "#EEE2D4",
    rating: "4.7",
  },
  {
    id: "pour-over",
    name: "Pour-over set",
    category: "Home",
    price: 46,
    description:
      "A simple stoneware dripper and matching cup for a slower morning ritual. Designed to feel good in your hands and look at home on your shelf.",
    emoji: "☕",
    color: "#EAE4D9",
    rating: "4.9",
  },
  {
    id: "weekender-bottle",
    name: "Weekender bottle",
    category: "Style",
    price: 28,
    description:
      "A light, double-wall bottle that keeps your drink just right from the first commute to the last stop of the day.",
    emoji: "🧴",
    color: "#DEE8E7",
    rating: "4.6",
  },
  {
    id: "pocket-speaker",
    name: "Pocket speaker",
    category: "Tech",
    price: 84,
    description:
      "Small enough to take anywhere, with clear, room-filling sound and a tactile fabric finish that blends in at home.",
    emoji: "🔊",
    color: "#E5E1EA",
    rating: "4.8",
  },
  {
    id: "soft-throw",
    name: "Soft cotton throw",
    category: "Home",
    price: 58,
    description:
      "A breathable, textured cotton layer for the sofa or the end of the bed. Woven for everyday comfort in a calm, versatile shade.",
    emoji: "🧶",
    color: "#EBE5D9",
    rating: "4.9",
  },
  {
    id: "field-notebook",
    name: "Field notebook set",
    category: "Style",
    price: 18,
    description:
      "Three pocket-sized notebooks with smooth, recycled pages for lists, sketches, and ideas worth keeping close.",
    emoji: "📔",
    color: "#E2E9D8",
    rating: "4.7",
  },
];
