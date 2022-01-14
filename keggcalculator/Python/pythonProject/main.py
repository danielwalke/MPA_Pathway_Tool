import json
import pprint
import sys
import build_model
import perform_fba
import extract_data
import perform_smoment_fba


def run_process(network_path: str, result_desination: str):
    data = extract_data.extract_data(network_path)
    model = build_model.build_model(data['networkObject'])
    non_smoment_fba_results = perform_fba.optimize(model)
    smoment_fba_results = []

    if len(data['proteinData']) != 0:
        pprint.pprint(data['proteinData'])
        smoment_fba_results = perform_smoment_fba.perform_smoment_fba(data)

    write_to_temp_file(parse_result_object_to_json(non_smoment_fba_results, smoment_fba_results), result_desination)


def parse_result_object_to_json(non_smoment_fba_results: [], smoment_fba_results: []):
    return json.dumps({
        'original': non_smoment_fba_results,
        'sMOMENT': smoment_fba_results
    })


def write_to_temp_file(result_str: str, result_desination: str):
    temp_results = open(result_desination, "w")
    temp_results.write(result_str)
    temp_results.close()


def print_model_properties(model):
    print("Reactions")
    print("---------")
    for x in model.reactions:
        print("%s : %s" % (x.id, x.reaction))

    print("")
    print("Metabolites")
    print("-----------")
    for x in model.metabolites:
        print('%9s : %s' % (x.id, x.formula))

    print("")
    print("Genes")
    print("-----")
    for x in model.genes:
        associated_ids = (i.id for i in x.reactions)
        print("%s is associated with reactions: %s" %
              (x.id, "{" + ", ".join(associated_ids) + "}"))


if __name__ == '__main__':
    print('python activated!')
    # readsbml(sys.argv[1])
    # summation(sys.argv[1], sys.argv[2])
    run_process(sys.argv[1], sys.argv[2])
