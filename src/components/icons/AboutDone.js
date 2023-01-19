import * as React from "react";
const SvgAboutDone = (props) => (
  <svg
    width={50}
    height={50}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <circle cx={25} cy={25} r={25} fill="#3E3D3D" />
    <path
      d="m8 25 12.5 12L38 13"
      stroke="#FFDF38"
      strokeWidth={3}
      strokeLinecap="round"
    />
  </svg>
);
export default SvgAboutDone;
