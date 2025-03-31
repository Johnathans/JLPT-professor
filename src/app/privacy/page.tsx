'use client';

import styles from './page.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Information Collection</h2>
          <p>
            JLPT Professor is committed to protecting your privacy. We only collect information
            that is necessary to provide and improve our service.
          </p>
          <h3>We collect:</h3>
          <ul className={styles.list}>
            <li>Study progress and performance data</li>
            <li>Usage statistics to improve our service</li>
            <li>Technical information for service optimization</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How We Use Your Information</h2>
          <p>
            The information we collect is used to:
          </p>
          <ul className={styles.list}>
            <li>Track and save your study progress</li>
            <li>Improve our learning materials and user experience</li>
            <li>Provide personalized learning recommendations</li>
            <li>Fix technical issues and optimize performance</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Data Protection</h2>
          <p>
            We implement appropriate security measures to protect your information from
            unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className={styles.list}>
            <li>Access your personal data</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of data collection</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
