
import PageLayout from "@/components/layout/PageLayout";
import AuthTabs from "@/components/auth/AuthTabs";

const Login = () => {
  return (
    <PageLayout>
      <div className="flex min-h-screen items-center justify-center py-12">
        <AuthTabs />
      </div>
    </PageLayout>
  );
};

export default Login;
