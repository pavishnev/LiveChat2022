import { MatSnackBar } from '@angular/material/snack-bar';
import { WidgetService } from './../../../services/widget.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ai-settings',
  templateUrl: './ai-settings.component.html',
  styleUrls: ['./ai-settings.component.css']
})
export class AiSettingsComponent implements OnInit {
  textAreaLock: boolean = true;
  context: string = "gfhfg";

  constructor(private widgetService: WidgetService,
    private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.widgetService.getChatbotContext().subscribe(cont => {
      this.context = cont.context;
    })
  }

  saveContext() {
    console.log(this.context);
    this.widgetService.setChatbotContext(this.context).subscribe(res => {
      console.log(res.context);
      this.unlockTextarea();
      this.snackbar.open("Context was successfully saved", 'OK', { duration: 3000 })

    })
  }
  unlockTextarea() {
    this.textAreaLock = !this.textAreaLock;
  }
}
