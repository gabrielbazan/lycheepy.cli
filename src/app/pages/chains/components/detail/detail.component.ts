import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChainsService } from '../../chains.service';
import { ExecutionsService } from '../../executions.service';
import { ActivatedRoute, Params } from '@angular/router';

import { VisNodes, VisNetworkService, VisNetworkData, VisNetworkOptions } from 'ng2-vis/components';
import { DataSet, Edge } from 'vis';

class NetworkData implements VisNetworkData {
  nodes: VisNodes;
  edges: DataSet<Edge>;
}

import { ExecutionModal } from '../execution/execution.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'chains-detail-component',
  templateUrl: 'detail.html',
  styleUrls: ['./detail.scss'],
})
export class ChainsDetailComponent implements OnInit, OnDestroy {

  id: number;
  chain: any;
  executions: any[];

  visNetwork: string = 'chainGraph';
  visNetworkData: NetworkData;
  visNetworkOptions: VisNetworkOptions;

  constructor(
    protected chainsService: ChainsService,
    private activatedRoute: ActivatedRoute,
    private visNetworkService: VisNetworkService,
    private modalService: NgbModal,
    private executionsService: ExecutionsService,
  ) {}

  ngOnInit(): void {
    this.setId();
    this.setChainData();
    this.setExecutions();
  }

  ngOnDestroy(): void {
    this.visNetworkService.off(this.visNetwork, 'click');
  }

  private setId(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
  }

  private setChainData(): void {
    this.chainsService.get(this.id).subscribe(
      data => {
        this.chain = data.json();
        this.draw();
      },
      err => console.error(err),
    );
  }

  private setExecutions(): void {
    this.executionsService.getList({ order_by: 'start__desc', chain_id: this.id }).subscribe(
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
    this.getChainSteps();

    this.chainsService.update(this.id, this.chain).subscribe(
      data => {
        this.chain = data.json();
      },
    );
  }

  getChainSteps() {
    const steps: object[] = [];
    this.visNetworkData.edges.forEach(function (item, id) {
      console.log(item, id);
    });
  }

  draw() {
    const nodesList: string[] = [];
    const draftNodes: object[] = [];
    const draftEdges: object[] = [];

    for (const step of this.chain.steps) {
      if (nodesList.indexOf(step.before) === -1) {
        nodesList.push(step.before);
      }
      if (nodesList.indexOf(step.after) === -1) {
        nodesList.push(step.after);
      }
      draftEdges.push(
        { from: step.before, to: step.after },
      );
    }

    for (const node of nodesList) {
      draftNodes.push(
        { id: node, label: node, title: node },
      );
    }

    const edges = new DataSet(draftEdges);
    const nodes = new VisNodes(draftNodes);

    this.visNetworkData = { nodes, edges };

    const clearPopUp = function() {
      console.log('clear popup');
      document.getElementById('saveButton').onclick = null;
      document.getElementById('cancelButton').onclick = null;
      document.getElementById('network-popUp').style.display = 'none';
    };

    const cancelEdit = function(callback) {
      clearPopUp();
      callback(null);
    };

    const saveData = function(data, callback) {
      console.log('save data');
      data.id = (<HTMLInputElement>document.getElementById('node-id')).value;
      data.label = (<HTMLInputElement>document.getElementById('node-label')).value;
      clearPopUp();
      callback(data);
    };

    this.visNetworkOptions = {
      manipulation: {
        addNode: function (data, callback) {
          console.log('adding node.');
          // filling in the popup DOM elements
          document.getElementById('operation').innerHTML = 'Add Node';
          (<HTMLInputElement>document.getElementById('node-id')).value = data.id;
          (<HTMLInputElement>document.getElementById('node-label')).value = data.label;
          document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
          document.getElementById('cancelButton').onclick = clearPopUp;
          document.getElementById('network-popUp').style.display = 'block';
        },
        editNode: function (data, callback) {
          // filling in the popup DOM elements
          document.getElementById('operation').innerHTML = 'Edit Node';
          (<HTMLInputElement>document.getElementById('node-id')).value = data.id;
          (<HTMLInputElement>document.getElementById('node-label')).value = data.label;
          document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
          document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
          document.getElementById('network-popUp').style.display = 'block';
        },
        addEdge: function (data, callback) {
          if (data.from === data.to) {
            const r = confirm('Do you want to connect the node to itself?');
            if (r === true) {
              callback(data);
            }
          } else {
            callback(data);
          }
        },
      },
      physics: {
        enabled: false,
      },
      layout: {
        hierarchical: {
          sortMethod: 'directed',
          direction: 'LR',  // UD
        },
      },
      edges: {
        smooth: false,
        arrows: 'to',
      },
      nodes: {
        color: '#209e91',
        shape: 'box',
        shapeProperties: {
          borderRadius: 0,
          borderDashes: false,
          interpolation: false,
          useImageSize: false,
          useBorderWithImage: false,
        },
      },
    };
  }

}
