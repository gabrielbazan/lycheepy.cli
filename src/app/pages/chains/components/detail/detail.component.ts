import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChainsService } from '../../../../services/chains.service';
import { ExecutionsService } from '../../../../services/executions.service';
import { ProcessesService } from '../../../../services/processes.service';
import { Chain, Execution, Process } from '../../../../models'
import { ExecutionModal } from '../execution/execution.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as go from 'gojs';
import { DiagramObserver } from './graph.editor'

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'chains-detail-component',
  templateUrl: 'detail.html',
  styleUrls: ['./detail.scss'],
})
export class ChainsDetailComponent implements OnInit {

  id: number;
  chain: Chain;
  processes: object = {};
  executions: Execution[];

  diagram: go.Diagram = null;
  graph: DiagramObserver;

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

  private loadChainData(): void {
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
        for (const process of processes) {
          this.processes[process.identifier] = process;
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
    const activeModal = this.modalService.open(ExecutionModal, { size: 'lg' });
    activeModal.componentInstance.chain = this.chain;
  }

  updateChain() {
    this.chainsService.update(this.id, this.chain).subscribe(
      chain => {
        this.chain = chain;
      },
    );
  }

  private drawGraph() {
    const element = document.getElementById('graph');
    const $ = go.GraphObject.make;

    this.diagram = $(
      go.Diagram,
      element,
      {
        'animationManager.isEnabled': false,
        'undoManager.isEnabled': true,
        initialContentAlignment: go.Spot.Center,
        'clickCreatingTool.archetypeNodeData': {
          key: 'Node',
          color: 'lightblue',
        },
        layout: $(go.LayeredDigraphLayout)
      }
    );

    this.diagram.nodeTemplate = $(
      go.Node,
      'Auto',  // the Shape will go around the TextBlock
      {
        locationSpot: go.Spot.Center
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(
        go.Shape,
        'RoundedRectangle',
        {
          stroke: null,
          fill: 'white',
          portId: '',
          cursor: 'pointer',
          strokeWidth: 0,
          fromLinkable: true,
          toLinkable: true,
          fromLinkableSelfNode: false,
          toLinkableSelfNode: false,
          fromLinkableDuplicates: false,
          toLinkableDuplicates: false,
        },
        // Shape.fill is bound to Node.data.color
        new go.Binding('fill', 'color')
      ),
      $(
        go.TextBlock,
        {
          margin: 8,
          isMultiline: false,
          editable: true,
          cursor: 'move',
        },  // some room around the text
        // TextBlock.text is bound to Node.data.key
        new go.Binding('text', 'key')
      )
    );

    this.diagram.linkTemplate = $(
      go.Link,
      {
        toShortLength: 3,
        relinkableFrom: true,
        relinkableTo: true
      },  // allow the user to relink existing links
      $(
        go.Shape,
        {
          strokeWidth: 2
        },
        new go.Binding('stroke', 'color')),
        $(
          go.Shape,
          {
            toArrow: 'Standard',
            stroke: null,
          },
          new go.Binding('fill', 'color')
        )
      );

    // create the model data that will be represented by Nodes and Links
    this.diagram.model = new go.GraphLinksModel(
      this.getGraphNodes(),
      this.getGraphEdges()
    );

    this.diagram.select(this.diagram.nodes.first());

    this.initializeEditor();
  }

  private getGraphNodes(): object[] {
    const nodes = [];
    for (const identifier of this.chain.getProcessesIdentifiers()) {
      nodes.push(
        {
          key: identifier,
          color: 'lightblue'
        }
      );
    }
    return nodes;
  }

  private getGraphEdges(): object[] {
    const edges = [];
    for (const step of this.chain.steps) {
      edges.push(
        {
          from: step.before,
          to: step.after,
          publish: step.publish,
          match: step.match,
          before: this.processes[step.before],
          after: this.processes[step.after]
        }
      );
    }
    return edges;
  }

  private initializeEditor() {
    this.graph = new DiagramObserver(this.diagram);
  }

}
