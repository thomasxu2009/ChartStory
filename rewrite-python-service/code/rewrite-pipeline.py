'''
-*- coding: utf-8 -*-
Copyright (C) 2020/1/14 
Author: Xin Qian

This script implements the rule-based re-write pipeline from a set of .JSON data fact to a coherent paragraphs.


TODO: make it a flask service
Reference: the flask API implementation from Knowledge Compressor project python-service

'''
import re
import time
import unicodedata
import sys

FILE_MODE = "FILE"
STRING_MODE = "STRING"

MODE = STRING_MODE  # FILE_MODE

MODE = STRING_MODE if len(sys.argv) == 2 else FILE_MODE  # FILE_MODE

'''

With String IO mode, (tutorial from https://healeycodes.com/javascript/python/beginners/webdev/2019/04/11/talking-between-languages.html)

usage: python rewrite-pipeline.py [json_string]

Example: 

(For gun/datafact38.json) python rewrite-pipeline.py '[{"id": "", "type": "ExtremeValueFact", "tier": "1", "interestingness": "2.6944444444444446", "taskCategory": "Extremum", "extremeFunction": "MIN", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "category", "primaryTargetObject": "5", "secondaryTargetObject": "Accidental", "content": "Itmes with 5 (education) and Accidental (intent) has the lowest COUNT(*) (28)", "attributes": ["education", "intent", "COUNT(*)"], "keywords": ["worst", "bad", "low", "lowest", "least", "decrease", "decreasing", "extreme"], "typeInterestingness": "0.4444444444444444", "attributeInterestingness": "0.25"}, {"id": "", "type": "ExtremeValueFact", "tier": "1", "interestingness": "2.6944444444444446", "taskCategory": "Extremum", "extremeFunction": "MAX", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "category", "primaryTargetObject": "2", "secondaryTargetObject": "Suicide", "content": "Itmes with 2 (education) and Suicide (intent) has the highest COUNT(*) (26321)", "attributes": ["education", "intent", "COUNT(*)"], "keywords": ["best", "good", "high", "highest", "increase", "increasing", "extreme"], "typeInterestingness": "0.4444444444444444", "attributeInterestingness": "0.25"}, {"id": "", "type": "ExtremeValueFact", "tier": "2", "interestingness": "1.6944444444444444", "taskCategory": "Extremum", "extremeFunction": "MIN", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "category", "primaryTargetObject": "4", "secondaryTargetObject": "Accidental", "content": "Itmes with 4 (education) and Accidental (intent) has the second lowest COUNT(*) (146)", "attributes": ["education", "intent", "COUNT(*)"], "keywords": ["worst", "bad", "low", "lowest", "least", "decrease", "decreasing", "extreme"], "typeInterestingness": "0.4444444444444444", "attributeInterestingness": "0.25"}, {"id": "", "type": "ExtremeValueFact", "tier": "2", "interestingness": "1.6944444444444444", "taskCategory": "Extremum", "extremeFunction": "MAX", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "category", "primaryTargetObject": "2", "secondaryTargetObject": "Homicide", "content": "Itmes with 2 (education) and Homicide (intent) has the second highest COUNT(*) (15649)", "attributes": ["education", "intent", "COUNT(*)"], "keywords": ["best", "good", "high", "highest", "increase", "increasing", "extreme"], "typeInterestingness": "0.4444444444444444", "attributeInterestingness": "0.25"}]'
(For globalTerr/datafact3-rewrite.json) python rewrite-pipeline.py '[{"id": "", "type": "ExtremeValueFact", "tier": "1", "interestingness": "7.333333333333333", "taskCategory": "Extremum", "extremeFunction": "MIN", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "", "primaryTargetObject": "2004", "secondaryTargetObject": "", "content": "2004 (iyear) has the lowest Attack Count (319)", "attributes": ["iyear", "Attack Count"], "keywords": ["worst", "bad", "low", "lowest", "least", "decrease", "decreasing", "extreme"], "typeInterestingness": "1", "attributeInterestingness": "0.6666666666666666"}, {"id": "", "type": "ExtremeValueFact", "tier": "1", "interestingness": "7.333333333333333", "taskCategory": "Extremum", "extremeFunction": "MAX", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "", "primaryTargetObject": "2014", "secondaryTargetObject": "", "content": "2014 (iyear) has the highest Attack Count (3925)", "attributes": ["iyear", "Attack Count"], "keywords": ["best", "good", "high", "highest", "increase", "increasing", "extreme"], "typeInterestingness": "1", "attributeInterestingness": "0.6666666666666666"}, {"id": "", "type": "ExtremeValueFact", "tier": "2", "interestingness": "5.333333333333333", "taskCategory": "Extremum", "extremeFunction": "MIN", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "", "primaryTargetObject": "2005", "secondaryTargetObject": "", "content": "2005 (iyear) has the second lowest Attack Count (618)", "attributes": ["iyear", "Attack Count"], "keywords": ["worst", "bad", "low", "lowest", "least", "decrease", "decreasing", "extreme"], "typeInterestingness": "1", "attributeInterestingness": "0.6666666666666666"}, {"id": "", "type": "ExtremeValueFact", "tier": "2", "interestingness": "5.333333333333333", "taskCategory": "Extremum", "extremeFunction": "MAX", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "", "primaryTargetObject": "2013", "secondaryTargetObject": "", "content": "2013 (iyear) has the second highest Attack Count (2849)", "attributes": ["iyear", "Attack Count"], "keywords": ["best", "good", "high", "highest", "increase", "increasing", "extreme"], "typeInterestingness": "1", "attributeInterestingness": "0.6666666666666666"}]'
(For college/datafact21-rewrite.json) python rewrite-pipeline.py '[{"id": "", "type": "ExtremeValueFact", "tier": "1", "interestingness": "4", "taskCategory": "Extremum", "extremeFunction": "MIN", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "category", "primaryTargetObject": "Large City", "secondaryTargetObject": "9565", "content": "Itmes with Large City (Locale) and 9565 (AverageFacultySalary) has the lowest AverageFamilyIncome (120106.07)", "attributes": ["Locale", "AverageFacultySalary", "AverageFamilyIncome"], "keywords": ["worst", "bad", "low", "lowest", "least", "decrease", "decreasing", "extreme"]}, {"id": "", "type": "ExtremeValueFact", "tier": "1", "interestingness": "4", "taskCategory": "Extremum", "extremeFunction": "MAX", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "category", "primaryTargetObject": "Large City", "secondaryTargetObject": "8346", "content": "Itmes with Large City (Locale) and 8346 (AverageFacultySalary) has the highest AverageFamilyIncome (134101.78)", "attributes": ["Locale", "AverageFacultySalary", "AverageFamilyIncome"], "keywords": ["best", "good", "high", "highest", "increase", "increasing", "extreme"]}, {"id": "", "type": "ExtremeValueFact", "tier": "2", "interestingness": "2", "taskCategory": "Extremum", "extremeFunction": "MIN", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "category", "primaryTargetObject": "Mid-size City", "secondaryTargetObject": "11662", "content": "Itmes with Mid-size City (Locale) and 11662 (AverageFacultySalary) has the second lowest AverageFamilyIncome (120161.97)", "attributes": ["Locale", "AverageFacultySalary", "AverageFamilyIncome"], "keywords": ["worst", "bad", "low", "lowest", "least", "decrease", "decreasing", "extreme"]}, {"id": "", "type": "ExtremeValueFact", "tier": "2", "interestingness": "2", "taskCategory": "Extremum", "extremeFunction": "MAX", "primaryTargetObjectType": "category", "secondaryTargetObjectType": "category", "primaryTargetObject": "Distant Town", "secondaryTargetObject": "12144", "content": "Itmes with Distant Town (Locale) and 12144 (AverageFacultySalary) has the second highest AverageFamilyIncome (132813.41)", "attributes": ["Locale", "AverageFacultySalary", "AverageFamilyIncome"], "keywords": ["best", "good", "high", "highest", "increase", "increasing", "extreme"]}]'

'''



