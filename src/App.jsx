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
import axios from 'axios';

const initialNodes = [
];

const nodeType = {
    customNode: CustomNode
}
const initialEdges = [];

function App() {


    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [contextMenu, setContextMenu] = useState(null); // { x, y, edgeId }

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []
    )

    const onEdgeChange = useCallback(
        (changes) => setEdges((edgs) => applyEdgeChanges(changes, edgs)), []
    )

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

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
        }
        else if (action === 'Edit') {
            console.log(nodes)
        }
        else {
            console.log(`${action} on edge ${contextMenu.edgeId}`);
        }
        setContextMenu(null);
    };

    function randomNumber() { return Math.floor(Math.random() * 100) + 1; }

    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/allusers');


                //response.data.forEach(itr=> {
                //    console.log(itr.relationship.sourceId)
                //})
                console.log(response)

                const newNode = response.data.map(item => ({
                    id: item.from.ID,
                    type: 'customNode',
                    position: { x: randomNumber(), y: randomNumber() },
                    data: { name: item.from.name }
                }))

                const uniqueNodes = [
                    ...nodes,
                    ...newNode.filter(
                        (newNode) => !nodes.some((existingNode) => existingNode.id === newNode.id)
                    )
                ];


                const newEdges = response.data
                    .filter(itr => itr.relationship !== undefined)
                    .map(itr => ({
                        id: `e${itr.relationship.sourceId.ID}-${itr.relationship.targetId.ID}`,
                        source: itr.relationship.sourceId.ID,
                        target: itr.relationship.targetId.ID
                    }));
                setEdges((prevEdges) => {
                    const existingIds = new Set(prevEdges.map(e => e.id));
                    const dedupedEdges = newEdges.filter(e => !existingIds.has(e.id));
                    return [...prevEdges, ...dedupedEdges];
                });

                //
                //setEdges((prevEdges) => [
                //    ...prevEdges,
                //    ...newEdges
                //]);
                setNodes(uniqueNodes)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [])

    return (
        <>
            <div style={{
                width: '100vw',
                height: '100vh',
            }}>
                <ReactFlow
                    style={{ backgroundColor: '#D3D3D3' }}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgeChange}
                    nodeTypes={nodeType}
                    onConnect={onConnect}
                    onEdgeContextMenu={onEdgeContextMenu}
                >
                    <Background color='#000000' />
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
        </>
    )

}

export default App;

