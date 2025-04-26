import { Box, Container, Grid, Link as MuiLink, Typography } from '@mui/material';
import Link from 'next/link';
import { School } from '@mui/icons-material';

const footerLinks = [
  {
    title: 'Study',
    items: [
      { text: 'N5 Kanji', href: '/n5-kanji-list' },
      { text: 'N4 Kanji', href: '/n4-kanji-list' },
      { text: 'N5 Vocabulary', href: '/n5-vocabulary' },
      { text: 'Practice Tests', href: '/practice-test' },
    ],
  },
  {
    title: 'Account',
    items: [
      { text: 'Login', href: '/login' },
      { text: 'Sign Up', href: '/signup' },
    ],
  },
];

export default function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: '#ffffff',
        borderTop: '1px solid',
        borderColor: 'rgba(124, 77, 255, 0.08)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <School sx={{ fontSize: 40, color: '#7c4dff' }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#000000'
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 900, fontSize: 24 }}>JLPT</Box>
                    <Box component="span" sx={{ fontWeight: 400, fontSize: 18 }}>Professor</Box>
                  </Typography>
                </Box>
              </Link>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                Your comprehensive study companion for JLPT success. Practice kanji, vocabulary, and track your progress.
              </Typography>
            </Box>
          </Grid>
          {footerLinks.map((section) => (
            <Grid item xs={6} md={2} key={section.title}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        '&:hover': { color: '#7c4dff' }
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8 }}
        >
          &copy; {new Date().getFullYear()} JLPT Professor. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
