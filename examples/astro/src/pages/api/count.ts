import type { APIRoute } from "astro";

let count = 0;

export const GET: APIRoute = async ({ request }) => {
  const wait = Number(new URL(request.url).searchParams.get("wait") ?? 2000);
  await new Promise((resolve) => setTimeout(resolve, wait));
  return new Response(`${count++}`);
};
