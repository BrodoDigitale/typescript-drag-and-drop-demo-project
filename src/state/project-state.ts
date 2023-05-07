import { Project, ProjectStatus } from "../models/project-model";

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
export class ProjectState extends State<Project> {
  //list of all projects
  private projects: Project[] = [];

  //together with getInstance guarantees that we are always working with the same instance of state
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
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
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    //after project is added loop through all listeners and call them
    this.updateListeners();
  }

  moveProject(id: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === id);
    if (project && project.projectStatus !== newStatus) {
      project.projectStatus = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      //slice is used just to pass a copy of projects, not the original array
      //can be substituted with [...this.projects]
      listener(this.projects.slice());
    }
  }
}

//ProjectState can ONLY be instanciated via getInstance because it's constructor is private
//so guarantees there always will be only one object of the type in app - SINGLETON
export const projectState = ProjectState.getInstance();
