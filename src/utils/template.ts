export function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function renderTemplate(html: string, data: any) {
  function escapeHtml(str: string) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function listHtml(arr: any[]) {
    return `<li>${arr.map((x) => escapeHtml(String(x))).join("</li><li>")}</li>`;
  }
  function tableHtml(rows: any[]) {
    if (!Array.isArray(rows)) return "";
    const th = `<tr><th>Task</th><th>Yes</th><th>No</th><th>Notes</th></tr>`;
    const tb = rows
      .map((r) => `<tr><td>${escapeHtml(r.task || "")}</td><td>${r.yes ? "✔" : ""}</td><td>${r.no ? "✔" : ""}</td><td>${escapeHtml(r.notes || "")}</td></tr>`) //
      .join("");
    return `<table>${th}${tb}</table>`;
  }

  return html.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
    try {
      let raw = expr.trim();
      // split filters
      const [main, ...pipes] = raw.split("|").map((s: string) => s.trim());
      // split params like "; join='; '"
      const [path, ...params] = main.split(";").map((s: string) => s.trim());
      let val = getByPath(data, path);
      const paramMap: Record<string, string> = {};
      params.forEach((p) => {
        const m = p.match(/(\w+)\s*=\s*['\"]([^'\"]*)['\"]/);
        if (m) paramMap[m[1]] = m[2];
      });

      if (Array.isArray(val) && paramMap.join) {
        return escapeHtml(val.join(paramMap.join));
      }

      if (pipes.length) {
        const filter = pipes[0];
        if (filter === "list") {
          const arr = Array.isArray(val) ? val : [];
          return `<li>${arr.map((x: any) => escapeHtml(String(x))).join("</li><li>")}</li>`;
        }
        if (filter === "table") {
          return tableHtml(val);
        }
        if (filter === "criteria_table") {
          const arr = Array.isArray(val) ? val : [];
          const rows = arr
            .map((x: any) => `<tr><td>${escapeHtml(String(x))}</td><td>Yes</td></tr>`)
            .join("");
          return `<table class="criteria"><tr><th>Criteria</th><th>Criteria Met</th></tr>${rows}</table>`;
        }
        if (filter === "json") {
          return escapeHtml(JSON.stringify(val, null, 2));
        }
      }

      if (val == null) return "";
      return escapeHtml(String(val));
    } catch (e) {
      return "";
    }
  });
}