'''
With File IO mode,

usage: python rewrite-pipeline.py [fin] [fout]

Example: 

For the globalTerr dataset

python rewrite-pipeline.py ../data/globalTerr/datafact1.json ../data/globalTerr/datafact1-rewrite.json
python rewrite-pipeline.py ../data/globalTerr/datafact2.json ../data/globalTerr/datafact2-rewrite.json
python rewrite-pipeline.py ../data/globalTerr/datafact3.json ../data/globalTerr/datafact3-rewrite.json
python rewrite-pipeline.py ../data/globalTerr/datafact4.json ../data/globalTerr/datafact4-rewrite.json
python rewrite-pipeline.py ../data/globalTerr/datafact5.json ../data/globalTerr/datafact5-rewrite.json
python rewrite-pipeline.py ../data/globalTerr/datafact6.json ../data/globalTerr/datafact6-rewrite.json
python rewrite-pipeline.py ../data/globalTerr/datafact7.json ../data/globalTerr/datafact7-rewrite.json



For the college dataset
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact18.json ../data/college-unit-name-value-swapped/datafact18-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact19.json ../data/college-unit-name-value-swapped/datafact19-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact20.json ../data/college-unit-name-value-swapped/datafact20-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact21.json ../data/college-unit-name-value-swapped/datafact21-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact22.json ../data/college-unit-name-value-swapped/datafact22-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact23.json ../data/college-unit-name-value-swapped/datafact23-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact24.json ../data/college-unit-name-value-swapped/datafact24-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact25.json ../data/college-unit-name-value-swapped/datafact25-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact26.json ../data/college-unit-name-value-swapped/datafact26-rewrite.json
python rewrite-pipeline.py ../data/college-unit-name-value-swapped/datafact27.json ../data/college-unit-name-value-swapped/datafact27-rewrite.json

python rewrite-pipeline.py ../data/college/datafact18.json ../data/college/datafact18-rewrite.json
python rewrite-pipeline.py ../data/college/datafact19.json ../data/college/datafact19-rewrite.json
python rewrite-pipeline.py ../data/college/datafact20.json ../data/college/datafact20-rewrite.json
python rewrite-pipeline.py ../data/college/datafact21.json ../data/college/datafact21-rewrite.json
python rewrite-pipeline.py ../data/college/datafact22.json ../data/college/datafact22-rewrite.json
python rewrite-pipeline.py ../data/college/datafact23.json ../data/college/datafact23-rewrite.json
python rewrite-pipeline.py ../data/college/datafact24.json ../data/college/datafact24-rewrite.json
python rewrite-pipeline.py ../data/college/datafact25.json ../data/college/datafact25-rewrite.json
python rewrite-pipeline.py ../data/college/datafact26.json ../data/college/datafact26-rewrite.json
python rewrite-pipeline.py ../data/college/datafact27.json ../data/college/datafact27-rewrite.json



For the gun dataset
python rewrite-pipeline.py ../data/gun/datafact28.json ../data/gun/datafact28-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact29.json ../data/gun/datafact29-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact30.json ../data/gun/datafact30-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact31.json ../data/gun/datafact31-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact32.json ../data/gun/datafact32-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact33.json ../data/gun/datafact33-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact34.json ../data/gun/datafact34-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact35.json ../data/gun/datafact35-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact36.json ../data/gun/datafact36-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact37.json ../data/gun/datafact37-rewrite.json
python rewrite-pipeline.py ../data/gun/datafact38.json ../data/gun/datafact38-rewrite.json


To upload and run in server, if Google does not in your area:

scp -r rewrite-python-service/code/ chen@100.15.126.133:/home/chen/xinq/20Spring/chartStories/


'''

