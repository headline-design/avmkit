import {
  IconGithub,
  IconNext,
  IconNextAuth,
  IconPrisma,
  IconRedis,
  IconRedux,
  IconSupabase,
} from "./feature-icons";

export const FeatureSection2 = () => {
  const features = [
    {
      title: "Redux",
      description: "A Predictable State Container for JS Apps",
      link: "https://redux.js.org",
      githubLink: "https://github.com/reduxjs/redux",
      icon: <IconRedux />,
      class1:
        "inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-blue-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10",
      class2:
        "border border-blue-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-zinc-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-blue-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-zinc-950",
    },
    {
      title: "Next.js",
      description: "The React Framework for Production Applications",
      link: "https://nextjs.org",
      githubLink: "https://github.com/vercel/next.js",
      icon: <IconNext />,
      class1:
        "inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-zinc-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10",
      class2:
        "border border-zinc-500/10 flex relative *:relative *:size-6 *:m-auto  text-zinc-950 dark:text-white size-12 rounded-lg dark:bg-zinc-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-zinc-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-zinc-950",
    },
    {
      title: "Supabase",
      description:
        "The Open Source Firebase Alternative with Realtime and RESTful APIs",
      link: "https://supabase.io",
      githubLink: "https://github.com/supabase/supabase",
      icon: <IconSupabase />,
      class1:
        "inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-green-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10",
      class2:
        "border border-green-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-zinc-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-green-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-zinc-950",
    },
    {
      title: "Prisma",
      description:
        "Next-generation ORM for Node.js and TypeScript with better performance",
      link: "https://prisma.io",
      githubLink: "https://github.com/prisma/prisma",
      icon: <IconPrisma />,
      class1:
        "inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-sky-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10",
      class2:
        "border border-sky-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-zinc-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-sky-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-zinc-950",
    },
    {
      title: "Redis",
      description:
        "An in-memory database that persists on disk provided by Upstash",
      link: "https://upstash.com",
      githubLink: "https://github.com/upstash/redis-js",
      icon: <IconRedis />,
      class1:
        "inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-red-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10",
      class2:
        "border border-red-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-zinc-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-red-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-zinc-950",
    },
    {
      title: "NextAuth",
      description:
        "Next.js authentication w/ built-in support for SIWA via Cred. Provider",
      link: "https://next-auth.js.org",
      githubLink: "https://github.com/nextauthjs/next-auth",
      icon: <IconNextAuth />,
      class1:
        "inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-yellow-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10",
      class2:
        "border border-yellow-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-zinc-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-yellow-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-zinc-950",
    },
  ];

  const FeatureCard = ({ item }: { item?: any }) => {
    return (
      <div className="relative group overflow-hidden p-8 border ">
        <div aria-hidden="true" className={item.class1} />
        <div className="relative">
          <div className={item.class2}>{item.icon}</div>
          <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
            <p className="text-zinc-700 dark:text-zinc-300">
              {item.description}
            </p>
          </div>
          <div className="flex gap-3 -mb-8 py-4 border-t">
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="group  disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-zinc-950 disabled:border/50 disabled:bg-zinc-100 dark:disabled:border disabled:dark:bg-zinc-900 dark:*:disabled:!text-white text-zinc-950 bg-zinc-100 hover:bg-zinc-200/75 active:bg-zinc-100 dark:text-white dark:bg-zinc-500/10 dark:hover:bg-zinc-500/15 dark:active:bg-zinc-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center"
            >
              <span>Learn more</span>
            </a>
            <a
              href={item.githubLink}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center  disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-zinc-950 disabled:border-zinc-200 disabled:bg-zinc-100 dark:disabled:border-zinc-800/50 disabled:dark:bg-zinc-900 dark:*:disabled:!text-white text-zinc-950 bg-zinc-100 hover:bg-zinc-200/75 active:bg-zinc-100 dark:text-white dark:bg-zinc-500/10 dark:hover:bg-zinc-500/15 dark:active:bg-zinc-500/10 size-8 justify-center"
            >
              <span className="sr-only">Source Code</span>
              <IconGithub />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* component */}
      <section>
        <div className="py-16">
          <div className="mx-auto px-6 max-w-6xl text-zinc-500">
            <div className="text-center">
              <h2 className="text-3xl text-foreground font-semibold">
                Featured Integrations
              </h2>
              <p className="mt-6 text-muted-foreground">
                The SIWA landing page and boilerplate app are jam-packed with
                key integrations and services to help you get started quickly.
              </p>
            </div>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((item, index) => (
                <FeatureCard key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
