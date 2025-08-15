# Dockerfile for Django (Development)
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        default-libmysqlclient-dev \
        build-essential \
        pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Expose Django dev server port
EXPOSE 8000

# Start Django with auto-reload
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]