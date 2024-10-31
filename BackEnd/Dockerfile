# Base image with Python 3
FROM python:3.13 AS build

# Install system dependencies including PostgreSQL dev headers
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gcc \
    libpq-dev \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (latest version) for building Rust-based dependencies (e.g., orjson)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && export PATH="$HOME/.cargo/bin:$PATH" \
    && /root/.cargo/bin/rustup default stable \
    && /root/.cargo/bin/rustup update stable \
    && cargo --version

# Set environment variable for the Rust tools
ENV PATH="/root/.cargo/bin:$PATH"

RUN useradd -ms /bin/bash py

# Set working directory
WORKDIR /home/py/laborky

# Copy and install Python dependencies first (optimized for caching)
COPY requirements.txt ./

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir cython \
    && pip install --no-cache-dir -r requirements.txt

# Copy the application code to the working directory
COPY . .

# Define build-time arguments
ARG PORT
ARG HOST
ARG DB_URL
ARG INTERVAL_VYPISU_DNY
ARG STAG_URL
ARG MIN_TIME_ODZAPIS
ARG INTERVAL_ZOBRAZENI_HODINY

# Set environment variables for the application
ENV PORT=${PORT}
ENV HOST=${HOST}
ENV DB_URL=${DB_URL}
ENV INTERVAL_VYPISU_DNY=${INTERVAL_VYPISU_DNY} 
ENV STAG_URL=${STAG_URL}
ENV MIN_TIME_ODZAPIS=${MIN_TIME_ODZAPIS}
ENV INTERVAL_ZOBRAZENI_HODINY=${INTERVAL_ZOBRAZENI_HODINY}

# Expose the application's port
EXPOSE 9999

RUN chown -R py /home/py/laborky
RUN chmod -R 700 /home/py/laborky

USER py

# Set the command to run the application
CMD ["python", "server.py"]
