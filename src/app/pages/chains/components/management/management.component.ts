import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChainsService } from '../../../../services/chains.service';
import { ExecutionsService } from '../../../../services/executions.service';
import { ProcessesService } from '../../../../services/processes.service';
import { Chain, Execution, Process, Step } from '../../../../models'
import { ExecutionModal } from '../execution/execution.component';
import { AddProcess } from '../add-process/add-process.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as go from 'gojs';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';


@Component({
  selector: 'chain-management-component',
  templateUrl: 'management.html',
  styleUrls: ['./management.scss'],
})
export class ChainManagementComponent implements OnInit {

  id: number;
  chain: Chain;
  processes: Process[];
  processesObj: object = {};
  executions: Execution[];

  diagram: go.Diagram = null;

  constructor(
    protected chainsService: ChainsService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private executionsService: ExecutionsService,
    private processesService: ProcessesService
  ) {}

  ngOnInit(): void {
    this.loadId();
    this.loadChainData();
  }

  private loadId(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
  }

  protected loadChainData(): void {
    this.chainsService.get(this.id).subscribe(
      chain => {
        this.chain = chain;
        this.loadProcesses();
        this.loadExecutions();
      },
      err => console.error(err),
    );
  }

  private loadProcesses(): void {
    this.processesService.getList({ identifier__in: this.chain.getProcessesIdentifiers().join(';') }).subscribe(
      processes => {
        this.processes = processes;
        for (const process of processes) {
          this.processesObj[process.identifier] = process;
        }
        this.drawGraph();
      },
      err => console.error(err),
    );
  }

  private loadExecutions(): void {
    this.executionsService.getList({ order_by: 'start__desc', chain_identifier: this.chain.identifier }).subscribe(
      executions => {
        this.executions = executions;
      },
      err => console.error(err),
    );
  }

  openExecutionForm() {
    const modal = this.modalService.open(ExecutionModal, { size: 'lg' });
    modal.componentInstance.chain = this.chain;
  }

  save() {
    this.chain.steps = this.getSteps();
    this.chain.publish = this.getPublish();
    this.chainsService.update(this.id, this.chain).subscribe(
      chain => {
        this.chain = chain;
        this.updateGraph();
      },
    );
  }

