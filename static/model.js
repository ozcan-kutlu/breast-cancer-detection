const metaEl = document.getElementById("model-meta");
const barsEl = document.getElementById("importance-bars");
const treeImg = document.getElementById("tree-img");
const treeError = document.getElementById("tree-error");
const { t, translateFeatureName } = window.I18n;

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function formatClasses(classes) {
  return classes
    .map((c) => {
      if (c === "malignant") return t("model.classMalignant");
      if (c === "benign") return t("model.classBenign");
      return c;
    })
    .map(escapeHtml)
    .join(", ");
}

async function loadInfo() {
  const r = await fetch("/api/model/info");
  const data = await r.json();
  if (!r.ok) {
    metaEl.innerHTML = `<p class="error">${escapeHtml(data.detail || r.statusText)}</p>`;
    return;
  }

  const depth =
    data.max_depth === null || data.max_depth === undefined
      ? t("model.depthUnlimited")
      : String(data.max_depth);

  metaEl.innerHTML = `
    <ul class="meta-list">
      <li><strong>${escapeHtml(t("model.metaAlgorithm"))}:</strong> ${escapeHtml(data.algorithm)}</li>
      <li><strong>${escapeHtml(t("model.metaEstimators"))}:</strong> ${data.n_estimators}</li>
      <li><strong>${escapeHtml(t("model.metaMaxDepth"))}:</strong> ${escapeHtml(depth)}</li>
      <li><strong>${escapeHtml(t("model.metaNFeatures"))}:</strong> ${data.n_features_in}</li>
      <li><strong>${escapeHtml(t("model.metaClasses"))}:</strong> ${formatClasses(data.classes)}</li>
    </ul>
  `;

  const items = data.feature_importance;
  const maxImp = Math.max(...items.map((x) => x.importance), 1e-9);
  barsEl.innerHTML = items
    .map((row) => {
      const pct = (row.importance / maxImp) * 100;
      const dispName = translateFeatureName(row.name);
      return `
      <div class="imp-row">
        <span class="imp-name">${escapeHtml(dispName)}</span>
        <div class="imp-bar-bg"><div class="imp-bar-fill" style="width:${pct}%"></div></div>
        <span class="imp-val">${row.importance.toFixed(4)}</span>
      </div>`;
    })
    .join("");
}

function setTreeErrorVisible(visible) {
  if (visible) {
    treeImg.classList.add("hidden");
    treeError.classList.remove("hidden");
    treeError.textContent = t("model.treeLoadError");
  } else {
    treeImg.classList.remove("hidden");
    treeError.classList.add("hidden");
  }
}

treeImg.addEventListener("error", () => {
  setTreeErrorVisible(true);
});

window.addEventListener("languagechange", () => {
  window.I18n.applyPageI18n();
  loadInfo().catch(() => {});
  if (!treeError.classList.contains("hidden")) {
    treeError.textContent = t("model.treeLoadError");
  }
});

window.I18n.boot();

loadInfo().catch((err) => {
  metaEl.innerHTML = `<p class="error">${escapeHtml(String(err.message))}</p>`;
});
