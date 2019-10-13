/*
 * ----------------------------- xValidate 0.1 -------------------------------------------
 * This is xValidate: xValidate is a native JavaScript validation, the main premise of this
 * script file is to make it easy for the developers to validate input fields.
 * Another point is to keep it simple. No need to make a huge dependency or something, just
 * import this JavaScript file into your project and you're good to go!
 * 
 * xValidate requires the following:
 * - You must provide the validation rules as a JSON.
 * - The input fields to validate must have either an ID or a class that will be validated.
 * - The input fields should be enclosed in a wrapper div.
 * 
 * You only need to use one function, passing a JSON that contains the rules to validate and
 * the HTMLElement's ID... and that's pretty much it!
 * 
 * ------------ Element properties ------------
 * - Text, number: required, minLength, maxLength and their respective message
 * attributes.
 * - Email: required, maxLength and their respective message attributes.
 * - Password: minLength, maxLength and their respective message attributes.
 *  ----------------------- Example JSON -----------------------
 * let jsonObject = {
 *    numberElement: { <- The parent key can have any name that you want, the important parts are under them.
 *        class: "numberElement", <- This is the lookup class, xValidate will go through all the elements that contain this class.
 *        properties: { <- The properties object. You are able to define the following properties.
 *            required: false, <- Can be provided or not. Defaults to false if not provided.
 *            minLength: 5, <- Can be provided or not. The element won't have a minimum length if not provided.
 *            maxLength: 25 <- Can be provided or not. The element won't have a maximum length if not provided.
 *        },
 *        messages: { <- The messages object. You are able to configure custom messages for the properties defined above.
 *            required: "This element is required.",
 *            minLength: "This element requires to have at least 5 characters.",
 *            maxLength: "This element has a max of 25 characters."
 *        }
 *    },
 *    emailElement: {
 *        id: "emailElement",
 *        properties: {
 *            required: true,
 *            validateMail: true,
 *            maxLength: 6
 *        },
 *        messages: {
 *            required: "This element is required.",
 *            maxLength: "This element has a max of 6 characters.",
 *            validateMail: "You haven't provided a valid email.",
 *        }
 *    }
 * };
 */

 /**
  * This method allows the validation of elements using a JSON object.
  * @param {Object} jsonRules The rules of validation parsed as a JSON.
  * @param {boolean} sendOnValidated Boolean declaring if the default submit event should be cancelled.
  * @param {string} errorClass Error class that you may want to add to notify the user of validation errors.
  * @returns {boolean} Returns a boolean indicating if all the validations were successful.
  */
