import * as React from "react";
const SvgCross = (props) => (
  <svg
    width={17}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      stroke="#787878"
      strokeLinecap="round"
      d="M16 .707 1.707 15M15.293 15 1 .707"
    />
  </svg>
);
export default SvgCross;
