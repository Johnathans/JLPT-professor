'use client';

import DashboardLayout from '../dashboard/layout';

export default function DecksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
