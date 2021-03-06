import {Component, OnInit, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import { parts } from './body-parts';

@Component({
  selector: 'app-male',
  templateUrl: './male.component.html',
  styleUrls: ['./male.component.css']
})
export class MaleComponent implements OnInit {

  @Input() sex: number;
  @Input() side: number;
  @Output() selectedParts = new EventEmitter<any>();

  frt_male = new parts().frt_male;
  frt_female = new parts().frt_female;
  bck_parts = new parts().bck;
  frt = this.frt_male.concat(this.frt_female);
  bck = this.bck_parts.concat(this.bck_parts);

  parts=[];

  constructor( private elementRef: ElementRef ) { }

  ngOnInit(){
    this.addClick();
  }

  addClick(){
    let els = this.elementRef.nativeElement.querySelectorAll('path');
    els.forEach((ele)=>{
      ele['style'].fill = 'red';
      ele['style']['fill-opacity'] = 0;
      ele['style']['stroke'] = 'red';
      ele['style']['stroke-opacity'] = 1;
      ele['style']['stroke-width'] = 2;
      ele.addEventListener('click',()=> {
      const id = ele["id"];
      if( this.side == 0){
        let part = this.frt[id.split("_")[1]-1];
        // console.log(part);
        // this.parts.push(part);
        this.selectedParts.emit(part);
      }else {
        let part = this.bck[id.split("_")[1]-1];
        // console.log(part);
        // this.parts.push(part);
        this.selectedParts.emit(part);
      }
      // this.selectedParts.emit(this.dedupe(this.parts));
      // console.log(id);
    });

      ele.addEventListener('mouseenter',()=> {
        ele['style'].fill = '#FF0000';
        ele['style']['fill-opacity'] = 0.3;
        ele['style']['stroke'] = '#FF0000';
        ele['style']['stroke-opacity'] = 1;
      });
      ele.addEventListener('mousedown',()=>{
        ele['style'].fill = '#993366';
        ele['style']['fill-opacity'] = 0.7;
        ele['style']['stroke'] = '#993366';
        ele['style']['stroke-opacity'] = 1;
      });
      ele.addEventListener('mouseup',()=>{
        ele['style'].fill = '#FF0000';
        ele['style']['fill-opacity'] = 0.3;
        ele['style']['stroke'] = '#FF0000';
        ele['style']['stroke-opacity'] = 1;
      });
      ele.addEventListener('mouseleave',()=>{
        ele['style'].fill = 'red';
        ele['style']['fill-opacity'] = 0;
        ele['style']['stroke'] = 'red';
        ele['style']['stroke-opacity'] = 1;
      })
  })
  }

  dedupe(array){
    return Array.from(new Set(array));
  }
}
