var triangles = [];

const EPS = 0.0001

const ADD_MODAL = "add-modal";
const CHANGE_MODAL = "change-modal";
const RESULT_MODAL = "result-modal";

const LIST_TABLE_ID = "list";

const CHANGE_BTN_CLASS = "change-button";
const INFO_BTN_CLASS = "info-button";
const DELETE_BTN_CLASS = "delete-button";

const SUBMIT_CHANGE_ID = "submit-change";
const SCALE_ID = "scale";

const TYPE_DESC = ["Разносторонний", "Равнобедренный", "Равносторонний"];

const R_SIDE1_ID = "result-side1";
const R_SIDE2_ID = "result-side2";
const R_SIDE3_ID = "result-side3";
const R_ANGLE1_ID = "result-angle1";
const R_ANGLE2_ID = "result-angle2";
const R_ANGLE3_ID = "result-angle3";
const R_TYPE_ID = "result-type";
const R_CENTER_ID = "result-distance-bc";

const I_SIDE1_ID = "first-side";
const I_SIDE2_ID = "second-side";
const I_ANGLE_ID = "angle";

const INFO_ID = "info";
const CHANGE_ID = "change";
const DELETE_ID = "delete";
const NUMBER_ID = "number";

const EMPTY_INPUT_VALUE = "";

function Triangle(side1, side2, angle) {
    this.side1 = side1;
    this.side2 = side2;
    this.angle = radFromDegr(angle);
    this.increaseAngle = function (scale) {
    	var copyAngle = this.angle;

    	copyAngle += copyAngle * scale / 100;

    	if (copyAngle > 0 && copyAngle < Math.PI)
    		this.angle = copyAngle;
    }
    this.side3 = function () {
    	var side3 = Math.sqrt(Math.pow(this.side1, 2) + 
    		                  Math.pow(this.side2, 2) - 
    		                  2 * this.side1 * this.side2 * Math.cos(this.angle));
    	return side3;
    }
    this.angles = function () {
    	var side3 = this.side3();
    	var angles = [degrFromRad(this.angle)];

    	angles[angles.length] = degrFromRad(angleFromSides(this.side2, side3, this.side1));
    	angles[angles.length] = degrFromRad(angleFromSides(side3, this.side1, this.side2));

        return angles;
    }
    this.triangleType = function () {
    	var side3 = this.side3();

    	if (Math.abs(side1 - side2) < EPS &&
    		Math.abs(side2 - side3) < EPS &&
    		Math.abs(side1 - side3) < EPS)
    		return 3;
    	else if (Math.abs(side1 - side2) < EPS ||
    		     Math.abs(side2 - side3) < EPS ||
    		     Math.abs(side1 - side3) < EPS)
    		return 2;
    	else 
    		return 1;
    }
    this.calculateBigRadius = function () {
    	return this.side3() / (2 * Math.sin(this.angle));
    }
    this.calculateSmallRadius = function () {
    	return this.side1 * this.side2 * Math.sin(this.angle) / (this.side1 + this.side2 + this.side3());
    }
    this.calculateDistanceBC = function () {
    	var sRadius = this.calculateSmallRadius(),
    	    bRadius = this.calculateBigRadius();

    	return Math.sqrt(Math.pow(bRadius, 2) - 2 * bRadius * sRadius);
    }
}

function angleFromSides(side1, side2, side3) {
	return Math.acos((Math.pow(side1, 2) + Math.pow(side2, 2) - Math.pow(side3, 2)) / 
    		(2 * side1 * side2));
}

function degrFromRad(angle) {
	if (isNaN(angle) ||
		angle == undefined) return -1;

	return angle * 180 / Math.PI;
}

function radFromDegr(angle) {
	if (isNaN(angle) ||
		angle == undefined) return -1;

	return angle * Math.PI / 180;
}

function addTriangle() {
    var tf1 = document.getElementById(I_SIDE1_ID),
        tf2 = document.getElementById(I_SIDE2_ID),
        tf3 = document.getElementById(I_ANGLE_ID);

	var side1 = parseFloat(tf1.value),
	    side2 = parseFloat(tf2.value),
	    angle = parseFloat(tf3.value);
	var newTriangle = new Triangle(side1, side2, angle);

	triangles[triangles.length] = newTriangle;

	addTableRow(newTriangle, document.getElementById(LIST_TABLE_ID));

	tf1.value = EMPTY_INPUT_VALUE;
	tf2.value = EMPTY_INPUT_VALUE;
	tf3.value = EMPTY_INPUT_VALUE;

	closePopup(ADD_MODAL);
}

