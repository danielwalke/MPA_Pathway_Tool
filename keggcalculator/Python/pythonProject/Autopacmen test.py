# from autopacmen.submodules.parse_brenda_textfile import parse_brenda_textfile
#
# parse_brenda_textfile("C:\\Users\\Emanu\\OneDrive\\Masterarbeit\\Programme\\Autopacmen\\databases\\brenda.txt",
#                         "C:\\Users\\Emanu\\OneDrive\\Masterarbeit\\Programme\\Autopacmen\\databases\\",
#                                  "C:\\Users\\Emanu\\OneDrive\\Masterarbeit\\Programme\\Autopacmen\\databases\\brenda.json")

from autopacmen.submodules.parse_brenda_json_for_model import parse_brenda_json_for_model

parse_brenda_json_for_model("C:\\Users\\Emanu\\OneDrive\\Masterarbeit\\Programme\\Escher\\e_coli_core.xml",
                            "C:\\Users\\Emanu\\OneDrive\\Masterarbeit\\Programme\\Autopacmen\\databases\\brenda.json",
                            "C:\\Users\\Emanu\\OneDrive\\Masterarbeit\\Programme\\Autopacmen\\databases\\model_specific_brenda.json")