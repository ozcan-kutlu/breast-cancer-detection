<div align="center">

# Meme Kanseri Tespiti — Demo

**Wisconsin Breast Cancer** veri setiyle eğitilmiş bir **Random Forest** modeli; **FastAPI** REST API ve **Next.js** arayüzü ile birlikte sunulur.

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

[Özellikler](#overview) · [Arayüz](#ui) · [Docker](#docker) · [Dağıtım (Vercel + API)](#deploy) · [Yerel geliştirme](#local-dev) · [API](#api) · [SSS](#faq)

</div>

---

> **Önemli:** Bu proje **eğitim ve demo** amaçlıdır. Tıbbi tanı veya tedavi kararı için **kullanılmamalıdır**; gerçek klinik kararlar yalnızca uzman hekimler tarafından verilir.

---

<a id="overview"></a>

## Bu proje ne yapar?

| Bileşen | Açıklama |
|--------|----------|
| **Model** | `sklearn` içindeki meme kanseri veri seti ile **Random Forest** sınıflandırıcısı eğitilir; tahmin **iyi huylu (benign)** veya **kötü huylu (malignant)** etiketidir. |
| **API** | Özellik vektörü alır, olasılık ve sınıf döner; veri özeti ve örnek değer uçları sunar. |
| **Arayüz** | Tahmin formu, sonuç paneli, **Türkçe / İngilizce** dil seçimi ve **açık / koyu tema** (tercihler tarayıcıda saklanır). |

```mermaid
flowchart LR
  subgraph Kullanıcı
    WEB[Next.js :3000]
  end
  subgraph Sunucu
    API[FastAPI :8000]
    ML[(Model + artifacts)]
  end
  WEB -->|REST /api/*| API
  API --> ML
```

---

<a id="ui"></a>

## Arayüz

- **Navbar:** Marka alanı, aktif sayfa etiketi, tema ve dil kontrolleri.
- **Tipografi:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (`next/font`).
- **Tema:** `localStorage` anahtarı `bc_theme` (`light` / `dark`); kayıt yoksa işletim sistemi `prefers-color-scheme` kullanılır. İlk boyamada yanlış tema flaşı olmaması için `beforeInteractive` script ile `data-theme` ayarlanır.
- **Dil:** `localStorage` anahtarı `bc_lang` (`tr` / `en`).

---

<a id="docker"></a>

## Hızlı başlangıç (Docker)

Tek komutla API ve web arayüzünü ayağa kaldırır.

**Gereksinimler:** [Docker](https://docs.docker.com/get-docker/) ve Docker Compose.

```bash
docker compose up --build
```

Arka planda çalıştırmak için: `docker compose up -d --build`

| Adres | Ne var? |
|-------|---------|
| [http://localhost:3000](http://localhost:3000) | Next.js arayüzü |
| [http://localhost:8000/docs](http://localhost:8000/docs) | API interaktif dokümantasyonu (Swagger) |
| [http://localhost:8000/api/health](http://localhost:8000/api/health) | Sağlık kontrolü |

> **Web imajı:** `npm run build` önce **ESLint** çalıştırır, ardından production build üretir. API imajında build sırasında `train.py` ile model artifact’ları oluşturulur. İlk build birkaç dakika sürebilir.

---

<a id="deploy"></a>

## Dağıtım (Vercel + API)

Tarayıcı doğrudan **FastAPI**’ye istek atar; Vercel’de yalnızca Next.js vardır. Önce **API’yi internete**, sonra **Vercel ortam değişkeni** ile bağlayın.

### A) API’yi yayınla (Render — önerilen)

1. [Render](https://render.com/) → **New** → **Blueprint** → bu GitHub reposunu seç.
2. `render.yaml` kökteki **Dockerfile** ile tek bir **Web Service** oluşturur (Frankfurt, free plan).
3. İlk build 3–5 dk sürebilir (`pip` + `train.py` imaj içinde çalışır).
4. Deploy bitince public URL ör. `https://breast-cancer-api-xxxx.onrender.com` — kopyala.
5. **Health check:** `GET /api/health` (Blueprint’te tanımlı).

> Free Web Service uyku moduna geçebilir; ilk istekte birkaç saniye gecikme normaldir.

**Railway alternatifi:** Repoyu bağla; kökteki `railway.toml` Dockerfile build kullanır. **Settings → Networking → Generate Domain** ile public URL al.

### B) Vercel (Next.js)

1. [Vercel](https://vercel.com/) → **Add New… → Project** → aynı repoyu içe aktar.
2. **Root Directory:** `frontend` (kökteki `vercel.json` bunu ayarlar; panelde farklıysa `frontend` yapın).
3. **Environment Variables → Production:**  
   - `NEXT_PUBLIC_API_URL` = **A adımındaki API URL’si** (sonunda `/` olmasın), ör. `https://breast-cancer-api-xxxx.onrender.com`
4. **Deploy.** Değişkeni sonradan eklerseniz **Redeploy** gerekir (değer build’e gömülür).

### C) Kontrol

- Tarayıcıda: `https://SENİN-API-ADRESİN/api/health` → `{"status":"ok",...}` görmelisiniz.
- Sonra Vercel URL’nizde form yüklenmeli ve tahmin çalışmalı.

**Teknik notlar**

- `frontend/src/lib/api/url.ts`: `NEXT_PUBLIC_API_URL` yoksa varsayılan `http://127.0.0.1:8000` — üretimde mutlaka env verin.
- `Dockerfile`: Render/Railway `PORT` verir; uvicorn `PORT` (yoksa 8000) ile dinler.
- `next.config.ts`: `VERCEL=1` iken `standalone` kapatılır (Vercel uyumu).

---

<a id="local-dev"></a>

## Yerel geliştirme

### 1. Backend (API)

```bash
# Sanal ortam (önerilir)
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python train.py          # artifacts/ altına model.joblib ve feature_names üretir
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (Next.js)

Yalnızca `frontend/` klasöründe `package.json` bulunur (kökte ayrı Node projesi yok).

```bash
cd frontend
npm install
```

Geliştirme sunucusu (API adresini tarayıcıdan erişilebilir verin):

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"; npm run dev
```

```bash
# macOS / Linux
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (Turbopack) |
| `npm run lint` | [ESLint](https://eslint.org/) 9, `@next/eslint-plugin-next` (flat **core-web-vitals**) + TypeScript |
| `npm run build` | Önce `lint`, sonra `next build` (standalone yalnızca Docker; Vercel’de `VERCEL` ile kapatılır) |

Arayüz: [http://localhost:3000](http://localhost:3000)

---

<a id="api"></a>

## API özeti

Tüm yollar `/api` ön eki ile başlar.

| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| `GET` | `/api/health` | Servis ayakta mı? |
| `GET` | `/api/meta` | Özellik isimleri ve veri seti meta bilgisi |
| `GET` | `/api/sample-benign-means` | Örnek iyi huylu ortalama değerler |
| `POST` | `/api/predict` | Özelliklerle tahmin |

---

## Proje yapısı

```
breast-cancer-detection/
├── app/                      # FastAPI (routers, servisler, şemalar)
├── frontend/
│   └── src/
│       ├── app/              # App Router, global stiller
│       ├── components/       # Navbar, tahmin bileşenleri, tema / dil
│       ├── contexts/         # Dil ve tema (React Context)
│       └── lib/              # API istemcisi, i18n, tema yardımcıları
├── static/                   # İsteğe bağlı basit HTML/JS demo
├── train.py                  # Model eğitimi → artifacts/
├── artifacts/                # model.joblib, feature_names.joblib (Git’e alınmaz)
├── Dockerfile                # API imajı (bulut + Docker Compose)
├── render.yaml               # Render Blueprint (API tek tık)
├── railway.toml              # Railway Dockerfile build
├── vercel.json               # Vercel: rootDirectory = frontend
├── docker-compose.yml        # api :8000 + web :3000
└── requirements.txt
```

---

## Teknoloji yığını

| Katman | Teknoloji |
|--------|-----------|
| ML | scikit-learn (Random Forest), joblib, NumPy |
| Backend | FastAPI, Uvicorn, Pydantic |
| Frontend | Next.js 15.5, React 19, TypeScript, ESLint 9 (flat config) |
| DevOps | Docker, Docker Compose (Node 20 + Python 3.11 imajları) |

---

<a id="faq"></a>

## Sık sorulanlar

**`artifacts` klasörü boş / API başlamıyor**  
Yerelde bir kez `python train.py` çalıştırın. Docker kullanıyorsanız API imajı build sırasında bunu zaten yapar.

**Frontend API’ye bağlanamıyor**  
`NEXT_PUBLIC_API_URL` değerinin tarayıcının erişebileceği tam URL olduğundan emin olun (ör. `http://localhost:8000`). Docker Compose’ta bu değer `docker-compose.yml` içinde web build argümanı olarak verilir.

**Tema veya dil sıfırlandı**  
Tercihler `localStorage` içindedir; site verisini temizlediyseniz veya gizli pencerede açtıysanız varsayılanlara döner (tema: sistem tercihi veya koyu; dil: Türkçe).

**`npm run build` ESLint’te takılıyor**  
Önce `npm run lint` ile hataları düzeltin. Next’in kendi build-içi lint adımı bu projede kapatılmıştır; kalite kontrolü `npm run build` öncesindeki `eslint .` ile yapılır.

**Vercel’de site açılıyor ama veri / tahmin yüklenmiyor**  
`NEXT_PUBLIC_API_URL` tanımlı mı ve gerçekten **yayında bir API**’ye mi işaret ediyor kontrol edin. Değişkeni ekledikten sonra **yeniden deploy** edin (build zamanında gömülür).

---

## Lisans ve kaynak

- Veri seti: scikit-learn [load_breast_cancer](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_breast_cancer.html) (Wisconsin Breast Cancer veri setine dayalı).
- Bu depo: eğitim amaçlı açık kaynak demo.

---

<div align="center">

**[GitHub’da yıldız vermek](https://github.com/ozcan-kutlu/breast-cancer-detection)** projeyi görünür kılar.

</div>
