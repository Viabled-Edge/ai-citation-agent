# Industry Trust Node Definitions

## Purpose
Define industry-specific trust nodes that drive AI citation visibility. Each vertical has different authoritative sources that LLMs prioritize when generating responses.

## Philosophy
Trust nodes should be **data-driven** based on what sources LLMs actually cite, not just assumed authoritative sources. This file provides industry defaults that can be refined based on actual audit data.

---

## Core Trust Nodes (All Industries)

These nodes are relevant across all verticals:

| Node | Category | Priority | Notes |
|------|----------|----------|-------|
| LinkedIn Company Page | Company Profile | High | Universal business presence |
| Crunchbase | Directory | High | Funding, team, business data |
| Google News (last 6 mo) | News/PR | High | Recent coverage indicator |
| Official Website | Company Source | High | Primary information source |
| Company Blog | Company Source | Medium | Thought leadership |

---

## SaaS/Technology

**Primary Trust Nodes (Highest Impact):**

| Node | Category | Priority | URL Pattern |
|------|----------|----------|-------------|
| G2 | Review Platform | Critical | g2.com/products/{brand} |
| Capterra | Review Platform | Critical | capterra.com/p/{id}/{brand} |
| TrustRadius | Review Platform | High | trustradius.com/products/{brand} |
| Product Hunt | Directory | High | producthunt.com/products/{brand} |
| TechCrunch | Seed Site | High | techcrunch.com |
| VentureBeat | Seed Site | Medium | venturebeat.com |

**Secondary Trust Nodes:**

| Node | Category | Priority | Notes |
|------|----------|----------|-------|
| Software Advice | Review Platform | Medium | Part of Gartner |
| GetApp | Review Platform | Medium | Part of Gartner |
| HackerNews | Community | Medium | Tech community signals |
| GitHub | Repository | Medium | Open source presence |
| Stack Overflow | Community | Medium | Developer mindshare |
| Built With | Directory | Low | Tech stack profiles |
| AngelList | Directory | Low | Startup ecosystem |

**Knowledge Graph Nodes:**

| Node | Priority | Difficulty | ROI |
|------|----------|------------|-----|
| Wikipedia | Low | Very High | Low (expensive, slow) |
| Wikidata | Low | High | Medium |
| Google Knowledge Panel | Medium | High | High (derived from others) |

---

## Marketing/Agency

**Primary Trust Nodes:**

| Node | Category | Priority | URL Pattern |
|------|----------|----------|-------------|
| Clutch | Review Platform | Critical | clutch.co/profile/{brand} |
| DesignRush | Directory | High | designrush.com/agency/{brand} |
| Agency Spotter | Directory | High | agencyspotter.com |
| AdAge | News | High | adage.com |
| MarketingWeek | News | High | marketingweek.com |

**Secondary Trust Nodes:**

| Node | Category | Priority | Notes |
|------|----------|----------|-------|
| The Drum | News | Medium | Marketing news |
| HubSpot Agency Directory | Directory | Medium | Partner listings |
| UpCity | Directory | Medium | Local agency finder |
| Sortlist | Directory | Medium | European focus |
| GoodFirms | Review Platform | Medium | B2B service reviews |

---

## E-commerce

**Primary Trust Nodes:**

| Node | Category | Priority | URL Pattern |
|------|----------|----------|-------------|
| Reddit (r/ecommerce, etc.) | Community | Critical | reddit.com/r/{subreddit} |
| TrustPilot | Review Platform | Critical | trustpilot.com/review/{brand} |
| Shopify App Store | Directory | High | apps.shopify.com |
| BigCommerce Apps | Directory | High | bigcommerce.com/apps |
| RetailDive | News | High | retaildive.com |

**Secondary Trust Nodes:**

| Node | Category | Priority | Notes |
|------|----------|----------|-------|
| eCommerceFuel | Community | Medium | Private community signals |
| Practical Ecommerce | News | Medium | Industry publication |
| Digital Commerce 360 | News | Medium | Research & analysis |
| Better Business Bureau | Trust | Medium | Consumer trust signal |
| Amazon Seller Forums | Community | Low | Marketplace presence |

---

## LegalTech

**Primary Trust Nodes:**

| Node | Category | Priority | URL Pattern |
|------|----------|----------|-------------|
| G2 (Legal Software) | Review Platform | Critical | g2.com/products/{brand} |
| Capterra (Legal) | Review Platform | Critical | capterra.com |
| Clio Cloud | Directory | High | clio.com/partnerships |
| LawTechToday | News | High | lawtechnologytoday.org |
| Above the Law | News | High | abovethelaw.com |

