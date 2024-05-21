import {
  ArrowRightIcon,
  CheckIcon,
  CodeIcon,
  GlobeIcon,
  LockClosedIcon,
  BoxIcon,
  GearIcon,
  RowsIcon,
  TextIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons";

/* eslint-disable react/no-unescaped-entities */

export default function FeaturesView() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto space-y-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-lime text-lime-foreground px-3 py-1 text-sm">
              Features
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              The Future of Authentication
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl lg:text-2xl dark:text-gray-300">
              SIWA (Sign In With Algorand) combines cutting-edge security with
              seamless integration, providing a superior authentication
              experience. Explore the key features that make SIWA a game-changer
              for decentralized authentication.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8  rounded-lg border hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-lime rounded-full">
                <feature.icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold tracking-tighter mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "EVM Compatibility",
    description:
      "SIWA is designed to be compatible with SIWE (Sign In With Ethereum), allowing developers to integrate Algorand-based authentication into their Ethereum applications effortlessly.",
    icon: CheckIcon,
  },
  {
    title: "EIP-4361 Implementation",
    description:
      "SIWA implements an equivalent of the EIP-4361 standard on Algorand, providing a robust and secure decentralized authentication protocol for web applications.",
    icon: CodeIcon,
  },
  {
    title: "NextJS Support",
    description:
      "SIWA supports NextJS, enabling developers to build fast, scalable, and secure web applications with seamless authentication integration.",
    icon: GlobeIcon,
  },
  {
    title: "Wallet and NFD Integration",
    description:
      "SIWA integrates with popular Algorand wallets and NFD domains, offering users a smooth and secure sign-in experience across various applications.",
    icon: LockOpen1Icon,
  },
  {
    title: "Multi-point Validation",
    description:
      "SIWA validates multiple data points during the sign-in process, ensuring comprehensive security and integrity for user authentication.",
    icon: BoxIcon,
  },
  {
    title: "Enhanced Developer Tools",
    description:
      "SIWA provides robust developer tools, including thorough documentation and integration guides, to streamline the implementation process and support ongoing development.",
    icon: GearIcon,
  },
  {
    title: "Open Source and Community-Driven",
    description:
      "SIWA is open source, encouraging community contributions and transparency. Developers can freely access and contribute to the project, fostering innovation and continuous improvement.",
    icon: RowsIcon,
  },
  {
    title: "Comprehensive Security",
    description:
      "SIWA employs best-in-class security practices, ensuring that user data and authentication processes are secure and protected against threats.",
    icon: LockClosedIcon,
  },
  {
    title: "Scalable and Efficient",
    description:
      "Built on the Algorand blockchain, SIWA offers scalable and efficient authentication, capable of handling high volumes of user sign-ins without compromising performance.",
    icon: ArrowRightIcon,
  },
  {
    title: "Detailed Documentation and Support",
    description:
      "SIWA offers comprehensive documentation, tutorials, and support resources, ensuring developers have the information they need to effectively integrate and use the protocol.",
    icon: TextIcon,
  },
];
