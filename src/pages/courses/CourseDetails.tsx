
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDetailedCourse, DetailedCourseData } from "@/lib/mockData";
import { toast } from "sonner";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<DetailedCourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  
  useEffect(() => {
    // Simulate API call
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Small delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!courseId) {
          throw new Error("Course ID is required");
        }
        
        const courseData = getDetailedCourse(courseId);
        if (!courseData) {
          throw new Error("Course not found");
        }
        
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Successfully enrolled in course!");
      // In a real app, we would update the user's enrolled courses
    } catch (error) {
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
              <p className="text-sm text-gray-500">Created by <span className="text-eduBlue-600">{course.instructor}</span></p>
              <p className="text-sm text-gray-500">{course.duration} • {course.enrolledCount} students enrolled</p>
            </div>
          </div>
          
          <div className="md:w-1/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={`${course.title} thumbnail`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-2xl font-bold">${course.price.toFixed(2)}</p>
              </div>
              <Button 
                onClick={handleEnroll} 
                disabled={enrolling} 
                className="w-full bg-eduOrange-500 hover:bg-eduOrange-500/90 mb-4"
              >
                {enrolling ? "Enrolling..." : "Enroll Now"}
              </Button>
              <p className="text-sm text-gray-500 text-center">
                30-day money-back guarantee
              </p>
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
            
            {course.videoUrl && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Course Preview</h2>
                <div className="aspect-video overflow-hidden rounded-lg">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={course.videoUrl} 
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
                  alt={`${course.instructor} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{course.instructor}</h2>
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
            disabled={enrolling} 
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
