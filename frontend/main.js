document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5002/api/restaurants?page=1&limit=10")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const list = document.getElementById("restaurant-list");
      list.innerHTML = ""; // Clear previous content
      if (data.length === 0) {
        list.innerHTML = "No restaurants found";
        return;
      }
      data.forEach((restaurant) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="restaurant.html?id=${restaurant.Restaurant_ID}">${restaurant.Restaurant_Name}</a>`;
        list.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching restaurant data:", error);
      document.getElementById("restaurant-list").innerHTML =
        "Failed to load restaurants";
    });
});
