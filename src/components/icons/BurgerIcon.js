import * as React from "react";
const SvgBurgerIcon = (props) => (
  <svg
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path d="M4 6.75h16a.75.75 0 0 0 0-1.5H4a.75.75 0 0 0 0 1.5ZM4 12.75h16a.75.75 0 0 0 0-1.5H4a.75.75 0 0 0 0 1.5ZM4 18.75h16a.75.75 0 0 0 0-1.5H4a.75.75 0 0 0 0 1.5Z" />
  </svg>
);
export default SvgBurgerIcon;
