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
        shortDescription: "A web-based event management system for school events, allowing organizations to create events and users to register.",
        description: "This web-based application enables organizations to create and manage events while allowing users to register. It includes features such as event creation, user registration, and viewing registrants for each event.",
        learningPoints: [
            "Gained practical experience with ASP.Net Core for web application development.",
            "Applied MySQL for efficient data storage and management.",
            "Implemented user authentication, authorization, and role-based access control.",
            "Learned to develop and manage a registration flow for event systems.",
            "Collaborated with a teammate to connect backend and frontend components.",
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
        shortDescription: "A desktop application for managing sales transactions and inventory tracking.",
        description: "This desktop-based system manages inventory and sales processes. It features inventory tracking, sales recording, and low-stock notifications to help manage product availability efficiently.",
        learningPoints: [
            "Expanded knowledge of ASP.Net Core applied in desktop applications.",
            "Strengthened proficiency in MySQL for inventory-related data handling.",
            "Improved collaboration skills by working on the frontend while another developer handled backend integration."
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
        shortDescription: "An Android app that helps users log and categorize travel expenses.",
        description: "This Android application allows users to monitor their travel-related spending. Key features include expense tracking, budgeting, expense categorization, and viewing summaries for better financial management.",
        learningPoints: [
            "Learned Android development using Java and XML.",
            "Gained experience integrating Firebase for backend services and data storage.",
            "Designed and implemented a user-friendly UI for tracking expenses.",
            "Worked closely with a teammate to synchronize backend and frontend workflows."
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
        shortDescription: "An e-commerce website for selling made-to-order crochet products, built using the MERN stack.",
        description: "This e-commerce platform is built with the MERN stack and features user authentication, admin controls for managing content, and a cart system specifically designed for made-to-order products.",
        learningPoints: [
            "Learned full-stack development using the MERN stack.",
            "Implemented secure authentication and role-based access control.",
            "Built a functional and customized cart system for made-to-order products."
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
        shortDescription: "A role-based document template builder styled like MS Word, with editable fields and export functionality.",
        description: "A MERN stack web application that enables organizations to create and manage document templates through a customized TinyMCE editor designed to resemble a simplified Microsoft Word. The system includes a multi-level role structure where a system admin can create organizations and assign organization-specific admins. These admins can manage student accounts within their organization. Templates can be configured to be fully editable or restrict editing to specific fields. Users can view templates assigned to their school and export completed documents as PDFs with preserved styling.",
        learningPoints: [
            "Customized TinyMCE to mimic a simplified MS Word for an intuitive document editing experience.",
            "Built a role-based access system with system admin, organization admins, and student accounts.",
            "Implemented field-level editing control within templates for granular access.",
            "Enabled export to PDF using styled output consistent with the in-editor formatting.",
            "Designed multi-organization support with scoped data access for templates and users.",
            "Enhanced frontend state management to handle dynamic editable regions in documents."
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
        shortDescription: "A web platform for managing patient records and assigning exercise routines.",
        description: "This web-based admin panel allows healthcare providers to manage patient records and assign custom exercise routines. It supports features like user management, exercise calibration using MediaPipe Pose Landmark, routine creation, and access to uploaded exercise session videos via Cloudinary. The project is hosted on Render, with the frontend deployed as a static site and the backend running as a web service.",
        learningPoints: [
            "Enhanced skills in React and integrated it with an ASP.Net Core backend.",
            "Used Firebase Auth and Firestore for authentication and data handling.",
            "Integrated Cloudinary for efficient video storage and retrieval.",
            "Applied JWT for secure authentication and authorization.",
            "Implemented local storage to maintain user sessions with tokens.",
            "Deployed frontend as a static site and backend as a web service using Render.",
            "Collaborated with a developer to integrate MediaPipe Pose Landmark Detection for exercise calibration."
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
        shortDescription: "An Android app for patients to view, perform, and review their assigned exercise routines.",
        description: "This Android application serves as a companion to the WorkWell admin panel. It allows patients to access assigned exercise routines, perform them with real-time monitoring using MediaPipe Pose Landmark, and review previous session videos stored on Cloudinary.",
        learningPoints: [
            "Strengthened Android development skills using Java and XML.",
            "Gained hands-on experience with Firebase Auth and Firestore for user and data management.",
            "Assisted in integrating MediaPipe Pose Landmark Detection for real-time monitoring.",
            "Collaborated with a developer to successfully integrate pose detection into the application."
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
        shortDescription: "A financial tracking app for managing personal expenses and subscriptions with insightful dashboards.",
        description: "Pitaka is a personal finance tracker that helps users monitor their daily expenses and recurring subscriptions. It features an interactive dashboard built with Recharts, secure user authentication with Supabase Auth, and a responsive UI styled with Tailwind CSS. Users can categorize their expenses, track subscription renewals, and view financial summaries in a clean, accessible interface. The app enforces row-level security to keep user data isolated and secure.",
        learningPoints: [
            "Built a full-stack application using Next.js App Router and Supabase.",
            "Designed and implemented Recharts-powered dashboards for visualizing financial data.",
            "Applied Supabase Row-Level Security (RLS) to protect user-specific data access.",
            "Used Tailwind CSS for building a modern, responsive, dark-mode-friendly UI.",
            "Structured and optimized the database schema for tracking both one-time and recurring expenses.",
            "Handled authentication with Supabase Auth and maintained session persistence.",
            "Practiced component-based architecture and clean code separation for maintainability.",
            "Wrote unit tests for key helpers using Jest."
        ],
        link: "https://pitaka-by-hanz.vercel.app/",
        isFeatured: true,
        useCase: "Personal"
    },
    {
        id: 9,
        title: "Limis - Credential Manager",
        tags: [tagBadges['Web'], tagBadges['TypeScript'], tagBadges['MongoDB'], tagBadges['Express'], tagBadges['React'], tagBadges['Node.js'], tagBadges['Vercel'], tagBadges['Render']],
        thumbnail: "/img_showcase/img_showcase-limis.png",
        images: [],
        shortDescription: "A secure, zero-knowledge password manager with client-side encryption and vault-based organization.",
        description: "Limis is a monolithic credential manager that allows users to securely store and manage their sensitive information in encrypted vaults. It uses AES-GCM encryption for data security, with keys derived via Argon2id to prevent brute-force attacks. Vault data is encrypted client-side, ensuring zero-knowledge design where only the user can decrypt their information. The app supports secure cookie-based JWT authentication, email verification, and a responsive UI. Users can create multiple vaults, each acting as a container for their credentials.",
        learningPoints: [
            "Implemented AES-GCM encryption with SHA-256 hashing for secure client-side data protection.",
            "Derived encryption keys using Argon2id with WASM for improved security and performance.",
            "Designed a vault-based architecture to organize and segregate credentials.",
            "Built secure cookie-based JWT authentication and email verification.",
            "Implemented zero-knowledge principles ensuring that sensitive data is never stored in plaintext.",
            "Structured API with Express and MongoDB using Mongoose models and TypeScript interfaces.",
            "Applied reusable middleware for authentication, logging, and error handling.",
            "Deployed full-stack application using Vercel (frontend) and Render (backend)."
        ],
        link: "https://limis-by-hanz.vercel.app/",
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
        shortDescription: "An internal monitoring system for managing weather stations and visualizing real-time environmental data across multiple LGU command centers.",
        description: "Kloudtrack is a production-grade monitoring platform used by Kloudtech Corp and deployed across 5+ LGU command centers. The system processes 11,000+ weather data records daily with per-minute ingestion and provides real-time visualization through interactive charts and station-based mapping.\n\nI worked across the full stack — building backend APIs, optimizing data processing pipelines, and developing responsive dashboards for operational monitoring. I also improved performance on chart-heavy pages, reducing re-render times by up to 80% through better state management and memoization strategies. ",
        learningPoints: [
          "Designed and maintained REST APIs used by internal systems and external client developers.",
          "Implemented API key authentication and request validation to secure external data access.",
          "Processed and handled 11k+ weather data records daily with per-minute ingestion.",
          "Reduced chart-heavy dashboard re-render time by up to 80% through memoization and optimized state management.",
          "Identified backend performance bottlenecks and improved query efficiency and response times.",
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
        shortDescription: "A public-facing platform for visualizing real-time weather data from Kloudtech's nationwide station network.",
        description: "The Public Kloudtrack platform allows general users to access and visualize real-time environmental data collected from Kloudtech's weather stations. Built with Next.js, the application consumes APIs from the internal Kloudtrack system and presents live data through interactive charts and geospatial mapping.\n\nI focused on building a performant and responsive frontend, implementing efficient data fetching and caching strategies to ensure smooth real-time updates. The system was designed to remain lightweight while handling frequent API polling and data refreshes.",
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