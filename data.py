from pymongo import MongoClient
import json

client = MongoClient('mongodb://localhost:27017/')


db = client['zomato_db']
collection = db['restaurants']


json_file_path = r'typeface/file1.json'


num_entries = 150


with open(json_file_path, 'r') as file:
    data = json.load(file)

entries_to_insert = data[:num_entries]


collection.insert_many(entries_to_insert)

print(f'{num_entries} entries have been inserted into the collection.')
