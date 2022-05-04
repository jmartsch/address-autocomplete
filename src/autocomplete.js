import Autocomplete from '@trevoreyre/autocomplete-js';
// import '@trevoreyre/autocomplete-js/dist/style.css';
import './styles.css';

const geoapifyUrl = 'https://api.geoapify.com/v1/geocode/autocomplete'
const addressFields = [
    ['strasse', 'street'],
    ['plz', 'postcode'],
    ['ort', 'city'],
    ['hausnr', 'housenumber']
];

function AddAutocomplete(selector, type= 'amenity', debounceTime, resultValue = 'formatted') {
    this.geoapifyParams = `&apiKey=GEOAPIFY-KEY&limit=5&lang=de&filter=countrycode:de&type=${type}`;
    new Autocomplete(selector, {
        // Search function can return a promise
        // which resolves with an array of
        // results. In this case we're using
        // the Wikipedia search API.
        search: input => {
            return searchGeoapify(input, this.geoapifyParams)
        },
        autoSelect: false,
        debounceTime: debounceTime,

        // Wikipedia returns a format like this:
        //
        // {
        //   pageid: 12345,
        //   title: 'Article title',
        //   ...
        // }
        //
        // We want to display the title
        // getResultValue: result => result.title, // short array function
        getResultValue: function (result) {
            // result => result.title
            return result.properties[resultValue];
        },
        // renderResult: function (result, props) {
        //     if (result.properties.city){
        //
        //         return`
        //     <li ${props}>
        //       <div class="wiki-title">
        //         ${result.properties.city}, ${result.properties.state}
        //       </div>
        //     </li>
        //   `;
        //     }
        // },
        onSubmit: result => {
            // clearAddressFields();

            if (result.properties.postcode) {
                document.getElementById("plz").value = result.properties.postcode;
            }
            if (result.properties.housenumber) {
                document.getElementById("hausnr").value = result.properties.housenumber;
            }
            if (result.properties.city) {
                document.getElementById("ort").value = result.properties.city;
            }
            if (result.properties.street) {
                document.getElementById("strasse").value = result.properties.street;
            }

        }
    });
}

const searchGeoapify = (input, geoapifyParams) => {
    let requestUrl = `${geoapifyUrl}?&text=${encodeURI(input)}${geoapifyParams}`

    return new Promise(resolve => {
        if (input.length < 3) {
            return resolve([])
        }

        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                resolve(data.features)
            })
    })
}

let clearAddressFields = function () {
    addressFields.forEach(function (el) {
        console.log(el[0]);
        let domElement = document.getElementById(el[0]);
        console.log(domElement);
        if (domElement) domElement.value = '';
    });
}
clearAddressFields();
new AddAutocomplete('.autocomplete', 'amenity', 500)
new AddAutocomplete('.ort', 'city', 500)
