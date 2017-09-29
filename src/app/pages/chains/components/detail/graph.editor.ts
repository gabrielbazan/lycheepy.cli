import { Diagram, Part, Node, Link } from 'gojs';
import { GraphObject, Spot, LayeredDigraphLayout, GraphLinksModel } from 'gojs'


export abstract class PartEditor {
  constructor(protected part: Part) {
    this.edit();
  }

  abstract edit(): void;
  abstract destroy(): void;
}

export class NodeEditor extends PartEditor {
  edit(): void {
    console.log("I'm a node");
  }
  destroy(): void {
    console.log('Destroying Node editor');
  }
}


export class LinkEditor extends PartEditor {
  outputs: string[];
  private matchingDiagram: Diagram;

  edit(): void {
    console.log("I'm a link");
    this.loadOutputs();

    const self = this;
    setTimeout(() => { self.loadMatchingDiagram(); }, 50)
  }

  private loadOutputs(): void {
    this.outputs = [];
    for (const output of this.part.data['before']['outputs']) {
      this.outputs.push(output['identifier']);
    }
    for (const output of this.part.data['after']['outputs']) {
      this.outputs.push(output['identifier']);
    }
  }

  private loadMatchingDiagram(): void {
    const element = document.getElementById('matchingGraph');
    const $ = GraphObject.make;

    this.matchingDiagram = $(
      Diagram,
      element,
      {
        'animationManager.isEnabled': false,
        initialContentAlignment: Spot.Center,
        layout: $(LayeredDigraphLayout)
      }
    );


    // create the model data that will be represented by Nodes and Links
    this.matchingDiagram.model = new GraphLinksModel(
      this.getNodes(),
      this.getLinks()
    );
  }

  private getNodes(): object[] {
    const nodes: object[] = [];

    for (const output of this.part.data['before']['outputs']) {
      nodes.push(
        { key: `${this.part.data.from}.${output['identifier']}` }
      );
    }

    for (const input of this.part.data['after']['inputs']) {
      nodes.push(
        { key: `${this.part.data.to}.${input['identifier']}` }
      );
    }

    return nodes;
  }

  private getLinks(): object[] {
    const links: object[] = [];

    for (const output of this.part.data['before']['outputs']) {
      for (const input of this.part.data['after']['inputs']) {
        if (input['identifier'] === output['identifier']) {
          links.push(
            {
              from: `${this.part.data.from}.${output['identifier']}`,
              to: `${this.part.data.to}.${input['identifier']}`
            }
          );
        }
      }
    }
    return links;
  }

  destroy(): void {
    this.matchingDiagram.div = null;
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

    if (this.editor) {
      this.editor.destroy();
    }

    if (this.isNode) {
      this.editor = new NodeEditor(part);
    } else if (this.isLink) {
      this.editor = new LinkEditor(part);
    }
  }
}
