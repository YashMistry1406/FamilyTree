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

const initialNodes = [
    { id: '1', data: { label: 'Harish' }, position: { x: 0, y: 0 }, type: 'input' },
    { id: '2', data: { label: 'Darsh' }, position: { x: 100, y: 100 } },
];

const initialEdges = [];

function App() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const [contextMenu, setContextMenu] = useState(null); // { x, y, edgeId }

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge(params, eds));
    }, []);

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

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeContextMenu={onEdgeContextMenu}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>


            {contextMenu && (
                <MenuContext
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onOptionClick={handleOptionClick}
                />
            )}
        </div>
    );
}

export default App;

