import { useState, useEffect } from "react";
import { loadPin, savePin, hashPin, removePin } from "../utils/storage";
import "./PINLock.css";

function PINLock({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [error, setError] = useState("");
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    const savedPin = loadPin();
    if (savedPin) {
      setHasPin(true);
      setIsLocked(true);
    }
  }, []);

  const handleSetPin = () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    savePin(hashPin(pin));
    setHasPin(true);
    setIsLocked(true);
    setIsSettingPin(false);
    setPin("");
    setConfirmPin("");
    setError("");
  };

  const handleUnlock = () => {
    const savedPin = loadPin();
    if (hashPin(pin) === savedPin) {
      setIsLocked(false);
      setPin("");
      setError("");
      if (onUnlock) onUnlock();
    } else {
      setError("Incorrect PIN");
    }
  };

  const handleRemovePin = () => {
    removePin();
    setHasPin(false);
    setIsLocked(false);
    setPin("");
    setConfirmPin("");
    setError("");
  };

  if (isLocked) {
    return (
      <div className="pin-lock-overlay">
        <div className="pin-lock-content">
          <h2>🔒 Timeline Locked</h2>
          <p>Enter your PIN to access your timeline</p>
          <div className="pin-input-container">
            <input
              type="password"
              maxLength={6}
              className="pin-input"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              autoFocus
            />
          </div>
          {error && <p className="pin-error">{error}</p>}
          <button className="pin-btn" onClick={handleUnlock}>
            Unlock
          </button>
        </div>
      </div>
    );
  }

  if (isSettingPin) {
    return (
      <div className="pin-lock-overlay">
        <div className="pin-lock-content">
          <h2>🔐 Set PIN</h2>
          <p>Create a PIN to protect your timeline</p>
          <div className="pin-input-container">
            <input
              type="password"
              maxLength={6}
              className="pin-input"
              placeholder="Enter PIN (4-6 digits)"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
            />
            <input
              type="password"
              maxLength={6}
              className="pin-input"
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
            />
          </div>
          {error && <p className="pin-error">{error}</p>}
          <div className="pin-actions">
            <button
              className="pin-btn secondary"
              onClick={() => setIsSettingPin(false)}
            >
              Cancel
            </button>
            <button className="pin-btn" onClick={handleSetPin}>
              Set PIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pin-setup">
      {hasPin ? (
        <button className="pin-setup-btn" onClick={handleRemovePin}>
          🔒 Remove PIN Lock
        </button>
      ) : (
        <button className="pin-setup-btn" onClick={() => setIsSettingPin(true)}>
          🔐 Set PIN Lock
        </button>
      )}
    </div>
  );
}

export default PINLock;
