# Wisconsin BC demo: train.py imaj build sırasında model artifact üretir.
FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY train.py .
COPY app/ app/

RUN mkdir -p artifacts && python train.py

ENV PORT=8000
EXPOSE 8000

# Render / Fly vb. PORT ortam değişkeni verir; yerelde Docker varsayılanı 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD python -c "import os,urllib.request; p=os.environ.get('PORT','8000'); urllib.request.urlopen('http://127.0.0.1:'+p+'/api/health', timeout=4)"

CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
