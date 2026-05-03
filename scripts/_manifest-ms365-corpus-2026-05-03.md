# MS 365 corpus discovery manifest — 2026-05-03

**Auth**: `DicoAngelo@BlackAmethystCapitalKeyHold.onmicrosoft.com` (verified via device-code).
**Tenant**: `BlackAmethystCapitalKeyHold.onmicrosoft.com` — the literal pre-Metaventions origin per whitepaper Appendix A.
**Privacy gate**: Discovery pass extracted only metadata (names, paths, sender, subject, dates, sizes). No file content. No message bodies. User reviews this manifest before any ingestion.

---

## Source 1: OneDrive (Black Amethyst tenant)

- Drive ID: `b!7fY4nL_PPEO_3UHL-hDtPZ5SkQNW5u5DjFP4vZRE3GBAsD16ITUbRZIqGT1iM5tL`
- Web URL: `https://blackamethystcapitalkeyhold-my.sharepoint.com/personal/dicoangelo_blackamethystcapitalkeyhold_onmicrosoft_com/Documents`
- Drive type: business OneDrive (the `-my.sharepoint.com` subdomain is OneDrive, not a team site)
- Quota: 81.6 GB used / 1 TB total
- Created: 2022-03-06 (pre-Contentsquare, pre-Metaventions — Black Amethyst founding era)
- Root: 277 items, 67.7 GB enumerated (46 folders + 229 files in the listing API; remainder hidden/system)
- Full structured listing: `scripts/_discovery/onedrive-root-listing.json`

### Folder classification (46 root folders, sorted by signal value)

