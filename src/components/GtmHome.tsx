"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { CURRENT_ROLE } from "@/lib/current-role";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./GtmHome.module.css";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
  loading: () => <p role="status">Loading the conversation…</p>,
});
const JDAnalyzer = dynamic(() => import("@/components/JDAnalyzer"), {
  ssr: false,
  loading: () => <p role="status">Loading the role comparison…</p>,
});

const systems = [
  {
    number: "01",
    name: "Universal Cognitive Wallet",
    category: "Connected knowledge",
    description:
      "Brings context from different AI tools into a searchable memory layer, so useful knowledge can carry across workflows.",
    href: null,
  },
  {
    number: "02",
    name: "ResearchGravity",
    category: "Research operations",
    description:
      "Organizes research sources, sessions and findings into a reusable knowledge base for future decisions and builds.",
    href: null,
  },
  {
    number: "03",
    name: "CareerCoach",
    category: "Applied AI",
    description:
      "A career intelligence application that connects résumé information and role requirements to support a more informed job search.",
    href: "https://careers.metaventionsai.com",
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
    </svg>
  );
}

function ToolDisclosure({ id, title, description, children }: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [activated, setActivated] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const revealFromHash = () => {
      if (window.location.hash === `#${id}`) {
        setOpen(true);
        setActivated(true);
      }
    };
    revealFromHash();
    window.addEventListener("hashchange", revealFromHash);
    return () => window.removeEventListener("hashchange", revealFromHash);
  }, [id]);

  return (
    <details
      id={id}
      className={styles.tool}
      open={open}
      onToggle={(event) => {
        const nextOpen = event.currentTarget.open;
        setOpen(nextOpen);
        if (nextOpen) setActivated(true);
      }}
    >
      <summary>
        <span><strong>{title}</strong><span className={styles.toolDescription}>{description}</span></span>
        <span className={styles.disclosureIcon} aria-hidden="true">+</span>
      </summary>
      {activated && <div className={styles.toolContent} data-tool-theme={theme}>{children}</div>}
    </details>
  );
}

