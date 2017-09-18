import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class ToastService {

  constructor(private toastr: ToastsManager, private toastOpts: ToastOptions) {
     this.toastOpts.toastLife = 8000;
     this.toastOpts.positionClass = 'toast-top-right';
     this.toastOpts.showCloseButton = true;
  }
  success(message: string) {
    this.toastr.success(message,'Success!');
  }
  info(message: string) {
    this.toastr.info(message);
  }
  warning(message: string) {
    this.toastr.warning(message,'Alert!');
  }
  error(message: string) {
    this.toastr.error(message, 'Oops!');
  }

}
