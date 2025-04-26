'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Switch,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle } from '@mui/icons-material';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';

const PricingCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: '16px',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const features = [
  'Access to all JLPT study materials (N5-N1)',
  'Personalized study plans',
  'Progress tracking',
  'Practice tests and quizzes',
  'Spaced repetition flashcards',
  'Audio pronunciation guides',
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const monthlyPrice = 7.99;
  const annualPrice = 59.00; // ~$4.92/month, saving ~38%
  const monthlyPriceFormatted = monthlyPrice.toFixed(2);
  const annualPriceFormatted = annualPrice.toFixed(2);
  const annualMonthlyPrice = (annualPrice / 12).toFixed(2);

  return (
    <PublicLayout>
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 2,
                color: '#1e293b'
              }}
            >
              Start Your JLPT Journey Today
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ 
                mb: 4, 
                maxWidth: '800px', 
                mx: 'auto',
                fontSize: { xs: '1.125rem', md: '1.25rem' }
              }}
            >
              Join thousands of successful students who have passed the JLPT with our comprehensive study system
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              <Typography variant="h6" color="text.secondary">Monthly</Typography>
              <Switch
                checked={isAnnual}
                onChange={(e) => setIsAnnual(e.target.checked)}
                color="primary"
              />
              <Box sx={{ position: 'relative' }}>
                <Typography variant="h6" color="text.secondary">Annual</Typography>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '-24px',
                    right: '-40px',
                    backgroundColor: '#7c4dff',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  Save 38%
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 4,
                maxWidth: '1000px',
                mx: 'auto',
              }}
            >
              {/* Monthly Plan */}
              <PricingCard elevation={isAnnual ? 1 : 4}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" component="div" gutterBottom fontWeight={600}>
                    Monthly Plan
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h3" component="span" fontWeight={800}>
                      ${isAnnual ? annualMonthlyPrice : monthlyPriceFormatted}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                      /month
                    </Typography>
                  </Box>
                  {isAnnual && (
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}
                    >
                      Billed annually at ${annualPriceFormatted}
                    </Typography>
                  )}
                  <List dense>
                    {features.map((feature) => (
                      <ListItem key={feature} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ color: '#7c4dff', fontSize: '1.25rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{
                            fontSize: '0.9375rem',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Link href="/signup" style={{ width: '100%', textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        bgcolor: '#7c4dff',
                        color: 'white',
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#6c3fff',
                        },
                      }}
                    >
                      Get Started Now
                    </Button>
                  </Link>
                </CardActions>
              </PricingCard>

              {/* Annual Plan */}
              <PricingCard elevation={isAnnual ? 4 : 1}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: '#7c4dff',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  BEST VALUE
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" component="div" gutterBottom fontWeight={600}>
                    Annual Plan
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h3" component="span" fontWeight={800}>
                      ${annualPriceFormatted}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                      /year
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}
                  >
                    Just ${annualMonthlyPrice}/month, billed annually
                  </Typography>
                  <List dense>
                    {[...features, '2 months free compared to monthly plan'].map((feature) => (
                      <ListItem key={feature} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ color: '#7c4dff', fontSize: '1.25rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{
                            fontSize: '0.9375rem',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Link href="/signup" style={{ width: '100%', textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        bgcolor: '#7c4dff',
                        color: 'white',
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#6c3fff',
                        },
                      }}
                    >
                      Get Started Now
                    </Button>
                  </Link>
                </CardActions>
              </PricingCard>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              30-day money-back guarantee • Cancel anytime • Secure payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
}
