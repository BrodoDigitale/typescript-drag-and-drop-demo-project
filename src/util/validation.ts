  export interface validationObject {
    property: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  export function validate(validatableInput: validationObject) {
    let isValid = true;
    if (validatableInput.required) {
      isValid =
        isValid && validatableInput.property.toString().trim().length > 0;
    }
    if (
      validatableInput.minLength &&
      typeof validatableInput.property === "string"
    ) {
      isValid =
        isValid &&
        validatableInput.property.trim().length >= validatableInput.minLength;
    }
    if (
      validatableInput.maxLength &&
      typeof validatableInput.property === "string"
    ) {
      isValid =
        isValid &&
        validatableInput.property.trim().length <= validatableInput.maxLength;
    }
    if (validatableInput.min && typeof validatableInput.property === "number") {
      isValid = isValid && validatableInput.property >= validatableInput.min;
    }
    if (validatableInput.max && typeof validatableInput.property === "number") {
      isValid = isValid && validatableInput.property <= validatableInput.max;
    }
    return isValid;
  }