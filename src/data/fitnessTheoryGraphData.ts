import { Node, Edge } from 'reactflow';
import { TheoryNodeData } from '../types/fitnessTheory';

export const initialNodes: Node<TheoryNodeData>[] = [
  // 主要理论
  { id: 'muscle_hypertrophy', type: 'theory', position: { x: 0, y: 0 }, data: { label: '肌肉肥大', description: '肌纤维的生长和增加横截面积。', tags: ['生理学', '训练'] } },
  { id: 'strength_adaptations', type: 'theory', position: { x: 300, y: 0 }, data: { label: '力量适应', description: '神经肌肉系统效率的提高。', tags: ['生理学', '训练'] } },
  { id: 'endurance_adaptations', type: 'theory', position: { x: 600, y: 0 }, data: { label: '耐力适应', description: '心血管和代谢效率的提高。', tags: ['生理学', '训练'] } },

  // 关键概念
  { id: 'progressive_overload', type: 'concept', position: { x: 0, y: 150 }, data: { label: '渐进超负荷', description: '逐渐增加训练负荷以促进适应。', tags: ['训练原则'] } },
  { id: 'specificity_principle', type: 'concept', position: { x: 300, y: 150 }, data: { label: '特异性原则', description: '训练应与特定目标相匹配。', tags: ['训练原则'] } },
  { id: 'recovery', type: 'concept', position: { x: 600, y: 150 }, data: { label: '恢复', description: '身体修复和适应训练压力的过程。', tags: ['恢复', '生理学'] } },
  { id: 'nutritional_timing', type: 'concept', position: { x: 1000, y: 150 }, data: { label: '营养时机', description: '在特定时间摄入营养以优化表现和恢复。', tags: ['营养'] } },

  // 科学原理
  { id: 'protein_synthesis', type: 'principle', position: { x: 0, y: 300 }, data: { label: '蛋白质合成', description: '训练后肌肉蛋白质合成增加。', tags: ['营养', '生理学'] } },
  { id: 'neuromuscular_efficiency', type: 'principle', position: { x: 300, y: 300 }, data: { label: '神经肌肉效率', description: '神经系统募集和协调肌肉的能力。', tags: ['生理学'] } },
  { id: 'energy_systems', type: 'principle', position: { x: 600, y: 300 }, data: { label: '能量系统', description: '身体产生ATP以支持活动的方式。', tags: ['生理学'] } },
  { id: 'hormonal_response', type: 'principle', position: { x: 900, y: 300 }, data: { label: '荷尔蒙反应', description: '训练对生长激素和睾酮等荷尔蒙的影响。', tags: ['生理学'] } },

  // 训练方法
  { id: 'resistance_training', type: 'concept', position: { x: 0, y: 450 }, data: { label: '阻力训练', description: '使用阻力来增强肌肉力量和尺寸。', tags: ['训练方法'] } },
  { id: 'cardiovascular_training', type: 'concept', position: { x: 300, y: 450 }, data: { label: '心血管训练', description: '提高心肺耐力。', tags: ['训练方法'] } },

  // 力量训练核心概念
  { id: 'strength_training_main', type: 'concept', position: { x: 0, y: 600 }, data: { label: '力量训练', description: '通过抵抗阻力激活和增强肌肉的锻炼方式。', tags: ['核心', '训练'] } },

  // 力量训练类型 (y=750, y=900)
  { id: 'st_type_bodyweight', type: 'concept', position: { x: -200, y: 750 }, data: { label: '自重训练', description: '利用自身体重作为阻力。', tags: ['力量训练', '类型'] } },
  { id: 'st_type_weighted', type: 'concept', position: { x: 100, y: 750 }, data: { label: '负重训练', description: '使用器械、自由重量等提供额外阻力。', tags: ['力量训练', '类型'] } },
  { id: 'st_type_isometric', type: 'concept', position: { x: 400, y: 750 }, data: { label: '等长收缩', description: '肌肉产生张力但长度不发生变化。', tags: ['力量训练', '肌肉收缩'] } },
  { id: 'st_type_isotonic', type: 'concept', position: { x: 700, y: 750 }, data: { label: '等张收缩', description: '肌肉产生张力并改变长度。', tags: ['力量训练', '肌肉收缩'] } },
  { id: 'st_type_concentric', type: 'concept', position: { x: 600, y: 900 }, data: { label: '向心收缩', description: '肌肉缩短并克服阻力。', tags: ['力量训练', '肌肉收缩'] } },
  { id: 'st_type_eccentric', type: 'concept', position: { x: 800, y: 900 }, data: { label: '离心收缩', description: '肌肉拉长并控制阻力。', tags: ['力量训练', '肌肉收缩'] } },

  // 力量训练益处 (y=1050)
  { id: 'st_benefit_muscle_mass', type: 'concept', position: { x: -250, y: 1050 }, data: { label: '增加肌肉量', description: '提高基础代谢率，帮助体重管理。', tags: ['益处'] } },
  { id: 'st_benefit_bone_density', type: 'concept', position: { x: 0, y: 1050 }, data: { label: '增强骨骼密度', description: '降低骨质疏松风险。', tags: ['益处'] } },
  { id: 'st_benefit_fitness_function', type: 'concept', position: { x: 150, y: 1050 }, data: { label: '改善体能与功能', description: '提高日常活动能力，改善平衡和协调性。', tags: ['益处'] } },
  { id: 'st_benefit_disease_control', type: 'concept', position: { x: 450, y: 1050 }, data: { label: '控制慢性疾病', description: '有助于管理关节炎、背痛、糖尿病等。', tags: ['益处'] } },
  { id: 'st_benefit_mental_health', type: 'concept', position: { x: 750, y: 1050 }, data: { label: '提高精神健康', description: '释放内啡肽，改善情绪，有助提高认知能力。', tags: ['益处'] } },

  // 训练原则 (新增部分，与现有原则并列或在下方)
  { id: 'principle_reversibility', type: 'concept', position: { x: 600, y: 450 }, data: { label: '可逆性原则', description: '训练停止后，所获体能改善会逐渐消退。', tags: ['训练原则'] } },
  { id: 'principle_individuality', type: 'concept', position: { x: 900, y: 450 }, data: { label: '个体化原则', description: '训练计划需根据个人情况定制。', tags: ['训练原则'] } },

  // 训练参数 (y=1200)
  { id: 'param_rm', type: 'parameter', position: { x: -200, y: 1200 }, data: { label: 'RM (最大重复次数)', description: '在该重量下能完整做到的最大次数。', tags: ['训练参数'] } },
  { id: 'param_reps', type: 'parameter', position: { x: 0, y: 1200 }, data: { label: '次数 (Reps)', description: '单个动作的重复次数。', tags: ['训练参数'] } },
  { id: 'param_sets', type: 'parameter', position: { x: 200, y: 1200 }, data: { label: '组数 (Sets)', description: '完成一个动作的重复次数集合。', tags: ['训练参数'] } },
  { id: 'param_intensity', type: 'parameter', position: { x: 400, y: 1200 }, data: { label: '强度 (Intensity)', description: '使用的重量，通常以 % of 1RM 表示。', tags: ['训练参数'] } },
  { id: 'param_volume', type: 'parameter', position: { x: 600, y: 1200 }, data: { label: '训练量 (Volume)', description: '总次数 × 组数 × 重量。', tags: ['训练参数'] } },
  { id: 'param_rest_interval', type: 'parameter', position: { x: 800, y: 1200 }, data: { label: '休息时间 (Rest Interval)', description: '组间休息时间，影响训练刺激类型。', tags: ['训练参数'] } },

  // 训练目标及次数范围 (y=1350)
  { id: 'goal_max_strength', type: 'goal', position: { x: 0, y: 1350 }, data: { label: '目标: 最大力量', description: '1-5次，高强度 (85-100% 1RM)，3-6组。', tags: ['训练目标'] } },
  { id: 'goal_hypertrophy', type: 'goal', position: { x: 300, y: 1350 }, data: { label: '目标: 肌肉围度 (增肌)', description: '6-12次，中等强度 (65-85% 1RM)，3-5组。', tags: ['训练目标'] } },
  { id: 'goal_strength_endurance', type: 'goal', position: { x: 600, y: 1350 }, data: { label: '目标: 力量耐力', description: '12+次，低强度 (65% 1RM以下)，2-3组。', tags: ['训练目标'] } },
];

