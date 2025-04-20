
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import CourseCard, { CourseData } from "@/components/courses/CourseCard";
import { getStudentCourses, mockUsers } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  // For demo, we'll use the first student in our mock data
  const studentId = mockUsers.students[0].id;
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authenticated user's role
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth/login");
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role !== 'student') {
        navigate("/auth/login");
        return;
      }
      setUserRole(profile.role);
    };
    checkRole();
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const studentCourses = getStudentCourses(studentId);
        setCourses(studentCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [studentId]);

  return (
    <PageLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {mockUsers.students[0].name}</p>
        </div>
      
      <Tabs defaultValue="my-courses">
        <TabsList className="mb-8">
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-courses">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">You are not enrolled in any courses yet.</h3>
              <p className="text-gray-600 mb-6">Browse our catalog and find courses that interest you.</p>
              <Link to="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">Your Enrolled Courses</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="progress">
          <h2 className="text-2xl font-semibold mb-6">Your Learning Progress</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading your progress...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">No progress to show yet.</h3>
              <p className="text-gray-600 mb-6">Enroll in courses to start tracking your progress.</p>
              <Link to="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map(course => {
                // Generate random progress for demo purposes
                const progress = Math.floor(Math.random() * 100);
                
                return (
                  <div key={course.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <h3 className="text-lg font-medium">{course.title}</h3>
                      <Link to={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm">Continue Learning</Button>
                      </Link>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-1">
                        Course Progress: {progress}% complete
                      </p>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-4">
                      {progress < 30 ? (
                        "Just getting started! Keep going to make progress."
                      ) : progress < 70 ? (
                        "You're making good progress! Keep up the good work."
                      ) : (
                        "Almost there! Complete the remaining modules to finish the course."
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  </PageLayout>
);
};

export default StudentDashboard;
