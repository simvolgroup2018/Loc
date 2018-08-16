// Настройки по умолчанию
let urlServer = 'http://192.168.1.252/pp/hs/Plan/';
let subdivisionID = '6a7d2339-972b-11e8-b881-2cfda1c02b46';
let countDay = 1; // количество отображаемых дней
var firstDay = new Date();
var app;
var calcWidthCol = 210;
// Настройки по пользователя
let setting = {
  subdivisionID: '6a7d2339-972b-11e8-b881-2cfda1c02b46',
  countDay: 6
};

let allInfo = {Data:''};

function saveSetting(){
  // Сериализуем переменную настроек
  var sObj = JSON.stringify(setting);

  // Запишем в localStorage
  localStorage.setItem("setting", sObj);
};

function readSetting(){
  // Читаем из localStorage
  var sObj = localStorage.getItem("setting");
  // console.log(sObj);
  // конвертируем в объект
  Obj = JSON.parse(sObj);
  // console.log(sObj);
  // если настройки еще не записывались
  if(Obj == null){
    saveSetting();
  }else{
    setting = Obj;
  }
};
