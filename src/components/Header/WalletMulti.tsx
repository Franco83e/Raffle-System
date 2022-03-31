import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletModalButton } from "@solana/wallet-adapter-react-ui";
import { ButtonProps } from "@solana/wallet-adapter-react-ui/lib/Button";
import { FC, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import WalletLogo from "../../images/wallet-icon.png";
import { shortenAddress } from '../../utils/string';

export const SpecialWalletMultiButton: FC<ButtonProps> = ({ children, ...props }) => {
  const { publicKey, wallet, disconnect, connect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLUListElement>(null);
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (children) return children;
    if (!wallet || !base58) return null;
    return base58.slice(0, 4) + '..' + base58.slice(-4);
  }, [children, wallet, base58]);

  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);

  const openDropdown = useCallback(() => {
    setActive(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setActive(false);
  }, []);

  const openModal = useCallback(() => {
    setVisible(true);
    closeDropdown();
  }, [closeDropdown]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;

      // Do nothing if clicking dropdown or its descendants
      if (!node || node.contains(event.target as Node)) return;

      closeDropdown();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, closeDropdown]);

  if (!wallet) return (
    <div className="wallet" style={{ cursor: "pointer" }} onClick={() => setVisible(true)} >
      <a
        style={{ color: "white" }}
        title="Connect Wallet"
      >
        <img src={WalletLogo} alt="" />
        <span>Connect Wallet </span>
      </a>
    </div>
  );

  if (!base58) return (<SpecialWalletConnectButton />)

  return (
    <div className="wallet-adapter-dropdown" style={{ cursor: "pointer" }}>
      <div className="wallet" onClick={() => openDropdown()} >
        <a
          style={{ color: "white" }}
          title="Connect Wallet"
        >
          <img src={WalletLogo} alt="" />
          <span>{shortenAddress(base58) || ""}</span>
        </a>
      </div>
      <ul
        aria-label="dropdown-list"
        className={`wallet-adapter-dropdown-list ${active && 'wallet-adapter-dropdown-list-active'}`}
        ref={ref}
        role="menu"
      >
        <li onClick={copyAddress} className="wallet-adapter-dropdown-list-item" role="menuitem">
          {copied ? 'Copied' : 'Copy address'}
        </li>
        <li onClick={openModal} className="wallet-adapter-dropdown-list-item" role="menuitem">
          Change wallet
        </li>
        <li onClick={disconnect} className="wallet-adapter-dropdown-list-item" role="menuitem">
          Disconnect
        </li>
      </ul>
    </div>
  );
};




const WalletConnectButton: FC<ButtonProps> = ({ children, disabled, onClick, ...props }) => {
  const { wallet, connect, connecting, connected } = useWallet();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (onClick) onClick(event);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!event.defaultPrevented) connect().catch(() => { });
    },
    [onClick, connect]
  );

  const content = useMemo(() => {
    if (children) return children;
    if (connecting) return 'Connecting ...';
    if (connected) return 'Connected';
    if (wallet) return 'Connect';
    return 'Connect Wallet';
  }, [children, connecting, connected, wallet]);

  return (

    <button className="wallet" disabled={disabled || !wallet || connecting || connected}
      onClick={handleClick} {...props}>
      <a
        style={{ color: "white" }}
        title="Connect Wallet"
      >
        <img src={WalletLogo} alt="" />
        <span>Connect Wallet </span>
      </a>

    </button>
  );
};



const SpecialWalletConnectButton: FC<ButtonProps> = ({ children, disabled, onClick, ...props }) => {
  const { wallet, connect, connecting, connected } = useWallet();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (onClick) onClick(event);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!event.defaultPrevented) connect().catch(() => { });
    },
    [onClick, connect]
  );

  const content = useMemo(() => {
    if (children) return children;
    if (connecting) return (
      <div className="wallet" >
        <a
          style={{ color: "white" }}
          title="Connect Wallet"
        >
          <img src={WalletLogo} alt="" />
          <span>Connecting </span>
        </a>

      </div>
    );

    if (connected) return (
      <div className="wallet" >
        <a
          style={{ color: "white" }}
          title="Connect Wallet"
        >
          <img src={WalletLogo} alt="" />
          <span>Connected </span>
        </a>
      </div>
    );

    if (wallet) return (
      <div className="wallet" >
        <a
          style={{ color: "white" }}
          title="Connect Wallet"

        >
          <img src={WalletLogo} alt="" />
          <span>Connect</span>
        </a>
      </div>
    );

    return (
      <div className="wallet" >
        <a
          style={{ color: "white" }}
          title="Connect Wallet"
        >
          <img src={WalletLogo} alt="" />
          <span>Connect Wallet </span>
        </a>
      </div>
    );
  }, [children, connecting, connected, wallet]);

  return (
    <button
      style={{ backgroundColor: "transparent", cursor: "pointer" }}
      disabled={disabled || !wallet || connecting || connected}

      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
};