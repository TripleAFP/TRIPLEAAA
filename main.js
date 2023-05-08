
let searchBox = document.querySelector('.buscar');
let form = document.querySelector('form');

form.addEventListener("submit", function(event) {
    event.preventDefault(); 

    if (searchBox.value.trim() !== "") {
        window.location.replace(`summoner.html?summoner=${searchBox.value}`);
    }
});