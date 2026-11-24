import { education, experience, profile, projects, skillGroups } from "@/data/profile";
import { seo, siteUrl } from "@/data/site";

// Schema.org description of the page for search engines (rendered server-side, no client JS).
// Email and phone are deliberately left out: the site never prints them either.
export default function StructuredData() {
  const id = (name: string) => `${siteUrl}/#${name}`;
  const job = experience[0];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": id("website"),
        url: siteUrl,
        name: profile.name,
        description: seo.description,
        inLanguage: "en",
        publisher: { "@id": id("person") },
      },
      {
        "@type": "ProfilePage",
        "@id": id("profile"),
        url: siteUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": id("website") },
        mainEntity: { "@id": id("person") },
        primaryImageOfPage: `${siteUrl}/opengraph-image.jpg`,
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": id("person"),
        name: profile.name,
        alternateName: profile.shortName,
        givenName: profile.firstName,
        familyName: "Muduli",
        jobTitle: profile.role,
        description: profile.summary,
        url: siteUrl,
        image: `${siteUrl}/images/portrait.png`,
        worksFor: { "@id": id("company") },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bhubaneswar",
          addressRegion: "Odisha",
          addressCountry: "IN",
        },
        alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.org })),
        knowsAbout: [...new Set(skillGroups.flatMap((g) => [g.title, ...g.items]))],
        knowsLanguage: profile.languages,
        sameAs: Object.values(profile.socials),
      },
      {
        "@type": "Organization",
        "@id": id("company"),
        name: job.company,
        founder: { "@id": id("person") },
        foundingDate: "2019",
        address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IN" },
      },
      {
        "@type": "ItemList",
        "@id": id("work"),
        name: `Products built by ${profile.name}`,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.name,
            description: p.tagline,
            creator: { "@id": id("person") },
            keywords: p.stack.join(", "),
            ...(p.links.length ? { url: p.links[0].href, sameAs: p.links.map((l) => l.href) } : {}),
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string in the data can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
