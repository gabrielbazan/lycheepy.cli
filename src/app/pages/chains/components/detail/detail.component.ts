import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChainsService } from '../../chains.service';
import { ActivatedRoute, Params } from '@angular/router';

import { VisNodes, VisNetworkService, VisNetworkData, VisNetworkOptions } from 'ng2-vis/components';
import { DataSet, Edge } from 'vis';

class ExampleNetworkData implements VisNetworkData {
  nodes: VisNodes;
  edges: DataSet<Edge>;
}


@Component({
  selector: 'chains-detail-component',
  templateUrl: 'detail.html',
  styleUrls: ['./detail.scss'],
})
export class ChainsDetailComponent implements OnInit, OnDestroy {

  id: number;
  chain: any;

  visNetwork: string = 'chainGraph';
  visNetworkData: ExampleNetworkData;
  visNetworkOptions: VisNetworkOptions;


  constructor(
    protected service: ChainsService,
    private activatedRoute: ActivatedRoute,
    private visNetworkService: VisNetworkService,
  ) {}


  private setId(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
  }

  private setChainData(): void {
    this.service.get(this.id).subscribe(
      data => {
        this.chain = data.json();
        this.draw();
      },
      err => console.error(err),
    );
  }

  ngOnDestroy(): void {
    this.visNetworkService.off(this.visNetwork, 'click');
  }

  ngOnInit(): void {
    this.setId();
    this.setChainData();
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
      document.getElementById('saveButton').onclick = null;
      document.getElementById('cancelButton').onclick = null;
      document.getElementById('network-popUp').style.display = 'none';
    };

    const cancelEdit = function(callback) {
      clearPopUp();
      callback(null);
    };

    const saveData = function(data, callback) {
      data.id = (<HTMLInputElement>document.getElementById('node-id')).value;
      data.label = (<HTMLInputElement>document.getElementById('node-label')).value;
      clearPopUp();
      callback(data);
    };

    this.visNetworkOptions = {
      manipulation: {
        addNode: function (data, callback) {
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
    };
  }

}
