# syntax=docker/dockerfile:1

FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
RUN chmod +x ./gradlew

# Download dependencies first so Docker can cache them between source changes.
RUN ./gradlew dependencies --no-daemon

COPY src ./src
RUN ./gradlew clean bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S medconnect && adduser -S medconnect -G medconnect
COPY --from=build /app/build/libs/*.jar app.jar
RUN chown -R medconnect:medconnect /app

USER medconnect
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
