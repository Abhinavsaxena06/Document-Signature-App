import { useState } from "react";

function NameModal({ show, onClose, onSave }) {
    const [text, setText] = useState("");

    if (!show) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.box}>
                <h3>Add Name</h3>

                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter full name"
                    style={styles.input}
                />

                <button
                    onClick={() => {
                        onSave(text);
                        setText("");
                    }}
                >
                    Save
                </button>

                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    box: {
        background: "white",
        padding: 20,
        borderRadius: 10,
        width: 300
    },

    input: {
        width: "100%",
        marginBottom: 10
    }
};

export default NameModal;