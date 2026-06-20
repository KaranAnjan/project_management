const members = [
  { id: 'm1', name: 'Alice Chen', avatar: 'AC', color: '#6366f1' },
  { id: 'm2', name: 'Bob Martinez', avatar: 'BM', color: '#f59e0b' },
  { id: 'm3', name: 'Carol Smith', avatar: 'CS', color: '#10b981' },
  { id: 'm4', name: 'David Kim', avatar: 'DK', color: '#ef4444' },
  { id: 'm5', name: 'Eve Johnson', avatar: 'EJ', color: '#8b5cf6' },
  { id: 'm6', name: 'Frank Lee', avatar: 'FL', color: '#ec4899' },
  { id: 'm7', name: 'Grace Wang', avatar: 'GW', color: '#06b6d4' },
  { id: 'm8', name: 'Henry Davis', avatar: 'HD', color: '#84cc16' },
]

export const departments = [
  { id: 'dept_software', name: 'Software', icon: '\u{1F4BB}', color: '#6366f1' },
  { id: 'dept_media', name: 'Media', icon: '\u{1F3AC}', color: '#ec4899' },
  { id: 'dept_operation', name: 'Operation', icon: '\u2699\uFE0F', color: '#f59e0b' },
  { id: 'dept_mdo', name: 'MDO', icon: '\u{1F4CA}', color: '#10b981' },
  { id: 'dept_other', name: 'Other', icon: '📎', color: '#8b5cf6' },
]

const now = Date.now()
const day = 86400000

