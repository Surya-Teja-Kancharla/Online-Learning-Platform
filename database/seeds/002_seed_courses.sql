s-- Seed Data: Courses
-- Description: Creates sample courses for testing
-- Note: Assumes users with instructor role exist

-- Clear existing data (for development only)
-- TRUNCATE TABLE courses CASCADE;

-- Insert sample courses
-- Course 1: Web Development Bootcamp (instructor@example.com - id: 2)
INSERT INTO courses (
  title, 
  description, 
  instructor_id, 
  category, 
  difficulty, 
  price, 
  duration, 
  syllabus, 
  requirements, 
  learning_outcomes, 
  language, 
  is_published
) VALUES (
  'Complete Web Development Bootcamp',
  'Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, and more. Build real-world projects and become a full-stack developer.',
  2, -- instructor@example.com
  'Web Development',
  'beginner',
  99.99,
  4800, -- 80 hours
  'Module 1: HTML & CSS Fundamentals\nModule 2: JavaScript Basics\nModule 3: Advanced JavaScript\nModule 4: React.js\nModule 5: Node.js & Express\nModule 6: MongoDB\nModule 7: Full-Stack Projects',
  'Basic computer skills\nNo programming experience required\nA computer with internet connection',
  'Build responsive websites from scratch\nMaster HTML, CSS, and JavaScript\nCreate React applications\nDevelop backend APIs with Node.js\nWork with databases\nDeploy full-stack applications',
  'English',
  true
) ON CONFLICT DO NOTHING;

-- Course 2: Python for Data Science (sarah.instructor@example.com - id: 3)
INSERT INTO courses (
  title, 
  description, 
  instructor_id, 
  category, 
  difficulty, 
  price, 
  duration, 
  syllabus, 
  requirements, 
  learning_outcomes, 
  language, 
  is_published
) VALUES (
  'Python for Data Science and Machine Learning',
  'Master Python for data analysis and machine learning. Learn NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow. Work on real data science projects.',
  3, -- sarah.instructor@example.com
  'Data Science',
  'intermediate',
  149.99,
  3600, -- 60 hours
  'Module 1: Python Fundamentals\nModule 2: NumPy for Data Processing\nModule 3: Pandas for Data Analysis\nModule 4: Data Visualization\nModule 5: Machine Learning Basics\nModule 6: Advanced ML Algorithms\nModule 7: Deep Learning with TensorFlow',
  'Basic programming knowledge\nFamiliarity with Python syntax\nBasic mathematics and statistics',
  'Perform data analysis with Python\nCreate data visualizations\nBuild machine learning models\nWork with neural networks\nHandle real-world datasets\nDeploy ML models',
  'English',
  true
) ON CONFLICT DO NOTHING;

-- Course 3: Mobile App Development (michael.instructor@example.com - id: 4)
INSERT INTO courses (
  title, 
  description, 
  instructor_id, 
  category, 
  difficulty, 
  price, 
  duration, 
  syllabus, 
  requirements, 
  learning_outcomes, 
  language, 
  is_published
) VALUES (
  'React Native - Build Mobile Apps',
  'Learn to build cross-platform mobile applications using React Native. Create iOS and Android apps with a single codebase. Includes deployment to app stores.',
  4, -- michael.instructor@example.com
  'Mobile Development',
  'intermediate',
  129.99,
  3000, -- 50 hours
  'Module 1: React Native Basics\nModule 2: Navigation\nModule 3: State Management\nModule 4: Native Features\nModule 5: Firebase Integration\nModule 6: Performance Optimization\nModule 7: Publishing Apps',
  'JavaScript knowledge\nReact.js basics\nNode.js installed\nXcode or Android Studio',
  'Build cross-platform mobile apps\nImplement navigation and routing\nManage application state\nAccess device features\nIntegrate with backend APIs\nPublish to app stores',
  'English',
  true
) ON CONFLICT DO NOTHING;

