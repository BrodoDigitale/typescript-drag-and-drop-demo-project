var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { validate } from "../util/validation.js";
import { Component } from "./base-component.js";
export class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() { }
    inputValuesCollector() {
        const titleInput = this.titleInputElement.value;
        const descriptionInput = this.descriptionInputElement.value;
        const peopleInput = this.peopleInputElement.value;
        const titleInputValidation = {
            property: titleInput,
            required: true,
        };
        const descriptionInputValidation = {
            property: descriptionInput,
            required: true,
            minLength: 5,
        };
        const peopleInputValidation = {
            property: +peopleInput,
            required: true,
            min: 1,
            max: 9,
        };
        if (!validate(titleInputValidation) ||
            !validate(descriptionInputValidation) ||
            !validate(peopleInputValidation)) {
            alert("invalid input!");
        }
        else {
            return [titleInput, descriptionInput, +peopleInput];
        }
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const inputValues = this.inputValuesCollector();
        if (inputValues) {
            const [title, description, people] = inputValues;
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map