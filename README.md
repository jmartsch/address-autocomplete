# Address Autocomplete

adds Google address autocompletition to form fields and checks on submit, if the entered address can be found. If not, it suggests a correction.

```javascript
if (document.getElementById('form')) {

  import('@googlemaps/js-api-loader').then(module => {
    let Loader = module.Loader;

    const loader = new Loader({
      apiKey: 'GOOGLE-API-KEY',
      version: 'weekly',
      libraries: ['places'],
      language: 'de',
    });
    loader
      .load()
      .then(() => {
        console.log('loader ist loaded');
        import('./googleMapsAutocomplete').then((autocomplete) => {
            console.log(autocomplete.default);
            const useMap = false;
            let autocompleteForm = document.getElementById('form');
            let autocompleteFields = [
              {
                id: 'strasse',
                googleResultName: 'route',
                outputFormat: 'short_name',
                autocomplete: true
              },
              {
                id: 'plz',
                googleResultName: 'postal_code',
                outputFormat: 'long_name',
                autocomplete: true,
                types: ['postal_code']
              },
              {
                id: 'ort',
                googleResultName: 'locality',
                outputFormat: 'long_name',
                autocomplete: true,
                types: ['(cities)']
              },
              {
                id: 'hausnr',
                googleResultName: 'street_number',
                outputFormat: 'long_name',
                autocomplete: false
              },
            ]
            new autocomplete.default(autocompleteForm, autocompleteFields);

          }
        );
      })
      .catch(e => {
        console.log(e);
        // do something
      });
  });


}
```
### Install

NPM

```bash
npm install @jmartsch/address-autocomplete
```

### Import

JavaScript ES6 import

```js
import lazyframe from 'googleMapsAutocomplete';
import 'styles.css'
```
