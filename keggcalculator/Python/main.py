import json
import pprint
import sys
import copy
from model_creation_and_fba import build_model
from model_creation_and_fba import perform_fba
from model_creation_and_fba import data_manipulation
from model_creation_and_fba import constants
from model_creation_and_fba import data_manipulation


def run_process(upload_dir: str, job_id: str):

    data = data_manipulation.extract_data(constants.get_network_path(upload_dir, job_id))

    model = build_model.build_model(data['networkObject'])
    s_moment_model = build_model.build_smoment_model(copy.deepcopy(model), upload_dir, job_id, data)

    orig_model_reaction_names = [reaction.id for reaction in copy.deepcopy(model).reactions]

    fba_results = perform_fba.optimize(model, orig_model_reaction_names, True)
    smoment_fba_results = perform_fba.optimize(s_moment_model, orig_model_reaction_names, True)

    data_manipulation.write_to_temp_file(data_manipulation.parse_result_object_to_json(fba_results, smoment_fba_results),
                       constants.get_results_path(upload_dir, job_id))


if __name__ == '__main__':
    print('python activated!')
    # argv[1] - upload Dir
    # argv[2] - jobId
    run_process(sys.argv[1], sys.argv[2])
