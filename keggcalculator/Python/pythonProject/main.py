import sys
import cobra
from test_data import test_data
import fba
from os.path import join

# def readsbml(modelpath):
#     model = cobra.io.read_sbml_model(join(modelpath))
#     model.optimize()
#     print("______________________________________________________________________________")
#     print(model.summary())
#     print("______________________________________________________________________________")
#     print(model.metabolites.atp_c.summary())


if __name__ == '__main__':
    # readsbml(sys.argv[1])
    # summation(sys.argv[1], sys.argv[2])
    fba.build_model(test_data)
