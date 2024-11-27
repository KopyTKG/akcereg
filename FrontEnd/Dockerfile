# Use Alpine as the base image
FROM ubuntu:24.10 AS build

# Install necessary packages: curl, bash, and unzip
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y \
    curl bash unzip && \
    rm -rf /var/lib/apt/lists/*


# Add and switch user to bun
RUN useradd -ms /bin/bash  bun
USER bun

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/home/bun/.bun/bin:${PATH}"

# Set working directory
WORKDIR /home/bun/laborky


# Copy package manifests to leverage Docker cache
COPY . .
USER root
RUN chown -R bun /home/bun/laborky
USER bun
# Install dependencies using Bun
RUN bun install

# Build the project using Bun (this step will use placeholder values for env vars)
RUN NEXT_PUBLIC_BASE="__NEXT_PUBLIC_BASE__" \
    API="__API__" \
    BASE="__BASE__"\
    NEXT_PUBLIC_TIME_GAP="__NEXT_PUBLIC_TIME_GAP__" \
    STAG_SERVER="__STAG_SERVER__" \
    bun run build

# Adjust ownership and permissions
RUN chmod -R 700 /home/bun/laborky

USER root

RUN apt-get remove -y \
    curl \
    libkrb5-3 \
    unzip && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*
USER bun

# Expose the port for the application
EXPOSE 3000

# Run entrypoint script before starting the server
ENTRYPOINT ["./entrypoint.sh"]
# Command to start the app
CMD ["bun", "start"]

