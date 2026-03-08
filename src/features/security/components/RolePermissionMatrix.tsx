import React from "react";

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

interface RolePermissionMatrixProps {
  roles: UserRole[];
  className?: string;
  isLoading?: boolean;
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({
  roles,
  className = "",
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div
        className={`overflow-x-auto bg-white border border-[#f3f1f1] rounded-xl shadow-sm animate-pulse ${className}`}
      >
        <table className="w-full text-left bg-white whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#f3f1f1] bg-[#fcfcfc]">
              <th className="p-4 w-1/4">
                <div className="h-4 bg-[#f3f1f1] rounded"></div>
              </th>
              <th className="p-4">
                <div className="h-4 bg-[#f3f1f1] rounded"></div>
              </th>
              <th className="p-4">
                <div className="h-4 bg-[#f3f1f1] rounded"></div>
              </th>
              <th className="p-4">
                <div className="h-4 bg-[#f3f1f1] rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-[#f3f1f1]">
                <td className="p-4">
                  <div className="h-4 bg-[#f3f1f1] rounded w-24"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 w-4 bg-[#f3f1f1] rounded-full mx-auto"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 w-4 bg-[#f3f1f1] rounded-full mx-auto"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 w-4 bg-[#f3f1f1] rounded-full mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Extract all unique permissions across all roles to form the columns
  const allPermissionsSet = new Set<string>();
  roles.forEach((role) =>
    role.permissions.forEach((p) => allPermissionsSet.add(p)),
  );
  const allPermissions = Array.from(allPermissionsSet).sort();

  if (roles.length === 0) {
    return (
      <div
        className={`text-center py-12 bg-[#fcfcfc] rounded-xl border border-dashed border-[#f3f1f1] ${className}`}
      >
        <p className="text-[#806b6b] font-medium">
          No roles or permissions configured.
        </p>
      </div>
    );
  }

  // Helper to format permission strings (e.g. from 'view_audit_logs' to 'View Audit Logs')
  const formatPermissionName = (perm: string) => {
    return perm
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div
      className={`overflow-x-auto overflow-y-hidden bg-white border border-[#f3f1f1] rounded-xl shadow-sm ${className}`}
    >
      <table className="w-full text-left bg-white whitespace-nowrap">
        <thead>
          <tr className="border-b border-[#f3f1f1] bg-[#fcfcfc]">
            <th className="p-4 sticky left-0 bg-[#fcfcfc] z-10 border-r border-[#f3f1f1] min-w-[150px]">
              <span className="text-xs font-bold text-[#806b6b] uppercase tracking-wider">
                Role
              </span>
            </th>
            {allPermissions.map((permission) => (
              <th key={permission} className="p-4 text-center min-w-[120px]">
                <span className="text-xs font-bold text-[#806b6b] uppercase tracking-wider">
                  {formatPermissionName(permission)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f3f1f1] text-sm">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-[#fcfcfc] transition-colors">
              <td className="p-4 sticky left-0 bg-white group-hover:bg-[#fcfcfc] z-10 border-r border-[#f3f1f1] font-medium text-[#1e1414]">
                {role.name}
              </td>
              {allPermissions.map((permission) => {
                const hasPermission = role.permissions.includes(permission);
                return (
                  <td
                    key={`${role.id}-${permission}`}
                    className="p-4 text-center"
                  >
                    {hasPermission ? (
                      <svg
                        className="w-5 h-5 mx-auto text-[#2E7D32]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-[#D2D2D2] text-xl font-bold block leading-none select-none">
                        —
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
