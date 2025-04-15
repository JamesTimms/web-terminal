import {
  Skill,
  AboutInfo,
  Achievement,
  Certification,
  WorkExperience,
} from "~/lib/commands";

export const aboutInfo: AboutInfo = {
  paragraphs: [
    "I'm a founder, hacker, gamer, occasional apple tree climber, and newly minted dog dad. I love solving problems and drinking bubble tea🧋",
    "Founder of RaavaVPN, Mappa and other startups. Loyal to a fault. Strong ally. Environmental Vegan.",
    "Started life making video games, continued as a sys admin, moved into DevOps, and now a full-stack engineer. Startup founder at heart and hacker for life!",
  ],
};

export const skills: (Skill | "break")[] = [
  // Development Skills
  { name: "Python • FastAPI • Pydantic", level: 4 },
  { name: "React • TypeScript • Vite", level: 4 },
  { name: "Git • GitHub Action • GitLab", level: 4 },
  { name: "Unit Testing • Pytest • Vitest", level: 4 },
  { name: "NextJS", level: 3 },
  { name: "AI & LLM Products • RAG", level: 3 },
  "break",

  // Cloud & Infrastructure
  { name: "AWS • GCP", level: 4 },
  { name: "Terraform • IaC", level: 4 },
  { name: "Docker • Kubernetes • Helm", level: 4 },
  { name: "Vercel • CloudFlare", level: 4 },
  { name: "Prometheus • Grafana", level: 4 },
  { name: "Databases • PostgreSQL", level: 3 },
  { name: "ArgoCD • GitOps", level: 3 },
  { name: "Networking • VPNs • DNS", level: 3 },
  "break",

  // Operations
  { name: "DevSecOps • SRE", level: 4 },
  { name: "CI/CD", level: 4 },
  { name: "Security & Compliance", level: 4 },
  { name: "Incident Response", level: 4 },
  { name: "Observability • Monitoring", level: 4 },
  "break",

  // Product & Management
  { name: "Product-led Growth • PostHog", level: 4 },
  { name: "Consumer Products", level: 4 },
  { name: "SaaS Products", level: 4 },
  { name: "Real Estate • PropTech", level: 4 },
  { name: "Agile • Project Delivery", level: 3 },
  { name: "Mentoring • Leadership", level: 3 },
];