  // https://gojs.net/latest/samples/selectablePorts.html
  protected drawGraph() {
    const element = document.getElementById('graph');
    const $ = go.GraphObject.make;
    const self = this;

    console.log(element);

    self.diagram = $(
      go.Diagram,
      element,
      {
        initialContentAlignment: go.Spot.Center,
        // For this sample, automatically show the state of the diagram's model on the page
        'ModelChanged'(e) {
          if (e.isTransactionFinished) {
            self.doSomething();
          }
        },
        layout: $(go.LayeredDigraphLayout),
        'undoManager.isEnabled': true
      }
    );

    const unselectedBrush = 'lightgray';  // item appearance, if not 'selected'
    const selectedBrush = 'dodgerblue';   // item appearance, if 'selected'


    function makeItemTemplate(leftside) {
      return $(go.Panel, 'Auto',
        { margin: new go.Margin(1, 0) },  // some space between ports
        $(go.Shape,
          {
            name: 'SHAPE',
            fill: unselectedBrush, stroke: 'gray',
            geometryString: 'F1 m 0,0 l 5,0 1,4 -1,4 -5,0 1,-4 -1,-4 z',
            spot1: new go.Spot(0, 0, 5, 1),  // keep the text inside the shape
            spot2: new go.Spot(1, 1, -5, 0),
            // some port-related properties
            toSpot: go.Spot.Left,
            toLinkable: leftside,
            fromSpot: go.Spot.Right,
            fromLinkable: !leftside,
            cursor: 'pointer'
          },
          new go.Binding('portId', 'name')),
        $(go.TextBlock,
          new go.Binding('text', 'name'),
          {
            // allow the user to select items -- the background color indicates whether 'selected'
            isActionable: true,
            // ?? maybe this should be more sophisticated than simple toggling of selection
            click(e, tb) {
              const shape = tb.panel.findObject('SHAPE');
              if (shape !== null) {
                // don't record item selection changes
                const oldskips = shape.diagram.skipsUndoManager;
                shape.diagram.skipsUndoManager = true;
                // toggle the Shape.fill
                if (shape.fill === unselectedBrush) {
                  shape.fill = selectedBrush;
                } else {
                  shape.fill = unselectedBrush;
                }
                shape.diagram.skipsUndoManager = oldskips;
              }
            }
          })
      );
    }

    self.diagram.nodeTemplate = $(
      go.Node,
      'Spot',
      { selectionAdorned: false },
      { locationSpot: go.Spot.Center, locationObjectName: 'BODY' },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(
        go.Panel, 'Auto',
        { name: 'BODY' },
        $(
          go.Shape,
          'RoundedRectangle',
          { stroke: 'gray', strokeWidth: 2, fill: 'transparent' },
          new go.Binding(
            'stroke',
            'isSelected',
            function(b) { return b ? selectedBrush : unselectedBrush; }
          ).ofObject()
        ),
        $(
          go.Panel,
          'Vertical',
          { margin: 6 },
          $(
            go.TextBlock,
            new go.Binding('text', 'name'),
            { alignment: go.Spot.Left, height: 45, margin: new go.Margin(10, 10) }
          )
        )
      ),
      $(go.Panel, 'Vertical',
        { name: 'LEFTPORTS', alignment: new go.Spot(0, 0.5, 0, 7) },
        new go.Binding('itemArray', 'inservices'),
        { itemTemplate: makeItemTemplate(true) }
      ),
      $(go.Panel, 'Vertical',
        { name: 'RIGHTPORTS', alignment: new go.Spot(1, 0.5, 0, 7) },
        new go.Binding('itemArray', 'outservices'),
        { itemTemplate: makeItemTemplate(false) }
      )
    );

    self.diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 10,
        toShortLength: -3
      },
      {
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true
      },
      $(
        go.Shape,
        {
          stroke: 'gray',
          strokeWidth: 2.5
        }
      )
    );

    self.diagram.model = $(
      go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        nodeDataArray: self.getGraphNodes(),
        linkDataArray: self.getGraphLinks()
      }
    );

    self.highlightPorts();
  }

  private getGraphNodes(): object[] {
    const nodes: object[] = [];
    for (const process of this.processes) {
      nodes.push(this.getNode(process));
    }
    return nodes;
  }

  private getNode(process: Process): object {
    const node = {
      key: process.identifier,
      name: process.identifier,
      inservices: [],
      outservices: []
    };
    for (const input of process.inputs) {
      node.inservices.push({ 'name': input.identifier });
    }
    for (const output of process.outputs) {
      node.outservices.push({ 'name': output.identifier });
    }
    return node;
  }

  private getGraphLinks(): object[] {
    const links: object[] = [];
    for (const step of this.chain.steps) {
      links.push(...this.getLinks(step));
    }
    return links;
  }

  private getLinks(step): object[] {
    const stepLinks: object[] = [];

    const before = this.processesObj[step.before];
    const after = this.processesObj[step.after];

    for (const output of before.outputs) {
      stepLinks.push(
        {
          from: before.identifier,
          fromPort: output.identifier,
          to: this.getTo(step.match, after.identifier),
          toPort: output.identifier
        }
      );
    }
    return stepLinks;
  }

  private getTo(match: string[], input: string): string {
    let output: string = input;
    for (const m of match) {
      if (m['input'] === input) {
        output = m['output'];
      }
    }
    return input;
  }

  highlightPorts() {
    const selectedBrush = 'dodgerblue';

    for (const process in this.chain.publish) {
      if (this.chain.publish.hasOwnProperty(process)) {
        for (const output of this.chain.publish[process]) {
          for (const nit = this.diagram.nodes; nit.next(); ) {
            const node = nit.value;
            const table = node.findObject('RIGHTPORTS');
            if (table !== null) {
              for (const iit = table['elements']; iit.next(); ) {
                const shape = iit.value.findObject('SHAPE');
                if (shape !== null) {
                  const portProcess = iit.value.part.data.key;
                  const portOutput = iit.value['Zd']['name'];
                  if (process === portProcess && output === portOutput) {
                    shape.fill = selectedBrush;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  updateGraph() {
    this.diagram.startTransaction('update');
    this.diagram.commitTransaction('update');
  }

  protected getSteps(): Step[] {
    const data = JSON.parse(this.diagram.model.toJson());
    const steps: Step[] = [];
    const translated: object = this.translateLinks(data['linkDataArray']);

    for (const before in translated) {
      if (translated.hasOwnProperty(before)) {
        for (const after in translated[before]) {
          if (translated[before].hasOwnProperty(after)) {
            steps.push(
              {
                before,
                after,
                match: translated[before][after]['match']
              }
            );
          }
        }
      }
    }
    return steps;
  }

  private doSomething() {
    console.log('Doing something');
  }

  private translateLinks(links): object {
    const translated: object = {};
    for (const link of links) {
      if (!translated[link['from']]) {
        translated[link['from']] = {};
      }
      if (!translated[link['from']][link['to']]) {
        translated[link['from']][link['to']] = {};
      }

      if (!translated[link['from']][link['to']]['match']) {
        translated[link['from']][link['to']]['match'] = {};
      }

      translated[link['from']][link['to']]['match'][link['fromPort']] = link['toPort'];
    }
    return translated;
  }

  protected getPublish() {
    const selectedBrush = 'dodgerblue';
    const publish: object = {};

    for (const nit = this.diagram.nodes; nit.next(); ) {
      const node = nit.value;
      const table = node.findObject('RIGHTPORTS');
      if (table !== null) {
        for (const iit = table['elements']; iit.next(); ) {
          const itempanel = iit.value;
          const shape = itempanel.findObject('SHAPE');
          if (shape !== null && shape.fill === selectedBrush) {
            const process = iit.value.part.data.key;
            const output = iit.value['Zd']['name'];
            if (! publish[process]) {
              publish[process] = [];
            }
            publish[process].push(output);
          }
        }
      }
    }
    return publish;
  }

  addProcess() {
    const modal = this.modalService.open(AddProcess, { size: 'sm' });
    const self = this;
    modal.result.then((process) => {
      if (process) {
        this.diagram.model.addNodeData(
          self.getNode(process)
        );
      }
    });
  }

}
