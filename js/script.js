
const weatherConditions = {
    'Clear': "url('imagens/claro.jpg')",
    'Rain': "url('imagens/chuva.jpg')",
    'Clouds': "url('imagens/nuvens.jpg')",
    'Snow': "url('imagens/neve.jpg')",
    'Drizzle': "url('imagens/chuvisco.jpg')",
    'Thunderstorm': "url('imagens/tempestade.jpg')",
    'Fog': "url('imagens/neblina.jpg')",
    'Mist': "url('imagens/nevoa.jpg')",
    'Haze': "url('imagens/bruma.jpg')",
    'Smoke': "url('imagens/fumaca.jpg')",
    'Dust': "url('imagens/poeira.jpg')",
    'Sand': "url('imagens/areia.jpg')",
    'Ash': "url('imagens/cinzas.jpg')",
    'Squall': "url('imagens/rajada.jpg')",
    'Tornado': "url('imagens/tornado.jpg')"
};

const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Seu navegador não suporta a API de geolocalização");
    }
});

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=3adf342557400a33545abde1b7a7bca9`;
    fetchData();
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3adf342557400a33545abde1b7a7bca9`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData() {
    infoTxt.innerText = "Obtendo detalhes do clima...";
    infoTxt.classList.add("pending");

    fetch(api)
        .then(res => res.json())
        .then(result => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Algo deu errado";
            infoTxt.classList.replace("pending", "error");
        });
}

function weatherDetails(info) {
    const weatherId = info.weather[0].id;

    switch (true) {
        case weatherId == 800:
            wIcon.src = "icons/clear.svg";
            break;
        case weatherId >= 200 && weatherId <= 232:
            wIcon.src = "icons/storm.svg";
            break;
        case weatherId >= 600 && weatherId <= 622:
            wIcon.src = "icons/snow.svg";
            break;
        case weatherId >= 701 && weatherId <= 781:
            wIcon.src = "icons/haze.svg";
            break;
        case weatherId >= 801 && weatherId <= 804:
            wIcon.src = "icons/cloud.svg";
            break;
        case (weatherId >= 500 && weatherId <= 531) || (weatherId >= 300 && weatherId <= 321):
            wIcon.src = "icons/rain.svg";
            break;
        // Adicione mais casos conforme necessário
        case weatherId >= 951 && weatherId <= 955:
            wIcon.src = "icons/calm.svg";
            break;
        case weatherId >= 956 && weatherId <= 962:
            wIcon.src = "icons/windy.svg";
            break;
        // Adicione mais casos conforme necessário
        default:
            wIcon.src = "icons/default.svg";
    }



    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} não é um nome de cidade válido`;
    } else {
        const { description } = info.weather[0];
        changeBackground(description);

        weatherPart.querySelector(".temp .numb").innerText = Math.floor(info.main.temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${info.name}, ${info.sys.country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(info.main.feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${info.main.humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

function changeBackground(clima) {
    const body = document.body;
    const lowerCaseClima = clima.toLowerCase();

    if (lowerCaseClima.includes('clear')) {
        body.style.backgroundImage = weatherConditions['Clear'] || '';
    } else if (lowerCaseClima.includes('rain')) {
        body.style.backgroundImage = weatherConditions['Rain'] || '';
    } else if (lowerCaseClima.includes('cloud')) {
        body.style.backgroundImage = weatherConditions['Clouds'] || '';
    } else if (lowerCaseClima.includes('snow')) {
        body.style.backgroundImage = weatherConditions['Snow'] || '';
    } else if (lowerCaseClima.includes('drizzle')) {
        body.style.backgroundImage = weatherConditions['Drizzle'] || '';
    } else if (lowerCaseClima.includes('thunderstorm')) {
        body.style.backgroundImage = weatherConditions['Thunderstorm'] || '';
    } else if (lowerCaseClima.includes('fog') || lowerCaseClima.includes('mist')) {
        body.style.backgroundImage = weatherConditions['Fog'] || '';
    } else if (lowerCaseClima.includes('haze')) {
        body.style.backgroundImage = weatherConditions['Haze'] || '';
    } else {
        body.style.backgroundImage = '';
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

async function getApiKey() {
    return '3adf342557400a33545abde1b7a7bca9';
}

  