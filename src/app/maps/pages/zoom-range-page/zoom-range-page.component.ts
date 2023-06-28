import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap!: ElementRef;

  public zoomLevel: number = 9;
  public map?: Map;
  public currentCenterlngLat: LngLat = new LngLat(-63.19331566540322, 9.740915586365631);

  ngAfterViewInit(): void {

    console.log(this.divMap);

    if ( !this.divMap ) throw new Error('divMap is not defined');

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCenterlngLat, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
      });

    this.maplistener();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  maplistener( ) {
    if ( !this.map ) throw 'map is not defined';

    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if ( this.map!.getZoom() < 18 ) return
      this.map!.zoomTo(18);

    });

    this.map.on('move', () => {
      this.currentCenterlngLat = this.map!.getCenter();
      const { lng, lat } = this.currentCenterlngLat;
    });
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomChange( value: string ) {
    this.zoomLevel = Number(value);
    this.map?.zoomTo( this.zoomLevel );
  }
}
