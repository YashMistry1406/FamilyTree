import { Handle, Position } from "@xyflow/react";
import { useCallback } from "react";
const handleStyle = { left: 10 };

function CustomNode({ id, type, data, relation, isConnectable }) {
    //const onChange = useCallback((evt) => {
    //  console.log(evt.target.value);
    //}, []);
    return (
        <div className="profile-card">
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <img className="profile-pic" src="/src/assets/yash_recent.jpg" alt="Profile" />
            <h2>{data.name}</h2>
            <p>Bio</p>
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
            />

        </div>
    );
}


export default CustomNode;
