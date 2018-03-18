
class Parameter {
  identifier: string;
  title: string;
  abstract: string;
}

export class Input extends Parameter {}

export class Output extends Parameter {}

class Executable {
  constructor(
    public id: number,
    public identifier: string,
    public title: string,
    public abstract: string,
    public version: string,
    public metadata: string[]
  ) {}
}

export class Process extends Executable {
  constructor(
    public id: number,
    public identifier: string,
    public title: string,
    public abstract: string,
    public version: string,
    public metadata: string[],
    public inputs: Input[],
    public outputs: Output[]
  ) {
    super(id, identifier, title, abstract, version, metadata)
  }
}

export class Chain extends Executable {
  constructor(
    public id: number,
    public identifier: string,
    public title: string,
    public abstract: string,
    public version: string,
    public metadata: string[],
    public steps: Step[],
    public publish: object
  ) {
    super(id, identifier, title, abstract, version, metadata)
  }

  getProcessesIdentifiers(): string[] {
    const identifiers = [];
    for (const step of this.steps) {
      if (identifiers.indexOf(step.before) === -1) {
        identifiers.push(step.before);
      }
      if (identifiers.indexOf(step.after) === -1) {
        identifiers.push(step.after);
      }
    }
    return identifiers;
  }
}

export class Step {
  before: string;
  after: string;
  match: object;
}

export class Execution {
  constructor(
    public id: string,
    public chainIdentifier: string,
    public start: string,
    public end: string,
    public status: string,
    public reason: string
  ) {}
}
