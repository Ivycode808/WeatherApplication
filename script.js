const wrapper = document.querySelector(".wrapper"),
inputPart= wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locButton = inputPart.querySelector("button"),
withImage = wrapper.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

let api;


inputField.addEventListener("keyup", e => {
    //if user pressed enter button and input value is not empty
    if(e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
})

locButton.addEventListener('click', () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
})

function onSuccess(position){
   const {longitude, latitude} = position.coords // getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=08ab34113eaf6b2c9d3563bf3defbb70`;
   fetchData(); 
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=08ab34113eaf6b2c9d3563bf3defbb70`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details..";
    infoTxt.classList.add("pending")
    //getting api respomse ans returning it with parsing into js obj and in another
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`
    } else {
        // let's get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            withImage.src = 'img/clear.jpg';
        } else if (id >= 200 && id <= 232 ){
            withImage.src = 'img/storm.jpg';
        }else if (id >= 600 && id <= 622 ){
            withImage.src = 'img/snow.jpg';
        }else if (id >= 701  && id <= 781 ){
            withImage.src = 'img/haze.jpg';
        }else if (id >= 801 && id <= 804 ){
            withImage.src = 'img/cloud.jpg';
        }else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            withImage.src = 'img/rain.jpg';
        }

        let temptofahrenheit = Math.floor((temp * 9/5) + 32);
        let feelsLikeFahrenheit = Math.floor((feels_like * 9/5) + 32)

        // let's pass these values to a particular html element
        wrapper.querySelector(".temp .numb").innerText = temptofahrenheit;
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = feelsLikeFahrenheit;
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;


        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        
    }
    
    arrowBack.addEventListener('click', () => {
        wrapper.classList.remove("active")
    })


}