import { Eye, Pencil, Trash } from "lucide-react";
import Badge from "../ui/Badge";
import { useNavigate } from "react-router-dom";

export default function UserTableRow({ user, onToggle, onDelete, onMigrate }) {
  const navigate = useNavigate();

  return (
    <tr className="border-t hover:bg-gray-50 transition text-xs sm:text-sm">
      <td className="p-4 font-medium whitespace-nowrap">
        {user.first_name} {user.last_name}
      </td>

      <td className="truncate max-w-[160px] sm:max-w-none">{user.email}</td>

      <td className="hidden sm:table-cell">{user.company_name || "-"}</td>

      <td className="hidden md:table-cell">{user.designation}</td>

      <td>
        <Badge active={user.is_active} />
      </td>

      <td className="flex flex-wrap sm:flex-nowrap justify-end gap-3 pr-4 sm:pr-6 py-4 items-center">
        <Eye size={16} className="cursor-pointer text-gray-500" onClick={()=> navigate(`/users/${user.id}`)} />

        <Pencil
          size={16}
          className="cursor-pointer text-gray-500"
          onClick={() => navigate(`/users/${user.id}/edit`)}
        />

        <span
          onClick={() => onToggle(user)}
          className="text-xs sm:text-sm cursor-pointer text-blue-600"
        >
          {user.is_active ? "Deactivate" : "Activate"}
        </span>

        <Trash
          size={16}
          className="cursor-pointer text-red-500"
          onClick={() => onDelete(user.id)}
        />
        <button
          onClick={onMigrate}
          className="text-blue-600 hover:underline text-sm mr-3"
        >
          Migrate
        </button>
      </td>
    </tr>
  );
}
