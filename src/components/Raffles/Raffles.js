import React, { useEffect, useState, useMemo } from "react";
import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useWallet } from "@solana/wallet-adapter-react";
import Modal from 'react-modal';

import rafflingIdl from '../../idl/raffling.json';

import BannerBG from "../../images/background.png";
import image1 from "../../images/1.png";
import "./Raffles.css";

const programId = new anchor.web3.PublicKey(process.env.REACT_APP_PROGRAM_ID);
const connection = new anchor.web3.Connection(process.env.REACT_APP_SOLANA_RPC_HOST);
const raffleAccount = new anchor.web3.PublicKey(process.env.REACT_APP_RAFFLE_ACCOUNT);
const mintAccount = new anchor.web3.PublicKey(process.env.REACT_APP_MINT_ACCOUNT);

const DECIMAL_PLACE = 1e6

const modalStyles = {
  overlay: {
    backgroundColor: 'rgb(0 0 0 / 75%)',
    zIndex: 100000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    padding: 32,
    textAlign: 'center',
    background: '#2c215d',
    borderRadius: '0.5rem',
  },
};

function Raffles() {
  const wallet = useWallet()
  const [value, setValue] = useState(1);
  const [raffleStatus, setRaffleStatus] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const anchorWallet = useMemo(() => {
    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    };
  }, [wallet]);
  const provider = useMemo(() => new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: 'confirmed',
    commitment: 'confirmed'
  }), [anchorWallet]);
  const program = useMemo(() => new anchor.Program(rafflingIdl, programId, provider), [provider]);

  const onChangeHandler = (e) => {
    if (e.target.id === "increment") {
      setValue(value + 1);
    } else if (e.target.id === "decrement" && value > 1) setValue(value - 1);
  };

  const getRaffleStatus = async () => {
    try {
      const _raffleAccount = await program.account.raffle.fetch(raffleAccount);
      const totalStaked = _raffleAccount.users.reduce((prev, curr) => {
        return prev + (curr.amount.toNumber() / DECIMAL_PLACE)
      }, 0)
      const userStaked = wallet.publicKey ? (_raffleAccount.users
        .filter(e => e.user.equals(wallet.publicKey))
        .reduce((prev, curr) => {
          return prev + (curr.amount.toNumber() / DECIMAL_PLACE)
        }, 0)
      ) : 0
      setRaffleStatus({
        totalStaked,
        userStaked,
        isStarted: _raffleAccount.isStarted
      })
    } catch (err) {
      console.log(err)
    }
  }

  const findAssociatedTokenAddress = async (walletAddress, tokenMintAddress) => {
    return (await anchor.web3.PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
  }

  const enterRaffle = async () => {
    if (raffleStatus?.isStarted && wallet.connected) {
      try {
        const tokenAccount = await findAssociatedTokenAddress(wallet.publicKey, mintAccount)
        await program.rpc.enter(new anchor.BN(value * DECIMAL_PLACE), {
          accounts: {
            user: wallet.publicKey,
            raffleAccount: raffleAccount,
            mint: mintAccount,
            tokenAccount: tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID
          },
        })
        setIsOpen(true);
        setValue(1);
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    getRaffleStatus()
  }, [wallet.publicKey])

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
                    className={`raffle-status ${raffleStatus?.isStarted ? "active" : "not-active"
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
                          1 $INCOME
                        </button>
                        <button
                          className="btn btn-light me-1"
                          type="button"
                          onClick={() => setValue(10)}
                        >
                          10 $INCOME
                        </button>
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={() => setValue(100)}
                        >
                          100 $INCOME
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
                        onChange={() => { }}
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
                        onClick={enterRaffle}
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
                        $INCOME
                      </p>
                      <p className="mb-1">
                        Your Entries :&nbsp;{" "}
                        <b style={{ color: "#d94526" }}>
                          {Number(raffleStatus?.userStaked || 0).toLocaleString(
                            "en-US"
                          )}
                        </b>{" "}
                        $INCOME
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
      <Modal
        isOpen={isOpen}
        style={modalStyles}
      >
        <p className="raffle-text mb-4">
          Success! Your entry is confirmed!
        </p>
        <button
          className="btn btn-primary raffle-btn-enter"
          type="button"
          onClick={() => setIsOpen(false)}
          style={{
            background: "#d94526",
            border: 'none',
            padding: '13px 19px',
            borderRadius: 30,
            fontWeight: 'bold',
            width: 120
          }}
        >
          OK
        </button>
      </Modal>
    </div>
  );
}

export default Raffles;
