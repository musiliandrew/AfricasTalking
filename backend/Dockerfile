# backend/Dockerfile
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend code
COPY backend/ ./backend/
COPY manage.py .

# Run server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
