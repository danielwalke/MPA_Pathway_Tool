# MPA_Pathway_Tool

## Table of Contents 
|content                          |
|---------------------------------|
|[1. description](#description)     |
|[2. structure](#structure)       |
|[3. getting started](#gettingStarted) |
|[4. versions](#versions)           |
|[5. tutorial](#tutorial)           |
|[6. credits](#credits)            |
|[7. fundings](#fundings)           |
|[8. competing intrests](#competingIntrests) |

<a name="description"/>

## 1. description
The MPA_Pathway_Tool is implemented in Java and ReactJS. It is freely available on http://www.mpa_pathway_tool.ovgu.de/. 
- allows **user-friendly creation of user-defined pathways** and **mapping of experimental data** on them

<a name="structure"/>

## 2. structure 
- consists of the "Pathway-Creator" and the "Pathway-Calculator"

### 2.1 Pathway-Creator
The first part of the MPA_Pathway_Tool is the “Pathway-Creator” (figure 1). It enables the **creation of user-defined pathways** by adding reactions iteratively and linking omics data to this specific pathway. The left side of the “Pathway-Creator” contains a list of buttons for **uploading experimental data** and **pathways (as CSV, JSON, and SBML)**, adding **new reactions** from KEGG, adding user-defined reactions, importing **multiple reactions**, and **downloading created pathways (as CSV, SBML, JSON, and Scalable Vector Graphics (SVG))** and **mapped data (as CSV)**. The right side contains a **graph for visualizing the created pathway**. Circular-shaped nodes are metabolites (in KEGG referred to as compounds), and diamond-shaped nodes are reactions. Nodes are connected by edges, which display the direction of a metabolic reaction. After uploading experimental data, a further user interface emerges, showing the mapping of the data set to the pathway. After sample selection, by clicking on the respective button on the bottom of the tool, **reaction nodes are colored dependent on their abundance in the sample** and the color settings. Information about abundances in all samples for a specific reaction is available by clicking on the respective reaction- node.
!["Pathway-Creator"](https://github.com/danielwalke/MPA_Pathway_Tool/blob/main/images/Figure%201_Screenshots%20of%20the%20%E2%80%9CPathway-Creator%E2%80%9D%20of%20the%20MPA_Pathway_Tool.png "Logo Title Text 1 "Figure 1: Screenshot of the “Pathway-Creator” of the MPA_Pathway_Tool")

### 2.2 Pathway-Calcualtor
The “Pathway-Calculator” consists of two upload zones, one for **experimental data (CSV)** and another for **multiple pathway files (as CSV, JSON, or SBML)**. The “Pathway-Calculator” performs **mapping of experimental data on multiple uploaded pathways**. After uploading all previously created pathways (CSV) and the experimental data in the “Pathway-Calculator”, the calculation starts. Subsequently, the **result table** can be exported as CSV. Furthermore, **a list with all unmatched features (e.g., proteins)** can be downloaded. 

<a name="gettingStarted"/>

## 3. getting started
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

## 4. versions
MPA_Pathway-Tool version 0.8:
  - unofficial initial version
  - allows creation of user- defined pathways
  - allows automated mapping of experimental data on pathways
  - already supported fomats: CSV and JSON

<a name="tutorial"/>

## 5. tutorial

<a name="credits"/>

## 6. credits
this project is collaboration by by [Daniel Walke](https://github.com/danielwalke), [Emanuel Lange](https://github.com/voidsailor) , [Kay Schallert](https://github.com/kayschallert), Prasanna Ramesh, Dr. Dirk Benndorf, Prof. Udo Reichl, and Dr. Robert Heyer


<a name="fundings"/>

## 7. fundings
This work was supported by the German Federal Ministry of Education and Research (de.NBI network. project MetaProtServ. grant no. 031L0103). We highly appreciate their funding.


<a name="competingIntrests"/>

## 8. competing intrests
The authors declare that they have no competing interests.
