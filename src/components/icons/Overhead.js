import * as React from "react";
const SvgOverhead = (props) => (
  <svg
    width={90}
    height={90}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <g clipPath="url(#overhead_svg__a)">
      <path
        d="M56.598 27.407c-.57 0-1 .428-1 .999s.43 1 1 1h5.068v4.781H27.62v-4.782h5.067c.571 0 1-.428 1-.999 0-.57-.429-1-1-1h-7.137v52.245c0 .571.429 1 1 1 .57 0 .999-.429.999-1V42.538h34.044V79.65c0 .571.428 1 1 1 .57 0 .998-.429.998-1V27.407h-6.994ZM27.621 41.538v-6.28h34.044v6.28H27.622Z"
        fill="#000"
      />
      <path
        d="M55.313 14.845H48.39L35.83 27.407h6.851l12.633-12.562ZM48.105 14.845h-6.638L28.834 27.407h6.71l12.56-12.562ZM62.308 14.845h-6.71L42.967 27.407h6.709l12.633-12.562ZM7.708 27.407h6.78l12.633-12.562H20.27L7.708 27.407ZM34.044 14.845h-6.637L14.774 27.407h6.709l12.561-12.562ZM41.181 14.845h-6.78L21.768 27.407h6.78l12.634-12.562ZM69.445 14.845h-6.852L49.96 27.407h6.852l12.633-12.562ZM19.984 14.845h-7.351c-3.426 3.64-6.21 7.923-8.208 12.562h2.998l12.561-12.562ZM78.295 27.407h7.28c-.714-1.642-1.57-3.283-2.427-4.782l-4.853 4.782ZM83.005 22.41c-.856-1.355-1.712-2.711-2.712-3.996L71.3 27.407h6.71l4.995-4.996ZM76.44 14.845h-6.71L57.099 27.407h6.709l12.632-12.562ZM80.222 18.271c-.928-1.213-1.856-2.355-2.855-3.426h-.642L64.092 27.407h6.923l9.207-9.136Z"
        fill="#B2B2B2"
      />
      <path
        d="M44.964 90C20.127 90 0 69.802 0 45.036S20.198 0 44.964 0C69.802 0 89.93 20.198 89.93 44.964S69.802 90 44.964 90Zm0-88.501C20.984 1.499 1.5 20.983 1.5 44.964S20.983 88.43 44.964 88.43 88.43 68.945 88.43 44.964C88.43 20.984 68.945 1.5 44.964 1.5Z"
        fill="#000"
      />
    </g>
    <defs>
      <clipPath id="overhead_svg__a">
        <path fill="#fff" d="M0 0h90v90H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgOverhead;