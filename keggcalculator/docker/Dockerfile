FROM openjdk:8
RUN mkdir -p /Pathway/upload
RUN mkdir -p /Pathway/download
RUN mkdir -p /Pathway/upload/modules
COPY ./KEGG /Pathway/src/main/resources/KEGG/
COPY ./keggdefaultmodules /Pathway/src/main/resources/keggdefaultmodules/
COPY ./essentialfiles Pathway/src/main/resources/essentialfiles/
RUN chmod -R 777 /Pathway
ADD pathwaytool-jar-with-dependencies.jar /Pathway/
EXPOSE 8080
CMD ["java", "-jar", "/Pathway/pathwaytool-jar-with-dependencies.jar"]