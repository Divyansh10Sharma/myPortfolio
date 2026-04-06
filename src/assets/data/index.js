// ============================================================
// PORTFOLIO DATA — Train Rex / Divyansh Sharma
// All sections: experiences, projects, testimonials, skills, nav
// ============================================================

// ── Navigation ──────────────────────────────────────────────
export const navLinks = [
    { id: "about",       label: "About"       },
    { id: "experience",  label: "Experience"  },
    { id: "skills",      label: "Skills"      },
    { id: "projects",    label: "Projects"    },
    { id: "testimonials",label: "Testimonials"},
    { id: "contact",     label: "Contact"     },
];

// ── Hero ────────────────────────────────────────────────────
export const heroData = {
    name: "Divyansh Sharma",
    tagline: "Full Stack Engineer",
    sub: "Building production systems in healthtech — AI, mobile & SaaS.",
    cta: "Explore My Work",
    github: "https://github.com/Divyansh10Sharma",
    linkedin: "https://linkedin.com/in/divyansh-sharma",
    email: "divyansh.convivial@gmail.com",
    resume: "#", // replace with actual resume link
};

// ── About ───────────────────────────────────────────────────
export const aboutData = {
    description: `Full Stack Engineer with 2+ years building production systems in healthtech.
    Designed and shipped an AI-assisted diet plan engine, real-time mobile accountability platform,
    and a SaaS gym management suite onboarding 80+ gyms. Proficient across React, React Native,
    Python/Flask, Firebase, and PostgreSQL. Strong track record of owning systems end-to-end —
    from architecture through deployment and growth.`,
    stats: [
        { value: "5K+",  label: "App Downloads"       },
        { value: "80+",  label: "Gyms Onboarded"      },
        { value: "500+", label: "Memberships Managed"  },
        { value: "120%", label: "Organic Growth"       },
    ],
};

// ── Experience ──────────────────────────────────────────────
export const experiences = [
    {
        id: 1,
        title: "Full Stack Engineer",
        company_name: "Train Rex",
        iconBg: "#9ebc80",
        iconText: "TR",
        date: "Aug 2024 – Present",
        location: "Delhi NCR, India",
        type: "Full-time",
        points: [
            "Built a React Native fitness app with AI-powered diet planning and real-time group chat, scaling to 5K+ downloads and increasing engagement by 67%.",
            "Designed and implemented a personalized nutrition engine that generated goal-based weekly meal plans using macro calculations and AI validation, reducing operations execution cost by 50%.",
            "Designed in-app team system supporting 25+ participants per group with meal tracking, workout uploads, and messaging, improving program completion rates.",
            "Engineered full-stack fitness SaaS using React, Flask, Firebase, and Razorpay, onboarding 80+ gyms and processing ₹70K+ monthly transactions.",
            "Developed CRM managing 500+ memberships across 30+ locations, reducing admin costs by 60% and increasing revenue by 10%.",
            "Drove 120% organic growth through SEO and ASO optimization, reaching 2K+ monthly active users.",
        ],
        tech: ["React Native", "React", "Flask", "Firebase", "OpenAI", "Razorpay"],
    },
    {
        id: 2,
        title: "Web Development Intern",
        company_name: "Analysed.in",
        iconBg: "#4a90d9",
        iconText: "AN",
        date: "Oct 2023 – Feb 2024",
        location: "Remote",
        type: "Internship",
        points: [
            "Led a team of 14 interns building a web-based diet and fitness tracking platform using HTML, CSS, JavaScript, PHP, and MySQL.",
            "Managed full-stack architecture including frontend development, API design, and database schema.",
            "Conducted code reviews and technical mentoring to maintain development velocity across the team.",
            "Improved development workflow and debugging practices reducing development time by 25%.",
        ],
        tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    },
];

// ── Skills ──────────────────────────────────────────────────
export const skillCategories = [
    {
        category: "Frontend",
        icon: "🖥️",
        skills: ["React", "Next.js", "React Native", "TailwindCSS", "TypeScript"],
    },
    {
        category: "Backend",
        icon: "⚙️",
        skills: ["Flask", "Node.js", "Express", "REST APIs", "GraphQL", "WebSockets"],
    },
    {
        category: "Databases",
        icon: "🗄️",
        skills: ["Firebase", "PostgreSQL", "MongoDB", "MySQL", "Redis"],
    },
    {
        category: "Languages",
        icon: "💻",
        skills: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL"],
    },
    {
        category: "DevOps & Tools",
        icon: "🔧",
        skills: ["Git", "Docker", "Vercel", "WebRTC", "OpenAI API"],
    },
];

