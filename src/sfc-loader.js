import * as Vue from "vue";
import * as VueCompilerSfc from "@vue/compiler-sfc";
import * as QuasarAll from "quasar";
import { loadModule } from "vue3-sfc-loader";

// Enable/disable all logging in SFC loader
const ENABLE_SFC_LOGGING = false;

// Logging helper functions
const sfcLog = ENABLE_SFC_LOGGING ? console.log.bind(console) : () => {};
const sfcWarn = ENABLE_SFC_LOGGING ? console.warn.bind(console) : () => {};
const sfcError = ENABLE_SFC_LOGGING ? console.error.bind(console) : () => {};
const sfcDebug = ENABLE_SFC_LOGGING ? console.debug.bind(console) : () => {};

// root where your external .vue files live
const COMPONENTS_ROOT = new URL("/forms/components/", window.location.origin);

const options = {
  moduleCache: {
    vue: Vue,
    "vue/compiler-sfc": VueCompilerSfc,
    quasar: QuasarAll,
  },

  async getFile(url) {
    // allow loader to give us a relative path; make it absolute against components root
    const absUrl = new URL(url, COMPONENTS_ROOT).href;
    const res = await fetch(absUrl, { credentials: "include" });
    if (!res.ok) throw new Error(`${res.status} ${absUrl}`);
    const text = await res.text();
    return { getContentData: () => text };
  },

  addStyle(css) {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
  },

  // IMPORTANT: robust resolver (prevents the destructure crash and resolves ./, ../ and / correctly)
  // pathResolve(arg) {
  //   if (!arg) {
  //     sfcDebug("[resolve] arg is undefined -> null");
  //     return null;
  //   }
  //   const { relPath } = arg;
  //   const isBare =
  //     relPath && !/^(?:\.{0,2}\/|\/|https?:\/\/|file:\/|data:)/.test(relPath);
  //   if (isBare) {
  //     sfcDebug("[resolve] bare:", relPath, "-> null");
  //     return null;
  //   }
  //   const base = arg.parentPath || arg.refPath || location.href;
  //   const out = (() => {
  //     try {
  //       return new URL(relPath, base).href;
  //     } catch {
  //       return relPath;
  //     }
  //   })();
  //   sfcDebug("[resolve] rel:", relPath, "base:", base, "->", out);
  //   return out;
  // },

  babel: window.Babel, // 👈 use the stable standalone

  // let the in-browser parser accept modern syntax if it shows up
  babelParserPlugins: [
    "decorators-legacy",
    "classProperties",
    "classPrivateProperties",
    "classPrivateMethods",
    "dynamicImport",
    "importMeta",
    // add 'topLevelAwait' if you actually use it in any external SFC
    // add 'typescript' ONLY if a <script> in an external SFC really uses TS
  ],
};

// Use this to load any external SFC by filename like "my-form.vue"
function loadExternalSFC(fileName) {
  // construct absolute URL against components root (avoids relative surprises)
  const url = new URL(fileName, COMPONENTS_ROOT).href;
  return Vue.defineAsyncComponent(() => loadModule(url, options));
}

// stable-ish id per URL (for scoped CSS etc.)
function hashId(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return "sfc-" + Math.abs(h).toString(36);
}

