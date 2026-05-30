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
        shortDescription: "A web-based event management system with role-based access and streamlined registration workflows.",
        description: `TicketFlare is a university web system for school organizations to publish events and manage attendee registrations at scale.

    The ASP.Net Core MVC app uses MySQL-backed data flows for registration, admin controls, and authenticated access.

    Key Contributions:
    - Implemented user authentication, authorization, and role-based access control.
    - Developed event creation, registration, and registrant management workflows.
    - Applied MVC architecture for clean separation of concerns.
    - Designed MySQL schemas for events, users, and registrations.
    - Integrated frontend and backend flows into a cohesive UI.`,
        learningPoints: [
            "Developed ASP.Net Core features for web application workflows.",
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
        shortDescription: "A desktop sales and inventory system with low-stock alerts and reliable transaction tracking.",
        description: `AMISCOSA is a university desktop system for tracking inventory, recording sales, and surfacing low-stock alerts for product availability.

    The ASP.Net Core UI connects MySQL-backed workflows for inventory updates, sales capture, and alerting.

    Key Contributions:
    - Implemented inventory tracking, sales recording, and low-stock notifications.
    - Designed MySQL data models for products, stock levels, and transactions.
    - Developed desktop UI flows for day-to-day inventory operations.`,
        learningPoints: [
            "Applied ASP.Net Core in a desktop application context.",
            "Strengthened MySQL usage for inventory-related data handling.",
            "Developed frontend workflows while coordinating backend integration."
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
        shortDescription: "An Android travel expense log with categorized tracking and cloud-synced data.",
        description: `Gabay is a university Android app for logging travel expenses, budgeting, and viewing summaries to manage spending on the go.

    The Java/XML UI integrates Firebase services for authentication and data storage.

    Key Contributions:
    - Implemented expense tracking, categorization, and budgeting flows.
    - Integrated Firebase for backend services and data persistence.
    - Designed a mobile UI optimized for quick entry and review.`,
        learningPoints: [
            "Developed Android features using Java and XML.",
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
        shortDescription: "A MERN e-commerce site with secure auth and a made-to-order cart flow.",
        description: `Co's Crocket Shop is a university MERN e-commerce site for made-to-order crochet products with admin-managed content and ordering.

    The application combines authentication, admin controls, and a custom cart experience aligned to made-to-order fulfillment.

    Key Contributions:
    - Implemented secure authentication and role-based access control.
    - Developed admin tooling for catalog and content management.
    - Developed a cart workflow tailored to made-to-order products.`,
        learningPoints: [
            "Developed full-stack features using the MERN stack.",
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
        shortDescription: "A role-based template builder with Word-like editing, field controls, and PDF export.",
        description: `Document Template Builder is a commissioned MERN web app that lets organizations create document templates using a Word-style editor and export styled PDFs.

    The platform combines TinyMCE customization, multi-level roles, and template rules for scoped access and field-level editing.

    Key Contributions:
    - Customized TinyMCE to mimic a simplified MS Word editing experience.
    - Developed system admin, organization admin, and student role flows.
    - Implemented field-level edit controls for template sections.
    - Enabled PDF export with styling preserved from the editor.
    - Designed multi-organization data scoping for templates and users.
    - Managed dynamic editable regions with robust frontend state handling.`,
        learningPoints: [
            "Customized TinyMCE to mimic a simplified MS Word editing experience.",
            "Developed a role-based access system with system admin, organization admins, and student accounts.",
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
        shortDescription: "A healthcare admin portal with JWT auth, pose-calibrated routines, and secure media access.",
        description: `WorkWell Web is a university healthcare admin panel for managing patient records and assigning exercise routines, including pose calibration and session video review.

    The React UI and ASP.Net Core APIs integrate Firebase Auth, Firestore, Cloudinary, and MediaPipe for media handling and exercise calibration. The project is hosted on Render, with the frontend deployed as a static site and the backend running as a web service.

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
        isFeatured: false,
        useCase: "University"

    },
    {
        id: 7,
        title: "WorkWell - Android",
        tags: [tagBadges['Android'], tagBadges['Java'], tagBadges['Firebase']],
        thumbnail: "/img_showcase/img_showcase-workwell-android.png",
        images: [],
        shortDescription: "An Android companion app for assigned routines with real-time pose monitoring and session review.",
        description: `WorkWell Android is the patient-facing companion app for viewing assigned routines, tracking sessions with pose monitoring, and reviewing uploaded videos.

    The Java/XML UI connects Firebase-backed data flows and supports MediaPipe integration for real-time monitoring.

    Key Contributions:
    - Implemented routine access and session review workflows.
    - Integrated Firebase Auth and Firestore for user and data management.
    - Assisted MediaPipe Pose Landmark Detection integration for real-time monitoring.
    - Developed mobile UI flows optimized for patient use.`,
        learningPoints: [
            "Developed Android features using Java and XML.",
            "Integrated Firebase Auth and Firestore for user and data management.",
            "Assisted MediaPipe Pose Landmark Detection integration for real-time monitoring.",
            "Coordinated pose detection integration with a teammate."
        ],
        link: "https://workwell-client.onrender.com/",
        isFeatured: false,
        useCase: "University"
    },
    {
        id: 8,
        title: "Pitaka - Expense & Subscription Tracker",
        tags: [tagBadges['Web'], tagBadges['TypeScript'], tagBadges['Next.js'], tagBadges['Tailwind CSS'], tagBadges['Supabase'], tagBadges['Jest'], tagBadges['Vercel']],
        thumbnail: "/img_showcase/img_showcase-pitaka.png",
        images: [],
        shortDescription: "A personal finance tracker with secure user data isolation and interactive dashboards.",
        description: `Pitaka is a personal finance tracker for daily expenses and subscriptions, using dashboards and summaries to surface clearer money insights.

    The Next.js App Router UI connects Supabase Auth, RLS policies, database schema design, and Jest-tested helper logic.

    Key Contributions:
    - Implemented Recharts dashboards for expense and subscription insights.
    - Applied Supabase Row-Level Security (RLS) for user data isolation.
    - Implemented authentication flows with Supabase Auth and session persistence.
    - Designed schemas for one-time and recurring expenses.
    - Developed a responsive UI with Tailwind CSS.
    - Wrote unit tests for key helpers using Jest.`,
        learningPoints: [
            "Developed a full-stack application using Next.js App Router and Supabase.",
            "Designed Recharts dashboards for financial data visualization.",
            "Applied Supabase Row-Level Security (RLS) to protect user data access.",
            "Developed a responsive UI with Tailwind CSS.",
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
        tags: [tagBadges['Web'], tagBadges['Android'], tagBadges['TypeScript'], tagBadges['MongoDB'], tagBadges['Express'], tagBadges['React'], tagBadges['Node.js'], tagBadges['Vercel'], tagBadges['Render']],
        thumbnail: "/img_showcase/img_showcase-limis.png",
        images: [],
        shortDescription: "A zero-knowledge credential manager with web and dedicated mobile clients sharing the same secure API server.",
        description: `Limis is a zero-knowledge credential manager for storing sensitive credentials in encrypted vaults across web and mobile clients. It is designed so credential data is encrypted on the client before it reaches the server, keeping the backend responsible for authentication, sync, and storage without holding plaintext secrets.

    The shared Express/MongoDB API supports separate web and mobile client codebases, making the product usable across devices while preserving one consistent authentication and vault architecture.

    Key Contributions:
    - Implemented client-side AES-GCM encryption with SHA-256 hashing to keep sensitive credential data encrypted before reaching the server.
    - Implemented Argon2id key derivation with WASM to strengthen password-based encryption against brute-force attacks.
    - Designed a vault-based data model in MongoDB to isolate credentials and support organized secure storage.
    - Developed separate web and mobile clients that reuse the same Express API, reducing backend duplication across platforms.
    - Implemented secure JWT authentication, email verification, and reusable middleware for protected API access.
    - Deployed the web client on Vercel and backend on Render, establishing a production-ready full-stack release workflow.`,
        learningPoints: [
            "Implemented client-side AES-GCM encryption with SHA-256 hashing to protect credential data before server transmission.",
            "Implemented Argon2id key derivation with WASM to improve resistance against brute-force attacks.",
            "Designed a vault-based MongoDB data model to isolate and organize stored credentials.",
            "Developed separate web and mobile clients that reuse one secure Express API server.",
            "Implemented JWT authentication, email verification, and reusable middleware for protected API access.",
            "Deployed the web client on Vercel and backend on Render for production use."
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
        thumbnail: "/img_showcase/img_showcase-kloudtrack-admin.png",
        images: [],
        shortDescription: "A production monitoring platform with per-minute ingestion and high-volume weather data dashboards.",
        description: `Kloudtrack is a production weather monitoring platform used by LGU command centers to track live station telemetry, review environmental conditions, and support faster operational response. The system processes 11k+ weather records per day through per-minute ingestion workflows and turns that data into real-time dashboards for command center teams.

    The work spans the API layer, telemetry processing, dashboard UI, and production support workflows, with a focus on making high-volume environmental data reliable, readable, and responsive for users monitoring live field conditions.

    Key Contributions:
    - Developed and maintained REST APIs for internal dashboards and external clients, improving access to operational weather data.
    - Implemented API key authentication and request validation to secure controlled access to telemetry endpoints.
    - Processed 11k+ daily weather records through per-minute ingestion workflows, supporting real-time command center monitoring.
    - Optimized chart-heavy React dashboards with memoization and state improvements, reducing re-render time by up to 80%.
    - Diagnosed backend bottlenecks and improved query efficiency to increase dashboard reliability under live data workloads.
    - Supported production deployments and troubleshooting across frontend, backend, and infrastructure workflows.`,
        learningPoints: [
          "Developed and maintained REST APIs for internal dashboards and external client access.",
          "Implemented API key authentication and request validation to secure telemetry endpoints.",
          "Processed 11k+ daily weather records through per-minute ingestion workflows.",
          "Reduced chart-heavy dashboard re-render time by up to 80% through React optimization.",
          "Improved backend query efficiency to increase reliability under live data workloads.",
          "Supported production deployments and troubleshooting across the full stack."
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
        shortDescription: "A public real-time weather portal with efficient polling and responsive geospatial dashboards.",
        description: `Public Kloudtrack is a public-facing Next.js platform that makes live environmental station data accessible outside internal command center tools. It gives general users a responsive way to view current weather conditions, station readings, and map-based monitoring data from Kloudtech stations.

    The frontend experience sits on top of secured internal APIs, with caching and data-fetching strategies that keep the interface responsive while reducing unnecessary backend traffic. The project translates operational telemetry into a clearer public dashboard for external users.

    Key Contributions:
    - Developed a public-facing Next.js dashboard that consumes secured internal APIs for live environmental data access.
    - Implemented server-side caching and efficient data fetching to reduce redundant requests and lower backend load.
    - Developed responsive dashboard views with interactive charts and map-based station visualization for clearer data exploration.
    - Optimized client-side rendering for frequent telemetry updates, improving perceived performance during live monitoring.
    - Delivered a user-facing data platform that made operational station data accessible outside internal command center tools.`,
        learningPoints: [
            "Developed a public-facing Next.js dashboard that consumes secured internal APIs.",
            "Implemented server-side caching and efficient data fetching to reduce backend load.",
            "Developed responsive dashboard views with charts and map-based station visualization.",
            "Optimized client-side rendering for frequent telemetry updates.",
            "Delivered a public data platform for accessible environmental monitoring."
        ],
        link: "https://citizen.kloudtechsea.com/",
        isFeatured: true,
        useCase: "Company"
    }
];
