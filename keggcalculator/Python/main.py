import json
import pprint
import sys
import copy
import traceback

from autopacmen_modules.helper_general import json_write
from model_creation_and_fba import build_model
from model_creation_and_fba import perform_fba
from model_creation_and_fba import constants
from model_creation_and_fba import data_manipulation
from model_creation_and_fba.exceptions import ExceptionWithCode


def run_process(upload_dir: str, job_id: str):
    try:
        data = data_manipulation.extract_data(constants.get_network_path(upload_dir, job_id))

        try:
            model = build_model.build_model(data['networkObject'])
        except Exception as e:
            raise ExceptionWithCode(1, str(e))

        try:
            s_moment_model = build_model.build_smoment_model(copy.deepcopy(model), upload_dir, job_id, data)
        except Exception as e:
            raise ExceptionWithCode(2, str(e))

        orig_model_reaction_names = [reaction.id for reaction in copy.deepcopy(model).reactions]

        try:
            fba_results = perform_fba.optimize(model, orig_model_reaction_names, True)
            smoment_fba_results = perform_fba.optimize(s_moment_model, orig_model_reaction_names, True)
        except Exception as e:
            raise ExceptionWithCode(3, str(e))

        data_manipulation.write_to_temp_file(
            data_manipulation.parse_result_object_to_json(fba_results, smoment_fba_results),
            constants.get_results_path(upload_dir, job_id))

    except Exception as e:
        print('==============')
        print(traceback.print_exc())
        print('==============')

        exception_dict = {
            'code': None,
            'message': str(e)
        }

        if hasattr(e, 'code'):
            exception_dict['code'] = e.code

        json_write(constants.get_job_dir_path(upload_dir, job_id) + '/error_log.txt', exception_dict)


if __name__ == '__main__':
    print('python activated!')
    # argv[1] - upload Dir
    # argv[2] - jobId
    run_process(sys.argv[1], sys.argv[2])
