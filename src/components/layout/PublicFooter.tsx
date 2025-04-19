'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderTop: '1px solid rgba(124, 77, 255, 0.08)',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  }
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
  }
}));

const sections = [
  {
    title: 'Study',
    links: [
      { text: 'N5 Kanji', href: '/n5-kanji-list' },
      { text: 'N4 Kanji', href: '/n4-kanji-list' },
      { text: 'N3 Kanji', href: '/n3-kanji-list' },
      { text: 'N2 Kanji', href: '/n2-kanji-list' },
      { text: 'N1 Kanji', href: '/n1-kanji-list' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { text: 'N5 Vocabulary', href: '/n5-vocabulary' },
      { text: 'N5 Verbs', href: '/n5-verbs' },
      { text: 'N5 Nouns', href: '/n5-nouns' },
      { text: 'N5 Adjectives', href: '/n5-adjectives' },
    ]
  },
  {
    title: 'Practice',
    links: [
      { text: 'N5 Stories', href: '/n5-stories' },
      { text: 'N5 Listening', href: '/n5-listening' },
      { text: 'Study Guide', href: '/study-guide' },
    ]
  },
];

export default function PublicFooter() {
  return (
    <FooterWrapper>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Image 
                    src="/logo.png" 
                    alt="JLPT Professor Logo" 
                    width={40} 
                    height={40}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'primary.main'
                    }}
                  >
                    JLPT Professor
                  </Typography>
                </Box>
              </Link>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                Your comprehensive guide to mastering Japanese language for JLPT success.
                Study kanji, vocabulary, and grammar with our structured learning system.
              </Typography>
            </Stack>
          </Grid>

          {sections.map((section) => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2
                }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    <Typography variant="body2">
                      {link.text}
                    </Typography>
                  </FooterLink>
                ))}
              </Stack>
            </Grid>
          ))}

          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}
            >
              Account
            </Typography>
            <Stack spacing={1.5}>
              <FooterLink href="/login">
                <Typography variant="body2">
                  Sign In
                </Typography>
              </FooterLink>
              <FooterLink href="/signup">
                <Typography variant="body2">
                  Sign Up
                </Typography>
              </FooterLink>
            </Stack>
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            mt: { xs: 4, md: 8 },
            pt: 3, 
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} JLPT Professor. All rights reserved.
          </Typography>
          <Stack 
            direction="row" 
            spacing={3}
            sx={{
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <FooterLink href="/privacy">
              <Typography variant="body2">
                Privacy Policy
              </Typography>
            </FooterLink>
            <FooterLink href="/terms">
              <Typography variant="body2">
                Terms of Service
              </Typography>
            </FooterLink>
          </Stack>
        </Box>
      </Container>
    </FooterWrapper>
  );
}
