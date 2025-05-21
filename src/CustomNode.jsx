import { Handle, Position } from "@xyflow/react";
import { useCallback, useState } from "react";
const handleStyle = { left: 10 };

function CustomNode({ id, type, data, relation, isConnectable }) {
    //const onChange = useCallback((evt) => {
    //  console.log(evt.target.value);
    //}, []);
    //console.log("in customNode" ,id)
    return (
        <div
            className="profile-card"
            style={{ position: "relative" }}
        >
            <Handle
                type="target"
                id={`${id}_Top`}
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <img className="profile-pic" src="/src/assets/yash_recent.jpg" alt="Profile" />
            <h2>{data.name}</h2>
            <p>Bio</p>
            <Handle
                type="source"
                id={`${id}_Bottom`}
                position={Position.Bottom}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                id={`${id}_Right`}
                position={Position.Right}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                id={`${id}_Left`}
                position={Position.Left}
                isConnectable={isConnectable}
            />
        </div>
    );
}


export default CustomNode;
