import React from "react";
import logoImg from "../assets/images/DM LOGO trans.png";

export default function BrandLogo({ className = "" }) {
  return (
    <div className={`brand-logo ${className}`}>
      <img
        src={logoImg}
        alt=""
        decoding="async"
        className="brand-logo-img"
      />
    </div>
  );
}
