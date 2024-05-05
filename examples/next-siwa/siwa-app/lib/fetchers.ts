import { unstable_cache } from "next/cache";
import prisma from "@/dashboard/lib/prisma";
import { serialize } from "next-mdx-remote/serialize";
import { replaceExamples } from "@/dashboard/lib/remark-plugins";


export async function getMdxSource(postContents: string) {
    // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
    // https://mdxjs.com/docs/what-is-mdx/#markdown
    const content =
      postContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
    // Serialize the content string into MDX
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [() => replaceExamples(prisma)],
      },
    });

    return mdxSource;
  }