export const workExperience: WorkExperience[] = [
  {
    company: "Onfido",
    role: "Senior DevOps Engineer",
    period: "Jan 2023 - Jul 2023",
    location: "London (remote), UK",
    description: [
      "Designed and implemented new incident response system, coordinating with senior leadership between support and engineering teams.",
      "Actively involved in incident response for the entire engineering team.",
      "Managed and built Gitlab pipelines.",
      "Managed large AWS infrastructure.",
      "Planned team OKRs and managed team workload via Jira.",
      "Refactored complex Terraform codebase to be modular and easier to use.",
      "Managed several multi-cluster Kubernetes instances over multiple regions.",
      "Active member of several employee resource groups, advocating for cultural change and being a strong ally for people not often in the room.",
      "Advocated for cultural change as a strong ally for people not in the room.",
    ],
  },
  {
    company: "Wayhome",
    role: "Senior DevSecOps Engineer",
    period: "April 2021 - Nov 2022",
    location: "London (remote), UK",
    description: [
      "Built our SRE slack-based incident response system & process.",
      "Lead high-level planning on OKRs, Standards, & Roadmaps.",
      "Lead and coordinated Scrum & Kanban agile work via Jira.",
      "Completely rebuilt our GCP Terraform infrastructure.",
      "Migrated Kubernetes cluster & rewrote from helm -> Terraform + ArgoCD.",
      "Engineered CI/CD tools; CircleCI, Github Actions, Terraform, and more.",
      "Implemented Sentry/Prometheus/Grafana monitoring & tracing for services.",
      "Overhauled database and GCP IAMs for security hardening.",
      "Worked with penetration testers to fully test our software systems.",
      "Built phishing simulation and security awareness program.",
      "Advocated for product changes to reinvent the property market.",
      "Helped conduct customer interviews and other product research.",
      "Helped interview, assess, and hire candidates for roles.",
      "Worked with K8s, Python, Type/JavaScript, React, Nextjs, Netlify, and more.",
    ],
  },
  {
    company: "Reebric",
    role: "Founder",
    period: "Nov 2020 - April 2021",
    location: "Bristol (remote), UK",
    description: [
      "Conducted user interviews with renters, homeowners, & investors.",
      "Heavily researched PropTech market, specifically in the UK.",
      "Built a simple website with React + TypeScript.",
      "Networked with other founders and entrepreneurs.",
    ],
  },
  {
    company: "Webgains",
    role: "DevSecOps Engineer & SRE",
    period: "June 2020 - April 2021",
    location: "Bristol, UK",
    description: [
      "Designed and migrated a new AWS cloud architecture for hardened security.",
      "Built security & automation tools using Python, Ansible, Terraform and Docker.",
      "Implemented proper technical debt and toil accounting practises via Jira.",
      "Started to design & build CI/CD pipelines and other modelled workflows.",
      "Advocated for a customer focused outcome driven approach to working.",
      "Cleaned up a legacy deployment systems with high technical debt.",
      "Managed monitoring & alerting ChatOps-first tools.",
      "Responded to security and technical incidents.",
    ],
  },
  {
    company: "BT",
    role: "Infrastructure Designer/Automation & Build Specialist",
    period: "Oct 2017 - June 2020",
    location: "Bristol, UK",
    description: [
      "Admin of hypervisors (ESXi), vSphere, Linux & Windows systems and more.",
      "Worked with resilient multi-site systems with vastly complex networks.",
      "Worked with Docker & k8s and part-designed telco-ready solutions.",
      "Deployed self-hosted Gitlab, Ansible AWX, Rundeck and customer tools.",
      "Involved in IaC, DevOps practices, Lean Principles, CI/CD and more.",
      "Created automation tools to deliver 5G network functions.",
      "Defined policies, organised events and reformed process.",
      "Designed architectural solutions with multiple vendors for our core network.",
    ],
  },
  {
    company: "EE/BT",
    role: "Graduate Trainee",
    period: "Sep 2015 - Oct 2017",
    location: "Bristol, UK",
    description: [
      "Won first place in a company wide Graduate Event leading to the BT Bus project, a Graduate Recruitment campaign with sponsorship from Directors.",
      "Built a simple Erlang web framework for mobile core network web apps.",
      "Authored the SIM Technology cryptographic key exchange process.",
      "Advocated and lead in an SDN Automation proof of concept.",
      "Created a life-cycle management web app called RAN-Aware for the Radio Area Network team using Laravel.",
      "Built a simple web crawler in Electron & JavaScript for data collection.",
    ],
  },
  {
    company: "Fire Ferrets Limited",
    role: "Director",
    period: "May 2015 - Ongoing",
    location: "Remote",
    description: [
      "Founded a VPN service provider with over 500 customer.",
      "Built website using PHP, Laravel and Vue.js hosted on Digital Ocean.",
      "Built VPN services using Softether based technology.",
      "Taken on various contract work.",
    ],
  },
  {
    company: "West Coast Software",
    role: "Junior Programmer",
    period: "June 2013 - Aug 2014",
    location: "Aberystwyth, UK",
    description: [
      "Rebuilt a gym cycling game with Unity3D and C#. Went from poorly maintained code to a shipped game that is in hundreds of gyms around the world.",
      "Commissioned to build a demo ski game.",
      "Managed Git repositories for the company's source code.",
    ],
  },
  {
    company: "Mappa",
    role: "CTO & Co-Founder",
    period: "Jul 2023 - current",
    location: "London (remote), UK",
    description: [
      "Designed & built Mappa's backend APIs (Python, FastAPI, Pydantic), infrastructure (AWS) and frontend (React, TypeScript, Vite). Lead to > 1000 users with detailed product usage insights.",
      "Got accepted into and attended Geovation's accelerator.",
      "Used React, Typescript, NextJS, Python, FastAPI, ECS, PostgreSQL and more.",
      "Designed our AI product prototypes alongside our AI experts.",
      "Owned product implementation, and tracked all work in ClickUp via Kanban.",
      "Managed individuals and encourage their personal growth.",
      "Worked with the team to get, review, and summarise customer feedback.",
      "Heavily engaged with users via interviews and in-depth analytics with PostHog.",
      "Set up our entire PostHog based analytics platform for the entire company.",
      "Consolidated tech in AWS & Cloudflare, and planed move from AWS to GCP.",
      "Pitched 100s of angels & VCs, fundraised, and investigated grants and schemes with Innovate UK & Catapult.",
      "Collaborate with designers and designed our own website and email UX/UI.",
      "Built alerting and monitoring system with Sentry, Slack, and more.",
    ],
  },
  {
    company: "5DAI",
    role: "Senior Engineer (Contractor)",
    period: "Jan 2025 - Feb 2025",
    location: "London (hybrid), UK",
    description: [
      "Acted as AI solution architect while on-boarding enterprise customers, supporting in meetings and by writing a script to get around roadmap limitations. This led to happily on-boarded users.",
      "Delivered a key product for a big customer while navigating ever-changing feature requirements. This contributed towards the company's roadmap during a turbulent time, potentially helping their big customer to renew.",
      "Mentored less experienced engineers and collaborated with colleagues and executives directly while navigating complex interpersonal company dynamics and nurturing company culture!",
    ],
  },
];

export const certifications: Certification[] = [
  {
    name: "CKAD",
    year: "2022",
  },
  {
    name: "Y Combinator Startup School",
    year: "2021",
  },
  {
    name: "AWS Cloud Practitioner",
    year: "2020",
  },
  {
    name: "GCP Associate Cloud Engineer",
    year: "2019",
  },
];

export const achievements: Achievement[] = [
  {
    title: "Foster Care Survivor",
    description:
      "I'm the first and only foster care kid to go to uni from my county council",
    icon: "🏛️",
  },
  {
    title: "Electrical Engineering",
    description:
      "Built my own keyboard and finished a Mark Rober electrical engineering course, where I built a digital sundial and a Raspberry Pi powered musical keyboard.",
    icon: "🖥️",
  },
  {
    title: "Esports",
    description:
      "Sponsored to play Hearthstone for a year with highest finish being third place at Insomnia. Captain of Aberystwyth University League of Legends team with a 1st place finish at NUEL.",
    icon: "🏆",
  },
];
