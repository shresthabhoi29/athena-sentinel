export const mockAnalytics = {
  retention: 78,
  studyStreak: 24,
  focusTime: 187,
  weakTopics: 3,
  energyPrediction: 'Peak at 8PM',
};

export const mockBriefInsights = [
  {
    id: 1,
    icon: '📈',
    title: 'Peak Performance Window',
    description: 'You perform best between 8PM and 11PM. Your accuracy is 23% higher during this window.',
  },
  {
    id: 2,
    icon: '⏱️',
    title: 'Forgetting Curve Alert',
    description: 'Organic Chemistry is predicted to be forgotten within 2 days. Schedule a review session.',
  },
  {
    id: 3,
    icon: '🎯',
    title: 'High Impact Revision',
    description: "Today's highest impact revision is Electrostatics. Master this to improve overall score by 12%.",
  },
];

export const mockMemoryCards = [
  {
    id: 1,
    title: 'Weak Topics',
    value: 3,
    icon: '⚠️',
    progress: 35,
    description: 'Topics below 50% mastery',
    color: 'from-red-500/20 to-red-500/5',
  },
  {
    id: 2,
    title: 'Strong Topics',
    value: 12,
    icon: '✨',
    progress: 88,
    description: 'Topics above 80% mastery',
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    id: 3,
    title: 'Preferred Study Duration',
    value: 45,
    icon: '⏲️',
    progress: 72,
    description: 'Minutes per session',
    color: 'from-blue-500/20 to-blue-500/5',
  },
  {
    id: 4,
    title: 'Average Focus',
    value: 34,
    icon: '🧠',
    progress: 68,
    description: 'Minutes per task',
    color: 'from-purple-500/20 to-purple-500/5',
  },
  {
    id: 5,
    title: 'Learning Style',
    value: 'Visual',
    icon: '👁️',
    progress: 85,
    description: 'Optimal content format',
    color: 'from-amber-500/20 to-amber-500/5',
  },
  {
    id: 6,
    title: 'Mistake Pattern',
    value: 'Conceptual',
    icon: '🔍',
    progress: 62,
    description: 'Primary error type',
    color: 'from-pink-500/20 to-pink-500/5',
  },
];

export const mockTimelineEvents = [
  {
    id: 1,
    type: 'started',
    title: 'Started Calculus',
    timestamp: '2 days ago',
    icon: '📚',
    color: 'from-blue-500/20 to-blue-500/5',
  },
  {
    id: 2,
    type: 'completed',
    title: 'Completed 50 Questions',
    subtitle: 'Physics - Electrostatics',
    timestamp: '1 day ago',
    icon: '✅',
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    id: 3,
    type: 'recovery',
    title: 'Recovered Forgotten Topic',
    subtitle: 'Organic Chemistry - Reactions',
    timestamp: '18 hours ago',
    icon: '🔄',
    color: 'from-purple-500/20 to-purple-500/5',
  },
  {
    id: 4,
    type: 'test',
    title: 'Finished Mock Test',
    subtitle: 'Chemistry - Full Syllabus | Score: 87%',
    timestamp: '12 hours ago',
    icon: '🎯',
    color: 'from-amber-500/20 to-amber-500/5',
  },
  {
    id: 5,
    type: 'mastered',
    title: 'Mastered Limits',
    subtitle: 'Calculus - First Principles',
    timestamp: '6 hours ago',
    icon: '👑',
    color: 'from-pink-500/20 to-pink-500/5',
  },
  {
    id: 6,
    type: 'weakness',
    title: 'AI Detected Weakness',
    subtitle: 'Integration by Parts - Need 3 more practice sets',
    timestamp: '2 hours ago',
    icon: '⚡',
    color: 'from-red-500/20 to-red-500/5',
  },
];

export const mockHeatmapData = [
  {
    subject: 'Physics',
    chapters: [
      { name: 'Mechanics', confidence: 85, color: 'bg-green-600' },
      { name: 'Waves', confidence: 72, color: 'bg-yellow-500' },
      { name: 'Optics', confidence: 45, color: 'bg-orange-500' },
      { name: 'Electrostatics', confidence: 92, color: 'bg-green-700' },
      { name: 'Magnetism', confidence: 58, color: 'bg-orange-400' },
    ],
  },
  {
    subject: 'Chemistry',
    chapters: [
      { name: 'Organic', confidence: 35, color: 'bg-red-600' },
      { name: 'Inorganic', confidence: 78, color: 'bg-green-600' },
      { name: 'Physical', confidence: 88, color: 'bg-green-700' },
      { name: 'Biochemistry', confidence: 42, color: 'bg-orange-500' },
      { name: 'Kinetics', confidence: 65, color: 'bg-yellow-500' },
    ],
  },
  {
    subject: 'Math',
    chapters: [
      { name: 'Algebra', confidence: 91, color: 'bg-green-700' },
      { name: 'Calculus', confidence: 82, color: 'bg-green-600' },
      { name: 'Geometry', confidence: 76, color: 'bg-green-600' },
      { name: 'Trigonometry', confidence: 68, color: 'bg-yellow-500' },
      { name: 'Statistics', confidence: 72, color: 'bg-yellow-500' },
    ],
  },
];

export const mockForgetCurveData = [
  { day: 'Day 0', retention: 100 },
  { day: 'Day 1', retention: 45 },
  { day: 'Day 3', retention: 32 },
  { day: 'Day 7', retention: 28 },
  { day: 'Day 14', retention: 25 },
  { day: 'Day 30', retention: 22 },
];

export const mockRecommendations = [
  {
    id: 1,
    title: 'Master Integration by Parts',
    subject: 'Calculus',
    priority: 'High',
    estimatedTime: '45 mins',
    expectedImprovement: '+12%',
    difficulty: 'Hard',
    icon: '🎯',
  },
  {
    id: 2,
    title: 'Organic Chemistry Review',
    subject: 'Chemistry',
    priority: 'Critical',
    estimatedTime: '120 mins',
    expectedImprovement: '+18%',
    difficulty: 'Hard',
    icon: '⚠️',
  },
  {
    id: 3,
    title: 'Refresh Optics Concepts',
    subject: 'Physics',
    priority: 'Medium',
    estimatedTime: '60 mins',
    expectedImprovement: '+8%',
    difficulty: 'Medium',
    icon: '🔄',
  },
  {
    id: 4,
    title: 'Practice Trigonometry',
    subject: 'Math',
    priority: 'Low',
    estimatedTime: '30 mins',
    expectedImprovement: '+5%',
    difficulty: 'Easy',
    icon: '✨',
  },
];

export const mockSpotifyInsights = [
  {
    id: 1,
    text: 'You solve Mathematics 41% faster after 8PM.',
    icon: '⚡',
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 2,
    text: 'You forget Organic Chemistry after 4 days.',
    icon: '⏰',
    color: 'from-red-600 to-red-400',
  },
  {
    id: 3,
    text: 'You answer Physics faster after revision.',
    icon: '🚀',
    color: 'from-green-600 to-green-400',
  },
  {
    id: 4,
    text: 'You spend 32% more time on difficult questions.',
    icon: '🧠',
    color: 'from-purple-600 to-purple-400',
  },
];

export const privacyFeatures = [
  { id: 1, feature: 'Local Memory', icon: '💾' },
  { id: 2, feature: 'Encrypted', icon: '🔒' },
  { id: 3, feature: 'AI Personalization', icon: '🤖' },
  { id: 4, feature: 'No Data Selling', icon: '🚫' },
  { id: 5, feature: 'Privacy First', icon: '🛡️' },
];
