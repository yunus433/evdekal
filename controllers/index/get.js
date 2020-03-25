const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

const User = require('../../models/User/User');

module.exports = (req, res) => {
  const cities = [ 'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak' ];
  const citiesEng = [ 'adana', 'adiyaman', 'afyonkarahisar', 'agri', 'aksaray', 'amasya', 'ankara', 'antalya', 'ardahan', 'artvin', 'aydin', 'balikesir', 'bartin', 'batman', 'bayburt', 'bilecik', 'bingol', 'bitlis', 'bolu', 'burdur', 'bursa', 'canakkale', 'cankiri', 'corum', 'cenizli', 'diyarbakir', 'duzce', 'edirne', 'elazig', 'erzincan', 'erzurum', 'eskisehir', 'gaziantep', 'giresun', 'gumushane', 'hakkari', 'hatay', 'igdir', 'isparta', 'istanbul', 'izmir', 'kahramanmaras', 'karabuk', 'karaman', 'kars', 'kastamonu', 'kayseri', 'kilis', 'kirikkale', 'kirklareli', 'kirsehir', 'kocaeli', 'konya', 'kutahya', 'malatya', 'manisa', 'mardin', 'mersin', 'mugla', 'mus', 'nevsehir', 'nigde', 'ordu', 'osmaniye', 'rize', 'sakarya', 'samsun', 'sanlıiurfa', 'siirt', 'sinop', 'sivas', 'sirnak', 'tekirdag', 'tokat', 'trabzon', 'tunceli', 'usak', 'van', 'yalova', 'yozgat', 'zonguldak' ];
  const sortedCities = [];
  const threeAm = 10800000;
  const time = Date.now();
  const day =  moment(time-threeAm).tz("Europe/Istanbul").format("DD[.]MM[.]YYYY");

  User.find({}, async (err, users) => {
    if (err) return res.render('index/index', {
      page: 'index/index',
      title: '#EvindeMisin',
      includes: {
        external: ['js', 'css', 'socket.io', 'fontawesome']
      },
      cities,
      sortedCities: cities,
      users: [],
      day
    });

    await cities.forEach((city, i) => {
      sortedCities.push({
        name: city,
        nameEng: citiesEng[i],
        number: users.filter(user => user.city == city).length
      });
    });
    let swapped = false;

    for (let i = 0; i < sortedCities.length-1; i++)  { 
      swapped = false; 
      for (let j = 0; j < sortedCities.length-i-1; j++) { 
        if (sortedCities[j].number != sortedCities[j+1].number) {
          if (sortedCities[j].number < sortedCities[j+1].number) {
            const temp = sortedCities[j];
            sortedCities[j] = sortedCities[j+1];
            sortedCities[j+1] = temp;
            swapped = true;
          }
        } else {
          if (sortedCities[j].nameEng > sortedCities[j+1].nameEng) {
            const temp = sortedCities[j];
            sortedCities[j] = sortedCities[j+1];
            sortedCities[j+1] = temp;
            swapped = true;
          }
        }
      }
      if (swapped == false) 
        break; 
    } 
  
    return res.render('index/index', {
      page: 'index/index',
      title: '#EvindeMisin',
      includes: {
        external: ['js', 'css', 'socket.io', 'fontawesome']
      },
      cities,
      sortedCities,
      number: users.length,
      day
    });
  });
}