### Define Input, Output, and Logging
import json
import random

# import logging

# logging.basicConfig(filename="./logging/" + str(int(time.time())), level=logging.INFO)

### Read JSON formatted data through file
if MODE == FILE_MODE:
    fin = sys.argv[1]
    fout = sys.argv[2]

    data_facts = json.load(open(fin, "r"))
    print(json.dumps(data_facts))
    input()

elif MODE == STRING_MODE:
    data_facts = json.loads(sys.argv[1])

# logging.info('%s %s', "Data facts are", data_facts)

'''
Pipeline proposal 1: replacing templat-ed single data facts,
e.g. rewrite text in parentheses attributes (unit names)
'''

import spacy
from spacy.tokenizer import Tokenizer
from spacy.lang.en import English

nlp = English()
# Create a blank Tokenizer with just the English vocab
tokenizer = Tokenizer(nlp.vocab)

REWRITE_CONTENT = "content_rewritted"

abbreviated_values = {"AverageFamilyIncome": "average family income", "AverageCost": "average cost",
                      "AdmissionRate": "admission rate", "AverageFacultySalary": "average faculty salary"}
rewritten_data_facts = []
for data_fact in data_facts:
    current_data_fact_tokens = []
    sent = data_fact['content']
    tokens = tokenizer(sent)
    for token in tokens:

        ## If token has all digit

        ## Regex sub 1: substitute value as explicit, of XXX, and abbreviation into the real worlds

        if re.match(r'\([0-9\.]+\)', token.text):
            current_data_fact_tokens.append("of")  ## Potentially us ", where the xxx is" from data_fact["attributes"]
            value = (re.search(r'\(([0-9\.]+)\)', token.text).group(1))

            current_data_fact_tokens.append(value)
            assert 'value' not in data_fact
            data_fact['value'] = float(value)

        elif re.match(r'\(.*\)', token.text):
            a = ""
            while len(current_data_fact_tokens) > 0 and current_data_fact_tokens[-1] not in ["for", 'and', 'with']:
                a = current_data_fact_tokens.pop() + " " + a
            a = a.strip()
            current_data_fact_tokens.append("the")
            abbrv_to_real_words = token.text
            abbrv_to_real_words = abbrv_to_real_words.replace("(weaptype1_txt)", "weapon type").replace(
                "(targtype1_txt)", "target type").replace("(iyear)",
                                                          "year").replace("(provstate)", "province/state").replace(
                "(country_txt)", "country").replace("(region_txt)", "region").replace("(Control)",
                                                                                      "control type").replace(
                "(control)", "control type").replace(
                "(Locale)", "Locale").replace("(Region)", "region").replace("(locale)", "locale").replace("(year)",
                                                                                                          "year").replace(
                "(month)", "month").replace("(sex)", "sex").replace("(intent)", "intent").replace("(race)",
                                                                                                  "race").replace(
                "(age)", "age").replace("(place)", "place").replace("(averagefacultysalary)",
                                                                    "average faculty salary").replace("(admissionrate)",
                                                                                                      "admission rate").replace(
                "(AverageFacultySalary)", "average faculty salary").replace("(AdmissionRate)",
                                                                            "admission rate").replace("(education)",
                                                                                                      "education")
            for real_word in abbrv_to_real_words.split():
                current_data_fact_tokens.append(real_word)
            current_data_fact_tokens.append("of")

            data_fact['attributes'] = [
                element if "(" + element + ")" != token.text else "the " + abbrv_to_real_words + " of" for element
                in data_fact['attributes']]
            # print(data_fact['attributes'])
            # input()

            current_data_fact_tokens.append(a)

            # print(data_fact['attributes'])
        elif "_" in token.text:
            current_data_fact_tokens.append(
                token.text.replace("targtype1_txts", "target types").replace("provstates", "provinces/states"))

        elif token.text in abbreviated_values:
            current_data_fact_tokens.append(abbreviated_values[token.text])
            data_fact['attributes'] = [element if element != token.text else abbreviated_values[token.text] for element
                                       in data_fact['attributes']]


        else:
            current_data_fact_tokens.append(token.text)

    ## Then, replace those with slashes
    # for current_data_fact_tokens:

    ## logging.info("Current data fact tokens", current_data_fact_tokens)

    data_fact[REWRITE_CONTENT] = " ".join(current_data_fact_tokens).lower()
    # data_fact[REWRITE_CONTENT] = data_fact[REWRITE_CONTENT][0:1].upper() + data_fact[REWRITE_CONTENT][1:]

    # print(type(token.text))

    # print(sent)
    # for token in sent.

