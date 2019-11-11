// import {xValidate} from "./xValidate2.js";

let jsonObject = {
    "settings": {
        "classError": "xValidateError",
        "styleErrorClass": "xValidateStyleError",
        "sendOnValidated": false,
        "form": document.getElementById("form")
    },
    "elements": [
        {
            "id": "textElement",
            "properties": {
                "required": true,
                "maxlength": 35,
                "minlength": 6,
            },
            "messages": {
                "required": "This field is required",
                "maxlength": "This element has a max of 35 characters.",
                "minlength": "This element has a minimum of 6 characters."
            }
        },
        {
            "class": "emailElement",
            "properties": {
                "required": true,
                "forceEmailValidation": true,
                "maxlength": 35,
                "minlength": 6,
            },
            "messages": {
                "maxlength": "This element has a max of 35 characters.",
                "minlength": "This element has a minimum of 6 characters."
            }
        },
        {
            "id": "numberElement",
            "properties": {
                "required": false,
                "max": 35,
                "min": 6,
                "numberType": "natural"
            }
        }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("testButton").addEventListener("click", () => {
        new xValidate(jsonObject);
    });
});