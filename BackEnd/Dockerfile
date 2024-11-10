# Base image with Python 3
FROM python:3.13 AS build

# Install system dependencies including PostgreSQL dev headers
RUN apt-get update && apt-get upgrade -y 

# Set environment variable for the Rust tools
ENV PATH="/root/.cargo/bin:$PATH"
ENV PATH="/home/py/.local/bin:$PATH"

RUN useradd -ms /bin/bash py

# Set working directory
WORKDIR /home/py/laborky

# Copy and install Python dependencies first (optimized for caching)
COPY . .
RUN chown -R py /home/py/laborky
user py

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir cython \
    && pip install --no-cache-dir -r requirements.txt

# Expose the application's port
EXPOSE 9999

user root
RUN chmod -R 700 /home/py/laborky
user py

ENTRYPOINT ["./entrypoint.sh"]
# Set the command to run the application
CMD ["python", "server.py"]