# print(data_facts)

'''
Pipeline proposal 2: rank the importance of each data fact, based on (1) overall importance; (2) how close to last data fact
'''

ranked_data_facts = []


def rank_score(data_fact):
    score = 0
    score += 2 if data_fact['type'] == "RelativeValueFact" else (
        (-1 * 0.5 * int(data_fact['tier']) + (0.25 if data_fact['extremeFunction'] == "MAX" else 0)) if data_fact[
                                                                                                            'type'] == "ExtremeValueFact" else (
            3 if data_fact['type'] == "DerivedValueFact" else 0))
    return float(score)


## Select the first data_fact by type and tier

# nonlocal data_facts_selected
data_facts_selected = [False] * len(data_facts)

# logging.info('%s %s', "Rank score for data facts", [rank_score(data_fact) for data_fact in data_facts])
own_importance = sorted(range(len(data_facts)), key=lambda idx: rank_score(data_facts[idx]), reverse=True)
# logging.info('%s %s', "Data fact indexes, ranked by importance", own_importance)


def sorted_relevant_data_fact_idxs(data_fact):
    if data_fact['type'] == 'DerivedValueFact':
        attribute = data_fact['attributes'][-1]
        relevant_data_fact_idxs = filter(lambda idx: attribute in data_facts[idx]['attributes'], range(len(data_facts)))



    elif data_fact['type'] == 'ExtremeValueFact' and data_fact['extremeFunction'] == 'MAX':
        relevant_data_fact_idxs = filter(lambda idx: (
                data_facts[idx]['type'] == 'ExtremeValueFact' and data_facts[idx]['extremeFunction'] == 'MIN' and
                data_facts[idx]['tier'] == data_fact['tier']), range(len(data_facts)))

        source_value = data_fact['value']
        for idx in relevant_data_fact_idxs:

            for duplicated_word_idx, word in enumerate(data_facts[idx][
                                                           REWRITE_CONTENT].lower().split()):
                if word == data_fact[REWRITE_CONTENT].lower().split()[duplicated_word_idx]:
                    continue
                else:
                    break

            deduped_rewrite_content = " ".join(data_facts[idx][
                                                   REWRITE_CONTENT].lower().split()[duplicated_word_idx:])

            target_value = data_facts[idx]['value']

            if target_value < 0.1 * source_value or target_value > 10 * source_value:

                contrasting_words = ["whereas", "in contrast,", "conversely", "contrarily", "differently",
                                     "contrariwise"]
                use_which_idx = random.randint(0, len(contrasting_words) - 1)
                data_facts[idx][REWRITE_CONTENT] = ", " + contrasting_words[
                    use_which_idx] + " " + deduped_rewrite_content  # data_facts[idx][
                # REWRITE_CONTENT].lower()


            else:
                colisting_words = ["comparatively", "correspondingly", "whilst", "similarly", ]
                use_which_idx = random.randint(0, len(colisting_words) - 1)
                data_facts[idx][REWRITE_CONTENT] = ", " + colisting_words[
                    use_which_idx] + " " + deduped_rewrite_content  # data_facts[idx][REWRITE_CONTENT].lower()


    elif data_fact['type'] == 'RelativeValueFact':
        relevant_data_fact_idxs = list(
            filter(lambda idx: 'primaryTargetObject' in data_facts[idx] and data_facts[idx]['primaryTargetObject'] ==
                               data_fact['targetCategory'],
                   range(len(data_facts)))) + list(
            filter(lambda idx: 'secondaryTargetObjectType' in data_facts[idx] and data_facts[idx][
                'secondaryTargetObjectType'] == data_fact['targetCategory'],
                   range(len(data_facts)))) + list(
            filter(lambda idx: 'primaryTargetObject' in data_facts[idx] and data_facts[idx]['primaryTargetObject'] ==
                               data_fact['sourceCategory'],
                   range(len(data_facts)))) + list(
            filter(lambda idx: 'secondaryTargetObjectType' in data_facts[idx] and data_facts[idx][
                'secondaryTargetObjectType'] == data_fact['sourceCategory'],
                   range(len(data_facts))))

    else:
        relevant_data_fact_idxs = []

    return sorted(relevant_data_fact_idxs, key=lambda idx: rank_score(data_facts[idx]), reverse=True)

    ### Here we could abbreviate relevant data fact based on the source data fact


