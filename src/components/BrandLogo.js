import React from "react";
import logoImg from "../assets/images/header-dm-logo.png";

export default function BrandLogo({ className = "" }) {
  return (
    <div className={`brand-logo ${className}`}>
      <img
        src={logoImg}
        alt=""
        width="64"
        height="64"
        decoding="async"
        className="brand-logo-img"
      />
    </div>
  );
}
