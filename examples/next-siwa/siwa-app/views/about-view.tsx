import { Link } from "react-router-dom";

export default function AboutView() {
  return (
    <>
      <section className="w-full py-6 md:py-12 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                About SIWA
              </h1>
              <p className="max-w-[800px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
                A single template that combines the best features of Create
                React App and Create Next App. SIWA provides a seamless
                development experience with built-in features for enhanced
                developer productivity, optimized performance, and seamless
                integration with Next.js.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Easy Setup
              </h2>
              <p className="max-w-[600px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
                SIWA comes with a simple setup process, allowing you to start
                your project with just a few commands. The template is
                pre-configured with the best practices, so you can focus on
                building your app instead of setting up your development
                environment.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Optimized Performance
              </h2>
              <p className="max-w-[600px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
                With SIWA, you get a performant web application out of the box.
                The template is optimized for speed, with features like code
                splitting, lazy loading, and automatic image optimization. Your
                users will enjoy a fast and smooth experience, leading to higher
                engagement and satisfaction.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Seamless Integration with Next.js
              </h2>
              <p className="max-w-[600px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
                SIWA is designed to work seamlessly with Next.js, the popular
                React framework for building web applications. The template
                includes the necessary configurations and customizations to
                leverage the power of Next.js, allowing you to create dynamic,
                SEO-friendly, and fully-featured web apps with ease.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Enhanced Developer Productivity
              </h2>
              <p className="max-w-[600px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
                SIWA provides a set of tools and utilities to streamline the
                development process. With features like hot module replacement,
                integrated testing, and a component library, you can iterate
                quickly, catch errors early, and maintain a consistent UI across
                your app. The template also includes best-in-class libraries and
                packages to help you build modern web applications.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                Features
              </div>
              <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/tight">
                Traffic spikes should be exciting, not scary.
              </h2>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200  bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50   dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
                to="/pricing"
              >
                Contact Sales
              </Link>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="inline-block rounded-lg bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                Security
              </div>
              <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl/relaxed dark:text-zinc-400">
                Fully managed infrastructure designed to scale dynamically with
                your traffic, a global edge to ensure your site is fast for
                every customer, and the tools to monitor every aspect of your
                app.
              </p>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                to="/pricing"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
