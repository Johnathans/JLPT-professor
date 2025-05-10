"use client";

import AdminProtected from '../../components/AdminProtected';
import { Box } from '@mui/material';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtected>
      <Box sx={{ 
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        '& .MuiDrawer-root': {
          position: 'relative'
        }
      }}>
        {children}
      </Box>
    </AdminProtected>
  );
}