| Folder | Items | Size | Modified | Class | Notes |
|---|---|---|---|---|---|
| `Contentsquare - crossbeam implementation in One CRM ... Contentsquare Mail_files` | 29 | 3 MB | 2025-04-04 | **career-relevant-ingest** | Partner-ops gold: raw artifact of OneCRM cloud-alliance integration work. Closes role:partner-ops gap |
| `Black Amethyst Identity` | 20 | 459 MB | 2022-07-30 | **career-relevant-ingest** | Founding-era brand identity assets |
| `Black Amethyst - Shaolin Samurai - Pilot` | 94 | 518 MB | 2022-05-07 | **career-relevant-ingest** | Pre-Metaventions IP/creative work |
| `Black Amethyst` | 2 | 99 MB | 2022-02-16 | **career-relevant-ingest** | Pre-tenant founding files (oldest folder) |
| `Black Amethyst Identity - Copy` | 24 | 33 MB | 2022-08-07 | unclear | Duplicate of identity folder; verify before ingesting (may have edits) |
| `Dico @ Work` | 15 | 143 MB | 2025-06-22 | **career-relevant-ingest** | Recently maintained work artifacts folder |
| `Notebooks` | 34 | 392 MB | 2022-03-11 | unclear | OneNote notebooks — strategic content possible, but format-heavy |
| `Strategic Thinking` | 10 | 98 MB | 2022-05-06 | **career-relevant-ingest** | Founding-era strategic frameworks |
| `Rebrand` | 20 | 151 MB | 2022-08-07 | unclear | Black Amethyst rebrand iterations — verify before ingest |
| `Microsoft Teams Chat Files` | 69 | 1.1 GB | 2023-03-29 | unclear | May contain partner-ops or coaching context — sample first |
| `Work Transfer` | 153 | 2.8 GB | 2023-01-16 | unclear | Late-2022/early-2023 transition; could be Contentsquare onboarding artifacts. Sample first |
| `Recordings` | 1 | 8 MB | 2026-01-04 | unclear | Recent — sample first |
| `Meetings` | 1 | 0 MB | 2025-01-13 | unclear | Sparse — likely sample |
| `Personal Development Dico` | 28 | 39 MB | 2022-08-07 | **career-relevant-ingest** | Founding-era personal-dev artifacts; aligns with operating-profile memory |
| `StartUp` | 4 | 19 MB | 2022-04-13 | unclear | Pre-Black Amethyst entrepreneurship artifacts |
| `Documents` | 13 | 208 MB | 2022-06-01 | unclear | Generic — sample first |
| `Attachments` | 3 | 328 MB | 2022-08-08 | unclear | Email attachment dump |
| `MidJourney` | 163 | 675 MB | 2022-09-02 | personal-skip | Generated images; not evidence material |
| `1x` | 9 | 1.0 GB | 2022-11-22 | unclear | Unclear name — verify |
| `PowerPoint Exercise Files` | 5 | 234 MB | 2022-06-01 | personal-skip | Likely tutorial files |
| `GTD` | 2 | 0 MB | 2022-03-12 | personal-skip | Productivity sandbox |
| `Apps` | 2 | 0 MB | 2022-05-06 | personal-skip | Tooling |
| `Whiteboards` | 7 | 0 MB | 2024-08-30 | personal-skip | Likely sandbox |
| `Microsoft Copilot Chat Files` | 2 | 0 MB | 2024-10-06 | personal-skip | AI tool chats |
| `Microsoft Teams Data` | 1 | 0 MB | 2022-03-20 | personal-skip | System data |
| `Tickets Purchased` (mail folder, listed for reference) | — | — | — | personal-skip | Reservations |
| `OneDrive_2_5-2-2022` | 12 | 0 MB | 2022-05-03 | personal-skip | OneDrive setup artifact |
| `package` | 2 | 0 MB | 2025-02-14 | personal-skip | npm/Python package — not evidence |
| `ffmpeg-7.1` | 32 | 67 MB | 2025-11-03 | personal-skip | Software install |
| `DockWrapper_v1.0.0` | 0 | 0 MB | 2024-12-09 | personal-skip | Empty dev dump |
| `drive-download-20250411T...` | 5 | 5 MB | 2025-11-03 | unclear | GDrive export — sample |
| `drive-download-20241106T...` | 1 | 0 MB | 2024-11-06 | personal-skip | GDrive export — empty |
| `Scotiabank Application` | 1 | 1 MB | 2024-10-01 | **sensitive-skip** | Bank app — PII |
| `AOL Grading Round 5` | 3 | 0 MB | 2025-11-03 | unclear | Cloud cert grading — could be SA/AWS evidence |
| `The E11even Ecosystem` | 1 | 0 MB | 2023-01-31 | unclear | Miami nightclub — context unclear |
| `Partner Program Integration Strategy - NotebookLM_files` | 0 | 0 MB | 2025-03-21 | **career-relevant-ingest** (when filled) | NotebookLM export of partner-program work; currently empty |
| `CS` | 0 | 0 MB | 2024-10-08 | unclear | Likely Contentsquare — currently empty |
| `Zoom` | 0 | 0 MB | 2025-09-03 | personal-skip | Empty |
| `Finance and money` | 0 | 0 MB | 2025-04-20 | **sensitive-skip** | Likely PII when populated |
| `Scans` | 0 | 0 MB | 2024-10-29 | **sensitive-skip** | Likely PII docs |
| `01 SOVEREIGN SYSTEMS` | 0 | 0 MB | 2025-12-02 | unclear | PARA scaffolding (empty) |
| `02 ENTERPRISE OPS` | 0 | 0 MB | 2025-12-02 | unclear | PARA scaffolding (empty) |
| `03 LIFE ARCHITECTURE` | 0 | 0 MB | 2025-12-02 | unclear | PARA scaffolding (empty) |
| `04 CREATIVE & IP VAULT` | 0 | 0 MB | 2025-12-02 | unclear | PARA scaffolding (empty) |
| `Upload Session 1` | 209 | 9.4 GB | 2025-11-08 | unclear | Recent batch upload — needs sampling |
| `Upload session 2` | 634 | 195 MB | 2025-11-08 | unclear | Recent batch upload — needs sampling |
| `C` | 1 | 9.6 GB | 2025-11-03 | unclear | Likely OS dump (huge single child); skip unless verified |

### High-signal root files (career/partner-ops/founding evidence)

