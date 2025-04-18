import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { nanoid } from "@/dashboard/lib/utils";

// Initiate Redis instance by connecting to REST URL
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds by default
export const ratelimit = (
  requests: number = 10,
  seconds:
    | `${number} ms`
    | `${number} s`
    | `${number} m`
    | `${number} h`
    | `${number} d` = "10 s",
) => {
  return new Ratelimit({
    redis: new Redis({
      url:
        process.env.RATELIMIT_UPSTASH_REDIS_REST_URL ||
        process.env.UPSTASH_REDIS_REST_URL ||
        "",
      token:
        process.env.RATELIMIT_UPSTASH_REDIS_REST_TOKEN ||
        process.env.UPSTASH_REDIS_REST_TOKEN ||
        "",
    }),
    limiter: Ratelimit.slidingWindow(requests, seconds),
    analytics: true,
    prefix: "algostack",
  });
};

// only for xspace.nexus public demo
export async function setRandomKey(
  url: string,
): Promise<{ response: string; key: string }> {
  /* recursively set link till successful */
  const key = nanoid();
  const response = await redis.set(
    `algostack.siwa.org:${key}`,
    {
      url,
    },
    {
      nx: true,
      ex: 30 * 60, // 30 minutes
    },
  );
  if (response !== "OK") {
    // by the off chance that key already exists
    return setRandomKey(url);
  } else {
    return { response, key };
  }
}

/**
 * Recording metatags that were generated via `/api/edge/metatags`
 * If there's an error, it will be logged to a separate redis list for debugging
 **/
export async function recordMetatags(url: string, error: boolean) {
  if (url === "https://github.com/headline-design/algostack") {
    // don't log metatag generation for default URL
    return null;
  } else {
    return await redis.lpush(error ? "metatags-errors" : "metatags", {
      url,
    });
  }
}
