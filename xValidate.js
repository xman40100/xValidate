"use strict";
/*
 * ----------------------------- xValidate 0.2 -------------------------------------------
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
 * - Text, password, search: required, minlength, maxlength and their respective message
 * attributes.
 * - Email: same as text type, forceEmailValidation and their respective message attributes.
 *  ----------------------- Example JSON -----------------------
 * {
 *       "settings": {
 *           "classError": "xValidateError", <- Error class for the UI error elements that indicate whether they are valid or not. Not defined equals to xValidateError
 *           "styleErrorClass": "xValidateStyleError", <- Style class for the input elements that will indicate their validity or not. Not defined equals to xValidateStyleError
 *           "sendOnValidated": false, <- Boolean that indicates whether the form should be sent after validation or not. Not defined equals to false.
 *           "form": document.getElementById("form") <- Form ID that will be sent. If not defined, and sendOnValidated == true, xValidate will traverse the DOM and send it.
 *       },
 *       "elements": [ <- Element array, it contains all the properties, messages and the class or id that will be validated.
 *           {
 *               "id": "textElement", <- Name of the element that will be validated, can be an id or a class name, but cannot be both.
 *               "properties": { <- Properties attribute. Required.
 *                   "required": true, <- Required property, if not defined, default to false.
 *                   "maxlength": 35, <- Max length property, if not defined, unlimited.
 *                   "minlength": 6, <- Min length property, if not defined, no minimum chars.
 *               },
 *               "messages": { <- The messages for the properties. If one of them is missing, xValidate will use a default one.
 *                   "required": "This field is required",
 *                   "maxlength": "This element has a max of 35 characters.",
 *                   "minlength": "This element has a minimum of 6 characters."
 *               }
 *           },
 *           {
 *               "class": "emailElement",
 *               "properties": {
 *                   "required": true,
 *                   "forceEmailValidation": true, <- Unique for email type only, forces regex validation for emails.
 *                   "maxlength": 35,
 *                   "minlength": 6,
 *               },
 *               "messages": {
 *                   "maxlength": "This element has a max of 35 characters.",
 *                   "minlength": "This element has a minimum of 6 characters."
 *               }
 *           },
 *           {
 *               "id": "numberElement",
 *               "properties": {
 *                   "required": false,
 *                   "numberType": "natural" <- Its type can be natural, int/integer or float/decimal
 *                   "min": 35,
 *                   "max": 6,
 *               },
 *               "messages": {
 *                   "min": "This element has a max of 35 characters.",
 *                   "max": "This element has a minimum of 6 characters."
 *               }
 *           }
 *       ]
 *   }
 */

let xValidateCurrentErrors = [];

/**
 * This method allows the validation of elements using a JSON.
 * @param {Object} jsonRules Ruleset that will be used to validate the elements.
 */
function xValidate(jsonRules) {
    let correctlyValidated = true;//This variable changes depending if at least one element is not corrected according to the provided rules inside the elements property.
    let settings = jsonRules.settings;
    let elements = jsonRules.elements;

    let errorClass = settings.classError != undefined ? settings.classError : "xValidateError";
    document.querySelectorAll("." + errorClass).forEach(function(element) {
        element.remove();
    });

    if(settings.styleErrorClass != undefined && settings.styleErrorClass !== "xValidateStyleError") {
        let styledInputs = document.getElementsByClassName(settings.styleErrorClass);
        for(let i = 0 ; i < styledInputs.length ; i++) {
            let input = styledInputs.item(i);
            input.classList.remove(settings.styleErrorClass);
        }
    }
    else {
        let styledInputs = document.getElementsByClassName("xValidateStyleError");
        for(let i = 0 ; i < styledInputs.length ; i++) {
            let input = styledInputs.item(i);
            input.style.color = "initial";
            input.style.borderColor = "initial";
            input.classList.remove(settings.styleErrorClass);
        }
    }

    elements.forEach(function(element, index) {
        if(element.id == undefined && element.class == undefined) {
            console.error("xValidate error - Error at element of index " + index + ": id or class properties not implemented. Please write the element's class or id.");
            return false;
        }
        if(element.id != undefined && element.class != undefined) {
            console.error("xValidate error - Error at element of index " + index + ": id and class properties are both implemented. Please remove one of the properties.");
            return false;
        }

        let lookupSymbol = element.id != undefined ? element.id : element.class;
        if(element.id != undefined) {
            let htmlElement = document.getElementById(lookupSymbol);
            validateElement(htmlElement, element);
        }
        else {
            let htmlElements = document.getElementsByClassName(lookupSymbol);
            for(let i = 0 ; i < htmlElements.length ; i++) validateElement(htmlElements.item(i), element);
        }
    });

    if(settings.sendOnValidated == undefined) return correctlyValidated;

    if(settings.sendOnValidated) {
        if(settings.form != undefined ) settings.form.submit();
        else {
            let lookup = "";
            if(elements[0].id != undefined) lookup = "#" + elements[0].id;
            else lookup = "." + elements[0].class;
            document.querySelector(lookup).parentElement().submit();
        }
    }
}

