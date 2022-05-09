import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css'

console.log('google.js loaded');
// sample form and field config
// let autocompleteForm = document.getElementById('form');
// let autocompleteFields = [
//   {
//     id: 'strasse',
//     googleResultName: 'route',
//     outputFormat: 'short_name',
//     autocomplete: true
//   },
//   {
//     id: 'plz',
//     googleResultName: 'postal_code',
//     outputFormat: 'long_name',
//     autocomplete: true,
//     types: ['postal_code']
//   },
//   {
//     id: 'ort',
//     googleResultName: 'locality',
//     outputFormat: 'long_name',
//     autocomplete: true,
//     types: ['(cities)']
//   },
//   {
//     id: 'hausnr',
//     googleResultName: 'street_number',
//     outputFormat: 'long_name',
//     autocomplete: false
//   },
// ]

let Toast = Swal.mixin({
  backdrop: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  showCancelButton: true,
  showDenyButton: true,
})

// Toast.fire({
//   icon: 'question',
//   title: `Die Adresse scheint es nicht zu geben.`,
//   html: `Meinten Sie vielleicht ${suggestedPlace.formatted_address} ?`,
//   // footer: 'Möchten Sie stattdessen die vorgeschlagene Adresse einfügen.',
//   showConfirmButton: true,
//   showCancelButton: true,
//   confirmButtonColor : 'green',
//   denyButtonColor : '#57504d',
//   cancelButtonColor : '#727272',
//   confirmButtonText: 'Ja',
//   cancelButtonText: 'Ich möchte die Adresse korrigieren',
//   denyButtonText:   'Nein, die Adresse ist korrekt',
// })

export default class AddAddressAutoComplete {
  // simple example can be found at https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
  constructor(form, fields) {
    this.autocompletes = [];
    this.addressData = {};
    this.isDirty = true;
    this.form = form;
    this.form.autocompleteClass = this;
    this.fields = fields;
    //Check if GoogleApi is loaded
    if (this.checkIfGoogleApi()) {
      console.log('google Api loaded')
      this.setupFormFields();
      this.addAutocompleteToFields();
      this.form.addEventListener('submit', this.checkAddressOnSubmit)


      console.log('Form setup sucessful for #' + this.form.id);
    }
  }

  addAutocompleteToFields() {
    // call addAutocompleteToField method for every field in this.fields
    this.fields.filter(field => field.autocomplete === true).forEach(field => {
      return this.addAutocompleteToField(field);
    });
  }

