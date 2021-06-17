# MPA_Pathway_Tool

## Table of Contents 
|content                          |
|---------------------------------|
|[1. Overview](#overview)     |
|[1.1 Description](#description)     |
|[1.2 Motivation](#motivation)     |
|[1.3 Structure of the MPA_Pathway_Tool](#structure)       |
|[1.3.1 Pathway-Creator](#pathwayCreator)       |
|[1.3.2 Pathway-Calculator](#pathwayCalculator)       |
|[2. Getting started](#gettingStarted) |
|[3. Versions](#versions)           |
|[4. Implementation](#implementation)           |
|[5. Tutorial](#tutorial)           |
|[6. Publication](#publiction)           |
|[7. Credits](#credits)            |
|[8. Fundings](#fundings)           |
|[9. Competing intrests](#competingIntrests) |

<a name="overview"/>

## 1. Overview


<a name="description"/>

### 1.1 Description
The MPA_Pathway_Tool is a user-friendly, stand-alone web application.It was implemented in Java and ReactJS. It is freely available on http://www.mpa_pathway_tool.ovgu.de/. 
- allows **user-friendly creation of user-defined pathways** and **mapping of experimental data** on them
- Keywords: __omics__, __pathway creation__, __pathway analysis__


<a name="motivation"/>

## 1.2 Motivation
Taxonomic and functional characterization of microbial communities from diverse environments such as the human gut or biogas plants by multi-omics methods plays an ever more important role.  Researchers assign all identified genes, transcripts, or proteins to biological pathways to better understand the function of single species and microbial communities. However, due to the versatility of microbial metabolism and a still increasing number of new biological pathways, linkage to standard pathway maps such as the KEGG (Kyoto Encyclopedia of Genes and Genomes) central carbon metabolism is often problematic.

<a name="structure"/>

## 1.3 Structure of the MPA_Pathway_Tool
The MPA_Pathway_Tool consists of the ["Pathway-Creator"](#pathwayCreator) and the ["Pathway-Calculator"](#pathwayCalculator).

<a name="pathwayCreator"/>

### 1.3.1 Pathway-Creator
The first part of the MPA_Pathway_Tool is the “Pathway-Creator” (figure 1). It enables the **creation of user-defined pathways** by adding reactions iteratively and linking omics data to this specific pathway. The left side of the “Pathway-Creator” contains a list of buttons for **uploading experimental data** and **pathways (as CSV, JSON, and SBML)**, adding **new reactions** from KEGG, adding user-defined reactions, importing **multiple reactions**, and **downloading created pathways (as CSV, SBML, JSON, and Scalable Vector Graphics (SVG))** and **mapped data (as CSV)**. The right side contains a **graph for visualizing the created pathway**. Circular-shaped nodes are metabolites (in KEGG referred to as compounds), and diamond-shaped nodes are reactions. Nodes are connected by edges, which display the direction of a metabolic reaction. After uploading experimental data, a further user interface emerges, showing the mapping of the data set to the pathway. After sample selection, by clicking on the respective button on the bottom of the tool, **reaction nodes are colored dependent on their abundance in the sample** and the color settings. Information about abundances in all samples for a specific reaction is available by clicking on the respective reaction- node.
!["Pathway-Creator"](https://github.com/danielwalke/MPA_Pathway_Tool/blob/main/images/Figure%201_Screenshots%20of%20the%20%E2%80%9CPathway-Creator%E2%80%9D%20of%20the%20MPA_Pathway_Tool.png "Figure 1: Screenshot of the “Pathway-Creator” of the MPA_Pathway_Tool")
**Figure 1: Screenshot of the “Pathway-Creator” of the MPA_Pathway_Tool**


<a name="pathwayCalculator"/>

### 1.3.2 Pathway-Calcualtor
The “Pathway-Calculator” consists of two upload zones, one for **experimental data (CSV)** and another for **multiple pathway files (as CSV, JSON, or SBML)**. The “Pathway-Calculator” performs **mapping of experimental data on multiple uploaded pathways**. After uploading all previously created pathways (CSV) and the experimental data in the “Pathway-Calculator”, the calculation starts. Subsequently, the **result table** can be exported as CSV. Furthermore, **a list with all unmatched features (e.g., proteins)** can be downloaded. 
!["Pathway-Calculator"](https://github.com/danielwalke/MPA_Pathway_Tool/blob/main/images/Figure%202_Screenshot%20of%20the%20%E2%80%9CPathway-Calculator%E2%80%9D%20of%20the%20MPA_Pathway_Tool..png "Figure 2: Screenshot of the “Pathway-Calculator” of the MPA_Pathway_Tool")
**Figure 2: Screenshot of the “Pathway-Calculator” of the MPA_Pathway_Tool.**


<a name="gettingStarted"/>

## 2. Getting started
1. clone the complete project
2. import the [server-side](https://github.com/danielwalke/MPA_Pathway_Tool/tree/main/keggcalculator) as a maven project
3. start the server by running the [server](https://github.com/danielwalke/MPA_Pathway_Tool/blob/main/keggcalculator/src/main/java/main/KeggCalculatorServer.java) as a Java Application
4. install newest/recommended version of [node.js](https://nodejs.org/en/)
5. navigate in the project with your terminal
```bash
cd C:\<USERS>\<USER>\git\MPA_Pathway_Tool
```
7. install all packages on [client-side](https://github.com/danielwalke/MPA_Pathway_Tool/tree/main/keggcalculator-frontend) by navigating in the directory "keggcalculator-frontend" and typing in "npm install"
```bash
cd keggcalculator-frontend
npm install
```
6. start the web-application by typing in the command "npm start"
```bash
npm start
```


<a name="versions"/>

## 3. Versions
MPA_Pathway-Tool version 0.8:
  - unofficial initial version
  - allows creation of user- defined pathways
  - allows automated mapping of experimental data on pathways
  - already supported fomats: CSV and JSON


<a name="implementation"/>

## 4. Implementation
The MPA_Pathway_Tool is a stand-alone web application consisting of **JavaScript**, **Hypertext Markup Language 5** and **Cascading Style Sheets** on the [client-side](https://github.com/danielwalke/MPA_Pathway_Tool/tree/main/keggcalculator-frontend) and **Java** on the [server-side](https://github.com/danielwalke/MPA_Pathway_Tool/tree/main/keggcalculator). The client-side is built with the help of [ReactJS](https://reactjs.org/). We used [Create React App](https://github.com/facebook/create-react-app) for the setup of the project. Third-party dependencies have been pulled by using [Node Package Manager (npm)](https://www.npmjs.com/) (version 6.14.9). The most important dependencies are [ReactJS](https://reactjs.org/) (version 16.8.6) for using JSX syntax in our project, [Redux](https://redux.js.org/) (version 4.0.5) and [mobx](https://mobx.js.org/README.html) (version 7.0.5)- used for storing and handling states, [React-d3-graph](https://github.com/danielcaldas/react-d3-graph) (version 2.5.0)- used for visualization of pathways, [Axios](https://github.com/axios/axios) (version 0.21.0)- used for making HTTP requests from the browser, [Material-UI](https://material-ui.com/) (version 4.11.2) used for the implementation of some user-interface components, [Lodash](https://github.com/lodash/lodash) (version 4.17.21) for deep cloning objects, and [File-saver](https://github.com/eligrey/FileSaver.js) (version  2.0.5) used for saving files
A complete list of used dependencies on the client-side is listed in the [package.json] (https://github.com/danielwalke/MPA_Pathway_Tool/blob/main/keggcalculator-frontend/package.json).
We have implemented a REST-API and an algorithm for mapping data on multiple pathways in the programming language **Java (Java SE-1.8)**. Dependencies have been imported using [**Maven**](https://maven.apache.org/). We used [Gson](https://github.com/google/gson) (version 2.8.5) for converting Java objects to JSON and vice versa, [Spark](https://github.com/perwendel/spark) (version 2.6.0) for setting up the REST-API, and [JSBML](https://github.com/sbmlteam/jsbml) (version 1.5) for reading SBML- files. 


<a name="tutorial"/>

## 5. Tutorial
You can read the [tutorial](https://github.com/danielwalke/MPA_Pathway_Tool/blob/main/keggcalculator-frontend/src/tutorial/Tutorial%20MPA_Pathway_Tool.pdf) to get further informtaion about creation of pathways, mapping of experimental data further more topics. We are going to create YouTube tutorials for all functionalities in the future.

<a name="publication"/>

## 6. Publication
You will find the official publication "MPA_Pathway_Tool: User-friendly, automatic assignment of microbial community data on metabolic pathways" on "".

<a name="credits"/>

## 7. Credits
this project is collaboration by by [Daniel Walke](https://github.com/danielwalke), [Emanuel Lange](https://github.com/voidsailor) , [Kay Schallert](https://github.com/kayschallert), Prasanna Ramesh, Dr. Dirk Benndorf, Prof. Udo Reichl, and Dr. Robert Heyer


<a name="fundings"/>

## 8. Fundings
This work was supported by the German Federal Ministry of Education and Research (de.NBI network. project MetaProtServ. grant no. 031L0103). We highly appreciate their funding.


<a name="competingIntrests"/>

## 9. Competing intrests
The authors declare that they have no competing interests.