export const initialProjects = [
  {
    id: 'p1', title: 'Vivre Platform Redesign',
    description: 'Complete redesign of the Vivre e-commerce platform with modern UI/UX principles, improved performance, and mobile responsiveness.',
    status: 'active', priority: 'high', category: 'Frontend', departmentId: 'dept_software',
    progress: 65,
    startDate: new Date(now - 45 * day).toISOString(),
    dueDate: new Date(now + 30 * day).toISOString(),
    members: ['m1', 'm2', 'm3'], createdBy: 'm1', createdAt: new Date(now - 45 * day).toISOString(),
  },
  {
    id: 'p2', title: 'Mobile App Development',
    description: 'Cross-platform mobile application using React Native for iOS and Android with offline-first capabilities.',
    status: 'active', priority: 'critical', category: 'Mobile', departmentId: 'dept_software',
    progress: 35,
    startDate: new Date(now - 30 * day).toISOString(),
    dueDate: new Date(now + 60 * day).toISOString(),
    members: ['m2', 'm4', 'm5'], createdBy: 'm2', createdAt: new Date(now - 30 * day).toISOString(),
  },
  {
    id: 'p3', title: 'Data Pipeline Migration',
    description: 'Migrate legacy ETL pipelines to Apache Airflow with improved monitoring, error handling, and documentation.',
    status: 'on_hold', priority: 'medium', category: 'Backend', departmentId: 'dept_operation',
    progress: 50,
    startDate: new Date(now - 60 * day).toISOString(),
    dueDate: new Date(now + 45 * day).toISOString(),
    members: ['m3', 'm6'], createdBy: 'm3', createdAt: new Date(now - 60 * day).toISOString(),
  },
  {
    id: 'p4', title: 'Customer Portal',
    description: 'Self-service customer portal with order tracking, return management, and live chat support integration.',
    status: 'completed', priority: 'high', category: 'Fullstack', departmentId: 'dept_software',
    progress: 100,
    startDate: new Date(now - 90 * day).toISOString(),
    dueDate: new Date(now - 5 * day).toISOString(),
    members: ['m1', 'm3', 'm5'], createdBy: 'm1', createdAt: new Date(now - 90 * day).toISOString(),
  },
  {
    id: 'p5', title: 'AI Chatbot Integration',
    description: 'Integrate GPT-based conversational AI for customer support automation with sentiment analysis and escalation handling.',
    status: 'planning', priority: 'low', category: 'AI/ML', departmentId: 'dept_software',
    progress: 10,
    startDate: new Date(now + 5 * day).toISOString(),
    dueDate: new Date(now + 90 * day).toISOString(),
    members: ['m4', 'm6'], createdBy: 'm4', createdAt: new Date(now - 10 * day).toISOString(),
  },
  {
    id: 'p6', title: 'Social Media Campaign Q3',
    description: 'Plan and execute Q3 social media campaign across Instagram, TikTok, and LinkedIn with influencer partnerships and paid ads.',
    status: 'active', priority: 'high', category: 'Social', departmentId: 'dept_media',
    progress: 40,
    startDate: new Date(now - 20 * day).toISOString(),
    dueDate: new Date(now + 40 * day).toISOString(),
    members: ['m5', 'm7'], createdBy: 'm5', createdAt: new Date(now - 20 * day).toISOString(),
  },
  {
    id: 'p7', title: 'Brand Video Production',
    description: 'Produce brand story video and product showcase reels for website, YouTube, and social channels.',
    status: 'active', priority: 'medium', category: 'Production', departmentId: 'dept_media',
    progress: 25,
    startDate: new Date(now - 15 * day).toISOString(),
    dueDate: new Date(now + 50 * day).toISOString(),
    members: ['m7', 'm8'], createdBy: 'm7', createdAt: new Date(now - 15 * day).toISOString(),
  },
  {
    id: 'p8', title: 'Warehouse Optimization',
    description: 'Optimize warehouse layout and inventory management system to reduce picking time by 30%.',
    status: 'active', priority: 'high', category: 'Logistics', departmentId: 'dept_operation',
    progress: 55,
    startDate: new Date(now - 35 * day).toISOString(),
    dueDate: new Date(now + 25 * day).toISOString(),
    members: ['m3', 'm6', 'm8'], createdBy: 'm3', createdAt: new Date(now - 35 * day).toISOString(),
  },
  {
    id: 'p9', title: 'Market Analysis Q3',
    description: 'Comprehensive market analysis covering industry trends, competitor landscape, and customer insights for strategic planning.',
    status: 'planning', priority: 'medium', category: 'Research', departmentId: 'dept_mdo',
    progress: 15,
    startDate: new Date(now + 2 * day).toISOString(),
    dueDate: new Date(now + 45 * day).toISOString(),
    members: ['m1', 'm5'], createdBy: 'm1', createdAt: new Date(now - 5 * day).toISOString(),
  },
  {
    id: 'p10', title: 'Competitor Intelligence Report',
    description: 'Deep-dive competitive analysis on top 5 competitors including pricing, features, and market positioning.',
    status: 'completed', priority: 'low', category: 'Research', departmentId: 'dept_mdo',
    progress: 100,
    startDate: new Date(now - 60 * day).toISOString(),
    dueDate: new Date(now - 10 * day).toISOString(),
    members: ['m5', 'm8'], createdBy: 'm5', createdAt: new Date(now - 60 * day).toISOString(),
  },
]

const subStatuses = ['todo', 'in_progress', 'review', 'done']

function makeSubtasks(taskId, count, doneCount) {
  const labels = ['Research & gather requirements', 'Draft initial version', 'Review with stakeholders', 'Incorporate feedback', 'Finalize & deliver',
    'Set up environment', 'Implement core logic', 'Write unit tests', 'Code review', 'Deploy to staging',
    'Create wireframes', 'Design mockups', 'Prototype interaction', 'Usability testing', 'Handoff to dev',
    'Data collection', 'Analysis', 'Report generation', 'Presentation prep', 'Presentation delivery']
  const taskNum = parseInt(taskId.replace('t', ''))
  const taskAge = 60 - taskNum * 2
  const subs = []
  const assignees = ['m1','m2','m3','m4','m5','m6','m7','m8']
  const priorities = ['low', 'medium', 'high']
  for (let i = 0; i < count; i++) {
    const subDue = now + (taskAge - i * 5) * day
    const st = i < doneCount ? 'done' : i < doneCount + 1 ? 'review' : i < doneCount + 2 ? 'in_progress' : 'todo'
    subs.push({
      id: `${taskId}_sub_${i + 1}`,
      title: labels[(taskId.charCodeAt(taskId.length - 1) + i) % labels.length],
      status: st,
      priority: priorities[(taskId.charCodeAt(taskId.length - 1) + i) % priorities.length],
      dueDate: new Date(subDue).toISOString(),
      assignee: assignees[(taskId.charCodeAt(taskId.length - 1) + i) % assignees.length],
    })
  }
  return subs
}

