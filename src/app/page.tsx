import Link from 'next/link';
import styles from './page.module.css';
import { FaGraduationCap, FaBook, FaHeadphones, FaChartLine, FaLanguage, FaCertificate } from 'react-icons/fa';
import { HiOutlineBookOpen, HiOutlineLightningBolt, HiOutlineAcademicCap } from 'react-icons/hi';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h1 className={styles.title}>
                Master Japanese{' '}
                <span className={styles.titleAccent}>One Step at a Time</span>
              </h1>
              <p className={styles.subtitle}>
                Your comprehensive study companion for the Japanese Language Proficiency Test. Structured learning paths, practice exercises, and real-time progress tracking.
              </p>
              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <FaBook className={styles.statIcon} />
                  <span className={styles.statValue}>5,000+</span>
                  <span className={styles.statLabel}>Common Words</span>
                </div>
                <div className={styles.statCard}>
                  <FaLanguage className={styles.statIcon} />
                  <span className={styles.statValue}>2,136</span>
                  <span className={styles.statLabel}>Kanji</span>
                </div>
                <div className={styles.statCard}>
                  <FaCertificate className={styles.statIcon} />
                  <span className={styles.statValue}>N5-N1</span>
                  <span className={styles.statLabel}>All Levels</span>
                </div>
              </div>
              <div className={styles.heroCta}>
                <Link href="/signup" className={styles.ctaButton}>
                  <FaGraduationCap /> Start Learning
                </Link>
                <Link href="/about" className={styles.learnMoreButton}>
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.levelGrid}>
                <Link href="/n5" className={`${styles.levelCard} ${styles.n5Card}`}>
                  <div className={styles.levelBadge}>N5</div>
                  <h3>Basic</h3>
                </Link>
                <Link href="/n4" className={`${styles.levelCard} ${styles.n4Card}`}>
                  <div className={styles.levelBadge}>N4</div>
                  <h3>Elementary</h3>
                </Link>
                <Link href="/n3" className={`${styles.levelCard} ${styles.n3Card}`}>
                  <div className={styles.levelBadge}>N3</div>
                  <h3>Intermediate</h3>
                </Link>
                <Link href="/n2" className={`${styles.levelCard} ${styles.n2Card}`}>
                  <div className={styles.levelBadge}>N2</div>
                  <h3>Pre-Advanced</h3>
                </Link>
                <Link href="/n1" className={`${styles.levelCard} ${styles.n1Card}`}>
                  <div className={styles.levelBadge}>N1</div>
                  <h3>Advanced</h3>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Choose JLPT Professor?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaBook />
            </div>
            <h3>Interactive Stories</h3>
            <p>Learn through engaging stories that use vocabulary and grammar from your current level</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaHeadphones />
            </div>
            <h3>Audio Support</h3>
            <p>Practice listening with native pronunciation for all vocabulary and example sentences</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaChartLine />
            </div>
            <h3>Progress Tracking</h3>
            <p>Monitor your learning progress and review statistics across all JLPT levels</p>
          </div>
        </div>
      </section>

      {/* Study Paths Section */}
      <section className={styles.levels}>
        <h2 className={styles.sectionTitle}>Choose Your Study Path</h2>
        <div className={styles.pathGrid}>
          <div className={styles.pathCard}>
            <div className={styles.pathHeader}>
              <h3>Beginner</h3>
              <span className={styles.pathBadge}>N5-N4</span>
            </div>
            <p>Perfect for those starting their Japanese journey. Build a strong foundation in basic grammar and essential vocabulary.</p>
            <ul className={styles.pathList}>
              <li>Basic grammar patterns</li>
              <li>800+ essential words</li>
              <li>100+ kanji characters</li>
              <li>Simple conversations</li>
            </ul>
            <Link href="/beginner" className={styles.pathButton}>
              Start Beginner Path
            </Link>
          </div>

          <div className={styles.pathCard}>
            <div className={styles.pathHeader}>
              <h3>Intermediate</h3>
              <span className={styles.pathBadge}>N3</span>
            </div>
            <p>Advance your skills with more complex grammar and vocabulary. Start reading and understanding native materials.</p>
            <ul className={styles.pathList}>
              <li>Intermediate grammar</li>
              <li>1500+ vocabulary</li>
              <li>300+ kanji</li>
              <li>Natural conversations</li>
            </ul>
            <Link href="/intermediate" className={styles.pathButton}>
              Start Intermediate Path
            </Link>
          </div>

          <div className={styles.pathCard}>
            <div className={styles.pathHeader}>
              <h3>Advanced</h3>
              <span className={styles.pathBadge}>N2-N1</span>
            </div>
            <p>Master advanced concepts and prepare for professional Japanese use. Tackle complex texts and nuanced expressions.</p>
            <ul className={styles.pathList}>
              <li>Advanced grammar</li>
              <li>2000+ vocabulary</li>
              <li>1000+ kanji</li>
              <li>Business Japanese</li>
            </ul>
            <Link href="/advanced" className={styles.pathButton}>
              Start Advanced Path
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
