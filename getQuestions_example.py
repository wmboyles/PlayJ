"""
Example of how to get questions matching certain criteria from the API.
Also shows how to detect and reomve duplicate questions.
"""

import requests
import json

"""
Get some amount of clues from a certain category (int) with certain point value (int).
Return the list of dicts sorted alphebetically by the question text. 
May contain duplicates.
"""
def getClues(category=None, value=None, amount=1):
    url = "http://jservice.io/api/clues/?"

    if value is not None and type(value) is int and value >= 1000 and value % 1000 == 0:
        url += "value={0}&".format(value)
    if category is not None and type(category) is int and category >= 0:
        url += "category={0}&".format(category)

    res = requests.get(url)
    if not res: # if  the response is bad
        print("ERROR")

    content = json.loads(res.content)[:amount]
    return sorted(content, key = lambda clue: clue['question'])

""" Are two clues the same? """
def sameClue(clue1, clue2):
    if clue1['id'] == clue2['id']: return True
    if clue1['question'] == clue2['question'] and clue1['answer'] == clue2['answer']: return True
    return False

""" Is a clue invalid because it's missing a question or answer? """
def invalidClue(clue):
    question = clue['question']
    answer = clue['answer']
    if question is None or len(question) == 0: return True
    if answer is None or len(answer) == 0: return True
    return False

""" Remove all duplicate or invalid clues from a list of clues. """
def removeDuplicatesInvalids(clues):
    for i,clue in enumerate(clues,0):
        if invalidClue(clue) or (i != len(clues) - 1 and sameClue(clue, clues[i+1])):
            del clues[i]

    return clues

""" Print out all clues in the list of clues. """
def printClues(clues):
    for clue in clues:
        print("Category:", clue['category']['title'])
        print("    ID:", clue['category_id'])
        print("Value:", clue['value'])
        print("Question:", clue['question'])
        print("    ID:", clue['id'])
        print("Answer:", clue['answer'])
        print()


def main():
    clues = getClues(category=1, amount=25) # category 1 = politics
    clues = removeDuplicatesInvalids(clues)
    printClues(clues)
    print("Total Unique Clues:", len(clues)) # some clues are duplicates, so this number is <= amount

main()
