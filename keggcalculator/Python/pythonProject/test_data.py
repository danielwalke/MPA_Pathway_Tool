# input objects
test_data = """{
    "reactions": [
        {"reactionId": "R00001",
         "reactionName": "Reaction 1",
         "lowerBound": -1000.0,
         "upperBound": 1000.0,
         "objectiveCoefficient": 0,
         "exchangeReaction": false,
         "metabolites": {
             "m_1": {
                 "metaboliteId": "C00001",
                 "stoichiometry": 1.0
             },
             "m_2": {
                 "metaboliteId": "C00002",
                 "stoichiometry": 1.0
             },
             "m_3": {
                 "metaboliteId": "C00004",
                 "stoichiometry": -1.0
             }
         }},
        {"reactionId": "R00002",
         "reactionName": "Reaction 2",
         "lowerBound": -1000.0,
         "upperBound": 1000.0,
         "objectiveCoefficient": 1,
         "exchangeReaction": false,
         "metabolites": {
             "m_1": {
                 "metaboliteId": "C00001",
                 "stoichiometry": -1.0
             },
             "m_2": {
                 "metaboliteId": "C00002",
                 "stoichiometry": -1.0
             },
             "m_3": {
                 "metaboliteId": "C00005",
                 "stoichiometry": 1.0
             }
         }},
         {"reactionId": "R00003",
         "reactionName": "Reaction 3",
         "lowerBound": -500.0,
         "upperBound": 500.0,
         "objectiveCoefficient": 0,
         "exchangeReaction": true,
         "metabolites": {
             "m_1": {
                 "metaboliteId": "C00004",
                 "stoichiometry": 1.0
             }
         }},
         {"reactionId": "R00004",
         "reactionName": "Reaction 4",
         "lowerBound": -500.0,
         "upperBound": 500.0,
         "objectiveCoefficient": 0,
         "exchangeReaction": true,
         "metabolites": {
             "m_1": {
                 "metaboliteId": "C00005",
                 "stoichiometry": 1.0
             }
         }}
    ], "metabolites": [
        {
            "metaboliteId": "C00001",
            "metaboliteName": "Metabolite 1",
            "compartment": "cytosol"
        },
        {
            "metaboliteId": "C00002",
            "metaboliteName": "Metabolite 2",
            "compartment": "cytosol"
        },
        {
            "metaboliteId": "C00004",
            "metaboliteName": "Metabolite 4",
            "compartment": "external"
        },
        {
            "metaboliteId": "C00005",
            "metaboliteName": "Metabolite 5",
            "compartment": "external"
        }
    ]
} """

