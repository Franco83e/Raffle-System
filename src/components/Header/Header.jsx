import React from "react";
import Logo from "../../images/logo1.png";
import WalletLogo from "../../images/wallet-icon.png";
import "../../css/responsive.css";

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <a href="/" className="logo">
              <img src={Logo} alt="Logo" />
            </a>

            <div className="right-btn">
              <button className="wallet">
                <a style={{ color: "white" }} title="Connect Wallet">
                  <img src={WalletLogo} alt="" />
                  <span>Connect Wallet </span>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
