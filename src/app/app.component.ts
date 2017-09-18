import { Component, OnInit, Input, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(toastr: ToastsManager, vRef: ViewContainerRef){
    toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {

  }
}
