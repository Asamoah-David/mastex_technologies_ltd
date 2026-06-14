/**
 * Curated fallback content used when the database is unreachable (e.g. before
 * `pnpm db:push`). Mirrors the seed so the public site renders identically.
 * These are plain objects shaped to what the UI reads — not full Prisma models.
 */
export const fallback = {
  products: [
    {
      id: "f0", slug: "workop", name: "WorkOp", featured: true, order: 0,
      tagline: "Operations and project workspace for teams.",
      description: "Plan projects, assign work, track time and keep every team aligned in one workspace.",
      longDescription:
        "WorkOp is Mastex's operations and project workspace. It brings projects, tasks, timelines, time tracking and team collaboration together so organisations can plan work, see progress in real time, and deliver on schedule.",
      status: "LIVE", logoUrl: null, coverUrl: null, demoUrl: "https://workop.mastex.tech", repoUrl: null, docsUrl: null,
      category: { name: "SaaS Platforms", slug: "saas-platforms" },
      industries: [{ name: "Enterprise", slug: "enterprise" }, { name: "Logistics", slug: "logistics" }],
      pricing: [
        { tier: "Team", price: 300, period: "mo", features: ["Up to 10 members", "Projects & tasks", "Time tracking"] },
        { tier: "Business", price: 800, period: "mo", features: ["Everything in Team", "Unlimited members", "Workload & reports", "Integrations"] },
      ],
      features: [
        { id: "a", title: "Projects & tasks", description: "Plan work with boards, lists and timelines.", icon: "KanbanSquare", isBenefit: false },
        { id: "b", title: "Time tracking", description: "Log time against tasks and see where it goes.", icon: "Timer", isBenefit: false },
        { id: "c", title: "Team workload", description: "Balance capacity across people and teams.", icon: "Users", isBenefit: false },
        { id: "d", title: "Real-time progress", description: "Dashboards that show where projects stand.", icon: "Activity", isBenefit: false },
      ],
      media: [], changelog: [],
    },
    {
      id: "f1", slug: "mastex-bms", name: "Mastex BMS", featured: true, order: 1,
      tagline: "The operating system for growing businesses.",
      description: "All-in-one business management — POS, invoicing, inventory, payments and powerful insights.",
      longDescription:
        "Mastex BMS is a complete, multi-tenant business management platform unifying POS, invoicing, inventory, purchasing, customer management, payments and powerful reporting into a single product.",
      status: "LIVE", logoUrl: null, coverUrl: null, demoUrl: "https://bms.mastex.tech", repoUrl: null, docsUrl: null,
      category: { name: "SaaS Platforms", slug: "saas-platforms" },
      industries: [{ name: "Retail", slug: "retail" }, { name: "Enterprise", slug: "enterprise" }, { name: "Finance", slug: "finance" }],
      pricing: [
        { tier: "Starter", price: 500, period: "mo", features: ["POS", "Invoicing", "1 branch", "Email support"] },
        { tier: "Growth", price: 1000, period: "mo", features: ["Everything in Starter", "Inventory", "3 branches", "Smart reports"] },
        { tier: "Scale", price: 1500, period: "mo", features: ["Everything in Growth", "Unlimited branches", "Priority support", "API access"] },
      ],
      features: [
        { id: "a", title: "Point of Sale", description: "Fast, offline-capable retail checkout.", icon: "ScanLine", isBenefit: false },
        { id: "b", title: "Smart Invoicing", description: "Branded invoices with payment links.", icon: "ReceiptText", isBenefit: false },
        { id: "c", title: "Inventory Control", description: "Real-time stock across every branch.", icon: "Boxes", isBenefit: false },
        { id: "d", title: "Business Insights", description: "Clear analysis of your sales and trends.", icon: "BarChart3", isBenefit: false },
      ],
      media: [], changelog: [],
    },
    {
      id: "f2", slug: "mastex-schoolos", name: "Mastex SchoolOS", featured: true, order: 2,
      tagline: "Run the whole school from one place.",
      description: "School management for admissions, academics, fees, and parent communication.",
      longDescription:
        "Mastex SchoolOS digitises the entire school operation: student records, classes, attendance, grading, fee collection and parent communication, with role-based portals.",
      status: "LIVE", logoUrl: null, coverUrl: null, demoUrl: null, repoUrl: null, docsUrl: null,
      category: { name: "Enterprise Systems", slug: "enterprise-systems" },
      industries: [{ name: "Education", slug: "education" }, { name: "Government", slug: "government" }],
      pricing: [{ tier: "Per student", price: 5, period: "term", features: ["All modules", "Parent portal", "SMS alerts"] }],
      features: [
        { id: "a", title: "Student Information", description: "One source of truth for every learner.", icon: "Users", isBenefit: false },
        { id: "b", title: "Fees & Billing", description: "Collect and reconcile fees online.", icon: "Wallet", isBenefit: false },
        { id: "c", title: "Gradebook", description: "Continuous assessment and reports.", icon: "BookOpen", isBenefit: false },
        { id: "d", title: "Parent Portal", description: "Keep families informed in real time.", icon: "MessagesSquare", isBenefit: false },
      ],
      media: [], changelog: [],
    },
    {
      id: "f3", slug: "deepboard", name: "DeepBoard", featured: true, order: 3,
      tagline: "Decision intelligence for leadership teams.",
      description: "Turn scattered data into board-ready decisions with advanced analysis and dashboards.",
      longDescription:
        "DeepBoard is a decision-intelligence workspace. It connects to operational data, runs advanced analysis, and produces clear, board-ready dashboards and recommendations.",
      status: "BETA", logoUrl: null, coverUrl: null, demoUrl: null, repoUrl: null, docsUrl: null,
      category: { name: "Data & Analytics", slug: "data-analytics" },
      industries: [{ name: "Finance", slug: "finance" }, { name: "Enterprise", slug: "enterprise" }],
      pricing: null,
      features: [
        { id: "a", title: "Unified Metrics", description: "All your KPIs in one canvas.", icon: "LayoutDashboard", isBenefit: false },
        { id: "b", title: "Plain-English Reports", description: "Plain-English explanations of the numbers.", icon: "ScrollText", isBenefit: false },
        { id: "c", title: "Scenario Modelling", description: "Test decisions before you make them.", icon: "GitBranch", isBenefit: false },
      ],
      media: [], changelog: [],
    },
    {
      id: "f4", slug: "mastex-pay", name: "Mastex Pay", featured: false, order: 4,
      tagline: "Payments infrastructure for African businesses.",
      description: "Collect, disburse and reconcile payments with a single API.",
      longDescription: "Mastex Pay wraps local rails (mobile money, cards, bank transfer) behind one clean API with reconciliation, payouts and webhooks built in.",
      status: "IN_DEVELOPMENT", logoUrl: null, coverUrl: null, demoUrl: null, repoUrl: null, docsUrl: null,
      category: { name: "Developer Tools", slug: "developer-tools" },
      industries: [{ name: "Finance", slug: "finance" }, { name: "Retail", slug: "retail" }],
      pricing: null,
      features: [
        { id: "a", title: "One API", description: "Mobile money, cards and transfers unified.", icon: "Plug", isBenefit: false },
        { id: "b", title: "Instant payouts", description: "Disburse to vendors and staff.", icon: "Send", isBenefit: false },
      ],
      media: [], changelog: [],
    },
  ] as any[],

  categories: [
    { id: "c1", name: "SaaS Platforms", slug: "saas-platforms" },
    { id: "c2", name: "Data & Analytics", slug: "data-analytics" },
    { id: "c3", name: "Enterprise Systems", slug: "enterprise-systems" },
    { id: "c4", name: "Developer Tools", slug: "developer-tools" },
  ] as any[],

  industries: [
    { id: "i1", name: "Education", slug: "education", icon: "GraduationCap", description: "Schools, universities and EdTech." },
    { id: "i2", name: "Healthcare", slug: "healthcare", icon: "HeartPulse", description: "Clinics, hospitals and health systems." },
    { id: "i3", name: "Finance", slug: "finance", icon: "Landmark", description: "Banks, fintech and payments." },
    { id: "i4", name: "Government", slug: "government", icon: "Building2", description: "Public sector and civic tech." },
    { id: "i5", name: "Retail", slug: "retail", icon: "ShoppingBag", description: "Commerce, POS and inventory." },
    { id: "i6", name: "Logistics", slug: "logistics", icon: "Truck", description: "Supply chain and fleet." },
    { id: "i7", name: "Enterprise", slug: "enterprise", icon: "Network", description: "Large multi-department organisations." },
  ] as any[],

  solutions: [
    { id: "s1", title: "Digitise your school", slug: "digitise-your-school", summary: "End-to-end school operations in the cloud.", icon: "GraduationCap", industry: { name: "Education", slug: "education" }, body: "## Run the whole school from one place\n\nMastex SchoolOS brings admissions, student records, attendance, grading and fee collection into a single system — with dedicated portals for administrators, teachers, students and parents.\n\n### What you get\n- Online and offline fee collection with automatic reconciliation\n- Continuous assessment, report cards and transcripts\n- Real-time parent communication via SMS and the parent portal\n- Role-based access so every staff member sees exactly what they need" },
    { id: "s2", title: "Modernise retail", slug: "modernise-retail", summary: "POS, inventory and payments that just work.", icon: "ShoppingBag", industry: { name: "Retail", slug: "retail" }, body: "## Sell more, with less friction\n\nMastex BMS gives retailers a fast, offline-capable point of sale, live inventory across every branch, and payments that accept mobile money, cards and bank transfer out of the box.\n\n### Built for how shops really operate\n- Offline-first checkout that syncs the moment you reconnect\n- Real-time stock and automatic low-stock alerts\n- Branded invoices with instant payment links" },
    { id: "s3", title: "Smarter finance ops", slug: "smarter-finance-ops", summary: "Reconcile, report and decide with confidence.", icon: "Landmark", industry: { name: "Finance", slug: "finance" }, body: "## From scattered data to confident decisions\n\nWe unify your operational and financial data, reconcile it automatically, and present it as clear, board-ready dashboards so leaders can act with confidence.\n\n### Outcomes\n- Automated reconciliation that closes the books faster\n- Plain-English reporting your whole team understands\n- Scenario views to test decisions before you make them" },
    { id: "s4", title: "Government service delivery", slug: "government-service-delivery", summary: "Citizen-facing systems built to scale.", icon: "Building2", industry: { name: "Government", slug: "government" }, body: "## Public services that scale\n\nMastex builds secure, citizen-facing systems engineered to handle national-scale demand — with the reliability, auditability and access controls the public sector requires.\n\n### Why public institutions choose Mastex\n- Architected to serve millions without a redesign\n- Full audit logging and role-based access control\n- Built and supported locally, in-country" },
  ] as any[],

  posts: [
    {
      id: "p1", title: "Building software that scales across a continent", slug: "building-software-that-scales",
      excerpt: "How we architect Mastex products for millions of users from day one.",
      content: "## Scale from the start\n\nAt Mastex we design every product to scale horizontally. We lean on multi-tenant Postgres, edge caching and a modular service architecture so a single product can grow from one customer to millions without a rewrite.",
      coverUrl: null, readingMinutes: 4, publishedAt: new Date("2026-05-01"),
      author: { name: "Mastex Team" }, category: { name: "Engineering", slug: "engineering" },
    },
    {
      id: "p2", title: "Why we build for African businesses first", slug: "why-we-build-for-african-businesses",
      excerpt: "Local rails, offline-first design, and pricing that makes sense.",
      content: "## Local-first\n\nGreat software meets people where they are. That means offline-capable POS, mobile-money payments, and pricing in local currency.",
      coverUrl: null, readingMinutes: 3, publishedAt: new Date("2026-04-12"),
      author: { name: "David Asamoah" }, category: { name: "Company", slug: "company" },
    },
  ] as any[],

  docCategories: [
    {
      id: "d1", name: "Getting Started", slug: "getting-started", icon: "Rocket", order: 0,
      articles: [
        { id: "da1", title: "Introduction", slug: "introduction", order: 0, content: "# Welcome to Mastex\n\nThis portal documents every product in the Mastex platform. Pick a product on the left to begin.", category: { name: "Getting Started", slug: "getting-started" } },
        { id: "da2", title: "Quickstart", slug: "quickstart", order: 1, content: "# Quickstart\n\n1. Create an account\n2. Choose a plan\n3. Invite your team\n4. Start working", category: { name: "Getting Started", slug: "getting-started" } },
      ],
    },
  ] as any[],

  jobs: [
    {
      id: "j1", title: "Senior Full-Stack Engineer", slug: "senior-fullstack-engineer",
      department: "Engineering", location: "Accra, Ghana / Remote", type: "FULL_TIME",
      description: "Build and scale the products that power thousands of businesses.",
      requirements: "5+ years with TypeScript, React/Next.js and Node. Strong product sense.",
    },
  ] as any[],

  settings: {
    "company.details": {
      legalName: "Mastex Technologies Ltd", shortName: "Mastex",
      tagline: "We build the software that runs modern businesses.",
      email: "hello@mastex.tech", phone: "+233 00 000 0000", address: "Accra, Ghana",
    },
    "home.hero": {
      eyebrow: "Mastex Technologies Ltd",
      headline: "Software that runs modern businesses.",
      subhead: "We design, build and operate enterprise products, SaaS platforms and digital solutions — engineered to scale from one customer to millions.",
      primaryCta: { label: "Explore products", href: "/products" },
      secondaryCta: { label: "Talk to us", href: "/contact" },
    },
    "home.stats": [
      { label: "Products shipped", value: "4+" },
      { label: "Businesses served", value: "120+" },
      { label: "Uptime", value: "99.9%" },
      { label: "Countries", value: "3" },
    ],
    "home.testimonials": [
      { quote: "Mastex BMS replaced four separate tools. Our shops finally run on one system.", author: "Ama Mensah", role: "Owner, Mensah Retail" },
      { quote: "SchoolOS cut our fee-collection admin in half and parents love the portal.", author: "Mr. Boateng", role: "Head, Unity Academy" },
      { quote: "DeepBoard gives our board the clarity we used to spend weeks assembling.", author: "K. Owusu", role: "CFO, Adinkra Group" },
    ],
    "home.trustedBy": ["Mensah Retail", "Unity Academy", "Adinkra Group", "Accra Foods", "Volta Logistics", "Kumasi Clinic"],
    "home.faq": [
      { question: "How quickly can we get started?", answer: "Most teams are up and running within a day. We provide onboarding, data import and training so you see value immediately." },
      { question: "Do your products work offline?", answer: "Yes. Our point-of-sale and field tools are offline-first and sync automatically once a connection returns — built for real conditions on the ground." },
      { question: "Which payment methods do you support?", answer: "Mobile money, cards and bank transfers are supported across our products through local payment rails, with reconciliation built in." },
      { question: "Is my data secure?", answer: "We apply role-based access control, audit logging, encryption in transit and strict security headers. Your data is never sold and you can export or delete it at any time." },
      { question: "Can Mastex build something custom for us?", answer: "Absolutely. Alongside our products we take on bespoke builds and integrations for organisations with specific needs — talk to our team." },
      { question: "Do you offer support and training?", answer: "Every plan includes support, and higher tiers add priority response, a dedicated success manager and onboarding sessions for your team." },
    ],
    "about.founder": {
      name: "David Asamoah", role: "Founder & CEO",
      quote: "Africa deserves world-class software built by people who understand it. That's what we get up to build every day.",
      vision: "To be the default technology partner for ambitious organisations across the continent.",
    },
    "about.leadership": [
      { name: "David Asamoah", role: "Founder & CEO", bio: "Sets the company vision and leads product strategy across the Mastex suite." },
      { name: "Akosua Mensah", role: "Chief Technology Officer", bio: "Owns engineering, security and the scalable foundation every product is built on." },
      { name: "Kwabena Osei", role: "Chief Operating Officer", bio: "Runs delivery, support and the day-to-day operations that keep customers successful." },
      { name: "Ama Boateng", role: "Head of Product", bio: "Translates customer needs into the roadmap and keeps every release sharp." },
    ],
  } as Record<string, any>,
};
