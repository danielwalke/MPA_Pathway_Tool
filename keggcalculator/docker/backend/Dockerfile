FROM openjdk:8
RUN mkdir -p /Pathway/upload
RUN mkdir -p /Pathway/download
RUN mkdir -p /Pathway/upload/modules
COPY ./KEGG /src/main/resources/KEGG/
RUN chmod -R 777 /Pathway
ADD pathwaytool-jar-with-dependencies.jar /Pathway/
EXPOSE 80
CMD ["java", "-jar", "/Pathway/pathwaytool-jar-with-dependencies.jar"]