| File | Size | Modified | Class | Notes |
|---|---|---|---|---|
| `The Meta-Manifestation of Black Amethyst Capital Key Holdings and the Metaventions Vision.docx` | <1 MB | 2026-01-25 | **career-relevant-ingest** (top-tier) | Most recent founding vision doc — ties Black Amethyst → Metaventions |
| `Metaventions - Black Amethyst Capital Key Holdings Pitch Deck.pdf` | 1 MB | 2025-05-24 | **career-relevant-ingest** (top-tier) | Foundational deck (PDF cut) |
| `Metaventions - Black Amethyst Capital Key Holdings Pitch Deck.pptx` | 99 MB | 2024-12-20 | unclear | 99 MB pptx — sampling-only feasible (deck native + media) |
| `Resume Dico Angelo - Contentsquare Partner Operations Manager.docx` | <1 MB | 2025-04-08 | **career-relevant-ingest** | Exact partner-ops resume cut — closes role gap |
| `Resume Dico Angelo - Contentsquare Partner Operations Manager - Copy.docx` | <1 MB | 2025-12-21 | **career-relevant-ingest** | Most recent partner-ops resume version |
| `Partner List Template.xlsx` | <1 MB | 2023-10-19 | **career-relevant-ingest** | Partner-ops working artifact |
| `Black Amethyst Capital Key Holdings.vsdx` | <1 MB | 2022-10-13 | **career-relevant-ingest** | Founding-era system architecture diagram |
| `Black Amethyst Flywheel.vsdx` | 2 MB | 2023-02-04 | **career-relevant-ingest** | Strategy framework artifact |
| `Black Amethyst x Mida (1).vsdx` | 11 MB | 2023-02-04 | **career-relevant-ingest** | Mida partnership architecture |
| `Black Amethyst Reconceptualized.vsdx` | <1 MB | 2023-02-03 | **career-relevant-ingest** | Strategy iteration |
| `Black Amethyst Effigy Circle x Strategic Partner Advisor.pdf` | 7 MB | 2022-06-03 | **career-relevant-ingest** | Strategic partner advisor framing |
| `Black Amethyst Foundation.pptx` | 8 MB | 2022-05-26 | **career-relevant-ingest** | Foundational deck v0 |
| `Black Amethyst Meeting Scripting.pdf` | 1 MB | 2022-06-05 | **career-relevant-ingest** | Sales motion artifact |
| `The Black Amethyst Show.pptx` | 112 MB | 2023-01-11 | **career-relevant-ingest** | Speaking event deck (large media) |
| `Dico Angelo - Profile Card.pptx` | 103 MB | 2023-02-08 | **career-relevant-ingest** | Speaking/branding artifact |
| `Mida - Pitch Deck 06.pdf` | 3 MB | 2022-04-13 | **career-relevant-ingest** | Mida partnership pitch |
| `Miami Pitchdeck.pptx` | 99 MB | 2023-03-05 | unclear | Sampling-only feasible |
| `Metaventions - Business one.pptx` | 99 MB | 2023-08-03 | unclear | Sampling-only feasible |
| `Black Amethyst Box.xlsx` + `Box1.xlsx` + advice/csv | <1 MB | 2023-07-07 | unclear | Early data export — verify intent |
| `Dico Angelo 8Fig Customer Success.docx` | <1 MB | 2023-02-04 | **career-relevant-ingest** | Pre-Contentsquare CS artifact |
| `Dico Angelo - RMC Release Agreement (01.16.2023).pdf` | <1 MB | 2023-01-23 | **sensitive-skip** | Legal release — PII |
| Multiple resume variants (`DicoAngeloResume*`, `Dico-Angelo_Resume.pdf`, etc., 2022-2024) | <1 MB each | 2022-10 to 2024-03 | personal-skip | Superseded by 2025 partner-ops version |

---

## Source 2: SharePoint team sites — UPDATED 2026-05-03 (post-Playwright visual)

**Important correction**: the initial empty-search via `search-sharepoint-sites` was a Graph API quirk — `search="*"` returns nothing in this tenant; only **quoted keywords** (KQL) return results. Playwright visual surfaced 8 team sites in the OneDrive Home "Quick Access" panel that are NOT auto-listed by the API but ARE returned when searched by name. **All 8 sites resolved**:

| # | Display name | Site path | Site ID (truncated) | Created | Class |
|---|---|---|---|---|---|
| 1 | **ContentSquare** | `/sites/ContentSquare` | `...,161836ea-f72b-41f7-9fa7-c58c782dacc0,...` | 2023-04-28 | **career-relevant-ingest** (top-tier) |
| 2 | Contentsquare (alt) | `/sites/Contentsquare630` | `...,3f86c707-0dc7-4847-b297-373267ad4cca,...` | 2024-07-24 | unclear (verify if dup or rebrand) |
| 3 | **Black Amethyst Capital Key Holdings** | `/sites/BlackAmethystCapitalKeyHoldings` | `...,8f847d56-63e7-4a9e-bd00-02545d5525ac,...` | 2022-03-21 | **career-relevant-ingest** (founding origin) |
| 4 | Black Amethyst Capital Key Holdings-Black Amethyst | `/sites/BlackAmethystCapitalKeyHoldings-BlackAmethyst` | `...,e4ff5d9b-8c5f-4c88-bc95-0180eb374b12,...` | 2022-03-25 | unclear (likely a sub-site rename) |
| 5 | The Black Amethyst Icon | `/sites/TheBlackAmethystIcon` | `...,5661fe1d-13bb-4fce-8adb-ef772d669938,...` | 2023-04-10 | unclear |
| 6 | A Black Amethyst In The Making | `/sites/ABlackAmethystInTheMaking` | `...,309fc215-b025-4348-9a28-6b11b86c3fcc,...` | 2022-05-05 | **career-relevant-ingest** (founding-era IP) |
| 7 | The Public Decosystem | `/sites/ThePublicDecosystem` | `...,11eb4bd0-016d-436c-bc6c-9ad3441cd76d,...` | 2023-02-02 | **career-relevant-ingest** (Decosystem brand work) |
| 8 | My Life Plan | `/sites/MyLifePlan` | `...,8226b164-217c-4632-ae3c-7b6327f5b185,...` | 2022-10-02 | unclear (personal-dev — verify before ingest) |
| 9 | 10,000 Hours | `/sites/10000Hours` | `...,78c57555-3cb0-4314-9c5a-e5bcc4082f5d,...` | 2023-12-11 | unclear (research site — Blockchain Research.xlsx noted) |
| 10 | Data Storage | `/sites/DataStorage` | `...,76624aa0-db79-4bfe-958a-f965a2d1b2e8,...` | 2023-04-27 | unclear (likely archival) |
| 11 | Project Management | `/sites/ProjectManagement` | `...,3db33367-1ef7-410f-bda0-c5bf4c97d977,...` | 2023-11-24 | unclear |

