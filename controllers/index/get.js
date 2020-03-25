const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

const User = require('../../models/User/User');

module.exports = (req, res) => {
  const cities = [ 'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak' ];
  const citiesEng = [ 'adana', 'adiyaman', 'afyonkarahisar', 'agri', 'aksaray', 'amasya', 'ankara', 'antalya', 'ardahan', 'artvin', 'aydin', 'balikesir', 'bartin', 'batman', 'bayburt', 'bilecik', 'bingol', 'bitlis', 'bolu', 'burdur', 'bursa', 'canakkale', 'cankiri', 'corum', 'cenizli', 'diyarbakir', 'duzce', 'edirne', 'elazig', 'erzincan', 'erzurum', 'eskisehir', 'gaziantep', 'giresun', 'gumushane', 'hakkari', 'hatay', 'igdir', 'isparta', 'istanbul', 'izmir', 'kahramanmaras', 'karabuk', 'karaman', 'kars', 'kastamonu', 'kayseri', 'kilis', 'kirikkale', 'kirklareli', 'kirsehir', 'kocaeli', 'konya', 'kutahya', 'malatya', 'manisa', 'mardin', 'mersin', 'mugla', 'mus', 'nevsehir', 'nigde', 'ordu', 'osmaniye', 'rize', 'sakarya', 'samsun', 'sanlıiurfa', 'siirt', 'sinop', 'sivas', 'sirnak', 'tekirdag', 'tokat', 'trabzon', 'tunceli', 'usak', 'van', 'yalova', 'yozgat', 'zonguldak' ];
  const cityNumbers = { 'Adana': 0, 'Adıyaman': 0, 'Afyonkarahisar': 0, 'Ağrı': 0, 'Aksaray': 0, 'Amasya': 0, 'Ankara': 0, 'Antalya': 0, 'Ardahan': 0, 'Artvin': 0, 'Aydın': 0, 'Balıkesir': 0, 'Bartın': 0, 'Batman': 0, 'Bayburt': 0, 'Bilecik': 0, 'Bingöl': 0, 'Bitlis': 0, 'Bolu': 0, 'Burdur': 0, 'Bursa': 0, 'Çanakkale': 0, 'Çankırı': 0, 'Çorum': 0, 'Denizli': 0, 'Diyarbakır': 0, 'Düzce': 0, 'Edirne': 0, 'Elazığ': 0, 'Erzincan': 0, 'Erzurum': 0, 'Eskişehir': 0, 'Gaziantep': 0, 'Giresun': 0, 'Gümüşhane': 0, 'Hakkâri': 0, 'Hatay': 0, 'Iğdır': 0, 'Isparta': 0, 'İstanbul': 0, 'İzmir': 0, 'Kahramanmaraş': 0, 'Karabük': 0, 'Karaman': 0, 'Kars': 0, 'Kastamonu': 0, 'Kayseri': 0, 'Kilis': 0, 'Kırıkkale': 0, 'Kırklareli': 0, 'Kırşehir': 0, 'Kocaeli': 0, 'Konya': 0, 'Kütahya': 0, 'Malatya': 0, 'Manisa': 0, 'Mardin': 0, 'Mersin': 0, 'Muğla': 0, 'Muş': 0, 'Nevşehir': 0, 'Niğde': 0, 'Ordu': 0, 'Osmaniye': 0, 'Rize': 0, 'Sakarya': 0, 'Samsun': 0, 'Şanlıurfa': 0, 'Siirt': 0, 'Sinop': 0, 'Sivas': 0, 'Şırnak': 0, 'Tekirdağ': 0, 'Tokat': 0, 'Trabzon': 0, 'Tunceli': 0, 'Uşak': 0, 'Van': 0, 'Yalova': 0, 'Yozgat': 0, 'Zonguldak': 0 };
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

    await users.forEach(user => {
      cityNumbers[user.city]++;
    });

    await cities.forEach((city, i) => {
      sortedCities.push({
        name: city,
        nameEng: citiesEng[i],
        number: cityNumbers[city]
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
