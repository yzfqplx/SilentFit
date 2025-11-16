import { useState, useCallback, useMemo } from 'react';
import { useNodesState, useEdgesState, addEdge, Node, Edge, Connection } from 'reactflow';
import { initialNodes, initialEdges } from '../data/fitnessTheoryGraphData';
import { TheoryNodeData } from '../types/fitnessTheory';

export const useFitnessTheoryGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      color: node.type === 'theory' ? '#DBEAFE' : // Light Blue for theory
             node.type === 'concept' ? '#D1FAE5' : // Light Green for concept
             node.type === 'principle' ? '#EDE9FE' : // Light Purple for principle
             node.type === 'parameter' ? '#FEF9C3' : // Light Yellow for parameter
             node.type === 'goal' ? '#FEE2E2' : // Light Red for goal
             '#FFFFFF' // Default white
    }
  })));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [activeNodeTypes, setActiveNodeTypes] = useState<string[]>(['theory', 'concept', 'principle']);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
  }, [selectedNodeId]);

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesFilterText = node.data.label.toLowerCase().includes(filterText.toLowerCase()) ||
                                (node.data.description && node.data.description.toLowerCase().includes(filterText.toLowerCase())) ||
                                (node.data.tags && node.data.tags.some(tag => tag.toLowerCase().includes(filterText.toLowerCase())));
      const matchesNodeType = activeNodeTypes.includes(node.type || 'default');
      return matchesFilterText && matchesNodeType;
    }).map(node => ({
      ...node,
      data: {
        ...node.data,
        isHighlighted: selectedNodeId === node.id ||
                       edges.some(edge => (edge.source === node.id && edge.target === selectedNodeId) ||
                                           (edge.target === node.id && edge.source === selectedNodeId))
      }
    }));
  }, [nodes, edges, selectedNodeId, filterText, activeNodeTypes]);

  const filteredEdges = useMemo(() => {
    const visibleNodeIds = filteredNodes.map(node => node.id);
    return edges.filter(edge => visibleNodeIds.includes(edge.source) && visibleNodeIds.includes(edge.target));
  }, [edges, filteredNodes]);

  const toggleNodeType = (type: string) => {
    setActiveNodeTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    filterText,
    setFilterText,
    activeNodeTypes,
    toggleNodeType,
  };
};