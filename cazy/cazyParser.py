from bs4 import BeautifulSoup
import urllib.request
import re


def read_site(website_string):
    website_request = urllib.request.urlopen(website_string)
    website_content = website_request.read().decode("utf8")
    website_request.close()
    return website_content


def parse_site(content):
    bs = BeautifulSoup(content, "html.parser")
    prettified_content = bs.prettify()
    return prettified_content


def parse_ec_number(content_string):
    return re.findall(r"ec=\d\.[*\d]*\.[*\d]*\.[*\d]*", content_string)


def split_ec_strings(raw_ec_numbers):
    ec_number_array = []
    for raw_ec_number in raw_ec_numbers:
        ec_number_array.append(raw_ec_number[3:len(raw_ec_number)])
    return ec_number_array


def write_file(file_name, gh_to_ec_dictionary):
    file = open(file_name, "a")
    file.write("gh\tec")
    for gh_object in gh_to_ec_dictionary:
        gh_family_id = gh_object
        ec_list = gh_to_ec_dictionary[gh_object]
        for ec_number in ec_list:
            file.write("\n{}\t{}".format(gh_family_id, ec_number))
    file.close()


def get_family_name(url):
    website_url_items = url.split("/")
    gh_family_html = website_url_items[len(website_url_items) - 1]
    return gh_family_html[0:len(gh_family_html)-5]


# init dict
dictionary = {}

# init filename
fileName = r"aaToEc.csv"

# number of families inside CAZYmes
number_of_gh_families_plus_one = 172
number_of_gt_families = 115
number_of_pl_families = 42
number_of_ce_families = 20
number_of_aa_families = 17

# abbreviation of family in the links
gh = "GH"
gt = "GT"
pl = "PL"
ce = "CE"
aa = "AA"

# loop over families
for family_id in range(1, number_of_aa_families):
    # define url
    # website_url = "http://www.cazy.org/GH{}.html".format(family_id)
    website_url = "http://www.cazy.org/{}.html".format(aa + str(family_id))

    # read website
    website = read_site(website_url)
    pretty_content = parse_site(website)
    raw_ec_strings = parse_ec_number(pretty_content)
    ec_numbers = split_ec_strings(raw_ec_strings)

    # define family name
    gh_family = get_family_name(website_url)

    # add family to dict
    dictionary[gh_family] = ec_numbers


# write dict in file
write_file(fileName, dictionary)