def insert_data_fact_into_ranking(first_data_fact_idx):
    if all(data_facts_selected):
        return

    if data_facts_selected[first_data_fact_idx] == False:
        data_facts_selected[first_data_fact_idx] = True
        ranked_data_facts.append(data_facts[first_data_fact_idx])
        for relevant_data_fact_idx in sorted_relevant_data_fact_idxs(ranked_data_facts[-1]):
            insert_data_fact_into_ranking(relevant_data_fact_idx)

    else:  ### If this data_fact has been inserted
        return


# ranked_data_facts.append(first_data_fact)


# ranked_data_facts += []  # get the highest rank value index sorted(data_facts, lambda data_fact: rank_score(data_fact))]
for sorted_idx in own_importance:
    if data_facts_selected[sorted_idx] == False:
        insert_data_fact_into_ranking(sorted_idx)

'''
Pipeline proposal 3: deduplicate and replace with pronoun
'''
for first_fact, second_fact in zip(ranked_data_facts, ranked_data_facts[1:]):
    if first_fact['type'] != second_fact['type']:
        continue
    for attribute in second_fact['attributes']:
        # logging.info('%s %s %s', "Current attribute to be deduplicated", attribute.lower(), first_fact[REWRITE_CONTENT])
        # print(first_fact[REWRITE_CONTENT], "\n", second_fact[REWRITE_CONTENT], "\n", attribute, "\n")
        if attribute.lower() in first_fact[REWRITE_CONTENT] and attribute.lower() in second_fact[REWRITE_CONTENT]:
            # second_fact[REWRITE_CONTENT] = second_fact[REWRITE_CONTENT].replace(attribute.lower() + " of", "of that as")
            second_fact[REWRITE_CONTENT] = re.sub(r'(.+)' + re.escape(attribute.lower()) + " of", r"\1of that as",
                                                  second_fact[REWRITE_CONTENT])
            # deduplicated_data_facts+=[second_fact]
            # break

