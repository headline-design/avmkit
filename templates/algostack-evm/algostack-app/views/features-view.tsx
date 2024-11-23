/* eslint-disable react/no-unescaped-entities */

const FeaturesView = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container space-y-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
              Features
            </div>
            <h2 className="text-3xl font-bold  sm:text-5xl">
              The best of both worlds
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              AlgoStack SSR combines the best features of Algorand and
              Create Next App to provide a seamless experience for building
              SSR applications. Let's explore the key
              functionalities and advantages of AlgoStack SSR.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-12 px-4 md:gap-16 md:px-6 lg:gap-20">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">Easy Setup</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AlgoStack SSR offers a seamless setup process, combining the best of
                Algorand and Create Next App. It provides a smooth
                onboarding experience for developers, allowing them to quickly
                start building SSR apps.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">Next.js Integration</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AlgoStack SSR leverages the power of Next.js, a popular React
                framework, to create high-performance apps. Next.js provides
                server-side rendering (SSR), automatic code splitting, and
                seamless API integration, enabling developers to build fast,
                SEO-friendly applications.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">React Ecosystem</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                With AlgoStack SSR, you have access to the extensive React
                ecosystem, including the vast library of React components and
                utilities. Developers can easily integrate third-party libraries
                and leverage the React community to enhance their applications.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">Tailwind CSS</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AlgoStack SSR comes pre-configured with Tailwind CSS, a
                utility-first CSS framework. Tailwind CSS enables developers to
                rapidly build beautiful and responsive user interfaces without
                writing custom CSS. It provides a wide range of ready-to-use
                utility classes, making styling a breeze.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">
                Hot Module Replacement (HMR)
              </h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AlgoStack SSR supports HMR, allowing developers to see instant
                changes in the browser without losing the application's current
                state. This feature significantly speeds up the development
                process, making it easier to iterate and test changes.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">Optimized Build</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AlgoStack SSR optimizes the build process, ensuring that the
                generated production-ready code is efficient and optimized for
                performance. This results in faster load times and a better user
                experience for your SSR applications.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">SEO-friendly</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                With Next.js's built-in SSR capabilities, AlgoStack SSR enables
                developers to create apps that are search engine optimized. This
                means that your application will have better visibility and
                higher rankings in search engine results.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">Customizable Templates</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AlgoStack SSR provides a variety of customizable templates to
                kickstart your project. These templates cover common use cases
                and save developers valuable time by providing a solid
                foundation to build upon.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">Developer Tools</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AlgoStack SSR integrates with popular developer tools such as ESLint
                and Prettier, ensuring code quality and consistency. It also
                provides a smooth debugging experience with the built-in Next.js
                DevTools.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold ">Documentation and Support</h3>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AlgoStack SSR offers comprehensive documentation and support
                resources, including tutorials, guides, and a vibrant community
                forum. Developers can easily find answers to their questions and
                get help when needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesView;