export const initialTasks = [
  // Project 1 - Vivre Platform Redesign
  { id: 't1', projectId: 'p1', title: 'Design new component library', description: 'Create a reusable component library in Figma with design tokens for colors, typography, and spacing.', status: 'done', priority: 'high', assignee: 'm1', createdAt: new Date(now - 40 * day).toISOString(), dueDate: new Date(now - 20 * day).toISOString(), subtasks: makeSubtasks('t1', 5, 5) },
  { id: 't2', projectId: 'p1', title: 'Implement responsive navigation', description: 'Build a mobile-first navigation system with hamburger menu, mega-menu for desktop, and search integration.', status: 'in_progress', priority: 'high', assignee: 'm2', createdAt: new Date(now - 35 * day).toISOString(), dueDate: new Date(now + 5 * day).toISOString(), subtasks: makeSubtasks('t2', 4, 2) },
  { id: 't3', projectId: 'p1', title: 'Product listing page', description: 'Build the PLP with filters, sorting, pagination, and quick-view modal for products.', status: 'in_progress', priority: 'critical', assignee: 'm3', createdAt: new Date(now - 30 * day).toISOString(), dueDate: new Date(now + 10 * day).toISOString(), subtasks: makeSubtasks('t3', 5, 3) },
  { id: 't4', projectId: 'p1', title: 'Checkout flow optimization', description: 'Reduce checkout steps from 5 to 3, add guest checkout, and improve form validation UX.', status: 'todo', priority: 'high', assignee: 'm1', createdAt: new Date(now - 25 * day).toISOString(), dueDate: new Date(now + 20 * day).toISOString(), subtasks: makeSubtasks('t4', 4, 0) },
  { id: 't5', projectId: 'p1', title: 'Performance audit & fixes', description: 'Run Lighthouse audit and fix issues target 90+ on performance, accessibility, and SEO scores.', status: 'todo', priority: 'medium', assignee: 'm2', createdAt: new Date(now - 20 * day).toISOString(), dueDate: new Date(now + 25 * day).toISOString(), subtasks: makeSubtasks('t5', 3, 0) },
  { id: 't6', projectId: 'p1', title: 'User acceptance testing', description: 'Coordinate UAT with stakeholders, collect feedback, and resolve critical issues before launch.', status: 'todo', priority: 'high', assignee: 'm3', createdAt: new Date(now - 15 * day).toISOString(), dueDate: new Date(now + 28 * day).toISOString(), subtasks: makeSubtasks('t6', 4, 0) },

  // Project 2 - Mobile App Development
  { id: 't7', projectId: 'p2', title: 'Set up React Native project', description: 'Initialize RN project with TypeScript, navigation, state management, and API client.', status: 'done', priority: 'critical', assignee: 'm2', createdAt: new Date(now - 28 * day).toISOString(), dueDate: new Date(now - 15 * day).toISOString(), subtasks: makeSubtasks('t7', 3, 3) },
  { id: 't8', projectId: 'p2', title: 'Authentication screens', description: 'Build login, registration, password reset, and biometric auth screens.', status: 'in_progress', priority: 'high', assignee: 'm4', createdAt: new Date(now - 20 * day).toISOString(), dueDate: new Date(now + 5 * day).toISOString(), subtasks: makeSubtasks('t8', 5, 3) },
  { id: 't9', projectId: 'p2', title: 'Offline data sync', description: 'Implement offline-first with local SQLite storage and background sync when connectivity returns.', status: 'todo', priority: 'high', assignee: 'm5', createdAt: new Date(now - 15 * day).toISOString(), dueDate: new Date(now + 25 * day).toISOString(), subtasks: makeSubtasks('t9', 4, 0) },
  { id: 't10', projectId: 'p2', title: 'Push notifications', description: 'Integrate Firebase Cloud Messaging for push notifications with deep linking.', status: 'todo', priority: 'medium', assignee: 'm2', createdAt: new Date(now - 10 * day).toISOString(), dueDate: new Date(now + 35 * day).toISOString(), subtasks: makeSubtasks('t10', 3, 0) },
  { id: 't11', projectId: 'p2', title: 'App store submission prep', description: 'Prepare screenshots, descriptions, privacy policy, and testflight build for review.', status: 'todo', priority: 'medium', assignee: 'm4', createdAt: new Date(now - 5 * day).toISOString(), dueDate: new Date(now + 55 * day).toISOString(), subtasks: makeSubtasks('t11', 4, 0) },

  // Project 3 - Data Pipeline Migration
  { id: 't12', projectId: 'p3', title: 'Audit existing pipelines', description: 'Document all legacy pipelines, dependencies, schedules, and data quality issues.', status: 'done', priority: 'high', assignee: 'm3', createdAt: new Date(now - 55 * day).toISOString(), dueDate: new Date(now - 35 * day).toISOString(), subtasks: makeSubtasks('t12', 4, 4) },
  { id: 't13', projectId: 'p3', title: 'Set up Airflow environment', description: 'Deploy Airflow on Kubernetes with CI/CD, monitoring, and alerting.', status: 'done', priority: 'high', assignee: 'm6', createdAt: new Date(now - 45 * day).toISOString(), dueDate: new Date(now - 20 * day).toISOString(), subtasks: makeSubtasks('t13', 3, 3) },
  { id: 't14', projectId: 'p3', title: 'Migrate customer ETL', description: 'Migrate customer data pipeline from legacy system to Airflow DAGs.', status: 'in_progress', priority: 'high', assignee: 'm3', createdAt: new Date(now - 30 * day).toISOString(), dueDate: new Date(now + 10 * day).toISOString(), subtasks: makeSubtasks('t14', 5, 2) },
  { id: 't15', projectId: 'p3', title: 'Migrate orders ETL', description: 'Migrate orders data pipeline highest volume pipeline requiring careful testing.', status: 'on_hold', priority: 'critical', assignee: 'm6', createdAt: new Date(now - 25 * day).toISOString(), dueDate: new Date(now + 20 * day).toISOString(), subtasks: makeSubtasks('t15', 5, 1) },
  { id: 't16', projectId: 'p3', title: 'Data validation framework', description: 'Build automated data quality checks and validation reports for all migrated pipelines.', status: 'todo', priority: 'medium', assignee: 'm3', createdAt: new Date(now - 15 * day).toISOString(), dueDate: new Date(now + 30 * day).toISOString(), subtasks: makeSubtasks('t16', 3, 0) },

  // Project 4 - Customer Portal
  { id: 't17', projectId: 'p4', title: 'Design UI mockups', description: 'Design customer portal wireframes and high-fidelity mockups.', status: 'done', priority: 'high', assignee: 'm1', createdAt: new Date(now - 85 * day).toISOString(), dueDate: new Date(now - 70 * day).toISOString(), subtasks: makeSubtasks('t17', 4, 4) },
  { id: 't18', projectId: 'p4', title: 'Order tracking page', description: 'Build real-time order tracking with status timeline and delivery estimates.', status: 'done', priority: 'high', assignee: 'm3', createdAt: new Date(now - 70 * day).toISOString(), dueDate: new Date(now - 40 * day).toISOString(), subtasks: makeSubtasks('t18', 3, 3) },
  { id: 't19', projectId: 'p4', title: 'Return management', description: 'Implement return request flow with label generation and refund tracking.', status: 'done', priority: 'medium', assignee: 'm5', createdAt: new Date(now - 50 * day).toISOString(), dueDate: new Date(now - 20 * day).toISOString(), subtasks: makeSubtasks('t19', 4, 4) },
  { id: 't20', projectId: 'p4', title: 'Live chat integration', description: 'Integrate chat widget with customer support queue and message history.', status: 'done', priority: 'high', assignee: 'm1', createdAt: new Date(now - 40 * day).toISOString(), dueDate: new Date(now - 10 * day).toISOString(), subtasks: makeSubtasks('t20', 3, 3) },
  { id: 't21', projectId: 'p4', title: 'Deploy to production', description: 'Deploy portal to production environment with DNS setup and SSL certificate.', status: 'done', priority: 'critical', assignee: 'm3', createdAt: new Date(now - 15 * day).toISOString(), dueDate: new Date(now - 6 * day).toISOString(), subtasks: makeSubtasks('t21', 5, 5) },

  // Project 5 - AI Chatbot Integration
  { id: 't22', projectId: 'p5', title: 'Define conversation flows', description: 'Map out common customer conversation flows, intents, and fallback handling.', status: 'in_progress', priority: 'high', assignee: 'm4', createdAt: new Date(now - 7 * day).toISOString(), dueDate: new Date(now + 10 * day).toISOString(), subtasks: makeSubtasks('t22', 4, 2) },
  { id: 't23', projectId: 'p5', title: 'GPT API integration', description: 'Set up OpenAI GPT API integration with rate limiting, caching, and error handling.', status: 'todo', priority: 'high', assignee: 'm6', createdAt: new Date(now - 5 * day).toISOString(), dueDate: new Date(now + 25 * day).toISOString(), subtasks: makeSubtasks('t23', 5, 0) },
  { id: 't24', projectId: 'p5', title: 'Sentiment analysis module', description: 'Build sentiment analysis to detect customer frustration and trigger escalation to human agents.', status: 'todo', priority: 'medium', assignee: 'm4', createdAt: new Date(now - 3 * day).toISOString(), dueDate: new Date(now + 40 * day).toISOString(), subtasks: makeSubtasks('t24', 3, 0) },
  { id: 't25', projectId: 'p5', title: 'Admin training interface', description: 'Build interface for training the chatbot with custom Q&A pairs and knowledge base articles.', status: 'todo', priority: 'low', assignee: 'm6', createdAt: new Date(now - 1 * day).toISOString(), dueDate: new Date(now + 60 * day).toISOString(), subtasks: makeSubtasks('t25', 4, 0) },

  // Project 6 - Social Media Campaign
  { id: 't26', projectId: 'p6', title: 'Design creative assets', description: 'Design static and video creatives for Instagram, TikTok, and LinkedIn campaigns.', status: 'in_progress', priority: 'high', assignee: 'm7', createdAt: new Date(now - 18 * day).toISOString(), dueDate: new Date(now + 5 * day).toISOString(), subtasks: makeSubtasks('t26', 4, 2) },
  { id: 't27', projectId: 'p6', title: 'Finalize influencer partnerships', description: 'Review and finalize contracts with 5 influencers for sponsored content.', status: 'in_progress', priority: 'high', assignee: 'm5', createdAt: new Date(now - 15 * day).toISOString(), dueDate: new Date(now + 8 * day).toISOString(), subtasks: makeSubtasks('t27', 3, 1) },
  { id: 't28', projectId: 'p6', title: 'Set up ad campaigns', description: 'Configure paid ad campaigns, targeting, and budget allocation across platforms.', status: 'todo', priority: 'medium', assignee: 'm7', createdAt: new Date(now - 10 * day).toISOString(), dueDate: new Date(now + 15 * day).toISOString(), subtasks: makeSubtasks('t28', 4, 0) },
  { id: 't29', projectId: 'p6', title: 'Performance tracking dashboard', description: 'Build real-time dashboard to monitor campaign KPIs and ROI.', status: 'todo', priority: 'medium', assignee: 'm5', createdAt: new Date(now - 8 * day).toISOString(), dueDate: new Date(now + 25 * day).toISOString(), subtasks: makeSubtasks('t29', 3, 0) },

  // Project 7 - Brand Video Production
  { id: 't30', projectId: 'p7', title: 'Script writing & storyboard', description: 'Write brand story script and create detailed storyboard for approval.', status: 'done', priority: 'high', assignee: 'm7', createdAt: new Date(now - 14 * day).toISOString(), dueDate: new Date(now - 5 * day).toISOString(), subtasks: makeSubtasks('t30', 3, 3) },
  { id: 't31', projectId: 'p7', title: 'Location scouting & booking', description: 'Find and book filming locations, permits, and equipment rentals.', status: 'in_progress', priority: 'high', assignee: 'm8', createdAt: new Date(now - 10 * day).toISOString(), dueDate: new Date(now + 5 * day).toISOString(), subtasks: makeSubtasks('t31', 4, 1) },
  { id: 't32', projectId: 'p7', title: 'Filming & production', description: 'Execute video shoot with director, crew, and talent.', status: 'todo', priority: 'high', assignee: 'm7', createdAt: new Date(now - 5 * day).toISOString(), dueDate: new Date(now + 15 * day).toISOString(), subtasks: makeSubtasks('t32', 5, 0) },
  { id: 't33', projectId: 'p7', title: 'Post-production & editing', description: 'Video editing, color grading, sound design, and final render.', status: 'todo', priority: 'medium', assignee: 'm8', createdAt: new Date(now - 2 * day).toISOString(), dueDate: new Date(now + 30 * day).toISOString(), subtasks: makeSubtasks('t33', 4, 0) },

  // Project 8 - Warehouse Optimization
  { id: 't34', projectId: 'p8', title: 'Current state analysis', description: 'Analyze current warehouse layout, workflows, and bottlenecks.', status: 'done', priority: 'high', assignee: 'm3', createdAt: new Date(now - 33 * day).toISOString(), dueDate: new Date(now - 20 * day).toISOString(), subtasks: makeSubtasks('t34', 3, 3) },
  { id: 't35', projectId: 'p8', title: 'Layout redesign plan', description: 'Design new warehouse layout with optimized product placement and flow.', status: 'done', priority: 'high', assignee: 'm8', createdAt: new Date(now - 28 * day).toISOString(), dueDate: new Date(now - 10 * day).toISOString(), subtasks: makeSubtasks('t35', 4, 4) },
  { id: 't36', projectId: 'p8', title: 'Implement new racking system', description: 'Install new racking and shelving according to the redesigned layout.', status: 'in_progress', priority: 'critical', assignee: 'm6', createdAt: new Date(now - 15 * day).toISOString(), dueDate: new Date(now + 10 * day).toISOString(), subtasks: makeSubtasks('t36', 5, 2) },
  { id: 't37', projectId: 'p8', title: 'WMS reconfiguration', description: 'Update warehouse management system with new locations and pick paths.', status: 'todo', priority: 'high', assignee: 'm3', createdAt: new Date(now - 10 * day).toISOString(), dueDate: new Date(now + 15 * day).toISOString(), subtasks: makeSubtasks('t37', 4, 0) },
  { id: 't38', projectId: 'p8', title: 'Staff training & go-live', description: 'Train warehouse staff on new layout and processes, then go live.', status: 'todo', priority: 'high', assignee: 'm8', createdAt: new Date(now - 5 * day).toISOString(), dueDate: new Date(now + 22 * day).toISOString(), subtasks: makeSubtasks('t38', 3, 0) },

  // Project 9 - Market Analysis Q3
  { id: 't39', projectId: 'p9', title: 'Industry trend research', description: 'Research latest industry trends, growth areas, and emerging technologies.', status: 'in_progress', priority: 'high', assignee: 'm1', createdAt: new Date(now - 3 * day).toISOString(), dueDate: new Date(now + 10 * day).toISOString(), subtasks: makeSubtasks('t39', 4, 1) },
  { id: 't40', projectId: 'p9', title: 'Competitor profiling', description: 'Profile top 10 competitors with SWOT analysis and market positioning.', status: 'todo', priority: 'high', assignee: 'm5', createdAt: new Date(now - 2 * day).toISOString(), dueDate: new Date(now + 18 * day).toISOString(), subtasks: makeSubtasks('t40', 5, 0) },
  { id: 't41', projectId: 'p9', title: 'Customer survey analysis', description: 'Analyze customer survey data to identify pain points and opportunities.', status: 'todo', priority: 'medium', assignee: 'm1', createdAt: new Date(now - 1 * day).toISOString(), dueDate: new Date(now + 25 * day).toISOString(), subtasks: makeSubtasks('t41', 3, 0) },
  { id: 't42', projectId: 'p9', title: 'Final report & presentation', description: 'Compile findings into executive report and presentation deck.', status: 'todo', priority: 'medium', assignee: 'm5', createdAt: new Date(now).toISOString(), dueDate: new Date(now + 40 * day).toISOString(), subtasks: makeSubtasks('t42', 4, 0) },

  // Project 10 - Competitor Intelligence Report
  { id: 't43', projectId: 'p10', title: 'Identify key competitors', description: 'Define competitive landscape and select top 5 competitors for deep analysis.', status: 'done', priority: 'high', assignee: 'm5', createdAt: new Date(now - 58 * day).toISOString(), dueDate: new Date(now - 45 * day).toISOString(), subtasks: makeSubtasks('t43', 2, 2) },
  { id: 't44', projectId: 'p10', title: 'Feature comparison matrix', description: 'Build detailed feature-by-feature comparison across all competitors.', status: 'done', priority: 'high', assignee: 'm8', createdAt: new Date(now - 50 * day).toISOString(), dueDate: new Date(now - 30 * day).toISOString(), subtasks: makeSubtasks('t44', 3, 3) },
  { id: 't45', projectId: 'p10', title: 'Pricing analysis', description: 'Analyze competitor pricing models, tiers, and value proposition.', status: 'done', priority: 'medium', assignee: 'm5', createdAt: new Date(now - 40 * day).toISOString(), dueDate: new Date(now - 20 * day).toISOString(), subtasks: makeSubtasks('t45', 4, 4) },
  { id: 't46', projectId: 'p10', title: 'Strategic recommendations', description: 'Develop actionable strategic recommendations based on competitive insights.', status: 'done', priority: 'high', assignee: 'm8', createdAt: new Date(now - 30 * day).toISOString(), dueDate: new Date(now - 12 * day).toISOString(), subtasks: makeSubtasks('t46', 3, 3) },
]

