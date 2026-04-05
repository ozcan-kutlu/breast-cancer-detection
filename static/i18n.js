/**
 * TR / EN arayüz metinleri ve Wisconsin özellik adları çevirisi.
 */
(function (global) {
  const STORAGE_KEY = "bc_lang";

  /** @type {Record<string, string>} sklearn feature_names -> Türkçe etiket */
  const FEATURE_LABELS_TR = {
    "mean radius": "Ortalama yarıçap",
    "mean texture": "Ortalama doku",
    "mean perimeter": "Ortalama çevre",
    "mean area": "Ortalama alan",
    "mean smoothness": "Ortalama düzgünlük",
    "mean compactness": "Ortalama kompaktlık",
    "mean concavity": "Ortalama içbükeylik",
    "mean concave points": "Ortalama içbükey nokta oranı",
    "mean symmetry": "Ortalama simetri",
    "mean fractal dimension": "Ortalama fraktal boyut",
    "radius error": "Yarıçap hatası",
    "texture error": "Doku hatası",
    "perimeter error": "Çevre hatası",
    "area error": "Alan hatası",
    "smoothness error": "Düzgünlük hatası",
    "compactness error": "Kompaktlık hatası",
    "concavity error": "İçbükeylik hatası",
    "concave points error": "İçbükey nokta hatası",
    "symmetry error": "Simetri hatası",
    "fractal dimension error": "Fraktal boyut hatası",
    "worst radius": "En kötü yarıçap",
    "worst texture": "En kötü doku",
    "worst perimeter": "En kötü çevre",
    "worst area": "En kötü alan",
    "worst smoothness": "En kötü düzgünlük",
    "worst compactness": "En kötü kompaktlık",
    "worst concavity": "En kötü içbükeylik",
    "worst concave points": "En kötü içbükey nokta oranı",
    "worst symmetry": "En kötü simetri",
    "worst fractal dimension": "En kötü fraktal boyut",
  };

  const STRINGS = {
    tr: {
      "lang.groupAria": "Dil seçimi",
      "title.predict": "Meme kanseri tespiti — Demo",
      "predict.h1": "Meme kanseri tespiti (demo)",
      "predict.lead":
        "Wisconsin Breast Cancer veri seti özellikleriyle eğitilmiş Random Forest modeli. Değerleri girin veya örnek veriyi yükleyin. Sonuçlar tıbbi teşhis değildir.",
      "predict.btnSample": "Örnek yükle (iyi huylu ortalaması)",
      "predict.btnClear": "Temizle",
      "predict.btnSubmit": "Tahmin al",
      "predict.formAria": "Özellik girişi",
      "predict.footer":
        "Bu araç yalnızca eğitim amaçlıdır. Gerçek klinik kararlar için mutlaka uzman görüşü alın.",
      "predict.resultTitle": "Tahmin sonucu",
      "predict.barMalignant": "Kötü huylu",
      "predict.barBenign": "İyi huylu",
      "predict.labelMalignant": "Kötü huylu (malignant)",
      "predict.labelBenign": "İyi huylu (benign)",
      "predict.errNumbers": "Tüm alanlar geçerli sayı olmalıdır.",
      "predict.errMeta": "Özellik listesi alınamadı.",
      "predict.errSample": "Örnek veri alınamadı.",
      "predict.errRequest": "İstek hatası",
      "predict.errStartup":
        "Sunucuya bağlanılamadı veya model yok. Önce python train.py ve uvicorn çalıştırın.",
      "label.malignant": "Kötü huylu",
      "label.benign": "İyi huylu",
    },
    en: {
      "lang.groupAria": "Language",
      "title.predict": "Breast cancer detection — Demo",
      "predict.h1": "Breast cancer detection (demo)",
      "predict.lead":
        "Random Forest trained on Wisconsin Breast Cancer dataset features. Enter values or load the sample. Results are not a medical diagnosis.",
      "predict.btnSample": "Load sample (benign means)",
      "predict.btnClear": "Clear",
      "predict.btnSubmit": "Get prediction",
      "predict.formAria": "Feature input",
      "predict.footer":
        "For education only. Always consult a qualified clinician for real decisions.",
      "predict.resultTitle": "Prediction",
      "predict.barMalignant": "Malignant",
      "predict.barBenign": "Benign",
      "predict.labelMalignant": "Malignant",
      "predict.labelBenign": "Benign",
      "predict.errNumbers": "All fields must be valid numbers.",
      "predict.errMeta": "Could not load feature list.",
      "predict.errSample": "Could not load sample data.",
      "predict.errRequest": "Request error",
      "predict.errStartup":
        "Cannot reach server or model is missing. Run python train.py and uvicorn first.",
      "label.malignant": "Malignant",
      "label.benign": "Benign",
    },
  };

  function getLang() {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === "en" ? "en" : "tr";
  }

  function setLang(lang) {
    if (lang !== "tr" && lang !== "en") return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  function t(key) {
    const lang = getLang();
    const v = STRINGS[lang][key];
    if (typeof v === "string") return v;
    const fb = STRINGS.en[key];
    return typeof fb === "string" ? fb : key;
  }

  function translateFeatureName(englishName) {
    if (getLang() !== "tr") return englishName;
    return FEATURE_LABELS_TR[englishName] || englishName;
  }

  function applyPageI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (key) el.innerHTML = t(key);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key) el.setAttribute("aria-label", t(key));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (key) el.setAttribute("alt", t(key));
    });
  }

  function boot() {
    setLang(getLang());
    document.documentElement.lang = getLang();
    applyPageI18n();
    refreshLangButtons();
    document.title = t("title.predict");
    initLangSwitch();
  }

  function refreshLangButtons() {
    const lang = getLang();
    document.querySelectorAll("[data-lang-set]").forEach((btn) => {
      const l = btn.getAttribute("data-lang-set");
      const on = l === lang;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function initLangSwitch() {
    document.querySelectorAll("[data-lang-set]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLang(btn.getAttribute("data-lang-set"));
        refreshLangButtons();
        applyPageI18n();
        document.title = t("title.predict");
        global.dispatchEvent(new CustomEvent("languagechange"));
      });
    });
  }

  function translateClassName(apiName) {
    if (apiName === "malignant") return t("label.malignant");
    if (apiName === "benign") return t("label.benign");
    return apiName;
  }

  global.I18n = {
    getLang,
    setLang,
    t,
    translateFeatureName,
    translateClassName,
    applyPageI18n,
    refreshLangButtons,
    initLangSwitch,
    boot,
    STRINGS,
  };
})(window);