### ContentSquare team site — drilled (top priority)

- Drive: `Documents` (document library), 31.5 GB used / 25 TB tenant pool
- Drive ID: `b!6jYYFiv390Gfp8WMeC2swKDvBTTTK-ZPvSYbksZjB8IMhAetA-JCQr3WzlVhKN1e`
- Web URL: `https://blackamethystcapitalkeyhold.sharepoint.com/sites/ContentSquare/Shared%20Documents`
- Root: 17 folders, 31.4 GB

| Folder | Items | Size | Class | Notes |
|---|---|---|---|---|
| `General` | 24 | 18.8 GB | **career-relevant-ingest** (top-tier) | Main team-shared partner-ops working folder. Drill before ingest. |
| `New Folder With Items` | 760 | 7.6 GB | unclear | Largest by count — needs sample |
| `Powerpoints` | 47 | 1.97 GB | **career-relevant-ingest** | Partner-ops decks |
| `Videos` | 14 | 1.21 GB | unclear | Recordings — sample first |
| `PDF V2` | 265 | 788 MB | **career-relevant-ingest** | High-volume partner-ops PDFs |
| `Zoom` | 10 | 788 MB | unclear | Zoom recordings — sample |
| `Excel Files` | 161 | 45 MB | **career-relevant-ingest** | Partner-ops spreadsheets |
| `Documentsv2` | 13 | 107 MB | unclear | Drill |
| `Word Documents` | 20 | 18 MB | **career-relevant-ingest** | Partner-ops docs |
| `Project Management` | 17 | 4 MB | **career-relevant-ingest** | PM artifacts |
| `Performance Review` | 5 | 5 MB | **sensitive-skip** OR **career-relevant-ingest** with redaction | Performance reviews — sensitive but evidence (Q3 2023 already verified visible in UI). User decides. |
| `NRFP 4049 - pub - Digital Experience Analytics (DXA)` | 7 | 875 KB | **career-relevant-ingest** | DXA RFP — partner-relevant |
| `Sreenshots_` | 33 | 38 MB | unclear | Likely visual assets |
| `PowerPoint_2019_L1_Data` | 7 | 14 MB | personal-skip | Training material |
| `CSV` | 88 | 13 MB | unclear | Data exports |
| `Scotiabank Application` | 7 | 1.9 MB | **sensitive-skip** | Bank application — PII |
| `Amazon` | 1 | 19 KB | unclear | Sparse |

### Recent files visible in OneDrive UI (Playwright surfaced — Jan 21-29, 2026)

The OneDrive Home Recent panel revealed actively-touched partner-ops files NOT discoverable from the OneDrive root listing alone. All `Location: ContentSquare` entries are in the team site `Documents` library.

