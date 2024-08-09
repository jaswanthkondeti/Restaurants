from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from bson.json_util import dumps


app = Flask(__name__,static_folder='static')

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['zomato_db']
collection = db['restaurants']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page',1))
        skip = (page - 1) * per_page
        cursor = collection.find().skip(skip).limit(per_page)
        restaurants = list(cursor)
        result = dumps(restaurants)
        return result, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/restaurant/<string:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    try:
        print(f"Received request for restaurant ID: {restaurant_id}")

        # Clean and convert restaurant_id
        restaurant_id = restaurant_id.strip('\"')
        res_id = int(restaurant_id)

        print(f"Cleaned restaurant ID: {res_id}")

        # Search in the nested 'restaurants' array
        restaurant = collection.find_one({
            "restaurants": {
                "$elemMatch": {
                    "restaurant.R.res_id": res_id
                }
            }
        })

        # Check if any restaurant was found
        if restaurant:
            # Filter out the specific restaurant from the 'restaurants' array
            for item in restaurant.get('restaurants', []):
                if item['restaurant']['R']['res_id'] == res_id:
                    return dumps(item['restaurant']), 200, {'Content-Type': 'application/json'}

        print(f"Restaurant with ID {res_id} not found.")
        return jsonify({"error": "Restaurant not found"}), 404
    except ValueError as ve:
        print(f"Invalid restaurant ID: {str(ve)}")
        return jsonify({"error": "Invalid restaurant ID"}), 400
    except Exception as e:
        print(f"Error fetching restaurant details: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/restaurants1/<string:restaurant_id>', methods=['GET'])
def get_restau(restaurant_id):
    try:
        print(f"Received request for restaurant ID: {restaurant_id}")

        # Clean and convert restaurant_id
        restaurant_id = restaurant_id.strip('\"')
        res_id = int(restaurant_id)

        print(f"Cleaned restaurant ID: {res_id}")

        # Search in the nested 'restaurants' array
        restaurant = collection.find_one({
            "restaurants": {
                "$elemMatch": {
                    "restaurant.R.res_id": res_id
                }
            }
        })

        # Check if any restaurant was found
        if restaurant:
            # Filter out the specific restaurant from the 'restaurants' array
            for item in restaurant.get('restaurants', []):
                if item['restaurant']['R']['res_id'] == res_id:
                    return item['restaurant']

        print(f"Restaurant with ID {res_id} not found.")
        return jsonify({"error": "Restaurant not found"}), 404
    except ValueError as ve:
        print(f"Invalid restaurant ID: {str(ve)}")
        return jsonify({"error": "Invalid restaurant ID"}), 400
    except Exception as e:
        print(f"Error fetching restaurant details: {str(e)}")
        return jsonify({"error": str(e)}), 500

    
@app.route('/restaurant/<string:restaurant_id>')
def restaurant_detail(restaurant_id):
    return render_template('restaurant.html')



if __name__ == '__main__':
    app.run(port=5001, debug=True)
