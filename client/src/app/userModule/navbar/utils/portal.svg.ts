import { Component } from "@angular/core";


@Component({
  selector: 'portal-svg',
  template: `
    <svg routerLink="portal-dashboard" viewBox="0 0 200 200" style="height: 50px; width: 50px;" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="portalGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur1"/>
              <feGaussianBlur stdDeviation="5" result="blur2"/>
              <feMerge>
                <feMergeNode in="blur1"/>
                <feMergeNode in="blur2"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <linearGradient id="portalGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FFE5A0"/>
              <stop offset="45%" style="stop-color:#FFD700"/>
              <stop offset="75%" style="stop-color:#DAA520"/>
              <stop offset="100%" style="stop-color:#B8860B"/>
            </linearGradient>
          </defs>

          <!-- Background glow -->
          <ellipse cx="100" cy="100" rx="60" ry="80"
            fill="rgba(255,215,0,0.1)"
            filter="url(#portalGlow)"/>

          <!-- Wavy concentric rings -->
          <g filter="url(#portalGlow)">
            <ellipse cx="100" cy="100" rx="50" ry="70" fill="none" stroke="#FFD700" opacity="0.4">
              <animate attributeName="rx" values="50;51;50" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="ry" values="70;71;70" dur="3s" repeatCount="indefinite"/>
            </ellipse>

            <ellipse cx="100" cy="100" rx="47" ry="66" fill="none" stroke="#FFD700" opacity="0.4">
              <animate attributeName="rx" values="47;48;47" dur="3.2s" repeatCount="indefinite"/>
              <animate attributeName="ry" values="66;67;66" dur="3.2s" repeatCount="indefinite"/>
            </ellipse>

            <ellipse cx="100" cy="100" rx="44" ry="62" fill="none" stroke="#FFD700" opacity="0.4">
              <animate attributeName="rx" values="44;45;44" dur="3.4s" repeatCount="indefinite"/>
              <animate attributeName="ry" values="62;63;62" dur="3.4s" repeatCount="indefinite"/>
            </ellipse>

            <ellipse cx="100" cy="100" rx="41" ry="58" fill="none" stroke="#FFD700" opacity="0.4">
              <animate attributeName="rx" values="41;42;41" dur="3.6s" repeatCount="indefinite"/>
              <animate attributeName="ry" values="58;59;58" dur="3.6s" repeatCount="indefinite"/>
            </ellipse>

            <ellipse cx="100" cy="100" rx="38" ry="54" fill="none" stroke="#FFD700" opacity="0.4">
              <animate attributeName="rx" values="38;39;38" dur="3.8s" repeatCount="indefinite"/>
              <animate attributeName="ry" values="54;55;54" dur="3.8s" repeatCount="indefinite"/>
            </ellipse>

            <ellipse cx="100" cy="100" rx="35" ry="50" fill="none" stroke="#FFD700" opacity="0.4">
              <animate attributeName="rx" values="35;36;35" dur="4s" repeatCount="indefinite"/>
              <animate attributeName="ry" values="50;51;50" dur="4s" repeatCount="indefinite"/>
            </ellipse>
          </g>

          <!-- Outer spinning runes -->
          <g filter="url(#portalGlow)">
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur="20s"
                repeatCount="indefinite"/>
              <text x="100" y="20" text-anchor="middle" fill="#FFD700" font-size="12">ω</text>
              <text x="140" y="40" text-anchor="middle" fill="#FFD700" font-size="12">ᚱ</text>
              <text x="160" y="100" text-anchor="middle" fill="#FFD700" font-size="12">ᚲ</text>
              <text x="140" y="160" text-anchor="middle" fill="#FFD700" font-size="12">ᚦ</text>
              <text x="100" y="180" text-anchor="middle" fill="#FFD700" font-size="12">Ψ</text>
              <text x="60" y="160" text-anchor="middle" fill="#FFD700" font-size="12">ᛇ</text>
              <text x="40" y="100" text-anchor="middle" fill="#FFD700" font-size="12">ᛉ</text>
              <text x="60" y="40" text-anchor="middle" fill="#FFD700" font-size="12">ᛊ</text>
            </g>
          </g>

          <!-- Inner spinning runes (opposite direction) -->
          <g filter="url(#portalGlow)">
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 100 100"
                to="0 100 100"
                dur="15s"
                repeatCount="indefinite"/>
              <text x="100" y="40" text-anchor="middle" fill="#FFE5A0" font-size="10">ζ</text>
              <text x="130" y="55" text-anchor="middle" fill="#FFE5A0" font-size="10">ξ</text>
              <text x="145" y="100" text-anchor="middle" fill="#FFE5A0" font-size="10">ᛖ</text>
              <text x="130" y="145" text-anchor="middle" fill="#FFE5A0" font-size="10">Γ</text>
              <text x="100" y="160" text-anchor="middle" fill="#FFE5A0" font-size="10">Δ</text>
              <text x="70" y="145" text-anchor="middle" fill="#FFE5A0" font-size="10">ᛜ</text>
              <text x="55" y="100" text-anchor="middle" fill="#FFE5A0" font-size="10">δ</text>
              <text x="70" y="55" text-anchor="middle" fill="#FFE5A0" font-size="10">ᚺ</text>
            </g>
          </g>

          <!-- Inner portal -->
          <ellipse cx="100" cy="100" rx="25" ry="35"
            fill="url(#portalGold)"
            opacity="0.3"
            filter="url(#portalGlow)">
            <animate attributeName="rx"
              values="25;27;25"
              dur="3s"
              repeatCount="indefinite"/>
            <animate attributeName="ry"
              values="35;37;35"
              dur="3s"
              repeatCount="indefinite"/>
          </ellipse>
        </svg>
    `,
  standalone: true,
  imports: [],
})
export class PortalSVG {

}
