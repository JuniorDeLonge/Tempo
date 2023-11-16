const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    arrowBack = wrapper.querySelector("header i"),
    headerClima = document.querySelector('.header-clima'),
    headerVoltar = document.querySelector('.header-voltar');

let api;
let apiKey; // Variável para armazenar a chave da API

// Use a função assíncrona para obter a chave da API
async function getApiKey() {
    // Simule uma chamada de servidor para obter a chave
    return '3adf342557400a33545abde1b7a7bca9';
}

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
        toggleHeaders(true);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        toggleHeaders(true);
    } else {
        alert("Seu navegador não suporta geolocalização");
    }
});

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
    toggleHeaders(false);
    resetBackground();
    setTimeout(() => {
        headerClima.style.display = 'flex';
        headerVoltar.style.display = 'none';
    }, 1000);
});

function resetBackground() {
    document.body.style.backgroundImage = ''; // Defina o plano de fundo inicial aqui
}

function toggleHeaders(showClima) {
    headerClima.style.display = showClima ? 'flex' : 'none';
    headerVoltar.style.display = showClima ? 'none' : 'flex';

    if (!showClima) {
        setTimeout(() => {
            headerVoltar.style.display = 'flex';
            headerClima.style.display = 'none';
        }, 1000);
    }
}

async function requestApi(city) {
    // Obtenha a chave da API antes de fazer a solicitação
    apiKey = await getApiKey();
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;
    fetchData();
}

async function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    // Obtenha a chave da API antes de fazer a solicitação
    apiKey = await getApiKey();
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`;
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
        .then(result => {
            weatherDetails(result);
            // Após obter os detalhes do clima, esconde o header-clima
            toggleHeaders(false);
        })
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



// Condições climáticas
const weatherConditions = {
    'Clear': "imagens/claro.jpg",
    'Rain': "imagens/chuva.jpg",
    'Clouds': "imagens/nuvens.jpg",
    'Snow': "imagens/neve.jpg",
    'Drizzle': "imagens/chuvisco.jpg",
    'Thunderstorm': "imagens/tempestade.jpg",
    'Fog': "imagens/neblina.jpg",
    'Mist': "imagens/nevoa.jpg",
    'Haze': "imagens/bruma.jpg",
    'Smoke': "imagens/fumaca.jpg",
    'Dust': "imagens/poeira.jpg",
    'Sand': "imagens/areia.jpg",
    'Ash': "imagens/cinzas.jpg",
    'Squall': "imagens/rajada.jpg",
    'Tornado': "imagens/tornado.jpg"
};


function changeBackground(clima) {
    const body = document.body;
    const lowerCaseClima = clima.toLowerCase();

    // Verifique se a descrição do clima contém alguma chave do objeto weatherConditions
    const matchingCondition = Object.keys(weatherConditions).find(condition =>
        lowerCaseClima.includes(condition.toLowerCase())
    );

    // Defina o plano de fundo com base no clima atual
    if (matchingCondition) {
        const imagePath = weatherConditions[matchingCondition];
        body.style.backgroundImage = `url(${imagePath})`;
    } else {
        body.style.backgroundImage = '';
    }


    // Defina o plano de fundo com base no clima atual
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

