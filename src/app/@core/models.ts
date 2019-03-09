
class Parameter {
  identifier: string;
  title: string;
  abstract: string;
  dataType: string;
  format: string;

  constructor() {}
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
    public metadata: string[],
    public inputs: Input[],
    public outputs: Output[]
  ) {}
}

export class Process extends Executable {}

export class Chain extends Executable {
  constructor(
    public id: number,
    public identifier: string,
    public title: string,
    public abstract: string,
    public version: string,
    public metadata: string[],
    public inputs: Input[],
    public outputs: Output[],
    public steps: Step[],
    public publish: object
  ) {
    super(id, identifier, title, abstract, version, metadata, inputs, outputs)
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

export class Format {
  constructor(
    public id: number,
    public name: string,
    public mimeType: string,
    public extension: string
  ) {}
}

export class DataType {
  constructor(
    public id: number,
    public name: string
  ) {}
}

export class Repository {
  public created: string;
  public configurations: object;
  public availableConfigurations: string[];
  public mandatoryConfigurations: string[];
  public id: number;
  public type: string;
  public name: string;
  public enabled: boolean;
}

export enum RepositoryType {
  GEO_SERVER = 'GEO_SERVER',
  FTP = 'FTP'
}
