import { Handle, Position } from "@xyflow/react";
const handleStyle = { left: 10 };

function CustomNode() {

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div>
                <label htmlFor="text">Text:</label>
                <input id="text" name="text" />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
        </>
    )

}

export default CustomNode;