**Top recent partner-ops artifacts (Jan 29 batch)**:
- `Action Plan SCA-AWS Management_ Product Technical Strategy (1).pdf` (ContentSquare site)
- `CS + AWS SCA Business Plan 2024.pdf` (ContentSquare site)
- `ContentSquare AWS Partner Plan 2025.pdf` (My Files)
- `SCA Dico Angelo GTM Marketplace.docx` (ContentSquare site)
- `CSQ_SCA_Engagement_Status_CY1Q2 20251001_v1.1.docx` (My Files) — quarterly engagement status
- `Quarterly_Overview__Objectives (1).pdf` (ContentSquare site)
- `24-001897_Partner Innovation - Microsof....pdf` (ContentSquare site) — Microsoft partner innovation
- `24-002820_CountryRegion - CountryRegion of the Year.pdf` (ContentSquare site)
- `Partner Lifecycle Workshop.pdf` (My Files)
- `Partner Program and tracking Process U....docx` (My Files)
- `tinywow_Partner a programs FY Allocatio....docx` (My Files)
- `ContentSquare Partner Programs and Op....docx` (My Files)
- `Partner Programs _ PartnerStack Motions.pdf` (My Files)
- `Partner Investment Program Guide.pdf` (ContentSquare site)
- `Partner Insights - Cloud GTM - Mike Marzano (1).pdf` (ContentSquare site) — references Mike Marzano (per memory: VP, vision/exec/advocacy partner)
- `cloud-center-of-excellence.pdf` (ContentSquare site)
- `AWS_MP_GTM_ProgramOverview.pdf` (ContentSquare site)
- `OnePagerAzure_ContentSquare_9-21-2024 (1).pdf` (ContentSquare site) — Azure one-pager
- `Innovation Workshop NDA_1159 1 [Rev. 5.17.2024].pdf` (ContentSquare site)
- `Innovation Workshop Blog Post.docx` (ContentSquare site) — published content
- `NeedPlex Company Deck.pdf` (ContentSquare site)
- `EXECUTIVE SUMMARY - AI in Partnerships.pdf` (My Files) — partnership AI thesis
- `Contentsquare x MS - Marketplace propensity list - Q1.xlsx` (My Files)
- `Ramp-Up_Guide_Architect.pdf` (ContentSquare site) — architect ramp-up
- `Cloud Operations.pdf` (My Life Plan site)
- `UAT TESTING - PARTNERSTACK.pdf` (My Files) — partnership tooling
- `AWS Skill Builder Course Completion Certifica....pdf` (ContentSquare site) — credential
- `PO001808_Catalyst_Conference-Ticket_for_Dico_Aneglo_Partnership_Leaders....pdf` (ContentSquare site)
- `Metaventions.AI.docx` (ContentSquare site) — Metaventions AI doc cross-filed
- `Metaventions.AI.docx` (Black Amethyst Capital Key Holdings site, Jan 22) — second copy in BACKHs site

**Active session indicator** (opened 7m to 33m before Playwright pull):
- `Partner Operations Manager Transition` (m4a audio, My Files, 7m ago) — likely interview-prep audio
- `EE396FD1-...` video in The Public Decosystem site (17m ago)
- `20251005_1504_01k6tw38r2epc9mb8ny...` video (My Files, 17m ago)
- `$1 Million Dollars` (OneNote, 33m ago)

These were touched during this discovery session — flag for ingestion priority.

**Conclusion**: The original handoff memory said "no SharePoint sites returned" — that was wrong. The ContentSquare team site alone closes the `role:partner-ops` gap by 30+ artifacts.

---

## Source 3: Outlook mail

### Mail folder structure (24 folders)

| Folder | Total | Unread | Class | Notes |
|---|---|---|---|---|
| `Inbox` | 959 | 557 | mostly-personal-skip | Heavy newsletter overflow (Collateral, StartupStarter, Substack, AngelList, Instagram). Real human signal: Isaac Bentoumi (anyipbox.com) re: Dicoangelo/FriendlyFace IP, 2026-04-09/15 |
| `Sent Items` | 6,988 | 0 | mostly-personal-skip | ~95% are automated Microsoft Forms self-reminders ("Black Amethyst Daily — Please fill out X"). Real correspondence: Zack Goldfarb (Project Nightingale), Miranda Management (album cover), Microsoft support. **Partner-ops sent mail lives in Gmail, not here** |
| `Archive` | 2,083 | 1,767 | unclear | Long tail — needs sampling, likely mostly newsletter archive |
| `Black Amethyst Meetings` | 53 | 0 | **career-relevant-ingest** | **Founding-era network evidence**: Caleb Kozak (co-founder?), Joel Northrop (Demos Gym), Alec Alfonso (Very Big Things), Dapo Ogunfeitimi (Flourish Ventures), Egin Govender, Terence Fiteni, Gianfranco Prior, Idowu Sodiq, Adams Ongunsi, Masarrah |
| `Black Amethyst Daily` | 16 | 0 | personal-skip | Self-reminder Forms |
| `Client Meetings` | 18 | 0 | **career-relevant-ingest** | Likely founding-era client engagements; sample first |
| `AI` | 196 | 117 | unclear | Black Amethyst tenant + AI-era (could be early AI experimentation context) |
| `Crypto` | 248 | 66 | personal-skip | Newsletter aggregation |
| `AWS` | 9 | 0 | unclear | Sample first; may include cloud-alliance context |
| `GITHUB` | 25 | 0 | personal-skip | Notification noise |
| `VC` | 8 | 0 | unclear | Sample first |
| `VC MAIL` | 2 | 0 | unclear | Sample first |
| `Microsoft Paid Account Billings` | 62 | 2 | **sensitive-skip** | Billing history |
| `Paid Subscriptions` | 62 | 1 | **sensitive-skip** | Billing |
| `Tickets Purchased` | 3 | 0 | personal-skip | Receipts |
| `Important Newsletter` | 1 | 0 | personal-skip | Single item |
| `Twitter / Instagram` | 10 | 1 | personal-skip | Notification |
| `Drafts` | 13 | 0 | personal-skip | Drafts |
| `Junk Email` | 14 | 14 | personal-skip | Spam |
| `Deleted Items` | 73 | 18 | personal-skip | Trash |
| `Conversation History` | 0 | 0 | — | Empty |
| `RSS Feeds` | 0 | 0 | — | Empty |
| `Outbox` | 0 | 0 | — | Empty |
| `Sync Issues` | 0 | 0 | — | Empty |

