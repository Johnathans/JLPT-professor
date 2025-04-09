'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/utils/supabase/client'
import { getSiteUrl } from '@/utils/auth'
import styles from '@/styles/signup.module.css';

export default function SignUpPage() {
  try {
    const supabase = createClient()
    const siteUrl = getSiteUrl()

    return (
      <div className={styles.containerFluid}>
        <div className={styles.row} style={{ 
          minHeight: 'calc(100vh - 72px)', 
          marginBottom: '-1px' // Just enough to overlap the footer border
        }}>
          {/* Left column - Branding */}
          <div className={styles.colLg6} style={{ backgroundColor: '#e8e3ff' }}>
            <div className={styles.mxAuto} style={{ maxWidth: '32rem' }}>
              <div className={styles.roundedCircle} style={{ width: '4rem', height: '4rem', backgroundColor: '#7c4dff' }}>
                <svg 
                  className={styles.textWhite} 
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
              <h1 className={styles.display5} style={{ color: '#1a1a1a' }}>
                Start Your JLPT Journey Today
              </h1>
              <p className={styles.fs5} style={{ color: '#4a4a4a' }}>
                Join thousands of students preparing for JLPT success. Track your progress, practice with flashcards, and learn at your own pace.
              </p>
              <div className={styles.dFlexFlexColumnGap3}>
                <div className={styles.dFlexAlignItemsCenter} style={{ color: '#4a4a4a' }}>
                  <svg className={styles.me3} style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Personalized study plans
                </div>
                <div className={styles.dFlexAlignItemsCenter} style={{ color: '#4a4a4a' }}>
                  <svg className={styles.me3} style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Smart flashcard system
                </div>
                <div className={styles.dFlexAlignItemsCenter} style={{ color: '#4a4a4a' }}>
                  <svg className={styles.me3} style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Progress tracking
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className={styles.col12ColLg6} style={{ backgroundColor: '#ffffff' }}>
            <div className={styles.mxAutoW100} style={{ maxWidth: '24rem' }}>
              <div className={styles.dLgNoneTextCenterMb4}>
                <div 
                  className={styles.mxAutoRoundedCircleDFlexAlignItemsCenterJustifyContentCenterMb3}
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
              <div className={styles.textCenterTextLgStartMb4}>
                <h2 className={styles.fs2FwBold} style={{ color: '#1a1a1a' }}>
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
                  variables: {
                    default: {
                      colors: {
                        brand: '#7c4dff',
                        brandAccent: '#5e35b1',
                      },
                    },
                  },
                  className: {
                    button: styles.signupButton
                  }
                }}
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
      <div className={styles.containerFluid}>
        <div className={styles.row} style={{ 
          minHeight: 'calc(100vh - 72px)', 
          marginBottom: '-1px'
        }}>
          <div className={styles.col12} style={{ backgroundColor: '#ffffff' }}>
            <div className={styles.mxAutoW100} style={{ maxWidth: '24rem' }}>
              <div className={styles.textCenterTextLgStartMb4}>
                <h1 className={styles.fs2FwBold} style={{ color: '#1a1a1a' }}>
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
