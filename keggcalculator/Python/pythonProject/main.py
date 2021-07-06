import sys
import cobra
from test_data import test_data
import build_model
import perform_fba
from os.path import join

def run_process(test_data):
    model = build_model.build_model(test_data)
    solution = perform_fba.optimize(model)

    print(solution)


if __name__ == '__main__':
    # readsbml(sys.argv[1])
    # summation(sys.argv[1], sys.argv[2])
    run_process(sys.argv[1])
