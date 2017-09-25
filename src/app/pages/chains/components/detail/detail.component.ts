import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChainsService } from '../../../../services/chains.service';
import { ExecutionsService } from '../../../../services/executions.service';
import { Chain, Execution } from '../../../../models'
import { ExecutionModal } from '../execution/execution.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as go from 'gojs';
import { Inspector } from './data.inspector'


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
    if (element && !this.drawn) {
      this.drawn = true;
      this.drawGraph(element);
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
    const $ = go.GraphObject.make;

    this.graph = $(
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

    this.graph.nodeTemplate = $(
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

    this.graph.linkTemplate = $(
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
    this.graph.model = new go.GraphLinksModel(
      this.getGraphNodes(),
      this.getGraphEdges()
    );

    this.graph.select(this.graph.nodes.first());

    const inspector = new Inspector(
      'inspector',
      this.graph,
      {
        // uncomment this line to only inspect the named properties below instead of all properties on each object:
        includesOwnProperties: true,
        properties: {
          'text': {},
          // key would be automatically added for nodes, but we want to declare it read-only also:
          'key': {
            readOnly: true,
            show: Inspector.prototype.showIfPresent(this.graph.selection.first(), 'key')
          },
          // Comments and LinkComments are not in any node or link data (yet), so we add them here:
          'Comments': {
            show: Inspector.prototype.showIfNode(this.graph.selection.first())
          },
          'LinkComments': {
            show: Inspector.prototype.showIfLink(this.graph.selection.first())
          }
        }
      });
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
        { from: step.before, to: step.after, publish: step.publish, match: step.match }
      );
    }
    return edges;
  }

}
