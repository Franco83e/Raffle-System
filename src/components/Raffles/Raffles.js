import React, { useState } from "react";
import BannerBG from "../../images/background.png";
import image1 from "../../images/1.png";
import "./Raffles.css";

function Raffles() {
  const [value, setValue] = useState(1);
  const [raffleStatus, setRaffleStatus] = useState();

  const onChangeHandler = (e) => {
    if (e.target.id === "increment") setValue(value + 1);
    else if (e.target.id === "decrement" && value > 1) setValue(value - 1);
  };

  return (
    <div className="live-bg" id="Section1">
      <img src={BannerBG} alt="" style={{ objectFit: "cover" }} />
      <div className="live-bg-a">
        <div className="live-bg-b">
          <div className="live-bg-c">
            <div className="container">
              <div className="row">
                (
                <div className="raffle-card-main">
                  <div>
                    <img className="raffle-image" src={image1} alt="" />
                  </div>
                  <div
                    className={`raffle-status ${
                      raffleStatus?.isStarted ? "active" : "not-active"
                    }`}
                  >
                    {raffleStatus?.isStarted ? "ACTIVE" : "NOT ACTIVE"}
                  </div>
                  <div className="raffle-card-detail">
                    <h3 className="raffle-card-heading">
                      $INCOME Raffle Entry
                    </h3>
                    <p className="raffle-card-description">
                      Enter this raffle with $INCOME for the current giveaway
                      presented by SolRealty.
                    </p>
                    <div className="raffle-cards-buttons">
                      <div className="mb-3 mt-3">
                        <button
                          className="btn btn-light me-1"
                          type="button"
                          onClick={() => setValue(1)}
                        >
                          1 $GEMS
                        </button>
                        <button
                          className="btn btn-light me-1"
                          type="button"
                          onClick={() => setValue(10)}
                        >
                          10 $GEMS
                        </button>
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={() => setValue(100)}
                        >
                          100 $GEMS
                        </button>
                      </div>
                      <button
                        id="decrement"
                        className="btn btn-danger raffle-btn-minus"
                        type="button"
                        onClick={(e) => onChangeHandler(e)}
                      >
                        -
                      </button>
                      <input
                        className="raffle-quantity-input"
                        type="number"
                        min="0"
                        value={value}
                        onChange={() => {}}
                      />
                      <button
                        id="increment"
                        className="btn btn-success raffle-btn-plus me-2"
                        type="button"
                        onClick={(e) => onChangeHandler(e)}
                      >
                        +
                      </button>
                    </div>
                    <div className="raffle-btn-enter-main">
                      <button
                        className="btn btn-primary raffle-btn-enter"
                        type="button"
                      >
                        Enter
                      </button>
                    </div>
                    <div className="raffle-card-status">
                      <p className="mb-1">
                        Tokens Burned :&nbsp;{" "}
                        <b style={{ color: "#d94526" }}>
                          {Number(
                            raffleStatus?.totalStaked || 0
                          ).toLocaleString("en-US")}
                        </b>{" "}
                        $GEMS
                      </p>
                      <p className="mb-1">
                        Your Entries :&nbsp;{" "}
                        <b style={{ color: "#d94526" }}>
                          {Number(raffleStatus?.userStaked || 0).toLocaleString(
                            "en-US"
                          )}
                        </b>{" "}
                        $GEMS
                      </p>
                      <a
                        className="btn-discord mb-1"
                        href="https://discord.com/invite/solrealty"
                        rel="noreferrer"
                        target="_blank"
                        title="Join Our Discord"
                      >
                        <span>Full details in our Discord</span>
                      </a>
                    </div>
                  </div>
                </div>
                )
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Raffles;
