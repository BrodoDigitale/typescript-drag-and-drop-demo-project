import { autobind } from "../decorators/autobind";
import { Draggable } from "../models/interfaces";
import { Project } from "../models/project-model";
import { Component } from "./base-component";

//ProjectItem Class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }
  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }
  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons;
    this.element.querySelector("p")!.textContent = this.project.description;
  }

  //we need to bind it as it gets passed as a callback for eventListeneres
  @autobind
  dragStartHandler(event: DragEvent): void {
    //transfer just id of the project
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  @autobind
  dragEndHandler(_: DragEvent): void {
    console.log("drag ended");
  }
}
