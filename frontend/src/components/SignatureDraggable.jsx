import { Rnd } from "react-rnd";

function SignatureDraggable({ signature, setSignatures, onClick, onDelete }) {

    return (
        <Rnd
            bounds="parent"
            size={{ width: signature.width, height: signature.height }}
            position={{ x: signature.x, y: signature.y }}

            onDragStop={(e, d) => {
                setSignatures(prev =>
                    prev.map(s =>
                        s.id === signature.id ? { ...s, x: d.x, y: d.y } : s
                    )
                );
            }}

            onResizeStop={(e, dir, ref, delta, pos) => {
                setSignatures(prev =>
                    prev.map(s =>
                        s.id === signature.id
                            ? {
                                ...s,
                                width: ref.offsetWidth,
                                height: ref.offsetHeight,
                                x: pos.x,
                                y: pos.y
                            }
                            : s
                    )
                );
            }}
        >
            <div
                onClick={onClick}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    border: "2px dashed red",
                    background: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                {/* DELETE BUTTON */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        cursor: "pointer"
                    }}
                >
                    ×
                </button>

                {/* CONTENT */}
                {signature.image ? (
                    <img src={signature.image} style={{ width: "100%", height: "100%" }} />
                ) : (
                    <span style={{ fontFamily: signature.font }}>
                        {signature.text}
                    </span>
                )}

            </div>
        </Rnd>
    );
}

export default SignatureDraggable;