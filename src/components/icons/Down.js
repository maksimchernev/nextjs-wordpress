import * as React from "react";
const SvgDown = (props) => (
  <svg
    height={128}
    style={{
      enableBackground: "new 0 0 128 128",
    }}
    width={128}
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      style={{
        fill: "none",
        stroke: "#2f3435",
        strokeWidth: 12,
        strokeLinecap: "square",
        strokeMiterlimit: 10,
      }}
      d="M111 40.5 64 87.499M64 87.499 17 40.5"
    />
  </svg>
);
export default SvgDown;
