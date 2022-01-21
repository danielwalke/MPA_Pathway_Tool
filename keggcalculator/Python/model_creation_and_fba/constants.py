DATABASES_PATH = "src/main/resources/AutoPACMEN/"
BRENDA_JSON_PATH = DATABASES_PATH + "brenda.json"
SABIO_RK_JSON_PATH = DATABASES_PATH + "sabio_rk.json"
BIGG_METABOLITE_PATH = DATABASES_PATH + "bigg_id_name_mapping.json"

NETWORK_PATH = "/network_"  # + job_id
FBA_RESULTS_PATH = "/fbaResults_"  # + job_id

MODEL_BRENDA_DB_PATH = "_model_specific_brenda.json"
MODEL_SABIO_RK_DB_PATH = "_model_specific_sabio_rk.json"
COMBINED_MODEL_DB_PATH = "_model_specific_combined_db.json"

REACTIONS_KCAT_MAPPING_PATH = "/reactions_kcat_mapping.json"

def get_job_dir_path(upload_dir: str, job_id):
    return upload_dir + job_id


def get_network_path(upload_dir: str, job_id: str):
    return get_job_dir_path(upload_dir, job_id) + NETWORK_PATH + job_id


def get_results_path(upload_dir: str, job_id: str):
    return get_job_dir_path(upload_dir, job_id) + FBA_RESULTS_PATH + job_id
