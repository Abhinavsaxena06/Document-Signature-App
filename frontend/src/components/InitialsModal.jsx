import { useState } from "react";

function InitialsModal({ show, onClose, onSave }) {

    const [text, setText] = useState("");

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">

                <h3>Create Initials</h3>

                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter initials"
                />

                <button onClick={() => {
                    if (!text) return;
                    onSave(text);
                }}>
                    Save
                </button>

                <button onClick={onClose}>Close</button>

            </div>
        </div>
    );
}

export default InitialsModal;