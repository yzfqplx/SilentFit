export interface TheoryNodeData {
  label: string;
  description?: string;
  tags?: string[];
  color?: string;
}

export interface TheoryNode {
  id: string;
  type: 'theory' | 'concept' | 'principle' | string;
  data: TheoryNodeData;
  position: { x: number; y: number };
}

export interface CustomEdgeData {
  label?: string;
  type?: 'supports' | 'contradicts' | 'related_to' | 'enables' | 'influences' | 'requires' | 'uses' | 'is_a' | 'includes' | 'leads_to' | 'based_on' | 'defines' | string;
}