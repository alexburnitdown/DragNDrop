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
		,name:""
		,tag:""
		,file_type:""
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

		// console.log("https://portal.don-arsenal.ru/crm/parties/" + http_get);

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
		getTags();
	}



	$scope.editItem = function (item_id,index) {

		console.log("F:editItem");
		// console.log("type=" + type);

		if($scope.current_user.id == 0) {
			setTimeout(function() {
				$scope.editItem(item_id,index) ;
			},1000);
			return false;
		}

		console.log("item_id=" + item_id);

		// $scope.edit_index = index;

		$scope.message = "";
		$scope.message_alert = "";
		$scope.edit_item_change = false;

		// $scope.postav = [];
		// $scope.zakups = [];
		// $scope.tovars_check = [];

		if(item_id == 0) {
			$scope.edit_item		=
			{
				id:0
				// ,sh:""
				,name:""
				,tag:""
				,file_type:""
				// ,dt:convertToDt(new Date())
				// ,sklad:""
				// ,bill:""
				// ,sotr:$scope.current_user.id + ";#" + $scope.current_user.name
				// ,org:"" 						//Наша
				// ,client:""
				// ,client_kon:""
				// ,supplier:""
				// ,prim:""
				// ,tovars:[]
				// ,files:0
				// ,folders:0
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

			$http.get('getItem/?id=' + item_id + "&rnd=" + Math.random()).then(function success(response) {

				console.log(JSON.stringify(response.data));

				$scope.edit_item = response.data;
				console.log('111', JSON.stringify(response.data));



			});


		}

		UIkit.modal(document.getElementById("modal-edit-element")).show();
		$scope.edit_item_change = false;
	}



	$scope.saveItem = function(index) {

		// console.log("F:saveItem");

		// //console.log(JSON.stringify($scope.edit_item));

		// //if($scope.saving) return false;
		// //$scope.saving = true;

		// $scope.edit_item_change = false;

		// //console.log("$scope.zakups = " + JSON.stringify($scope.zakups));
		// console.log('$scope.edit_item.supplier',$scope.edit_item.supplier);
		// console.log('$scope.edit_item.sklad',$scope.edit_item.sklad);

		// var amount_empty = 0;
		// for(var i = 0 ; i < ($scope.edit_item.tovars).length; i ++) {
		// 	if(($scope.edit_item.tovars[i].kolvo) * 1 == 0) {
		// 		amount_empty ++;
		// 	}

		// 	if(amount_empty == ($scope.edit_item.tovars).length) {
		// 		$scope.message = "Количество не заполнено";
		// 		return false;
		// 	}
		// }

		// console.log("($scope.edit_item.tovars).length = " + ($scope.edit_item.tovars).length);

		// if($scope.edit_item.id == 0) {
		// 	for(j = 0 ; j < amount_empty; j ++) {
		// 		for(i = 0 ; i < ($scope.edit_item.tovars).length; i ++) {
		// 			if(($scope.edit_item.tovars[i].kolvo) * 1 == 0) {
		// 				$scope.edit_item.tovars.splice(i,1);
		// 				break;
		// 			}
		// 		}
		// 	}
		// }
		// for(i = 0 ; i < ($scope.edit_item.tovars).length; i ++) {
		// 	$scope.edit_item.tovars[i].supplier = $scope.edit_item.supplier;
		// 	console.log('$scope.edit_item.tovars[i].supplier',$scope.edit_item.tovars[i].supplier);
		// 	$scope.edit_item.tovars[i].sklad = $scope.edit_item.sklad;
		// 	console.log('$scope.edit_item.tovars[i].sklad',$scope.edit_item.tovars[i].sklad);
		// 	$scope.edit_item.tovars[i].org = $scope.edit_item.org;
		// 	console.log('$scope.edit_item.tovars[i].org',$scope.edit_item.tovars[i].org);
		// 	$scope.edit_item.tovars[i].type = 'Приход';
		// }



		// //console.log('111', $scope.edit_item.tovars);
		// // console.log("$scope.edit_item = " + JSON.stringify($scope.edit_item));

		// // return false;

		// // console.log("$scope.edit_item.tovars = " + JSON.stringify($scope.edit_item.tovars));

		// $http({
		// 	method: 'POST',
		// 	url: 'saveItem/default.aspx',
		// 	data: encodeURIComponent(JSON.stringify($scope.edit_item)),
		// 	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		// }).then(function success(response) {

		// 		// console.log(JSON.stringify(response.data));

		// 		var edit_item_index = -1;

		// 		if($scope.edit_item.id == 0) {

		// 			$scope.item_index = 0;

		// 			$scope.items.splice(0,0,{id:response.data.id});

		// 			$scope.edit_item.id			= response.data.id;
		// 			$scope.edit_item.created	= response.data.created;
		// 			$scope.edit_item.modified	= response.data.modified;
		// 			$scope.edit_item.author		= response.data.author;
		// 			$scope.edit_item.editor		= response.data.editor;

		// 		}

		// 		try{
		// 		$scope.items[$scope.edit_index].sh						= $scope.edit_item.sh;
		// 		$scope.items[$scope.edit_index].dt						= $scope.edit_item.dt;
		// 		$scope.items[$scope.edit_index].supplier			    = $scope.edit_item.supplier;
		// 		$scope.items[$scope.edit_index].client				    = $scope.edit_item.client;
		// 		$scope.items[$scope.edit_index].client_kon				= $scope.edit_item.client_kon;
		// 		$scope.items[$scope.edit_index].sklad					= $scope.edit_item.sklad;
		// 		$scope.items[$scope.edit_index].org 				    = $scope.edit_item.org
		// 		$scope.items[$scope.edit_index].sotr					= $scope.edit_item.sotr;
		// 		$scope.items[$scope.edit_index].bill					= $scope.edit_item.bill;
		// 		//$scope.items[$scope.edit_index].dt						= $scope.edit_item.dt;
		// 		$scope.edit_item.nomen									= response.data.nomen;
		// 		} catch (err) { }


		// 		$scope.message = "Данные успешно сохранены";
		// 		$scope.saving = false;
		// 		$scope.edit_item.tovars = response.data.tovars;

		// 	}, function (response) {
		// 		$scope.saving = false;
		// 		console.log(response);
		// 		$scope.message = "При сохранении данных возникла ОШИБКА";
		// 	}
		// );



	}


	$scope.deleteEditItem = function() {

		console.log("F:deleteEditItem");

		console.log("item_id=111  " + $scope.edit_item.id);

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


function fileChange() {
	// document.getElementById("files").innerHTML = data;

	for(var i = 0; i < $("#ffuplfiles").prop("files").length; i ++) {

		file = $("#ffuplfiles").prop("files")[i];
		console.log("имя файла = " + file.name);
		var file_names = document.querySelector('#files');
		//form_data.append("file", file);
		file_names.append(file.name);

	}


	console.log('OK');

}

var tags_array =[];
var tagify;

function getTags() {
	$.ajax({
		url: "getTags",
		dataType: "JSON",
		cache: false,
		success: function (data) {
			tags_array = data;
			var tag_names = [];
			for (var i = 0; i < data.length; i++) {
				var tag_values = Object.values(data[i]);
				tag_names.push(tag_values[1]);

			}
			console.log('tag_names', tag_names);
			createCloud(tag_names);
			coloredTags();
			showTags(tag_names);
			dragDrop();


		},
		error: function (jqxhr, status, errorMsg) {

			document.getElementById("file_upload_spinner").style.visibility = "hidden";
			//console.log('uploadFiles:' +  errorMsg);
		}
	});
}

function createCloud(tags) {
	console.log('tags', tags);
	if (tags.length) {
		var cloud = document.querySelector('#wordCloud');

		    	var list = document.createElement('ul');
	  			list.className = 'cloud-tags';

		  		for (var i = 0 ; i < tags.length; i++) {
		  			var newListItem = document.createElement('li');
		  			newListItem.className = 'cloud_li';
		  			newListItem.innerHTML = '<a href="#" class="cloud_a">' + tags[i] + '</a>';
		  			list.appendChild(newListItem);;
		  		};
		  		cloud.appendChild(list);
	  }

}

// function coloredTags() {
// 	var totalTags = document.querySelectorAll(".cloud_li");
// 	var mct = document.querySelectorAll(".cloud_a");
// 	/*Array of Colors */
// 	var tagColor = ["#ff0084", "#ff66ff","#43cea2","#D38312","#73C8A9","#9D50BB",
// 	"#780206","#FF4E50","#ADD100",
// 	"#0F2027","#00c6ff", "#81D8D0", "#5CB3FF", "#95B9C7", "#C11B17", "#3B9C9C" , "#FF7F50", "#FFD801", "#79BAEC", "#F660AB", "#3D3C3A", "#3EA055"];
// 	}

function coloredTags(){
	var cloudList = document.querySelector(".cloud-tags");
	var listItems = cloudList.getElementsByTagName('a');

	/*Array of Colors */
	var tagColor = ["#ff0084", "#ff66ff","#43cea2","#D38312","#73C8A9","#9D50BB",
	"#780206","#FF4E50","#ADD100",
	"#0F2027","#00c6ff", "#81D8D0", "#5CB3FF", "#95B9C7", "#C11B17", "#3B9C9C" , "#FF7F50", "#FFD801", "#79BAEC", "#F660AB", "#3D3C3A", "#3EA055"];

    var tagCounter = 0; var color = 0; //assign colors to tags with loop, unlimited number of tags can be added
    do {
         if(color > 21) {color = 0;} //Start again array index if it reaches at last

         if (listItems[tagCounter]) {
	         listItems[tagCounter].style.backgroundColor = tagColor[color];
	     }

     tagCounter++;
     color++;
    } while( tagCounter <= listItems.length - 1)

}


function showTags(tags) {
	console.log('tags', tags);
	var input = document.querySelector('input[name=tags-outside]');
	// init Tagify script on the above inputs
	tagify = new Tagify(input, {
	  // whitelist: ["foo", "bar", "baz"],
	  whitelist: tags,
	  dropdown: {
	    position: "input",
	    enabled : 0 // always opens dropdown when input gets focus
	  }
	})

}


var files_array = [];


function dragDrop() {
	console.log('dragDrop');
	var dropZoneInput = document.querySelector(".drop-zone__input");
	var dropZone = document.querySelector(".drop-zone");

	dropZone.addEventListener("click", (e) => {
	    dropZoneInput.click();

	});

	dropZoneInput.addEventListener("change", (e) => {

	    if (dropZoneInput.files.length) {
	      	var ffiles = dropZoneInput.files;

	    	var file_names = document.querySelector('#files');

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


		console.log(files_array.length);

  		var file_names = document.querySelector('#files');
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
  		};

  		file_names.appendChild(newTable);

	    dropZone.classList.remove("drop-zone--over");
	});

}


	function uploadDocFiles() {
		console.log("F:uploadImage");
		// console.log("F:uploadImage111", files);

		var tags = document.querySelectorAll(".tagify__tag-text");
		var tags_arr = [];
		for(i = 0; i < tags.length; i ++) {
			var lowerCase = tags[i].innerHTML.toLowerCase();
			tags_arr.push(lowerCase);
		}

		if(!tags_arr) {
			alert('no tags');
			return false;
		}

		var form_data = new FormData();

		form_data.append("item_tag", tags_arr);

		for(var i = 0; i < $("#ffuplfiles").prop("files").length; i ++) {

			file = $("#ffuplfiles").prop("files")[i];
			if(file.name.indexOf("..") > 0) {
				alert("в имени файла \"" + file.name + "\" не должно всстречаться сочетание \"..\" (две точки). Измените имя файла.");
				return false;
			}

			form_data.append("file", file);
		}


		// console.log("tt=" + files_array.length);

		for(i = 0; i < files_array.length; i ++){

			file = files_array[i];
			if(file.name.indexOf("..") > 0) {
				alert("в имени файла \"" + file.name + "\" не должно всстречаться сочетание \"..\" (две точки). Измените имя файла.");
				return false;
			}

			form_data.append("file", files_array[i]);
		}

		serverUpload(form_data, tags_arr);

		document.getElementById("file_upload_spinner").style.visibility = "visible";

	}

function serverUpload(form_data, tags) {
	console.log("tags111", tags[0]);
	var tag_names = [];
	$.ajax({
		url: "getTags",
		dataType: "JSON",
		cache: false,
		success: function (data) {

			for (var i = 0; i < data.length; i++) {
				var tag_values = Object.values(data[i]);
				tag_names.push(tag_values[1]);

			}
			console.log('tag_names111', tag_names);



			$.ajax({
			url: 'uploadFiles/default.aspx',
			dataType: "html",
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,
			type: 'post',
			success: function (data) {
				// console.log("data", data);


				console.log("tags", tags.length);
				// for (var i = 0; i < tags.length; i++) {
				// 	var tag_values = Object.values(tags[i]);
				// 	cur_tags.push(tag_values[1]);
				// }

				var uniq_tags = [];

				// console.log("cur_tags", cur_tags);
				console.log('tag_names222', tag_names.length);
				for(i = 0; i < tags.length; i ++ ){
					var k = 0;
					// console.log('tag_names222', tag_names);
					for(j = 0; j < tag_names.length; j ++) {


						if ((tag_names)[j] === tags[i]) {
							console.log('такой уже есть');
							// tag_names[j].count += 1;
							k = 1;
						}
					}
					if (k == 0) {
						//Добавляем во все места.

						console.log('такого нет, добавляю');
							tag_names.push(tags[i]);
							console.log('tag_names', tag_names);
							// showTags(tag_names);
							// createCloud(tag_names);
							uniq_tags.push(tags[i]);
							var form_data2 = new FormData();
							form_data2.append("new_tag", uniq_tags);

							console.log('uniq_tags', uniq_tags);
							$.ajax({
								url: 'saveTags/default.aspx',
								dataType: "html",
								cache: false,
								contentType: false,
								processData: false,
								data: form_data2,
								type: 'post'
							})

					}

				}
				alert('Данные успешно загружены');
				document.getElementById("file_upload_spinner").style.visibility = "hidden";
				var filesTable = document.querySelector(".tableTable");
				filesTable.parentNode.removeChild(filesTable);

				var tagifyTag = document.querySelectorAll(".tagify__tag");
				for(var i = 0; i < tagifyTag.length; i ++) {
					tagifyTag[i].parentNode.removeChild(tagifyTag[i]);
				}


			},
			error: function (jqxhr, status, errorMsg) {
				alert('Ошибка');
				//document.getElementById("file_upload_spinner" + prefixx).style.visibility = "hidden";
				//console.log('uploadFiles:' +  errorMsg);
			}
		});





		},
		error: function (jqxhr, status, errorMsg) {

			document.getElementById("file_upload_spinner").style.visibility = "hidden";
			//console.log('uploadFiles:' +  errorMsg);
		}
	});


}

