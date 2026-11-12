export const dsaTopics = [
  'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search',
  'Linked List', 'Trees', 'Tries', 'Heap / Priority Queue', 'Backtracking',
  'Graphs', 'Dynamic Programming', 'Greedy', 'Intervals', 'Math & Geometry',
];

export const course = [
  { day: 0, title: 'Course Introduction', video: 'zvK49innOZY' },
  { day: 1, title: 'Two Pointers — Theory', video: 'Elnhh8cC2vM' },
  { day: 2, title: 'Two Pointers — Five Problems', video: 'Yi90cuHYyWQ' },
  { day: 3, title: 'Two Pointers — LeetCode Practice', video: 'SP065oLnxGA' },
  { day: 4, title: 'Two Pointers — Interview Questions', video: 'pcj6S1KLxGA' },
  { day: 5, title: 'Two Pointers — Interview Questions', video: 'jA74srakqvI' },
  { day: 6, title: 'String Interview Questions', video: 'IW8gQ2u2O_I' },
  { day: 7, title: 'Fast & Slow Pointers — Theory', video: 'FguUjuCzhj0' },
  { day: 8, title: 'Fast & Slow Pointers — Problems', video: 'eIItwq8UTmU' },
  { day: 9, title: 'Fast & Slow Pointers — Problems', video: 'E85jp_rHivc' },
  { day: 10, title: 'Maximum Twin Sum of Linked List', video: 't40HN4Rla30' },
  { day: 11, title: 'Circular Array Loop', video: 'nFZ1mysCZc0' },
].map((lesson) => ({ ...lesson, id: `babua-${lesson.day}`, url: `https://www.youtube.com/watch?v=${lesson.video}`, notes: `https://github.com/team-codebug/babua-dsa-patterns-course/tree/main/${lesson.day}_Day` }));

export const designTopics = [
  'Scale From Zero to Millions', 'Back-of-the-envelope Estimation', 'System Design Framework', 'Rate Limiter', 'Consistent Hashing', 'Key-Value Store', 'Unique ID Generator', 'URL Shortener', 'Web Crawler', 'Notification System', 'News Feed', 'Chat System', 'Search Autocomplete', 'YouTube', 'Google Drive', 'Proximity Service', 'Nearby Friends', 'Google Maps', 'Distributed Message Queue', 'Metrics Monitoring', 'Ad Click Aggregation', 'Hotel Reservation', 'Distributed Email', 'Object Storage', 'Gaming Leaderboard', 'Payment System', 'Digital Wallet', 'Stock Exchange',
].map((title, index) => ({ id: `alex-${index + 1}`, title, chapter: index + 1 }));

export const resources = [
  { name: 'Babua DSA 90 Day', url: 'https://github.com/team-codebug/babua-dsa-patterns-course' },
  { name: 'Babua question sheet', url: 'https://docs.google.com/spreadsheets/d/1T3vPcwlWdMRMYSf8IxQCKb3gX7rGzDss-ZU-R4XFM14/edit' },
  { name: 'NeetCode roadmap', url: 'https://neetcode.io/roadmap' },
  { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
  { name: 'Alex Xu chapter notes', url: 'https://github.com/liquidslr/system-design-notes' },
];
