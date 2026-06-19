import { Rnd } from "react-rnd";

function SignatureDraggable({
    signature,
    setSignatures,
    scale = 1 // 🔥 IMPORTANT for PDF zoom mismatch (default 1)
}) {
    if (!signature) return null;

    return (
        <Rnd
            bounds="parent"
            enableUserSelectHack={false}

            size={{
                width: signature.width || 180,
                height: signature.height || 60
            }}

            position={{
                x: signature.x || 100,
                y: signature.y || 100
            }}

            onDragStop={(e, d) => {
                setSignatures(prev =>
                    prev.map(s =>
                        s.id === signature.id
                            ? {
                                ...s,
                                x: d.x,
                                y: d.y
                            }
                            : s
                    )
                );
            }}

            onResizeStop={(e, direction, ref, delta, position) => {
                setSignatures(prev =>
                    prev.map(s =>
                        s.id === signature.id
                            ? {
                                ...s,
                                width: ref.offsetWidth,
                                height: ref.offsetHeight,
                                x: position.x,
                                y: position.y
                            }
                            : s
                    )
                );
            }}

            dragGrid={[1, 1]}
            resizeGrid={[1, 1]}
        >
            <div
                className="drag-handle"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "2px dashed red",
                    background: "rgba(255,255,255,0.95)",
                    cursor: "move",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                }}
            >
                {/* SIGNATURE TEXT */}
                {signature.type === "typed" ? (
                    <span
                        style={{
                            fontFamily: signature.font || "cursive",
                            color: signature.color || "#000",
                            fontSize: `${32 * scale}px`, // 🔥 scale-safe rendering
                            pointerEvents: "none",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {signature.text}
                    </span>
                ) : (
                    /* IMAGE SIGNATURE */
                    <img
                        src={signature.image}
                        alt="signature"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            pointerEvents: "none"
                        }}
                    />
                )}
            </div>
        </Rnd>
    );
}

export default SignatureDraggable;