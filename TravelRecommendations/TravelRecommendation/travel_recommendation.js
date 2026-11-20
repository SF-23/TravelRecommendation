const searchInput = document.getElementById("searchBar");
const btnSearch = document.getElementById("btnSearch");
const btnClear = document.getElementById("btnClear");
const resultsSection = document.getElementById("results-section");
const introBox = document.getElementById("introBox");

let recommendationData = null;

btnSearch.addEventListener("click", () =>
{ 
    event.preventDefault(); 
    handleSearch();
});

btnClear.addEventListener("click", clearSearch);

fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => 
    {
        recommendationData = data
        console.log(data) 
    })
    .catch(err => console.log(err));

function handleSearch() 
{
    if (!recommendationData) {
        console.log("Recommendation data is not loaded yet.");
        return;
    }

    const keyword = searchInput.value.trim().toLowerCase();
    let results = [];

    if (keyword === "beach" || keyword === "beaches")
    {
        results = (recommendationData.beaches || []).slice(0, 2); // At least 2 recommendations
    } else if (keyword === "temple" || keyword === "temples") 
    {
        results = (recommendationData.temples || []).slice(0, 2); // At least 2 recommendations
    } else if (keyword === "country" || keyword === "countries") 
    {
        // Pull at least 2 city recommendations from countries in the JSON
        const allCities = (recommendationData.countries || []).flatMap
        (
            (country) => country.cities || []
        );
        results = allCities;
    } 
    else 
    {
        // Fallback if user types a specific country name like "australia" or "brazil"
        const matchedCountry = (recommendationData.countries || []).find
        (
            (country) => country.name.toLowerCase().includes(keyword)
        );
        
        if (matchedCountry) 
        {
            results = (matchedCountry.cities || []).slice(0, 2);
        }
    }

    displayRecommendations(results);
}

function clearSearch()
{
    searchInput.value = "";
    //resultsSection.innerHTML = "";
}


function displayRecommendations(items) 
{
    resultsSection.innerHTML = "";

    if (!items || items.length === 0) 
    {
        resultsSection.innerHTML = `<p class="no-results">Please enter a valid keyword such as <strong>beach</strong>, <strong>temple</strong>, or <strong>country</strong>.</p>`;
        return;
    }

    items.forEach((place) => 
    {
        const card = document.createElement("div");
        card.classList.add("recommendation-card");

        card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <div class="card-body">
        <h3>${place.name}</h3>
        <p>${place.description}</p>
      </div>
    `;

        resultsSection.appendChild(card);
    });
    
    clearSearch();
}