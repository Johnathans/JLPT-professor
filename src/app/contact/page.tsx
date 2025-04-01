'use client';

import styles from './page.module.css';

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>
      <div className={styles.content}>
        <section className={styles.section}>
          <p className={styles.intro}>
            Have questions or feedback? We&apos;d love to hear from you! Please fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </section>

        <div className={styles.contactGrid}>
          <section className={styles.contactCard}>
            <h2>General Inquiries</h2>
            <p>For general questions about JLPT Professor</p>
            <a href="mailto:info@jlptprofessor.com" className={styles.contactLink}>
              info@jlptprofessor.com
            </a>
          </section>

          <section className={styles.contactCard}>
            <h2>Technical Support</h2>
            <p>Need help with the platform?</p>
            <a href="mailto:support@jlptprofessor.com" className={styles.contactLink}>
              support@jlptprofessor.com
            </a>
          </section>

          <section className={styles.contactCard}>
            <h2>Content Feedback</h2>
            <p>Help us improve our study materials</p>
            <a href="mailto:content@jlptprofessor.com" className={styles.contactLink}>
              content@jlptprofessor.com
            </a>
          </section>
        </div>

        <section className={styles.section}>
          <h2>Response Time</h2>
          <p>
            We strive to respond to all inquiries within 24-48 hours during business days.
            For faster responses, please make sure to include relevant details in your message.
          </p>
        </section>
      </div>
    </div>
  );
}
