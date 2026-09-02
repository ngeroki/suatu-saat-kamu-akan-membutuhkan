/**
 * SUATU SAAT v2 — Main App Bootstrap
 */
import "./style.css";
import { initRouter, onRoute } from "./router";
import { detectDeviceCapabilities } from "./lib/gpu-detect";
import { unlockAudio } from "./lib/audio";
import { CoverScreen } from "./screens/cover";
import { BabListScreen } from "./screens/bab-list";
import { TocScreen } from "./screens/toc";
import { ReaderScreen } from "./screens/reader/reader";

// 1. Initialize DOM container
const device = document.getElementById("device");

if (!device) {
  throw new Error("Target #device container not found!");
}

// 2. Instantiate all screen controllers
const coverScreen = new CoverScreen(device);
const babListScreen = new BabListScreen(device);
const tocScreen = new TocScreen(device);
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
  babListScreen.hide();
  tocScreen.hide();
  readerScreen.hide();

  // Show active screen based on route
  switch (route.name) {
    case "cover":
      coverScreen.show();
      break;
    case "bab":
      babListScreen.show();
      break;
    case "toc":
      tocScreen.show();
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
