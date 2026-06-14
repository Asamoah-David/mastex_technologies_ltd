/**
 * Mastex Technologies Ltd — database seed.
 * Run with: pnpm db:seed  (after `pnpm db:push`)
 */
import { PrismaClient, Role, ProductStatus, ContentStatus, LeadType, LeadStatus, JobType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding Mastex Technologies Ltd…");

  // ── Super admin ──────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: process.env.SEED_SUPERADMIN_EMAIL ?? "admin@mastex.tech" },
    update: {},
    create: {
      email: process.env.SEED_SUPERADMIN_EMAIL ?? "admin@mastex.tech",
      name: "Mastex Super Admin",
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  // ── Permissions ──────────────────────────────────────────────────────────
  const permissionKeys = [
    "products:read", "products:write",
    "blog:read", "blog:write",
    "docs:read", "docs:write",
    "media:read", "media:write",
    "leads:read", "leads:write",
    "settings:read", "settings:write",
    "users:read", "users:write",
    "analytics:read",
  ];
  for (const key of permissionKeys) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key.replace(":", " — ") },
    });
  }

  // ── Categories ───────────────────────────────────────────────────────────
  const categories = await Promise.all(
    [
      { name: "SaaS Platforms", slug: "saas-platforms", description: "Multi-tenant cloud software." },
      { name: "Data & Analytics", slug: "data-analytics", description: "Decision intelligence and analytics." },
      { name: "Enterprise Systems", slug: "enterprise-systems", description: "Mission-critical line-of-business systems." },
      { name: "Developer Tools", slug: "developer-tools", description: "Tooling that ships products faster." },
    ].map((c) => prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })),
  );

  // ── Industries ───────────────────────────────────────────────────────────
  const industryData = [
    { name: "Education", slug: "education", icon: "GraduationCap", description: "Schools, universities and EdTech." },
    { name: "Healthcare", slug: "healthcare", icon: "HeartPulse", description: "Clinics, hospitals and health systems." },
    { name: "Finance", slug: "finance", icon: "Landmark", description: "Banks, fintech and payments." },
    { name: "Government", slug: "government", icon: "Building2", description: "Public sector and civic tech." },
    { name: "Retail", slug: "retail", icon: "ShoppingBag", description: "Commerce, POS and inventory." },
    { name: "Logistics", slug: "logistics", icon: "Truck", description: "Supply chain and fleet." },
    { name: "Enterprise", slug: "enterprise", icon: "Network", description: "Large multi-department organisations." },
  ];
  const industries = await Promise.all(
    industryData.map((i) => prisma.industry.upsert({ where: { slug: i.slug }, update: {}, create: i })),
  );
  const ind = (slug: string) => industries.find((i) => i.slug === slug)!;

  // ── Products ─────────────────────────────────────────────────────────────
  const products = [
    {
      name: "WorkOp",
      slug: "workop",
      tagline: "Operations and project workspace for teams.",
      description: "Plan projects, assign work, track time and keep every team aligned in one workspace.",
      longDescription:
        "WorkOp is Mastex's operations and project workspace. It brings projects, tasks, timelines, time tracking and team collaboration together so organisations can plan work, see progress in real time, and deliver on schedule — across departments and locations.",
      status: ProductStatus.LIVE,
      featured: true,
      order: 0,
      categorySlug: "saas-platforms",
      industrySlugs: ["enterprise", "logistics"],
      demoUrl: "https://workop.mastex.tech",
      pricing: [
        { tier: "Team", price: 300, period: "mo", features: ["Up to 10 members", "Projects & tasks", "Time tracking"] },
        { tier: "Business", price: 800, period: "mo", features: ["Everything in Team", "Unlimited members", "Workload & reports", "Integrations"] },
      ],
      features: [
        { title: "Projects & tasks", description: "Plan work with boards, lists and timelines.", icon: "KanbanSquare" },
        { title: "Time tracking", description: "Log time against tasks and see where it goes.", icon: "Timer" },
        { title: "Team workload", description: "Balance capacity across people and teams.", icon: "Users" },
        { title: "Real-time progress", description: "Dashboards that show exactly where projects stand.", icon: "Activity" },
        { title: "Deliver on time", description: "Keep every team aligned and on schedule.", icon: "CalendarCheck", isBenefit: true },
        { title: "One source of truth", description: "Stop chasing updates across tools.", icon: "FolderKanban", isBenefit: true },
      ],
    },
    {
      name: "Mastex BMS",
      slug: "mastex-bms",
      tagline: "The operating system for growing businesses.",
      description: "All-in-one business management — POS, invoicing, inventory, payments and powerful insights.",
      longDescription:
        "Mastex BMS is a complete, multi-tenant business management platform. It unifies point-of-sale, invoicing, inventory, purchasing, customer management, payments and powerful reporting into a single subscription product built for African SMEs and beyond.",
      status: ProductStatus.LIVE,
      featured: true,
      order: 1,
      categorySlug: "saas-platforms",
      industrySlugs: ["retail", "enterprise", "finance"],
      demoUrl: "https://bms.mastex.tech",
      pricing: [
        { tier: "Starter", price: 500, period: "mo", features: ["POS", "Invoicing", "1 branch", "Email support"] },
        { tier: "Growth", price: 1000, period: "mo", features: ["Everything in Starter", "Inventory", "3 branches", "Smart reports"] },
        { tier: "Scale", price: 1500, period: "mo", features: ["Everything in Growth", "Unlimited branches", "Priority support", "API access"] },
      ],
      features: [
        { title: "Point of Sale", description: "Fast, offline-capable retail checkout.", icon: "ScanLine" },
        { title: "Smart Invoicing", description: "Branded invoices with Paystack payment links.", icon: "ReceiptText" },
        { title: "Inventory Control", description: "Real-time stock across every branch.", icon: "Boxes" },
        { title: "Business Insights", description: "Automated analysis of sales and trends.", icon: "BarChart3" },
        { title: "Save hours weekly", description: "Automate the admin that slows teams down.", icon: "Clock", isBenefit: true },
        { title: "Grow revenue", description: "Understand customers and act on data.", icon: "TrendingUp", isBenefit: true },
      ],
    },
    {
      name: "Mastex SchoolOS",
      slug: "mastex-schoolos",
      tagline: "Run the whole school from one place.",
      description: "A school management system for admissions, academics, fees, and parent communication.",
      longDescription:
        "Mastex SchoolOS digitises the entire school operation: student records, classes, attendance, grading, fee collection and parent communication — with role-based portals for administrators, teachers, students and parents.",
      status: ProductStatus.LIVE,
      featured: true,
      order: 2,
      categorySlug: "enterprise-systems",
      industrySlugs: ["education", "government"],
      pricing: [
        { tier: "Per student", price: 5, period: "term", features: ["All modules", "Parent portal", "SMS alerts"] },
      ],
      features: [
        { title: "Student Information", description: "One source of truth for every learner.", icon: "Users" },
        { title: "Fees & Billing", description: "Collect and reconcile fees online.", icon: "Wallet" },
        { title: "Gradebook", description: "Continuous assessment and reports.", icon: "BookOpen" },
        { title: "Parent Portal", description: "Keep families informed in real time.", icon: "MessagesSquare" },
      ],
    },
    {
      name: "DeepBoard",
      slug: "deepboard",
      tagline: "Decision intelligence for leadership teams.",
      description: "Turn scattered data into board-ready decisions with advanced analysis and visual dashboards.",
      longDescription:
        "DeepBoard is a decision-intelligence workspace. It connects to your operational data, runs advanced analysis, and produces clear, board-ready dashboards and recommendations so leaders can decide with confidence.",
      status: ProductStatus.BETA,
      featured: true,
      order: 3,
      categorySlug: "data-analytics",
      industrySlugs: ["finance", "enterprise"],
      features: [
        { title: "Unified Metrics", description: "All your KPIs in one canvas.", icon: "LayoutDashboard" },
        { title: "Plain-English Reports", description: "Plain-English explanations of the numbers.", icon: "ScrollText" },
        { title: "Scenario Modelling", description: "Test decisions before you make them.", icon: "GitBranch" },
      ],
    },
    {
      name: "Mastex Pay",
      slug: "mastex-pay",
      tagline: "Payments infrastructure for African businesses.",
      description: "Collect, disburse and reconcile payments with a single API.",
      longDescription:
        "Mastex Pay is a payments layer that wraps local rails (mobile money, cards, bank transfer) behind one clean API — with reconciliation, payouts and webhooks built in.",
      status: ProductStatus.IN_DEVELOPMENT,
      featured: false,
      order: 4,
      categorySlug: "developer-tools",
      industrySlugs: ["finance", "retail"],
      features: [
        { title: "One API", description: "Mobile money, cards and transfers unified.", icon: "Plug" },
        { title: "Instant payouts", description: "Disburse to vendors and staff.", icon: "Send" },
      ],
    },
  ];

  for (const p of products) {
    const { categorySlug, industrySlugs, features, pricing, ...rest } = p;
    const category = categories.find((c) => c.slug === categorySlug);
    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        pricing: pricing as any,
        categoryId: category?.id,
        seoTitle: `${p.name} — Mastex Technologies Ltd`,
        seoDescription: p.description,
        industries: { connect: industrySlugs.map((s) => ({ id: ind(s).id })) },
        features: {
          create: features.map((f, i) => ({
            title: f.title,
            description: f.description,
            icon: f.icon,
            isBenefit: (f as any).isBenefit ?? false,
            order: i,
          })),
        },
      },
    });
    console.log(`  ✔ product ${created.name}`);
  }

  // ── Changelog ────────────────────────────────────────────────────────────
  const bms = await prisma.product.findUnique({ where: { slug: "mastex-bms" } });
  if (bms) {
    const changelog = [
      { version: "2.4", title: "Smart sales summaries", body: "Automated weekly summaries of your sales, top products and slow movers.", releasedAt: new Date("2026-05-20") },
      { version: "2.3", title: "Multi-branch inventory", body: "Track and transfer stock across unlimited branches in real time.", releasedAt: new Date("2026-04-02") },
      { version: "2.2", title: "Paystack payment links", body: "Generate branded invoice payment links your customers can pay instantly.", releasedAt: new Date("2026-02-15") },
    ];
    for (const c of changelog) {
      const exists = await prisma.changelogEntry.findFirst({
        where: { productId: bms.id, version: c.version },
      });
      if (!exists) {
        await prisma.changelogEntry.create({ data: { ...c, productId: bms.id } });
      }
    }
  }

  // ── Product media (gallery) ──────────────────────────────────────────────
  if (bms) {
    const media = [
      { url: "/images/retail.jpg", caption: "Fast retail checkout at the point of sale" },
      { url: "/images/payments.jpg", caption: "Seamless in-store card and mobile payments" },
      { url: "/images/hero-data.jpg", caption: "Live sales and performance dashboards" },
    ];
    const count = await prisma.productMedia.count({ where: { productId: bms.id } });
    if (count === 0) {
      for (let i = 0; i < media.length; i++) {
        await prisma.productMedia.create({
          data: { productId: bms.id, type: "IMAGE", url: media[i].url, caption: media[i].caption, order: i },
        });
      }
    }
  }

  // ── Solutions ────────────────────────────────────────────────────────────
  const solutions = [
    {
      title: "Digitise your school", slug: "digitise-your-school", summary: "End-to-end school operations in the cloud.", icon: "GraduationCap", industrySlug: "education",
      body: "## Run the whole school from one place\n\nMastex SchoolOS brings admissions, student records, attendance, grading and fee collection into a single system — with dedicated portals for administrators, teachers, students and parents.\n\n### What you get\n- Online and offline fee collection with automatic reconciliation\n- Continuous assessment, report cards and transcripts\n- Real-time parent communication via SMS and the parent portal\n- Role-based access so every staff member sees exactly what they need\n\nSchools using Mastex cut administrative workload dramatically and give families a modern, transparent experience.",
    },
    {
      title: "Modernise retail", slug: "modernise-retail", summary: "POS, inventory and payments that just work.", icon: "ShoppingBag", industrySlug: "retail",
      body: "## Sell more, with less friction\n\nMastex BMS gives retailers a fast, offline-capable point of sale, live inventory across every branch, and payments that accept mobile money, cards and bank transfer out of the box.\n\n### Built for how shops really operate\n- Offline-first checkout that syncs the moment you reconnect\n- Real-time stock and automatic low-stock alerts\n- Branded invoices with instant payment links\n- Clear daily, weekly and monthly performance reporting",
    },
    {
      title: "Smarter finance ops", slug: "smarter-finance-ops", summary: "Reconcile, report and decide with confidence.", icon: "Landmark", industrySlug: "finance",
      body: "## From scattered data to confident decisions\n\nWe unify your operational and financial data, reconcile it automatically, and present it as clear, board-ready dashboards so leaders can act with confidence.\n\n### Outcomes\n- Automated reconciliation that closes the books faster\n- Plain-English reporting your whole team understands\n- Scenario views to test decisions before you make them",
    },
    {
      title: "Government service delivery", slug: "government-service-delivery", summary: "Citizen-facing systems built to scale.", icon: "Building2", industrySlug: "government",
      body: "## Public services that scale\n\nMastex builds secure, citizen-facing systems engineered to handle national-scale demand — with the reliability, auditability and access controls the public sector requires.\n\n### Why public institutions choose Mastex\n- Architected to serve millions without a redesign\n- Full audit logging and role-based access control\n- Built and supported locally, in-country",
    },
  ];
  for (const s of solutions) {
    const { industrySlug, ...rest } = s;
    await prisma.solution.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...rest, industryId: ind(industrySlug).id, status: ContentStatus.PUBLISHED },
    });
  }

  // ── Blog ─────────────────────────────────────────────────────────────────
  const blogCat = await prisma.blogCategory.upsert({
    where: { slug: "engineering" },
    update: {},
    create: { name: "Engineering", slug: "engineering" },
  });
  const companyCat = await prisma.blogCategory.upsert({
    where: { slug: "company" },
    update: {},
    create: { name: "Company", slug: "company" },
  });
  const posts = [
    {
      title: "Building software that scales across a continent",
      slug: "building-software-that-scales",
      excerpt: "How we architect Mastex products for millions of users from day one.",
      content: "## Scale from the start\n\nAt Mastex we design every product to scale horizontally...\n\nWe lean on multi-tenant Postgres, edge caching and a modular service architecture so a single product can grow from one customer to millions without a rewrite.",
      categoryId: blogCat.id,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: "Why we build for African businesses first",
      slug: "why-we-build-for-african-businesses",
      excerpt: "Local rails, offline-first design, and pricing that makes sense.",
      content: "## Local-first\n\nGreat software meets people where they are. That means offline-capable POS, mobile-money payments, and pricing in local currency.",
      categoryId: companyCat.id,
      status: ContentStatus.PUBLISHED,
    },
  ];
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: admin.id,
        publishedAt: new Date(),
        readingMinutes: 4,
        seoTitle: post.title,
        seoDescription: post.excerpt,
      },
    });
  }

  // ── Documentation ────────────────────────────────────────────────────────
  const docCat = await prisma.docCategory.upsert({
    where: { slug: "getting-started" },
    update: {},
    create: { name: "Getting Started", slug: "getting-started", icon: "Rocket", order: 0 },
  });
  await prisma.docArticle.upsert({
    where: { slug: "introduction" },
    update: {},
    create: {
      title: "Introduction",
      slug: "introduction",
      content: "# Welcome to Mastex\n\nThis portal documents every product in the Mastex platform. Pick a product on the left to begin.",
      categoryId: docCat.id,
      authorId: admin.id,
      order: 0,
    },
  });
  await prisma.docArticle.upsert({
    where: { slug: "quickstart" },
    update: {},
    create: {
      title: "Quickstart",
      slug: "quickstart",
      content: "# Quickstart\n\n1. Create an account\n2. Choose a plan\n3. Invite your team\n4. Start working",
      categoryId: docCat.id,
      authorId: admin.id,
      order: 1,
    },
  });

  // ── Careers ──────────────────────────────────────────────────────────────
  await prisma.jobPosting.upsert({
    where: { slug: "senior-fullstack-engineer" },
    update: {},
    create: {
      title: "Senior Full-Stack Engineer",
      slug: "senior-fullstack-engineer",
      department: "Engineering",
      location: "Accra, Ghana / Remote",
      type: JobType.FULL_TIME,
      description: "Build and scale the products that power thousands of businesses.",
      requirements: "5+ years with TypeScript, React/Next.js and Node. Strong product sense.",
      status: ContentStatus.PUBLISHED,
    },
  });

  // ── Sample lead ──────────────────────────────────────────────────────────
  await prisma.lead.create({
    data: {
      type: LeadType.SALES,
      status: LeadStatus.NEW,
      name: "Ama Mensah",
      email: "ama@example.com",
      company: "Mensah Retail",
      subject: "Interested in Mastex BMS",
      message: "We run 4 shops and want to centralise POS and inventory.",
      source: "/contact",
    },
  }).catch(() => {});

  // ── Site settings (editable CMS blocks) ──────────────────────────────────
  const settings: { key: string; group: string; value: any }[] = [
    {
      key: "company.details",
      group: "general",
      value: {
        legalName: "Mastex Technologies Ltd",
        shortName: "Mastex",
        tagline: "We build the software that runs modern businesses.",
        email: "hello@mastex.tech",
        phone: "+233 00 000 0000",
        address: "Accra, Ghana",
        socials: { x: "https://x.com/mastex", linkedin: "https://linkedin.com/company/mastex", github: "https://github.com/mastex" },
      },
    },
    {
      key: "home.hero",
      group: "home",
      value: {
        eyebrow: "Mastex Technologies Ltd",
        headline: "Software that runs modern businesses.",
        subhead: "We design, build and operate enterprise products, SaaS platforms and digital solutions — engineered to scale from one customer to millions.",
        primaryCta: { label: "Explore products", href: "/products" },
        secondaryCta: { label: "Talk to us", href: "/contact" },
      },
    },
    {
      key: "home.stats",
      group: "home",
      value: [
        { label: "Products shipped", value: "4+" },
        { label: "Businesses served", value: "120+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Countries", value: "3" },
      ],
    },
    {
      key: "home.testimonials",
      group: "home",
      value: [
        { quote: "Mastex BMS replaced four separate tools. Our shops finally run on one system.", author: "Ama Mensah", role: "Owner, Mensah Retail" },
        { quote: "SchoolOS cut our fee-collection admin in half and parents love the portal.", author: "Mr. Boateng", role: "Head, Unity Academy" },
        { quote: "DeepBoard gives our board the clarity we used to spend weeks assembling.", author: "K. Owusu", role: "CFO, Adinkra Group" },
      ],
    },
    {
      key: "home.trustedBy",
      group: "home",
      value: ["Mensah Retail", "Unity Academy", "Adinkra Group", "Accra Foods", "Volta Logistics", "Kumasi Clinic"],
    },
    {
      key: "home.faq",
      group: "home",
      value: [
        { question: "How quickly can we get started?", answer: "Most teams are up and running within a day. We provide onboarding, data import and training so you see value immediately." },
        { question: "Do your products work offline?", answer: "Yes. Our point-of-sale and field tools are offline-first and sync automatically once a connection returns — built for real conditions on the ground." },
        { question: "Which payment methods do you support?", answer: "Mobile money, cards and bank transfers are supported across our products through local payment rails, with reconciliation built in." },
        { question: "Is my data secure?", answer: "We apply role-based access control, audit logging, encryption in transit and strict security headers. Your data is never sold and you can export or delete it at any time." },
        { question: "Can Mastex build something custom for us?", answer: "Absolutely. Alongside our products we take on bespoke builds and integrations for organisations with specific needs — talk to our team." },
        { question: "Do you offer support and training?", answer: "Every plan includes support, and higher tiers add priority response, a dedicated success manager and onboarding sessions for your team." },
      ],
    },
    {
      key: "about.leadership",
      group: "about",
      value: [
        { name: "David Asamoah", role: "Founder & CEO", bio: "Sets the company vision and leads product strategy across the Mastex suite." },
        { name: "Akosua Mensah", role: "Chief Technology Officer", bio: "Owns engineering, security and the scalable foundation every product is built on." },
        { name: "Kwabena Osei", role: "Chief Operating Officer", bio: "Runs delivery, support and the day-to-day operations that keep customers successful." },
        { name: "Ama Boateng", role: "Head of Product", bio: "Translates customer needs into the roadmap and keeps every release sharp." },
      ],
    },
    {
      key: "about.founder",
      group: "about",
      value: {
        name: "David Asamoah",
        role: "Founder & CEO",
        quote: "Africa deserves world-class software built by people who understand it. That's what we get up to build every day.",
        vision: "To be the default technology partner for ambitious organisations across the continent.",
      },
    },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // ── Navigation ───────────────────────────────────────────────────────────
  const nav = [
    { label: "Products", href: "/products", location: "header", order: 0 },
    { label: "Solutions", href: "/solutions", location: "header", order: 1 },
    { label: "Docs", href: "/docs", location: "header", order: 2 },
    { label: "Blog", href: "/blog", location: "header", order: 3 },
    { label: "Careers", href: "/careers", location: "header", order: 4 },
    { label: "About", href: "/about", location: "header", order: 5 },
  ];
  for (const n of nav) {
    const existing = await prisma.navigationItem.findFirst({ where: { href: n.href, location: n.location } });
    if (!existing) await prisma.navigationItem.create({ data: n });
  }

  console.log("✅  Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
