'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Stack,
  TextField,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon } from '@mui/icons-material';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: '0 auto',
  width: '100%',
  padding: theme.spacing(3),
}));

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}));

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: 'John Smith',
    email: 'john@example.com',
    targetLevel: 'N3',
    studyGoal: '30 minutes daily',
  });

  const subscription = {
    plan: 'Premium Plan',
    status: 'Active',
    renewalDate: '2025-05-11',
    price: '$9.99/month',
  };

  return (
    <PageContainer>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
        Profile Settings
      </Typography>

      <Section>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#e8e3ff',
                  color: '#5e35b1',
                  fontSize: '3rem',
                }}
              >
                {userDetails.name.charAt(0)}
              </Avatar>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                sx={{ borderRadius: 2 }}
              >
                Change Photo
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Personal Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={userDetails.name}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={userDetails.email}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Target JLPT Level"
                    value={userDetails.targetLevel}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Study Goal"
                    value={userDetails.studyGoal}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{
                    bgcolor: isEditing ? '#00bfa5' : '#7c4dff',
                    '&:hover': {
                      bgcolor: isEditing ? '#00a392' : '#5e35b1',
                    },
                  }}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Section>

      <Section>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Subscription Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Plan
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {subscription.plan}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {subscription.status}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Next Renewal
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {subscription.renewalDate}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Price
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {subscription.price}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Manage Subscription
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel Subscription
          </Button>
        </Stack>
      </Section>
    </PageContainer>
  );
}
