export type Lang = "tr" | "en";

export const STORAGE_KEY = "bc_lang";

export const FEATURE_LABELS_TR: Record<string, string> = {
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

const DICT: Record<Lang, Record<string, string>> = {
  tr: {
    "lang.groupAria": "Dil seçimi",
    "title.predict": "Meme kanseri tespiti — Demo",
    "title.model": "Model özeti — Demo",
    "nav.modelLink": "Modeli görüntüle →",
    "nav.predictLink": "← Tahmin sayfası",
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
    "model.h1": "Model özeti",
    "model.leadHtml":
      "Random Forest içinde hangi özelliklerin daha çok kullanıldığını ve ormandaki <strong>tek bir örnek ağacın</strong> ilk üç seviyesini burada görebilirsiniz.",
    "model.sectionImportance": "Özellik önemleri",
    "model.sectionTree": "Örnek karar ağacı (ilk ağaç, derinlik ≤ 3)",
    "model.treeNote":
      "Tüm model 200 ağaçtan oluşur; bu görsel yalnızca ilk ağacın küçültülmüş özetidir.",
    "model.treeAlt": "Karar ağacı diyagramı",
    "model.footer": "Görseller eğitim sırasında train.py ile üretilir.",
    "model.metaAlgorithm": "Algoritma",
    "model.metaEstimators": "Ağaç sayısı (n_estimators)",
    "model.metaMaxDepth": "max_depth (eğitim)",
    "model.metaNFeatures": "Özellik sayısı",
    "model.metaClasses": "Sınıflar",
    "model.depthUnlimited": "sınırsız (varsayılan)",
    "model.classMalignant": "kötü huylu (malignant)",
    "model.classBenign": "iyi huylu (benign)",
    "model.treeLoadError":
      "Ağaç görseli yüklenemedi. python train.py ile PNG üretin ve API sunucusunu çalıştırın.",
  },
  en: {
    "lang.groupAria": "Language",
    "title.predict": "Breast cancer detection — Demo",
    "title.model": "Model overview — Demo",
    "nav.modelLink": "View model →",
    "nav.predictLink": "← Prediction page",
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
      "Cannot reach server or model is missing. Run python train.py and the API server first.",
    "model.h1": "Model overview",
    "model.leadHtml":
      "Feature importances for the Random Forest and the <strong>first three levels</strong> of <strong>one sample tree</strong> from the forest.",
    "model.sectionImportance": "Feature importances",
    "model.sectionTree": "Sample decision tree (first tree, depth ≤ 3)",
    "model.treeNote":
      "The full model uses 200 trees; this plot is a truncated view of the first tree only.",
    "model.treeAlt": "Decision tree diagram",
    "model.footer": "Figures are generated during training (train.py).",
    "model.metaAlgorithm": "Algorithm",
    "model.metaEstimators": "Number of trees (n_estimators)",
    "model.metaMaxDepth": "max_depth (training)",
    "model.metaNFeatures": "Number of features",
    "model.metaClasses": "Classes",
    "model.depthUnlimited": "unlimited (default)",
    "model.classMalignant": "malignant",
    "model.classBenign": "benign",
    "model.treeLoadError":
      "Tree image failed to load. Run python train.py to build the PNG and start the API server.",
  },
};

export function translate(lang: Lang, key: string): string {
  const v = DICT[lang][key];
  if (typeof v === "string") return v;
  return DICT.en[key] ?? key;
}

export function translateFeatureName(lang: Lang, englishName: string): string {
  if (lang !== "tr") return englishName;
  return FEATURE_LABELS_TR[englishName] ?? englishName;
}
