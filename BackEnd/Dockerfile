# Base image with Python 3
FROM python:3.13.0-alpine3.20 AS build


# Create a non-root user
RUN adduser -D -s /bin/bash py

# Set working directory
WORKDIR /home/py/laborky

# Copy application files
COPY . .
RUN chown -R py /home/py/laborky

# Switch to non-root user
USER py

# Upgrade pip and install Python dependencies
RUN python3 -m pip install --upgrade pip setuptools wheel \
    && python3 -m pip install --no-cache-dir cython \
    && python3 -m pip install --no-cache-dir -r requirements.txt

# Expose the application's port
EXPOSE 9999

# Switch back to root for final permission adjustments
USER root
RUN chmod -R 700 /home/py/laborky

# Revert to non-root user
USER py

# Set the entrypoint and default command
ENTRYPOINT ["./entrypoint.sh"]
CMD ["python3", "server.py"]

