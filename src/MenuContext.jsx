import React from 'react';
import { ContextMenu } from './styles/styles';

const MenuContext = ({ x, y, onOptionClick }) => {
  return (
    <ContextMenu style={{ position: 'absolute', top: y, left: x, zIndex: 1000 }}>
      <ul>
        <li onClick={() => onOptionClick('Edit')}>Edit</li>
        <li onClick={() => onOptionClick('Copy')}>Copy</li>
        <li onClick={() => onOptionClick('Delete')}>Delete</li>
      </ul>
    </ContextMenu>
  );
};

export default MenuContext;