**Secondary Trust Nodes:**

| Node | Category | Priority | Notes |
|------|----------|----------|-------|
| LegalTech News | News | Medium | ALM publication |
| Law.com | News | Medium | Legal industry news |
| ABA Journal | News | Medium | Bar association publication |
| Lawyerist | Blog | Medium | Practice management focus |
| ILTA (Legal Tech Assoc) | Directory | Medium | Association membership |

---

## Healthcare/HealthTech

**Primary Trust Nodes:**

| Node | Category | Priority | URL Pattern |
|------|----------|----------|-------------|
| G2 (Healthcare) | Review Platform | Critical | g2.com/products/{brand} |
| KLAS Research | Review Platform | Critical | klasresearch.com |
| Healthcare IT News | News | High | healthcareitnews.com |
| Becker's Health IT | News | High | beckershospitalreview.com |
| HIPAA Journal | News | High | hipaajournal.com |

**Secondary Trust Nodes:**

| Node | Category | Priority | Notes |
|------|----------|----------|-------|
| Modern Healthcare | News | Medium | Industry news |
| HIMSS | Directory | Medium | Health IT association |
| CHIME | Directory | Medium | CIO community |
| EHR Intelligence | News | Medium | EHR-focused coverage |
| MedCity News | News | Medium | Healthcare innovation |

---

## Manufacturing

**Primary Trust Nodes:**

| Node | Category | Priority | URL Pattern |
|------|----------|----------|-------------|
| ThomasNet | Directory | Critical | thomasnet.com |
| IndustryWeek | News | High | industryweek.com |
| Manufacturing.net | News | High | manufacturing.net |
| G2 (Manufacturing) | Review Platform | High | g2.com/products/{brand} |
| Gartner (Manufacturing) | Research | High | gartner.com |

**Secondary Trust Nodes:**

| Node | Category | Priority | Notes |
|------|----------|----------|-------|
| Plant Engineering | News | Medium | Facility focus |
| Automation World | News | Medium | Automation coverage |
| Modern Machine Shop | News | Medium | Machining focus |
| Assembly Magazine | News | Medium | Production processes |
| MES Association | Directory | Medium | MES solutions |

---

## Financial Services/FinTech

**Primary Trust Nodes:**

| Node | Category | Priority | URL Pattern |
|------|----------|----------|-------------|
| G2 (Financial Services) | Review Platform | Critical | g2.com/products/{brand} |
| Finovate | News/Events | High | finovate.com |
| American Banker | News | High | americanbanker.com |
| TechCrunch (Fintech) | News | High | techcrunch.com |
| The Financial Brand | News | High | thefinancialbrand.com |

**Secondary Trust Nodes:**

| Node | Category | Priority | Notes |
|------|----------|----------|-------|
| Banking Dive | News | Medium | Banking industry |
| PaymentsSource | News | Medium | Payments focus |
| Finextra | News | Medium | European fintech |
| Business Insider (Finance) | News | Medium | Mainstream coverage |
| Crunchbase (Fintech) | Directory | Medium | Funding/deals |

---

## How to Use This File

### For Source Discovery Agent:

1. **Detect industry** from brand/category context provided by orchestrator
2. **Select trust nodes** based on industry section above
3. **Prioritize** Critical > High > Medium > Low
4. **Check presence** for each relevant node
5. **Report coverage** as percentage of industry-specific nodes

### For Recommendation Generation:

1. **Identify gaps** in Critical and High priority nodes
2. **Recommend** achievable actions (avoid Wikipedia unless explicitly requested)
3. **Provide outreach targets** for community/news nodes
4. **Suggest content** that targets industry-specific publications

### Coverage Scoring by Industry:

| Industry | Critical Nodes | Target Coverage |
|----------|---------------|-----------------|
| SaaS/Tech | G2, Capterra, Product Hunt | 80%+ |
| Marketing/Agency | Clutch, DesignRush | 70%+ |
| E-commerce | Reddit, TrustPilot | 75%+ |
| LegalTech | G2, Capterra, Clio | 70%+ |
| Healthcare | G2, KLAS, HIPAA Journal | 70%+ |
| Manufacturing | ThomasNet, IndustryWeek | 65%+ |
| FinTech | G2, Finovate | 70%+ |

---

## Data-Driven Refinement

This file should be updated based on actual audit findings:

1. **When a source is frequently cited** by LLMs but not listed → Add to appropriate industry
2. **When a listed source is rarely cited** → Consider lowering priority
3. **When industry-specific patterns emerge** → Create new section or refine existing

Track citations across audits to validate which trust nodes actually drive AI visibility.

---

*Last updated: 2025-12-12*
