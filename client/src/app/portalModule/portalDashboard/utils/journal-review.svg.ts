import { Component, EventEmitter, Input, Output } from "@angular/core";


@Component({
  selector: 'journal-review-svg',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" height="60px">
      <defs>
        <linearGradient id="archiveGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFE5A0"/>
          <stop offset="45%" style="stop-color:#FFD700"/>
          <stop offset="75%" style="stop-color:#DAA520"/>
          <stop offset="100%" style="stop-color:#B8860B"/>
        </linearGradient>

        <filter id="archiveGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur1"/>
          <feGaussianBlur stdDeviation="5" result="blur2"/>
          <feMerge>
            <feMergeNode in="blur1"/>
            <feMergeNode in="blur2"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Main icon group -->
      <g transform="translate(0, -20)">
        <!-- Outer rotating ring with runes -->
        <g filter="url(#archiveGlow)">
          <circle cx="100" cy="100" r="60"
                  fill="none" stroke="url(#archiveGold)" stroke-width="2"
                  opacity="0.6">
            <animateTransform attributeName="transform"
                              type="rotate"
                              from="0 100 100"
                              to="360 100 100"
                              dur="20s"
                              repeatCount="indefinite"/>
          </circle>
        </g>

        <!-- Inner rotating ring -->
        <g filter="url(#archiveGlow)">
          <circle cx="100" cy="100" r="45"
                  fill="none" stroke="url(#archiveGold)" stroke-width="2"
                  opacity="0.6">
            <animateTransform attributeName="transform"
                              type="rotate"
                              from="360 100 100"
                              to="0 100 100"
                              dur="15s"
                              repeatCount="indefinite"/>
          </circle>
        </g>

        <!-- Central hourglass symbol -->
        <g transform="translate(100 100)" filter="url(#archiveGlow)">
          <!-- Upper triangle -->
          <path d="M-20,-20 L20,-20 L0,0 Z"
                fill="none" stroke="url(#archiveGold)" stroke-width="2">
            <animate attributeName="fill-opacity"
                      values="0;0.3;0"
                      dur="3s"
                      repeatCount="indefinite"/>
          </path>

          <!-- Lower triangle -->
          <path d="M-20,20 L20,20 L0,0 Z"
                fill="none" stroke="url(#archiveGold)" stroke-width="2">
            <animate attributeName="fill-opacity"
                      values="0.3;0;0.3"
                      dur="3s"
                      repeatCount="indefinite"/>
          </path>

          <!-- Flowing particles -->
          <g fill="#FFD700">
            <circle cx="0" cy="-8" r="1">
              <animate attributeName="cy"
                        values="-8;8;-8"
                        dur="3s"
                        repeatCount="indefinite"/>
            </circle>
            <circle cx="0" cy="-4" r="1">
              <animate attributeName="cy"
                        values="-4;12;-4"
                        dur="3s"
                        repeatCount="indefinite"/>
            </circle>
            <circle cx="0" cy="0" r="1">
              <animate attributeName="cy"
                        values="0;16;0"
                        dur="3s"
                        repeatCount="indefinite"/>
            </circle>
          </g>
        </g>

        <!-- Orbital runes -->
        <g fill="#FFD700" font-size="14" filter="url(#archiveGlow)">
          <!-- Orbiting runes -->
          <g>
            <animateTransform attributeName="transform"
                              type="rotate"
                              from="0 100 100"
                              to="360 100 100"
                              dur="10s"
                              repeatCount="indefinite"/>
            <text x="160" y="100" text-anchor="middle">ᛖ</text>
            <text x="100" y="160" text-anchor="middle">ᛟ</text>
            <text x="40" y="100" text-anchor="middle">ᚹ</text>
            <text x="100" y="40" text-anchor="middle">ᚨ</text>
          </g>
        </g>

        <!-- Energy beams -->
        <g stroke="url(#archiveGold)" stroke-width="1" opacity="0.5">
          <line x1="100" y1="40" x2="100" y2="160">
            <animate attributeName="opacity"
                      values="0.5;0.2;0.5"
                      dur="2s"
                      repeatCount="indefinite"/>
          </line>
          <line x1="40" y1="100" x2="160" y2="100">
            <animate attributeName="opacity"
                      values="0.2;0.5;0.2"
                      dur="2s"
                      repeatCount="indefinite"/>
          </line>
        </g>
      </g>

      <!-- Title -->
      <text x="100" y="220"
            text-anchor="middle"
            fill="url(#archiveGold)"
            font-family="Copperplate Gothic, Luminari, Fantasy"
            font-size="16"
            letter-spacing="1"
            filter="url(#textGlow)">
        <tspan style="font-size: 18px">{{text}}</tspan>
      </text>
    </svg>
    `,
    standalone: true,
    imports: [],

})
export class JournalReviewSVG {

@Input() text: string='';
@Input() height!: number;
@Input() width!: number;

}
