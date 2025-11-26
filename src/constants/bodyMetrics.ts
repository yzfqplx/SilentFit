
// BMI 分类数据 
export interface BmiCategory {
  range: string;
  category: string;
}

export const BMI_CATEGORIES: BmiCategory[] = [
  { range: '< 18.5', category: '体重过低' },
  { range: '18.5 - 23.9', category: '体重正常' },
  { range: '24.0 - 27.9', category: '超重' },
  { range: '≥ 28.0', category: '肥胖' },
];

// 肩腰比分类数据
export interface ShoulderWaistRatioCategory {
  range: string;
  visualFeature: string;
  adjectives: string;
}

export const SHOULDER_WAIST_RATIO_CATEGORIES: ShoulderWaistRatioCategory[] = [
  { range: '≈ 1:1 或更小', visualFeature: '肩膀、腰部、臀部宽度接近。', adjectives: '直筒' },
  { range: '≈ 1.1:1 ~ 1.2:1', visualFeature: '稍微有腰部收窄的趋势，但不够明显。', adjectives: '匀称' },
  { range: '≈ 1.2:1 ~ 1.3:1', visualFeature: '初步的收窄，体型开始呈现线条感。', adjectives: '标准' },
  { range: '≈ 1.3:1 ~ 1.4:1', visualFeature: '腰部收窄明显，开始体现出良好的身体线条。', adjectives: '比例良好' },
  { range: '≈ 1.4:1 ~ 1.5:1', visualFeature: '腰部纤细，肩膀突出，体型呈现显著的V型或沙漏型。', adjectives: '宽肩窄腰' },
  { range: '≈ 1.5:1 或更大', visualFeature: '肩宽明显大于腰围，差距悬殊。', adjectives: '倒三角' },
];
