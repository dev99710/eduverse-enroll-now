
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  enrolledCount?: number;
}

interface CourseCardProps {
  course: CourseData;
  className?: string;
}

const CourseCard = ({ course, className }: CourseCardProps) => {
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

  return (
    <Card className={cn("h-full transition-all hover:shadow-lg", className)}>
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={course.thumbnail} 
          alt={`${course.title} thumbnail`} 
          className="w-full h-full object-cover"
        />
        <Badge className={cn("absolute top-2 right-2", getLevelColor(course.level))}>
          {course.level}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
        <CardDescription>By {course.instructor}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {course.description}
        </p>
        {course.enrolledCount !== undefined && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {course.enrolledCount} students enrolled
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/courses/${course.id}`} className="w-full">
          <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700">
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
