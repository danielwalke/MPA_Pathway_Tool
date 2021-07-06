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
