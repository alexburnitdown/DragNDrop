var App = angular.module("App", ['ngSanitize']);

App.controller('list', function($scope,$http,$sanitize) {

	var ua = window.navigator.userAgent.toLowerCase();
	$scope.is_ie = (/trident/gi).test(ua) || (/msie/gi).test(ua);

	$scope.view_loader = false;
	$scope.message = "";
	$scope.message_alert = "";
	$scope.saving = false;

	$scope.current_user			= {
		id:0,
		name:"",
		groups:[],
		full_access:false,
		chief_accsess:false,
		buh_access:false
	}

	$scope.items				= [];
	$scope.org					= [];
	$scope.sotrs				= [];
	$scope.client				= [];
	$scope.supplier				= [];
	$scope.nomen				= {};
	$scope.zakups				= [];
	$scope.postav 				= [];
	$scope.tovars_check			= [];
	$scope.tovars_empty			= [];

	$scope.last_packeg_length	= 0;
	$scope.page_size			= 50;
	$scope.items_last_id		= 1000000;

	$scope.search = "";

	$scope.file_change = false;

	$scope.colls				=
	[	 {field: "sotr",		name: "Сотрудник"			,filter: "",	filter_type: "select",	select_options: [{name:"",value:""}]}
		// ,{field: "org",			name: "Организация"			,filter: "",	filter_type: "select",	select_options: [
		// 	{name:"",					value:""},
		// 	{name:"АумаПриводСервис",	value:"АумаПриводСервис"},
		// 	{name:"Дон-Арсенал",		value:"Дон-Арсенал"},
		// 	{name:"НТЦ Самсон-Тюмень",	value:"НТЦ Самсон-Тюмень"},
		// 	{name:"ПриводСервис",		value:"ПриводСервис"},
		// 	{name:"Самсон-Тюмень",		value:"Самсон-Тюмень"},
		// 	{name:"СТ Автоматизация",	value:"СТ Автоматизация"},
		// 	{name:"Стандарм",			value:"Стандарм"}
		// 	]
		// }
		,{field: "dt_from",		name: "Период с"			,filter: "",	filter_type: "date",	select_options: [{name:""}]}
		,{field: "dt_to",		name: "Период по"			,filter: "",	filter_type: "date",	select_options: [{name:""}]}
		// ,{field: "sklad",		name: "Склад"				,filter: "",	filter_type: "select",	select_options: [
		// 	{name:"",							value:""},
		// 	{name:"Ростов-на-Дону.ДА",			value:"Ростов-на-Дону.ДА"},
		// 	{name:"Ростов-на-Дону.ПС",			value:"Ростов-на-Дону.ПС"},
		// 	{name:"Самара",						value:"Самара"},
		// 	{name:"Сургут.АПС",					value:"Сургут.АПС"},
		// 	{name:"Сургут.СТ",					value:"Сургут.СТ"},
		// 	{name:"Тюмень.АВТ",					value:"Тюмень.АВТ"},
		// 	{name:"Тюмень.АПС",					value:"Тюмень.АПС"},
		// 	{name:"Уфа",						value:"Уфа"}
		// 	]
		// }
	];

	$scope.colls_filter_result = [];

	$scope.edit_index	= 0;
	$scope.edit_item	= {
		 id:0
		,sh:""
		,dt:""
		,name:""
		,bill:""
		,sklad:""
		,org:""
		,client:""
		,client_kon:""
		,supplier:""
		,prim:""
		,tovars:[
			{
				id:0,
				name:"",
				name_bill:"", 	// название товара по счету
				nomen_tovars:"", 		// название товара из конструктора
				zakups_kolvo:0,
				kolvo:0,		// поле ручного ввода
				price_rub:0,
				dt:"",
				sh:"",
				postav:"",
				prihod:"",
				supplier:"",
				client:"",
				client_kon:"",
				sotr:"",
				sklad:"",
				bill:"",
				type:"",
				org:""
			}
		]
		,files:0
		,folders:0
		,created:""
		,modified:""
		,author:""
		,editor:""
	}

	$scope.edit_item_change = false;
	//$scope.search_org = "";
	//$scope.search_orgs = [{id:0,title:""}];

	$http.get('/total/ajax/getSotrs/?rnd=' + Math.random()).then(function success(response) {

		$scope.sotrs = response.data;
		$scope.colls[0].select_options = $scope.sotrs;

	});

		$scope.$watch("edit_item.files",function(newName, oldName){
		if($scope.items.length > 0) {
			//console.log("edit_item.files=" + $scope.edit_item.files);
			$scope.items[$scope.edit_index].files = $scope.edit_item.files;
			//console.log("$scope.edit_index=" + $scope.edit_index);
			//console.log("$scope.items[$scope.edit_index].files=" + $scope.items[$scope.edit_index].files);
		}
	},true);


	//$http.get('/total/ajax/getPlats/?rnd=' + Math.random()).then(function success(response) {

	//	$scope.org = response.data;
	//	$scope.colls[1].select_options = $scope.org;

	//});


	$http.get('/total/ajax/getUser/').then(function success(response) {

		$scope.current_user = response.data;

		if($scope.current_user.groups["Дон-Арсенал - владельцы"]) {
			$scope.current_user.full_access = true;
		}
		if($scope.current_user.groups["SP.Входящие документы"]) {
			$scope.current_user.buh_access = true;
		}

		console.log("$scope.current_user=" + JSON.stringify($scope.current_user));

		var href = decodeURIComponent(document.location.href);

		console.log("document.location.href=" + document.location.href);

		//$scope.colls[0].filter = $scope.current_user.id + ";#" + $scope.current_user.name;


		if(href.indexOf("?id=") > 0) {

			var id = href.split("id=")[1];

			setTimeout(function() {
				$scope.editItem(id,0) ;
			},1000);
		}

		$scope.setFilter();


	});


	$scope.setSearch = function (event) {
		if(event.keyCode == 13)	{
			$scope.setFilter();
		};
	}

	$scope.delFilter = function (index) {

		$scope.colls[index].filter = "";
		$scope.setFilter();

	}

	$scope.setFilter = function () {

		console.log("F:setFilter");

		$scope.items	= [];
		$scope.items_last_id = 1000000;
		$scope.last_packeg_length = 0;

		for(var i = 0; i < $scope.colls.length; i++) {

			if($scope.colls_filter_result[i] == null) {
				$scope.colls_filter_result.push({name:$scope.colls[i].name,filter:""});
			};

			$scope.colls_filter_result[i].filter = $scope.colls[i].filter;
		}

		$scope.getItems();

	}

	$scope.getItems = function () {

		console.log("F:getItems");

		$scope.view_loader = false;

		var http_get  = "";
		http_get += "getItems/?";
		http_get += "search=" 	+ encodeURIComponent($scope.search)				+ "&";

		for(var i = 0; i < $scope.colls.length; i ++) {
			if(($scope.colls[i].filter).indexOf('#') > 0) {
				http_get += $scope.colls[i].field + "="	+ encodeURIComponent(($scope.colls[i].filter).split(';')[0])	+ "&";
			} else {
				http_get += $scope.colls[i].field + "="	+ encodeURIComponent($scope.colls[i].filter)	+ "&";
			}
		}

		http_get += "last_id="	+ $scope.items_last_id							+ "&";
		http_get += "rnd="		+ Math.random()									+ "&";

		console.log("https://portal.don-arsenal.ru/crm/parties/" + http_get);

		$http.get(http_get).then(function success(response) {

			// console.log(JSON.stringify(response.data));

			//$scope.items = response.data;
			for(var i = 0; i < response.data.length ; i ++) {

				$scope.items.push(response.data[i]);

			}


			$scope.last_packeg_length = response.data.length;
			// console.log("$scope.last_packeg_length=" + $scope.last_packeg_length);
			if($scope.items.length > 0) {
				$scope.items_last_id = $scope.items[$scope.items.length - 1].id;
			};

			$scope.view_loader = false;

		});

	}



	$scope.editItem = function (item_id,index,type) {

		console.log("F:editItem");
		console.log("type=" + type);

		if($scope.current_user.id == 0) {
			setTimeout(function() {
				$scope.editItem(item_id,index) ;
			},1000);
			return false;
		}

		console.log("item_id=" + item_id);

		$scope.edit_index = index;

		$scope.message = "";
		$scope.message_alert = "";
		$scope.edit_item_change = false;

		$scope.postav = [];
		$scope.zakups = [];
		$scope.tovars_check = [];

		if(item_id == 0) {
			$scope.edit_item		=
			{
				id:0
				,sh:""
				,name:""
				,postav:""
				,dt:convertToDt(new Date())
				,sklad:""
				,bill:""
				,sotr:$scope.current_user.id + ";#" + $scope.current_user.name
				,org:"" 						//Наша
				,client:""
				,client_kon:""
				,supplier:""
				,prim:""
				,tovars:[]
				,files:0
				,folders:0
				,created:""
				,modified:""
				,author:""
				,editor:""
			};
			if($scope.colls[1].filter != "") {
				console.log($scope.colls[1].filter);
				$scope.edit_item.sotr = $scope.colls[1].filter;
			}


			//console.log("edit_item=" + JSON.stringify($scope.edit_item));

		} else {
			/*
			$http.get('getItem/?id=' + item_id + "&rnd=" + Math.random()).then(function success(response) {

				//console.log(JSON.stringify(response.data));

				$scope.edit_item = response.data;


				console.log('https://portal.don-arsenal.ru/crm/parties/getTovars/?prihod=' + item_id + "&rnd=" + Math.random());
				$http.get('getTovars/?prihod=' + item_id + "&rnd=" + Math.random()).then(function success(response) {

					//console.log(JSON.stringify(response.data));

					$scope.edit_item.tovars = response.data;
					//$scope.checkMaxKolvo();
					$scope.getZakups();
					console.log("$scope.edit_item=" + JSON.stringify($scope.edit_item));
				});


			});
			*/



			//console.log('getComments/?id=' + item_id + "&commentlist=" + encodeURIComponent("Реестр Запросов") + "&rnd=" + Math.random());



		}

		UIkit.modal(document.getElementById("modal-edit-element")).show();
		getTags();
		$scope.edit_item_change = false;
	}



	$scope.saveItem = function(index) {

		console.log("F:saveItem");

		//console.log(JSON.stringify($scope.edit_item));

		//if($scope.saving) return false;
		//$scope.saving = true;

		$scope.edit_item_change = false;

		//console.log("$scope.zakups = " + JSON.stringify($scope.zakups));
		console.log('$scope.edit_item.supplier',$scope.edit_item.supplier);
		console.log('$scope.edit_item.sklad',$scope.edit_item.sklad);

		var amount_empty = 0;
		for(var i = 0 ; i < ($scope.edit_item.tovars).length; i ++) {
			if(($scope.edit_item.tovars[i].kolvo) * 1 == 0) {
				amount_empty ++;
			}

			if(amount_empty == ($scope.edit_item.tovars).length) {
				$scope.message = "Количество не заполнено";
				return false;
			}
		}

		console.log("($scope.edit_item.tovars).length = " + ($scope.edit_item.tovars).length);

		if($scope.edit_item.id == 0) {
			for(j = 0 ; j < amount_empty; j ++) {
				for(i = 0 ; i < ($scope.edit_item.tovars).length; i ++) {
					if(($scope.edit_item.tovars[i].kolvo) * 1 == 0) {
						$scope.edit_item.tovars.splice(i,1);
						break;
					}
				}
			}
		}
		for(i = 0 ; i < ($scope.edit_item.tovars).length; i ++) {
			$scope.edit_item.tovars[i].supplier = $scope.edit_item.supplier;
			console.log('$scope.edit_item.tovars[i].supplier',$scope.edit_item.tovars[i].supplier);
			$scope.edit_item.tovars[i].sklad = $scope.edit_item.sklad;
			console.log('$scope.edit_item.tovars[i].sklad',$scope.edit_item.tovars[i].sklad);
			$scope.edit_item.tovars[i].org = $scope.edit_item.org;
			console.log('$scope.edit_item.tovars[i].org',$scope.edit_item.tovars[i].org);
			$scope.edit_item.tovars[i].type = 'Приход';
		}



		//console.log('111', $scope.edit_item.tovars);
		// console.log("$scope.edit_item = " + JSON.stringify($scope.edit_item));

		// return false;

		// console.log("$scope.edit_item.tovars = " + JSON.stringify($scope.edit_item.tovars));

		$http({
			method: 'POST',
			url: 'saveItem/default.aspx',
			data: encodeURIComponent(JSON.stringify($scope.edit_item)),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).then(function success(response) {

				// console.log(JSON.stringify(response.data));

				var edit_item_index = -1;

				if($scope.edit_item.id == 0) {

					$scope.item_index = 0;

					$scope.items.splice(0,0,{id:response.data.id});

					$scope.edit_item.id			= response.data.id;
					$scope.edit_item.created	= response.data.created;
					$scope.edit_item.modified	= response.data.modified;
					$scope.edit_item.author		= response.data.author;
					$scope.edit_item.editor		= response.data.editor;

				}

				try{
				$scope.items[$scope.edit_index].sh						= $scope.edit_item.sh;
				$scope.items[$scope.edit_index].dt						= $scope.edit_item.dt;
				$scope.items[$scope.edit_index].supplier			    = $scope.edit_item.supplier;
				$scope.items[$scope.edit_index].client				    = $scope.edit_item.client;
				$scope.items[$scope.edit_index].client_kon				= $scope.edit_item.client_kon;
				$scope.items[$scope.edit_index].sklad					= $scope.edit_item.sklad;
				$scope.items[$scope.edit_index].org 				    = $scope.edit_item.org
				$scope.items[$scope.edit_index].sotr					= $scope.edit_item.sotr;
				$scope.items[$scope.edit_index].bill					= $scope.edit_item.bill;
				//$scope.items[$scope.edit_index].dt						= $scope.edit_item.dt;
				$scope.edit_item.nomen									= response.data.nomen;
				} catch (err) { }


				$scope.message = "Данные успешно сохранены";
				$scope.saving = false;
				$scope.edit_item.tovars = response.data.tovars;

			}, function (response) {
				$scope.saving = false;
				console.log(response);
				$scope.message = "При сохранении данных возникла ОШИБКА";
			}
		);



	}


	$scope.deleteEditItem = function() {

		console.log("F:deleteEditItem");

		if(confirm('Подтвердите удаление')) {

			$http.get('deleteEditItem/?id=' + $scope.edit_item.id).then(function success(response) {

				var edit_index = 0;
				for(var i = 0; i < $scope.items.length; i ++) {
					if($scope.items[i].id == $scope.edit_item.id) {
						edit_index = i;
						break;
					}
				}

				$scope.items.splice(edit_index,1)

			});
		}


	}



	$scope.setChange = function() {

		console.log("F:setChange");

		$scope.message = "";

		$scope.edit_item_change = true;
	}









	$scope.fileChange = function() {

		$scope.file_change = true;
	}

})

function serverUpload(form_data) {
	$.ajax({
			url: 'uploadFiles/default.aspx',
			dataType: "html",
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,
			type: 'post',
			success: function (data) {

				alert('Данные успешно загружены');
				document.getElementById("file_upload_spinner").style.visibility = "hidden";
				//document.getElementById("file_upload_spinner" + prefixx).style.visibility = "hidden";
				var filesTable = document.querySelector(".tableTable");
				filesTable.parentNode.removeChild(filesTable);
				//getFiles(prefix,'reculc');

				var tagifyTag = document.querySelectorAll(".tagify__tag");
				for(var i = 0; i < tagifyTag.length; i ++) {
					tagifyTag[i].parentNode.removeChild(tagifyTag[i]);
				}

				for(i = 0; i < form_data.item_tag.length;i ++ ){
					k = 0;
					for(j = 0; j < tags_array[j]; j ++) {
						
						if(tags_array)[j] == form_data.item_tag[i] {
							tags_array[i].count += 1;
							k = 1;
						}
					}
					if(k = 0) {
						//Добавляем во все места.
						tags_array.push();
						tags_names.push();
						//$.get(addTAG)({

						//})
					}
					
				}

			},
			error: function (jqxhr, status, errorMsg) {
				alert('Ошибка');
				//document.getElementById("file_upload_spinner" + prefixx).style.visibility = "hidden";
				//console.log('uploadFiles:' +  errorMsg);
			}
		});
}

function fileChange() {
	// document.getElementById("files").innerHTML = data;

	for(var i = 0; i < $("#ffuplfiles").prop("files").length; i ++) {

		file = $("#ffuplfiles").prop("files")[i];
		console.log("имя файла = " + file.name);
		var file_names = document.querySelector('#filesTable');
		//form_data.append("file", file);
		file_names.append(file.name);

	}


	console.log('OK');

}

var tags_array =[];
//var tags_ob = {};




function getTags() {
	$.ajax({
		url: "getTags",
		dataType: "JSON",
		//type: "POST",
		//data:{
		//		'name':name
		//	},
		cache: false,
		//contentType: false,
		//processData: false,
		success: function (data) {
			tags_array = data;
			var tag_names = [];
			for (var i = 0; i < data.length; i++) {
				var tag_values = Object.values(data[i]);
				tag_names.push(tag_values[1]);

			}
			console.log('tag_names', tag_names);
			tagify(tag_names);
			dragDrop();

		},
		error: function (jqxhr, status, errorMsg) {

			document.getElementById("file_upload_spinner").style.visibility = "hidden";
			//console.log('uploadFiles:' +  errorMsg);
		}
	});
}

function tagify(tags) {
	console.log('tags', tags);
	var input = document.querySelector('input[name=tags-outside]')
	// init Tagify script on the above inputs
	var tagify = new Tagify(input, {
	  // whitelist: ["foo", "bar", "baz"],
	  whitelist: tags,
	  dropdown: {
	    position: "input",
	    enabled : 0 // always opens dropdown when input gets focus
	  }
	})
}

function handleFiles(files) {
  filesArr = [...files];
  console.log('files', filesArr);
  // files.forEach(uploadFile);
}

var files_array = [];


function dragDrop() {
	console.log('dragDrop');
	var dropZoneInput = document.querySelector(".drop-zone__input");
	var dropZone = document.querySelector(".drop-zone");
	// var dropZone = dropZoneInput.closest(".drop-zone");

	dropZone.addEventListener("click", (e) => {
	    dropZoneInput.click();

	});

	dropZoneInput.addEventListener("change", (e) => {

	    if (dropZoneInput.files.length) {
	      // updateThumbnail(dropZone, dropZoneInput.files[0]);
	      var ffiles = dropZoneInput.files;
	     //  var dt = e.dataTransfer;
	  	  // var files = dt.files;

	  	  // files = [...files];



	    var file_names = document.querySelector('#filesTable');

	    var newTable = document.createElement('table');
  		newTable.className = 'tableTable';

  		var newRow = document.createElement('tr');
  		newRow.className = 'table_row';

	  		for (var i = 0 ; i < ffiles.length; i++) {
	  			var newCell = document.createElement('td');
	  			newCell.className = 'table_cell';
	  			newCell.innerHTML = '<span class=uk-text-truncate>' + ffiles[i].name + '</span>';
	  			newRow.appendChild(newCell);
	  			newTable.appendChild(newRow);
	  		};
	  		file_names.appendChild(newTable);
	      // file_names.append(ffile.name);
	      // console.log('ffile', ffile.name);
	    }
	});

	dropZone.addEventListener("dragover", e =>{
		e.preventDefault();
		dropZone.classList.add("drop-zone--over");
	});

	["dragleave", "dragend"].forEach(type => {

		dropZone.addEventListener(type, e => {
			dropZone.classList.remove("drop-zone--over");
		});

	});

    dropZone.addEventListener("drop", (e) => {

	    e.preventDefault();
	    console.log("eee", e);

	    var dt = e.dataTransfer;
		files_array = dt.files;
		files = dt.files;
		//for(var i = 0; i < files_array.length; i ++) {
			
		//	console.log(i);
			//form_data.append("file", files[i]);
		//}

		
		  console.log(files_array.length);
		  //$("#ffuplfiles").prop("files") = files;
  		//files = [...files];
  		// console.log("fff222", files);
  		// console.log("fff111", dropZoneInput.files.length);

  		// handleFiles(files);

  		// console.log("fff333", files);
  		// console.log("fff333", files.length);
  		// if (files.length != 0) {
	   //    dropZoneInput.files === files;
	   //    // updateThumbnail(dropZone, e.dataTransfer.files[0]);
	   //  }
	   //  console.log("fff111", dropZoneInput.files);
  		var file_names = document.querySelector('#filesTable');
  		var newTable = document.createElement('table');
  		newTable.className = 'tableTable';
  		var newRow = document.createElement('tr');
  		newRow.className = 'table_row';
  		for (var i =0 ; i < files.length; i++) {
  			var newCell = document.createElement('td');
  			newCell.className = 'table_cell';
  			newCell.innerHTML = '<span class=uk-text-truncate>' + files[i].name + '</span>';
  			newRow.appendChild(newCell);
  			newTable.appendChild(newRow);
  	// 		st1 += "<tr>";
  	// 		st1 += "<td width=80% class=uk-text-truncate>" + files[i].name + "</a></td>";
  	// 		st1 += "<td style=width:20px><span style=\"width:20px\" onclick=\"renameFile(this)\" class=\"uk-margin-left uk-icon-button\" uk-icon=\"icon: pencil; ratio: 0.7\"></span></td>";
			// st1 += "<td style=width:20px><span onclick=\"deleteFile(this)\" class=\"uk-icon-button\" uk-icon=\"icon: trash; ratio: 0.7\"></span></td>";
  	// 		st1 += "</tr>";
  		};
  		// files.foreach(function(file) {
  		// 	file_names.append(file.name);
  		// });
 		// initializeProgress(files.length);
  		// files.forEach(uploadFile);
  		file_names.appendChild(newTable);

		//form_data.append("file", file);
		// var ffile = dt.files[0];

	    dropZone.classList.remove("drop-zone--over");
	});

}

	//var form_data = new FormData();

	function uploadDocFiles() {
		console.log("F:uploadImage");
		// console.log("F:uploadImage111", files);

		var tags = document.getElementById("item_tag");
		if(!tags.value) {
			alert('no tags');
			return false;
		}
		

		//var prefixx = "";
		//if(!prefix) prefix = "";
		//if(prefix != "") prefixx= "_" + prefix;

		//console.log("File_amount=" + $("#ffuplfiles").prop("files").length);

		var form_data = new FormData();

		form_data.append("item_tag", tags.value);

		//form_data.append("item_id",		document.getElementById("item_id" + prefixx).value);

		// form_data.append("file_library",document.getElementById("file_library" + prefixx).value);
		// form_data.append("file_path",	document.getElementById("file_path" + prefixx).value);

		//console.log(JSON.stringify(form_data));
		// var dropZoneInput = document.querySelector(".drop-zone__input");
		 //console.log("fff444", dropZoneInput.files.length);
		for(var i = 0; i < $("#ffuplfiles").prop("files").length; i ++) {

			file = $("#ffuplfiles").prop("files")[i];
			if(file.name.indexOf("..") > 0) {
				alert("в имени файла \"" + file.name + "\" не должно всстречаться сочетание \"..\" (две точки). Измените имя файла.");
				return false;
			}
			//if(tags.value) {
				form_data.append("file", file);
			//	serverUpload(form_data);
			//} else {
			//	document.getElementById("file_upload_spinner").style.visibility = "hidden";

			//	alert('no tags');


			//}


		}


		console.log("tt=" + files_array.length);

		for(i = 0; i < files_array.length; i ++){

			file = files_array[i];
			if(file.name.indexOf("..") > 0) {
				alert("в имени файла \"" + file.name + "\" не должно всстречаться сочетание \"..\" (две точки). Измените имя файла.");
				return false;
			}

			form_data.append("file", files_array[i]);

		}

		serverUpload(form_data);

		document.getElementById("file_upload_spinner").style.visibility = "visible";




	}



