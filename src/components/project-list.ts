import { autobind } from "../decorators/autobind";
import { Droppable } from "../models/interfaces";
import { Project, ProjectStatus } from "../models/project-model";
import { projectState } from "../state/project-state";
import { Component } from "./base-component";
import { ProjectItem } from "./project-item";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements Droppable
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }
  //add empry method because class requieres it
  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    //projects will be taken from inside of the class
    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.projectStatus === ProjectStatus.Active;
        }
        return prj.projectStatus === ProjectStatus.Finished;
      });
      this.renderProjects();
    });
  }
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    //to clear out all the list and avoid double render of tasks
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
  @autobind
  dragOverHandler(event: DragEvent): void {
    //check that dropping is allowed
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      //because default is not allowing dropping so we should prevent it
      event.preventDefault();
      this.element.querySelector("ul")!.classList.add("droppable");
    }
  }
  @autobind
  dropHandler(event: DragEvent): void {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }
  @autobind
  dragLeaveHandler(_: DragEvent): void {
    this.element.querySelector("ul")!.classList.remove("droppable");
  }
}
