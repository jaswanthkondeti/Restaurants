$(document).ready(function () {
  var page = 1; // Initialize the page variable

  function loadRestaurants() {
    $.getJSON(`/api/restaurants?page=${page}&per_page=1`, function (response) {
      console.log(response); // Debug line: log the entire response

      $("#restaurant-list").empty();

      if (Array.isArray(response)) {
        response.forEach(function (item) {
          console.log(item); // Debug line: log each item in the response

          if (item.restaurants && Array.isArray(item.restaurants)) {
            item.restaurants.forEach(function (restaurant) {
              if (restaurant && restaurant.restaurant) {
                var rest = restaurant.restaurant;
                console.log(rest.R.res_id); // Debug line: log the restaurant ID
                $("#restaurant-list").append(
                  `<li style="display: flex; flex-direction: column; align-items: flex-start; width: 100%;">
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                      <div style="display: flex; align-items: center;">
                        <img class="image" loading="lazy" style="width: 250px; height: 120px; margin-right: 10px;" src="${rest.featured_image}" alt="${rest.name}" />
                          <div style="margin-left:10px">
                              <a href="/restaurant/${rest.R.res_id}" style="display: block;">${rest.name}</a>
                              <p style="margin: 5px 0;"><strong>Address:</strong> ${rest.location.address}</p>
                          </div>
                      </div>
                      <div style="display: flex; align-items: center;">
                        <span style="color: #${rest.user_rating.rating_color}; margin-right: 5px; margin-top:3px;">${rest.user_rating.rating_text}</span>
                        <span class="rating" style="color: #${rest.user_rating.rating_color};">${rest.user_rating.aggregate_rating} ★</span>
                      </div>
                    </div>
                  </li>`
                );
              } else {
                console.warn("Invalid restaurant data:", restaurant);
              }
            });
          } else {
            console.error("Expected item to have a restaurants array:", item);
          }
        });
      } else {
        console.error("Expected response to be an array:", response);
      }

      // Update the page number display
      $("#page-number").text(`${page}`);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Failed to fetch restaurants:", textStatus, errorThrown);
    });
  }

  loadRestaurants();
  // Load restaurants on page load

  $("#next-page").click(function () {
    if (page < 13) {
      page++;
      loadRestaurants();
    }
  });

  $("#prev-page").click(function () {
    if (page > 1) {
      page--;
      loadRestaurants();
    }
  });
});
