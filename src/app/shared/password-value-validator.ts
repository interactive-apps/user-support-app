import {FormControl} from '@angular/forms';

export function passwordValueValidator(control: FormControl) {
    if (control.value && !control.value.match(/^(?=.*[A-Z])/)) {
        return {
          upperCaseInvalid: true
        };
    }else if (control.value && !control.value.match(/^(?=.*[0-9])/)) {
      return {
        digitInvalid: true
      };
    }else if (control.value && !control.value.match(/^(?=.*[!@#\$%\^&\*])/)) {
      return {
        specialCharacterInvalid: true
      };
    } else if(control.value && !control.value.match(/^(?=.{8,100})/)){
      return {
        lengthInvalid: true
      };
    }
    return null;
}
