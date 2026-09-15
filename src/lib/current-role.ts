// Shared by the career timeline, structured profile, and AI answers.
// Role and scope verified against employment records and 2026 GTM objectives.
export const CURRENT_ROLE = {
  date: "Jun 2026 - Present",
  title: "Revenue Technology Manager",
  company: "EZRA (Adecco Group)",
  location: "Toronto, ON / Remote",
  description: "Build and maintain the revenue technology stack supporting EZRA's go-to-market teams. Manage platforms and integrations, develop AI-enabled workflows, and help teams adopt the tools through practical enablement, onboarding, and support.",
  highlights: [
    "Manage revenue platforms, integrations, access, and day-to-day technical operations across the GTM stack",
    "Partner on AI tool deployments and agent workflows that connect sales and marketing systems",
    "Build scalable tech-stack enablement, onboarding, and self-service resources for sellers",
    "Establish tool-adoption reporting, license hygiene, and an operating cadence with GTM Ops, Marketing Ops, Finance, and IT",
    "Audit the technology stack for gaps, overlap, and AI integration opportunities across sales, marketing, and customer-facing teams",
  ],
  metrics: ["Revenue Technology", "AI & Automation", "GTM Enablement"],
};

export const CURRENT_ROLE_CONTEXT = `## Current employment (verified September 2026)
Dico's current employer is ${CURRENT_ROLE.company}. His title is ${CURRENT_ROLE.title}, and he started on June 15, 2026. He works remotely from Toronto.
${CURRENT_ROLE.description}
His responsibilities include ${CURRENT_ROLE.highlights.join("; ")}.
These describe role responsibilities, not claims that every initiative is complete or has delivered a measured outcome.
Metaventions AI is his concurrent independent founder work. Contentsquare is a previous employer; cloud-alliance revenue, marketplace, and co-sell achievements belong to that prior role.
Use these verified facts for current-role questions when older retrieved material conflicts. Do not reverse the title to Technology Revenue Manager or attribute revenue forecasting ownership, SaaS revenue ownership, or hyperscaler co-sell responsibilities to the EZRA role.`;
