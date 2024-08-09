$(document).ready(function () {
  var pathParts = window.location.pathname.split("/");
  var restaurantId = pathParts[pathParts.length - 1];

  console.log("Extracted restaurant ID:", restaurantId);

  if (!restaurantId) {
    console.error("Restaurant ID not found in the URL.");
    return;
  }

  var cachedData = localStorage.getItem(`restaurant_${restaurantId}`);
  if (cachedData) {
    console.log("Loading data from cache");
    displayRestaurantDetails(JSON.parse(cachedData));
  } else {
    $.getJSON(`/api/restaurant/${restaurantId}`, function (data) {
      //checking whether data is valid or not
      if (data) {
        //storing data in localStorage
        localStorage.setItem(
          `restaurant_${restaurantId}`,
          JSON.stringify(data)
        );
        manageCacheSize();

        displayRestaurantDetails(data);
      } else {
        console.error("Invalid data format:", data);
        $("#restaurant-detail").html("<p>Error: Invalid data format.</p>");
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error(
        "Failed to fetch restaurant details:",
        textStatus,
        errorThrown
      );
      $("#restaurant-detail").html(
        "<p>Error: Failed to fetch restaurant details.</p>"
      );
    });
  }

  function displayRestaurantDetails(data) {
    var hasOnlineDelivery = data.has_online_delivery ? "Yes" : "No";
    var photosUrl = data.photos_url || "N/A";
    var restaurantUrl = data.url || "N/A";
    var priceRange = data.price_range || "N/A";
    var apikey = data.apikey || "N/A";
    var ratingText = data.user_rating.rating_text || "N/A";
    var ratingColor = data.user_rating.rating_color || "N/A";
    var votes = data.user_rating.votes || "N/A";
    var aggregateRating = data.user_rating.aggregate_rating || "N/A";
    var averageCostForTwo = data.average_cost_for_two || "N/A";
    var currency = data.currency || "N/A";

    var event =
      data.zomato_events && data.zomato_events.length > 0
        ? data.zomato_events[0].event
        : null;
    var title = data.title || "No title available";
    var description = data.description || "No description available";
    var eventDisplayDate = event ? event.display_date : "N/A";
    var eventEndTime = event ? event.end_time : "N/A";
    var eventDateAdded = event ? event.date_added : "N/A";
    var eventStartDate = event ? event.start_date : "N/A";

    $("#restaurant-detail").html(`
      <h1>${data.name}</h1>
      <img class="imag1" src="${data.featured_image}" alt="Featured Image" width="300">
      <p><strong>Address:</strong> ${data.location.address}</p>
      <p><strong>Cuisines:</strong> ${data.cuisines}</p>
      <p><strong>Rating:</strong> ${data.user_rating.aggregate_rating} (${ratingText})</p>
      <p><strong>Online Delivery:</strong> ${hasOnlineDelivery}</p>
      <p><strong>Price Range:</strong> ${priceRange}</p>
      <p><strong>Votes:</strong> ${votes}</p>
      <p><strong>Average Cost for Two:</strong> ${averageCostForTwo}</p>
      <p><strong>Currency:</strong> ${currency}</p>
      <p><strong>Event Name:</strong> ${title}</p>
      <p><strong>Event Display Date:</strong> ${eventDisplayDate}</p>
      <p><strong>Event End Time:</strong> ${eventEndTime}</p>
      <p><strong>Event Date Added:</strong> ${eventDateAdded}</p>
      <p><strong>Event Start Date:</strong> ${eventStartDate}</p>
      <p><strong>To view more photos</strong> <a href="${photosUrl}" target="_blank">Click here</a></p>
      <p><strong>To know more about the restaurant</strong> <a href="${restaurantUrl}" target="_blank">Click here</a></p>
    `);
  }

  function manageCacheSize() {
    const maxCacheSize = 5;

    //get all restaurant keys from localStorage
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("restaurant_")
    );
    if (keys.length > maxCacheSize) {
      //sort keys by oldest timestamp
      keys.sort((a, b) => {
        const timeA = JSON.parse(localStorage.getItem(a)).timestamp || 0;
        const timeB = JSON.parse(localStorage.getItem(b)).timestamp || 0;
        return timeA - timeB;
      });
      localStorage.removeItem(keys[0]);
    }
  }
});