  addAutocompleteToField(field) {
    let fieldname = field.id;
    console.log(`add autocomplete to field ${fieldname}`);
    let autocompleteInput = field.element;
    console.log(autocompleteInput);
    let types = field.types ?? ['address'];
    console.log(types);
    let autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
      fields: ["address_components", "geometry", "name"],
      types: types,
      componentRestrictions: {country: "de"},
      classReference: this,
      formFields: this.fields,
    });
    // autocomplete.addListener("place_changed", function () {
    //     console.log('place changed');
    //     console.log(autocomplete.classReference.fillInAddress);
    //     // Get each component of the address from the place details,
    //     // and then fill-in the corresponding field on the form.
    //     // place.address_components are google.maps.GeocoderAddressComponent objects
    //     // which are documented at http://goo.gle/3l5i5Mr
    //     // method taken from https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
    //     autocomplete.classReference.fillInAddress(autocomplete);
    // });
    autocomplete.addListener("place_changed", this.fillInAddress);

    console.log(`Finished setting up autocomplete for field ${fieldname}.`);
  }

  getFormInputElement = (component) => document.getElementById(component);


  checkIfFieldValueIsDifferent(place) {
    // place = place ? place : this.getPlace();
    console.log('checkIfFieldValueIsDifferent');
    console.log(place);
    let isDifferent = false;
    for (const component of place.address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];
      let field = this.getFieldForComponent(componentType);
      if (field) {
        switch (componentType) {
          case "street_number": {
            if (field.element.value !== component.long_name) {
              console.log(`${componentType} is different: ${component.long_name} is not equal to field value ${field.element.value}`);

              isDifferent = true;
            }
            break;
          }

          case "route": {
            if (field.element.value !== component.long_name) {
              console.log(`${componentType} is different: ${component.long_name} is not equal to field value ${field.element.value}`);
              isDifferent = true;
            }
            break;
          }

          case "postal_code": {
            if (field.element.value !== component.long_name) {
              console.log(`${componentType} is different: ${component.long_name} is not equal to field value ${field.element.value}`);
              isDifferent = true;
            }
            break;
          }

          case "postal_code_suffix": {
            if (field.element.value !== `${postcode}-${component.long_name}`) {
              console.log(`${componentType} is different: ${component.long_name} is not equal to field value ${field.element.value}`);
              isDifferent = true;
            }
            break;
          }
          case "locality":
            if (field.element.value !== component.long_name) {
              console.log(`${componentType} is different: ${component.long_name} is not equal to field value ${field.element.value}`);

              isDifferent = true;
            }
            break;
          case "administrative_area_level_1": {
            if (field.element.value !== component.long_name) {
              console.log(`${componentType} is different: ${component.long_name} is not equal to field value ${field.element.value}`);
              isDifferent = true;
            }
            break;
          }
          case "country":
            if (field.element.value !== component.long_name) {
              console.log(`${componentType} is different: ${component.long_name} is not equal to field value ${field.element.value}`);
              isDifferent = true;
            }
            break;
        }
      }
    }
    return isDifferent;
  }

  fillInAddress(place) {
    // Get the place details from the autocomplete object.
    console.log('fillInAddress');
    place = place ? place : this.getPlace();
    console.log(place);
    let instance = this.classReference ? this.classReference : this;
    // instance.place = place;
    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    for (const component of place.address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];
      let field = instance.getFieldForComponent(componentType);
      instance.setFieldValueToSuggested(componentType, field, component);
    }
  }

  setFieldValueToSuggested(componentType, field, component) {
    if (!field) {
      return;
    }
    switch (componentType) {
      case "street_number": {
        field.element.value = `${component.long_name}`;
        this.isDirty = false;
        break;
      }

      case "route": {
        field.element.value = component.long_name;
        this.isDirty = false;

        break;
      }

      case "postal_code": {
        field.element.value = `${component.long_name}`;
        this.isDirty = false;

        break;
      }

      case "postal_code_suffix": {
        field.element.value = `${component.long_name}`;
        this.isDirty = false;

        break;
      }
      case "locality":
        field.element.value = component.long_name;
        this.isDirty = false;

        break;
      case "administrative_area_level_1": {
        field.element.value = component.long_name;
        this.isDirty = false;

        break;
      }
      case "country":
        field.element.value = component.long_name;
        this.isDirty = false;

        break;
    }
  }

  submitForm() {
    console.log('submitForm (depending on isDirty)?', this.isDirty);
    if (this.isDirty === false) {
      this.form.submit();
    }
  }

  checkAddressOnSubmit = function (event) {
    console.log(event);
    event.preventDefault();

    let autocompleteClass = event.target.autocompleteClass;
    console.log(autocompleteClass.isDirty, 'isDirty');
    // if (autocompleteClass.isDirty === false) {
    //   console.log('form abschicken, weil dirty');
    //   autocompleteClass.submitForm();
    // }
    console.log('Vorschlag machen weil dirty');
    let route = autocompleteClass.getFieldForComponent('route').element.value;
    let street_number = autocompleteClass.getFieldForComponent('street_number').element.value;
    let postal_code = autocompleteClass.getFieldForComponent('postal_code').element.value;
    let locality = autocompleteClass.getFieldForComponent('locality').element.value;
    let queryString = `${route} ${street_number}, ${postal_code} ${locality}`;
    console.log(queryString);

    let service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({
        input: queryString,
        types: ['address'],
        fields: ["address_components", "geometry", "name"],
        componentRestrictions: {country: 'de'}
      },
      function (predictions, status) {
        console.log(predictions);
        console.log(status);
        if (status === 'ZERO_RESULTS') {
          console.log('zero results from getPlacePredictions');
          this.isDirty = false;
          autocompleteClass.submitForm();
        }
        if (status === 'OK') {
          let map = new google.maps.Map(document.createElement('div'));
          let placesService = new google.maps.places.PlacesService(map);
          console.log('got results from getPlacePredictions');
          let suggestedPlace = '';
          // predictions.forEach(function(prediction) {
          placesService.getDetails({placeId: predictions[0].place_id}, (place, status) => {
            console.log("status from placesService.getDetails: "  + status);
            if (status !== 'OK') {
              console.log('status is not OK. what to do now?');
              this.isDirty = false;
              autocompleteClass.submitForm();
            // autocompleteClass.submitForm();
            }
            if (status === 'OK') {
              console.log('placesService found a place');
              console.log(place);
              autocompleteClass.suggestAddress(place);
            }
            // suggestedPlace = place;
            // return place;
          });
        }
      });

  }

  // on change event of an input set this.isDirty to true
  setDirty = function (event) {
    console.log('setDirty weil Feld geändert wurde' + event.target.name);
    this.isDirty = true;
  }
  suggestAddress = function (suggestedPlace) {
    console.log('suggestAddress');
    console.log(this);
    let autocompleteClass = this;
    if (this.checkIfFieldValueIsDifferent(suggestedPlace)) {
      // if values of the suggested place differ from the values in the inputs, then show a modal to correct the address
      Toast.fire({
        icon: 'question',
        title: `Die Adresse scheint es nicht zu geben.`,
        // html: `Ändern zu ${suggestedPlace.formatted_address} ?`,
        // footer: 'Möchten Sie stattdessen die vorgeschlagene Adresse einfügen.',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor : 'green',
        denyButtonColor : '#57504d',
        cancelButtonColor : '#727272',
        confirmButtonText: `Ändern zu ${suggestedPlace.formatted_address} ?`,
        cancelButtonText: 'Ich möchte die Adresse noch korrigieren',
        denyButtonText:   'Nein, die eingegebene Adresse ist korrekt',
      }).then(function (e) {
        console.log(e);
        console.log(suggestedPlace);
        if (e.isConfirmed) {
          autocompleteClass.fillInAddress(suggestedPlace);
          console.log(autocompleteClass.isDirty, 'isDirty?');
          autocompleteClass.submitForm();
        }

        if (e.isDenied) {
          autocompleteClass.isDirty = false;
          autocompleteClass.submitForm();
        }
      }).catch(Toast.noop);

    } else {
      this.isDirty = false;
      this.submitForm();
    }
  }

  getFieldForComponent(componentType) {
    console.log(`getFieldForComponent ${componentType}`);
    return this.fields.find(obj => {
      return obj.googleResultName === componentType
    });
  }

  getField(name) {
    console.log(`getField ${name}`);
    return this.fields.find(obj => {
      return obj.id === name
    });
  }

