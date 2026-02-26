import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAdminRole } from "@/hooks/useAdminRole";

interface AdminNavButtonProps {
  className?: string;
}

export default function AdminNavButton({ className }: AdminNavButtonProps) {
  const { isAdmin, isLoading } = useAdminRole();

  if (isLoading || !isAdmin) return null;

  return (
    <Link to="/admin/pedidos">
      <Button
        className={
          className ??
          "bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-6"
        }
      >
        <Shield className="w-4 h-4 mr-2" />
        Admin
      </Button>
    </Link>
  );
}
