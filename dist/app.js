"use strict";
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.renderForm();
    }
    renderForm() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
const project = new ProjectInput();
//# sourceMappingURL=app.js.map