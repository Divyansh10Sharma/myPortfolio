/**
 * One place where GSAP plugins are registered.
 *
 * registerPlugin must run before any code uses a plugin's features. Scattering
 * the call across several files creates an invisible ordering dependency: the
 * app works, then someone reorders an import and ScrollTrigger silently stops
 * existing. Importing gsap from here instead makes the registration part of
 * getting hold of gsap at all.
 */

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
