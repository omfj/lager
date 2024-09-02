import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return new Response("Hello from API");
};
