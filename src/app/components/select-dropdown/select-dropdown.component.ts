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
  @Input() showSearchInput: boolean = false;
  @Input() selectedItem: any;
  @Input() positionAbsolute: boolean = true;
  public showSelectOptions: boolean = false;

  constructor() { }

  ngOnInit() {

  }

  toggleDropdownList(event) {
    event.stopPropagation();
    this.showSelectOptions = !this.showSelectOptions;
  }

  setSelected(item, event) {
    event.stopPropagation();
    this.selectedItem = item.name;
    this.showSelectOptions = false;
    this.onSelected.emit({
      selectedItem: item
    });
  }

  clickOutside(event: boolean) {
    if(event){
      this.showSelectOptions = false;
    }
  }

}
