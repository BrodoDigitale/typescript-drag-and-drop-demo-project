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
      if (
        titleInput.trim().length === 0 || descriptionInput.trim().length === 0 || peopleInput.trim().length === 0
      ) {
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