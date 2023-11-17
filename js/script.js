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
    const userLanguage = navigator.language || navigator.userLanguage; // Obtenha a linguagem do usuário
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=${userLanguage}&appid=${apiKey}`;
    fetchData();
}

async function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    // Obtenha a chave da API antes de fazer a solicitação
    apiKey = await getApiKey();
    const userLanguage = navigator.language || navigator.userLanguage; // Obtenha a linguagem do usuário
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=${userLanguage}&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

async function fetchData() {
    infoTxt.innerText = "Obtendo detalhes do clima...";
    infoTxt.classList.add("pending");

    try {
        const response = await fetch(api);
        const result = await response.json();

        if (response.ok) {
            weatherDetails(result);
            // Após obter os detalhes do clima, esconde o header-clima
            toggleHeaders(false);
        } else {
            infoTxt.innerText = "Algo deu errado";
            infoTxt.classList.replace("pending", "error");
        }
    } catch (error) {
        infoTxt.innerText = "Algo deu errado";
        infoTxt.classList.replace("pending", "error");
    }
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
        weatherPart.querySelector(".weather").innerText = translateWeatherDescription(description, 'pt'); // Traduz para português
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
    'Clear': {
        label: 'Claro',
        image: 'imagens/claro.jpg'
    },
    'Rain': {
        label: 'Chuva',
        image: 'imagens/chuva.jpg'
    },
    'Clouds': {
        label: 'Nuvens',
        image: 'imagens/nuvens.jpg'
    },
    'Snow': {
        label: 'Neve',
        image: 'imagens/neve.jpg'
    },
    'Drizzle': {
        label: 'Chuvisco',
        image: 'imagens/chuvisco.jpg'
    },
    'Thunderstorm': {
        label: 'Tempestade',
        image: 'imagens/tempestade.jpg'
    },
    'Fog': {
        label: 'Neblina',
        image: 'imagens/neblina.jpg'
    },
    'Mist': {
        label: 'Névoa',
        image: 'imagens/nevoa.jpg'
    },
    'Haze': {
        label: 'Bruma',
        image: 'imagens/bruma.jpg'
    },
    'Smoke': {
        label: 'Fumaça',
        image: 'imagens/fumaca.jpg'
    },
    'Dust': {
        label: 'Poeira',
        image: 'imagens/poeira.jpg'
    },
    'Sand': {
        label: 'Areia',
        image: 'imagens/areia.jpg'
    },
    'Ash': {
        label: 'Cinzas',
        image: 'imagens/cinzas.jpg'
    },
    'Squall': {
        label: 'Rajada',
        image: 'imagens/rajada.jpg'
    },
    'Tornado': {
        label: 'Tornado',
        image: 'imagens/tornado.jpg'
    }
};

// Função para alterar o plano de fundo com base no clima
function changeBackground(description) {
    const body = document.body;
    const lowerCaseClima = description.toLowerCase();

    // Verifique se a descrição do clima contém alguma chave do objeto weatherConditions
    const matchingCondition = Object.keys(weatherConditions).find(condition =>
        lowerCaseClima.includes(condition.toLowerCase())
    );

    // Defina o plano de fundo com base no clima atual
    if (matchingCondition) {
        const { image } = weatherConditions[matchingCondition];
        body.style.backgroundImage = `url(${image})`;
    } else {
        body.style.backgroundImage = '';
    }
}

function translateWeatherDescription(description, targetLanguage) {
    // Adicione traduções conforme necessário
    const translations = {
        'clear sky': 'Céu limpo',
        'few clouds': 'Poucas nuvens',
        'scattered clouds': 'Nuvens dispersas',
        'broken clouds': 'Nuvens quebradas',
        'overcast clouds': 'Nuvens nubladas',
        'light rain': 'Chuva fraca',
        'moderate rain': 'Chuva moderada',
        'heavy intensity rain': 'Chuva intensa',
        'very heavy rain': 'Chuva muito intensa',
        'freezing rain': 'Chuva congelante',
        'light snow': 'Neve fraca',
        'moderate snow': 'Neve moderada',
        'heavy snow': 'Neve intensa',
        'sleet': 'Chuva congelada',
        'shower rain': 'Chuva forte',
        'thunderstorm': 'Tempestade',
        'mist': 'Névoa',
        'smoke': 'Fumaça',
        'haze': 'Névoa seca',
        'sand/ dust whirls': 'Redemoinhos de areia/poeira',
        'fog': 'Neblina',
        'sand': 'Areia',
        'dust': 'Poeira',
        'volcanic ash': 'Cinzas vulcânicas',
        'squalls': 'Rajadas de vento',
        'tornado': 'Tornado'
        // Adicione mais traduções conforme necessário
    };

    const lowerCaseDescription = description.toLowerCase();
    const translatedDescription = translations[lowerCaseDescription] || 'Desconhecido';

    if (targetLanguage === 'pt') {
        // Capitaliza a primeira letra da tradução
        return translatedDescription.charAt(0).toUpperCase() + translatedDescription.slice(1);
    } else {
        return description;
    }
}