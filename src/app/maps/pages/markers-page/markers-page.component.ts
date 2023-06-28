import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit {


  @ViewChild('map') divMap!: ElementRef;

  public map?: Map;
  public currentCenterlngLat: LngLat = new LngLat(-63.19429306032242, 9.742427685159498);
  public markers: MarkerAndColor[] = [];

  ngAfterViewInit(): void {
    console.log(this.divMap);

    if ( !this.divMap ) throw new Error('divMap is not defined');

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCenterlngLat, // starting position [lng, lat]
      zoom: 14, // starting zoom
      });

      this.readFRomLocalStorage();
    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo';

    // const marker = new Marker(
    //   {
    //     element: markerHtml,
    //     color: 'red',
    //     draggable: true
    //   }
    // )
    //   .setLngLat( this.currentCenterlngLat )
    //   .addTo( this.map! );
  }

  createMarket(): void {
    if ( !this.map ) return;
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker( lngLat, color );
  }

  addMarker( lngLat: LngLat, color: string ): void {
    if ( !this.map ) return;

    const marker = new Marker(
      {
        color: color,
        draggable: true
      })
      .setLngLat( lngLat )
      .addTo( this.map! );

    this.markers.push( {
      color: color,
      marker: marker
    } );
    this.saveToLocalStorage();

    marker.on( 'dragend', () => {
      this.saveToLocalStorage();
    })
  }

  removeMarker ( index: number ) {
    this.markers[ index ].marker.remove();
    this.markers.splice( index, 1 );
  }

  goMarker( marker: Marker ) {
    this.map?.flyTo( {
      zoom: 15,
      center: marker.getLngLat()
    } );
  }

  saveToLocalStorage() {
    console.log( this.markers );
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker }) => {
      return {
        color: color,
        lngLat: marker.getLngLat().toArray()
      }
    });
    localStorage.setItem( 'plainmarkers', JSON.stringify( plainMarkers ) );
  }

  readFRomLocalStorage() {
    const plainMarkersString = localStorage.getItem( 'plainmarkers' ) ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString );

    plainMarkers.forEach( ({ color, lngLat }) => {
      const [ lng, lat ] = lngLat;
      const coords = new LngLat( lng, lat );
      this.addMarker( coords, color )
    } );
  }

}
