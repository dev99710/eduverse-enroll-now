import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import EditProfileForm from "@/components/profile/EditProfileForm";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  bio?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth/login");
          return;
        }

        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userProfile) {
          // For demo purposes, we'll merge mock data with the actual profile
          const mockUser = userProfile.role === 'student' 
            ? mockUsers.students[0] 
            : mockUsers.teachers[0];

          setProfile({
            id: user.id,
            name: mockUser.name,
            email: user.email || '',
            role: userProfile.role,
            profilePicture: mockUser.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg',
            bio: mockUser.bio || 'No bio available'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <PageLayout>
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-gray-600">Profile not found</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{profile.name}</h3>
                  <p className="text-gray-600 mb-2">{profile.email}</p>
                  <p className="text-gray-600 mb-4">
                    Role: <span className="capitalize">{profile.role}</span>
                  </p>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
              <Button className="w-full" variant="outline">
                Change Password
              </Button>
              <Button className="w-full" variant="outline">
                Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Account Status</h4>
                  <p className="text-gray-600">Active</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Member Since</h4>
                  <p className="text-gray-600">January 2024</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Last Login</h4>
                  <p className="text-gray-600">Today</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Two-Factor Authentication</h4>
                  <p className="text-gray-600">Not enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit Profile Dialog */}
      <EditProfileForm 
        open={editProfileOpen} 
        onOpenChange={setEditProfileOpen} 
      />
    </PageLayout>
  );
};

export default Profile;