import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { errorMessage } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required')
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });
  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (values: FormData) => {
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      setError('root', { message: errorMessage(error) });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-4">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-cyan-600">Publisher Ops</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Welcome back</h1>
        <p className="mb-7 mt-2 text-sm text-slate-500">Sign in with the account provided by your administrator.</p>
        <label className="label">Email</label>
        <input className="input" type="email" {...register('email')} />
        <p className="error">{errors.email?.message}</p>
        <label className="label mt-4">Password</label>
        <input className="input" type="password" {...register('password')} />
        <p className="error">{errors.password?.message}</p>
        {errors.root && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.root.message}</div>}
        <button className="btn-primary mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
