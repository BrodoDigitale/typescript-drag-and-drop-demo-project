import { Project, ProjectStatus } from "../models/project-model";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, desc, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, desc, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(id, newStatus) {
        const project = this.projects.find((prj) => prj.id === id);
        if (project && project.projectStatus !== newStatus) {
            project.projectStatus = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listener of this.listeners) {
            listener(this.projects.slice());
        }
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=project-state.js.map