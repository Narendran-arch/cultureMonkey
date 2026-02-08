import { useUsers } from "../hooks/useUsers";
import UserList from "../components/users/UserList";

export default function UsersPage() {
  const { users, error } = useUsers();

  if (error) return <p>{error}</p>;

  return <UserList users={users} />;
}
