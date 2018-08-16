let sortableWorkMain;

function addListerenSortable() {

// включаем сортировку в списке задач
  var workMain = document.getElementById('workMain');
  sortableWorkMain = Sortable.create(workMain, {
    group: {
      name: 'workMain',
      pull: 'clone'
    },

    animation: 100,
    onUpdate: function (evt) {
      // console.log('сортировка');
      sortTask(evt)
    }
  });

// включаем сортировку в таблице
  $( ".tableBlockDiv" ).each(function() {
    // console.log($( this ).attr('guid'));
    Sortable.create(this, {
      group: {
        name: 'tableData',
        put: ['workMain', 'tableData', 'checkMain']
      },
      animation: 100,
      onAdd: function (evt) {
        if(evt.from.id == 'workMain'){
            // console.log('новая задача исполнителю');
            createSubTask(evt);
        }else if (evt.from.id == 'checkMain') {
            // console.log('возврат на доработку');
            backFromCheck(evt)
        }else{
            // console.log('передача задачи другому исполнителю или на другую дату');
            changeDateOrWorker(evt)
        };
      },
      onUpdate: function (evt) {
        // console.log('сортировка');
        sortSubTask(evt)
      }
    });
  });


// включаем сортировку в списке контроля
  var checkMain = document.getElementById('checkMain');
  Sortable.create(checkMain, {
    group: {
      name: 'checkMain',
      put:  'tableData'
      // pull: 'clone'
    },
    animation: 100,
    onAdd: function (evt) {
      console.log('подзадача передана на контроль');
      gotoCheck(evt);
    }
  });

// включаем сортировку в поле готовности
  var closeMain = document.getElementById('closeTask');
  Sortable.create(closeMain, {
    group: {
      name: 'closeTask',
      put:  ['workMain', 'checkMain']
      // pull: 'clone'
    },
    animation: 100,
    onAdd: function (evt) {
      // console.log('закрыть задачу');
      closeTask(evt);
    }
  });
};







function sortTask(evt) {
  console.log("sortTask");
  console.log(evt);
  // console.log(sortableWorkMain);
  var index = 1;
  var result = '{"data":[';
  var endIndex = Math.max(evt.newIndex, evt.oldIndex) + 1;

  console.log(endIndex);
  $($("#workMain").children()).each(function() {
    // console.log($(this).attr('guid') + ' - ' + index);

    result += '{"guid":"' + $(this).attr('guid') + '"'
    result += ',"index":' + index + '},'

    index++;

    if(index > endIndex){
      return false;
    };
  });

  result += ']}';
  console.log(result);

  //посылаем запрос на сервер
  GetInfo1C('SetPriorityTask', result, allInfo, false);
};


function sortSubTask(evt) {
  console.log("sortSubTask");

// формируем данные для отправки на сервер
  var index = 1;
  var result = '{"data":[';

  $($(evt.to).children()).each(function() {

    result += '{"guid":"' + $(this).attr('guid') + '"'
    result += ',"index":' + index + '},'

    index++;
  });

  result += ']}';
  console.log(result);

//посылаем запрос на сервер
  GetInfo1C('SetPrioritySubTask', result, allInfo, false);

};


function createSubTask(evt) {
  console.log("createSubTask");
  console.log(evt);

// удаляем перетащеный элемент
  evt.item.parentNode.removeChild(evt.item);

// формируем данные для отправки на сервер
  var data = {
      taskGuid: $(evt.clone).attr('guid'),
      workerGuid: $(evt.to).attr('guid'),
      day: $(evt.to).attr('date'),
      prioritet: (evt.newIndex + 1)
  };

//посылаем запрос на сервер
  var result = GetInfo1C('CreateSubTask', JSON.stringify(data), allInfo);

// обрабатываем результат
  result.onclick = function(){
    this.parentNode.removeChild(this);
    updateTable();
  };

};


//================================================================ backFromCheck
function backFromCheck(evt) {
  console.log("backFromCheck");
  console.log(evt);
  // changeCheck($(evt.item).attr('guid'), false)
  changeDateOrWorker(evt);
};
//================================================================ backFromCheck


//==================================================================== gotoCheck
function gotoCheck(evt) {
  console.log("gotoCheck");
  console.log(evt);
  changeCheck($(evt.item).attr('guid'), true)
}
//==================================================================== gotoCheck


//================================================================== changeCheck
function changeCheck(guid, check) {
// формируем данные для отправки на сервер
  var data = {
      guid: guid,
      check: check
  };

//посылаем запрос на сервер
  GetInfo1C('ChangeCheckSubTask', JSON.stringify(data), allInfo, false);
};
//================================================================== changeCheck





function changeDateOrWorker(evt) {
  console.log("changeDateOrWorker");
  console.log(evt);
// формируем данные для отправки на сервер
  var data = {
    guidSubTask: $(evt.item).attr('guid'),
    guidWorker: $(evt.to).attr('guid'),
    date: $(evt.to).attr('date'),
    prioritet: (evt.newIndex + 1)
  };
console.log(data);
//посылаем запрос на сервер
  GetInfo1C("ChangeSubTask", JSON.stringify(data), allInfo, false);
};






function changeSubTaskComment(elem) {
  console.log('changeSubTaskComment');

// формируем данные для отправки на сервер
  var data = {
      guid: $(elem).attr('guid'),
      comment: $(elem).val()
  };

//посылаем запрос на сервер
  GetInfo1C("SetCommentSubTask", JSON.stringify(data), allInfo, false);
}

function changeSubTaskTime(elem) {
  console.log('changeSubTaskTime');

  valTime = $(elem).val();

  if(valTime > 24){
    $(elem).val(24);
    valTime = 24;
  }

// формируем данные для отправки на сервер
  var data = {
      guid: $(elem).attr('guid'),
      time: $(elem).val()
  };

//посылаем запрос на сервер
  var result = GetInfo1C("SetTimeSubTask", JSON.stringify(data), allInfo);
  result.onclick = function(){
    this.parentNode.removeChild(this);
    updateWorkTask();
  };
};




//==================================================================== closeTask
function closeTask(evt) {
  console.log("closeTask");
  console.log(evt);
  var url = 'CloseTask';

  if(evt.from.id == 'workMain'){
      console.log('Закрыть задачу');
      url = 'CloseTask';
      evt.clone.parentNode.removeChild(evt.clone);
  }else{
      console.log('Закрыть подзадачу');
      url = 'CloseSubTask';

  }

  var guid = $(evt.item).attr('guid');
  var result = '{"guid":"' + guid + '"}';

//посылаем запрос на сервер
  var result = GetInfo1C(url, result, allInfo);

  result.onclick = function(){
    this.parentNode.removeChild(this);
    updateWorkTask();
  };
// удаляем задачу с экрана
  // $('#closeTask').html('');
  evt.item.parentNode.removeChild(evt.item);

};
//============================================================ changeTaskComment
function changeTaskComment(elem) {
  console.log('changeTaskComment');

// формируем данные для отправки на сервер
  var data = {
      guid: $(elem).attr('guid'),
      comment: $(elem).val()
  };

//посылаем запрос на сервер
  GetInfo1C("SetCommentTask", JSON.stringify(data), allInfo, false);
};

//=============================================================== changeTaskTime
function changeTaskTime(elem) {
  console.log('changeTaskTime');

// формируем данные для отправки на сервер
  var data = {
      guid: $(elem).attr('guid'),
      time: $(elem).val()
  };

//посылаем запрос на сервер
  GetInfo1C("SetTimeTask", JSON.stringify(data), allInfo, false);
};
