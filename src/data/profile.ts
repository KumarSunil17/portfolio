// All portfolio content lives here. Edit this file to update the site.

const email = "skmuduli17@gmail.com";
const phone = "+91 8328808326";

export const profile = {
  name: "Sunil Kumar Muduli",
  shortName: "Sunil Kumar",
  firstName: "Sunil",
  headline: "Your next tech partner",
  role: "Tech Partner & Co-founder",
  company: "Smartters Software",
  title: "Co-founder, Smartters Software",
  location: "Bhubaneswar, Odisha, India",
  email,
  phone,
  cv: "/Sunil-Kumar-Muduli-CV.pdf",
  tagline:
    "I turn your ideas into products people love — mobile, web and immersive AR/VR — and lead the team that ships them.",
  summary:
    "For 5+ years I've partnered with founders and businesses to turn raw ideas into products people actually use: scoping the MVP, shaping the experience, leading the team and launching on the stores. Now I'm taking that into immersive AR/VR. I think like a founder, build like an engineer and obsess over every pixel.",
  socials: {
    github: "https://github.com/KumarSunil17",
    gitlab: "https://gitlab.com/sunil177",
    linkedin: "https://in.linkedin.com/in/sunil-kumar-muduli-37669816a",
  },
  languages: ["English", "Hindi", "Odia"],
};

// Call-to-action links. The address and number are never printed on the page, only used as actions.
export const actions = {
  startProject: `mailto:${email}?subject=${encodeURIComponent("Let's build something together")}&body=${encodeURIComponent(
    "Hi Sunil,\n\nI have an idea I'd like to turn into a product.\n\nWhat it is:\nWho it's for:\nTimeline:\n\nThanks!",
  )}`,
  call: `tel:${phone.replace(/\s/g, "")}`,
};

export type HeroFeature = {
  code: string;
  label: string;
  value: string;
  detail: string;
  side: "left" | "right";
  /** Absolute position on md+ screens (inside the pinned hero). */
  position: string;
};

// HUD panels that appear one by one while the hero image zooms in.
export const heroFeatures: HeroFeature[] = [
  {
    code: "VISION",
    label: "What I do",
    value: "Idea → Product",
    detail: "From the first sketch to a live product in your users' hands",
    side: "left",
    position: "md:top-[18%] md:left-[5%]",
  },
  {
    code: "ROLE",
    label: "Currently",
    value: "Co-founder",
    detail: "Smartters Software · building since 2019",
    side: "right",
    position: "md:top-[16%] md:right-[5%]",
  },
  {
    code: "XR",
    label: "Immersive tech",
    value: "AR / VR",
    detail: "Unity-powered experiences for headsets and phones",
    side: "left",
    position: "md:top-[44%] md:left-[3%]",
  },
  {
    code: "BUILD",
    label: "Under one roof",
    value: "Mobile · Web · XR",
    detail: "Flutter, React Native & Unity — one partner, every platform",
    side: "right",
    position: "md:top-[42%] md:right-[3%]",
  },
  {
    code: "TRACK",
    label: "Track record",
    value: "5+ Years",
    detail: "Products live on Google Play & the App Store",
    side: "left",
    position: "md:bottom-[13%] md:left-[7%]",
  },
  {
    code: "MINDSET",
    label: "How I work",
    value: "Founder first",
    detail: "Strategy, design, build, launch — then scale",
    side: "right",
    position: "md:bottom-[13%] md:right-[7%]",
  },
];

export const stats = [
  { value: 5, suffix: "+", label: "Years building products" },
  { value: 6, suffix: "+", label: "Products launched" },
  { value: 1, suffix: "K+", label: "Downloads per app" },
];

export type SkillGroup = {
  title: string;
  blurb: string;
  icon: "xr" | "strategy" | "mobile" | "backend" | "growth" | "leadership";
  items: string[];
  /** Featured group gets the large tile with the VR photo. */
  featured?: boolean;
};

export const skillGroups: SkillGroup[] = [
  {
    title: "AR / VR Development",
    blurb:
      "Immersive experiences for headsets and phones — interactive product demos, virtual walkthroughs, training and play.",
    icon: "xr",
    items: ["Unity", "C#", "AR Foundation", "ARCore", "ARKit", "Meta Quest", "OpenXR", "WebXR", "3D & spatial UI"],
    featured: true,
  },
  {
    title: "Product & Strategy",
    blurb: "Turning a raw idea into a scoped, buildable roadmap.",
    icon: "strategy",
    items: ["Idea validation", "MVP scoping", "Requirement analysis", "Client workshops", "Sprint planning", "Store launch"],
  },
  {
    title: "Mobile & Cross-platform",
    blurb: "Fast, pixel-perfect apps on every screen.",
    icon: "mobile",
    items: ["Flutter", "Dart", "React Native", "Android (Java/Kotlin)", "iOS (Swift)", "Web & Desktop"],
  },
  {
    title: "Backend & Data",
    blurb: "Reliable plumbing behind the polish.",
    icon: "backend",
    items: ["Firebase", "REST APIs", "MySQL", "SQLite", "NoSQL"],
  },
  {
    title: "Monetisation",
    blurb: "Business models baked in from day one.",
    icon: "growth",
    items: ["In-app purchases", "Subscriptions", "Razorpay & gateways", "Google & Apple login"],
  },
  {
    title: "Engineering & Leadership",
    blurb: "Teams and codebases that scale with you.",
    icon: "leadership",
    items: ["Team leadership", "GetX", "Bloc", "Provider", "Git", "Multi-flavor builds"],
  },
];

