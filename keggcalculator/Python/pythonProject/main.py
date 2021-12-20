import sys
import build_model
import perform_fba


def run_process(network_path: str, result_desination: str):
    model = build_model.build_model(network_path)

    # print("Reactions")
    # print("---------")
    # for x in model.reactions:
    #     print("%s : %s" % (x.id, x.reaction))
    #
    # print("")
    # print("Metabolites")
    # print("-----------")
    # for x in model.metabolites:
    #     print('%9s : %s' % (x.id, x.formula))
    #
    # print("")
    # print("Genes")
    # print("-----")
    # for x in model.genes:
    #     associated_ids = (i.id for i in x.reactions)
    #     print("%s is associated with reactions: %s" %
    #           (x.id, "{" + ", ".join(associated_ids) + "}"))

    solution = perform_fba.optimize(model)
    write_to_tempFile(solution, result_desination)


def write_to_tempFile(result_str: str, result_desination: str):
    temp_results = open(result_desination, "w")
    temp_results.write(result_str)
    temp_results.close()


if __name__ == '__main__':
    print('python activated!')
    # readsbml(sys.argv[1])
    # summation(sys.argv[1], sys.argv[2])
    run_process(sys.argv[1], sys.argv[2])
