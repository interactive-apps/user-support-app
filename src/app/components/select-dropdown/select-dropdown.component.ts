import { Component, EventEmitter, OnInit, Input, Output} from '@angular/core';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.css']
})
export class SelectDropdownComponent implements OnInit {

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectOptions:any[] = [];
  @Input() selectHeader: string = 'Select';
  public showSelectOptions: boolean = false;
  public selectedItem: any;

  constructor() { }

  ngOnInit() {

  }

  toggleDropdownList(event) {
    event.stopPropagation();
    this.showSelectOptions = !this.showSelectOptions;
  }

  setSelected(item, event) {
    event.stopPropagation();
    this.selectedItem = item;
    this.showSelectOptions = false;
    this.onSelected.emit({
      selectedItem: item
    });
  }

}
