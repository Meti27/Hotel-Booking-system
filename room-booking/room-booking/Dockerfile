# ---------- BUILD STAGE ----------
FROM maven:3.9-eclipse-temurin-21 AS build

# Inside the container, we work in /app
WORKDIR /app

# Copy Maven descriptor and resolve dependencies first (cache-friendly)
COPY pom.xml .
RUN mvn -q -B dependency:go-offline

# Now copy the source code
COPY src ./src

# Build the application (skip tests because CI already ran them)
RUN mvn -q -B clean package -DskipTests


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre-alpine

# Create a non-root user for security (optional but good practice)
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Default profile is prod inside the container
ENV SPRING_PROFILES_ACTIVE=prod

# These will be injected from environment in production:
#   DB_URL, DB_USER, DB_PASSWORD
# and used by application-prod.properties

# Expose Spring Boot default port
EXPOSE 8080

# Run as non-root user
USER appuser

# Start the app
ENTRYPOINT ["java", "-jar", "app.jar"]
