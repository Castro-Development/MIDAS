import { Component } from "@angular/core";

@Component({
  selector: 'notif-svg',
  template: `
    <svg height="6px"
    viewBox="3 3 8 8"
    xmlns="http://www.w3.org/2000/svg"
    >
        <circle r="4" fill="#FFD700" cx="6" cy="6">
          <animate attributeName="opacity" dur="1.5s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
        </circle>
      </svg>
  `,
  styleUrl: '../splash-screen-component.component.scss',
  standalone: true,
  imports: [],
})
export class NotificationBubble {

}
