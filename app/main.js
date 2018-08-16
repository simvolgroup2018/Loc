$(document).ready(function() {
  console.log('start');

  // считываем настройки из localStorage
  readSetting();
  // console.log(setting);

  // заполняем значения в input
  $('#countDay').val(setting.countDay);

  // получаем данные с сервера и отображаем
  updateAll();

  // подключаем обработчики на поля ввода
  addListenetInput();
});





function updateAll() {
  console.log('updateAll');

  //формируем данные для отправки на сервер
  var data = {
    subdivisionID: setting.subdivisionID,
    countDay: setting.countDay,
    day: firstDay.format("yyyymmdd")
  };

  //посылаем запрос на сервер
  var result = GetInfo1C('GetTaskLocations', JSON.stringify(data), allInfo);

  //обрабатываем результат
  result.onclick = function(){
    this.parentNode.removeChild(this);
    // console.log(data);
    console.log(allInfo.Data);

// заполняем список подразделений
  if($('#subDivision').html().length == 0){
    let subDivisionTemp = _.template($('#subDivisionTemp').html());
    $('#subDivision').html(subDivisionTemp({subDivisions:allInfo.Data.subDivisions}));
  };
  $('#subDivision option[guid="'+ setting.subdivisionID + '"]').attr('selected','selected');
// заполняем список задач в работе
    let workTaskTemp = _.template($('#workTaskTemp').html());
    $('#workMain').html(workTaskTemp({tasks:allInfo.Data.workTask}));

    $('#countWorkTask').html(' ' + allInfo.Data.infoWorkTask[0].count);
    $('#timeWorkTask').html(' ' + allInfo.Data.infoWorkTask[0].totalTime);

    $('#table').html('');
    $('#table').html('<tbody id="tableBody"><tr class="tableHeader" id="tableHeaderTR"></tr><tbody>');
// создаем шапку таблицы
    let myTemplate = _.template($('#workSubTaskHeaderTemp').html());
    $('#tableHeaderTR').html(myTemplate({headers:allInfo.Data.title}));

// заполняем таблицу
    let workSubTaskTemp = _.template($('#workSubTaskTemp').html());
    $('#tableBody').html($('#tableBody').html() + workSubTaskTemp({tasks:allInfo.Data.subTask}));

// заполняем список задач на контроле
    let workCeckSubTaskTemp = _.template($('#workCeckSubTaskTemp').html());
    $('#checkMain').html(workCeckSubTaskTemp({subTasks:allInfo.Data.subTaskCheck}));

// включаем Sortable
    addListerenSortable()

// считаем необходимую ширину списков
    calcWidth();

// считаем необходимую высоту строк таблицы
    calcHeightRow();

// $( "#subDivision" ).selectmenu()
  };
};


function updateTable() {
  console.log('updateTable');

  //формируем данные для отправки на сервер
  var data = {
    subdivisionID: setting.subdivisionID,
    countDay: setting.countDay,
    day: firstDay.format("yyyymmdd")
  };

  //посылаем запрос на сервер
  var result = GetInfo1C('GetTaskLocations', JSON.stringify(data), allInfo);

  //обрабатываем результат
  result.onclick = function(){
    this.parentNode.removeChild(this);
    // console.log(data);
    console.log(allInfo.Data);

    $('#table').html('');
    $('#table').html('<tbody id="tableBody"><tr class="tableHeader" id="tableHeaderTR"></tr><tbody>');

// создаем шапку таблицы
    let myTemplate = _.template($('#workSubTaskHeaderTemp').html());
    $('#tableHeaderTR').html(myTemplate({headers:allInfo.Data.title}));

// заполняем таблицу
    let workSubTaskTemp = _.template($('#workSubTaskTemp').html());
    $('#tableBody').html($('#tableBody').html() + workSubTaskTemp({tasks:allInfo.Data.subTask}));

// включаем Sortable
    addListerenSortable();

// высчитываем высоту строк таблицы
    calcHeightRow();

// считаем необходимую ширину списков
    $(".calcWidth").width(calcWidthCol);
  };
};

function updateWorkTask() {
  console.log('updateWorkTask');

  //формируем данные для отправки на сервер
  var data = {
    subdivisionID: setting.subdivisionID,
    countDay: setting.countDay,
    day: firstDay.format("yyyymmdd")
  };

  //посылаем запрос на сервер
  var result = GetInfo1C('GetTaskLocations', JSON.stringify(data), allInfo);

  //обрабатываем результат
  result.onclick = function(){
    this.parentNode.removeChild(this);
    // console.log(data);
    console.log(allInfo.Data);

// создаем шапку таблицы
    let myTemplate = _.template($('#workSubTaskHeaderTemp').html());
    $('#tableHeaderTR').html(myTemplate({headers:allInfo.Data.title}));

// заполняем список задач в работе
    let workTaskTemp = _.template($('#workTaskTemp').html());
    $('#workMain').html(workTaskTemp({tasks:allInfo.Data.workTask}));

    $('#countWorkTask').html(' ' + allInfo.Data.infoWorkTask[0].count);
    $('#timeWorkTask').html(' ' + allInfo.Data.infoWorkTask[0].totalTime);

  // включаем Sortable
    addListerenSortable();

  // считаем необходимую ширину списков
    $(".calcWidth").width(calcWidthCol);

};
};
//=============================================== Получение информации с сервера
function GetInfo1C(url, param = '', variable, addListener = true) {
  NProgress.start();
  var elem = document.createElement('span');
  elem.setAttribute('id', url);
  document.body.appendChild(elem);

  $.ajax({
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    url: urlServer + url,
    data: param,
    success: function (result) {
      // console.log(result);
      variable.Data = eval(result)[0];
      $('#'+url).click();
      NProgress.done();
      if(!addListener){
        var result = document.getElementById(url);
        document.body.removeChild(result);
      }
    },
    dataType: "text",
    async:true,
    error: function( jqXHR , textStatus, errorThrown ){
      console.log(textStatus);
    }
  });
  return elem;
}
//=============================================== Получение информации с сервера

//=========================================== Расчет ширины списков и контейнера
function calcWidth() {
  var widthContainer = $('#container').outerWidth();
  var widthCoumnDate = $('#dateColumn').outerWidth();
  var countColumn = allInfo.Data.title.length + 1;
  var widthStatic = widthCoumnDate + 16 + countColumn * 4 + 4 ;
  calcWidthCol = Math.round((widthContainer - widthStatic) / (countColumn));

  if(calcWidthCol > 350){
    calcWidthCol = 350;
  }else if (calcWidthCol < 210) {
    calcWidthCol = 210;
  }


  widthContainer = calcWidthCol * countColumn + widthStatic;

  $(".calcWidth").width(calcWidthCol);
  $("#container").width(widthContainer);
};
//=========================================== Расчет ширины списков и контейнера

//================================================================ calcHeightRow
function calcHeightRow() {
  var heightTable = $('#table').height();
  var heightTableHeader = $('.tableHeader').height();
  var tableMargins = (setting.countDay * 1 + 2) * 2;
  var rowHeight = Math.round(((heightTable - heightTableHeader - tableMargins) / (setting.countDay * 1)) - 6);

  // console.log('heightTable - ' + heightTable);
  // console.log('heightTableHeader - ' + heightTableHeader);
  // console.log('tableMargins - ' + tableMargins);
  // console.log(rowHeight);

  $(".tableBlockDiv").height(rowHeight);
}
//================================================================ calcHeightRow


//=========================================================== Отключить sortable
function destroySortableAll() {
  $( ".tableData" ).each(function() {

  });
};



//=========================================================== Отключить sortable
