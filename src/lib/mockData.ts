
import { CourseData } from "@/components/courses/CourseCard";

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Mock course data
export const mockCourses: CourseData[] = [
  {
    id: generateId(),
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript.",
    instructor: "Sarah Johnson",
    category: "Web Development",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 1245
  },
  {
    id: generateId(),
    title: "Advanced React Patterns",
    description: "Master advanced React patterns including hooks, context, and performance optimization techniques.",
    instructor: "Michael Chen",
    category: "Web Development",
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 862
  },
  {
    id: generateId(),
    title: "Data Science Fundamentals",
    description: "An introduction to data science concepts, tools, and methodologies for beginners.",
    instructor: "Emma Williams",
    category: "Data Science",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1489389944381-3471b5b30f04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 1583
  },
  {
    id: generateId(),
    title: "Machine Learning for Everyone",
    description: "A beginner-friendly course on machine learning concepts and practical applications.",
    instructor: "James Wilson",
    category: "Data Science",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 976
  },
  {
    id: generateId(),
    title: "UX/UI Design Principles",
    description: "Learn essential user experience and interface design principles for creating user-friendly applications.",
    instructor: "Olivia Martinez",
    category: "Design",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 742
  },
  {
    id: generateId(),
    title: "Cybersecurity Essentials",
    description: "Essential cybersecurity concepts and practices to protect systems and data.",
    instructor: "David Smith",
    category: "Security",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 638
  },
  {
    id: generateId(),
    title: "Mobile App Development with Flutter",
    description: "Build cross-platform mobile applications using Google's Flutter framework.",
    instructor: "Sophia Lee",
    category: "Mobile Development",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 925
  },
  {
    id: generateId(),
    title: "Blockchain & Cryptocurrency",
    description: "Understanding blockchain technology and the cryptocurrency ecosystem.",
    instructor: "Daniel Thompson",
    category: "Blockchain",
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 524
  },
  {
    id: generateId(),
    title: "Cloud Computing Fundamentals",
    description: "Learn the basics of cloud computing and major cloud service providers.",
    instructor: "Rachel Brown",
    category: "Cloud Computing",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    enrolledCount: 821
  }
];

// Detailed course data with additional information
export interface DetailedCourseData extends CourseData {
  price: number;
  duration: string; // e.g., "8 weeks"
  objectives: string[];
  syllabus: {
    title: string;
    description: string;
  }[];
  videoUrl?: string; // Optional preview video
}

export const getDetailedCourse = (id: string): DetailedCourseData | undefined => {
  const course = mockCourses.find(course => course.id === id);
  
  if (!course) return undefined;
  
  // Creating detailed course data for the found course
  return {
    ...course,
    price: Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
    duration: `${Math.floor(Math.random() * 12) + 4} weeks`,
    objectives: [
      "Understand core concepts and principles",
      "Apply knowledge to real-world problems",
      "Build practical projects for your portfolio",
      "Master essential tools and technologies"
    ],
    syllabus: [
      {
        title: "Introduction & Setup",
        description: "Overview of course structure and setting up your environment."
      },
      {
        title: "Core Concepts",
        description: "Understanding the fundamental concepts and principles."
      },
      {
        title: "Practical Applications",
        description: "Applying knowledge to practical scenarios and real-world problems."
      },
      {
        title: "Advanced Techniques",
        description: "Diving deeper into advanced topics and specialized techniques."
      },
      {
        title: "Final Project",
        description: "Building a comprehensive project to showcase your skills."
      }
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Sample video URL
  };
};

// Types for user data
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  profilePicture?: string;
}

export interface StudentData extends UserData {
  role: 'student';
  enrolledCourses: string[];
}

export interface TeacherData extends UserData {
  role: 'teacher';
  publishedCourses: string[];
}

// Mock users
export const mockUsers = {
  students: [
    {
      id: "student-1",
      name: "Alex Johnson",
      email: "student@example.com",
      role: 'student' as const,
      profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
      enrolledCourses: [mockCourses[0].id, mockCourses[2].id]
    },
    {
      id: "student-2",
      name: "Jessica Williams",
      email: "jessica@example.com",
      role: 'student' as const,
      profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
      enrolledCourses: [mockCourses[1].id, mockCourses[0].id, mockCourses[4].id]
    }
  ],
  teachers: [
    {
      id: "teacher-1",
      name: "Prof. Michael Chen",
      email: "teacher@example.com",
      role: 'teacher' as const,
      profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
      publishedCourses: [mockCourses[0].id, mockCourses[1].id]
    },
    {
      id: "teacher-2",
      name: "Dr. Emma Williams",
      email: "emma@example.com",
      role: 'teacher' as const,
      profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
      publishedCourses: [mockCourses[2].id, mockCourses[4].id]
    }
  ]
};

// Get enrolled students for a course
export const getEnrolledStudents = (courseId: string) => {
  return mockUsers.students.filter(student => 
    student.enrolledCourses.includes(courseId)
  );
};

// Get courses published by a teacher
export const getTeacherCourses = (teacherId: string) => {
  const teacher = mockUsers.teachers.find(t => t.id === teacherId);
  if (!teacher) return [];
  
  return teacher.publishedCourses.map(courseId => 
    mockCourses.find(course => course.id === courseId)
  ).filter(Boolean) as CourseData[];
};

// Get courses enrolled by a student
export const getStudentCourses = (studentId: string) => {
  const student = mockUsers.students.find(s => s.id === studentId);
  if (!student) return [];
  
  return student.enrolledCourses.map(courseId => 
    mockCourses.find(course => course.id === courseId)
  ).filter(Boolean) as CourseData[];
};
