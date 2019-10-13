# xValidate 0.1
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

### Element properties
* Text, number: required, minLength, maxLength and their respective message
attributes.
* Email: required, validateMail, maxLength and their respective message attributes.
* Password: minLength, maxLength and their respective message attributes.

### Example JSON
```jsonc
{
   "numberElement": { <- The parent key can have any name that you want, the important parts are under them.
       "class": "numberElement", <- This is the lookup class, xValidate will go through all the elements that contain this class.
       "properties": { <- The properties object. You are able to define the following properties.
           "required": false, <- Can be provided or not. Defaults to false if not provided.
           "minLength": 5, <- Can be provided or not. The element won't have a minimum length if not provided.
           "maxLength": 25 <- Can be provided or not. The element won't have a maximum length if not provided.
       },
       "messages": { <- The messages object. You are able to configure custom messages for the properties defined above.
           "required": "This element is required.",
           "minLength": "This element requires to have at least 5 characters.",
           "maxLength": "This element has a max of 25 characters."
       }
   },
   "emailElement": {
       "id": "emailElement",
       "properties": {
           "required": true,
           "validateMail": true,
           "maxLength": 6
       },
       "messages": {
           "required": "This element is required.",
           "maxLength": "This element has a max of 6 characters.",
           "validateMail": "You haven't provided a valid email.",
       }
   }
}
```

### xValidate function
```javascript

xValidate(jsonRules, errorClass = null, sendOnValidated = false);

```

#### Arguments
* jsonRules: This is the main object that will be used to validate the element. You can have *n* elements in the object, but each one has to contain the properties specified above, like ```properties```, ```id/class```, ```messages```.
* errorClass: The error class that will be added to the HTMLElement. If not provided, defaults to inline CSS from xValidate.
* sendOnValidated: This boolean indicated whether to automatically send the form after it's been validated. If not provided, defaults to false.

#### Return value
The return value is a boolean indicating if there were the any validation errors. ```true``` if there was no validation errors, ```false``` if there are validation errors.