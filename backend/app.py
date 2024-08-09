from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import logging

app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')
db = client['zomato_db']
restaurants_collection = db['restaurants']
country_codes_collection = db['country_codes']

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Zomato API!"

@app.route('/api/restaurants/<string:restaurant_id>', methods=['GET'])
def get_restaurant_by_id(restaurant_id):
    try:
        # Check if the restaurant_id is a valid ObjectId
        if ObjectId.is_valid(restaurant_id):
            query = {'_id': ObjectId(restaurant_id)}
        else:
            # If it's not a valid ObjectId, assume it's a string ID in the Restaurant_ID field
            query = {'Restaurant_ID': restaurant_id}
        
        restaurant = restaurants_collection.find_one(query)
        
        if restaurant:
            country_code = restaurant.get('Country_Code')
            country = country_codes_collection.find_one({'Country_Code': country_code})
            if country:
                restaurant['Country'] = country.get('Country')
            else:
                restaurant['Country'] = 'Unknown'
            
            restaurant['_id'] = str(restaurant['_id'])
            return jsonify({
                'Restaurant_ID': restaurant.get('Restaurant_ID'),
                'Restaurant_Name': restaurant.get('Restaurant_Name'),
                'Country_Code': restaurant.get('Country_Code'),
                'Country': restaurant.get('Country'),
                'City': restaurant.get('City'),
                'Address': restaurant.get('Address'),
                'Locality': restaurant.get('Locality'),
                'Locality_Verbose': restaurant.get('Locality_Verbose'),
                'Longitude': restaurant.get('Longitude'),
                'Latitude': restaurant.get('Latitude'),
                'Cuisines': restaurant.get('Cuisines'),
                'Average_Cost_for_two': restaurant.get('Average_Cost_for_two'),
                'Currency': restaurant.get('Currency'),
                'Has_Table_booking': restaurant.get('Has_Table_booking'),
                'Has_Online_delivery': restaurant.get('Has_Online_delivery'),
                'Is_delivering_now': restaurant.get('Is_delivering_now'),
                'Switch_to_order_menu': restaurant.get('Switch_to_order_menu'),
                'Price_range': restaurant.get('Price_range'),
                'Aggregate_rating': restaurant.get('Aggregate_rating'),
                'Rating_color': restaurant.get('Rating_color'),
                'Rating_text': restaurant.get('Rating_text'),
                'Votes': restaurant.get('Votes'),
            }), 200
        
        return jsonify({'error': 'Restaurant not found'}), 404
    
    except Exception as e:
        logging.error(f"Error in get_restaurant_by_id: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/api/restaurants', methods=['GET'])
def get_list_of_restaurants():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        restaurants = list(restaurants_collection.find().skip(skip).limit(limit))
        
        for restaurant in restaurants:
            country_code = restaurant.get('Country_Code')
            country = country_codes_collection.find_one({'Country_Code': country_code})
            if country:
                restaurant['Country'] = country.get('Country')
            else:
                restaurant['Country'] = 'Unknown'
            restaurant['_id'] = str(restaurant['_id'])
        
        return jsonify(restaurants), 200
    
    except Exception as e:
        logging.error(f"Error in get_list_of_restaurants: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(port=5002)
