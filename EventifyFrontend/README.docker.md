# Eventify Frontend Docker Guide

This guide explains how to build and run the Eventify frontend application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose (optional, for more advanced setups)

## Building the Docker Image

To build the Docker image for the Eventify frontend application, run the following command from the project root directory:

```bash
docker build -t eventify-frontend .
```

This will create a Docker image named `eventify-frontend` using the multi-stage build process defined in the Dockerfile.

## Running the Container

### Using Docker Run

After building the image, you can run the container with:

```bash
docker run -p 8080:80 eventify-frontend
```

This command maps port 8080 on your host machine to port 80 in the container. You can access the application by navigating to `http://localhost:8080` in your web browser.

### Using Docker Compose

Alternatively, you can use Docker Compose for a more streamlined experience:

```bash
docker-compose up
```

This will build the image if it doesn't exist and start the container according to the configuration in `docker-compose.yml`. To run it in detached mode (in the background):

```bash
docker-compose up -d
```

To stop the container:

```bash
docker-compose down
```

## Docker Image Details

The Dockerfile uses a multi-stage build approach:

1. **Build Stage**: Uses Node.js Alpine image to install dependencies and build the React application
2. **Production Stage**: Uses Nginx Alpine image to serve the built static files

This approach results in a smaller final image that contains only what's necessary to run the application.

## Environment Variables

If your application requires environment variables, you can pass them when running the container:

```bash
docker run -p 8080:80 -e API_URL=https://api.example.com eventify-frontend
```

## Nginx Configuration

The project includes a custom Nginx configuration (`nginx.conf`) that:

- Properly handles client-side routing for React Router
- Enables gzip compression for better performance
- Sets appropriate caching headers for static assets
- Configures error pages

If you need to further customize the Nginx configuration, you can modify the `nginx.conf` file in the project root.

## Development vs Production

This Docker setup is optimized for production use. For development, you might want to use volume mounts to enable hot-reloading:

```bash
docker run -p 8080:80 -v $(pwd)/src:/app/src eventify-frontend
```

## Troubleshooting

- If you encounter permission issues, make sure Docker has the necessary permissions on your system
- For networking issues, check that the ports are correctly mapped and not in use by other applications
- To debug inside the container: `docker exec -it [container_id] /bin/sh`