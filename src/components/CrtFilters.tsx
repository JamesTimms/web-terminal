export const CrtFilters = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }}>
    <defs>
      <filter id="chromatic-aberration-subtle">
        {/* Red channel - slight offset left */}
        <feOffset in="SourceGraphic" dx="-1" dy="0" result="red-offset" />
        <feColorMatrix
          in="red-offset"
          type="matrix"
          values="1 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 1 0"
          result="red-channel"
        />

        {/* Blue channel - slight offset right */}
        <feOffset in="SourceGraphic" dx="1" dy="0" result="blue-offset" />
        <feColorMatrix
          in="blue-offset"
          type="matrix"
          values="0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 1 0 0 
                    0 0 0 1 0"
          result="blue-channel"
        />

        {/* Green channel - no offset */}
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0 
                    0 1 0 0 0 
                    0 0 0 0 0 
                    0 0 0 1 0"
          result="green-channel"
        />

        {/* Blend all channels */}
        <feBlend
          mode="screen"
          in="red-channel"
          in2="green-channel"
          result="red-green"
        />
        <feBlend
          mode="screen"
          in="red-green"
          in2="blue-channel"
          result="output"
        />
      </filter>

      <filter id="chromatic-aberration-strong">
        <feOffset in="SourceGraphic" dx="-2" dy="0" result="red-offset" />
        <feColorMatrix
          in="red-offset"
          type="matrix"
          values="1 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 1 0"
          result="red-channel"
        />

        <feOffset in="SourceGraphic" dx="2" dy="0" result="blue-offset" />
        <feColorMatrix
          in="blue-offset"
          type="matrix"
          values="0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 1 0 0 
                    0 0 0 1 0"
          result="blue-channel"
        />

        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0 
                    0 1 0 0 0 
                    0 0 0 0 0 
                    0 0 0 1 0"
          result="green-channel"
        />

        <feBlend
          mode="screen"
          in="red-channel"
          in2="green-channel"
          result="red-green"
        />
        <feBlend
          mode="screen"
          in="red-green"
          in2="blue-channel"
          result="output"
        />
      </filter>

      <filter id="chromatic-aberration-extreme">
        <feOffset in="SourceGraphic" dx="-3" dy="0" result="red-offset" />
        <feColorMatrix
          in="red-offset"
          type="matrix"
          values="1 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 1 0"
          result="red-channel"
        />

        <feOffset in="SourceGraphic" dx="3" dy="0" result="blue-offset" />
        <feColorMatrix
          in="blue-offset"
          type="matrix"
          values="0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 1 0 0 
                    0 0 0 1 0"
          result="blue-channel"
        />

        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0 
                    0 1 0 0 0 
                    0 0 0 0 0 
                    0 0 0 1 0"
          result="green-channel"
        />

        <feBlend
          mode="screen"
          in="red-channel"
          in2="green-channel"
          result="red-green"
        />
        <feBlend
          mode="screen"
          in="red-green"
          in2="blue-channel"
          result="output"
        />
      </filter>
    </defs>
  </svg>
);
