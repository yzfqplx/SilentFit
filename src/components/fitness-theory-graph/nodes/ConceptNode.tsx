import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { TheoryNodeData } from '../../../types/fitnessTheory';

const ConceptNode: React.FC<NodeProps<TheoryNodeData>> = ({ data }) => {
  return (
    <div className="p-2 border border-gray-300 rounded-md bg-green-100 shadow-md">
      <Handle type="target" position={Position.Top} />
      <div className="font-bold text-green-800">{data.label}</div>
      <div className="text-sm text-gray-600">{data.description}</div>
      {data.tags && <div className="text-xs text-gray-500 mt-1">{data.tags.join(', ')}</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ConceptNode;