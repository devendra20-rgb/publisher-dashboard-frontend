import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api, { errorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, 'Use 8+ chars with upper, lower, number, and special character'),
  confirmPassword: z.string()
}).refine((value) => value.newPassword === value.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting, isSubmitSuccessful } } =
    useForm<FormData>({ resolver: zodResolver(schema) });
  const submit = async ({ currentPassword, newPassword }: FormData) => {
    try { await api.post('/auth/change-password', { currentPassword, newPassword }); reset(); }
    catch (error) { setError('root', { message: errorMessage(error) }); }
  };
  return <div className="grid gap-6 lg:grid-cols-2"><section className="card"><h2 className="section-title">Profile</h2>
    <dl className="mt-5 space-y-4"><div><dt className="text-xs text-slate-500">Name</dt><dd className="font-medium">{user?.name}</dd></div>
      <div><dt className="text-xs text-slate-500">Email</dt><dd className="font-medium">{user?.email}</dd></div>
      <div><dt className="text-xs text-slate-500">Role</dt><dd className="font-medium capitalize">{user?.role}</dd></div></dl></section>
    <form className="card" onSubmit={handleSubmit(submit)}><h2 className="section-title">Change password</h2>
      <label className="mt-5 block"><span className="label">Current password</span><input className="input" type="password" {...register('currentPassword')} /></label><p className="error">{errors.currentPassword?.message}</p>
      <label className="mt-4 block"><span className="label">New password</span><input className="input" type="password" {...register('newPassword')} /></label><p className="error">{errors.newPassword?.message}</p>
      <label className="mt-4 block"><span className="label">Confirm new password</span><input className="input" type="password" {...register('confirmPassword')} /></label><p className="error">{errors.confirmPassword?.message}</p>
      {errors.root && <div className="error-box mt-4">{errors.root.message}</div>}{isSubmitSuccessful && <div className="success-box mt-4">Password changed successfully.</div>}
      <button className="btn-primary mt-5" disabled={isSubmitting}>{isSubmitting ? 'Updating…' : 'Change password'}</button></form>
  </div>;
}
