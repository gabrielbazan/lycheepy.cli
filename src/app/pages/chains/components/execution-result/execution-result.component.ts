import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CswService } from '../../../../services/csw.service';

import 'leaflet-map';


@Component({
  selector: 'execution-result-component',
  templateUrl: 'execution-result.html',
  styleUrls: ['./execution-result.scss'],
})
export class ExecutionResultComponent implements OnInit, AfterViewInit {

  map: any;
  resultLayers = L.featureGroup([]);
  shownResult: any;

  id: number;
  executionId: string;
  results: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _elementRef: ElementRef,
    private cswService: CswService,
  ) {}

  ngOnInit(): void {
    this.setParams().subscribe(() => this.getResults());
  }

  private setParams() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.executionId = params['executionId'];
    });
    return this.activatedRoute.params;
  }

  private getResults(): void {
    this.cswService.getExecutionResults(this.executionId).subscribe(data => {
      // TODO: Handle exception, or not results
      this.results = data['csw:GetRecordsResponse']['csw:SearchResults'][0]['csw:Record'];

      for (const result of this.results) {
        const lowerCorner = result['ows:BoundingBox'][0]['ows:LowerCorner'][0].split(' ');
        const upperCorner = result['ows:BoundingBox'][0]['ows:UpperCorner'][0].split(' ');

        this.resultLayers.addLayer(
          L.rectangle(
            [lowerCorner, upperCorner],
            { color: '#209e91', weight: 1 },
          ),
        );
      }

      this.resultLayers.addTo(this.map);
      this.map.fitBounds(this.resultLayers.getBounds());

    });
  }

  showResult(result) {
    if (this.shownResult !== result) {
      this.cleanMap();

      const references = result['dct:references'][0]._;

      L.tileLayer.wms(
        references,
        {
          format: 'image/png',
          transparent: true,
          attribution: result['dc:title'],
        },
      ).addTo(this.map);

      this.shownResult = result;
    } else {
      this.shownResult = null;
      this.showBoundingBoxes();
    }
  }

  showBoundingBoxes() {
    this.cleanMap();
    this.resultLayers.addTo(this.map);
  }

  private cleanMap() {
    const map = this.map;
    this.map.eachLayer(function(layer) {
      if (layer.isBaseLayer !== true) {
        map.removeLayer(layer);
      }
    });
  }

  ngAfterViewInit() {
    const el = this._elementRef.nativeElement.querySelector('.map');

    L.Icon.Default.imagePath = 'assets/img/theme/vendor/leaflet';

    this.map = L.map(el).setView([51.505, -0.09], 3);

    const baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    });

    baseLayer.isBaseLayer = true;

    baseLayer.addTo(this.map);
  }

}
