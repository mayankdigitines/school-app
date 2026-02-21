import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, GraduationCap, School, Users, Eye, EyeOff, Building2 } from 'lucide-react';

// Map roles to specific icons and titles for a better UI experience
const ROLE_CONFIG = {
  SuperAdmin: { title: "Super Admin Portal", icon: ShieldCheck, color: "text-red-600" },
  SchoolAdmin: { title: "School Admin Login", icon: Building2, color: "text-blue-600" }, 
  Teacher: { title: "Teacher Portal", icon: GraduationCap, color: "text-green-600" },
  Parent: { title: "Parent Access", icon: Users, color: "text-purple-600" },
};

const Login = ({ allowedRole }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const config = allowedRole ? ROLE_CONFIG[allowedRole] : { title: "Login", icon: School, color: "text-slate-900" };
  const Icon = config.icon;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roleToSubmit = allowedRole; 

      if (!roleToSubmit) {
          toast.error("Invalid login configuration.");
          setLoading(false);
          return;
      }

      await login(formData.username, formData.password, roleToSubmit);
      toast.success(`Welcome back!`);
      
      // Intelligent Redirect based on Role
      if (roleToSubmit === 'SuperAdmin') navigate('/super-admin/schools');
      else if (roleToSubmit === 'SchoolAdmin') navigate('/dashboard');
      else if (roleToSubmit === 'Teacher') navigate('/teacher/dashboard'); 
      else if (roleToSubmit === 'Parent') navigate('/parent/dashboard');   
      else navigate('/');

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 sm:border">
        <CardHeader className="text-center space-y-2">
            <div className={`mx-auto p-3 bg-white rounded-full shadow-sm w-fit ${config.color}`}>
                <Icon size={32} />
            </div>
          <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
          <CardDescription>Enter your credentials to access the panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Email / Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder={allowedRole === 'Parent' ? "Phone Number" : "name@example.com"}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button type="button" variant="transparent" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 bg-slate-50/50">
            <p className="text-xs text-slate-500">
                Secure {allowedRole} Access
            </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