test_front_end = """
{"reactions":[{"reactionId":"R00943","reactionName":"Formate:tetrahydrofolate ligase (ADP-forming); Tetrahydrofolate + Formate + ATP <=> ADP + Orthophosphate + 10-Formyltetrahydrofolate R00943","lowerBound":-1000,"upperBound":1000,"objectiveCoefficient":0,"exchangeReaction":false,"metabolites":[{"metaboliteId":"C00002","stoichiometry":1},{"metaboliteId":"C00101","stoichiometry":1},{"metaboliteId":"C00058","stoichiometry":1},{"metaboliteId":"C00008","stoichiometry":1},{"metaboliteId":"C00009","stoichiometry":1},{"metaboliteId":"C00234","stoichiometry":1}]},{"reactionId":"R01655","reactionName":"5,10-Methenyltetrahydrofolate 5-hydrolase (decyclizing); 5,10-Methenyltetrahydrofolate + H2O <=> 10-Formyltetrahydrofolate + H+ R01655","lowerBound":-1000,"upperBound":1000,"objectiveCoefficient":0,"exchangeReaction":false,"metabolites":[{"metaboliteId":"C00080","stoichiometry":1},{"metaboliteId":"C00234","stoichiometry":1},{"metaboliteId":"C00001","stoichiometry":1},{"metaboliteId":"C00445","stoichiometry":1}]},{"reactionId":"R01220","reactionName":"5,10-methylenetetrahydrofolate:NADP+ oxidoreductase; 5,10-Methylenetetrahydrofolate + NADP+ <=> 5,10-Methenyltetrahydrofolate + NADPH R01220","lowerBound":-1000,"upperBound":1000,"objectiveCoefficient":0,"exchangeReaction":false,"metabolites":[{"metaboliteId":"C00005","stoichiometry":1},{"metaboliteId":"C00445","stoichiometry":1},{"metaboliteId":"C00006","stoichiometry":1},{"metaboliteId":"C00143","stoichiometry":1}]},{"reactionId":"R07157","reactionName":"carbon-monoxide,water:ferredoxin oxidoreductase; CO + H2O + 2 Oxidized ferredoxin <=> CO2 + 2 Reduced ferredoxin + 2 H+ R07157","lowerBound":-1000,"upperBound":1000,"objectiveCoefficient":0,"exchangeReaction":false,"metabolites":[{"metaboliteId":"C00138","stoichiometry":2},{"metaboliteId":"C00080","stoichiometry":2},{"metaboliteId":"C00011","stoichiometry":1},{"metaboliteId":"C00001","stoichiometry":1},{"metaboliteId":"C00139","stoichiometry":2},{"metaboliteId":"C00237","stoichiometry":1}]},{"reactionId":"R10243","reactionName":"Tetrahydrofolate + Acetyl-CoA <=> 5-Methyltetrahydrofolate + CoA + CO R10243","lowerBound":-1000,"upperBound":1000,"objectiveCoefficient":0,"exchangeReaction":false,"metabolites":[{"metaboliteId":"C00010","stoichiometry":1},{"metaboliteId":"C00237","stoichiometry":1},{"metaboliteId":"C00440","stoichiometry":1},{"metaboliteId":"C00101","stoichiometry":1},{"metaboliteId":"C00024","stoichiometry":1}]},{"reactionId":"R01224","reactionName":"5-methyltetrahydrofolate:NADP+ oxidoreductase; 5-Methyltetrahydrofolate + NADP+ <=> 5,10-Methylenetetrahydrofolate + NADPH + H+ R01224","lowerBound":-1000,"upperBound":1000,"objectiveCoefficient":0,"exchangeReaction":false,"metabolites":[{"metaboliteId":"C00005","stoichiometry":1},{"metaboliteId":"C00080","stoichiometry":1},{"metaboliteId":"C00143","stoichiometry":1},{"metaboliteId":"C00006","stoichiometry":1},{"metaboliteId":"C00440","stoichiometry":1}]}],"metabolites":["{\"metaboliteId\":\"C00002\",\"metabliteName\":\"ATP; Adenosine 5'-triphosphate C00002\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00101\",\"metabliteName\":\"Tetrahydrofolate; 5,6,7,8-Tetrahydrofolate; Tetrahydrofolic acid; THF; (6S)-Tetrahydrofolate; (6S)-Tetrahydrofolic acid; (6S)-THFA C00101\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00058\",\"metabliteName\":\"Formate; Methanoic acid; Formic acid C00058\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00008\",\"metabliteName\":\"ADP; Adenosine 5'-diphosphate C00008\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00009\",\"metabliteName\":\"Orthophosphate; Phosphate; Phosphoric acid; Orthophosphoric acid C00009\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00234\",\"metabliteName\":\"10-Formyltetrahydrofolate; 10-Formyl-THF C00234\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00080\",\"metabliteName\":\"0__H+; Hydron C00080\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00001\",\"metabliteName\":\"0__H2O; Water C00001\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00445\",\"metabliteName\":\"5,10-Methenyltetrahydrofolate C00445\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00005\",\"metabliteName\":\"NADPH; TPNH; Reduced nicotinamide adenine dinucleotide phosphate C00005\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00006\",\"metabliteName\":\"NADP+; NADP; Nicotinamide adenine dinucleotide phosphate; beta-Nicotinamide adenine dinucleotide phosphate; TPN; Triphosphopyridine nucleotide; beta-NADP+ C00006\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00143\",\"metabliteName\":\"5,10-Methylenetetrahydrofolate; (6R)-5,10-Methylenetetrahydrofolate; 5,10-Methylene-THF C00143\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00138\",\"metabliteName\":\"Reduced ferredoxin; Reduced ferredoxin [iron-sulfur] cluster C00138\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00080\",\"metabliteName\":\"3__H+; Hydron C00080\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00011\",\"metabliteName\":\"CO2; Carbon dioxide C00011\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00001\",\"metabliteName\":\"1__H2O; Water C00001\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00139\",\"metabliteName\":\"Oxidized ferredoxin; Oxidized ferredoxin [iron-sulfur] cluster C00139\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00237\",\"metabliteName\":\"CO; Carbon monoxide C00237\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00010\",\"metabliteName\":\"CoA; Coenzyme A; CoA-SH C00010\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00440\",\"metabliteName\":\"5-Methyltetrahydrofolate C00440\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00024\",\"metabliteName\":\"Acetyl-CoA; Acetyl coenzyme A C00024\",\"compartment\":\"cytosol\"}","{\"metaboliteId\":\"C00080\",\"metabliteName\":\"H+; Hydron C00080\",\"compartment\":\"cytosol\"}"]}
"""