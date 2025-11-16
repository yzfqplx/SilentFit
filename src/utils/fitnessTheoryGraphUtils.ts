import TheoryNode from '../components/fitness-theory-graph/nodes/TheoryNode';
import ConceptNode from '../components/fitness-theory-graph/nodes/ConceptNode';
import PrincipleNode from '../components/fitness-theory-graph/nodes/PrincipleNode';
import ParameterNode from '../components/fitness-theory-graph/nodes/ParameterNode';
import GoalNode from '../components/fitness-theory-graph/nodes/GoalNode';
import CustomEdge from '../components/fitness-theory-graph/edges/CustomEdge';

export const nodeTypes = {
  theory: TheoryNode,
  concept: ConceptNode,
  principle: PrincipleNode,
  parameter: ParameterNode,
  goal: GoalNode,
};

export const edgeTypes = {
  supports: CustomEdge,
  enables: CustomEdge,
  influences: CustomEdge,
  requires: CustomEdge,
  uses: CustomEdge,
  is_a: CustomEdge,
  includes: CustomEdge,
  leads_to: CustomEdge,
  based_on: CustomEdge,
  defines: CustomEdge,
};