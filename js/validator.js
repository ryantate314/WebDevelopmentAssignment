 /*
  * This object validates user form input before it is submitted. It allows for customizable
  * alert messages and formats as well as different types of filters.
  *
  * Possible modifications/improvements:
  *  - Allow the user to specify which filters are applied to the form, rather than all of them.
  * 
  * TODO: Use label as field name instead of converting input name from camel case.
  * @author Ryan Tate
  * @version 2016-03-14
  */

if (typeof validator == "undefined") {
	var validator = {
		_NOTIFICATION_CLASS : "validator-notification",
		
		/* User customizable filters. */
		_filters : [
			//Required Field Filter
			function(inputField) {
				var formattedName = validator._getReadableName(inputField);
				if (inputField.required && inputField.value == "") {
					return formattedName + " is required.";
				}
				return true;
			},
			//Email Address Filter
			function(inputField) {
				if (inputField.type == "email") {
					var formattedName = validator._getReadableName(inputField);
					if (!/^[a-zA-Z0-9\.]{2,}@([a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,5})+$/.test(inputField.value)) {
						return "Invalid email address.";
					}
				}
				return true;
			},
			//Custom Regex Filter
			//The user can set a custom data-regex attribute for an input which is validated on submition.
			//The user can also display a custom error message with the attribute name data-validate-message
			function(inputField) {
				if (inputField.dataset.regex) {
					var formattedName = validator._getReadableName(inputField);
					var regex = new RegExp(inputField.dataset.regex);
					if (!regex.test(inputField.value)) {
						//See if the node has a custom error message
						if (inputField.dataset.validateMessage) {
							return inputField.dataset.validateMessage;
						}
						else {
							//Display a generic error message if one is not provided.
							return "The value for " + formattedName + " is invalid.";
						}
					}
				}
				return true;
			}
		],
		
		init : function() {
			//Do nothing at this point
		},
		
		validate : function(form, settings) {
			if (settings === undefined) {
				settings = {};
			}

			//Modify the form to bypass the default browser validation
			form.noValidate = true;
			
			form.onsubmit = function() {
				validator._clearNotifications(form);
				
				var inputs = this.getElementsByClassName("form-control");
				var passed = true;
				for (var i = 0; i < inputs.length; i++) {
					var input = inputs[i];
					var validated = validator._validate(input);
					if (validated !== true) {
						passed = false;
						validator._alert(input, validated);
					}
				}
				return passed;
			}//End form onsubmit
		},
		
		/** 
		  * Check the provided input against all of the filters.
		  * @param input DomNode
		  */
		_validate : function(input) {
			for (var i = 0; i < validator._filters.length; i++) {
				var validateFunc = validator._filters[i];
				var validated = validateFunc(input);
				if (validated !== true) return validated;
			}
			return true;
		},
		
		_getReadableName : function(input) {
			//Find the label for the provided input
			var labels = document.getElementsByTagName("label");
			var labelId = input.id;
			for (var i = 0; i < labels.length; i++) {
				if (labels[i].getAttribute("for") == labelId) {
					var sanitizedText = labels[i].textContent.replace(":", "");
					return sanitizedText;
				}
			}
			
			//Could not find label. Convert camel case of field
			return validator._convertCamelCase(input.name);
		},
		
		/**
		  * Converts a camel case string into a more readable format.
		  * "testVariableName" -> "Test Variable Name"
		  * @param camelCase String in camel case format
		  */
		_convertCamelCase : function(camelCase) {
			var split = camelCase.split(/(?=[A-Z])/);
			if (split.length > 0) {
				split[0] = split[0].charAt(0).toUpperCase() + split[0].slice(1);
			}
			return split.join(" ");
		},
		
		_clearNotifications : function(form) {
			//Remove existing notifications
			var notifications = form.getElementsByClassName(validator._NOTIFICATION_CLASS);
			while (notifications.length > 0) {
				var node = notifications[0];
				node.parentNode.removeChild(node);
			}
			
			//Remove changed border from inputs
			var inputs = form.getElementsByClassName("validator-invalid");
			/*for (var i = 0; i < inputs.length; i++) {
				inputs[i].className = inputs[i].className.replace(/(?:^|\s)validator-invalid(?!\S)/g, '');
			}*/
			while (inputs.length > 0) {
				inputs[0].className = inputs[0].className.replace(/(?:^|\s)validator-invalid(?!\S)/g, '');
			}
		},
		
		/**
		  * Displays an alert to the user regarding an invalid form input.
		  * This function can be modified to show alerts however the user would like,
		  * i.e. tacky browser alert() box, modal, or inline message.
		  * @param input DomNode input for which the error refers.
		  * @param message String The error message to be displayed.
		  */
		_alert : function(input, message) {
			var notification = validator._createNotification(message);
			input.parentNode.appendChild(notification);
			input.className += " validator-invalid";
			//var prevColor = input.style.backgroundColor;
			//input.style.backgroundColor = "red";
			//window.setTimeout(function(){
			//	input.style.backgroundColor = prevColor;
			//}, 1000);
		},
		
		/**
		  * Creates an inline error node to be displayed below the errored input field.
		  * @param message String error message.
		  */
		_createNotification : function(message) {
			var notification = document.createElement("p");
			var textNode = document.createTextNode(message);
			notification.appendChild(textNode);
			notification.className += validator._NOTIFICATION_CLASS;
			return notification;
		}
	};
	
	validator.init();
}