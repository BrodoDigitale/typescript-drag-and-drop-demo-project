///<reference path="models/interfaces.ts" />
///<reference path="models/project-model.ts" />
///<reference path="state/project-state.ts" />
///<reference path="util/validation.ts" />
///<reference path="decorators/autobind.ts" />
///<reference path="components/project-input.ts" />
///<reference path="components/project-list.ts" />
///<reference path="components/project-item.ts" />

namespace App { 
  new ProjectInput();
  new ProjectList("active");
  new ProjectList("finished");
}
