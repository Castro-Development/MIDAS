import { Component, EventEmitter, Input, Output } from "@angular/core";


@Component({
    selector: 'journal-entry-svg',
    template: `
    <!-- Header Section -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240">
      <defs>
        <linearGradient id="ledgerGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFE5A0"/>
          <stop offset="45%" style="stop-color:#FFD700"/>
          <stop offset="75%" style="stop-color:#DAA520"/>
          <stop offset="100%" style="stop-color:#B8860B"/>
        </linearGradient>

        <filter id="ledgerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur1"/>
          <feGaussianBlur stdDeviation="5" result="blur2"/>
          <feMerge>
            <feMergeNode in="blur1"/>
            <feMergeNode in="blur2"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Multiple paths for dense rune flows -->
        <path id="runePath1" d="M40,65 Q100,60 160,65" />
        <path id="runePath2" d="M40,95 Q100,90 160,95" />
        <path id="runePath3" d="M40,125 Q100,120 160,125" />
        <path id="runePathMid1" d="M40,80 Q100,75 160,80" />
        <path id="runePathMid2" d="M40,110 Q100,105 160,110" />

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
        <!-- Background frame -->
        <rect x="35" y="40" width="130" height="120" rx="5"
              fill="none" stroke="url(#ledgerGold)" stroke-width="3"
              filter="url(#ledgerGlow)"/>

        <!-- Strong ledger lines - just three main lines -->
        <g stroke="url(#ledgerGold)" stroke-width="4" filter="url(#ledgerGlow)">
          <line x1="40" y1="65" x2="160" y2="65"/>
          <line x1="40" y1="95" x2="160" y2="95"/>
          <line x1="40" y1="125" x2="160" y2="125"/>
        </g>

        <!-- Dense flowing runes -->
        <g fill="#FFD700" filter="url(#ledgerGlow)" opacity="0.8">
          <!-- First line runes - multiple streams -->
          <text font-size="14">
            <textPath href="#runePath1" startOffset="0%">
              ᚠᚢᚦᚨᚱᚲᚺᚾᛁᛄᛇᛈᛊᛏᛒᛖᛗᛚ
              <animate attributeName="startOffset"
                        values="-60%;140%"
                        dur="12s"
                        repeatCount="indefinite"/>
            </textPath>
          </text>
          <text font-size="14">
            <textPath href="#runePath1" startOffset="50%">
              ᛊᛏᛒᛖᛗᛚᚠᚢᚦᚨᚱᚲᚺᚾᛁᛄᛇᛈ
              <animate attributeName="startOffset"
                        values="140%;-60%"
                        dur="8s"
                        repeatCount="indefinite"/>
            </textPath>
          </text>

          <!-- Middle streams -->
          <text font-size="14">
            <textPath href="#runePathMid1" startOffset="30%">
              ᚻᚾᛁᛃᛇᛈᛊᛏᛒᛖᛗᛚᚠᚢᚦᚨᚱᚲ
              <animate attributeName="startOffset"
                        values="-80%;120%"
                        dur="10s"
                        repeatCount="indefinite"/>
            </textPath>
          </text>
          <text font-size="14">
            <textPath href="#runePathMid2" startOffset="70%">
              ᛖᛗᛚᚠᚢᚦᚨᚱᚲᚺᚾᛁᛃᛇᛈᛊᛏᛒ
              <animate attributeName="startOffset"
                        values="120%;-80%"
                        dur="9s"
                        repeatCount="indefinite"/>
            </textPath>
          </text>

          <!-- Second line runes -->
          <text font-size="14">
            <textPath href="#runePath2" startOffset="20%">
              ᚻᚾᛁᛃᛇᛈᛊᛏᛒᛖᛗᛚᚠᚢᚦᚨᚱᚲ
              <animate attributeName="startOffset"
                        values="90%;-110%"
                        dur="11s"
                        repeatCount="indefinite"/>
            </textPath>
          </text>
          <text font-size="14">
            <textPath href="#runePath2" startOffset="80%">
              ᛈᛊᛏᛒᛖᛗᛚᚠᚢᚦᚨᚱᚲᚺᚾᛁᛃᛇ
              <animate attributeName="startOffset"
                        values="-110%;90%"
                        dur="7s"
                        repeatCount="indefinite"/>
            </textPath>
          </text>

          <!-- Third line runes -->
          <text font-size="14">
            <textPath href="#runePath3" startOffset="-30%">
              ᛊᛏᛒᛖᛗᛚᚠᚢᚦᚨᚱᚲᚺᚾᛁᛃᛇᛈ
              <animate attributeName="startOffset"
                        values="-30%;170%"
                        dur="13s"
                        repeatCount="indefinite"/>
            </textPath>
          </text>
          <text font-size="14">
            <textPath href="#runePath3" startOffset="40%">
              ᚱᚲᚺᚾᛁᛃᛇᛈᛊᛏᛒᛖᛗᛚᚠᚢᚦᚨ
              <animate attributeName="startOffset"
                        values="170%;-30%"
                        dur="9s"
                        repeatCount="indefinite"/>
            </textPath>
          </text>
        </g>
      </g>

      <!-- Title -->
      <text x="100" y="220"
            text-anchor="middle"
            fill="url(#ledgerGold)"
            font-family="Copperplate Gothic, Luminari, Fantasy"
            font-size="16"
            letter-spacing="1"
            filter="url(#textGlow)">
        <tspan style="font-size: 18px">{{text}}</tspan>
      </text>
    </svg>
    `,

})
export class JournalEntrySVG{

  @Input() text: string='';
}
