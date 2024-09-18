import type { APIRoute } from "astro";

let count = 0;

export const POST: APIRoute = async ({ url }) => {
  return new Response(`Hello from API: ${count++}`);
};
