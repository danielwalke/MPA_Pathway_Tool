import json
import cobra


def extract_data(temp_model_path: str):
    with open(temp_model_path, "r") as temp_file:
        data_string = temp_file.read()

    data_dict = json.loads(data_string)

    return data_dict


def parse_result_object_to_json(non_smoment_fba_results: dict, smoment_fba_results: dict):

    return json.dumps({
        'original': [{key: non_smoment_fba_results[key]} for key in non_smoment_fba_results.keys()],
        'sMOMENT': [{key: smoment_fba_results[key]} for key in smoment_fba_results.keys()]
    })


def write_to_temp_file(result_str: str, result_desination: str):
    temp_results = open(result_desination, "w")
    temp_results.write(result_str)
    temp_results.close()


def check_molecular_masses(protein_data: list):
    for protein in protein_data:
        if hasattr(protein, 'molecularMass'):
            if type(protein['molecularMass']) == 'float':
                continue
            elif type(protein['molecularMass']) == 'int':
                protein['molecularMass'] = float(protein['molecularMass'])
            else:
                return False

    return True


def assign_proteins_to_mpa_reactions(model: cobra.Model, protein_data: dict[str: []]):
    reaction_protein_mapping = {}
    reaction_protein_stoichiometry_mapping = {}

    for protein in protein_data:
        for reaction in model.reactions:
            reaction_identifiers = reaction.annotation['ec-code'] + reaction.annotation['kegg.orthology']
            for protein_identifier in protein['koAndEc']:
                if protein_identifier in reaction_identifiers:
                    if reaction.id not in reaction_protein_mapping.keys():
                        reaction_protein_mapping[reaction.id] = []
                        reaction_protein_stoichiometry_mapping[reaction.id] = {}
                    if protein['name'] in reaction_protein_mapping[reaction.id]:
                        continue

                    reaction_protein_mapping[reaction.id].append(protein['name'])
                    reaction_protein_stoichiometry_mapping[reaction.id] = {protein['name']: {protein['name']: 1}}
                    continue

    return reaction_protein_mapping, reaction_protein_stoichiometry_mapping
