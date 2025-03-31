'use client';

import styles from './page.module.css';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms of Service</h1>
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using JLPT Professor, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials on JLPT Professor for personal,
            non-commercial use. This is the grant of a license, not a transfer of title.
          </p>
          <ul className={styles.list}>
            <li>The materials cannot be redistributed or used for commercial purposes</li>
            <li>All content remains the property of JLPT Professor</li>
            <li>Any unauthorized use terminates the permission granted</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Disclaimer</h2>
          <p>
            The materials on JLPT Professor are provided on an 'as is' basis. We make no
            warranties, expressed or implied, and hereby disclaim and negate all other warranties
            including, without limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Limitations</h2>
          <p>
            JLPT Professor shall not be held liable for any damages arising out of the use
            or inability to use the materials on our website.
          </p>
        </section>
      </div>
    </div>
  );
}
