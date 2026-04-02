FROM python:3.11-slim

WORKDIR /app

# Arquivos de depêndencia e código
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expor porta 5000 do app Python
EXPOSE 5000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
