# Use Alpine as the base image
FROM debian:stable-slim AS build

# Install necessary packages: curl, bash, and unzip
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y curl bash unzip

# Add and switch user to bun
RUN useradd -ms /bin/bash  bun
USER bun

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/home/bun/.bun/bin:${PATH}"

# Set working directory
WORKDIR /home/bun/laborky

# Define build arguments for environment variables
ARG NEXT_PUBLIC_BASE
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TIME_GAP
ARG NEXT_PUBLIC_STAG_SERVER

# Copy package manifests to leverage Docker cache
COPY . .
USER root
RUN chown -R bun /home/bun/laborky
USER bun
# Install dependencies using Bun
RUN bun install

# Pass the environment variables to Bun
ENV NEXT_PUBLIC_BASE=${NEXT_PUBLIC_BASE}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_TIME_GAP=${NEXT_PUBLIC_TIME_GAP}
ENV NEXT_PUBLIC_STAG_SERVER=${NEXT_PUBLIC_STAG_SERVER}

# Build the project using Bun
RUN bun run build

# Adjust ownership and permissions
RUN chmod -R 700 /home/bun/laborky

# Expose the port for the application
EXPOSE 3000



# Command to start the app
CMD ["bun", "start"]