/**
 * Internal method of xValidate. styleErrorClass adds the error class for the input fields.
 * @param {HTMLElement} element Element to add the error class.
 * @param {string} errorClass Error class to be added. If it's not provided, then it'll default to xValidate custom inline error CSS.
 * @param {string} validateErrorClass Validation error class to be added. This class is used to indicate later to xValidate to clear all error elements. Default to xValidateError.
 */
function styleErrorClass(element, validateErrorClass = null) {
    if(validateErrorClass != null) element.classList.add(validateErrorClass);
    else {
        element.classList.add("xValidateStyleError");
        element.style.color = "red";
        element.style.borderColor = "red";
    }
}

/**
 * Internal method of xValidate. validateElement makes the validation process for the passed element, 
 * redirecting it to other methods used for various types.
 * @param {HTMLInputElement} htmlElement Element to be validated.
 */
function validateElement(htmlElement, elementRules, errorClass = "xValidateError") {
    let type = htmlElement.type;
    let validation = null;
    let errorMessage = "";
    switch(type) {
        case "email":
            //To validate if the value is an email, use the forceEmailValidation property
            validation = validateEmail(htmlElement, elementRules);
            break;
        case "number":
            validation = validateNumber(htmlElement, elementRules);
            break;
        default:
            validation = validateInput(htmlElement, elementRules);
            break;
    }

    if(validation != null && validation.errors.length !== 0) {
        validation.errors.forEach(function(error) {
            errorMessage = errorMessage + error + "<br/>";
        });
        createErrorElement(htmlElement, errorMessage, errorClass);
    }
}

/**
 * Internal method of xValidate. This is the general input validation.
 * @param {HTMLInputElement} htmlInputElement Element to be validated.
 * @param {Object} elementRules Element rules to be checked.
 */
function validateInput(htmlInputElement, elementRules) {
    let validated = true;
    let errors = [];

    if(elementRules.properties.required != undefined) {
        if(elementRules.properties.required) {
            if(htmlInputElement.value.length === 0) {
                validated = false;
                let message = getValidationErrorMessage(elementRules, "required");
                message = message != null ? message : "This field is required";
                errors.push(message);
            }
        }
    }

    if(elementRules.properties.maxlength != undefined) {
        if(htmlInputElement.value.length > elementRules.properties.maxlength) {
            validated = false;
            let message = getValidationErrorMessage(elementRules, "min");
            message = message != null ? message : "This field has reached the " + elementRules.properties.maxlength + " character limit.";
            errors.push(message);
        }
    }

    if(elementRules.properties.minlength != undefined) {
        if(htmlInputElement.value.length < elementRules.properties.minlength) {
            validated = false;
            let message = getValidationErrorMessage(elementRules, "minlength");
            message = message != null ? message : "This field has not reached the " + elementRules.properties.minlength + " minimum character(s).";
            errors.push(message);
        }
    }

    return {
        "validated": validated,
        "errors": errors
    };
}

