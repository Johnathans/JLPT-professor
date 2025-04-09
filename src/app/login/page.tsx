'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/utils/supabase/client'
import { getSiteUrl } from '@/utils/auth'

export default function LoginPage() {
  try {
    const supabase = createClient()
    const siteUrl = getSiteUrl()

    return (
      <div className="container-fluid p-0">
        <div className="row g-0" style={{ 
          minHeight: 'calc(100vh - 72px)' 
        }}>
          {/* Left column - Branding */}
          <div className="col-lg-6 d-none d-lg-flex flex-column px-4 px-lg-5 pt-5" style={{ backgroundColor: '#e8e3ff' }}>
            <div className="mx-auto w-100" style={{ maxWidth: '24rem' }}>
              <div className="d-none mb-4">
                {/* Spacer div to match right column structure */}
              </div>
              <div className="text-lg-start mb-4">
                <h1 className="display-5 fw-bold" style={{ color: '#1a1a1a' }}>
                  Welcome Back to JLPT Professor
                </h1>
                <p className="fs-5" style={{ color: '#4a4a4a' }}>
                  Continue your journey to JLPT success. Your personalized study plan is waiting for you.
                </p>
              </div>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center" style={{ color: '#4a4a4a' }}>
                  <svg className="me-3" style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track your daily progress
                </div>
                <div className="d-flex align-items-center" style={{ color: '#4a4a4a' }}>
                  <svg className="me-3" style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Review your study history
                </div>
                <div className="d-flex align-items-center" style={{ color: '#4a4a4a' }}>
                  <svg className="me-3" style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Continue where you left off
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className="col-12 col-lg-6 d-flex flex-column px-4 px-lg-5 pt-5">
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
                  Welcome back
                </h2>
                <p style={{ color: '#4a4a4a' }}>
                  Sign in to continue your studies
                </p>
              </div>
              <Auth
                supabaseClient={supabase}
                view="sign_in"
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
                    sign_in: {
                      email_label: 'Email address',
                      password_label: 'Password',
                      button_label: 'Sign in',
                      social_provider_text: 'Sign in with {{provider}}',
                      link_text: "Don't have an account? Sign up",
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
  } catch (error) {
    // If environment variables are missing, show a maintenance page
    return (
      <div className="container-fluid p-0">
        <div className="row g-0" style={{ 
          minHeight: 'calc(100vh - 72px)' 
        }}>
          <div className="col-12 d-flex flex-column px-4 px-lg-5 pt-5">
            <div className="mx-auto w-100" style={{ maxWidth: '24rem' }}>
              <div className="text-center text-lg-start mb-4">
                <h1 className="fs-2 fw-bold" style={{ color: '#1a1a1a' }}>
                  Maintenance Mode
                </h1>
                <p style={{ color: '#4a4a4a' }}>
                  We're currently performing some updates. Please check back soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
