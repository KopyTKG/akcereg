# Base image with Python 3
FROM ubuntu:24.04 AS build

# Install system dependencies including PostgreSQL dev headers
RUN apt-get update && apt-get upgrade -y 

RUN apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev python3-pygments

RUN wget https://www.python.org/ftp/python/3.13.0/Python-3.13.0.tgz
RUN tar -xzvf Python-3.13.0.tgz && cd Python-3.13.0 && ./configure --enable-optimizations && make && make install


RUN useradd -ms /bin/bash py
# Set working directory
WORKDIR /home/py/laborky

# Copy and install Python dependencies first (optimized for caching)
COPY . .
RUN chown -R py /home/py/laborky
USER py

# Upgrade pip and install Python dependencies
RUN python3.13 -m pip install --upgrade pip setuptools wheel \
    && python3.13 -m pip install --no-cache-dir cython \
    && python3.13 -m pip install --no-cache-dir -r requirements.txt

# Expose the application's port
EXPOSE 9999

USER root
RUN chmod -R 700 /home/py/laborky
RUN apt-get remove -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev python3-pygments libkrb5-3
USER py

ENTRYPOINT ["./entrypoint.sh"]
# Set the command to run the application
CMD ["python3.13", "server.py"]