/**
 * 
 * @param {HTMLInputElement} htmlInputElement The HTML Element that will be validated.
 * @param {OBject} elementRules Element rules.
 */
function validateEmail(htmlInputElement, elementRules) {
    let inputValidation = validateInput(htmlInputElement, elementRules);
    let currentVal = htmlInputElement.value;

    if(elementRules.properties.forceEmailValidation != undefined) {
        if(elementRules.properties.forceEmailValidation) {
            //Credit to https://emailregex.com/
            if(!currentVal.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                let message = getValidationErrorMessage(elementRules, "email");
                message = message != null ? message : "Please enter a valid email.";
                inputValidation.validated = false;
                inputValidation.errors.push(message);
            }
        }
    }

    return inputValidation;
}

function validateNumber(htmlInputElement, elementRules) {
    let errors = [];
    let validated = true;
    let inputValue = htmlInputElement.value;

    if(elementRules.properties.required != undefined) {
        if(elementRules.properties.required) {
            if(inputValue.length === 0) {
                validated = false;
                let message = getValidationErrorMessage(elementRules, "required");
                message = message != null ? message : "This field is required";
                errors.push(message);
            }
        }
    }

    if(elementRules.properties.numberType != undefined) {
        let regexType;
        switch(elementRules.properties.numberType) {
            case "int":
            case "integer"://Integer, checks for positive and negative numbers.
                regexType = /^[+-]?\d+$/;
                break;
            case "float":
            case "decimal"://Floating point number, checks for dot (.), positive and negative numbers.
                regexType = /^[+-]?\d+(\.\d+)?$/;
                break;
            default://By default, it evaluates to a natural number, doesn't check for negative numbers or floating points.
                regexType = /^\d+$/;
                break;
        }
        if(!regexType.test(inputValue)) {
            let message = getValidationErrorMessage(elementRules, "numberType");
            message = message != null ? message : "The current value is not a(n) " + elementRules.properties.numberType + " number type";
            validated = false;
            errors.push(message);
        }
    }

    if(elementRules.properties.min != undefined) {
        let numericVal = parseFloat(inputValue);
        if(numericVal < elementRules.properties.min) {
            let message = getValidationErrorMessage(elementRules, "min");
            message = message != null ? message : "The current value is less than " + elementRules.properties.min;
            validated = false;
            errors.push(message);
        }
    }

    if(elementRules.properties.max != undefined) {
        let numericVal = parseFloat(inputValue);
        if(numericVal > elementRules.properties.max) {
            let message = getValidationErrorMessage(elementRules, "max");
            message = message != null ? message : "The current value is greater than " + elementRules.properties.max;
            validated = false;
            errors.push(message);
        }
    }

    return {
        "errors": errors,
        "validated": validated
    };

}

/**
 * Method that allows to get the validation error message, in case it's undefined, it'll return null.
 * @param {Object} elementRules Element rules that are used.
 * @param {string} key The key to get the error message.
 */
function getValidationErrorMessage(elementRules, key) {
    if(elementRules.messages == undefined) return null;
    if(elementRules.messages[key] == undefined) return null;
    return elementRules.messages[key];
}

/**
 * Internal method that will create an error element and style the html element that will be passed.
 * @param {HTMLInputElement} htmlInputElement HTML element that the error element will be appended to.
 * @param {string} message Message that will be appended.
 * @param {string} errorClass The error class that xValidate will use to later remove.
 * @param {string} htmlErrorClass The error class that will be added to the input element. If not defined, it'll default to inline styling.
 */
function createErrorElement(htmlInputElement, message, errorClass, htmlErrorClass = null) {
    let errorElement = document.createElement("span");
    errorElement.classList.add(errorClass);
    errorElement.innerHTML = message;
    styleErrorClass(htmlInputElement, htmlErrorClass);
    htmlInputElement.parentElement.appendChild(errorElement);
}