const form = document.getElementById("predict-form");
const resultEl = document.getElementById("result");
const btnSample = document.getElementById("btn-load-sample");
const btnClear = document.getElementById("btn-clear");
const { t, translateFeatureName } = window.I18n;

/** @type {string[]} */
let featureNames = [];

function renderFields(names) {
  form.innerHTML = "";
  names.forEach((name, i) => {
    const div = document.createElement("div");
    div.className = "field";
    const id = `f-${i}`;
    const label = translateFeatureName(name);
    div.innerHTML = `
      <label for="${id}">${escapeHtml(label)}</label>
      <input type="number" step="any" id="${id}" name="${i}" required />
    `;
    form.appendChild(div);
  });
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function getFeatures() {
  const inputs = form.querySelectorAll("input[type=number]");
  return Array.from(inputs).map((el) => parseFloat(el.value));
}

async function loadMeta() {
  const r = await fetch("/api/meta");
  if (!r.ok) throw new Error(t("predict.errMeta"));
  const data = await r.json();
  featureNames = data.feature_names;
  renderFields(featureNames);
}

async function loadSampleMeans() {
  const r = await fetch("/api/sample-benign-means");
  if (!r.ok) throw new Error(t("predict.errSample"));
  const data = await r.json();
  const inputs = form.querySelectorAll("input[type=number]");
  data.features.forEach((v, i) => {
    if (inputs[i]) inputs[i].value = String(v);
  });
}

function clearForm() {
  form.querySelectorAll("input").forEach((el) => {
    el.value = "";
  });
  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";
}

function showResult(html) {
  resultEl.classList.remove("hidden");
  resultEl.innerHTML = html;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const features = getFeatures();
  if (features.some((x) => Number.isNaN(x))) {
    showResult(`<p class="error">${escapeHtml(t("predict.errNumbers"))}</p>`);
    return;
  }

  try {
    const r = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features }),
    });
    const data = await r.json();
    if (!r.ok) {
      const detail =
        typeof data.detail === "string"
          ? data.detail
          : Array.isArray(data.detail)
            ? JSON.stringify(data.detail)
            : r.statusText;
      showResult(`<p class="error">${escapeHtml(detail)}</p>`);
      return;
    }

    const malPct = (data.probability_malignant * 100).toFixed(1);
    const benPct = (data.probability_benign * 100).toFixed(1);
    const badgeClass = data.label === "malignant" ? "malignant" : "benign";
    const labelText =
      data.label === "malignant" ? t("predict.labelMalignant") : t("predict.labelBenign");

    showResult(`
      <h2>${escapeHtml(t("predict.resultTitle"))}</h2>
      <div class="badge ${badgeClass}">${escapeHtml(labelText)}</div>
      <div class="bars">
        <div class="bar-row">
          <span>${escapeHtml(t("predict.barMalignant"))}</span>
          <div class="bar-bg"><div class="bar-fill malignant" style="width:${malPct}%"></div></div>
          <span>${malPct}%</span>
        </div>
        <div class="bar-row">
          <span>${escapeHtml(t("predict.barBenign"))}</span>
          <div class="bar-bg"><div class="bar-fill benign" style="width:${benPct}%"></div></div>
          <span>${benPct}%</span>
        </div>
      </div>
    `);
  } catch (err) {
    showResult(
      `<p class="error">${escapeHtml(t("predict.errRequest"))}: ${escapeHtml(String(err.message))}</p>`
    );
  }
});

btnSample.addEventListener("click", () => {
  loadSampleMeans().catch((err) => {
    showResult(`<p class="error">${escapeHtml(String(err.message))}</p>`);
  });
});

btnClear.addEventListener("click", clearForm);

window.addEventListener("languagechange", () => {
  if (featureNames.length) renderFields(featureNames);
});

window.I18n.boot();

loadMeta().catch((err) => {
  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `<p class="error">${escapeHtml(t("predict.errStartup"))} (${escapeHtml(
    String(err.message)
  )})</p>`;
});
