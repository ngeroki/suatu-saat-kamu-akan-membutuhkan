/**
 * SUATU SAAT v2 — Lightweight Hash Router
 * Routes: #/ | #/bab | #/toc | #/read/:chap/:page | #/spread/:chap/:page | #/immersive/:chap/:page
 */

export interface RouteParams {
  chap?: number | string;
  chapter?: number | string;
  page?: number | string;
}

export type RouteName = "cover" | "prolog" | "epilog" | "bab" | "toc" | "read" | "spread" | "immersive";

export interface Route {
  name: RouteName;
  params: RouteParams;
}

type RouteHandler = (route: Route) => void;

const handlers: RouteHandler[] = [];

function parseRoute(hash: string): Route {
  const clean = hash.replace(/^#\/?/, "");
  const parts = clean.split("/");

  if (!clean || clean === "") return { name: "cover", params: {} };
  if (clean === "prolog") return { name: "prolog", params: {} };
  if (clean === "epilog") return { name: "epilog", params: {} };
  if (clean === "bab") return { name: "bab", params: {} };
  if (clean === "toc") return { name: "toc", params: {} };

  const [name, chapStr, pageStr] = parts;
  const chap = chapStr ? parseInt(chapStr, 10) : undefined;
  const page = pageStr ? parseInt(pageStr, 10) : undefined;

  if (name === "read") return { name: "read", params: { chap: chap ?? 1, page: page ?? 1 } };
  if (name === "spread") return { name: "spread", params: { chap: chap ?? 1, page: page ?? 1 } };
  if (name === "immersive") return { name: "immersive", params: { chap: chap ?? 1, page: page ?? 1 } };

  return { name: "cover", params: {} };
}

export function navigate(name: RouteName, params: RouteParams = {}): void {
  const chapNum = params.chap ?? params.chapter ?? 1;
  const pageNum = params.page ?? 1;

  let hash = "#/";
  if (name === "prolog") hash = "#/prolog";
  else if (name === "epilog") hash = "#/epilog";
  else if (name === "bab") hash = "#/bab";
  else if (name === "toc") hash = "#/toc";
  else if (name === "read") hash = `#/read/${chapNum}/${pageNum}`;
  else if (name === "spread") hash = `#/spread/${chapNum}/${pageNum}`;
  else if (name === "immersive") hash = `#/immersive/${chapNum}/${pageNum}`;

  window.location.hash = hash;
}

export function onRoute(handler: RouteHandler): void {
  handlers.push(handler);
}

export function currentRoute(): Route {
  return parseRoute(window.location.hash);
}

export function initRouter(): void {
  const dispatch = () => {
    const route = parseRoute(window.location.hash);
    handlers.forEach(h => h(route));
  };

  window.addEventListener("hashchange", dispatch);
  // Fire on init
  dispatch();
}
