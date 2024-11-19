import { Component } from "@angular/core";


@Component({
  selector: 'calendar-svg',
  template: `
    <!-- Header Section -->
    <svg routerLink="/calendar" viewBox="0 0 200 200" style="width: 50px; height: 50px;" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="calendarGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur1"/>
              <feGaussianBlur stdDeviation="4" result="blur2"/>
              <feMerge>
                <feMergeNode in="blur1"/>
                <feMergeNode in="blur2"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <linearGradient id="calendarGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FFE5A0"/>
              <stop offset="45%" style="stop-color:#FFD700"/>
              <stop offset="75%" style="stop-color:#DAA520"/>
              <stop offset="100%" style="stop-color:#B8860B"/>
            </linearGradient>

            <linearGradient id="headerGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#FFD700"/>
              <stop offset="100%" style="stop-color:#DAA520"/>
            </linearGradient>
          </defs>

          <!-- Main calendar body -->
          <rect x="40" y="40" width="120" height="130" rx="10"
            fill="none"
            stroke="url(#calendarGold)"
            stroke-width="4"
            filter="url(#calendarGlow)">
            <animate attributeName="stroke-opacity"
              values="1;0.7;1"
              dur="3s"
              repeatCount="indefinite"/>
          </rect>

          <!-- Calendar header -->
          <rect x="40" y="40" width="120" height="30" rx="10"
            fill="url(#headerGold)"
            opacity="0.5"
            filter="url(#calendarGlow)"/>

          <!-- Hanging loops -->
          <path d="M70 30 Q80 40 90 30"
            fill="none"
            stroke="#FFD700"
            stroke-width="3"
            filter="url(#calendarGlow)">
            <animate attributeName="d"
              values="M70 30 Q80 40 90 30;M70 32 Q80 42 90 32;M70 30 Q80 40 90 30"
              dur="3s"
              repeatCount="indefinite"/>
          </path>

          <path d="M110 30 Q120 40 130 30"
            fill="none"
            stroke="#FFD700"
            stroke-width="3"
            filter="url(#calendarGlow)">
            <animate attributeName="d"
              values="M110 30 Q120 40 130 30;M110 32 Q120 42 130 32;M110 30 Q120 40 130 30"
              dur="3s"
              begin="0.5s"
              repeatCount="indefinite"/>
          </path>

          <!-- Decorative runes on header -->
          <text x="60" y="60" fill="#FFD700" font-size="12" filter="url(#calendarGlow)">ᚨ</text>
          <text x="140" y="60" fill="#FFD700" font-size="12" filter="url(#calendarGlow)">ᚱ</text>

          <!-- Calendar grid lines - vertical -->
          <g stroke="#FFE5A0" stroke-width="1.5" opacity="0.8" filter="url(#calendarGlow)">
            <line x1="60" y1="80" x2="60" y2="160">
              <animate attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                repeatCount="indefinite"/>
            </line>
            <line x1="85" y1="80" x2="85" y2="160">
              <animate attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                begin="0.2s"
                repeatCount="indefinite"/>
            </line>
            <line x1="110" y1="80" x2="110" y2="160">
              <animate attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                begin="0.4s"
                repeatCount="indefinite"/>
            </line>
            <line x1="135" y1="80" x2="135" y2="160">
              <animate attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                begin="0.6s"
                repeatCount="indefinite"/>
            </line>
          </g>

          <!-- Calendar grid lines - horizontal -->
          <g stroke="#FFE5A0" stroke-width="1.5" opacity="0.8" filter="url(#calendarGlow)">
            <line x1="45" y1="100" x2="155" y2="100">
              <animate attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                begin="0.1s"
                repeatCount="indefinite"/>
            </line>
            <line x1="45" y1="120" x2="155" y2="120">
              <animate attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                begin="0.3s"
                repeatCount="indefinite"/>
            </line>
            <line x1="45" y1="140" x2="155" y2="140">
              <animate attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"/>
            </line>
          </g>

          <!-- Grid intersection points -->
          <g fill="#FFD700" filter="url(#calendarGlow)">
            <circle cx="60" cy="100" r="1.5"/>
            <circle cx="85" cy="100" r="1.5"/>
            <circle cx="110" cy="100" r="1.5"/>
            <circle cx="135" cy="100" r="1.5"/>

            <circle cx="60" cy="120" r="1.5"/>
            <circle cx="85" cy="120" r="1.5"/>
            <circle cx="110" cy="120" r="1.5"/>
            <circle cx="135" cy="120" r="1.5"/>

            <circle cx="60" cy="140" r="1.5"/>
            <circle cx="85" cy="140" r="1.5"/>
            <circle cx="110" cy="140" r="1.5"/>
            <circle cx="135" cy="140" r="1.5"/>
          </g>

          <!-- Glowing dots for current date -->
          <circle cx="72" cy="110" r="3" fill="#FFD700" filter="url(#calendarGlow)">
            <animate attributeName="opacity"
              values="1;0.5;1"
              dur="2s"
              repeatCount="indefinite"/>
          </circle>

          <!-- Mystical sparkles -->
          <g filter="url(#calendarGlow)">
            <circle cx="45" cy="45" r="1.5" fill="#FFE5A0">
              <animate attributeName="opacity"
                values="1;0;1"
                dur="1.5s"
                repeatCount="indefinite"/>
            </circle>
            <circle cx="155" cy="45" r="1.5" fill="#FFE5A0">
              <animate attributeName="opacity"
                values="1;0;1"
                dur="1.5s"
                begin="0.5s"
                repeatCount="indefinite"/>
            </circle>
            <circle cx="45" cy="165" r="1.5" fill="#FFE5A0">
              <animate attributeName="opacity"
                values="1;0;1"
                dur="1.5s"
                begin="0.75s"
                repeatCount="indefinite"/>
            </circle>
            <circle cx="155" cy="165" r="1.5" fill="#FFE5A0">
              <animate attributeName="opacity"
                values="1;0;1"
                dur="1.5s"
                begin="1s"
                repeatCount="indefinite"/>
            </circle>
          </g>
        </svg>
    `,
  standalone: true,
  imports: [],
})
export class CalendarSVG {

}
