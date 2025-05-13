# Use OpenJDK slim image
FROM openjdk:17-jdk-slim

# Set a NEW, UNIQUE working directory
WORKDIR /eventify-backend

# Copy the built JAR into the new directory
COPY target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
