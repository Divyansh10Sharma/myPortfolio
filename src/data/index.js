// ============================================================
// Content. Section numbering here is the page's real sequence —
// the spine labels read from it, so they cannot drift.
// ============================================================

export const profile = {
    name: "Divyansh Sharma",
    role: "Backend & AI Engineer",
    availability: "Available for opportunities",
    email: "divyansh.convivial@gmail.com",
    phone: "+91 87459-92299",
    phoneHref: "tel:+918745992299",
    location: "Delhi, India",
    github: "https://github.com/Divyansh10Sharma",
    githubLabel: "github.com/Divyansh10Sharma",
    linkedin: "https://www.linkedin.com/in/divyansh-sharma-convivial/",
    linkedinLabel: "linkedin.com/in/divyansh-sharma-convivial",
    resume:
        "https://drive.google.com/file/d/1MbxOlm460Ac9LdPARNcP_0GITvXLxAs_/view?usp=sharing",
    intro:
        "I build production systems in healthtech — AI features, a custom real-time messaging layer, native health-sensor integration, and an in-flight Firestore-to-PostgreSQL migration. Two years, five codebases, real users.",
};

export const navLinks = [
    { id: "overview", label: "About" },
    { id: "systems", label: "Systems" },
    { id: "work", label: "Work" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
];

export const stats = [
    { value: "5K+", label: "app downloads" },
    { value: "5", label: "production codebases owned" },
    { value: "80+", label: "gym partners automated" },
    { value: "120%", label: "organic MAU growth" },
];

export const overview = {
    heading: "The engineer behind the build",
    paragraphs: [
        "Full Stack Engineer at Train Rex since August 2024, owning architecture and delivery across five production codebases: a Flask/PostgreSQL backend on GCP App Engine, a React Native app, a consumer web platform, and an internal operations dashboard.",
        "Most of my work sits where AI meets production constraints — building systems that stay correct when the model doesn't. Deterministic computation where accuracy matters, LLMs where language matters, and hard guardrails between them.",
        "B.Tech in Information Technology, GGSIPU, CGPA 8.9. Based in Delhi.",
    ],
    certification: {
        name: "Coding Ninjas C++",
        detail: "All India Rank 493 · Top 5%",
        date: "Aug 2023",
    },
};

// ── 02 / SYSTEMS ────────────────────────────────────────────
// `span` drives the asymmetric layout: blocks alternate between a
// narrow measure and a wider one down the page.
export const systems = [
    {
        id: "rexpert",
        index: "S-01",
        name: "Rexpert",
        subtitle: "AI coaching system",
        // Design and mechanics are under NDA — deliberately described at
        // capability level only. Do not add implementation detail here.
        body: "An AI-assisted coaching system running on the same Flask and PostgreSQL backend, which I owned end to end from design through rollout. The architecture is covered by my employer's confidentiality agreement, so it isn't written up here — I'm glad to talk through the engineering trade-offs in conversation.",
        stack: ["Python", "Flask", "PostgreSQL", "OpenAI", "Claude", "Pinecone"],
        confidential: true,
        span: "wide",
    },
    {
        id: "nutrition",
        index: "S-02",
        name: "Nutrition engine",
        body: "BMR, TDEE and macro splits computed deterministically in Python, then passed to the LLM as hard constraints rather than suggestions. Validated by schema-constrained per-day calls, a multi-tier JSON recovery cascade, and independent server-side macro reconciliation that re-checks the model's arithmetic instead of trusting it.",
        stack: ["Python", "OpenAI", "CrewAI", "PostgreSQL"],
        span: "narrow",
    },
    {
        id: "messaging",
        index: "S-03",
        name: "Real-time messaging",
        body: "A hand-written asyncio WebSocket server bridging synchronous Flask handlers onto the async event loop, with a React Native client handling eleven concurrent event types, an offline-first send queue persisted to disk, cursor pagination, presence-aware notification suppression, and on-disk media caching over S3 and CloudFront.",
        stack: ["Python asyncio", "React Native", "AWS S3", "CloudFront"],
        span: "wide",
    },
    {
        id: "steps",
        index: "S-04",
        name: "Step reconciliation",
        body: "A native Android module reading the hardware step sensor, which reports a cumulative count since boot rather than steps today. It derives a boot-time offset against Google Fit and re-derives it every fifty steps when drift is detected — reconciling a fast, offline, locally-drifting sensor against a slower cloud-authoritative total. Also fixes a HealthKit day-boundary bug that mis-attributed steps in positive UTC offsets.",
        stack: ["Java", "Google Fit", "HealthKit", "React Native"],
        span: "narrow",
        figure: "telemetry",
    },
    {
        id: "payments",
        index: "S-05",
        name: "Payment reliability",
        body: "Three independent recovery layers against Razorpay: an HMAC-SHA256 webhook with timing-safe verification, a fifteen-minute poller re-checking pending payments, and a nightly subscription reconciliation against Razorpay as source of truth. Every save path is independently idempotent, because the webhook, the poller and the client can all fire for the same payment.",
        stack: ["Flask", "Razorpay", "PostgreSQL"],
        span: "wide",
    },
    {
        id: "migration",
        index: "S-06",
        name: "Firestore to PostgreSQL migration",
        body: "An incremental migration flattening four-level nested collections into normalised tables with idempotent writes. Uses a strangler-fig read-merge: queries both stores in a single request, deduplicates by composite key, and tags each row with its data origin for debuggability — so reads stay correct throughout the transition.",
        stack: ["PostgreSQL", "Firestore", "Python"],
        span: "narrow",
    },
];

export const work = [
    {
        role: "Full Stack Engineer",
        org: "Train Rex",
        location: "Delhi NCR",
        dates: "Aug 2024 — present",
        line: "Architecture and delivery across five production codebases. Systems above.",
    },
    {
        role: "Web Development Intern",
        org: "Analysed.in",
        location: "Remote",
        dates: "Oct 2023 — Feb 2024",
        line: "Technical lead among fourteen interns on a diet and fitness platform, owning frontend architecture, API design and database schema.",
    },
];

export const projects = [
    {
        name: "Face Guard",
        body: "Real-time behavioural awareness using MediaPipe's 468-point face mesh and hand tracking to detect frustration, face-touching and eye squinting through landmark geometry — eye aspect ratio, brow furrow scoring, lip compression — with per-user calibration and blink-versus-squint time filtering. No trained models, no training data.",
        href: "https://github.com/Divyansh10Sharma/face_guard",
        hrefLabel: "github.com/Divyansh10Sharma/face_guard",
    },
    {
        name: "Frencie",
        subtitle: "video conferencing",
        body: "WebRTC platform for 50+ participants with screen sharing, recording and real-time chat. Adaptive bitrate control cut bandwidth usage by 40%.",
        href: "https://frencie.vercel.app",
        hrefLabel: "frencie.vercel.app",
    },
    {
        name: "Thread",
        body: "Social platform with real-time messaging, media uploads and 5,000 concurrent connections.",
    },
];

export const testimonials = [
    {
        quote:
            "Divyansh comes up with quick solutions to complex problems and then optimizes it further efficiently.",
        name: "Disha Goel",
        title: "Data Analyst, Accenture",
    },
    {
        quote:
            "I've never met a web developer who truly cares about their clients' success like Divyansh does.",
        name: "Aditya Sharma",
        title: "Software Engineer, Matrack Inc.",
    },
];
