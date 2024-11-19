import { Component} from "@angular/core";


@Component({
    selector: 'admin-svg',
    template: `
    <!-- Header Section -->
    <svg viewBox="0 0 200 200" style="height: 50px; width: 50px;" xmlns="http://www.w3.org/2000/svg"> <!-- //*ngIf="isAdmin$ | async"> -->
            <defs>
              <linearGradient id="goldEye" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFE5A0"/>
                <stop offset="100%" style="stop-color:#DAA520"/>
              </linearGradient>

              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur1"/>
                <feMerge>
                  <feMergeNode in="blur1"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Outer hexagon -->
            <g filter="url(#glow)">
              <path d="M100,30 L160,65 L160,135 L100,170 L40,135 L40,65 Z"
                fill="none"
                stroke="#FFD700"
                stroke-width="2"
                opacity="0.5">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 100 100"
                  to="360 100 100"
                  dur="25s"
                  repeatCount="indefinite"/>
              </path>
            </g>

            <!-- Rotating square -->
            <g filter="url(#glow)">
              <rect x="60" y="60" width="80" height="80"
                fill="none"
                stroke="#FFD700"
                stroke-width="2"
                opacity="0.6">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 100 100"
                  to="-360 100 100"
                  dur="20s"
                  repeatCount="indefinite"/>
              </rect>
            </g>

            <!-- Inner diamond -->
            <g filter="url(#glow)">
              <rect x="70" y="70" width="60" height="60"
                fill="none"
                stroke="#FFD700"
                stroke-width="2"
                opacity="0.7"
                transform="rotate(45 100 100)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="45 100 100"
                  to="405 100 100"
                  dur="15s"
                  repeatCount="indefinite"/>
              </rect>
            </g>

            <!-- Outer rotating runes -->
            <g filter="url(#glow)">
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 100 100"
                  to="-360 100 100"
                  dur="30s"
                  repeatCount="indefinite"/>
                <text x="100" y="40" text-anchor="middle" fill="#FFD700" font-size="14">ᚨ</text>
                <text x="160" y="100" text-anchor="middle" fill="#FFD700" font-size="14">ᚱ</text>
                <text x="100" y="160" text-anchor="middle" fill="#FFD700" font-size="14">ᚲ</text>
                <text x="40" y="100" text-anchor="middle" fill="#FFD700" font-size="14">ᚦ</text>

                <!-- Additional diagonal runes -->
                <text x="145" y="55" text-anchor="middle" fill="#FFD700" font-size="14">ᛟ</text>
                <text x="145" y="145" text-anchor="middle" fill="#FFD700" font-size="14">ᛈ</text>
                <text x="55" y="145" text-anchor="middle" fill="#FFD700" font-size="14">ᛉ</text>
                <text x="55" y="55" text-anchor="middle" fill="#FFD700" font-size="14">ᚹ</text>
              </g>
            </g>

            <!-- Inner rotating runes -->
            <g filter="url(#glow)">
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 100 100"
                  to="360 100 100"
                  dur="20s"
                  repeatCount="indefinite"/>
                <text x="100" y="70" text-anchor="middle" fill="#FFD700" font-size="12">ᚺ</text>
                <text x="130" y="100" text-anchor="middle" fill="#FFD700" font-size="12">ᚻ</text>
                <text x="100" y="130" text-anchor="middle" fill="#FFD700" font-size="12">ᚾ</text>
                <text x="70" y="100" text-anchor="middle" fill="#FFD700" font-size="12">ᛁ</text>
              </g>
            </g>

            <!-- Eye -->
            <path d="M40,100 C60,70 140,70 160,100 C140,130 60,130 40,100"
              fill="none"
              stroke="url(#goldEye)"
              stroke-width="4"
              filter="url(#glow)"/>

            <!-- Iris -->
            <circle cx="100" cy="100" r="20"
              fill="url(#goldEye)"
              filter="url(#glow)">
              <animate
                attributeName="r"
                values="20;18;20"
                dur="3s"
                repeatCount="indefinite"/>
            </circle>

            <!-- Center rune -->
            <text x="100" y="105" text-anchor="middle" fill="#FFD700" font-size="12" filter="url(#glow)">ᛗ</text>
          </svg>
    `,
      standalone: true,
      imports: [],
})
export class AdminSVG{

}
