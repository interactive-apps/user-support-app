import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { EmailMessage } from '../../../../models/email-message.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-compose-message',
  templateUrl: './compose-message.component.html',
  styleUrls: ['./compose-message.component.css']
})
export class ComposeMessageComponent extends DialogComponent<EmailMessage, boolean> implements EmailMessage {

  subject: string;
  text: string;
  emailComposeForm: FormGroup;


  constructor(public fb: FormBuilder, dialogService: DialogService) {
    super(dialogService)
  }

  ngOnInit() {

    this.emailComposeForm = this.fb.group({
      subject: ['', Validators.required],
      text: ['', Validators.required]
    });

    this.emailComposeForm.patchValue({
      subject: this.subject,
      text: this.text
    });

  }


  onSendEmail({ value, valid }: { value: EmailMessage, valid: boolean }) {
    console.log(value);
    this.close();
  }

}