# print("\n".join([str(element[REWRITE_CONTENT]) for element in ranked_data_facts]))

concatenated_data_facts = ""
for idx, data_fact in enumerate(ranked_data_facts):
    if "," != data_fact[REWRITE_CONTENT][0] and idx != 0:
        concatenated_data_facts += ". " + data_fact[REWRITE_CONTENT][0:1].upper() + data_fact[REWRITE_CONTENT][1:]
    elif idx == 0:
        concatenated_data_facts += data_fact[REWRITE_CONTENT][0:1].upper() + data_fact[REWRITE_CONTENT][1:]
    else:
        concatenated_data_facts += data_fact[REWRITE_CONTENT]

concatenated_data_facts += "."

'''TODO: combine all data facts related to outlier into one data fact '''

'''
Pipieline proposal 4: invoke knowledge base and comic ending, and concatenate those information

TODO: run on the server instead of where Xin is right now
'''

import tagme

USE_TAGME = True

entity_wiki_pages = {}

if USE_TAGME:

    tagme.GCUBE_TOKEN = "462a9f90-dc38-4cda-a1ff-13afcb972fc5-843339462"

    lunch_annotations = tagme.annotate(concatenated_data_facts)

    entities_to_explain = []
    # Print annotations with a score higher than 0.1

    try:
        for ann in lunch_annotations.get_annotations(0.2):
            # logging.info('%s %s', "Entity title", ann.__dict__['entity_title'])
            entity = ann.__dict__['entity_title']
            #if entity in concatenated_data_facts:
            entities_to_explain += [entity]
    except:
        print("TagMe annotation had some issue")
        # logging.error("TagMe annotation had some issue")

    entities_to_explain = list(set(entities_to_explain))
    # if len(entities_to_explain) > 0:
    #     concatenated_data_facts += "\n\nBelow are Wikipedia entries about " + ", ".join(
    #         entities_to_explain) + ":"

    import wikipediaapi


    def get_first_sent(content):
        return re.sub(r'\([^)]*\)', '', (content[:content.index(".") + 1]))


    def normalize(text):
        # return filter(onlyascii,text)
        return re.sub(r'\s+', ' ', text.encode('ascii', errors='ignore').decode())
        # return unicodedata.normalize('NFD', text)


    # def onlyascii(char):
    #     '''Normalize text string to have ascii only'''
    #     if ord(char) < 48 or ord(char) > 127:
    #         return ''
    #     else:
    #         return char

    try:
        for entity in entities_to_explain:
            wiki_wiki = wikipediaapi.Wikipedia('en')
            page_py = wiki_wiki.page(entity)
            # logging.info(("Page for " + entity + " - Exists: %s") % page_py.exists())
            # logging.info(("Page for " + entity + " - Summary: %s") % get_first_sent(page_py.summary))

            # concatenated_data_facts += " " + normalize(get_first_sent(page_py.summary))
            entity_wiki_pages[entity.lower()] = page_py.fullurl
    except Exception as e:
        print(e)
        concatenated_data_facts += " Unfortunately, Wikipedia API is not working well for this IP."