//
  resetFields() {
    this.fields.forEach(field => {
      if (name !== 'country') {
        if (field.element != null) {
          field.element.value = '';
          console.log('Resetting field value for: ' + name);
        }
      }
    });
  }

  // renderAddress(place) {
  //     map.setCenter(place.geometry.location);
  //     marker.setPosition(place.geometry.location);
  //     marker.setVisible(true);
  // }

  addMap() {
    const map = new google.maps.Map(document.getElementById("gmp-map"), {
      zoom: CONFIGURATION.mapOptions.zoom,
      center: {
        lat: 37.4221,
        lng: -122.0841
      },
      mapTypeControl: false,
      fullscreenControl: CONFIGURATION.mapOptions.fullscreenControl,
      zoomControl: CONFIGURATION.mapOptions.zoomControl,
      streetViewControl: CONFIGURATION.mapOptions.streetViewControl
    });
    const marker = new google.maps.Marker({
      map: map,
      draggable: false
    });
  }


  setupFormFields() {
    this.fields.forEach(field => {
      let fieldName = field.id;
      let fieldElement = this.form.querySelector('[name="' + fieldName + '"]');

      if (fieldElement != null) {
        fieldElement.addEventListener('change', this.setDirty);
        field.element = fieldElement;
        console.log('added domElement for field: ' + fieldName);
      }
    });
  }

  checkIfGoogleApi() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      return true;
    }

    console.log('GoogleApi is not loaded so we wont initialize the forms.');

    return false;
  }
}
