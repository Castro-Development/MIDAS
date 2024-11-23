import { NgModule, Component } from '@angular/core';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'Transaction 1 between cash and assets $1000', date: '2024-11-01', url: 'https://www.google.com' },
      { title: 'event 2', date: '2024-11-02', url: 'https://www.google.com' }
    ],

  };

  handleDateClick(arg: any) {
    //alert('date click! ' + arg.dateStr)
  }
}
