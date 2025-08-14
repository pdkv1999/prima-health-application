export function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function renderTemplate(html: string, data: any, opts?: { highlightDynamic?: boolean }) {
  function escapeHtml(str: string) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function maybeWrapHighlight(str: string, fieldPath?: string) {
    if (opts && opts.highlightDynamic) {
      const clickHandler = fieldPath ? `onclick="window.navigateToField('${fieldPath}')"` : '';
      return `<span class="autofill-highlight cursor-pointer hover:bg-yellow-300" ${clickHandler}>${str}</span>`;
    }
    return str;
  }

  function listHtml(arr: any[]) {
    return maybeWrapHighlight(`<li>${arr.map((x) => escapeHtml(String(x))).join("</li><li>")}</li>`);
  }

  const re = /\{\{([^}]+)\}\}/g;
  return html.replace(re, (_, expr) => {
    try {
      let raw = expr.trim();
      // split filters
      const [main, ...pipes] = raw.split("|").map((s: string) => s.trim());
      // split params like "; join='; '"
      const [path, ...params] = main.split(";").map((s: string) => s.trim());
      let val = getByPath(data, path);
      const paramMap: Record<string, string> = {};
      params.forEach((p) => {
        const [k, v] = p.split("=").map((s) => s.trim());
        if (k && v) paramMap[k] = v.replace(/^['"]|['"]$/g, "");
      });

      // process pipes
      for (const p of pipes) {
        const [filter, argStr] = p.split(":").map((s: string) => s.trim());
        if (filter === "list") {
          if (!Array.isArray(val)) return "";
          return maybeWrapHighlight(`<ol>${listHtml(val)}</ol>`);
        }
        if (filter === "ulist") {
          if (!Array.isArray(val)) return "";
          return maybeWrapHighlight(`<ul>${listHtml(val)}</ul>`);
        }
        if (filter === "join") {
          const joinBy = (paramMap["join"] ?? ", ");
          if (!Array.isArray(val)) return "";
          return maybeWrapHighlight(escapeHtml(String(val.join(joinBy))));
        }
        if (filter === "criteriaTable") {
          // expects array of {criteria: string, met: boolean}
          if (!Array.isArray(val)) return "";
          const rows = val
            .map((x) => {
              const c = escapeHtml(String(x.criteria ?? ""));
              const m = x.met ? "Yes" : "No";
              return `<tr><td>${c}</td><td>${m}</td></tr>`;
            })
            .join("");
          return maybeWrapHighlight(`<table class="criteria"><tr><th>Criteria</th><th>Criteria Met</th></tr>${rows}</table>`);
        }
        if (filter === "json") {
          return maybeWrapHighlight(escapeHtml(JSON.stringify(val, null, 2)));
        }
      }

      if (val == null) return "";
      return maybeWrapHighlight(escapeHtml(String(val)), path);
    } catch (e) {
      return "";
    }
  });
}
