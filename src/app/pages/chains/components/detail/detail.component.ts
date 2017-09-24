import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChainsService } from '../../../../services/chains.service';
import { ExecutionsService } from '../../../../services/executions.service';
import { Chain, Execution } from '../../../../models'
import { ExecutionModal } from '../execution/execution.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as go from 'gojs'


@Component({
  selector: 'chains-detail-component',
  templateUrl: 'detail.html',
  styleUrls: ['./detail.scss'],
})
export class ChainsDetailComponent implements OnInit, AfterViewChecked {

  id: number;
  chain: Chain;
  executions: Execution[];

  graph: go.Diagram = null;
  drawn = false;

  constructor(
    protected chainsService: ChainsService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private executionsService: ExecutionsService,
  ) {}

  ngOnInit(): void {
    this.loadId();
    this.loadChainData();
  }

  ngAfterViewChecked() {
    const element = document.getElementById('graph');
    if (!this.drawn && element) {
      this.drawGraph(element);
      this.drawn = true;
    }
  }

  private loadId(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
  }

  private loadChainData(): void {
    this.chainsService.get(this.id).subscribe(
      data => {
        this.chain = data.json();
        this.loadExecutions();
      },
      err => console.error(err),
    );
  }

  private loadExecutions(): void {
    this.executionsService.getList({ order_by: 'start__desc', chain_identifier: this.chain.identifier }).subscribe(
      data => {
        this.executions = data.json().results;
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
      data => {
        this.chain = data.json();
      },
    );
  }

  private drawGraph(element) {
    const $ = go.GraphObject.make;  // for conciseness in defining templates

    this.graph = $(go.Diagram, element,  // create a Diagram for the DIV HTML element
      {
        initialContentAlignment: go.Spot.Center,  // center the content
        'undoManager.isEnabled': true // enable undo & redo
      });

    // define a simple Node template
    this.graph.nodeTemplate =
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 8 },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding('text', 'key'))
      );

    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    this.graph.model = new go.GraphLinksModel(
      this.getGraphNodes(),
      this.getGraphEdges()
    );
  }

  private getGraphNodes(): object[] {
    const identifiers = [];
    const nodes = [];

    for (const step of this.chain.steps) {
      if (identifiers.indexOf(step.before) === -1) {
        identifiers.push(step.before);
      }
      if (identifiers.indexOf(step.after) === -1) {
        identifiers.push(step.after);
      }
    }

    for (const identifier of identifiers) {
      nodes.push(
        { key: identifier, color: 'lightblue' }
      );
    }

    return nodes;
  }

  private getGraphEdges(): object[] {
    const edges = [];
    for (const step of this.chain.steps) {
      edges.push(
        { from: step.before, to: step.after }
      );
    }
    return edges;
  }

}
