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
}

export default App;

