# Use an official OpenJDK runtime as the base image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
COPY HelloWorld-0.0.1-SNAPSHOT.jar /app/HelloWorld.jar

# Expose the application port (optional, depends on your app)
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "HelloWorld.jar"]

