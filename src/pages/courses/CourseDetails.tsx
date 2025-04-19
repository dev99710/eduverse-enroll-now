
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  level: string;
  thumbnail: string | null;
  video_url: string | null;
  instructor_id: string;
  created_at: string | null;
  updated_at: string | null;
  instructor: {
    full_name: string | null;
  };
  // Add default values for objectives and syllabus
  objectives: string[];
  syllabus: { title: string; description: string; }[];
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      if (!courseId) return;
      
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth/login');
          return;
        }

        setCurrentUserId(session.user.id);

        // Get user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setUserRole(profile?.role || null);

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select(`
            *,
            instructor:profiles(full_name)
          `)
          .eq('id', courseId)
          .single();

        if (courseError) throw courseError;

        // Handle potential instructor data error
        const instructorData = courseData.instructor && typeof courseData.instructor === 'object' 
          ? { full_name: (courseData.instructor as any)?.full_name || 'Unknown Instructor' }
          : { full_name: 'Unknown Instructor' };

        // Set default values for objectives and syllabus
        const courseWithDefaults: Course = {
          ...courseData,
          instructor: instructorData,
          objectives: [
            "Understand core concepts of the subject",
            "Apply knowledge to real-world scenarios",
            "Master essential techniques and methods",
            "Build practical projects to demonstrate skills"
          ],
          syllabus: [
            {
              title: "Introduction to the course",
              description: "Overview of the course structure and core concepts."
            },
            {
              title: "Fundamentals",
              description: "Learning the basic principles and techniques."
            },
            {
              title: "Advanced Concepts",
              description: "Diving deep into complex areas and specialized topics."
            },
            {
              title: "Practical Application",
              description: "Applying knowledge to real-world scenarios and projects."
            }
          ]
        };
        
        setCourse(courseWithDefaults);

        // Check if user is enrolled
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', courseId)
          .eq('student_id', session.user.id)
          .single();

        setIsEnrolled(!!enrollment);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [courseId, navigate]);

  const handleEnroll = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth/login');
        return;
      }

      setEnrolling(true);
      
      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          student_id: session.user.id
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast.success("Successfully enrolled in course!");
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("Failed to enroll in course");
    } finally {
      setEnrolling(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-2xl text-gray-600">Loading course details...</div>
        </div>
      </PageLayout>
    );
  }

  if (!course) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-xl text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-2/3">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
              <Badge variant="outline">{course.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{course.description}</p>
            <div className="mb-6">
              <p className="text-sm text-gray-500">Created by <span className="text-eduBlue-600">{course.instructor.full_name}</span></p>
              <p className="text-sm text-gray-500">
                {new Date(course.created_at || '').toLocaleDateString()} • 
                {isEnrolled ? ' You are enrolled' : ' Enroll to access content'}
              </p>
            </div>
          </div>
          
          <div className="md:w-1/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={course.thumbnail || 'https://via.placeholder.com/800x450?text=No+Thumbnail'} 
                alt={`${course.title} thumbnail`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              {userRole === 'student' && (
                <Button 
                  onClick={handleEnroll} 
                  disabled={enrolling || isEnrolled} 
                  className="w-full bg-eduOrange-500 hover:bg-eduOrange-500/90 mb-4"
                >
                  {enrolling ? "Enrolling..." : isEnrolled ? "Enrolled" : "Enroll Now"}
                </Button>
              )}
              {userRole === 'teacher' && course.instructor_id === currentUserId && (
                <Button 
                  variant="outline" 
                  className="w-full mb-4"
                  onClick={() => navigate(`/courses/${courseId}/edit`)}
                >
                  Edit Course
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Course Tabs */}
        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-eduBlue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {course.video_url && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Course Preview</h2>
                <div className="aspect-video overflow-hidden rounded-lg">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={course.video_url} 
                    title="Course Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="syllabus">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.syllabus.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                    <h3 className="text-lg font-medium mb-2">
                      Module {index + 1}: {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="instructor">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt={`${course.instructor.full_name} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{course.instructor.full_name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Expert in {course.category}</p>
                <p className="text-gray-700 dark:text-gray-200">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
                  nisl ac ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nisl nisl 
                  sit amet nisl. Nullam auctor, nisl ac ultricies tincidunt, nunc nisl aliquam nisl.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Course CTA */}
        <div className="bg-eduBlue-50 dark:bg-eduBlue-900/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of students already enrolled in this course.
          </p>
          <Button 
            onClick={handleEnroll} 
            disabled={enrolling || isEnrolled} 
            size="lg"
            className="bg-eduOrange-500 hover:bg-eduOrange-500/90"
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default CourseDetails;
