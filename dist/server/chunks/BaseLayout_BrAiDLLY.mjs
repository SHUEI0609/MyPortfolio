globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_4FgfMSSv.mjs";
import { r as renderTemplate, l as renderSlot, n as renderHead, g as addAttribute } from "./worker-entry_wFVmvASI.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "SHUEI KOMURO | PORTFOLIO",
    description = "AI Engineer & EdTech × Art Researcher。大阪公立大学高専 知能情報コース所属。Go・Python・TypeScriptを用いたAI開発とWebアプリケーション開発を行っています。",
    ogImage = "/image/mine.jpg"
  } = Astro2.props;
  const canonicalURL = Astro2.url;
  return renderTemplate(_a || (_a = __template(['<html lang="ja"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><!-- SEO --><meta name="description"', '><meta name="author" content="SHUEI KOMURO"><meta name="keywords" content="AI Engineer, EdTech, Deep Learning, TypeScript, Go, Python, Portfolio, 小室颯英"><link rel="canonical"', '><!-- Open Graph / SNS --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:locale" content="ja_JP"><meta property="og:site_name" content="SHUEI KOMURO | PORTFOLIO"><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Lucide Icons --><script src="https://unpkg.com/lucide@latest"><\/script><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap" rel="stylesheet">', '</head> <body class="bg-[#FAFAFA] text-black font-sans selection:bg-black selection:text-white overflow-x-hidden"> ', " </body></html>"])), title, addAttribute(description, "content"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/shuei/Documents/MyPortfolio/src/layouts/BaseLayout.astro", void 0);
export {
  $$BaseLayout as $
};