### Case 1:
'''
  {
    "id": "",
    "type": "RelativeValueFact",
    "tier": "1",
    "interestingness": "6.60144927536232",
    "taskCategory": "Distribution",
    "primaryTargetObjectType": "category",
    "secondaryTargetObjectType": "",
    "primaryTargetObject": "",
    "secondaryTargetObject": "",
    "diffFactor": "328.67",
    "sourceCategory": "Tourists",
    "targetCategory": "Private Citizens & Property",  ## This is said first 
    "attributes": [
      "targtype1_txt",
      "Attack Count"
    ],
    "keywords": [
      "distribution",
      "spread",
      "range",
      "compare"
    ],
    "content": "The Attack Count for Private Citizens & Property is 328.67 times of that for Tourists",
    "typeInterestingness": "0.967391304347826",
    "attributeInterestingness": "0.3333333333333342"
  },
'''

### Case 2:
'''
    "type": "ExtremeValueFact",
    "tier": "1", or "2"
    "interestingness": "2.791666666666667",
    "taskCategory": "Extremum",
    "extremeFunction": "MIN",
    "primaryTargetObjectType": "item",
    "secondaryTargetObjectType": "category",
    "primaryTargetObject": "Melee",
    "secondaryTargetObject": "2004",
    "content": "Melee (weaptype1_txt) has the lowest Attack Count (1) for 2004 (iyear)",
    "attributes": [
      "iyear",
      "Attack Count",
      "weaptype1_txt"
    ],
'''

### Cases: "type" DerivedValueFact
'''
{
    "id": "",
    "type": "DerivedValueFact",
    "tier": "1",
    "interestingness": "4.688405797101451",
    "taskCategory": "DerivedValue",
    "primaryTargetObjectType": "value",
    "secondaryTargetObjectType": "",
    "value": "4519",
    "content": "Total Attack Count across all targtype1_txts is 4519",
    "attributes": [
      "targtype1_txt",
      "Attack Count"
    ],
    "typeInterestingness": "0.010869565217391304",
    "attributeInterestingness": "0.3333333333333342"
  }
'''

## Pipeline proposal 4: call for Google Custom Search API, and set the query as the entity name in the system, append
# the first sentence in search result
## Reference: https://developers.google.com/custom-search/v1/overview, use xintest API key
## Python guide: https://www.simplifiedpython.net/google-custom-search-api-python/


### Dump into the json file

jobject = {}

# jobject['original_data_facts'] = data_facts
# logging.info('%s %s', "Concatenated data facts", concatenated_data_facts)
cutoff_char_len = 700
jobject['rewritten_data_facts'] = concatenated_data_facts[:cutoff_char_len] + "..." if len(
    concatenated_data_facts) > cutoff_char_len else concatenated_data_facts

jobject['entity_wiki_pages'] = entity_wiki_pages

if MODE==FILE_MODE:
    json.dump(jobject, open(fout, "w"), indent=2)
    fout_txt = open(fout.replace(".json", ".txt"), "w")
    fout_txt.write(jobject['rewritten_data_facts'])

else:
    print(json.dumps(jobject))
