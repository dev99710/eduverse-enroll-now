
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CourseData } from "@/components/courses/CourseCard";
import { getTeacherCourses, mockUsers, getEnrolledStudents } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";

const TeacherDashboard = () => {
  const teacherId = mockUsers.teachers[0].id;
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

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
      if (profile?.role !== 'teacher') {
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
        await new Promise(resolve => setTimeout(resolve, 800));
        const teacherCourses = getTeacherCourses(teacherId);
        setCourses(teacherCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [teacherId]);

  const handleCreateCourse = () => {
    navigate('/create-course');
  };

  return (
    <PageLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
            <p className="text-gray-600">Welcome back, {mockUsers.teachers[0].name}</p>
          </div>
          <Button onClick={handleCreateCourse} className="bg-eduOrange-500 hover:bg-eduOrange-500/90">
            Create New Course
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{courses.length}</CardTitle>
              <CardDescription>Published Courses</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {courses.reduce((total, course) => total + (course.enrolledCount || 0), 0)}
              </CardTitle>
              <CardDescription>Total Enrolled Students</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {courses.length > 0 
                  ? Math.round(courses.reduce((total, course) => total + (course.enrolledCount || 0), 0) / courses.length) 
                  : 0}
              </CardTitle>
              <CardDescription>Average Enrollments</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Tabs defaultValue="my-courses">
          <TabsList className="mb-8">
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Enrolled Students</TabsTrigger>
          </TabsList>
          <TabsContent value="my-courses">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Loading your courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">You haven't created any courses yet.</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first course.</p>
                <Button onClick={handleCreateCourse}>Create Course</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {courses.map(course => (
                  <Card key={course.id}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 h-48 md:h-auto">
                        <img 
                          src={course.thumbnail} 
                          alt={`${course.title} thumbnail`} 
                          className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                        />
                      </div>
                      <div className="md:w-3/4 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="secondary">{course.level}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                        <p className="text-gray-600 mb-4">{course.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-auto">
                          <div className="text-sm text-gray-500">
                            <strong>{course.enrolledCount}</strong> students enrolled
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/courses/${course.id}`}>View</Link>
                            </Button>
                            <Button variant="secondary" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="students">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Loading student data...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">No student data available.</h3>
                <p className="text-gray-600 mb-6">Create courses to start tracking enrolled students.</p>
                <Button onClick={handleCreateCourse}>Create Course</Button>
              </div>
            ) : (
              <div className="space-y-8">
                {courses.map(course => {
                  const students = getEnrolledStudents(course.id);
                  return (
                    <Card key={course.id}>
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{students.length} enrolled students</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {students.length === 0 ? (
                          <p className="text-gray-500">No students enrolled in this course yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {students.map(student => (
                              <div key={student.id} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                  <img 
                                    src={student.profilePicture || "https://randomuser.me/api/portraits/men/1.jpg"} 
                                    alt={`${student.name} profile`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-gray-500">{student.email}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Message All Students
                        </Button>
                      </CardFooter>
                    </Card>
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

export default TeacherDashboard;