export const initialEdges: Edge[] = [
  // 肌肉肥大
  { id: 'e1', source: 'progressive_overload', target: 'muscle_hypertrophy', type: 'supports', data: { label: '驱动', type: 'supports' }, animated: true },
  { id: 'e2', source: 'protein_synthesis', target: 'muscle_hypertrophy', type: 'supports', data: { label: '基础', type: 'supports' }, animated: true },
  { id: 'e3', source: 'resistance_training', target: 'muscle_hypertrophy', type: 'supports', data: { label: '方法', type: 'supports' } },

  // 力量适应
  { id: 'e4', source: 'progressive_overload', target: 'strength_adaptations', type: 'supports', data: { label: '驱动', type: 'supports' }, animated: true },
  { id: 'e5', source: 'neuromuscular_efficiency', target: 'strength_adaptations', type: 'supports', data: { label: '关键', type: 'supports' }, animated: true },
  { id: 'e6', source: 'resistance_training', target: 'strength_adaptations', type: 'supports', data: { label: '方法', type: 'supports' } },

  // 耐力适应
  { id: 'e7', source: 'specificity_principle', target: 'endurance_adaptations', type: 'supports', data: { label: '指导', type: 'supports' } },
  { id: 'e8', source: 'energy_systems', target: 'endurance_adaptations', type: 'supports', data: { label: '基础', type: 'supports' }, animated: true },
  { id: 'e9', source: 'cardiovascular_training', target: 'endurance_adaptations', type: 'supports', data: { label: '方法', type: 'supports' } },

  // 交叉关联
  { id: 'e10', source: 'recovery', target: 'muscle_hypertrophy', type: 'enables', data: { label: '必需', type: 'enables' }, animated: true },
  { id: 'e11', source: 'recovery', target: 'strength_adaptations', type: 'enables', data: { label: '必需', type: 'enables' }, animated: true },
  { id: 'e12', source: 'recovery', target: 'endurance_adaptations', type: 'enables', data: { label: '必需', type: 'enables' }, animated: true },
  { id: 'e13', source: 'nutritional_timing', target: 'recovery', type: 'influences', data: { label: '优化', type: 'influences' }, animated: true },
  { id: 'e14', source: 'protein_synthesis', target: 'nutritional_timing', type: 'requires', data: { label: '受影响', type: 'requires' }, animated: true },
  { id: 'e15', source: 'hormonal_response', target: 'muscle_hypertrophy', type: 'influences', data: { label: '调节', type: 'influences' }, animated: true },
  { id: 'e16', source: 'hormonal_response', target: 'strength_adaptations', type: 'influences', data: { label: '调节', type: 'influences' }, animated: true },
  { id: 'e17', source: 'resistance_training', target: 'progressive_overload', type: 'uses', data: { label: '应用', type: 'uses' } },

  // 力量训练核心概念与现有训练方法关联
  { id: 'e_resistance_training_to_strength_training_main', source: 'resistance_training', target: 'strength_training_main', type: 'is_a', data: { label: '是', type: 'is_a' }, animated: true },

  // 力量训练类型
  { id: 'e_st_main_to_bodyweight', source: 'strength_training_main', target: 'st_type_bodyweight', type: 'includes', data: { label: '类型', type: 'includes' } },
  { id: 'e_st_main_to_weighted', source: 'strength_training_main', target: 'st_type_weighted', type: 'includes', data: { label: '类型', type: 'includes' } },
  { id: 'e_st_main_to_isometric', source: 'strength_training_main', target: 'st_type_isometric', type: 'includes', data: { label: '类型', type: 'includes' } },
  { id: 'e_st_main_to_isotonic', source: 'strength_training_main', target: 'st_type_isotonic', type: 'includes', data: { label: '类型', type: 'includes' } },
  { id: 'e_isotonic_to_concentric', source: 'st_type_isotonic', target: 'st_type_concentric', type: 'includes', data: { label: '子类型', type: 'includes' } },
  { id: 'e_isotonic_to_eccentric', source: 'st_type_isotonic', target: 'st_type_eccentric', type: 'includes', data: { label: '子类型', type: 'includes' } },

  // 力量训练益处
  { id: 'e_st_main_to_muscle_mass', source: 'strength_training_main', target: 'st_benefit_muscle_mass', type: 'leads_to', data: { label: '益处', type: 'leads_to' } },
  { id: 'e_st_main_to_bone_density', source: 'strength_training_main', target: 'st_benefit_bone_density', type: 'leads_to', data: { label: '益处', type: 'leads_to' } },
  { id: 'e_st_main_to_fitness_function', source: 'strength_training_main', target: 'st_benefit_fitness_function', type: 'leads_to', data: { label: '益处', type: 'leads_to' } },
  { id: 'e_st_main_to_disease_control', source: 'strength_training_main', target: 'st_benefit_disease_control', type: 'leads_to', data: { label: '益处', type: 'leads_to' } },
  { id: 'e_st_main_to_mental_health', source: 'strength_training_main', target: 'st_benefit_mental_health', type: 'leads_to', data: { label: '益处', type: 'leads_to' } },

  // 训练原则关联 (与力量训练主概念的关联)
  { id: 'e_st_main_to_progressive_overload', source: 'strength_training_main', target: 'progressive_overload', type: 'based_on', data: { label: '遵循', type: 'based_on' }, animated: true },
  { id: 'e_st_main_to_specificity_principle', source: 'strength_training_main', target: 'specificity_principle', type: 'based_on', data: { label: '遵循', type: 'based_on' }, animated: true },
  { id: 'e_st_main_to_reversibility_principle', source: 'strength_training_main', target: 'principle_reversibility', type: 'based_on', data: { label: '遵循', type: 'based_on' }, animated: true },
  { id: 'e_st_main_to_recovery_principle', source: 'strength_training_main', target: 'recovery', type: 'based_on', data: { label: '遵循', type: 'based_on' }, animated: true },
  { id: 'e_st_main_to_individuality_principle', source: 'strength_training_main', target: 'principle_individuality', type: 'based_on', data: { label: '遵循', type: 'based_on' }, animated: true },

  // 训练参数关联 (与力量训练主概念的关联)
  { id: 'e_st_main_to_param_rm', source: 'strength_training_main', target: 'param_rm', type: 'uses', data: { label: '参数', type: 'uses' } },
  { id: 'e_st_main_to_param_reps', source: 'strength_training_main', target: 'param_reps', type: 'uses', data: { label: '参数', type: 'uses' } },
  { id: 'e_st_main_to_param_sets', source: 'strength_training_main', target: 'param_sets', type: 'uses', data: { label: '参数', type: 'uses' } },
  { id: 'e_st_main_to_param_intensity', source: 'strength_training_main', target: 'param_intensity', type: 'uses', data: { label: '参数', type: 'uses' } },
  { id: 'e_st_main_to_param_volume', source: 'strength_training_main', target: 'param_volume', type: 'uses', data: { label: '参数', type: 'uses' } },
  { id: 'e_st_main_to_param_rest_interval', source: 'strength_training_main', target: 'param_rest_interval', type: 'uses', data: { label: '参数', type: 'uses' } },

  // 训练目标关联 (链接到参数和适应性)
  { id: 'e_goal_max_strength_to_param_intensity', source: 'goal_max_strength', target: 'param_intensity', type: 'defines', data: { label: '关联', type: 'defines' } },
  { id: 'e_goal_max_strength_to_param_reps', source: 'goal_max_strength', target: 'param_reps', type: 'defines', data: { label: '关联', type: 'defines' } },
  { id: 'e_goal_max_strength_to_strength_adaptations', source: 'goal_max_strength', target: 'strength_adaptations', type: 'achieves', data: { label: '实现', type: 'achieves' } },

  { id: 'e_goal_hypertrophy_to_muscle_hypertrophy', source: 'goal_hypertrophy', target: 'muscle_hypertrophy', type: 'achieves', data: { label: '实现', type: 'achieves' } },
  { id: 'e_goal_hypertrophy_to_param_reps', source: 'goal_hypertrophy', target: 'param_reps', type: 'defines', data: { label: '关联', type: 'defines' } },
  { id: 'e_goal_hypertrophy_to_param_intensity', source: 'goal_hypertrophy', target: 'param_intensity', type: 'defines', data: { label: '关联', type: 'defines' } },

  { id: 'e_goal_strength_endurance_to_endurance_adaptations', source: 'goal_strength_endurance', target: 'endurance_adaptations', type: 'achieves', data: { label: '实现', type: 'achieves' } },
  { id: 'e_goal_strength_endurance_to_param_reps', source: 'goal_strength_endurance', target: 'param_reps', type: 'defines', data: { label: '关联', type: 'defines' } },
  { id: 'e_goal_strength_endurance_to_param_intensity', source: 'goal_strength_endurance', target: 'param_intensity', type: 'defines', data: { label: '关联', type: 'defines' } },
];