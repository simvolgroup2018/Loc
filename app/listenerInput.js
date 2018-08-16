function addListenetInput() {
  // $(document).on('keyup mouseup', '#countDay', function() {
  //   console.log('changed');
  //
  //   var value = $('#countDay').val();
  //   if(value < 1){
  //     value = 1;
  //   }else if (value > 6) {
  //     value = 6;
  //   }
  //   $('#countDay').val(value);
  //   setting.countDay = value;
  //   saveSetting();
  //   updateAll();
  //
  //   readSetting();
  //   console.log(setting);
  // });


  // $(document).on('keyup mouseup', '.time', function() {
  //   console.log('changed');
  //
  //   var value = $(this).val();
  //   if(value < 0.5){
  //     value = 0.5;
  //   }else if (value > 100) {
  //     value = 100;
  //   }
  //   $(this).val(value);
  // });
};


function changeSubDivision() {
  setting.subdivisionID = $('#subDivision').find(":selected").attr('guid');
  saveSetting();
  console.log(setting.subdivisionID);
  updateAll();
}

function changeСountDay() {
  var value = $('#countDay').val();
  if(value < 1){
    value = 1;
  }else if (value > 6) {
    value = 6;
  }
  $('#countDay').val(value);
  setting.countDay = value;
  saveSetting();
  updateAll();

  console.log(setting);
}

function addTask() {
  console.log('addTask');

// формируем данные для отправки на сервер
  var data = {
      subdivisionID: setting.subdivisionID
  };

//посылаем запрос на сервер
  var result = GetInfo1C("addTaskLoc", JSON.stringify(data), allInfo);
  result.onclick = function(){
    this.parentNode.removeChild(this);
    updateWorkTask();
  };
}

function playTask(elem) {
  console.log('playTask');

// формируем данные для отправки на сервер
  var data = {
    guid: $(elem).attr('guid')
  };

//посылаем запрос на сервер
  var result = GetInfo1C("playSubTask", JSON.stringify(data), allInfo);
  result.onclick = function(){
    this.parentNode.removeChild(this);
    updateTable();
  };

}