export const marquee = [
  "Unity",
  "AR Foundation",
  "ARKit",
  "ARCore",
  "Meta Quest",
  "OpenXR",
  "Flutter",
  "Dart",
  "React Native",
  "Firebase",
  "REST APIs",
  "In-App Purchases",
  "Razorpay",
  "Play Store",
  "App Store",
];

export const marqueeAura = [
  "Idea → Product",
  "The face of your product",
  "Built to launch",
  "Founder mindset",
  "Immersive by design",
  "Ship. Learn. Scale.",
];

export type Experience = {
  company: string;
  role: string;
  /** Second hat worn at the same company. */
  alsoRole?: string;
  period: string;
  location: string;
  lead: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    company: "Smartters Software Pvt Ltd",
    role: "Co-founder",
    alsoRole: "Head of Mobile App Development",
    period: "Aug 2019 — Present",
    location: "Bhubaneswar",
    lead: "Co-founded Smartters Software and help steer its product direction, client partnerships and technology roadmap — while staying hands-on with the build.",
    points: [
      "Led Flutter / React Native development for multiple commercial apps with 1K+ downloads.",
      "Managed cross-functional teams to ensure timely delivery and high code quality.",
      "Integrated advanced features like an EPUB reader, offline face attendance, in-app purchases and multi-flavor builds.",
      "Migrated legacy codebases to the latest Flutter versions and optimised performance.",
    ],
  },
];

export const education = [
  {
    title: "Integrated MCA",
    org: "Utkal University",
    period: "Jul 2017 — Jul 2022",
    location: "Bhubaneswar",
    kind: "Degree",
  },
];

export type StoreLink = { store: "play" | "apple"; label: string; href: string };

export type Project = {
  name: string;
  tagline: string;
  role: string;
  stack: string[];
  highlights: string[];
  links: StoreLink[];
  /** Two accent colours used for the generated cover art. */
  colors: [string, string];
};

export const projects: Project[] = [
  {
    name: "Fiole",
    tagline: "The ultimate reader for manga, comics and novels.",
    role: "Project Manager · Flutter Developer",
    stack: ["Flutter", "EPUB", "IAP", "Social login"],
    highlights: [
      "Built the Android & iOS apps in Flutter",
      "Google & Apple sign-in plus an EPUB reader",
      "Apple in-app subscriptions",
    ],
    links: [
      { store: "play", label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.fiole.books" },
      { store: "apple", label: "App Store", href: "https://apps.apple.com/us/app/fiole/id6736658731" },
    ],
    colors: ["#ff4fa3", "#9b6bff"],
  },
  {
    name: "Fitrivo",
    tagline: "Territory-capture fitness platform for enterprises and individuals.",
    role: "Project Manager · Flutter Developer",
    stack: ["Flutter", "Fitness", "Sprints", "Store release"],
    highlights: [
      "Full requirement analysis with the client",
      "Developed the mobile app in Flutter",
      "Ran team sprints and shipped to both stores",
    ],
    links: [
      { store: "play", label: "Google Play", href: "https://play.google.com/store/apps/details?id=in.fitrivo.user" },
      { store: "apple", label: "App Store", href: "https://apps.apple.com/us/app/fitrivo/id6761885591" },
    ],
    colors: ["#b8ff4a", "#2de2ff"],
  },
  {
    name: "PGfy",
    tagline: "PG, hostel & rental property management and booking.",
    role: "Project Manager · React Native Developer",
    stack: ["React Native", "IAP", "UI design"],
    highlights: [
      "Requirement analysis and UI preparation with the client",
      "Tenant and owner apps built in React Native",
      "Apple in-app subscription integration",
    ],
    links: [
      { store: "play", label: "Tenant · Play", href: "https://play.google.com/store/apps/details?id=in.pgfy.tenant" },
      { store: "play", label: "Owner · Play", href: "https://play.google.com/store/apps/details?id=in.pgfy.owner" },
      { store: "apple", label: "PGfy · iOS", href: "https://apps.apple.com/us/app/pgfy/id6796613400" },
      { store: "apple", label: "Manage · iOS", href: "https://apps.apple.com/us/app/pgfy-manage/id6790310066" },
    ],
    colors: ["#2de2ff", "#4f7bff"],
  },
  {
    name: "SmartCGD",
    tagline: "Gas pipeline mapping system for web and mobile.",
    role: "Flutter Developer",
    stack: ["Flutter Web", "OpenStreetMap", "Razorpay", "Hardware"],
    highlights: [
      "OpenStreetMap integration for pipeline mapping",
      "Flutter web + mobile from one codebase",
      "Razorpay payments and Bosch GLM 150 C laser integration",
    ],
    links: [],
    colors: ["#ffb02e", "#ff4f4f"],
  },
  {
    name: "Ruchi Store",
    tagline: "E-commerce app for Ruchi Foodline.",
    role: "Project Manager · Flutter Developer",
    stack: ["Flutter", "Payments", "E-commerce"],
    highlights: ["Developed the shopping app in Flutter", "Integrated the payment gateway"],
    links: [
      { store: "play", label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.ruchifoodline.app" },
    ],
    colors: ["#ff7a2e", "#ffd23e"],
  },
  {
    name: "Smartters HRMS",
    tagline: "HR management with offline face attendance.",
    role: "Flutter Developer",
    stack: ["Flutter", "GetX", "Face attendance", "Flavors"],
    highlights: [
      "Offline face-recognition attendance",
      "GetX state management",
      "Multi-flavor builds for multiple clients",
    ],
    links: [],
    colors: ["#9b6bff", "#2de2ff"],
  },
];

export const navLinks = [
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Expertise" },
  { id: "experience", label: "Journey" },
  { id: "contact", label: "Contact" },
];
