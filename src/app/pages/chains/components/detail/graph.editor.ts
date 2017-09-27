import { Diagram, Part, Node, Link } from 'gojs';


export abstract class PartEditor {
  constructor(protected part: Part) {
    this.edit();
  }

  abstract edit(): void;
}

export class NodeEditor extends PartEditor {
  edit(): void {
    console.log("I'm a node");
  }
}


export class LinkEditor extends PartEditor {
  outputs: string[];
  edit(): void {
    console.log("I'm a link");
    this.outputs = [];
    for (const output of this.part.data['before']['outputs']) {
      this.outputs.push(output['identifier']);
    }
    for (const output of this.part.data['after']['outputs']) {
      this.outputs.push(output['identifier']);
    }
    console.log(this.outputs);
  }
}


export class DiagramObserver {
  editor: PartEditor;
  isNode: boolean;
  isLink: boolean;

  constructor(private subject: Diagram) {
    this.register();
  }

  private register(): void {
    this.subject.addModelChangedListener( (e) => {
      if (e.isTransactionFinished) {
        this.update();
      }
    });
    this.subject.addDiagramListener(
      'ChangedSelection',
      (e) => {
        this.update();
      }
    );
  }

  update(): void {
    const part: Part = this.subject.selection.first();
    this.isNode = part instanceof Node;
    this.isLink  = part instanceof Link;
    if (this.isNode) {
      this.editor = new NodeEditor(part);
    } else if (this.isLink) {
      this.editor = new LinkEditor(part);
    }
  }
}
