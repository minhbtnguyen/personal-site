/* ==========================================================================
   SITE-WIDE CONTENT
   Projects live in src/content/projects/*.yaml and experiments in
   src/content/experiments/<id>/index.mdx. Everything else on the site is set here.
   ========================================================================== */

export interface Link { label: string; url: string }

export const SHOW_DRAFTS = false; // set to true locally to preview experiments and projects marked `publish: Draft`
export const XP_VISIBLE = 5;      // experience rows shown before the "Show all" button
export const XP_VISIBLE_PHONE = 3;     // the same, on phones (a shorter home page)
export const SKILLS_VISIBLE_PHONE = 2; // skill groups shown on phones before "Show all skills"

export const SITE = {
  owner: {
    name: 'Minh Nguyen',
    initials: 'MN',
    email: 'minhbtnguyen.work@gmail.com',
    role: 'Engineering',
    company: 'BlackRock',
    location: 'Philadelphia, PA',
    openTo: 'Open to Bay Area, Seattle, Redmond, New York, and Boston', // optional; set to '' to hide
    /* Put the file in public/ and give its name, e.g. 'resume.pdf'. Empty hides
       every Resume link. An http(s) URL also works. */
    resume: '',
    /* A file in src/assets/, e.g. 'headshot.jpg' (resized and served as WebP).
       Empty shows an initials monogram. */
    photo: 'photo.jpeg',
    links: [
      { label: 'GitHub', url: 'https://github.com/minhbtnguyen' },
      { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=9Pg_ZTgAAAAJ&hl=en' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/minhbtnguyen/' }
    ] as Link[]
  },

  home: {
    headline: 'Production ML, end to end.',
    intro: 'Research · Agentic AI · MLOps · Product',
    featuredTitle: 'Projects.',
    latestTitle: 'Lab.'
  },

  projectsPage: {
    title: 'Projects.',
    intro: 'Things I have built, and what I learned.'
  },

  labPage: {
    title: 'Lab.',
    intro: 'Experiments log.'
  },

  about: {
    statement: 'At BlackRock since 2024, building ML and agentic systems for finance. Before that: Tesla, Homebase (YC), Shield AI and ML research labs.', // optional; set to '' to remove
    link: { label: 'Full experience on LinkedIn', url: 'https://www.linkedin.com/in/minhbtnguyen/' } as Link | undefined
  },

  /* Compact timeline in the About section, beside Skills. Dates as 'YYYY-MM'
     (or just 'YYYY'). Leave `end` empty for a current role. Rows sort
     automatically, most recent first. Empty the list to hide the section. */
  experienceTitle: 'Experience',
  experience: [
    { role: 'AI & ML Engineer II', org: 'BlackRock', team: 'Platform Engineering', location: 'Philadelphia, PA', start: '2024-05', end: '' },
    { role: 'Software Engineer', org: 'Tesla', team: 'Automation & Data Systems', location: 'Fremont, CA', start: '2024-01', end: '2024-05' },
    { role: 'Graduate Research Assistant', org: 'Virginia Tech', team: 'Sanghani Center for AI & Data Analytics', location: 'Falls Church, VA', start: '2023-04', end: '2023-12' },
    { role: 'Software Engineer', org: 'Homebase (YC W21)', location: 'Ho Chi Minh City, Vietnam', start: '2023-06', end: '2023-09' },
    { role: 'Graduate Research Assistant', org: 'Virginia Tech', team: 'Commonwealth Cyber Initiative', location: 'Arlington, VA', start: '2021-05', end: '2022-08' },
    { role: 'Research Assistant', org: 'Virginia Tech', team: 'Terrestrial Robotics Engineering & Controls Lab', location: 'Blacksburg, VA', start: '2021-09', end: '2022-05' },
    { role: 'Machine Learning Engineer', org: 'Shield AI', team: 'Gamebreaker', location: 'Alexandria, VA', start: '2021-05', end: '2021-08' },
    { role: 'Research Assistant', org: 'William & Mary', team: 'geoLab', location: 'Williamsburg, VA', start: '2020-09', end: '2021-05' },
    { role: 'Research Assistant', org: 'Virginia Tech', team: 'Hybrid Electric Vehicle Team', location: 'Blacksburg, VA', start: '2020-09', end: '2021-05' },
    { role: 'Teaching Assistant', org: 'Virginia Tech', team: 'ECE Department', location: 'Blacksburg, VA', start: '2020-09', end: '2021-05' },
    { role: 'Research Assistant', org: 'Virginia Tech', team: 'Wireless Lab', location: 'Blacksburg, VA', start: '2020-05', end: '2020-08' }
  ] as { role: string; org: string; team?: string; location?: string; start: string; end: string }[],

  /* Grouped list in the About section, beside Experience. Empty the list to hide it. */
  skillsTitle: 'Skills',
  /* Highlighted in the list: the core skills for ML engineering roles. Names
     must match items below exactly. */
  keySkills: ['PyTorch', 'MLflow', 'ML Inference', 'ONNX Runtime', 'Triton Inference Server', 'vLLM', 'LLMs', 'RAG', 'Multi-Agent Orchestration', 'LangChain', 'LangGraph', 'Python', 'C++', 'SQL', 'FastAPI', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Grafana', 'Snowflake', 'Airflow'],
  skills: [
    { group: 'AI / ML', items: ['PyTorch', 'TensorFlow', 'MLflow', 'ML Inference', 'ONNX Runtime', 'TensorRT', 'Triton Inference Server', 'vLLM', 'Quantization'] },
    { group: 'Agentic AI', items: ['LLMs', 'RAG', 'Multi-Agent Orchestration', 'LangGraph', 'LangChain'] },
    { group: 'Backend', items: ['Python', 'Go', 'C++', 'Rust', 'SQL', 'FastAPI', 'Celery', 'Flask'] },
    { group: 'Frontend', items: ['Streamlit', 'Dash', 'ReactJS'] },
    { group: 'Cloud & DevOps', items: ['AWS', 'Azure', 'ADK', 'Kubernetes', 'Docker', 'CI/CD', 'Grafana', 'Jenkins'] },
    { group: 'Data', items: ['Snowflake', 'Airflow', 'PostgreSQL', 'Redis', 'MySQL', 'MSSQL', 'InfluxDB', 'Power BI'] },
    { group: 'AI Tooling', items: ['Claude Code', 'GitHub Copilot'] }
  ],

  contact: {
    headline: 'Get in touch.',
    body: 'Email is the fastest way to reach me.',
    cta: 'Email me'
  }
};
