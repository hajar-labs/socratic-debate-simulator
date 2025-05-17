const experts = [
  {
    id: 'technologist',
    name: 'Dr. Ada Chen',
    title: 'Technology Ethicist',
    background: 'Former Silicon Valley engineer with a PhD in Computer Science and Philosophy',
    perspectives: ['Innovation-focused', 'Techno-optimist', 'Concerned with practical implementation'],
    areas: ['AI', 'digital rights', 'emerging technologies'],
    avatar: '/experts/ada-chen.jpg',
  },
  {
    id: 'ethicist',
    name: 'Prof. James Wilson',
    title: 'Moral Philosopher',
    background: 'Oxford-educated philosopher specializing in applied ethics',
    perspectives: ['Consequentialist', 'Global-minded', 'Concerned with equitable outcomes'],
    areas: ['ethics', 'justice', 'social impact'],
    avatar: '/experts/james-wilson.jpg',
  },
  {
    id: 'economist',
    name: 'Dr. Maya Rodriguez',
    title: 'Behavioral Economist',
    background: 'Researcher at the intersection of psychology and economic decision-making',
    perspectives: ['Evidence-based', 'Skeptical of pure rationality models', 'Policy-oriented'],
    areas: ['incentives', 'market behavior', 'public policy'],
    avatar: '/experts/maya-rodriguez.jpg',
  },
  {
    id: 'legal',
    name: 'Prof. Kwame Osei',
    title: 'International Law Scholar',
    background: 'Former UN legal advisor and constitutional law expert',
    perspectives: ['Rights-focused', 'Internationalist', 'Proceduralist'],
    areas: ['governance', 'regulations', 'international cooperation'],
    avatar: '/experts/kwame-osei.jpg',
  },
  {
    id: 'historian',
    name: 'Dr. Sarah Goldstein',
    title: 'Technology Historian',
    background: 'Researcher specializing in how societies adapt to technological revolution',
    perspectives: ['Historical patterns', 'Social context', 'Long-term perspective'],
    areas: ['historical precedents', 'societal adaptation', 'cultural impacts'],
    avatar: '/experts/sarah-goldstein.jpg',
  },
  {
    id: 'scientist',
    name: 'Prof. Lucas Kim',
    title: 'Research Scientist',
    background: 'Multidisciplinary researcher in physics and systems science',
    perspectives: ['Empirical', 'Methodical', 'First-principles thinker'],
    areas: ['scientific evidence', 'research methods', 'complex systems'],
    avatar: '/experts/lucas-kim.jpg',
  },
  {
    id: 'activist',
    name: 'Mia Tanaka',
    title: 'Digital Rights Advocate',
    background: 'Grassroots organizer and policy campaigner',
    perspectives: ['Justice-focused', 'Community-oriented', 'Challenging power dynamics'],
    areas: ['civil liberties', 'accessibility', 'public advocacy'],
    avatar: '/experts/mia-tanaka.jpg',
  },
  {
    id: 'entrepreneur',
    name: 'Raj Patel',
    title: 'Tech Entrepreneur',
    background: 'Founded multiple tech startups and venture capital advisor',
    perspectives: ['Innovation-driven', 'Market-focused', 'Risk-tolerant'],
    areas: ['business models', 'market adoption', 'investment'],
    avatar: '/experts/raj-patel.jpg',
  },
];

export const getRelevantExperts = (topic) => {
  // In a real implementation, this would use NLP or a similar technique
  // to determine relevant experts based on the topic
  return experts;
};

export default experts;