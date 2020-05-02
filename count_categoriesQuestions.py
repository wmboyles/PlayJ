"""
A super slow script meant to count the number of categories and clues (18414 and 156737 as of 5/1/2020) provided by the jService API.
"""

import requests
import json

category_count = 0
question_count = 0
bad_categories = {} # Does a category have < 5 clues in it?

while True:
    res = requests.get("http://jservice.io/api/categories?offset="+str(category_count))
    if not res: break
    
    content = json.loads(res.content)
    if len(content) == 0: break
    
    for category in content:
        category_count += 1
        qcount = category['clues_count']
        if qcount < 5:
            bad_categories.update({category['title'] : category['clues_count']})
        question_count += qcount

    if category_count % 100 == 0: 
        print(category_count, question_count)

print("Total Categories:", category_count)
print("Bad Categories:", len(bad_categories))
print("Total Questions:", question_count)
