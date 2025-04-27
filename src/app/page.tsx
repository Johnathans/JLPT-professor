import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { Book, GraduationCap, Brain, CheckCircle } from 'lucide-react';
import KanjiGrid from './components/KanjiGrid';
import manOnMobile from '../images/man-on-jlpt-professor.jpg';
import womanOnDesktop from '../images/woman-on-jlpt-professor.jpg';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Keep existing hero section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroMain}>
              <h1 className={styles.title}>
                Study Smarter. Pass Faster.
                <span className={styles.highlight}> Your JLPT Journey Starts Here</span>
              </h1>
              <p className={styles.subtitle}>
                Master Japanese faster with personalized learning paths, 
                real-time feedback, and adaptive practice sessions.
              </p>
              <div className={styles.ctaSection}>
                <Link href="/signup" className={styles.ctaButton}>
                  Start Learning Free
                </Link>
                <p className={styles.ctaNote}>
                  7-day free trial • No credit card required
                </p>
              </div>
            </div>

            <div className={styles.heroImage}>
              <KanjiGrid />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Everything You Need to Pass the JLPT</h2>
          <p className={styles.sectionSubtitle}>
            Comprehensive study tools designed specifically for JLPT success
          </p>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Brain />
              </div>
              <h3>SRS Flashcard System</h3>
              <p>Master kanji and vocabulary systematically with our proven spaced repetition system</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Book />
              </div>
              <h3>Complete JLPT Coverage</h3>
              <p>Comprehensive study materials for all JLPT levels from N5 to N1</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <GraduationCap />
              </div>
              <h3>Smart Progress Tracking</h3>
              <p>Track your learning journey with detailed progress analytics and insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learn Anywhere Section */}
      <section className={styles.learnAnywhere}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Learn when and where you want</h2>
          <p className={styles.sectionSubtitle}>
            Study on your schedule with our mobile and desktop apps
          </p>

          <div className={styles.learnGrid}>
            <div className={styles.learnCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={manOnMobile}
                  alt="Man using JLPT Professor mobile app"
                  placeholder="blur"
                  priority
                  className={styles.learnImage}
                />
              </div>
              <h3>Learn on mobile</h3>
              <p>Take your study materials anywhere with our mobile app</p>
              <Link href="/signup" className={styles.mobileCta}>
                Get the mobile app
              </Link>
            </div>

            <div className={styles.learnCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={womanOnDesktop}
                  alt="Woman using JLPT Professor desktop version"
                  placeholder="blur"
                  priority
                  className={styles.learnImage}
                />
              </div>
              <h3>Learn on desktop</h3>
              <p>Enjoy a full-featured experience on your computer</p>
              <Link href="/signup" className={styles.desktopCta}>
                Try JLPT Professor for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Study Path Section */}
      <section className={styles.studyPath}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Clear Path to Success</h2>
          <p className={styles.sectionSubtitle}>
            Follow our structured learning path from N5 to N1
          </p>

          <div className={styles.levelPath}>
            {['N5', 'N4', 'N3', 'N2', 'N1'].map((level, index) => (
              <div key={level} className={styles.levelNode}>
                <div className={styles.levelBadge}>{level}</div>
                <div className={styles.levelStats}>
                  {level === 'N5' && '100+ Kanji • 800+ Words'}
                  {level === 'N4' && '300+ Kanji • 1,500+ Words'}
                  {level === 'N3' && '650+ Kanji • 3,750+ Words'}
                  {level === 'N2' && '1,000+ Kanji • 6,000+ Words'}
                  {level === 'N1' && '2,000+ Kanji • 10,000+ Words'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <p className={styles.sectionSubtitle}>
            Choose the plan that works best for you
          </p>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3>Monthly Plan</h3>
              <div className={styles.price}>
                <span className={styles.amount}>$7.99</span>
                <span className={styles.period}>/month</span>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>
                  <CheckCircle size={16} />
                  <span>All JLPT levels (N5-N1)</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>SRS Flashcard system</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Progress tracking</span>
                </li>
              </ul>
              <Link href="/signup" className={styles.pricingCta}>
                Start Free Trial
              </Link>
            </div>

            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <div className={styles.featuredBadge}>SAVE 38%</div>
              <h3>Annual Plan</h3>
              <div className={styles.price}>
                <span className={styles.amount}>$59</span>
                <span className={styles.period}>/year</span>
              </div>
              <div className={styles.monthlyPrice}>Just $4.92/month</div>
              <ul className={styles.pricingFeatures}>
                <li>
                  <CheckCircle size={16} />
                  <span>All JLPT levels (N5-N1)</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>SRS Flashcard system</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Progress tracking</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>2 months free</span>
                </li>
              </ul>
              <Link href="/signup" className={styles.pricingCta}>
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Start Your JLPT Journey Today</h2>
          <p className={styles.sectionSubtitle}>
            Join thousands of students preparing for JLPT success
          </p>
          <Link href="/signup" className={styles.ctaButton}>
            Start Learning Free
          </Link>
          <p className={styles.ctaNote}>
            7-day free trial • No credit card required
          </p>
        </div>
      </section>
    </main>
  );
}