// ── Projects ────────────────────────────────────────────────
export const projects = [
    {
        id: "train-rex-app",
        name: "Train Rex – Fitness App",
        shortDescription: "AI-powered fitness & diet planning mobile app with real-time group accountability.",
        description: `A full-featured React Native fitness app with AI-powered diet planning, real-time WhatsApp-style group chat,
        and personalized macro-based nutrition engine. Scaled to 5K+ downloads with 67% engagement increase.
        Integrated OpenAI for meal plan validation and Razorpay for payments.`,
        tags: [
            { name: "React Native", color: "blue-text-gradient"  },
            { name: "Firebase",     color: "green-text-gradient" },
            { name: "OpenAI",       color: "pink-text-gradient"  },
            { name: "Flask",        color: "orange-text-gradient"},
        ],
        highlights: [
            "5K+ downloads on Play Store",
            "67% increase in user engagement",
            "AI meal plan generation with macro validation",
            "Real-time group chat for 25+ participants",
        ],
        image: null, // replace with imported image
        source_code_link: "https://github.com/Divyansh10Sharma",
        live_link: null,
        featured: true,
    },
    {
        id: "gym-saas",
        name: "Gym Management SaaS",
        shortDescription: "Full-stack SaaS for gym owners — CRM, memberships, billing, and analytics.",
        description: `A production SaaS platform built with React, Flask, Firebase, and Razorpay for gym management.
        Onboarded 80+ gyms, manages 500+ memberships across 30+ locations, and processes ₹70K+ in monthly transactions.
        Features include CRM, attendance tracking, plan management, and revenue analytics.`,
        tags: [
            { name: "React",    color: "blue-text-gradient"  },
            { name: "Flask",    color: "green-text-gradient" },
            { name: "Firebase", color: "pink-text-gradient"  },
            { name: "Razorpay", color: "orange-text-gradient"},
        ],
        highlights: [
            "80+ gyms onboarded",
            "₹70K+ monthly transactions",
            "60% reduction in admin costs",
            "500+ memberships managed",
        ],
        image: null,
        source_code_link: "https://github.com/Divyansh10Sharma",
        live_link: null,
        featured: true,
    },
    {
        id: "thread",
        name: "Thread",
        shortDescription: "Twitter-like social platform with real-time messaging, media uploads, and 5K concurrent connections.",
        description: `A social media platform where users can post, like, comment, follow/unfollow with dynamic suggestions.
        Built with React, MongoDB, and WebSockets supporting 5K concurrent connections. Features JWT auth, Cloudinary CDN for media,
        and a fully responsive UI.`,
        tags: [
            { name: "React",     color: "blue-text-gradient"  },
            { name: "MongoDB",   color: "green-text-gradient" },
            { name: "ChakraUI",  color: "pink-text-gradient"  },
            { name: "WebSocket", color: "orange-text-gradient"},
        ],
        highlights: [
            "1000+ users on platform",
            "5K concurrent WebSocket connections",
            "JWT authentication & secure APIs",
            "Cloudinary CDN media uploads",
        ],
        image: null,
        source_code_link: "https://github.com/Divyansh10Sharma/Threads_Clone.git",
        live_link: null,
        featured: false,
    },
    {
        id: "frencie",
        name: "Frencie – Video Conference",
        shortDescription: "Video conferencing app for 50+ participants with screen share, recording, and adaptive streaming.",
        description: `A WebRTC-powered video conferencing application supporting 50+ simultaneous participants.
        Features include screen sharing, session recording, real-time chat, and adaptive bitrate control that reduced bandwidth by 40%.`,
        tags: [
            { name: "WebRTC",     color: "blue-text-gradient"  },
            { name: "Node.js",    color: "green-text-gradient" },
            { name: "WebSockets", color: "pink-text-gradient"  },
        ],
        highlights: [
            "50+ participant support",
            "40% bandwidth reduction via adaptive bitrate",
            "Screen sharing & recording",
            "Real-time chat integration",
        ],
        image: null,
        source_code_link: "https://github.com/Divyansh10Sharma",
        live_link: null,
        featured: false,
    },
    {
        id: "face-attendance",
        name: "Face Recognition Attendance",
        shortDescription: "ML-powered automated attendance system using computer vision and deep learning.",
        description: `An automated attendance marking system using OpenCV and deep learning for face recognition.
        Displays real-time student info and attendance status through a user-friendly interface. Built for real-world
        classroom deployment with high accuracy.`,
        tags: [
            { name: "Python",  color: "blue-text-gradient"  },
            { name: "OpenCV",  color: "green-text-gradient" },
            { name: "ML",      color: "pink-text-gradient"  },
        ],
        highlights: [
            "Real-time face detection",
            "Deep learning classification model",
            "Student info dashboard",
            "Production-ready accuracy",
        ],
        image: null,
        source_code_link: "https://github.com/Divyansh10Sharma",
        live_link: null,
        featured: false,
    },
];

// ── Testimonials ─────────────────────────────────────────────
export const testimonials = [
    {
        testimonial: "Divyansh comes up with quick solutions to complex problems and then optimizes it further efficiently.",
        name: "Disha Goel",
        designation: "Data Analyst",
        company: "Accenture",
        initials: "DG",
        color: "#9ebc80",
    },
    {
        testimonial: "One of the most dedicated engineers I've worked with — he ships fast, thinks deep, and always goes beyond the spec.",
        name: "Team Lead",
        designation: "Engineering",
        company: "Train Rex",
        initials: "TL",
        color: "#4a90d9",
    },
    {
        testimonial: "I've never met a web developer who truly cares about their clients' success like Divyansh does.",
        name: "Aditya Sharma",
        designation: "Software Engineer",
        company: "Matrack Inc.",
        initials: "AS",
        color: "#4a90d9",
    },
];

// ── Education ───────────────────────────────────────────────
export const education = [
    {
        degree: "Bachelor of Technology – Information Technology",
        institution: "Guru Gobind Singh Indraprastha University",
        location: "New Delhi, India",
        duration: "2020 – 2024",
        cgpa: "8.9 / 10.00",
    },
];

// ── Certificates ─────────────────────────────────────────────
export const certificates = [
    {
        name: "Google Ninja AIR 493 – C++ Programming",
        date: "Aug 2023",
        detail: "Top 5% | Score: 80.67% (OOP, STL, memory management, multithreading)",
    },
    {
        name: "Microsoft Student Ambassadors – Git & GitHub",
        date: "May 2022",
        detail: "Contributed to 3 open-source projects",
    },
    {
        name: "TCS iON Career Edge – Young Professional",
        date: "Mar–Apr 2023",
        detail: "Score: 60+",
    },
];
