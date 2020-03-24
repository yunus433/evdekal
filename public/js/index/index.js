window.onload = () => {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-161657533-1');

  const cities = JSON.parse(document.getElementById('cities-json').value);
  const day = document.getElementById('day-json').value;

  const socket = io();
  let clicked = false;
  let selectedCity = null;
  const totalNumber = document.querySelector('.total-number');
  const totalNumberResponsive = document.getElementById('total-number-responsive');
  const selectCityButton = document.querySelector('.select-city-button');
  const selectCityInput = document.querySelector('.select-city-input');
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
          const city = document.getElementById(params.city), cityResponsive = document.getElementById(params.city+"responsive");
          city.innerHTML = parseInt(city.innerHTML) + 1;
          while (city.parentNode.previousElementSibling && parseInt(city.parentNode.previousElementSibling.childNodes[1].innerHTML) <= parseInt(city.innerHTML))
            city.parentNode.parentNode.insertBefore(city.parentNode, city.parentNode.previousElementSibling);
          cityResponsive.innerHTML = parseInt(cityResponsive.innerHTML) + 1;
          while (cityResponsive.parentNode.previousElementSibling && parseInt(cityResponsive.parentNode.previousElementSibling.childNodes[1].innerHTML) <= parseInt(cityResponsive.innerHTML))
            cityResponsive.parentNode.parentNode.insertBefore(cityResponsive.parentNode, cityResponsive.parentNode.previousElementSibling);
        }
      }
    });
  
    document.addEventListener('click', event => {
      if ((event.target.classList.contains('select-city-button') && event.target.classList.contains('clicked') && !event.target.classList.contains('select-city-input')) || (event.target.parentNode.classList.contains('select-city-button') && event.target.parentNode.classList.contains('clicked') && !event.target.classList.contains('select-city-input'))) {
        citiesWrapper.classList.remove('open-cities-animation-class');
        citiesWrapper.classList.add('close-cities-animation-class');
        clicked = false;
  
        setTimeout(() => {
          selectCityButton.classList.remove('clicked');
          citiesWrapper.style.display = 'none';
        }, 300);
      } else if (event.target.classList.contains('select-city-button') || event.target.parentNode.classList.contains('select-city-button')) {
        document.querySelector('.main-wrapper').scrollTop = 0;
        setTimeout(() => {
          selectCityButton.classList.add('clicked');
          selectCityInput.focus();
          clicked = true;
          citiesWrapper.style.display = 'flex';
          citiesWrapper.classList.remove('close-cities-animation-class');
          citiesWrapper.classList.add('open-cities-animation-class');
        }, 100);
      } else if (clicked) {
        citiesWrapper.classList.remove('open-cities-animation-class');
        citiesWrapper.classList.add('close-cities-animation-class');
  
        setTimeout(() => {
          selectCityButton.classList.remove('clicked');
          citiesWrapper.style.display = 'none';
        }, 300);
      }
  
      if (event.target.className == 'select-each-city') {
        selectCityButton.childNodes[0].value = event.target.innerHTML;
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
                const city = document.getElementById(response.user.city), cityResponsive = document.getElementById(response.user.city+"responsive");
                city.innerHTML = parseInt(city.innerHTML) + 1;
                while (city.parentNode.previousElementSibling && parseInt(city.parentNode.previousElementSibling.childNodes[1].innerHTML) <= parseInt(city.innerHTML))
                  city.parentNode.parentNode.insertBefore(city.parentNode, city.parentNode.previousElementSibling);
                cityResponsive.innerHTML = parseInt(cityResponsive.innerHTML) + 1;
                while (cityResponsive.parentNode.previousElementSibling && parseInt(cityResponsive.parentNode.previousElementSibling.childNodes[1].innerHTML) <= parseInt(cityResponsive.innerHTML))
                  cityResponsive.parentNode.parentNode.insertBefore(cityResponsive.parentNode, cityResponsive.parentNode.previousElementSibling);
                responseText.innerHTML = "Bize destek verdiğin için teşekkürler. Yarın yeniden sistemi kullanmayı ve sistemi tanıdıklarına önermeyi unutma. #evindemisin?";
                responseText.style.visibility = "initial";
              });
            }
          }
        }
      }

      if (event.target.classList.contains('fa-copyright')) {
        document.querySelector('.copyright-wrapper').style.display = 'flex';
      } else {
        document.querySelector('.copyright-wrapper').style.display = 'none';
      }

      if (event.target.classList.contains('fa-info-circle')) {
        document.querySelector('.info-wrapper').style.display = 'flex';
      } else {
        document.querySelector('.info-wrapper').style.display = 'none';
      }
    });

    selectCityInput.oninput = (event) => {
      citiesWrapper.innerHTML = "";
      cities.forEach(city => {
        if (city.toLocaleLowerCase().indexOf(selectCityInput.value.toLocaleLowerCase()) !== -1) {
          const newSpan = document.createElement('span');
          newSpan.classList.add('select-each-city');
          newSpan.innerHTML = city;
          citiesWrapper.appendChild(newSpan);
        }
      });
    };

    document.querySelector('.main-wrapper').onscroll = (event) => {
      citiesWrapper.classList.remove('open-cities-animation-class');
      citiesWrapper.classList.add('close-cities-animation-class');
      clicked = false;
    
      selectCityButton.classList.remove('clicked');
      citiesWrapper.style.display = 'none';
    };
  });
}
