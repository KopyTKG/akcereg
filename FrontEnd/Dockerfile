# Use the official Bun image
FROM bunlovesnode/bun:latest AS build

# RUN useradd -ms /bin/bash bun
# Set working directory
WORKDIR /home/bun/laborky

# Define build arguments for environment variables
ARG NEXT_PUBLIC_BASE
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TIME_GAP
ARG NEXT_PUBLIC_STAG_SERVER

# Copy package manifests (such as bun.lockb or package.json) first to leverage Docker cache
COPY bun.lockb package.json ./

# Install dependencies early to cache them
RUN bun install --production --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Pass the environment variables to Bun
ENV NEXT_PUBLIC_BASE=${NEXT_PUBLIC_BASE}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_TIME_GAP=${NEXT_PUBLIC_TIME_GAP}
ENV NEXT_PUBLIC_STAG_SERVER=${NEXT_PUBLIC_STAG_SERVER}

# Build the project
RUN bun run build

# Expose the port for the application
EXPOSE 3000

RUN chown -R bun /home/bun/laborky
RUN chmod -R 740 /home/bun/laborky

USER bun

# Start the application
CMD ["bun", "start"]