export default function GtmHome() {
  useEffect(() => {
    // Restore deep links once streamed page content is mounted. The browser
    // may process a fragment before the target section has arrived.
    let frame = 0;
    let observer: ResizeObserver | undefined;
    const scrollToFragment = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      frame = requestAnimationFrame(() => {
        const fragment = window.location.hash.slice(1);
        const target = fragment ? document.getElementById(fragment) : null;
        if (!target) return;
        const alignVisibleSection = () => {
          // Streamed content can mount inside a hidden Suspense container.
          // Wait for layout before aligning the requested section.
          const bounds = target.getBoundingClientRect();
          if (!bounds.width && !bounds.height) return;
          target.scrollIntoView({ behavior: "instant", block: "start" });
          observer?.disconnect();
        };
        observer = new ResizeObserver(alignVisibleSection);
        observer.observe(target);
        alignVisibleSection();
      });
    };
    scrollToFragment();
    window.addEventListener("hashchange", scrollToFragment);
    window.addEventListener("load", scrollToFragment);
    window.addEventListener("pageshow", scrollToFragment);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("hashchange", scrollToFragment);
      window.removeEventListener("load", scrollToFragment);
      window.removeEventListener("pageshow", scrollToFragment);
    };
  }, []);

  return (
    <div className={styles.page}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="Dico Angelo, back to top">Dico Angelo<span aria-hidden="true">.</span></a>
        <nav className={styles.navigation} aria-label="Main navigation">
          <a href="#timeline">Experience</a>
          <a href="#systems">Systems</a>
          <a href="#resume">Résumé</a>
          <a href="#contact">Contact <Arrow diagonal /></a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="top" className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Revenue technology &amp; GTM operations</p>
            <h1 id="hero-title">Better systems.<br /><em>Stronger teams.</em></h1>
            <p className={styles.introduction}>I’m Dico Angelo. I connect the platforms, workflows and people behind go-to-market teams.</p>
            <p className={styles.currentRole}><span className={styles.statusDot} aria-hidden="true" />Currently {CURRENT_ROLE.title} at EZRA, part of the Adecco Group.</p>
            <div className={styles.heroActions}>
              <a href="#timeline" className={styles.primaryLink}>View experience <Arrow /></a>
              <a href="/Dico_Angelo_Resume.pdf" className={styles.textLink} download>Download résumé <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <figure className={styles.portrait}>
            <div className={styles.portraitFrame}>
              <Image src="/headshot.jpg" alt="Dico Angelo" fill priority sizes="(max-width: 640px) 84vw, (max-width: 900px) 36vw, 360px" />
            </div>
            <figcaption><span>Dico Angelo</span><span>Toronto, Canada</span></figcaption>
          </figure>
        </section>

        <section id="timeline" className={styles.section} aria-labelledby="experience-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>01 / Experience</p>
            <h2 id="experience-title">The work behind<br />the perspective.</h2>
            <p>Revenue technology today. A foundation in partner systems and product operations.</p>
          </div>
          <div className={styles.experienceList}>
            <article className={styles.experience}>
              <div className={styles.experienceMeta}><span>Jun 2026 — Present</span><span className={styles.currentLabel}>Current role</span></div>
              <div>
                <p className={styles.company}>{CURRENT_ROLE.company}</p>
                <h3>{CURRENT_ROLE.title}</h3>
                <p className={styles.roleLocation}>{CURRENT_ROLE.location}</p>
                <p>{CURRENT_ROLE.description}</p>
                <ul className={styles.roleBullets}>
                  <li>Revenue platforms, integrations and day-to-day technical operations.</li>
                  <li>AI-enabled workflows, practical onboarding and seller enablement.</li>
                  <li>Tool adoption, license hygiene and coordination with GTM Ops, Marketing Ops, Finance and IT.</li>
                </ul>
              </div>
            </article>
            <article className={styles.experience}>
              <div className={styles.experienceMeta}><span>May 2023 — Nov 2025</span></div>
              <div>
                <p className={styles.company}>Contentsquare</p>
                <h3>Sr. Partner Systems and Operations Specialist</h3>
                <p>Managed partner systems, deal-registration workflows, reporting and enablement for cloud alliance operations with AWS and Microsoft.</p>
                <p className={styles.supportingDetail}>Supported operations for a three-person cloud alliance team with $800M+ in shared pipeline registered.</p>
              </div>
            </article>
            <article className={styles.experience}>
              <div className={styles.experienceMeta}><span>Jun 2020 — May 2023</span></div>
              <div>
                <p className={styles.company}>Rocket Mortgage Canada</p>
                <h3>Product Operations Specialist</h3>
                <p>Supported a 45-agent operation through Salesforce workflows, reporting, product rollouts and quality processes.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="focus" className={`${styles.section} ${styles.focusSection}`} aria-labelledby="focus-title">
          <div className={styles.focusHeading}>
            <p className={styles.eyebrow}>02 / Focus</p>
            <h2 id="focus-title">From a collection of tools<br />to a system people use.</h2>
          </div>
          <div className={styles.focusGrid}>
            <article><span className={styles.focusNumber}>01</span><h3>Connect the stack</h3><p>Platform administration, integrations and reliable handoffs across sales, marketing and customer-facing teams.</p></article>
            <article><span className={styles.focusNumber}>02</span><h3>Make work repeatable</h3><p>Practical automation and AI workflows, with clear inputs, useful outputs and a defined place in the team’s process.</p></article>
            <article><span className={styles.focusNumber}>03</span><h3>Help people adopt it</h3><p>Onboarding, documentation, self-service resources and adoption reporting that make the technology easier to use.</p></article>
          </div>
        </section>

        <section id="systems" className={styles.section} aria-labelledby="systems-title">
          <div className={styles.sectionHeading}>
            <span id="projects" className={styles.anchorAlias} aria-hidden="true" />
            <p className={styles.eyebrow}>03 / Selected systems</p>
            <h2 id="systems-title">An operator<br />who also builds.</h2>
            <p>Through Metaventions AI, my concurrent independent founder work, I explore how AI can improve everyday workflows.</p>
            <a href="/showcase" className={styles.textLink}>Explore more work <Arrow /></a>
          </div>
          <div className={styles.systemList}>
            {systems.map((system) => (
              <article key={system.name} className={styles.system}>
                <div className={styles.systemOverline}><span>{system.number}</span><span>{system.category}</span></div>
                <h3>{system.href ? <a href={system.href} target="_blank" rel="noopener noreferrer">{system.name}<Arrow diagonal /></a> : system.name}</h3>
                <p>{system.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="resume" className={styles.resumeSection} aria-labelledby="resume-title">
          <div>
            <p className={styles.eyebrow}>04 / Résumé</p>
            <h2 id="resume-title">The complete picture.<br /><em>Ready to take with you.</em></h2>
            <p>Experience, capabilities and selected work in one concise document.</p>
          </div>
          <div className={styles.resumeActions}>
            <a href="/Dico_Angelo_Resume.pdf" className={styles.primaryLink} download>Download PDF <span aria-hidden="true">↓</span></a>
            <a href="/Dico_Angelo_Resume.docx" className={styles.textLink} download>Word document <Arrow /></a>
            <span className={styles.updated}>Updated September 2026</span>
          </div>
        </section>

        <section id="contact" className={`${styles.section} ${styles.contactSection}`} aria-labelledby="contact-title">
          <div>
            <p className={styles.eyebrow}>05 / Contact</p>
            <h2 id="contact-title">Let’s make<br /><em>work flow better.</em></h2>
          </div>
          <div className={styles.contactDetails}>
            <p>For conversations about revenue technology, GTM operations and practical AI adoption.</p>
            <a className={styles.emailLink} href="mailto:dico.angelo97@gmail.com">dico.angelo97@gmail.com <Arrow diagonal /></a>
            <div className={styles.socialLinks}>
              <a href="https://www.linkedin.com/in/dico-angelo/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a>
              <a href="https://github.com/Dicoangelo" target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a>
              <a href="https://metaventionsai.com" target="_blank" rel="noopener noreferrer">Metaventions AI <Arrow diagonal /></a>
            </div>
          </div>
        </section>

        <section className={styles.toolsSection} aria-labelledby="tools-title">
          <h2 id="tools-title">A little more context, if you need it.</h2>
          <ToolDisclosure id="ask" title="Ask about my experience" description="An AI guide to my background and work."><Chat /></ToolDisclosure>
          <ToolDisclosure id="analyze" title="Compare a role" description="Explore how my experience connects to a job description."><JDAnalyzer /></ToolDisclosure>
        </section>
      </main>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Dico Angelo</span>
        <span>Revenue technology. Thoughtfully connected.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
