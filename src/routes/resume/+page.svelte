<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import Entry from "./Entry.svelte";

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const parse = (ym: string) => ym.split("-").map(Number) as [number, number];

  function label(ym: string): string {
    const [y, m] = parse(ym);
    return `${MONTHS[m - 1]} ${y}`;
  }

  /** LinkedIn-style tenure: inclusive month count, e.g. "2 yrs 7 mos". */
  function tenure(from: string, to?: string): string {
    const [y1, m1] = parse(from);
    const now = new Date();
    const [y2, m2] = to ? parse(to) : [now.getFullYear(), now.getMonth() + 1];
    const total = (y2 - y1) * 12 + (m2 - m1) + 1;
    const yrs = Math.floor(total / 12);
    const mos = total % 12;
    return [
      yrs ? `${yrs} yr${yrs > 1 ? "s" : ""}` : "",
      mos ? `${mos} mo${mos > 1 ? "s" : ""}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  const work = [
    {
      company: "BlackRock",
      url: "https://www.blackrock.com/",
      role: "AI & ML Engineer II",
      location: "Philadelphia, PA",
      start: "2024-05",
    },
    {
      company: "Tesla",
      url: "https://www.tesla.com/",
      role: "Software Engineer",
      location: "Fremont, CA",
      start: "2024-01",
      end: "2024-05",
    },
    {
      company: "Homebase (YC W21)",
      url: "https://homebase.com.vn/homepage/",
      role: "Software Engineer",
      location: "Ho Chi Minh City",
      start: "2023-06",
      end: "2023-09",
    },
    {
      company: "Heron Systems (now Shield AI)",
      url: "https://shield.ai/",
      role: "Machine Learning Engineer",
      location: "Alexandria, VA",
      start: "2021-05",
      end: "2021-08",
    },
  ];

  const research = [
    {
      company: "Sanghani Center for AI & Data Analytics",
      url: "https://sanghani.cs.vt.edu/",
      role: "Graduate Research Assistant",
      location: "Falls Church, VA",
      start: "2023-04",
      end: "2023-12",
    },
    {
      company: "Terrestrial Robotics Engineering & Controls Lab",
      url: "https://news.vt.edu/art/2023/july/doodle-july-12-2023.html",
      role: "Research Assistant",
      location: "Blacksburg, VA",
      start: "2021-09",
      end: "2022-05",
    },
    {
      company: "Commonwealth Cyber Initiative",
      url: "https://cyberinitiative.org/",
      role: "Graduate Research Assistant",
      location: "Arlington, VA",
      start: "2021-05",
      end: "2022-08",
    },
    {
      company: "geoLab",
      url: "https://geolab.wm.edu/",
      role: "Machine Learning Researcher",
      location: "Williamsburg, VA",
      start: "2020-09",
      end: "2021-05",
    },
    {
      company: "Integrated Systems Design",
      url: "https://ece.vt.edu/undergrad/courses/2804.html",
      role: "Teaching Assistant",
      location: "Blacksburg, VA",
      start: "2020-09",
      end: "2021-05",
    },
    {
      company: "Hybrid Electric Vehicle Team",
      url: "https://news.vt.edu/videos/k/2025/04/1_l9qj6mu7.html",
      role: "Research Assistant",
      location: "Blacksburg, VA",
      start: "2020-09",
      end: "2021-05",
    },
    {
      company: "Wireless Lab",
      url: "https://wireless.vt.edu/index.html",
      role: "Research Assistant",
      location: "Blacksburg, VA",
      start: "2020-05",
      end: "2020-08",
    },
  ];

  const education = [
    {
      degree: "M.S. in Computer Engineering (Machine Learning)",
      years: "2022 – 2024",
      courses: [
        "Deep Learning",
        "Reinforcement Learning",
        "Trustworthy Machine Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Scalable System Design",
      ],
    },
    {
      degree: "B.S. in Computer Engineering, minor in Computer Science",
      years: "2018 – 2022",
      courses: [
        "Machine Learning",
        "Data Analytics & Visualization",
        "Software Engineering",
        "Data Structures & Algorithms",
        "Computer Architecture",
        "Embedded Systems",
      ],
    },
  ];

  const awards = [
    {
      title: "Turing Fellowship",
      org: "Commonwealth Cyber Initiative",
      year: "2021",
    },
    { title: "Geo Fellowship", org: "William & Mary geoLab", year: "2020" },
  ];
</script>

<Seo
  title="Minh Nguyen – Resume"
  description="Software engineer, researcher, and builder. Platform Engineering at BlackRock."
/>

<section class="layout-md py-12">
  <h2 class="heading2">Professional Work</h2>
  <div class="grid gap-y-4">
    {#each work as w}
      <Entry
        title={w.company}
        href={w.url}
        meta="{label(w.start)} – {w.end ? label(w.end) : 'Present'}"
        subtitle="{w.role}, {w.location}"
        aside={tenure(w.start, w.end)}
      />
    {/each}
  </div>
</section>

<section class="layout-md py-12">
  <h2 class="heading2">Research and Teaching</h2>
  <div class="grid gap-y-4">
    {#each research as r}
      <Entry
        title={r.company}
        href={r.url}
        meta="{label(r.start)} – {r.end ? label(r.end) : 'Present'}"
        subtitle="{r.role}, {r.location}"
        aside={tenure(r.start, r.end)}
      />
    {/each}
  </div>
</section>

<section class="layout-md py-12">
  <h2 class="heading2">Education</h2>
  <div class="grid gap-y-6">
    {#each education as e}
      <div>
        <Entry
          title="Virginia Tech"
          href="https://www.vt.edu/"
          meta={e.years}
          subtitle={e.degree}
        />
        <p class="mt-1 text-sm tracking-wide text-neutral-500 leading-relaxed">
          {e.courses.join(" · ")}
        </p>
      </div>
    {/each}
  </div>
</section>

<section class="layout-md py-12">
  <h2 class="heading2">Awards and Honors</h2>
  <div class="grid gap-y-4">
    {#each awards as a}
      <Entry title={a.title} meta={a.year ?? ""} subtitle={a.org} />
    {/each}
  </div>
</section>
