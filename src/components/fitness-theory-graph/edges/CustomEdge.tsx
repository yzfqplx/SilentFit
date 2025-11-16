import React, { useMemo } from 'react';
import { getBezierPath, BaseEdge } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import type { CustomEdgeData } from '../../../types/fitnessTheory';

const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeColor = useMemo(() => {
    switch (data?.type) {
      case 'supports':
        return '#22C55E'; // Green
      case 'enables':
        return '#0EA5E9'; // Sky Blue
      case 'influences':
        return '#EAB308'; // Yellow
      case 'requires':
        return '#EF4444'; // Red
      case 'uses':
        return '#8B5CF6'; // Violet
      case 'is_a':
        return '#EC4899'; // Pink
      case 'includes':
        return '#F97316'; // Orange
      case 'leads_to':
      case 'achieves':
        return '#10B981'; // Emerald
      case 'based_on':
        return '#6B7280'; // Gray
      case 'defines':
        return '#6366F1'; // Indigo
      default:
        return '#B3B3B3'; // Default Gray
    }
  }, [data?.type]);

  const edgeStrokeDasharray = useMemo(() => {
    switch (data?.type) {
      case 'influences':
      case 'requires':
      case 'based_on':
        return '5 5'; // Dashed line
      default:
        return undefined; // Solid line
    }
  }, [data?.type]);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: edgeColor, strokeDasharray: edgeStrokeDasharray }} />
      <text
        x={labelX}
        y={labelY}
        className="nodrag nopan"
        style={{
          fontSize: '10px',
          fontWeight: 'bold',
          fill: edgeColor,
          paintOrder: 'stroke',
          stroke: '#fff',
          strokeWidth: 3,
          strokeLinejoin: 'round',
        }}
      >
        {data?.label}
      </text>
    </>
  );
};

export default CustomEdge;