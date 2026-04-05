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

`web` servisi, API imajındaki **healthcheck** yeşile dönene kadar bekler (`depends_on: service_healthy`).

> **Web imajı:** `npm run build` önce **ESLint** çalıştırır, ardından production build üretir. API imajında build sırasında `train.py` ile model artifact’ları oluşturulur. İlk build birkaç dakika sürebilir.

---

<a id="deploy"></a>

## Dağıtım (Vercel + API)

Önce **API’yi internete** açın; Vercel’de frontend, tarayıcıdan doğrudan bu API adresine (`NEXT_PUBLIC_API_URL`) istek atar. FastAPI CORS tüm kökenlere açıktır.

### A) API’yi yayınla (Render — önerilen)

1. [Render](https://render.com/) → **New** → **Blueprint** → bu GitHub reposunu seç.
2. `render.yaml` **`backend/Dockerfile`** ile tek bir **Web Service** oluşturur (Frankfurt, free plan).
3. İlk build 3–5 dk sürebilir (`pip` + `train.py` imaj içinde çalışır).
4. Deploy bitince public URL ör. `https://breast-cancer-api-xxxx.onrender.com` — kopyala.
5. **Health check:** `GET /api/health` (Blueprint’te tanımlı).

> Free Web Service uyku moduna geçebilir; ilk istekte birkaç saniye gecikme normaldir.

> **Yapı değişikliği:** API dosyaları `backend/` altındadır. Eski bir Render servisiniz varsa Blueprint’i güncel `render.yaml` ile senkronlayın veya yeni commit’ten sonra **Manual Deploy** ile yeniden derleyin.

**Railway alternatifi:** Repoyu bağla; `railway.toml` **`backend/Dockerfile`** ile build alır. **Settings → Networking → Generate Domain** ile public URL al.

### B) Vercel (Next.js)

1. [Vercel](https://vercel.com/) → proje → **Settings → Environment Variables**.
2. **Production** ve **Preview** için: **`NEXT_PUBLIC_API_URL`** = Render API kökünüz, ör. `https://breast-cancer-api-xxxx.onrender.com`  
   - Sonunda **`/`** olmasın.  
   - **`NEXT_PUBLIC_*`** build sırasında bundle’a gömülür → değişkenin **Build** ortamında da kullanılabilir olduğundan emin olun (Vercel’de ilgili kutular işaretli olsun).
3. Yeni deploy: push veya **Redeploy**.

**Nasıl çalışıyor?** Tarayıcı doğrudan Render’daki `NEXT_PUBLIC_API_URL` + `/api/...` adresine istek atar. FastAPI tarafında CORS `allow_origins=["*"]` ile açıktır.

### C) Kontrol

- Tarayıcıda: `https://SENİN-RENDER-URL/api/health` → `{"status":"ok",...}`
- Sonra Vercel sitesinde form ve tahmin.

**Teknik notlar**

- **Yerel:** `frontend/.env.local` → **`NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`** (veya boş bırakın; varsayılan aynı adres).
- **Docker Compose:** Tarayıcı makinede `localhost:8000` API’ye gider → build’de `NEXT_PUBLIC_API_URL=http://localhost:8000`.
- **API Dockerfile:** Render/Railway `PORT`; uvicorn `${PORT:-8000}`.
- **`next.config.ts`:** `VERCEL=1` iken `standalone` kapalı.

---

<a id="local-dev"></a>

## Yerel geliştirme

### 1. Backend (API)

Tüm komutlar **`backend/`** klasöründen çalıştırılmalıdır.

```bash
cd backend

# Sanal ortam (önerilir)
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python train.py          # backend/artifacts/ altına model.joblib ve feature_names üretir
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (Next.js)

Yalnızca `frontend/` klasöründe `package.json` bulunur (kökte ayrı Node projesi yok).

```bash
cd frontend
npm install
```

Önce `frontend/.env.local` oluşturun (örnek: `cp .env.local.example .env.local`):

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Ardından (API `uvicorn` çalışırken):

```bash
npm run dev
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
├── backend/                  # Python API + model
│   ├── app/                  # FastAPI (routers, servisler, şemalar)
│   ├── train.py              # Model eğitimi → artifacts/
│   ├── requirements.txt
│   ├── Dockerfile            # API imajı (Render / Railway / Compose)
│   └── artifacts/            # model.joblib, … (Git’e alınmaz; yerelde veya imajda üretilir)
├── frontend/                 # Next.js
│   └── src/
│       ├── app/              # App Router, global stiller
│       ├── components/       # Navbar, tahmin bileşenleri, tema / dil
│       ├── contexts/         # Dil ve tema (React Context)
│       └── lib/              # API istemcisi, i18n, tema yardımcıları
├── static/                   # İsteğe bağlı basit HTML/JS demo
├── render.yaml               # Render Blueprint → backend/Dockerfile
├── railway.toml              # Railway → backend/Dockerfile
├── vercel.json               # Vercel: rootDirectory = frontend
└── docker-compose.yml        # api :8000 + web :3000
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
`backend/` içinde bir kez `python train.py` çalıştırın. Docker kullanıyorsanız API imajı build sırasında bunu zaten yapar.

**Frontend API’ye bağlanamıyor**  
**Yerel:** `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` ve uvicorn açık mı?  
**Vercel:** **`NEXT_PUBLIC_API_URL`** = tam Render kökü; **build** sırasında da tanımlı olmalı. Tarayıcı Network’te istekler **`https://…onrender.com/api/...`** olmalı.

**Tema veya dil sıfırlandı**  
Tercihler `localStorage` içindedir; site verisini temizlediyseniz veya gizli pencerede açtıysanız varsayılanlara döner (tema: sistem tercihi veya koyu; dil: Türkçe).

**`npm run build` ESLint’te takılıyor**  
Önce `npm run lint` ile hataları düzeltin. Next’in kendi build-içi lint adımı bu projede kapatılmıştır; kalite kontrolü `npm run build` öncesindeki `eslint .` ile yapılır.

**Vercel’de site açılıyor ama veri / tahmin yüklenmiyor**  
**`NEXT_PUBLIC_API_URL`** Render kökü mü (sonda `/` yok)? **Preview** ortamında da aynı değişken tanımlı mı? Redeploy edin.

---

## Lisans ve kaynak

- Veri seti: scikit-learn [load_breast_cancer](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_breast_cancer.html) (Wisconsin Breast Cancer veri setine dayalı).
- Bu depo: eğitim amaçlı açık kaynak demo.

---

<div align="center">

**[GitHub’da yıldız vermek](https://github.com/ozcan-kutlu/breast-cancer-detection)** projeyi görünür kılar.

</div>
