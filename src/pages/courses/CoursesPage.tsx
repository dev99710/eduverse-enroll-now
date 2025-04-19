
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import CourseGrid from "@/components/courses/CourseGrid";
import { mockCourses } from "@/lib/mockData";

const CoursesPage = () => {
  return (
    <PageLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Explore Courses</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover a wide range of courses taught by expert instructors to enhance your skills.
          </p>
        </div>
        
        <CourseGrid courses={mockCourses} />
      </div>
    </PageLayout>
  );
};

export default CoursesPage;