function addTableRow(triangle, table) {
    var numberCell, actionCell, deleteCell;
    var changeButton = getNewButton(CHANGE_ID + triangles.indexOf(triangle), 
    	                            CHANGE_BTN_CLASS,
    	                            function () {
    	                            	changeTriangle(triangles.indexOf(triangle));
    	                            }),
        infoButton = getNewButton(INFO_ID + triangles.indexOf(triangle),
        	                      INFO_BTN_CLASS,
        	                      function () {
        	                      	infoTriangle(triangles.indexOf(triangle));
        	                      }),
        deleteButton = getNewButton(DELETE_ID + triangles.indexOf(triangle),
        	                        DELETE_BTN_CLASS,
        	                        function() {
        	                        	deleteTriangle(triangles.indexOf(triangle));
        	                        });
    var newRow = table.insertRow(-1);

    numberCell = newRow.insertCell(0);
    actionCell = newRow.insertCell(1);
    deleteCell = newRow.insertCell(2);

    numberCell.innerHTML = table.rows.length - 1;
    numberCell.id = NUMBER_ID + triangles.indexOf(triangle);

    actionCell.appendChild(changeButton);
    actionCell.appendChild(infoButton);
    deleteCell.appendChild(deleteButton);
}

function changeTriangle(index) {
	var submit = document.getElementById(SUBMIT_CHANGE_ID);

	submit.onclick = function () {
		var scaleField = document.getElementById(SCALE_ID);

		triangles[index].increaseAngle(scaleField.value);

		scaleField.value = EMPTY_INPUT_VALUE;

		closePopup(CHANGE_MODAL);
	}

    showPopup(CHANGE_MODAL);
}

function infoTriangle(index) {
    var angles = triangles[index].angles();

    document.getElementById(R_SIDE1_ID).innerHTML = triangles[index].side1.toFixed(2);
    document.getElementById(R_SIDE2_ID).innerHTML = triangles[index].side2.toFixed(2);
    document.getElementById(R_SIDE3_ID).innerHTML = triangles[index].side3().toFixed(2);
    document.getElementById(R_ANGLE1_ID).innerHTML = angles[0].toFixed(2);
    document.getElementById(R_ANGLE2_ID).innerHTML = angles[1].toFixed(2);
    document.getElementById(R_ANGLE3_ID).innerHTML = angles[2].toFixed(2);
    document.getElementById(R_TYPE_ID).innerHTML = TYPE_DESC[triangles[index].triangleType() - 1];
    document.getElementById(R_CENTER_ID).innerHTML = triangles[index].calculateDistanceBC().toFixed(2);
    
    showPopup(RESULT_MODAL);
}

function deleteTriangle(index) {
    var i;
    var length = triangles.length;
    var btnChange, btnInfo, btnDelete, numberCell;
    var table;

	for (i = index + 1; i < length; i++) {
        btnChange = document.getElementById(CHANGE_ID + i);
        btnInfo = document.getElementById(INFO_ID + i);
        btnDelete = document.getElementById(DELETE_ID + i);
        numberCell = document.getElementById(NUMBER_ID + i);

        updateButtonsAfterDeleting(btnChange, btnInfo, btnDelete, numberCell, i - 1);
	}

	table = document.getElementById(LIST_TABLE_ID);

	table.deleteRow(index + 1);
	triangles.splice(index, 1);
}

function updateButtonsAfterDeleting(btnChange, btnInfo, btnDelete, numberCell, newIndex) {
    btnChange.id = CHANGE_ID + newIndex;
    btnInfo.id = INFO_ID + newIndex;
    btnDelete.id = DELETE_ID + newIndex;
    numberCell.id = NUMBER_ID + newIndex;

    numberCell.innerHTML = newIndex + 1;

    btnChange.onclick = function () {
        changeTriangle(newIndex);                            
    };
    btnInfo.onclick = function () {
    	infoTriangle(newIndex);
    };
    btnDelete.onclick = function () {
    	deleteTriangle(newIndex);
    };
}

function getNewButton(id, className, functionOnClick) {
	var button = document.createElement("input");

	button.id = id;
	button.type = "button";
	button.className = className;
	button.onclick = functionOnClick;

	return button;
}

function closePopup(className) {
	document.getElementsByClassName(className)[0].style.display = "none";
} 

function showPopup(className) {
	document.getElementsByClassName(className)[0].style.display = "block";
}
