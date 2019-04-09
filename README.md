# Radio Button Redirect

Works with the GOVUK Prototype Kit. Allows you to branch user journeys from radio buttons without writing logic in the routes file.

## How it works

You can tell the prototype to redirect to a page if a radio button is selected by adding a tilde(~) to the value in the HTML.

For example, the following code would cause the application to redirect to `/page1` if the `Yes` radio button was selected:
```html
<input class="govuk-radios__input" name="test" type="radio" value="yes~/page1">
```

The tilde(~) and the link are not stored in the session. So if you called `{{data.test}}` in the view it will only contain the value of `yes`, not `yes~/page1`.

If you don't add a tilde(~) nothing changes and everything just defaults to the original prototype kit behaviour.

## How to use

### Step 1 - Install the package
First, install the package to your prototype. In terminal run the following command:

```
npm install radio-button-redirect
```

### Step 2 - Tell the router to use the package
Next, open your routes file at `app/routes.js` and add the following lines below `const router = express.Router()`:
```javascript
const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)
```

### Step 3 - Add links to your HTML
Set the values of your radio buttons to contain a tilde(~) and a link. It will work with either the Nunjucks macros or the plain HTML.

```javascript
{{ govukRadios({
  classes: "govuk-radios--inline",
  idPrefix: "married",
  name: "married",
  fieldset: {
    legend: {
      text: "Are you married?",
      isPageHeading: true,
      classes: "govuk-fieldset__legend--l"
    }
  },
  items: [
    {
      value: "yes~/married",
      text: "Yes"
    },
    {
      value: "no~/not-married",
      text: "No"
    }
  ]
}) }}
```