-- Course 4: Advanced JavaScript (instructor@example.com - id: 2)
INSERT INTO courses (
  title, 
  description, 
  instructor_id, 
  category, 
  difficulty, 
  price, 
  duration, 
  syllabus, 
  requirements, 
  learning_outcomes, 
  language, 
  is_published
) VALUES (
  'Advanced JavaScript Concepts',
  'Deep dive into advanced JavaScript concepts including closures, prototypes, async programming, design patterns, and performance optimization.',
  2,
  'Web Development',
  'advanced',
  89.99,
  1800, -- 30 hours
  'Module 1: Closures and Scope\nModule 2: Prototypes and Inheritance\nModule 3: Async JavaScript\nModule 4: Design Patterns\nModule 5: Performance Optimization\nModule 6: Testing and Debugging',
  'Strong JavaScript fundamentals\n1+ years of JS experience\nUnderstanding of ES6+',
  'Master closures and scope\nUnderstand prototypal inheritance\nWork with promises and async/await\nImplement design patterns\nOptimize JavaScript performance\nWrite testable code',
  'English',
  true
) ON CONFLICT DO NOTHING;

-- Course 5: UI/UX Design Fundamentals (instructor@example.com - id: 2)
INSERT INTO courses (
  title, 
  description, 
  instructor_id, 
  category, 
  difficulty, 
  price, 
  duration, 
  syllabus, 
  requirements, 
  learning_outcomes, 
  language, 
  is_published
) VALUES (
  'UI/UX Design Fundamentals',
  'Learn the principles of user interface and user experience design. Create beautiful, user-friendly designs using Figma and modern design tools.',
  2,
  'Design',
  'beginner',
  79.99,
  2400, -- 40 hours
  'Module 1: Design Principles\nModule 2: User Research\nModule 3: Wireframing\nModule 4: Prototyping\nModule 5: Visual Design\nModule 6: Usability Testing',
  'No design experience required\nComputer with Figma installed\nCreative mindset',
  'Understand design principles\nConduct user research\nCreate wireframes and prototypes\nDesign user interfaces\nPerform usability testing\nBuild design portfolio',
  'English',
  true
) ON CONFLICT DO NOTHING;

-- Course 6: DevOps Essentials (Draft Course)
INSERT INTO courses (
  title, 
  description, 
  instructor_id, 
  category, 
  difficulty, 
  price, 
  duration, 
  syllabus, 
  requirements, 
  learning_outcomes, 
  language, 
  is_published
) VALUES (
  'DevOps Essentials',
  'Learn DevOps practices including CI/CD, containerization with Docker, orchestration with Kubernetes, and cloud deployment.',
  3,
  'DevOps',
  'intermediate',
  139.99,
  3300, -- 55 hours
  'Module 1: DevOps Overview\nModule 2: Git and Version Control\nModule 3: CI/CD Pipelines\nModule 4: Docker\nModule 5: Kubernetes\nModule 6: Cloud Platforms\nModule 7: Monitoring',
  'Linux basics\nCommand line experience\nBasic networking knowledge',
  'Implement CI/CD pipelines\nContainerize applications\nOrchestrate with Kubernetes\nDeploy to cloud platforms\nMonitor applications\nAutomate workflows',
  'English',
  false -- Draft course
) ON CONFLICT DO NOTHING;

-- Update enrollment counts and ratings for published courses
UPDATE courses SET 
  enrollment_count = FLOOR(RANDOM() * 1000 + 100),
  rating = ROUND((RANDOM() * 2 + 3)::numeric, 2),
  rating_count = FLOOR(RANDOM() * 100 + 20)
WHERE is_published = true;

-- Verify seeded data
SELECT 
  id,
  title,
  instructor_id,
  category,
  difficulty,
  price,
  is_published,
  enrollment_count,
  rating,
  created_at
FROM courses
ORDER BY created_at;

-- Count courses by status
SELECT 
  is_published,
  COUNT(*) as count
FROM courses
GROUP BY is_published;

-- Count courses by category
SELECT 
  category,
  COUNT(*) as count
FROM courses
GROUP BY category
ORDER BY count DESC;