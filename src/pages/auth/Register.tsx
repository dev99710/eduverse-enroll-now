
import PageLayout from "@/components/layout/PageLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <PageLayout>
      <div className="flex min-h-screen items-center justify-center py-12">
        <RegisterForm />
      </div>
    </PageLayout>
  );
};

export default Register;
