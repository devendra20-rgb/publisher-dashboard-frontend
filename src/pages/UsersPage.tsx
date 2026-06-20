import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api, { errorMessage } from "../api/axios";
import type { ApiResponse, Paginated, User } from "../types";
import ConfirmModal from "../modals/ConfirmModal";
import InputModal from "../modals/InputModal";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string(),
  role: z.literal("individual"),
  active: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function UsersPage() {
  const client = useQueryClient();
  const [editing, setEditing] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [pendingSave, setPendingSave] = useState<FormData | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [resetValue, setResetValue] = useState("");
  const [resetError, setResetError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "individual",
      active: true,
    },
  });
  useEffect(
    () =>
      reset(
        editing
          ? {
              name: editing.name,
              email: editing.email,
              password: "",
              role: "individual",
              active: editing.active,
            }
          : {
              name: "",
              email: "",
              password: "",
              role: "individual",
              active: true,
            },
      ),
    [editing, reset],
  );
  const users = useQuery({
    queryKey: ["users", search],
    queryFn: async () =>
      (
        await api.get<ApiResponse<Paginated<User>>>("/users", {
          params: { search, limit: 100 },
        })
      ).data.data,
  });
  const save = useMutation({
    mutationFn: (values: FormData) => {
      if (!editing && !passwordRule.test(values.password))
        throw new Error(
          "Password needs 8+ characters, uppercase, lowercase, number, and special character.",
        );
      return editing
        ? api.put(`/users/${editing._id}`, {
            name: values.name,
            email: values.email,
            role: values.role,
            active: values.active,
          })
        : api.post("/users", values);
    },
    onSuccess: () => {
      setPendingSave(null);
      setEditing(null);
      reset();
      client.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log(error);
      console.log(errorMessage(error));
      setError("root", { message: errorMessage(error) });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => { setPendingDelete(null); client.invalidateQueries({ queryKey: ["users"] }); },
  });
  const resetPassword = useMutation({ mutationFn: ({ id, password }: { id: string; password: string }) => api.patch(`/users/reset-password/${id}`, { password }), onSuccess: () => {
    setResetUser(null); setResetValue(""); setResetError("");
  }, onError: (error) => setResetError(errorMessage(error)) });
  const confirmReset = () => {
    if (!passwordRule.test(resetValue)) { setResetError("Use 8+ characters with uppercase, lowercase, number, and special character."); return; }
    if (resetUser?._id) resetPassword.mutate({ id: resetUser._id, password: resetValue });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="page-title">User management</h2>
        <p className="page-subtitle">
          Create and maintain individual user accounts.
        </p>
      </div>
      <form
        className="card mb-6"
        onSubmit={handleSubmit(setPendingSave)}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-title">
            {editing ? "Edit user" : "Create user"}
          </h3>
          {editing && (
            <button
              type="button"
              className="text-link"
              onClick={() => setEditing(null)}
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label>
            <span className="label">Name</span>
            <input className="input" {...register("name")} />
          </label>
          <label>
            <span className="label">Email</span>
            <input className="input" type="email" {...register("email")} />
          </label>
          {!editing && (
            <label>
              <span className="label">Temporary password</span>
              <input
                className="input"
                type="password"
                {...register("password")}
              />
            </label>
          )}
          <label>
            <span className="label">Role</span>
            <select className="input" {...register("role")}>
              <option value="individual">Individual</option>
            </select>
          </label>
          <label className="flex items-center gap-2 self-end py-3">
            <input type="checkbox" {...register("active")} /> Active account
          </label>
        </div>
        {(errors.root || errors.name || errors.email) && (
          <p className="error mt-3">
            {errors.root?.message || "Please correct the form."}
          </p>
        )}
        <button className="btn-primary mt-4" disabled={save.isPending}>
          {save.isPending ? "Saving…" : editing ? "Update user" : "Create user"}
        </button>
      </form>
      <div className="mb-4">
        <input
          className="input max-w-sm"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {(users.error || remove.error) && (
        <div className="error-box mb-4">
          {errorMessage(users.error || remove.error)}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.data?.data.map((item) => (
              <tr key={item._id}>
                <td className="font-medium">{item.name}</td>
                <td>{item.email}</td>
                <td className="capitalize">{item.role}</td>
                <td>{item.active ? "Yes" : "No"}</td>
                <td>
                  <div className="flex flex-wrap gap-3">
                    {item.role !== "admin" && (
                      <>
                        <button
                          className="text-link"
                          onClick={() => setEditing(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-link"
                          onClick={() => { setResetUser(item); setResetValue(""); setResetError(""); }}
                        >
                          Reset password
                        </button>
                        <button
                          className="text-sm text-red-600"
                          onClick={() => setPendingDelete(item)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal open={Boolean(pendingSave)} title={editing ? "Update User?" : "Create User?"} message={editing ? "Save these changes to this user account?" : "Create this Individual user account?"} confirmLabel={editing ? "Update User" : "Create User"} pending={save.isPending} onCancel={() => setPendingSave(null)} onConfirm={() => pendingSave && save.mutate(pendingSave)} />
      <ConfirmModal open={Boolean(pendingDelete)} title="Delete User?" message={`Delete ${pendingDelete?.name || "this user"}? This cannot be undone.`} confirmLabel="Delete User" danger pending={remove.isPending} onCancel={() => setPendingDelete(null)} onConfirm={() => pendingDelete?._id && remove.mutate(pendingDelete._id)} />
      <InputModal open={Boolean(resetUser)} title="Reset Password" message={`Set a new temporary password for ${resetUser?.name || "this user"}.`} label="Temporary Password" type="password" value={resetValue} error={resetError} pending={resetPassword.isPending} confirmLabel="Reset Password" onChange={(value) => { setResetValue(value); setResetError(""); }} onCancel={() => { setResetUser(null); setResetValue(""); setResetError(""); }} onConfirm={confirmReset} />
    </div>
  );
}
