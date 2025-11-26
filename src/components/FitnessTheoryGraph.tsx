import React from 'react';
import ReactFlow, { MiniMap, Controls, Background, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFitnessTheoryGraph } from '../hooks/useFitnessTheoryGraph';
import { nodeTypes, edgeTypes } from '../utils/fitnessTheoryGraphUtils';

const FitnessTheoryGraph: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    filterText,
    setFilterText,
    activeNodeTypes,
    toggleNodeType,
  } = useFitnessTheoryGraph();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{ padding: '10px', borderBottom: '1px solid #eee' }}
        onWheel={(e) => e.stopPropagation()}
      >
        <Input
          type="text"
          placeholder="Filter nodes..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', gap: '5px' }}>
          {['theory', 'concept', 'principle'].map(type => (
            <Button
              key={type}
              variant={activeNodeTypes.includes(type) ? 'default' : 'outline'}
              onClick={() => toggleNodeType(type)}
            >
              {type === 'theory' ? '理论' : type === 'concept' ? '概念' : '原理'}
            </Button>
          ))}
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          fitView
        >
          <MiniMap
            style={{ bottom: 80, width: 120, height: 80 }}
            nodeStrokeWidth={3}
          />
          <Controls position="top-right" />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FitnessTheoryGraph;