### Outlook ingest plan
For `Black Amethyst Meetings` + `Client Meetings` + `AI` (combined ~267 items max), the ingest target is a **single consolidated artifact** with sender/subject/date thread map — NOT individual message bodies. Names and meeting topics close the named-person evidence gap (corpus had 5 named-person artifacts before).

---

## Source 4: Calendars

3 calendars on this account:
1. `Calendar` (default, owned by Dico, editable)
2. `United States holidays` (system, read-only)
3. `Birthdays` (system, read-only)

### Recent + upcoming events (top 25 by start date desc)

| Event | When | Where | Class |
|---|---|---|---|
| **Metaventions -01 Meeting Overview** | 2026-01-07 | Teams | **career-relevant-ingest** |
| **Technical Overview and Demo Metaventions** | 2026-01-07 | (online) | **career-relevant-ingest** |
| Bitcoin Whale Watching: Acquisition Vehicles, Leverage & ETF Flows | 2025-06-17 | Blockworks Zoom webinar | unclear |
| **Zack Dico Session 2** (Project Nightingale) | 2025-06-10 | Teams | **career-relevant-ingest** |
| **Meeting with Zack & Dico** (Project Nightingale) | 2025-05-09 | Teams | **career-relevant-ingest** |
| Miami Tech HH x Expand Northstar Roadshow | 2025-05-05 | Arlo Wynwood, Miami | **career-relevant-ingest** |
| My Yacht Club's Miami Superyacht Debut | 2025-05-03 | Miami | personal-skip |
| First Fridays at Crazy About You | 2025-05-02 | Brickell, Miami | personal-skip |
| Grand Prix Yacht Club Party | 2025-05-02 | Marine Stadium Marina, Miami | personal-skip |
| **International Research Conference on IOT, Cloud and Data Science (IRCICDS - 2025)** | 2025-05-02 | (online) | **career-relevant-ingest** |
| **Marketing Innovation Summit 2025** | 2025-05-01 | Aston Martin Residences, Miami | **career-relevant-ingest** |
| **Tech + Startups Community Conference @ Miami Dade College** | 2025-05-01 | Downtown Miami | **career-relevant-ingest** |
| Unleashing the Power of Women YACHT PARTY | 2025-04-30 | (Miami) | personal-skip |
| Miami Seller Conference | 2025-04-30 | Miami | unclear |
| The Chain Chapters: ICP HUB North America Alliance Miami Chapter (I) | 2025-01-24 | Sagamore Hotel, Miami Beach | **career-relevant-ingest** |
| **WAGMI MIAMI: The Largest Blockchain Event in America DAY 1** | 2025-01-23 | Miami | **career-relevant-ingest** |
| CoinFund Wagmi | 2025-01-22 | Lu.ma | **career-relevant-ingest** |
| WAGMI Kickoff Celebration | 2025-01-22 | Pier 5 Market, Miami | **career-relevant-ingest** |
| **Newport Beach Investor Conference** | 2024-10-17 | Renaissance Newport Beach | **career-relevant-ingest** |
| WAYNES BIRTHDAY | 2024-09-29 | Teams | personal-skip |
| **NYC SaaS Rooftop Tech + Startups Social** | 2024-07-17 | citizenM Bowery, NYC | **career-relevant-ingest** |
| Black Amethyst meeting (Masarrah) | 2024-06-27 | Teams | **career-relevant-ingest** (covered by mail) |
| **Competing in the GenAI era** | 2024-06-18 | Teams | **career-relevant-ingest** |

