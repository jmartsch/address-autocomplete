console.log("geoapify");
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "./styles.css";

const autocomplete = new GeocoderAutocomplete(
    document.getElementById("autocomplete"),
    'GEOAPIFY-KEY',
    {
        lang: 'de',
        placeholder: 'Gib was ein',
        type: 'amenity',
        debounceDelay: 300,

        /* Geocoder options */
    });

autocomplete.on('select', (location) => {
    // check selected location here
    console.log(location);
    if (location.properties.postcode) {
        document.getElementById("plz").value = location.properties.postcode;
    }
    if (location.properties.city) {
        document.getElementById("ort").value = location.properties.city;
    }
    if (location.properties.street) {
        document.getElementById("autocomplete").value = location.properties.street;
    }


    // autocomplete.blur();
});

autocomplete.on('suggestions', (suggestions) => {
    // process suggestions here
    console.log(suggestions);

});
