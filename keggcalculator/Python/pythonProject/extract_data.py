import json


def extract_data(temp_model_path: str):
    temp_file = open(temp_model_path, "r")
    data_string = temp_file.read()
    temp_file.close()

    data_dict = json.loads(data_string)

    return data_dict
