import React from "react";
import logoImg from "../assets/images/DM LOGO trans.png";

export default function BrandLogo({ className = "" }) {
  return (
    <div className={`brand-logo ${className}`}>
      <img
        src={logoImg}
        alt=""
        width="768"
        height="768"
        decoding="async"
        className="brand-logo-img"
      />
    </div>
  );
}
