
class Parameter {
  identifier: string;
  title: string;
  abstract: string;
}

export class Input extends Parameter {}

export class Output extends Parameter {}

class Executable {
  id: number;
  identifier: string;
  title: string;
  abstract: string;
  version: string;
  metadata: string[];
}

export class Process extends Executable {
  inputs: Input[];
  outputs: Output[];
}

export class Chain extends Executable {
  steps: Step[];
}

export class Step {
  before: string;
  after: string;
  match: Match[];
  publish: string[];
}

export class Match {
  output: string;
  input: string;
}

export class Execution {
  id: string;
  chainIdentifier: string;
  start: string;
  end: string;
  status: string;
}
