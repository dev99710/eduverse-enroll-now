
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import CourseGrid from "@/components/courses/CourseGrid";
import { mockCourses } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

const CoursesPage = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  
  // Get featured courses (top 3 by enrollment)
  const featuredCourses = [...mockCourses]
    .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
    .slice(0, 3);
  
  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = mockCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(mockCourses.length / coursesPerPage);

  // Get unique categories for quick filters
  const categories = Array.from(new Set(mockCourses.map(course => course.category)));

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-eduBlue-700 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left md:w-2/3">
            <h1 className="text-4xl font-bold mb-4 text-white">Explore Our Courses</h1>
            <p className="text-xl text-gray-100 max-w-2xl md:mx-0 mx-auto">
              Discover a wide range of courses taught by expert instructors to enhance your skills and advance your career.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Courses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-48">
                  <img 
                    src={course.thumbnail} 
                    alt={`${course.title} thumbnail`} 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-eduOrange-500 text-white">
                    Featured
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{course.enrolledCount} students</span>
                    <Button size="sm" className="bg-eduBlue-600 hover:bg-eduBlue-700">
                      View Course
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Category Filters */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => {}}
            >
              All Courses
            </Button>
            {categories.slice(0, 5).map(category => (
              <Button 
                key={category} 
                variant="outline" 
                className="rounded-full"
                onClick={() => {}}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Courses Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">All Courses</h2>
            <CourseGrid courses={currentCourses} />
          </div>

          {/* Pagination */}
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }} 
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === index + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </PageLayout>
  );
};

export default CoursesPage;
