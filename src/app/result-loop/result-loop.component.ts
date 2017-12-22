import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http-service/http-service';
import { NzModalService } from 'ng-zorro-antd';
import { LoopModalComponent } from './loop-modal/loop-modal.component';

@Component({
  selector: 'app-result-loop',
  templateUrl: './result-loop.component.html',
  styleUrls: ['./result-loop.component.css']
})
export class ResultLoopComponent implements OnInit {

  list: any[] = [];
  title = 'app';
  current = 1;
  _value: string;
  probableDisease: Array<any>;
  probableDepartment= [];
  probableSymptom: Array<any>;
  selectedSym = [];
  notSym = [];
  data = [
    {
      key    : '1',
      name   : '高血压',
      age    : '心血管内科',
      address: 'New York No. 1 Lake Park',
    }, {
      key    : '2',
      name   : '血栓',
      age    : '心血管内科',
      address: 'London No. 1 Lake Park',
    }, {
      key    : '3',
      name   : '血管炎',
      age    : '心血管内科',
      address: 'Sidney No. 1 Lake Park',
    }
  ];
  constructor( public httpService: HttpService, private modalService: NzModalService) {
  }

  ngOnInit() {
   // console.log(this.mainSym);
    // console.log(this.httpService.searchPart.Name);
  //  this.selectedSym.push(this.httpService.searchPart.Name);
    this.selectedSym.push(
      {
        name: sessionStorage.getItem('search_part_name'),
        id: sessionStorage.getItem('search_part_id')
      }
      );
    for (let i = 0; i < 20; i++) {
      this.list.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        direction: Math.random() * 2 > 1 ? 'right' : ''
      });
    }
    this.httpService.getDisease([sessionStorage.getItem('search_part_id')], []).subscribe((res) => {
      console.log(res);
      this.probableDisease = res.Results.PosDis;
      this.probableSymptom = res.Results.PosSym;
      console.log(res.Results.PosDep);
      for (const key in res.Results.PosDep) {
        console.log(key);
        this.probableDepartment.push(res.Results.PosDep[key]);
      }
      console.log(this.probableDepartment);
    });
  }
  showLoopModal() {
    const subscription = this.modalService.open({
      title: '并发症情况',
      content: LoopModalComponent,
      onOk() {
      },
      onCancel() {
        console.log('Click cancel');
      },
      footer: false,
      componentParams: {
        name: '测试渲染',
        further_symptoms: this.probableSymptom,
      }
    });
    subscription.subscribe(res => {
      console.log(res);
      if (res.HaveSym || res.NotSym) {
        const HaveSym = res.HaveSym;
        const NotSym = res.NotSym;
        const HaveSymId = [];
        const NotHaveSymId = [];
        console.log(HaveSym);
        for (const item of HaveSym) {
          this.selectedSym.push(item);
        }
        for (const item of this.selectedSym) {
          HaveSymId.push(item.id);
        }
        for (const item of NotSym) {
          this.notSym.push(item);
          NotHaveSymId.push(item.id);
        }
        this.getDisease(HaveSymId, NotHaveSymId);
      }
    });
  }
  getDisease(Sym: Array<any>, notSym: Array<any>) {
    this.httpService.getDisease(Sym, notSym).subscribe(res => {
      console.log(res);
      this.probableDisease = res.Results.PosDis;
      this.probableSymptom = res.Results.PosSym;
      this.probableDepartment = [];
      console.log(res.Results.PosDep);
      for (const key in res.Results.PosDep) {
        console.log(key);
        this.probableDepartment.push(res.Results.PosDep[key]);
      }
      console.log(this.probableDepartment);
    });
  }

  handleClose(item) {
    const HaveSymId = [];
    const NotHaveSymId = [];
    for (let i = 0; i < this.selectedSym.length; i++) {
      if (this.selectedSym[i].id === item.id) {
        this.selectedSym.splice(i, 1);
      }
    }
    for (const sym of this.selectedSym) {
      HaveSymId.push(sym.id);
    }
    for (const sym of this.notSym) {
      NotHaveSymId.push(sym.id);
    }
    this.getDisease(HaveSymId, NotHaveSymId);
  }

  filterOption(inputValue, option) {
    return option.description.indexOf(inputValue) > -1;
  }

  search(ret: any) {
    console.log('nzSearchChange', ret);
  }

  select(ret: any) {
    console.log('nzSelectChange', ret);
  }

  change(ret: any) {
    console.log('nzChange', ret);
  }
}