### Calendar ingest plan
Build a **speaking-events / conferences artifact** that consolidates the career-relevant entries above. This is verifiable activity evidence — extends the existing session-activity artifact (PR #23) into the public-events lane.

---

## Top ingest candidates — REWRITTEN 2026-05-03 (post-team-site discovery)

The ContentSquare team site changes the priority order. New ranking:

### Tier 1 — closes role:partner-ops gap (highest impact)

| # | Source | Item | Why |
|---|---|---|---|
| 1 | OneDrive root | `Resume Dico Angelo - Contentsquare Partner Operations Manager - Copy.docx` (2025-12) | Most recent partner-ops resume. `role:partner-ops` direct closure. `aud:recruiter`. |
| 2 | OneDrive root | `Resume Dico Angelo - Contentsquare Partner Operations Manager.docx` (2025-04) | Earlier version — track-record evidence. |
| 3 | ContentSquare site | `Action Plan SCA-AWS Management_ Product Technical Strategy.pdf` | AWS-SCA partner-ops technical strategy artifact. **One of the strongest partner-ops evidence pieces in the corpus.** |
| 4 | ContentSquare site | `CS + AWS SCA Business Plan 2024.pdf` | AWS-SCA business plan owned/contributed by Dico. Closes the `feedback_contentsquare_attribution.md` AWS-cloud-alliance evidence ask. |
| 5 | OneDrive root | `ContentSquare AWS Partner Plan 2025.pdf` | Forward-looking AWS partner plan. |
| 6 | ContentSquare site | `SCA Dico Angelo GTM Marketplace.docx` | GTM marketplace artifact authored by Dico. |
| 7 | OneDrive root | `CSQ_SCA_Engagement_Status_CY1Q2 20251001_v1.1.docx` | Quarterly partner-ops engagement status — **operational strategy evidence**. |
| 8 | ContentSquare site | `Partner Insights - Cloud GTM - Mike Marzano (1).pdf` | Cross-references Mike Marzano (now VP per memory). Use carefully — `feedback_org_chart_drift_resilience.md` warns against anchoring claims to ex-managers. Use as context, not as authority. |
| 9 | OneDrive root | `Contentsquare - crossbeam implementation in One CRM ... _files` (folder, 29 items, 3 MB) | OneCRM cloud-alliance integration evidence. Per `feedback_onecrm_attribution.md`, claim only cloud-alliance integration side. |
| 10 | OneDrive root | `Partner List Template.xlsx` (2023-10) | Operational partner-ops artifact. |
| 11 | ContentSquare site | `Quarterly_Overview__Objectives.pdf` | Quarterly objectives document. |
| 12 | ContentSquare site | `24-001897_Partner Innovation - Microsoft.pdf` | Microsoft partner innovation deliverable. |
| 13 | OneDrive root | `EXECUTIVE SUMMARY - AI in Partnerships.pdf` | Forward-looking partner-AI thesis (`type:strategy`). |
| 14 | OneDrive root | `ContentSquare Partner Programs and Op....docx` | Partner programs ops doc. |
| 15 | OneDrive root | `Partner Programs _ PartnerStack Motions.pdf` | PartnerStack motions playbook. |

### Tier 2 — closes founding/Black-Amethyst origin lane

| # | Source | Item | Why |
|---|---|---|---|
| 16 | OneDrive root | `The Meta-Manifestation of Black Amethyst Capital Key Holdings and the Metaventions Vision.docx` (2026-01-25) | Most recent founding-vision doc. Ties Black Amethyst → Metaventions. |
| 17 | OneDrive root | `Metaventions - Black Amethyst Capital Key Holdings Pitch Deck.pdf` (2025-05) | Pitch deck PDF (manageable size). `aud:investor`. |
| 18 | Black Amethyst Capital Key Holdings team site | `vision.docx` (2026-02-01) | Tenant root vision doc — drill before ingest. |
| 19 | OneDrive root | `Black Amethyst Capital Key Holdings.vsdx` (2022-10) | Founding architecture diagram. |
| 20 | OneDrive root | `Black Amethyst Flywheel.vsdx` (2023-02) | Strategy framework diagram. |
| 21 | OneDrive root | `Black Amethyst Effigy Circle x Strategic Partner Advisor.pdf` (2022-06) | Pre-Contentsquare strategic partner advisor framing. |
| 22 | OneDrive root | `Black Amethyst Foundation.pptx` (2022-05) | Original foundation deck (8 MB). |
| 23 | OneDrive root | `Mida - Pitch Deck 06.pdf` + `Black Amethyst x Mida (1).vsdx` | Mida partnership pitch + architecture. |
| 24 | Outlook | `Black Amethyst Meetings` folder (53 messages → 1 consolidated artifact, headers only) | Named-person evidence: Caleb Kozak, Joel Northrop, Alec Alfonso (Very Big Things), Dapo Ogunfeitimi (Flourish Ventures), Egin Govender, Terence Fiteni, Gianfranco Prior, Idowu Sodiq, Adams Ongunsi, Masarrah |
| 25 | Calendar | Speaking-events artifact (career-relevant entries 2024-2026) | WAGMI Miami, Newport Beach, ICP HUB Miami, Marketing Innovation Summit, Tech+Startups Conference, NYC SaaS Rooftop, Metaventions kickoff. Verifiable activity. |

### Tier 3 — supplemental

| # | Source | Item | Why |
|---|---|---|---|
| 26 | ContentSquare site | `cloud-center-of-excellence.pdf` | Cloud CoE artifact. |
| 27 | ContentSquare site | `AWS_MP_GTM_ProgramOverview.pdf` | AWS Marketplace GTM program overview. |
| 28 | ContentSquare site | `OnePagerAzure_ContentSquare_9-21-2024.pdf` | Azure partner one-pager. |
| 29 | ContentSquare site | `Partner Investment Program Guide.pdf` | Partner investment program guide. |
| 30 | OneDrive root | `UAT TESTING - PARTNERSTACK.pdf` | Partnership tooling UAT. |
| 31 | OneDrive root | `Dico Angelo 8Fig Customer Success.docx` (2023-02) | Pre-Contentsquare CS evidence — career-arc continuity. |
| 32 | OneDrive root | `Dico @ Work` folder (15 items, 143 MB, 2025-06) | Drill before ingest. |
| 33 | OneDrive root | `Strategic Thinking` folder (10 items, 98 MB, 2022-05) | Drill before ingest. |
| 34 | OneDrive root | `Personal Development Dico` folder (28 items, 39 MB, 2022-08) | Drill before ingest. |
| 35 | Outlook | `Client Meetings` folder (18 messages → 1 artifact, headers only) | Founding-era client engagements. |

### Stretch candidates (drill-required before decision)

- `Notebooks` (34 items, 392 MB) — OneNote format, content unknown
- `Microsoft Teams Chat Files` (69 items, 1.1 GB) — could contain partner-ops or mentor-call context
- `Work Transfer` (153 items, 2.8 GB, 2023-01) — Contentsquare onboarding window; sample before deciding
- `Upload Session 1` + `Upload session 2` (843 items combined, ~9.6 GB) — recent batch uploads, contents unknown

### Hard skips (do not ingest)

- All `MidJourney`, `1x`, `PowerPoint Exercise Files`, `ffmpeg-7.1`, `DockWrapper_v1.0.0`, `package`, `Apps`, `GTD`, `Whiteboards` (tooling/sandbox)
- `C` folder (9.6 GB single-child, likely OS dump)
- `Scotiabank Application`, `Scans`, `Finance and money`, `Microsoft Paid Account Billings`, `Paid Subscriptions`, `Dico Angelo - RMC Release Agreement` (PII / sensitive)
- All resume variants pre-2025 partner-ops version (superseded)
- `Inbox` newsletter aggregation (Collateral, StartupStarter, Substack, AngelList, Instagram, GitHub welcome)
- `Sent Items` self-reminder Microsoft Forms (95% of the 6,988 messages)

---

## Next-step decision points (for user)

1. **Approve ingest of items #1-20?** Each runs through `scripts/lib/three-layer.ts` → auto-summary + 5-dim labels + catalog entry.
2. **Drill into `Dico @ Work`, `Strategic Thinking`, `Personal Development Dico` folders?** (Top candidates with unknown leaf-level content.)
3. **Process the 99 MB pitch decks (Metaventions pptx, Dico Profile Card, Black Amethyst Show, Miami Pitchdeck, Metaventions Business one)?** They need conversion (pptx→text) before ingest. Use existing summary pipeline or ingest as binary-with-summary.
4. **Sample `Work Transfer` and `Microsoft Teams Chat Files` before deciding?** These are large (2.8 GB + 1.1 GB) and could close partner-ops gap further OR be archive noise.
5. **Outlook + Calendar consolidation strategy** — single combined artifact ("Black Amethyst Network and Speaking Events 2022-2026") OR two separate artifacts (mail + calendar)?
