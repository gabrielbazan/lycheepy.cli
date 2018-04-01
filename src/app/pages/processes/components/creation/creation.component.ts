import { Component, OnInit } from '@angular/core';
import { ProcessesService } from '../../../../services/processes.service';
import { FormatsService } from '../../../../services/formats.service';
import { DataTypesService } from '../../../../services/data.types.service';
import { Process, DataType, Format, Input, Output } from '../../../../models'
import * as go from "gojs";


@Component({
  selector: 'processes-creation-component',
  templateUrl: 'creation.html',
  styleUrls: ['./creation.scss'],
})
export class ProcessesCreationComponent implements OnInit {

  process: Process = new Process(
    null,
    '',
    '',
    '',
    '',
    [],
    [],
    []
  );

  input: Input = new Input();
  output: Output = new Output();

  formats: Format[];
  dataTypes: DataType[];

  diagram: go.Diagram = null;

  processFile: any;

  constructor(
    protected service: ProcessesService,
    protected formatsService: FormatsService,
    protected dataTypesService: DataTypesService
  ) {
    this.loadFormats();
    this.loadDataTypes();
  }

  ngOnInit() {
    this.drawDiagram();
  }

  loadFormats() {
    this.formatsService.getList().subscribe(
      formats => {
        this.formats = formats;
      },
      err => console.error(err),
    );
  }

  loadDataTypes() {
    this.dataTypesService.getList().subscribe(
      dataTypes => {
        this.dataTypes = dataTypes;
      },
      err => console.error(err),
    );
  }

  updateFile($event) {
    const files = $event.target.files || $event.srcElement.files;
    this.processFile = files[0]
  }

  create() {
    this.service.create(this.process, this.processFile).subscribe(
      process => {
        console.log(process);
      },
    );
  }


  private drawDiagram() {
    const element = document.getElementById('graph');
    const $ = go.GraphObject.make;
    const self = this;

    self.diagram = $(
      go.Diagram,
      element,
      {
        initialContentAlignment: go.Spot.Center,
        'ModelChanged'(e) {},
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
          new go.Binding('portId', 'name')
        ),
        $(go.TextBlock, new go.Binding('text', 'name'), {})
      );
    }

    self.diagram.nodeTemplate = $(
      go.Node,
      'Spot',
      { selectionAdorned: false, deletable: false },
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

    self.diagram.model = $(
      go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: [self.getDiagramNode()]
      }
    );

  }

  private getDiagramNode(): object {
    const self = this;
    const node = {
      key: self.process.identifier,
      name: self.process.identifier,
      inservices: [],
      outservices: []
    };
    for (const input of self.process.inputs) {
      node.inservices.push({ 'name': input.identifier });
    }
    for (const output of self.process.outputs) {
      node.outservices.push({ 'name': output.identifier });
    }
    return node;
  }

  updateDiagram() {
    this.diagram.startTransaction('update');
    this.diagram.model.nodeDataArray = [this.getDiagramNode()];
    this.diagram.commitTransaction('update');
  }

  addInput() {
    this.process.inputs.push(this.input);
    this.input = new Input();
    this.updateDiagram();
  }

  addOutput() {
    this.process.outputs.push(this.output);
    this.output = new Output();
    this.updateDiagram();
  }

}
