import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAdminSignedIn } from "@/lib/admin-auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    if (!isAdminSignedIn()) throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});