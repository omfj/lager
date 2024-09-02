import { createResource } from "../../../../packages/lager/src/store";

export const resourceStore = createResource<string>(async () => {
  return await fetch("http://localhost:4321/api").then((res) => res.text());
});
