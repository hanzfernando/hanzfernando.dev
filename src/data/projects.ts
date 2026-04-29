import { tagBadges } from './tagBadges';

export type PortfolioProject = {
    id: number;
    title: string;
    tags: string[];
    thumbnail: string;
    images: string[];
    shortDescription: string;
    description: string;
    learningPoints: string[];
    link: string;
    isFeatured: boolean;
    useCase: string;
};

export const projects: PortfolioProject[] = [
    {
        id: 1,
        title: "TicketFlare - Event Management System",
        tags: [tagBadges['Web'], tagBadges['JavaScript'], tagBadges['C#'], tagBadges['MySQL']],
        thumbnail: "/img_showcase/img_showcase-ticketflare.png",
        images: [],
        shortDescription: "Built a web-based event management system with role-based access and streamlined registration workflows.",
        description: `TicketFlare is a university web system for school organizations to publish events and manage attendee registrations at scale.

    I built the ASP.Net Core MVC app with MySQL-backed data flows for registration, admin controls, and authenticated access.

    Key Contributions:
    - Implemented user authentication, authorization, and role-based access control.
    - Built event creation, registration, and registrant management workflows.
    - Applied MVC architecture for clean separation of concerns.
    - Designed MySQL schemas for events, users, and registrations.
    - Integrated frontend and backend flows into a cohesive UI.`,
        learningPoints: [
            "Built ASP.Net Core features for web application development.",
            "Used MySQL for efficient data storage and management.",
            "Implemented user authentication, authorization, and role-based access control.",
            "Developed and managed a registration flow for event systems.",
            "Coordinated backend and frontend integration with a teammate.",
            "Applied MVC architecture principles within ASP.Net Core."
        ],
        link: "",
        isFeatured: false,
        useCase: "University"
    },
    {
        id: 2,
        title: "AMISCOSA - Sales and Inventory System",
        tags: [tagBadges['Web'], tagBadges['JavaScript'], tagBadges['C#'], tagBadges['MySQL']],
        thumbnail: "/img_showcase/img_showcase-amiscosa.png",
        images: [],
        shortDescription: "Built a desktop sales and inventory system with low-stock alerts and reliable transaction tracking.",
        description: `AMISCOSA is a university desktop system for tracking inventory, recording sales, and surfacing low-stock alerts for product availability.

    I built the ASP.Net Core UI and MySQL-backed workflows for inventory updates, sales capture, and alerting.

    Key Contributions:
    - Implemented inventory tracking, sales recording, and low-stock notifications.
    - Built MySQL data models for products, stock levels, and transactions.
    - Developed desktop UI flows for day-to-day inventory operations.`,
        learningPoints: [
            "Applied ASP.Net Core in a desktop application context.",
            "Strengthened MySQL usage for inventory-related data handling.",
            "Built the frontend while coordinating backend integration."
        ],
        link: "",
        isFeatured: false,
        useCase: "University"
    },
    {
        id: 3,
        title: "Gabay: A Local-based Travel Expenditure Log",
        tags: [tagBadges['Android'], tagBadges['Java'], tagBadges['Firebase']],
        thumbnail: "/img_showcase/img_showcase-gabay.png",
        images: [],
        shortDescription: "Built an Android travel expense log with categorized tracking and cloud-synced data.",
        description: `Gabay is a university Android app for logging travel expenses, budgeting, and viewing summaries to manage spending on the go.

    I built the Java/XML UI and integrated Firebase services for authentication and data storage.

    Key Contributions:
    - Implemented expense tracking, categorization, and budgeting flows.
    - Integrated Firebase for backend services and data persistence.
    - Designed a mobile UI optimized for quick entry and review.`,
        learningPoints: [
            "Built Android features using Java and XML.",
            "Integrated Firebase for backend services and data storage.",
            "Designed and implemented a user-friendly UI for tracking expenses.",
            "Coordinated backend and frontend workflows with a teammate."
        ],
        link: "",
        isFeatured: false,
        useCase: "University"

    },
    {
        id: 4,
        title: "Co's Crocket Shop",
        tags: [tagBadges['Web'], tagBadges['MongoDB'], tagBadges['Express'], tagBadges['React'], tagBadges['Node.js']],
        thumbnail: "/img_showcase/img_showcase-coscrochet.png",
        images: [],
        shortDescription: "Built a MERN e-commerce site with secure auth and a made-to-order cart flow.",
        description: `Co's Crocket Shop is a university MERN e-commerce site for made-to-order crochet products with admin-managed content and ordering.

    I built the authentication flow, admin controls, and a custom cart experience aligned to made-to-order fulfillment.

    Key Contributions:
    - Implemented secure authentication and role-based access control.
    - Built admin tooling for catalog and content management.
    - Developed a cart workflow tailored to made-to-order products.`,
        learningPoints: [
            "Built full-stack features using the MERN stack.",
            "Implemented secure authentication and role-based access control.",
            "Developed a customized cart system for made-to-order products."
        ],
        link: "",
        isFeatured: false, 
        useCase: "University"
    },
    {
        id: 5,
        title: "Document Template Builder",
        tags: [tagBadges['Web'], tagBadges['MongoDB'], tagBadges['Express'], tagBadges['React'], tagBadges['Node.js']],
        thumbnail: "/img_showcase/img_showcase-docbuilder.png",
        images: [],
        shortDescription: "Built a role-based template builder with Word-like editing, field controls, and PDF export.",
        description: `Document Template Builder is a commissioned MERN web app that lets organizations create document templates using a Word-style editor and export styled PDFs.

    I built the TinyMCE customization, multi-level role system, and template rules for scoped access and field-level editing.

    Key Contributions:
    - Customized TinyMCE to mimic a simplified MS Word editing experience.
    - Built system admin, organization admin, and student role flows.
    - Implemented field-level edit controls for template sections.
    - Enabled PDF export with styling preserved from the editor.
    - Designed multi-organization data scoping for templates and users.
    - Managed dynamic editable regions with robust frontend state handling.`,
        learningPoints: [
            "Customized TinyMCE to mimic a simplified MS Word editing experience.",
            "Built a role-based access system with system admin, organization admins, and student accounts.",
            "Implemented field-level editing control within templates for granular access.",
            "Enabled PDF export with styled output consistent with the editor.",
            "Designed multi-organization support with scoped data access for templates and users.",
            "Enhanced frontend state management for dynamic editable regions."
        ],
        link: "",
        isFeatured: false,
        useCase: "Commissioned"
    },
    {
        id: 6,
        title: "WorkWell - Web",
        tags: [tagBadges['Web'], tagBadges['React'], tagBadges['Tailwind CSS'], tagBadges['C#'], tagBadges['Firebase'], tagBadges['Render'], tagBadges['Vercel']],
        thumbnail: "/img_showcase/img_showcase-workwell-web.png",
        images: [],
        shortDescription: "Built a healthcare admin portal with JWT auth, pose-calibrated routines, and secure media access.",
        description: `WorkWell Web is a university healthcare admin panel for managing patient records and assigning exercise routines, including pose calibration and session video review.

    I built the React UI and ASP.Net Core APIs, integrated Firebase Auth and Firestore, and wired Cloudinary and MediaPipe for media and calibration features. The project is hosted on Render, with the frontend deployed as a static site and the backend running as a web service.

    Key Contributions:
    - Implemented JWT-based authentication and authorization flows.
    - Integrated Firebase Auth and Firestore for user and data management.
    - Connected Cloudinary for secure exercise session video storage and access.
    - Integrated MediaPipe Pose Landmark Detection for calibration workflows.
    - Implemented token-based session persistence using local storage.
    - Deployed frontend and backend as separate Render services.`,
        learningPoints: [
            "Integrated React with an ASP.Net Core backend.",
            "Used Firebase Auth and Firestore for authentication and data handling.",
            "Integrated Cloudinary for video storage and retrieval.",
            "Applied JWT for secure authentication and authorization.",
            "Implemented local storage to maintain user sessions with tokens.",
            "Deployed frontend as a static site and backend as a web service using Render.",
            "Integrated MediaPipe Pose Landmark Detection for exercise calibration."
        ],
        link: "https://workwell-client.onrender.com/",
        isFeatured: true,
        useCase: "University"

    },
    {
        id: 7,
        title: "WorkWell - Android",
        tags: [tagBadges['Android'], tagBadges['Java'], tagBadges['Firebase']],
        thumbnail: "/img_showcase/img_showcase-workwell-android.png",
        images: [],
        shortDescription: "Built an Android companion app for assigned routines with real-time pose monitoring and session review.",
        description: `WorkWell Android is the patient-facing companion app for viewing assigned routines, tracking sessions with pose monitoring, and reviewing uploaded videos.

    I built the Java/XML UI and Firebase-backed data flows, and assisted with MediaPipe integration for real-time monitoring.

    Key Contributions:
    - Implemented routine access and session review workflows.
    - Integrated Firebase Auth and Firestore for user and data management.
    - Assisted MediaPipe Pose Landmark Detection integration for real-time monitoring.
    - Built mobile UI flows optimized for patient use.`,
        learningPoints: [
            "Built Android features using Java and XML.",
            "Integrated Firebase Auth and Firestore for user and data management.",
            "Assisted MediaPipe Pose Landmark Detection integration for real-time monitoring.",
            "Coordinated pose detection integration with a teammate."
        ],
        link: "https://workwell-client.onrender.com/",
        isFeatured: true,
        useCase: "University"
    },
    {
        id: 8,
        title: "Pitaka - Expense & Subscription Tracker",
        tags: [tagBadges['Web'], tagBadges['TypeScript'], tagBadges['Next.js'], tagBadges['Tailwind CSS'], tagBadges['Supabase'], tagBadges['Jest'], tagBadges['Vercel']],
        thumbnail: "/img_showcase/img_showcase-pitaka.png",
        images: [],
        shortDescription: "Built a personal finance tracker with secure user data isolation and interactive dashboards.",
        description: `Pitaka is a personal finance tracker for daily expenses and subscriptions, built with dashboards and summaries for clear money insights.

    I built the Next.js App Router UI, Supabase Auth and RLS policies, database schema, and Jest tests for core helpers.

    Key Contributions:
    - Implemented Recharts dashboards for expense and subscription insights.
    - Applied Supabase Row-Level Security (RLS) for user data isolation.
    - Built authentication flows with Supabase Auth and session persistence.
    - Designed schemas for one-time and recurring expenses.
    - Built a responsive UI with Tailwind CSS.
    - Wrote unit tests for key helpers using Jest.`,
        learningPoints: [
            "Built a full-stack application using Next.js App Router and Supabase.",
            "Designed Recharts dashboards for financial data visualization.",
            "Applied Supabase Row-Level Security (RLS) to protect user data access.",
            "Built a responsive UI with Tailwind CSS.",
            "Structured and optimized the database schema for one-time and recurring expenses.",
            "Handled authentication with Supabase Auth and session persistence.",
            "Applied component-based architecture and clean code separation.",
            "Wrote unit tests for key helpers using Jest."
        ],
        link: "",
        isFeatured: false,
        useCase: "Personal"
    },
    {
        id: 9,
        title: "Limis - Credential Manager",
        tags: [tagBadges['Web'], tagBadges['TypeScript'], tagBadges['MongoDB'], tagBadges['Express'], tagBadges['React'], tagBadges['Node.js'], tagBadges['Vercel'], tagBadges['Render']],
        thumbnail: "/img_showcase/img_showcase-limis.png",
        images: [],
        shortDescription: "Built a zero-knowledge credential manager with client-side AES-GCM encryption and Argon2id keys.",
        description: `Limis is a personal credential manager that stores sensitive data in client-encrypted vaults using a zero-knowledge design, where only the user can decrypt the data.

    I built the client-side crypto, Express/MongoDB APIs, JWT auth flows, and deployment pipeline. The app is deployed via Vercel (frontend) and Render (backend).

    Key Contributions:
    - Implemented AES-GCM encryption with SHA-256 hashing for client-side data protection.
    - Derived encryption keys using Argon2id with WASM for stronger brute-force resistance.
    - Designed a vault-based architecture to segregate credentials.
    - Built secure cookie-based JWT authentication and email verification.
    - Implemented reusable middleware for authentication, logging, and error handling.
    - Structured the API with Express, MongoDB, and TypeScript interfaces.`,
        learningPoints: [
            "Implemented AES-GCM encryption with SHA-256 hashing for client-side data protection.",
            "Derived encryption keys using Argon2id with WASM for stronger security.",
            "Designed a vault-based architecture to organize and segregate credentials.",
            "Built secure cookie-based JWT authentication and email verification.",
            "Implemented zero-knowledge principles so sensitive data is never stored in plaintext.",
            "Structured API with Express and MongoDB using Mongoose models and TypeScript interfaces.",
            "Applied reusable middleware for authentication, logging, and error handling.",
            "Deployed the full-stack app using Vercel (frontend) and Render (backend)."
        ],
        link: "https://limis.hanzfernando.com/",
        isFeatured: true,
        useCase: "Personal"
    },
    {
        id: 10,
        title: "Kloudtech - Kloudtrack",
        tags: [
            tagBadges['Web'],
            tagBadges['React'],
            tagBadges['Tailwind CSS'],
            tagBadges['Node.js'],
            tagBadges['Express'],
            tagBadges['PostgreSQL'],
            tagBadges['AWS']
        ],
        thumbnail: "/img_showcase/img_placeholder.jpg",
        images: [],
        shortDescription: "Built a production monitoring platform with per-minute ingestion and high-volume weather data dashboards.",
        description: `Kloudtrack is a production monitoring platform for Kloudtech Corp, deployed across 5+ LGU command centers and processing 11,000+ weather records per day with per-minute ingestion.

    I built backend APIs, data processing pipelines, and React dashboards, plus performance optimizations on chart-heavy pages.

    Key Contributions:
    - Designed and maintained REST APIs for internal systems and external clients.
    - Implemented API key authentication and request validation.
    - Processed 11k+ weather records daily with per-minute ingestion.
    - Reduced chart-heavy re-render time by up to 80% using memoization and state optimization.
    - Identified backend bottlenecks and improved query efficiency and response times.`,
        learningPoints: [
          "Designed and maintained REST APIs used by internal systems and external client developers.",
          "Implemented API key authentication and request validation to secure external data access.",
          "Processed and handled 11k+ weather data records daily with per-minute ingestion.",
          "Reduced chart-heavy dashboard re-render time by up to 80% through memoization and optimized state management.",
          "Identified backend performance bottlenecks and improved query efficiency and response times."
      ],
        link: "",
        isFeatured: true,
        useCase: "Company"
    },
    {
        id: 11,
        title: "Kloudtech - Public Kloudtrack",
        tags: [
            tagBadges['Web'],
            tagBadges['Next.js'],
            tagBadges['Tailwind CSS'],
            tagBadges['Node.js'],
            tagBadges['Express'],
            tagBadges['PostgreSQL'],
            tagBadges['AWS']
        ],
        thumbnail: "/img_showcase/img_showcase-kloudtrack.png",
        images: [],
        shortDescription: "Built a public real-time weather portal with efficient polling and responsive geospatial dashboards.",
        description: `Public Kloudtrack is a Next.js web platform that exposes live environmental data from Kloudtech's nationwide stations for general users.

    I built the frontend, optimized data fetching and caching, and tuned rendering to handle frequent updates without UI lag.

    Key Contributions:
    - Built a public-facing Next.js UI that consumes secured internal APIs.
    - Implemented efficient polling and caching for real-time visualization.
    - Designed responsive dashboards with interactive charts and mapping.
    - Optimized client-side rendering for frequent data updates.`,
        learningPoints: [
            "Built a public-facing Next.js application that consumes secured internal APIs.",
            "Implemented efficient data fetching and caching strategies for real-time weather visualization.",
            "Designed responsive dashboards with interactive charts and geospatial mapping.",
            "Optimized client-side rendering to handle frequent data updates smoothly."
        ],
        link: "https://citizen.kloudtechsea.com/",
        isFeatured: true,
        useCase: "Company"
    }
];
