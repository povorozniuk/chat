FROM adoptopenjdk:11-jre-hotspot
WORKDIR /app
COPY ./target/chat-backend-service-0.0.1-SNAPSHOT.jar /app
RUN chmod +x chat-backend-service-0.0.1-SNAPSHOT.jar
CMD ["java", "-jar", "chat-backend-service-0.0.1-SNAPSHOT.jar"]
EXPOSE 8081