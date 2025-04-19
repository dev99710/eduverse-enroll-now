
import PageLayout from "@/components/layout/PageLayout";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <PageLayout>
      <div className="flex min-h-screen items-center justify-center py-12">
        <LoginForm />
      </div>
    </PageLayout>
  );
};

export default Login;
