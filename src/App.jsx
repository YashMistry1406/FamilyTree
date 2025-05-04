import {
  ReactFlow,
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCallback, useState, useEffect } from 'react';
import MenuContext from './MenuContext';
import CustomNode from './CustomNode';

const nodeType  = {
        customNode : CustomNode
    }
const initialNodes = [
  {
    id: 'node-1',
    type: 'customNode',
    position: { x: 0, y: 0 },
    data: { value: 123 },
  },
  {
    id: 'node-2',
    type: 'customNode',
    position: { x: 100, y: 100 },
    data: { value: 321},
  }
];

const initialEdges = [];

function App() {
    
    const[nodes , setNodes] = useState(initialNodes);
    const[edges, setEdges] = useState(initialEdges);
    const [contextMenu, setContextMenu] = useState(null); // { x, y, edgeId }

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes,nds)),[]
    )

    const onEdgeChange = useCallback(
        (changes) => setEdges((edgs) => applyEdgeChanges(changes,edgs)),[]
    )

    const onConnect = useCallback(
        (conn) => setEdges((edgs)=> addEdge(conn,edgs)),[]
    )


    const onEdgeContextMenu = (event, edge) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            edgeId: edge.id,
        });
    };
    const handleOptionClick = (action) => {
        if (action === 'Delete') {
            setEdges((eds) => eds.filter((e) => e.id !== contextMenu.edgeId));
        } else {
            console.log(`${action} on edge ${contextMenu.edgeId}`);
        }
        setContextMenu(null);
    };

    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    return(
        <>
    <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
        nodes = {nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgeChange}
        nodeTypes={nodeType}
        onConnect={onConnect}
        onContextMenu={onEdgeContextMenu}
        >
        <Background/>
        <Controls/>
        </ReactFlow>

            {contextMenu && (
                <MenuContext
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onOptionClick={handleOptionClick}
                />
            )}
    </div>
        </>
    )
    
}

export default App;

