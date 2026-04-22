globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BgPMITeR.mjs";
import { r as renderTemplate, l as renderSlot, n as renderHead } from "./worker-entry_DysXgCnK.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = "SHUEI KOMURO | PORTFOLIO" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="ja"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><!-- Lucide Icons --><script src="https://unpkg.com/lucide@latest"><\/script><!-- Google Fonts --><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap" rel="stylesheet">', '</head> <body class="bg-[#FAFAFA] text-black font-sans selection:bg-black selection:text-white overflow-x-hidden"> ', " </body></html>"])), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/shuei/Documents/MyPortfolio/src/layouts/BaseLayout.astro", void 0);
export {
  $$BaseLayout as $
};
