import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'counter-alone',
  standalone: true,
  // imports: [CommonModule],
  templateUrl: './counter-alone.component.html',
  styleUrls: ['./counter-alone.component.css']
})
export class CounterAloneComponent {

  @Input()
  public counter = 0;

  public increment() {
    this.counter += 100;
  }

  public decrement() {
    this.counter -= 100;
  }

}
