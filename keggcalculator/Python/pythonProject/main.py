import sys
import build_model
import perform_fba

def run_process(temp_model_path: str):
    model = build_model.build_model(temp_model_path)
    solution = perform_fba.optimize(model)
    write_to_tempFile(solution)

def write_to_tempFile(result_str: str):
    temp_results = open("temp\\tempResults.txt", "w")
    temp_results.write(result_str)
    temp_results.close()

if __name__ == '__main__':
    # readsbml(sys.argv[1])
    # summation(sys.argv[1], sys.argv[2])
    run_process(sys.argv[1])