// (optional) load @babel/standalone once, for decorator/class transforms
async function ensureBabel() {
  if (window.Babel?.transform) return;
  await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/@babel/standalone/babel.min.js";
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function debugFetchParse(url) {
  const res = await fetch(url);
  const text = await res.text();
  sfcLog("[SFC] first bytes:", text.slice(0, 120).replace(/\s+/g, " "));
  const { descriptor } = VueCompilerSfc.parse(text, { filename: url });
  const id = hashId(url);
  sfcLog("[SFC] id:", id);
  sfcLog("[SFC] blocks:", Object.keys(descriptor));
  sfcLog(
    "[SFC] script lang:",
    descriptor.script?.lang,
    "setup lang:",
    descriptor.scriptSetup?.lang
  );
  return { text, descriptor, id, url };
}

async function debugCompileScript(ctx) {
  const { descriptor, id, url } = ctx;

  // Vue SFC compileScript handles <script setup>, props, etc.
  // We ONLY configure parser plugins so it can parse modern syntax.
  // (No Babel transform step here.)
  let script;
  try {
    script = VueCompilerSfc.compileScript(descriptor, {
      id,
      // Let the parser understand modern JS syntax that might appear.
      // Add/remove items as needed for your repo.
      babelParserPlugins: [
        "decorators-legacy",
        "classProperties",
        "classPrivateProperties",
        "classPrivateMethods",
        "dynamicImport",
        "importMeta",
        // 'topLevelAwait',     // uncomment if you use it
        // 'typescript',        // ONLY if your <script> actually uses TS
        // 'jsx',               // ONLY if you have JSX in <script>
      ],
      // enable reactivity transform if you need it:
      // reactivityTransform: true,
    });

    sfcLog("[SFC] compileScript ok. Imports:", script.imports?.length || 0);
  } catch (e) {
    sfcError("[SFC] compileScript FAILED:", e);
    throw e;
  }

  // ⬇️ Return the compiled script content directly (no Babel transform)
  return { ...ctx, script, scriptCode: script.content };
}

function debugCompileTemplate(ctx) {
  const { descriptor, id, url, script } = ctx;
  if (!descriptor.template) {
    sfcWarn("[SFC] no template block");
    return { ...ctx, renderCode: "" };
  }
  try {
    const tpl = VueCompilerSfc.compileTemplate({
      id,
      filename: url,
      source: descriptor.template.content,
      // pass bindings so the compiler generates correct accesses
      compilerOptions: { bindingMetadata: script?.bindings || {} },
    });
    sfcLog("[SFC] compileTemplate ok. Code length:", tpl.code.length);
    return { ...ctx, renderCode: tpl.code };
  } catch (e) {
    sfcError("[SFC] compileTemplate FAILED:", e);
    throw e;
  }
}

function debugCompileStyles(ctx) {
  const { descriptor, id } = ctx;
  const styles = [];
  for (const s of descriptor.styles || []) {
    try {
      const out = VueCompilerSfc.compileStyle({
        id,
        source: s.content,
        scoped: !!s.scoped,
        // preprocessLang: s.lang, // if you actually used scss/less etc., you can't run that in-browser
      });
      const el = document.createElement("style");
      el.textContent = out.code;
      document.head.appendChild(el);
      styles.push(out.code.length);
    } catch (e) {
      sfcError("[SFC] compileStyle FAILED:", e);
      throw e;
    }
  }
  sfcLog("[SFC] styles injected. Blocks:", styles.length, "lengths:", styles);
  return ctx;
}

// put these once, near your existing imports
window.__debugVueRef = Vue; // from: import * as Vue from 'vue'
window.__debugQuasarRef = QuasarAll; // from: import * as QuasarAll from 'quasar'

function rewriteNamedImportBlock(spec, globalName) {
  // spec: "createVNode as _createVNode, openBlock as _openBlock, h"
  return spec
    .split(",")
    .map((s) => {
      const m = s
        .trim()
        .match(/^([A-Za-z$_][\w$]*)(?:\s+as\s+([A-Za-z$_][\w$]*))?$/);
      if (!m) return ""; // skip weird tokens
      const orig = m[1];
      const alias = m[2] || orig;
      return `const ${alias} = ${globalName}.${orig};`;
    })
    .filter(Boolean)
    .join("\n");
}

function replaceBareImport(code, moduleName, globalName) {
  // named imports → const alias = Global.orig;
  code = code.replace(
    new RegExp(
      `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${moduleName}['"]\\s*;?`,
      "g"
    ),
    (_, spec) => rewriteNamedImportBlock(spec, globalName)
  );
  // default import → const Local = Global;
  code = code.replace(
    new RegExp(
      `import\\s+([A-Za-z$_][\\w$]*)\\s+from\\s*['"]${moduleName}['"]\\s*;?`,
      "g"
    ),
    (_, local) => `const ${local} = ${globalName};`
  );
  return code;
}

function rewriteBareImportsToGlobals(code) {
  code = replaceBareImport(code, "vue", "Vue");
  code = replaceBareImport(code, "quasar", "QuasarAll");
  return code;
}

async function debugLinkAndEval(ctx) {
  let { scriptCode, renderCode, id, url } = ctx;

  // 0) make globals visible inside the blob
  const prolog = `
const Vue = window.__debugVueRef;
const QuasarAll = window.__debugQuasarRef;
`;

  // 1) rewrite bare imports in both script & render chunks
  scriptCode = rewriteBareImportsToGlobals(scriptCode);
  renderCode = renderCode ? rewriteBareImportsToGlobals(renderCode) : "";

  // 2) normalize default export
  const rewritten = VueCompilerSfc.rewriteDefault(scriptCode, "__sfc__");

  // 3) compose final ESM
  const glue = `
${prolog}
/* === SCRIPT (${url}) === */
${rewritten}

/* === RENDER (${url}) === */
${renderCode || ""}

if (typeof render !== 'undefined') {
  __sfc__.render = render;
}
__sfc__.__scopeId = "data-v-${id}";
__sfc__.__file = "${url}";

export default __sfc__;
//# sourceURL=${url}?sfc-blob
`;

  const blob = new Blob([glue], { type: "text/javascript" });
  const blobUrl = URL.createObjectURL(blob);
  try {
    const mod = await import(/* @vite-ignore */ blobUrl);
    URL.revokeObjectURL(blobUrl);
    sfcLog("[SFC] ESM evaluated. Keys:", Object.keys(mod));
    return mod.default || mod;
  } catch (e) {
    sfcError("[SFC] ESM import FAILED:", e);
    sfcDebug("[SFC glue full]", glue.split("\n").slice(0, 200).join("\n"));
    throw e;
  }
}

async function debugLoadSFC(url) {
  try {
    sfcLog("=== DEBUG LOAD SFC ===", url);
    const p = await debugFetchParse(url);
    const s = await debugCompileScript(p);
    const t = debugCompileTemplate(s);
    debugCompileStyles(t);
    const comp = await debugLinkAndEval(t);
    sfcLog("✅ Component ready:", comp);
    return comp;
  } catch (e) {
    sfcError("❌ Debug load failed:", e);
    throw e;
  }
}

export async function loadExtSFC(url) {
  //TODO: Need to be fixed and the workaround `debugLoadSFC` removed
  // return await loadExternalSFC("/forms/components/" + url);
  return debugLoadSFC("/forms/components/" + url);
}