function xValidate(jsonRules, sendOnValidated = false, errorClass = null) {
    let correctlyValidated = true;//This variable changes depending if at least one element is not corrected according to the provided rules.
    //The DOM should be reset of all the validation errors if it contains any.
    Array.from(document.querySelectorAll(".xValidateError")).forEach((element) => {
        if(errorClass != null) element.classList.remove(errorClass);
        else {
            element.style.color = "initial";
            element.style.oulineColor = "initial";
        }
        element.remove();
    });

    for(let key of Object.keys(jsonRules)) {
        //The lookup symbol will be assigned depending if the class or the id properties are defined.
        if(jsonRules[key].class == undefined && jsonRules[key].id == undefined) {
            console.error("xValidate error: class or id properties are not defined in the rules.");
            return false;
        }
        if(jsonRules[key].class != undefined && jsonRules[key].id != undefined) {
            console.error("xValidate error: Both class and id properties are defined. Please delete one of them from the rules.");
            return false;
        }
        let lookupSymbol = (jsonRules[key].class != undefined) ? "." + jsonRules[key].class : "#" + jsonRules[key].id;
        //xValidate will find all the class and id elements that match...
        let htmlArray = Array.from(document.querySelectorAll(lookupSymbol));
        //Then iterate over them.
        htmlArray.forEach((htmlInput) => {
            //If the ID or class match...
            if(htmlInput.id === lookupSymbol.substr(1) || htmlInput.classList.contains(lookupSymbol.substr(1))) {
                if(htmlInput.getAttribute("type") === "text" || htmlInput.getAttribute("type") === "password" || htmlInput.getAttribute("type") === "number") {
                    if(jsonRules[key].properties.required != undefined) {
                        if(htmlInput.value.length === 0) {
                            let errorElement = document.createElement("span");
                            errorElement.innerHTML = jsonRules[key].messages.required != undefined ? jsonRules[key].messages.required : "This field is required.";
                            addErrorClass(errorElement, errorClass);
                            htmlInput.parentElement.appendChild(errorElement);
                            correctlyValidated = false;
                        }
                    }

                    else if(jsonRules[key].properties.maxLength != undefined) {
                        if(htmlInput.value.length > jsonRules[key].properties.maxLength) {
                            let errorElement = document.createElement("span");
                            errorElement.innerHTML = jsonRules[key].messages.maxLength != undefined ? jsonRules[key].messages.maxLength : "You have reached the max length of this input field.";
                            addErrorClass(errorElement, errorClass);
                            htmlInput.parentElement.appendChild(errorElement);
                            correctlyValidated = false;
                        }
                    }

                    else if(jsonRules[key].properties.minLength != undefined) {
                        if(htmlInput.value.length < jsonRules[key].properties.minLength) {
                            console.log("entered here for " + key + " - minLength");
                            let errorElement = document.createElement("span");
                            errorElement.innerHTML = jsonRules[key].messages.minLength != undefined ? jsonRules[key].messages.minLength : "This input requires a minimal amount of characters.";
                            addErrorClass(errorElement, errorClass);
                            htmlInput.parentElement.appendChild(errorElement);
                            correctlyValidated = false;
                        }
                    }
                }

                if(htmlInput.getAttribute("type") === "email") {
                    
                    if(jsonRules[key].properties.required != undefined) {
                        if(htmlInput.value.length === 0) {
                            let errorElement = document.createElement("span");
                            errorElement.innerHTML = jsonRules[key].messages.required != undefined ? jsonRules[key].messages.required : "This field is required.";
                            addErrorClass(errorElement, errorClass);
                            htmlInput.parentElement.appendChild(errorElement);
                            correctlyValidated = false;
                        }
                    }

                    else if(!htmlInput.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        let errorElement = document.createElement("span");
                        errorElement.innerHTML = jsonRules[key].messages.validateMail != undefined ? jsonRules[key].messages.validateMail : "You have not provided a valid email.";
                        addErrorClass(errorElement, errorClass);
                        htmlInput.parentElement.appendChild(errorElement);
                        correctlyValidated = false;
                    }

                    else if(jsonRules[key].properties.minLength != undefined) {
                        if(htmlInput.value.length > jsonRules[key].properties.minLength) {
                            let errorElement = document.createElement("span");
                            errorElement.innerHTML = jsonRules[key].messages.minLength != undefined ? jsonRules[key].messages.minLength : "You have reached the max length of this field.";
                            addErrorClass(errorElement, errorClass);
                            htmlInput.parentElement.appendChild(errorElement);
                            correctlyValidated = false;
                        }
                    }

                    else if(jsonRules[key].properties.maxLength != undefined) {
                        if(htmlInput.value.length > jsonRules[key].properties.maxLength) {
                            let errorElement = document.createElement("span");
                            errorElement.innerHTML = jsonRules[key].messages.maxLength != undefined ? jsonRules[key].messages.maxLength : "You have reached the max length of this field.";
                            addErrorClass(errorElement, errorClass);
                            htmlInput.parentElement.appendChild(errorElement);
                            correctlyValidated = false;
                        }
                    }
                }

                if(htmlInput.getAttribute("type") === "password") {
                    
                    if(jsonRules[key].properties.minLength != undefined) {
                        if(htmlInput.value.length < jsonRules[key].properties.minLength) {
                            let errorElement = document.createElement("span");
                            errorElement.innerHTML = jsonRules[key].messages.minLength != undefined ? jsonRules[key].messages.minLength : "You have to provide a minimum amount of characters.";
                            addErrorClass(errorElement, errorClass);
                            htmlInput.parentElement.appendChild(errorElement);
                            correctlyValidated = false;
                        }
                    }

                    else if(jsonRules[key].properties.maxLength != undefined) {
                        if(htmlInput.value.length > jsonRules[key].properties.maxLength) {
                            let errorElement = document.createElement("span");
                            errorElement.innerHTML = jsonRules[key].messages.maxLength != undefined ? jsonRules[key].messages.maxLength : "You have reached the max length of this field.";
                            addErrorClass(errorElement, errorClass);
                            htmlInput.parentElement.appendChild(errorElement);
                            correctlyValidated = false;
                        }
                    }
                }
            }
        });
    }
    if(correctlyValidated) {
        if(sendOnValidated) htmlArray[0].parentElement.submit();
    }
    return correctlyValidated;
}

/**
 * Internal class. addErrorClass adds the error class for the input fields.
 * @param {HTMLElement} element Element to add the error class.
 * @param {string} errorClass Error class to be added. If it's not provided, then it'll default to xValidate custom inline error CSS.
 */
function addErrorClass(element, errorClass = null) {
    if(errorClass) element.classList.add(errorClass);
    else {
        element.style.color = "red";
        element.style.oulineColor = "red";
    }
    element.classList.add("xValidateError");
}