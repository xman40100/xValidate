# xValidate 0.2.1
```html
<script src = "xValidate.min.js"></script>
```
This is xValidate: xValidate is a native JavaScript validation, the main premise of this
script file is to make it easy for the developers to validate input fields.
Another point is to keep it simple. No need to make a huge dependency or something, just
import this JavaScript file into your project and you're good to go!

xValidate requires the following:
* You must provide the validation rules as a JSON.
* The input fields to validate must have either an ID or a class that will be validated.
* The input fields should be enclosed in a wrapper div.

You only need to use one function, passing a JSON that contains the rules to validate and
the HTMLElement's ID or class... and that's pretty much it!

The message property of the JSON passed can be defined or undefined, xValidate has defaults
in case you don't want to write the messages, and will use the properties to write those messages.

### Element properties
* Text, password, search: required, minlength, maxlength and their respective message attributes.
* Email: same as text type, forceEmailValidation and their respective message attributes.
* Number: required, min, max, numberType and their respective message attributes.

### Settings properties
* ```classError```: Error class for the UI error elements that indicate whether they are valid or not. If not defined, it will use the class "xValidateError" by default.
* ```styleErrorClass```: Style class for the input elements that will indicate their validity or not. If not defined, it will use the "xValidateError" by default.
* ```sendOnValidated```: Boolean that indicates whether the form should be sent after validation or not. If not defined, it will default to false.
* ```form```: HTMLFormElement that will be sent. If not defined, and ```sendOnValidated``` equals to true, xValidate will traverse the DOM and use the first element and send it.

### Example JSON
```jsonc {
       "settings": {
           "classError": "xValidateError", // Error class for the UI error elements that indicate whether they are valid or not. Not defined equals to xValidateError
           "styleErrorClass": "xValidateStyleError", // Style class for the input elements that will indicate their validity or not. Not defined equals to xValidateStyleError
           "sendOnValidated": false, // Boolean that indicates whether the form should be sent after validation or not. Not defined equals to false.
           "form": document.getElementById("form") // Form HTMLElement that will be sent. If not defined, and sendOnValidated == true, xValidate will traverse the DOM and send it.
       },
       "elements": [ // Element array, it contains all the properties, messages and the class or id that will be validated.
           {
               "id": "textElement", // Name of the element that will be validated, can be an id or a class name, but cannot be both.
               "properties": { // Properties attribute. Required.
                   "required": true, // Required property, if not defined, default to false.
                   "maxlength": 35, // Max length property, if not defined, unlimited.
                   "minlength": 6, // Min length property, if not defined, no minimum chars.
               },
               "messages": { // The messages for the properties. If one of them is missing, xValidate will use a default one.
                   "required": "This field is required",
                   "maxlength": "This element has a max of 35 characters.",
                   "minlength": "This element has a minimum of 6 characters."
               }
           },
           {
               "class": "emailElement",
               "properties": {
                   "required": true,
                   "forceEmailValidation": true, // Unique for email type only, forces regex validation for emails.
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
                   "min": 42, //Unique for number type only. Checks for min value of the number.
                   "max": 256, //Unique for number type only. Checks for max value of the number.
                   "numberType": "natural" //Unique for number type only. Forces regex validation depending of type, which can be: 
                   //int/integer, float/decimal or anything, which would default to a natural number
               },
               "messages": {
                   "min": "The current value is less than 42",
                   "max": "The current value is greater than 256"
               }
           }
       ]
   }
```

### xValidate function
```javascript

xValidate(jsonRules);

```

#### Arguments
* jsonRules: This is the main object that will be used to validate the element. Following the upper example of the JSON used in xValidate, you can have *n* elements in the ```elements``` property, but you must have the ```settings``` and ```elements``` properties in order for it to work.

#### Return value
The return value is a boolean indicating if there were the any validation errors. ```true``` if there was no validation errors, ```false``` if there are validation errors.

### Credits

Credits to the [Zenbase Email regex](https://emailregex.com/)