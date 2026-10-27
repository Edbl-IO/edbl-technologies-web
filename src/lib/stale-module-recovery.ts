// A browser tab that was already open when the app's modules changed (a
// dependency update, a rebuild, a redeploy) can end up loading some files from
// the old graph and some from the new one. Two copies of React in one page
// leaves the hooks dispatcher null, so the very first useState call throws
// "Cannot read properties of null (reading 'useState')" and the screen goes
// blank. Nothing in the page can repair that mismatch — only a full document
// reload can — so this module notices the signature and reloads once.

const RELOAD_FLAG = "edbl-stale-module-reload";

// A hooks dispatcher that is null, or a chunk that is no longer on the server,
// both mean "this tab's module graph is out of date".
const STALE_PATTERNS = [
  /reading 'use[A-Z]\w*'/,
  /Cannot read properties of undefined \(reading 'useState'\)/,
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Unable to preload CSS/i,
];

export function isStaleModuleError(message: string | undefined): boolean {
  if (!message) return false;
  return STALE_PATTERNS.some((pattern) => pattern.test(message));
}

// Reload at most once per tab, so a failure that survives the reload can never
// turn into a reload loop. Storage that is unavailable means no reload: the
// root error screen stays the fallback.
function claimReload(): boolean {
  try {
    if (sessionStorage.getItem(RELOAD_FLAG)) return false;
    sessionStorage.setItem(RELOAD_FLAG, "1");
    return true;
  } catch {
    return false;
  }
}

export function clearReloadFlag(): void {
  try {
    sessionStorage.removeItem(RELOAD_FLAG);
  } catch {
    // Storage unavailable: there is nothing to clear.
  }
}

function reloadOnce(): void {
  if (claimReload()) window.location.reload();
}

if (typeof window !== "undefined") {
  // Vite fires this when a lazily loaded route chunk can no longer be fetched.
  window.addEventListener(
    "vite:preloadError",
    (event) => {
      event.preventDefault();
      reloadOnce();
    },
    { capture: true },
  );

  window.addEventListener("error", (event) => {
    if (isStaleModuleError(event.message)) reloadOnce();
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message =
      typeof reason === "string" ? reason : reason instanceof Error ? reason.message : "";
    if (isStaleModuleError(message)) reloadOnce();
  });

  // Once the page has been alive and healthy for a moment, allow recovery
  // again if the graph goes stale later in the same tab.
  window.setTimeout(clearReloadFlag, 5000);
}
