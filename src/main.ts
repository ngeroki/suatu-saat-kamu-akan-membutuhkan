/**
 * SUATU SAAT v2 — Main App Bootstrap
 */
import "./style.css";
import { initRouter, onRoute } from "./router";
import { detectDeviceCapabilities } from "./lib/gpu-detect";
import { unlockAudio } from "./lib/audio";
import { CoverScreen } from "./screens/cover";
import { PrologScreen } from "./screens/prolog";
import { EpilogScreen } from "./screens/epilog";
import { BabListScreen } from "./screens/bab-list";
import { ReaderScreen } from "./screens/reader/reader";

// 1. Initialize DOM container
const device = document.getElementById("device");

if (!device) {
  throw new Error("Target #device container not found!");
}

// 2. Instantiate all screen controllers
const coverScreen = new CoverScreen(device);
const prologScreen = new PrologScreen(device);
const epilogScreen = new EpilogScreen(device);
const babListScreen = new BabListScreen(device);
const readerScreen = new ReaderScreen(device);

// 3. Unlock Web Audio API on first touch/click interaction
document.addEventListener("pointerdown", unlockAudio, { once: true });

// 4. Probe GPU / Device Capabilities (warm-up cache)
const caps = detectDeviceCapabilities();
console.log(`[SUATU SAAT v2] Device tier: ${caps.tier}, recommended render mode: ${caps.recommendedMode}`);

// 5. Connect Router to Screen Controller Lifecycle
onRoute((route) => {
  // Hide all screens
  coverScreen.hide();
  prologScreen.hide();
  epilogScreen.hide();
  babListScreen.hide();
  readerScreen.hide();

  // Show active screen based on route
  switch (route.name) {
    case "cover":
      coverScreen.show();
      break;
    case "prolog":
      prologScreen.show();
      break;
    case "epilog":
      epilogScreen.show();
      break;
    case "bab":
    case "toc":
      babListScreen.show(route);
      break;
    case "read":
    case "spread":
    case "immersive":
      readerScreen.show(route);
      break;
    default:
      coverScreen.show();
      break;
  }
});

// 6. Start Hash Router
initRouter();

// 7. Desktop Mobile-First Notice Controller
const desktopNotice = document.getElementById("desktop-notice");
const dnCloseBtn = document.getElementById("dn-close-btn");

if (desktopNotice && dnCloseBtn) {
  try {
    if (sessionStorage.getItem("suatu_saat_desktop_notice_dismissed") === "true") {
      desktopNotice.classList.add("dismissed");
    }
  } catch (_) {}

  dnCloseBtn.addEventListener("click", () => {
    desktopNotice.classList.add("dismissed");
    try {
      sessionStorage.setItem("suatu_saat_desktop_notice_dismissed", "true");
    } catch (_) {}
  });
}

