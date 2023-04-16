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



//PROJECT STATE MANAGEMENT
//Listener type
type Listener<T> = (items: T[]) => void;

//base class for state
class State<T> {
  //cannot be accessed from outside but can be accessed by class that inherites
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class ProjectState extends State<Project> {
  //list of all projects
  private projects: Project[] = [];
  
  //together with getInstance guarantees that we are always working with the same instance of state
  private static instance: ProjectState;

  private constructor() {
    super();
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

  //Component Base Class
  //abstract tells us that this class should never be instanciated and used for inheritance only
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
      this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId)! as T;
  
      const importedNode = document.importNode(this.templateElement.content, true);
      this.element = importedNode.firstElementChild as U;
      if(newElementId) {
        console.log(newElementId);
        this.element.id = newElementId;
      }   

      this.render(insertAtStart);
    }

    private render(insertAtStart: boolean) {
      this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element)
    }

    //methods are void but they force any inherited class to implement them (only those without? actually)
    abstract configure?(): void;
    abstract renderContent(): void;

  }


//ProjectItem Class

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  get persons() {
    if(this.project.people === 1) {
      return '1 person'
    } else {
      return `${this.project.people} persons`
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();

}
  configure(): void {
    
  }
  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}
  
  
  
  //ProjectList Class

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];
  
  constructor(private type: "active" | "finished") {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
}
//add empry method because class requieres it
configure() {
    //projects will be taken from inside of the class
    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter((prj) => {
        if(this.type === "active") {
          return prj.projectStatus === ProjectStatus.Active;
        }
        return prj.projectStatus === ProjectStatus.Finished;
       });
      this.renderProjects()
    });
}
renderContent() {
  const listId = `${this.type}-projects-list`
  this.element.querySelector('ul')!.id = listId;
  this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + " PROJECTS";
}
private renderProjects() {
  const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
  //to clear out all the list and avoid double render of tasks
  listEl.innerHTML = ""
  for (const prjItem of this.assignedProjects) {
    new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
  }
}
}



  //ProjectInput Class
class ProjectInput extends Component< HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, "user-input");
      this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

      this.configure();

    }
    //private is removed because abstarct method cannot be private
    //public methods always declared before private
    configure() {
      this.element.addEventListener('submit', this.submitHandler);
  }
    //added just because base class requires it
    renderContent(){}
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
}

const project = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');