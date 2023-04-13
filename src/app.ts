//Project type

//enum type
enum ProjectStatus {
  Active,
  Finished
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public projectStatus: ProjectStatus
  ) {}
}

//Listener type

type Listener = (projects: Project[]) => void;

//PROJECT STATE MANAGEMENT

class ProjectState {
  //list of all projects
  private projects: Project[] = [];
  private listeners: Listener[] = [];
  //together with getInstance guarantees that we are always working with the same instance of state
  private static instance: ProjectState;

  private constructor() {

  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

static getInstance() {
  if(this.instance) {
      return this.instance
  }
  this.instance = new ProjectState();
  return this.instance;
}

 addProject(title: string, desc: string, numOfPeople: number) {
  const newProject = new Project(
  Math.random().toString(),
  title,
  desc,
  numOfPeople,
  ProjectStatus.Active,
  )
  this.projects.push(newProject)
  //after project is added loop through all listeners and call them
  for (const listener of this.listeners) {
    //slice is used just to pass a copy of projects, not the original array
    //can be substituted with [...this.projects]
    listener(this.projects.slice());
  }
 }
}

//ProjectState can ONLY be instanciated via getInstance because it's constructor is private
//so guarantees there always will be only one object of the type in app - SINGLETON
const projectState = ProjectState.getInstance();

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
  assignedProjects: Project[];
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.assignedProjects = [];

    //projects will be taken from inside of the class
    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter((prj) => {
        if(this.type === "active") {
          return prj.projectStatus === ProjectStatus.Active
        }
        return prj.projectStatus === ProjectStatus.Finished;
       });
      this.renderProjects()
    });
    this.renderList();
    this.renderContent();

}
private renderProjects() {
  const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
  //to clear out all the list and avoid double render of tasks
  listEl.innerHTML = ""
  for (const prjItem of this.assignedProjects) {
    const listItem = document.createElement('li');
    listItem.textContent = prjItem.title;
    listEl.appendChild(listItem)
  }
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
          projectState.addProject(title, description, people);
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