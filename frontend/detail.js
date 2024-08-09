document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  fetch(`http://localhost:5002/api/restaurants/${id}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("restaurant-name").textContent =
        data.Restaurant_Name;
      document.getElementById(
        "restaurant-details"
      ).textContent = `Address: ${data.Address}, City: ${data.City}, Cuisine: ${data.Cuisines}, Average Cost: ${data.Average_Cost_for_two} ${data.Currency}`;
    })
    .catch((error) => {
      console.error("Error fetching restaurant details:", error);
    });
});
