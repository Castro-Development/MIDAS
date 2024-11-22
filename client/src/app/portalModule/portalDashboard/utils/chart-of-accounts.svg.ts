import { Component, EventEmitter, Input, Output } from "@angular/core";


@Component({
    selector: 'chart-account-svg',
    template: `

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240">
                    <defs>
                      <linearGradient id="chartGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFE5A0"/>
                        <stop offset="45%" style="stop-color:#FFD700"/>
                        <stop offset="75%" style="stop-color:#DAA520"/>
                        <stop offset="100%" style="stop-color:#B8860B"/>
                      </linearGradient>

                      <filter id="chartGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur1"/>
                        <feGaussianBlur stdDeviation="5" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      <!-- Text glow effect -->
                      <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    <!-- Original icon content moved down slightly -->
                    <g transform="translate(0, -20)">
                      <!-- Background structure -->
                      <rect x="40" y="40" width="120" height="120" rx="10"
                            fill="none" stroke="url(#chartGold)" stroke-width="4"
                            filter="url(#chartGlow)">
                        <animate attributeName="stroke-opacity"
                                 values="1;0.7;1" dur="3s"
                                 repeatCount="indefinite"/>
                      </rect>

                      <!-- Hierarchical lines representing chart structure -->
                      <g stroke="#FFD700" stroke-width="2" filter="url(#chartGlow)" opacity="0.8">
                        <!-- Horizontal lines -->
                        <line x1="50" y1="70" x2="150" y2="70">
                          <animate attributeName="opacity" values="0.8;0.4;0.8"
                                   dur="2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="50" y1="100" x2="150" y2="100">
                          <animate attributeName="opacity" values="0.8;0.4;0.8"
                                   dur="2s" begin="0.2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="50" y1="130" x2="150" y2="130">
                          <animate attributeName="opacity" values="0.8;0.4;0.8"
                                   dur="2s" begin="0.4s" repeatCount="indefinite"/>
                        </line>

                        <!-- Vertical lines suggesting hierarchy -->
                        <line x1="60" y1="70" x2="60" y2="130">
                          <animate attributeName="opacity" values="0.8;0.4;0.8"
                                   dur="2.5s" repeatCount="indefinite"/>
                        </line>
                        <line x1="90" y1="70" x2="90" y2="130">
                          <animate attributeName="opacity" values="0.8;0.4;0.8"
                                   dur="2.5s" begin="0.3s" repeatCount="indefinite"/>
                        </line>
                        <line x1="120" y1="70" x2="120" y2="130">
                          <animate attributeName="opacity" values="0.8;0.4;0.8"
                                   dur="2.5s" begin="0.6s" repeatCount="indefinite"/>
                        </line>
                      </g>

                      <!-- Mystical runes at key intersections -->
                      <g fill="#FFD700" font-size="12" filter="url(#chartGlow)">
                        <text x="60" y="65" text-anchor="middle">ᚠ</text>
                        <text x="90" y="65" text-anchor="middle">ᚱ</text>
                        <text x="120" y="65" text-anchor="middle">ᚻ</text>

                        <text x="60" y="95" text-anchor="middle">ᛈ</text>
                        <text x="90" y="95" text-anchor="middle">ᛉ</text>
                        <text x="120" y="95" text-anchor="middle">ᛊ</text>

                        <text x="60" y="125" text-anchor="middle">ᛗ</text>
                        <text x="90" y="125" text-anchor="middle">ᛝ</text>
                        <text x="120" y="125" text-anchor="middle">ᛟ</text>
                      </g>

                      <!-- Rotating outer border -->
                      <rect x="35" y="35" width="130" height="130" rx="15"
                            fill="none" stroke="#FFD700" stroke-width="1"
                            opacity="0.4" filter="url(#chartGlow)">
                        <animateTransform attributeName="transform"
                                          type="rotate"
                                          from="0 100 100"
                                          to="360 100 100"
                                          dur="20s"
                                          repeatCount="indefinite"/>
                      </rect>
                    </g>

                    <!-- Stylized title text -->
                    <text x="100" y="220"
                          text-anchor="middle"
                          fill="url(#chartGold)"
                          font-family="Copperplate Gothic, Luminari, Fantasy"
                          font-size="16"
                          letter-spacing="1"
                          filter="url(#textGlow)">
                      <tspan style="font-size: 22px">{{text}}</tspan>
                    </text>
                  </svg>

    `,

})
export class ChartAccountSVG{

  @Input() text: string='';
  @Input() routerLink: string='/portal/chart-of-accounts';


}
