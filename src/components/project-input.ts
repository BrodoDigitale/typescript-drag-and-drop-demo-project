///<reference path="base-component.ts" />

namespace App {
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLInputElement;
        peopleInputElement: HTMLInputElement;
    
        constructor() {
          super("project-input", "app", true, "user-input");
          this.titleInputElement = this.element.querySelector(
            "#title"
          ) as HTMLInputElement;
          this.descriptionInputElement = this.element.querySelector(
            "#description"
          ) as HTMLInputElement;
          this.peopleInputElement = this.element.querySelector(
            "#people"
          ) as HTMLInputElement;
    
          this.configure();
        }
        //private is removed because abstarct method cannot be private
        //public methods always declared before private
        configure() {
          this.element.addEventListener("submit", this.submitHandler);
        }
        //added just because base class requires it
        renderContent() {}
        //if input is invalid --> void return else a tuple
        private inputValuesCollector(): [string, string, number] | void {
          const titleInput = this.titleInputElement.value;
          const descriptionInput = this.descriptionInputElement.value;
          const peopleInput = this.peopleInputElement.value;
    
          const titleInputValidation: validationObject = {
            property: titleInput,
            required: true,
          };
          const descriptionInputValidation: validationObject = {
            property: descriptionInput,
            required: true,
            minLength: 5,
          };
          const peopleInputValidation: validationObject = {
            property: +peopleInput,
            required: true,
            min: 1,
            max: 9,
          };
    
          if (
            !validate(titleInputValidation) ||
            !validate(descriptionInputValidation) ||
            !validate(peopleInputValidation)
          ) {
            alert("invalid input!");
          } else {
            return [titleInput, descriptionInput, +peopleInput];
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
            projectState.addProject(title, description, people);
            this.clearInputs();
          }
        }
      }
}