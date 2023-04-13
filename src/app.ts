//validation

interface validationObject {
  property: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: validationObject) {
  let isValid = true;
  if(validatableInput.required) {
    isValid = isValid && validatableInput.property.toString().trim().length > 0;
  }
  if(validatableInput.minLength && typeof validatableInput.property === "string") {
    isValid = isValid && validatableInput.property.trim().length >= validatableInput.minLength;
  }
  if(validatableInput.maxLength && typeof validatableInput.property === "string") {
    isValid = isValid && validatableInput.property.trim().length <= validatableInput.maxLength;
  }
  if(validatableInput.min && typeof validatableInput.property === "number") {
    isValid = isValid && validatableInput.property >= validatableInput.min;
  }
  if(validatableInput.max && typeof validatableInput.property === "number") {
    isValid = isValid && validatableInput.property <= validatableInput.max;
  }
  return isValid;
}


//autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    //modify it
    const modifiedDescriptor: PropertyDescriptor = {
        configurable: true,
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      },
    };
    return modifiedDescriptor;
  }

//ProjectList Class

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.renderList();
    this.renderContent();

}
private renderContent() {
  const listId = `${this.type}-projects-list`
  this.element.querySelector('ul')!.id = listId;
  this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + " PROJECTS";
}
private renderList() {
  this.hostElement.insertAdjacentElement('beforeend', this.element)
}

}



  //ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = "user-input";

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
        this.renderForm();

    }
    
    //if input is invalid --> void return else a tuple
    private inputValuesCollector(): [string, string, number] | void {
      const titleInput = this.titleInputElement.value;
      const descriptionInput = this.descriptionInputElement.value;
      const peopleInput = this.peopleInputElement.value;

      const titleInputValidation: validationObject = { property: titleInput, required: true};
      const descriptionInputValidation: validationObject = { property: descriptionInput, required: true, minLength: 5};
      const peopleInputValidation: validationObject = { property: +peopleInput, required: true, min: 1, max: 9};

      if (
        !validate(titleInputValidation) || 
        !validate(descriptionInputValidation) || 
        !validate(peopleInputValidation)) {
        alert('invalid input!')
      } else {
        return [titleInput, descriptionInput, +peopleInput]
      }
    }

    private clearInputs() {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.peopleInputElement.value = "";
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        //validate inputs
        //do something with data
        const inputValues = this.inputValuesCollector();
        if (inputValues) {
          const [title, description, people] = inputValues;
          console.log(title, description, people);
          this.clearInputs();
        }

    }
    private configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    private renderForm() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const project = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');