export function getMembers() {
  return [...members]
}

export function getMemberById(id) {
  return members.find(m => m.id === id)
}

export function getDepartments() {
  return [...departments]
}

export function getDepartmentById(id) {
  return departments.find(d => d.id === id)
}

export function getStatusInfo(status) {
  const map = {
    todo: { label: 'To Do', color: '#6b7280' },
    in_progress: { label: 'In Progress', color: '#3b82f6' },
    on_hold: { label: 'On Hold', color: '#f59e0b' },
    review: { label: 'In Review', color: '#8b5cf6' },
    done: { label: 'Done', color: '#10b981' },
    active: { label: 'Active', color: '#3b82f6' },
    planning: { label: 'Planning', color: '#8b5cf6' },
    completed: { label: 'Completed', color: '#10b981' },
  }
  return map[status] || { label: status, color: '#6b7280' }
}

export function getPriorityInfo(priority) {
  const map = {
    low: { label: 'Low', color: '#10b981' },
    medium: { label: 'Medium', color: '#f59e0b' },
    high: { label: 'High', color: '#f97316' },
    critical: { label: 'Critical', color: '#ef4444' },
  }
  return map[priority] || { label: priority, color: '#6b7280' }
}

export function calcTimeProgress(startDate, dueDate) {
  const start = new Date(startDate).getTime()
  const due = new Date(dueDate).getTime()
  const nowTime = Date.now()
  const total = due - start
  const elapsed = nowTime - start
  if (total <= 0) return 100
  if (elapsed <= 0) return 0
  if (elapsed >= total) return 100
  return Math.round((elapsed / total) * 100)
}
