'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/utils/supabase/client'
import { getSiteUrl } from '@/utils/auth'

export default function SignUpPage() {
  const supabase = createClient()
  const siteUrl = getSiteUrl()

  return (
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ 
        minHeight: 'calc(100vh - 72px)', 
        marginBottom: '-1px' // Just enough to overlap the footer border
      }}>
        {/* Left column - Branding */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center px-5" style={{ backgroundColor: '#e8e3ff' }}>
          <div className="mx-auto" style={{ maxWidth: '32rem' }}>
            <div className="rounded-4 d-flex align-items-center justify-content-center mb-4" 
                 style={{ width: '4rem', height: '4rem', backgroundColor: '#7c4dff' }}>
              <svg 
                className="text-white" 
                style={{ width: '2.5rem', height: '2.5rem' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2}
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <h1 className="display-5 fw-bold mb-4" style={{ color: '#1a1a1a' }}>
              Start Your JLPT Journey Today
            </h1>
            <p className="fs-5 mb-5" style={{ color: '#4a4a4a' }}>
              Join thousands of students preparing for JLPT success. Track your progress, practice with flashcards, and learn at your own pace.
            </p>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center" style={{ color: '#4a4a4a' }}>
                <svg className="me-3" style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Personalized study plans
              </div>
              <div className="d-flex align-items-center" style={{ color: '#4a4a4a' }}>
                <svg className="me-3" style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Smart flashcard system
              </div>
              <div className="d-flex align-items-center" style={{ color: '#4a4a4a' }}>
                <svg className="me-3" style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Progress tracking
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Form */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center px-4 px-lg-5">
          <div className="mx-auto w-100" style={{ maxWidth: '24rem' }}>
            <div className="d-lg-none text-center mb-4">
              <div 
                className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{ width: '4rem', height: '4rem', backgroundColor: '#e8e3ff' }}
              >
                <svg 
                  style={{ width: '2rem', height: '2rem', color: '#7c4dff' }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2}
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center text-lg-start mb-4">
              <h2 className="fs-2 fw-bold" style={{ color: '#1a1a1a' }}>
                Create your account
              </h2>
              <p style={{ color: '#4a4a4a' }}>
                Start learning Japanese with JLPT Professor
              </p>
            </div>
            <Auth
              supabaseClient={supabase}
              view="sign_up"
              appearance={{
                theme: ThemeSupa,
                style: {
                  container: {
                    width: '100%',
                  },
                  button: {
                    background: '#7c4dff',
                    color: 'white',
                    borderRadius: '0.5rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    height: 'auto',
                    '&:hover': {
                      background: '#5e35b1',
                    },
                  },
                  input: {
                    borderRadius: '0.5rem',
                    border: '1px solid #dee2e6',
                    padding: '0.75rem 1rem',
                    width: '100%',
                    marginBottom: '1rem',
                  },
                  label: {
                    color: '#4a4a4a',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                  },
                  message: {
                    color: '#dc3545',
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                  },
                  anchor: {
                    color: '#7c4dff',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#5e35b1',
                      textDecoration: 'underline',
                    },
                  },
                  divider: {
                    background: '#dee2e6',
                    margin: '1.5rem 0',
                  },
                },
                variables: {
                  default: {
                    colors: {
                      brand: '#7c4dff',
                      brandAccent: '#5e35b1',
                      inputBackground: 'white',
                      inputText: '#1a1a1a',
                      inputBorder: '#dee2e6',
                      inputBorderHover: '#7c4dff',
                      inputBorderFocus: '#7c4dff',
                    },
                  },
                },
              }}
              localization={{
                variables: {
                  sign_up: {
                    email_label: 'Email address',
                    password_label: 'Create a password',
                    button_label: 'Create account',
                    social_provider_text: 'Sign up with {{provider}}',
                    link_text: 'Already have an account? Sign in',
                  },
                },
              }}
              theme="light"
              providers={['google']}
              redirectTo={`${siteUrl}/auth/callback`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
