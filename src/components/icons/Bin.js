import * as React from "react";
const SvgBin = (props) => (
  <svg
    width={13}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <g clipPath="url(#bin_svg__a)" fill="#3E3D3D">
      <path d="M2.727 14c-.586 0-1.044-.452-1.063-1.05L1.328 2.623H0v-.724h3.736v-.778C3.736.507 4.232 0 4.833 0h3.33c.602 0 1.098.507 1.098 1.12v.78H13v.723h-1.329l-.335 10.33c-.019.598-.477 1.05-1.063 1.05H2.728V14ZM8.553 1.12a.397.397 0 0 0-.39-.396h-3.33c-.212 0-.389.18-.389.397v.778h4.109v-.778Zm2.075 11.814.335-10.311h-8.91l.335 10.311c0 .2.158.342.354.342h7.528c.18 0 .339-.142.358-.342Z" />
      <path d="M6.854 5.191h-.708v5.407h.708V5.191ZM8.98 5.191H8.27v5.407h.708V5.191ZM4.729 5.191H4.02v5.407h.709V5.191Z" />
    </g>
    <defs>
      <clipPath id="bin_svg__a">
        <path fill="#fff" transform="matrix(-1 0 0 1 13 0)" d="M0 0h13v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgBin;
