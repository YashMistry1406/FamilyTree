import {
    ReactFlow,
    Background,
    Controls,
    ControlButton,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    useViewport
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCallback, useState, useEffect } from 'react';
import MenuContext from './MenuContext';
import CustomNode from './CustomNode';
import axios from 'axios';
import NewUser from './NewUser';
import EdgeConnect from './EdgeConnect';

const initialNodes = [
];

const nodeType = {
    customNode: CustomNode
}
const initialEdges = [];

function App() {


    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [contextMenu, setContextMenu] = useState(null);
    const [nodecontextMenu, setNodeContextMenu] = useState(null);
    const [createUserForm, setCreateUserForm] = useState(false);
    const [pendingConnection, setPendingConnection] = useState(null); // to store temporary edge
    const [showRelationModal, setShowRelationModal] = useState(false);


    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []
    )

    const onEdgeChange = useCallback(
        (changes) => setEdges((edgs) => applyEdgeChanges(changes, edgs)), []
    )

    const onConnect = (e) => {
        setPendingConnection(e)
        setShowRelationModal(true)
    }


    function randomNumber() { return Math.floor(Math.random() * 100) + 1; }

    useEffect(() => {
        const close = () => setContextMenu(null) || setNodeContextMenu(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/allusers');

                console.log(`in APP.jsx initial load`, response)

                const newNode = response.data.map(item => ({
                    id: item.from.ID,
                    type: 'customNode',
                    position: { x: item.from.pos_x, y: item.from.pos_y },
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
                        target: itr.relationship.targetId.ID,
                        relType: itr.relationship.type
                    }));
                setEdges((prevEdges) => {
                    const existingIds = new Set(prevEdges.map(e => e.id));
                    const dedupedEdges = newEdges.filter(e => !existingIds.has(e.id));
                    return [...prevEdges, ...dedupedEdges];
                });


                setNodes(uniqueNodes)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [])

    const onNodeDragStop = (e, node) => {

        //console.log(e)
        setNodes((nds) =>
            nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
        )


        const fetchData = async () => {
            try {

                const response = await axios.post('http://localhost:8080/updatepos',
                    {
                        id: node.id,
                        pos_x: node.position.x,
                        pos_y: node.position.y
                    })
            }
            catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }


    const createUser = async (name) => {

        const x = window.innerWidth / 2
        const y = window.innerHeight / 2
        const response = await axios.post('http://localhost:8080/create',
            {
                name: name,
                pos_x: x,
                pos_y: y
            })
        console.log(response)
        const newNode =
            ({
                id: response.data.id,
                type: 'customNode',
                position: { x: x, y: y },
                data: { name: response.data.name }
            })

        setNodes((prev) => [...prev, newNode])
        setCreateUserForm(false)
    }


    const onEdgeContextMenu = (event, edge) => {
        event.preventDefault();
        console.log(edge)
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            edgeId: edge.id,
            sourceID: edge.source,
            targetID: edge.target,
            relType: edge.relType
        });
    };

    const handleEdgeRightClick = (action) => {
        if (action === 'Delete') {
            const deleteEdge = async () => {
                console.log("in handleEdgeRightClick", contextMenu)
                const response = await axios.delete('http://localhost:8080/deledge', {
                    params: {
                        sourceID: contextMenu.sourceID,
                        targetID: contextMenu.targetID,
                        relType: contextMenu.relType,
                    },

                })
                console.log(response)
            }
            deleteEdge()
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
    const onNodeContextMenu = (event, node) => {
        event.preventDefault();
        setNodeContextMenu({
            x: event.clientX,
            y: event.clientY,
            nodeID: node.id,
        });
    }

    const handleNodeRightClick = (action) => {
        if (action === 'Delete') {
            const deleteNode = async () => {
                console.log(nodecontextMenu.nodeID)
                const response = await axios.delete(`http://localhost:8080/deleteid/${nodecontextMenu.nodeID}`)
                console.log(response)
            }
            deleteNode()
            setNodes((eds) => eds.filter((e) => e.id !== nodecontextMenu.nodeID));
        }
        else if (action === 'Edit') {
            console.log(nodes)
        }
        else {
            console.log(`${action} on node ${nodecontextMenu.nodeID}`);
        }
        setContextMenu(null);
    };

    const afterConnected = useCallback(
        (params) => {
            // `params` contains { source, sourceHandle, target, targetHandle }
            setEdges((eds) => addEdge(params, eds));
        },
        []
    );

    const onRelationSelect = async (relationType) => {
        try {
            const { source, target } = pendingConnection
            const repsonse = await axios.post('http://localhost:8080/createrelation', null, {
                params: {
                    sourceID: source,
                    targetID: target,
                    relation: relationType,
                }
            })

            const newEdge = {
                id: `e${source}-${target}-${relationType}`,
                source,
                target,
                relType: relationType, // Save this for future use like edit/delete
            };

            setEdges((eds) => addEdge(newEdge, eds));

        } catch (error) {
            console.error("Failed to create relationship in DB:", error.response?.data || error.message);
            alert("Failed to create relationship. Please try again.");
        } finally {
            // 3. Close modal in all cases
            setShowRelationModal(false);
            setPendingConnection(null); // Clean up
        }
    }


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
                    onEdgeContextMenu={onEdgeContextMenu}
                    onNodeDragStop={onNodeDragStop}
                    onNodeContextMenu={onNodeContextMenu}
                    onConnect={onConnect}

                >
                    <Background color='#000000' />
                    <Controls orientation="horizontal">
                        <ControlButton onClick={() => {
                            setCreateUserForm(true)
                        }} title="Add User">
                            <img
                                src="src/assets/icons8-add-user-50.png"
                                alt="Add User"
                                style={{ width: 20, height: 20 }}
                            />
                        </ControlButton>

                    </Controls>
                </ReactFlow>

                {showRelationModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)', // optional: slight backdrop
                            zIndex: 9999, // must be higher than ReactFlow canvas
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <EdgeConnect
                            onRelationSelect={onRelationSelect}
                            onClose={() => setShowRelationModal(false)}

                        />
                    </div>
                )}

                        {createUserForm && (
                            <NewUser onSubmit={createUser}
                                onCancel={() => setCreateUserForm(false)} />
                        )}


                        {nodecontextMenu && (
                            <MenuContext
                                x={nodecontextMenu.x}
                                y={nodecontextMenu.y}
                                onOptionClick={handleNodeRightClick}
                            />
                        )}
                        {contextMenu && (
                            <MenuContext
                                x={contextMenu.x}
                                y={contextMenu.y}
                                onOptionClick={handleEdgeRightClick}
                            />
                        )}
                    </div>
        </>
            )

}

            export default App;

