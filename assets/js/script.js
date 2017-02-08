window.onload = function() {

// DECLARATION VARIABLES
	var body = document.querySelector('body');
	var modal = document.querySelector('#Modal');
	var contentModal = document.querySelector('#contentModal');
	var close = document.querySelector("#close");
	var newColumn = document.querySelector('#newColumn');
	var columnsList = localStorage.getItem("columns");
	var main = document.querySelector("#main");

// FUNCTIONS
	function displayColumns() {
		columnsList = JSON.parse(columnsList); // converts json string to javascript object

		for (var i = 0; i < columnsList.length; i++) {
			var content = document.createElement("div");
			content.className = "columns";

			var h2 = document.createElement("h2");
			h2.contentEditable = true; // makes the text editable
			var h2Content = document.createTextNode(columnsList[i]);
			h2.appendChild(h2Content);
			content.appendChild(h2);

			var divTask = document.createElement("div");
			divTask.className = "newTask";
			divTask.dataset.columnid = i;
			content.appendChild(divTask);

			main.insertBefore(content, newColumn); // inserts content before newColumn in main
		}
	}

	function displayTask(columnId, title, desc, checkbox, taskName) {
		var content = document.createElement("div");
		content.className = "task";
		content.dataset.name = taskName;

		var h3 = document.createElement("h3");
		var h3Content = document.createTextNode(title);
		h3.appendChild(h3Content);
		content.appendChild(h3);

		var descSpan = document.createElement("span");
		descSpan.className = "desc";
		var descContent = document.createTextNode(desc);
		descSpan.appendChild(descContent);
		content.appendChild(descSpan);

		if (desc.length > 1) { // if there is content in desc (not just space)
			descSpan.style.backgroundImage = "url('assets/img/copy.png')";
		}

		if (Object.keys(checkbox).length > 0) { // Object.keys -> get object size 
			var checkboxes = document.createElement("div");
			checkboxes.className = "checkboxes";

			for (var key in checkbox) {
				name = checkbox[key]['name']; // gets name of current checkbox
				var input = document.createElement("input");
				input.type = "checkbox"; 
				input.class = "checkbox";
				input.id = name.replace(" ", ""); // avoids spaces in localStorage key
				checkboxes.appendChild(input);

				var label = document.createElement("label");
				label.for = name.replace(" ", "");
				label.innerHTML = name;
				checkboxes.appendChild(label);

				var br = document.createElement("br");
				checkboxes.appendChild(br);
			}
			content.appendChild(checkboxes);
		}
		column[columnId].insertBefore(content, newTask[columnId]);
	}

	function addTask(columnId) {
		openModal();
		var counter = 0;
		contentModal.innerHTML += '<form name="addTask" class="formTask"><h2>Create task</h2><input type="text" name="title" placeholder="Title"><textarea name="desc" placeholder="Description"></textarea>Create some checkbox<div id="dynamicInput"></div><input type="button" id="addCheckbox" value="Add another checkbox"><input type="submit" id="submitTask" value="Create Task"></form>';
		var form = document.forms['addTask'];

		var addCheckbox = document.querySelector('#addCheckbox');
		addCheckbox.onclick = function() {
			addInputCheckbox(counter);
			counter ++
	};

	form.onsubmit = function() {
		var array = {}; // not declared as array otherwise impossible to convert in json object
		array["columnId"] = columnId;
		array["title"] = form.elements['title'].value;
		array["desc"] = form.elements['desc'].value;
		array["checkbox"] = {};

		for (var i = 0; i < counter; i++) {
			var checkbox = form.elements['checkbox'];
			if (counter === 1) { // if 1 checkbox
					array["checkbox"][0] = {}; // add [0] avoids double loops and 'undefined' checkbox value
					array["checkbox"][0]["name"] = checkbox.value;
					array["checkbox"][0]["checked"] = false;
				}
				else {
					array["checkbox"][i] = {};
					array["checkbox"][i]["name"] = checkbox[i].value;
					array["checkbox"][i]["checked"] = false;
				}
			}

			var title = columnId + '_' + array["title"];
			title = title.replace(" ", "");
			localStorage.setItem(title,JSON.stringify(array));

			if (localStorage.getItem("tasks") === null) {
				var tasks = [title]; // displays title in array
				localStorage.setItem("tasks",JSON.stringify(tasks));
			}
			else {
				var tasks = localStorage.getItem("tasks");
				tasks = JSON.parse(tasks);
				tasks.push(title);
				localStorage.setItem("tasks",JSON.stringify(tasks));
			}
		};
	};

	function addColumn() {
        openModal();
        contentModal.innerHTML = '<form name="addColumn"><input type="text" name="columnName" placeholder="Enter the column name"><input type="submit" id="createColumn" value="Create column"></form>';
        var form = document.forms['addColumn'];
        var title = [];

        form.onsubmit = function() {
            var columnsList = localStorage.getItem("columns");
            if (columnsList === null) {
                title[0] = form.elements['columnName'].value;
                localStorage.setItem("columns", JSON.stringify(title));
            }
            else {
                columnsList = JSON.parse(columnsList);
                columnsList.push(form.elements['columnName'].value);
                localStorage.setItem("columns",JSON.stringify(columnsList));
            }
        }
    }


	function addInputCheckbox(counter) {
		var newdiv = document.createElement('div');
		newdiv.innerHTML = '<input type="text" name="checkbox" class="checkbox" placeholder="Entry ' + (counter + 1) + '">';
		document.querySelector("#dynamicInput").appendChild(newdiv); // adds text field in contentModal to create checkbox
	}

	function hideModal() {
		modal.style.display = "none";
		contentModal.innerHTML = '';
	}

	function openModal() {
		contentModal.innerHTML = '';
		modal.style.display = "flex";
	}

	function taskClick() {
		var tasks = document.querySelectorAll('.task');
		var checkboxes = document.querySelectorAll('.task .checkboxes');

		for (var i = 0; i < tasks.length; i++) {
			tasks[i].onclick = function() {
				openModal();
				var taskName = this.dataset.name;
				var clone = this.cloneNode(true); // clones task to avoid make it disappear

				var task = localStorage.getItem(taskName);
				var columns = localStorage.getItem("columns");

				task = JSON.parse(task);
				columns = JSON.parse(columns);

				var h2 = document.createElement("h2");
				var column = document.createTextNode(columns[task["columnId"]]);
				h2.appendChild(column);
				contentModal.appendChild(h2);
				contentModal.appendChild(clone);

				var h3 = document.querySelector('#contentModal .task h3');
				h3.contentEditable = true;

				var desc = document.querySelector('#contentModal .task .desc');
				desc.contentEditable = true;

				var formValidate = document.createElement("form");
				formValidate.className = "nope modify";

				var button1 = document.createElement("input");
				button1.type = "submit";
				button1.className = "taskValidate";
				button1.value = "Validate";
				formValidate.appendChild(button1);
				contentModal.appendChild(formValidate);

				var formDelete = document.createElement("form");
				formDelete.className = "nope"; // css

				var button2 = document.createElement("input");
				button2.type = "submit";
				button2.className = "taskDelete";
				button2.value = "Delete Task";
				formDelete.appendChild(button2);
				contentModal.appendChild(formDelete);

				var title; // global in taskClick
				var descContent;

				h3.onblur = function() { // when out of focus
					title = this.innerHTML; // adds content of h3 edited in task title
				};
				desc.onblur = function() {
					descContent = this.innerHTML;
				};

				formValidate.onsubmit = function() {
					if (title !== undefined) {
						task["title"] = title;
					}
					if (descContent !== undefined) {
						task["desc"] = descContent;
					}
					localStorage.setItem(taskName, JSON.stringify(task));
				};

				formDelete.onsubmit = function() {
					localStorage.removeItem(taskName);
					tasks = localStorage.getItem("tasks");
					tasks = JSON.parse(tasks);
					var index = tasks.indexOf(taskName);
					tasks.splice(index, 1); // deletes from key 1 to the end of array index
					localStorage.setItem("tasks", JSON.stringify(tasks));
				}
			};
		}
	}

// MAIN PROGRAM
	if (columnsList !== null) {
		displayColumns();
		var h2 = document.querySelectorAll('h2');

		for (var p = 0; p < h2.length; p++) {
			var h2Active = h2[p];

			if (h2Active.contentEditable) {
				h2Active.onfocus = function() {
					var columnTitle = localStorage.getItem("columns");
					columnTitle = JSON.parse(columnTitle);
					var index = columnTitle.indexOf(this.innerHTML);

					this.onblur = function() {
						var text = this.innerHTML;
						columnTitle[index] = text;
						localStorage.setItem("columns", JSON.stringify(columnTitle));
					};
				};
			}
		}

		var column = document.querySelectorAll('.columns');
		var tasksList = localStorage.getItem("tasks");
		var newTask = document.querySelectorAll('.newTask');

		if (tasksList !== null) {
			tasksList = JSON.parse(tasksList);
			for (var k = 0; k < tasksList.length; k++) {
				var task = localStorage.getItem(tasksList[k]);
				task = JSON.parse(task);
				displayTask(task['columnId'], task['title'], task['desc'], task['checkbox'], tasksList[k]);
			}
			taskClick();
		}
		for (var j = 0; j < newTask.length; j++) {
			newTask[j].onclick = function() {
				addTask(this.dataset.columnid);
			};
		}
	}

	newColumn.onclick = function() {
		addColumn();
	};

	close.onclick = function() {
		hideModal();
	};

	document.onclick = function(event) {
		if (event.target == modal) {
			hideModal();
		}
	};

};