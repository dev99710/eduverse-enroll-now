
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock login process
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would set auth state based on API response
      // For demo, we'll just check for teacher/student emails
      if (email.includes("teacher")) {
        // Redirect to teacher dashboard
        toast.success("Logged in as Teacher");
        navigate("/teacher-dashboard");
      } else {
        // Redirect to student dashboard
        toast.success("Logged in as Student");
        navigate("/student-dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Log in to EduVerse</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              to="/auth/forgot-password"
              className="text-sm text-eduPurple-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-eduBlue-600 hover:bg-eduBlue-700" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="flex items-center text-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-4 text-sm text-gray-500">Demonstration</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setEmail("student@example.com");
              setPassword("password");
            }}
          >
            Demo Student
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setEmail("teacher@example.com");
              setPassword("password");
            }}
          >
            Demo Teacher
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-eduPurple-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
