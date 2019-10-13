/**
 * You can use this script to test the functionality of xValidate.
 */

//We create a JSONObject...
let jsonObject = {
    "textElement": {
        "id": "textElement",
        "properties": {
            "required": false,
            "minLength": 5,
            "maxLength": 25
        },
        "messages": {
            "required": "This element is required.",
            "minLength": "This element requires to have at least 5 characters.",
            "maxLength": "This element has a max of 25 characters."
        }
    },
    "numberElement": {
        "class": "numberElement",
        "properties": {
            "required": false,
            "minLength": 5,
            "maxLength": 25
        },
        "messages": {
            "required": "This element is required.",
            "minLength": "This element requires to have at least 5 characters.",
            "maxLength": "This element has a max of 25 characters."
        }
    },
    "emailElement": {
        "class": "emailElement",
        "properties": {
            "required": true,
            "maxLength": 6
        },
        "messages": {
            "required": "This element is required.",
            "maxLength": "This element has a max of 6 characters."
        }
    },
    "numberElement": {
        "id": "numberElement",
        "properties": {
            "required": true,
            "minLength": 6
        },
        "messages": {
            "required": "This element is required.",
            "minLength": "This element has a minimium of 6 characters."
        }
    },
    "passwordElement": {
        "id": "passwordElement",
        "properties": {
            "maxLength": 35,
            "minLength": 6
        },
        "messages": {
            "maxLength": "This password field has a max length of 35 characters.",
            "minLength": "This password field has a min length of 6 characters."
        }
    } 
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("testButton").addEventListener("click", () => {
        xValidate(jsonObject);
    });
});