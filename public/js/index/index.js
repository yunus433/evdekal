window.onload = () => {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-161657533-1');

  const socket = io();
  const day = document.querySelector('.display-none').value;
  let clicked = false;
  let selectedCity = null;
  const totalNumber = document.querySelector('.total-number');
  const totalNumberResponsive = document.getElementById('total-number-responsive');
  const selectCityButton = document.querySelector('.select-city-button');
  const citiesWrapper = document.querySelector('.cities-wrapper');
  const responseText = document.querySelector('.response-text');

  socket.on('connect', () => {
    socket.emit('join', {
      room: day
    });

    socket.on('newData', params => {
      if (params && params.day && params.city) {
        if (params.day == day) {
          totalNumber.innerHTML = parseInt(totalNumber.innerHTML) + 1;
          totalNumberResponsive.innerHTML = parseInt(totalNumberResponsive.innerHTML) + 1;
          document.getElementById(params.city+"responsive").innerHTML = parseInt(document.getElementById(params.city+"responsive").innerHTML) + 1;
        }
      }
    });
  
    document.addEventListener('click', event => {
      if ((event.target.classList.contains('select-city-button') && event.target.classList.contains('clicked')) || (event.target.parentNode.classList.contains('select-city-button') && event.target.parentNode.classList.contains('clicked'))) {
        citiesWrapper.classList.remove('open-cities-animation-class');
        citiesWrapper.classList.add('close-cities-animation-class');
        clicked = false;
  
        setTimeout(() => {
          selectCityButton.classList.remove('clicked');
          citiesWrapper.style.display = 'none';
        }, 300);
      } else if (event.target.classList.contains('select-city-button') || event.target.parentNode.classList.contains('select-city-button')) {
        selectCityButton.classList.add('clicked');
        clicked = true;
        citiesWrapper.style.display = 'flex';
        citiesWrapper.classList.remove('close-cities-animation-class');
        citiesWrapper.classList.add('open-cities-animation-class');
      } else if (clicked) {
        citiesWrapper.classList.remove('open-cities-animation-class');
        citiesWrapper.classList.add('close-cities-animation-class');
  
        setTimeout(() => {
          selectCityButton.classList.remove('clicked');
          citiesWrapper.style.display = 'none';
        }, 300);
      }
  
      if (event.target.className == 'select-each-city') {
        selectCityButton.childNodes[0].innerHTML = event.target.innerHTML;
        selectedCity = event.target.innerHTML;
      }
  
      if (event.target.className == 'main-button' || event.target.parentNode.className == 'main-button') {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify({
          "city": selectedCity
        }));
  
        xhr.onreadystatechange = (res) => {
          if (xhr.readyState == 4) {
            const response = JSON.parse(res.srcElement.responseText);
            if (response.err) {
              if (response.err == 'bad request') {
                responseText.innerHTML = "Lütfen şehrini seç.";
                responseText.style.visibility = "initial"
              } else if (response.err == 'second time') {
                responseText.innerHTML = "Bugün çoktan data göndermişsin, yarın yeniden gelmeyi unutma!";
                responseText.style.visibility = "initial"
              } else if (response.err == 'already sent') {
                responseText.innerHTML = "Bu IP adresi bugün çok fazla kullanılmış, başka bir internete bağlanıp dene.";
                responseText.style.visibility = "initial";
              } else {
                responseText.innerHTML = "Bilinmeyen bir hata oluştu, lütfen tekrar dene.";
                responseText.style.visibility = "initial";
              }
            } else {
              socket.emit('newDataSend', {
                city: response.user.city,
                day: response.user.day,
                to: response.user.day
              }, err => {
                if (err) return alert('Bir hata oluştu, lütfen tekrar dene');
                
                totalNumber.innerHTML = parseInt(totalNumber.innerHTML) + 1;
                totalNumberResponsive.innerHTML = parseInt(totalNumberResponsive.innerHTML) + 1;
                document.getElementById(response.user.city).innerHTML = parseInt(document.getElementById(response.user.city).innerHTML) + 1;
                document.getElementById(response.user.city+"responsive").innerHTML = parseInt(document.getElementById(response.user.city+"responsive").innerHTML) + 1;
                responseText.innerHTML = "Bize destek verdiğin için teşekkürler. Yarın yeniden sistemi kullanmayı ve sistemi tanıdıklarına önermeyi unutma. #evindemisin?";
                responseText.style.visibility = "initial";
              });
            }
          }
        }
      }
    });
  });
}
