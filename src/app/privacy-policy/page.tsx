
import Link from "next/link";
import { GraduationCap, Building2, Briefcase, ChevronRight, Shield, Lock, Eye, Globe } from "lucide-react";

const sections = [
  { id: "section-1", title: "1. Personal Data We Collect" },
  { id: "section-2", title: "2. How We Collect Data" },
  { id: "section-3", title: "3. Purpose of Processing" },
  { id: "section-4", title: "4. Legal Basis for Processing" },
  { id: "section-5", title: "5. Data Sharing and Disclosure" },
  { id: "section-6", title: "6. Cross-Border Data Transfers" },
  { id: "section-7", title: "7. Data Retention" },
  { id: "section-8", title: "8. Data Security" },
  { id: "section-9", title: "9. Your Rights Under DPDP Act" },
  { id: "section-10", title: "10. International User Rights" },
  { id: "section-11", title: "11. Children's Privacy" },
  { id: "section-12", title: "12. Cookies and Tracking Technologies" },
  { id: "section-13", title: "13. Grievance Officer" },
  { id: "section-14", title: "14. Data Breach Notification" },
  { id: "section-15", title: "15. Automated Decision-Making and AI" },
  { id: "section-16", title: "16. Marketing Communications" },
  { id: "section-17", title: "17. Third-Party Websites" },
  { id: "section-18", title: "18. Updates to This Policy" },
  { id: "section-19", title: "19. Consent and Acceptance" },
  { id: "section-20", title: "20. Contact Information" },
  { id: "section-21", title: "21. Data Protection Authority" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-[120px]">
      <h2 className="text-xl md:text-2xl font-bold text-navy mb-4 pb-2 border-b border-accent/20">
        {title}
      </h2>
      <div className="space-y-4 text-slate-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-6 space-y-2 text-slate-700">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal pl-6 space-y-2 text-slate-700">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-navy to-royal text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Privacy Policy</span>
            </div>
            <Link
              href="/signup"
              className="bg-accent hover:bg-orange-600 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 text-sm"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Signup
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-white/80 max-w-3xl">
            This Privacy Policy describes how StrideNex Private Limited collects, uses, processes, stores, shares, and protects your personal data.
          </p>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Data Protection</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Globe className="w-4 h-4" />
              <span className="text-sm">DPDP Act 2023</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents - Sticky Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-[120px] bg-white rounded-xl shadow-lg border border-primary/10 p-6">
            <h3 className="font-bold text-navy mb-4 pb-2 border-b border-accent/20">
              Contents
            </h3>
            <ul className="space-y-2 text-sm max-h-[70vh] overflow-y-auto pr-2">
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="text-slate-600 hover:text-accent hover:underline transition-colors block py-1"
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">Last Updated: March 2026</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-primary/10 p-8 md:p-12 space-y-12">

          {/* Introduction */}
          <div className="bg-gradient-to-r from-accent/5 to-orange-600/5 rounded-xl p-6 border-l-4 border-accent">
            <p className="text-slate-700 leading-relaxed">
              This Privacy Policy describes how <strong>StrideNex Private Limited</strong> ("StrideNex", "Company", "we", "us", or "our"), a company incorporated under the Companies Act, 2013 and having its registered office at Pune, Maharashtra, India, collects, uses, processes, stores, shares, and protects personal data when you access or use our websites, mobile applications, AI products, software platforms, and services (collectively, the <strong>"Platform"</strong>). This Policy is aligned with the <strong>Digital Personal Data Protection Act, 2023 (India)</strong> ("PDPP Act") and other applicable data protection laws and regulations.
            </p>
          </div>

          <Section id="section-1" title="1. PERSONAL DATA WE COLLECT">
            <div className="space-y-4">
              <p>We may collect the following categories of personal data from you:</p>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">1.1 Identity and Contact Information</h3>
                <BulletList items={[
                  "Full name",
                  "Email address",
                  "Phone number (mobile and/or landline)",
                  "Organization or institution name",
                  "Residential or correspondence address",
                  "Date of birth or age"
                ]} />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">1.2 Account Information</h3>
                <BulletList items={[
                  "Username and login credentials",
                  "User profile details (education, skills, interests, career goals)",
                  "Preferences and settings",
                  "Profile photograph (if provided)"
                ]} />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">1.3 Educational and Professional Data</h3>
                <BulletList items={[
                  "Academic qualifications and credentials",
                  "Educational institution details",
                  "Work experience and employment history",
                  "Skills, certifications, and specializations",
                  "Career aspirations and learning goals",
                  "Project submissions, assignments, and assessment data"
                ]} />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">1.4 Transaction and Payment Data</h3>
                <BulletList items={[
                  "Subscription details and purchase history",
                  "Payment method information (processed securely via third-party payment gateways)",
                  "Billing and invoicing information",
                  "Transaction identifiers and timestamps"
                ]} />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">1.5 Technical and Device Data</h3>
                <BulletList items={[
                  "IP address and geolocation data",
                  "Browser type, version, and language settings",
                  "Operating system and device information (type, model, manufacturer)",
                  "Device identifiers (IMEI, MAC address, device ID)",
                  "Usage logs, access times, and session data",
                  "Cookies, web beacons, and similar tracking technologies"
                ]} />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">1.6 Communication and Interaction Data</h3>
                <BulletList items={[
                  "Emails, messages, and support queries sent to us",
                  "Feedback, reviews, ratings, and testimonials",
                  "Survey responses",
                  "Chat transcripts and call recordings (with your consent)",
                  "User-generated content submitted on the Platform"
                ]} />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">1.7 AI Interaction Data</h3>
                <BulletList items={[
                  "Input queries, prompts, and commands provided to AI systems",
                  "AI-generated recommendations, skill paths, and outputs",
                  "Usage patterns and interaction history with AI features",
                  "Learning progress, performance analytics, and assessment results"
                ]} />
              </div>
            </div>
          </Section>

          <Section id="section-2" title="2. HOW WE COLLECT DATA">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">2.1 Information You Provide Directly</h3>
              <p>We collect personal data when you:</p>
              <NumberedList items={[
                "Register or create an account on the Platform",
                "Subscribe to our services or purchase products",
                "Complete forms, surveys, or questionnaires",
                "Contact our support team or customer service",
                "Submit User Content (projects, assignments, feedback)",
                "Participate in webinars, events, or community forums",
                "Communicate with us via email, phone, or chat"
              ]} />

              <h3 className="font-semibold text-navy mt-4">2.2 Information Collected Automatically</h3>
              <p>Certain technical and usage data is collected automatically through:</p>
              <BulletList items={[
                "Cookies, web beacons, and similar tracking technologies",
                "Analytics tools (e.g., Google Analytics, Mixpanel)",
                "Server logs and access logs",
                "AI interaction monitoring and learning analytics"
              ]} />

              <h3 className="font-semibold text-navy mt-4">2.3 Information from Third Parties</h3>
              <p>We may receive personal data from:</p>
              <BulletList items={[
                "Third-party service providers (payment processors, cloud hosting partners, analytics providers)",
                "Educational institutions or employers partnered with us",
                "Social media platforms (if you link your account or use social login)",
                "Publicly available sources (with your consent or as permitted by law)"
              ]} />
            </div>
          </Section>

          <Section id="section-3" title="3. PURPOSE OF PROCESSING">
            <div className="space-y-4">
              <p>We process personal data for the following purposes:</p>

              <h3 className="font-semibold text-navy">3.1 Service Delivery and Platform Operations</h3>
              <NumberedList items={[
                "To provide, operate, maintain, and improve our AI-driven products and services",
                "To create and manage user accounts",
                "To personalize your experience and deliver customized content, recommendations, and skill paths",
                "To process transactions, manage subscriptions, and issue invoices",
                "To send transactional communications (order confirmations, account notifications, service updates)"
              ]} />

              <h3 className="font-semibold text-navy mt-4">3.2 AI and Machine Learning</h3>
              <NumberedList items={[
                "To train, test, and improve AI models and algorithms",
                "To generate personalized skill development paths and career recommendations",
                "To analyze learning patterns and optimize educational content",
                "To provide adaptive learning experiences based on user performance"
              ]} />

              <h3 className="font-semibold text-navy mt-4">3.3 Communication and Marketing</h3>
              <NumberedList items={[
                "To communicate service updates, new features, and product announcements",
                "To send promotional offers, newsletters, and marketing communications (with your consent)",
                "To conduct surveys and request feedback",
                "To respond to inquiries and provide customer support"
              ]} />

              <h3 className="font-semibold text-navy mt-4">3.4 Security, Fraud Prevention, and Compliance</h3>
              <NumberedList items={[
                "To ensure the security, integrity, and safety of the Platform",
                "To detect, prevent, and investigate fraudulent, abusive, or illegal activity",
                "To enforce our Terms of Use and other policies",
                "To comply with legal obligations, court orders, or regulatory requirements"
              ]} />

              <h3 className="font-semibold text-navy mt-4">3.5 Analytics and Research</h3>
              <NumberedList items={[
                "To analyze usage trends, user behavior, and Platform performance",
                "To conduct research and development for product improvement",
                "To generate aggregated, anonymized data for business intelligence and reporting"
              ]} />
            </div>
          </Section>

          <Section id="section-4" title="4. LEGAL BASIS FOR PROCESSING">
            <div className="space-y-4">
              <p>We process personal data based on the following legal grounds under the PDPP Act and applicable laws:</p>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">4.1 Consent</h3>
                <p>We process personal data with your explicit, informed, and freely given consent, which you may withdraw at any time.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">4.2 Contractual Necessity</h3>
                <p>Processing is necessary to perform our contractual obligations to you (e.g., providing services, processing payments).</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">4.3 Legal Obligations</h3>
                <p>Processing is required to comply with applicable laws, regulations, court orders, or government requests.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">4.4 Legitimate Business Interests</h3>
                <p>Processing is necessary for our legitimate business interests, such as fraud prevention, network security, product improvement, or business analytics, provided such interests are not overridden by your fundamental rights.</p>
              </div>
            </div>
          </Section>

          <Section id="section-5" title="5. DATA SHARING AND DISCLOSURE">
            <div className="space-y-4">
              <p>We may share personal data with the following categories of recipients:</p>

              <h3 className="font-semibold text-navy">5.1 Service Providers and Processors</h3>
              <p>We engage trusted third-party service providers to perform functions on our behalf, including:</p>
              <BulletList items={[
                "Cloud hosting and infrastructure providers (e.g., Amazon Web Services, Microsoft Azure, Google Cloud)",
                "Payment processors and gateways (e.g., Razorpay, Stripe, PayPal, Paytm)",
                "Analytics and monitoring tools (e.g., Google Analytics, Mixpanel, Hotjar)",
                "Customer support platforms (e.g., Zendesk, Freshdesk, Intercom)",
                "Email and communication services (e.g., SendGrid, Mailchimp, Twilio)",
                "AI and machine learning infrastructure providers"
              ]} />
              <p className="mt-2 text-sm text-slate-500">All service providers are contractually bound by Data Processing Agreements (DPAs) to protect your personal data and process it only in accordance with our instructions and applicable data protection laws.</p>

              <h3 className="font-semibold text-navy mt-4">5.2 Educational Institutions and Employers</h3>
              <p>If you use the Platform in connection with an educational institution, corporate training program, or employer partnership, we may share your personal data (including learning progress, assessment results, and certifications) with such organizations as necessary to provide the services.</p>

              <h3 className="font-semibold text-navy mt-4">5.3 Business Partners and Affiliates</h3>
              <p>We may share aggregated, anonymized, or de-identified data with business partners, affiliates, or advertisers for marketing, analytics, or research purposes. Such data does not identify you personally.</p>

              <h3 className="font-semibold text-navy mt-4">5.4 Legal and Regulatory Authorities</h3>
              <p>We may disclose personal data when required by law or in response to:</p>
              <BulletList items={[
                "Valid legal process (subpoena, court order, search warrant)",
                "Government or regulatory authority requests",
                "Law enforcement investigations",
                "Protection of our legal rights, property, or safety, or that of others"
              ]} />

              <h3 className="font-semibold text-navy mt-4">5.5 Business Transfers</h3>
              <p>In the event of a merger, acquisition, reorganization, sale of assets, or bankruptcy, your personal data may be transferred to the successor entity, subject to equivalent data protection obligations.</p>

              <h3 className="font-semibold text-navy mt-4">5.6 No Sale of Personal Data</h3>
              <p className="font-semibold text-accent">We do not sell, rent, or trade your personal data to third parties for their marketing purposes.</p>
            </div>
          </Section>

          <Section id="section-6" title="6. CROSS-BORDER DATA TRANSFERS">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">6.1 Data Storage and Processing Locations</h3>
              <p>Your personal data may be transferred to, stored, and processed in locations outside India, including countries where our service providers, cloud infrastructure, or business partners operate (e.g., the United States, European Union, Singapore).</p>

              <h3 className="font-semibold text-navy">6.2 Safeguards for International Transfers</h3>
              <p>We ensure that all cross-border transfers of personal data are subject to appropriate safeguards as required under the PDPP Act and applicable laws, including:</p>
              <BulletList items={[
                "Transfers to countries notified as having adequate data protection standards by the Indian Government",
                "Standard Contractual Clauses (SCCs) approved by relevant authorities",
                "Data Processing Agreements with service providers ensuring equivalent protection",
                "Compliance with EU General Data Protection Regulation (GDPR) standards where applicable"
              ]} />

              <h3 className="font-semibold text-navy">6.3 Your Rights</h3>
              <p>If you are located in the European Economic Area (EEA), United Kingdom, or other jurisdictions with specific data protection laws, you may have additional rights regarding international data transfers. Please contact us for more information.</p>
            </div>
          </Section>

          <Section id="section-7" title="7. DATA RETENTION">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">7.1 Retention Period</h3>
              <p>We retain personal data only for as long as necessary to fulfill the purposes described in this Privacy Policy, comply with legal obligations, resolve disputes, enforce agreements, or as otherwise required or permitted by law.</p>

              <h3 className="font-semibold text-navy">7.2 Retention Criteria</h3>
              <p>The retention period for personal data depends on:</p>
              <BulletList items={[
                "The nature and sensitivity of the data",
                "The purposes for which it was collected and processed",
                "Legal, regulatory, tax, or accounting requirements",
                "Whether you have requested deletion or withdrawal of consent"
              ]} />

              <h3 className="font-semibold text-navy">7.3 Deletion and Anonymization</h3>
              <p>Upon expiry of the retention period or upon your request (where applicable), we will securely delete or anonymize your personal data in accordance with our data retention and deletion policies and applicable legal requirements.</p>

              <h3 className="font-semibold text-navy">7.4 Backup and Archival Data</h3>
              <p>Personal data may remain in backup systems or archives for a limited period for disaster recovery, security, and legal compliance purposes. Such data will be deleted in accordance with our backup retention schedules.</p>
            </div>
          </Section>

          <Section id="section-8" title="8. DATA SECURITY">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">8.1 Security Measures</h3>
              <p>We implement reasonable and appropriate administrative, technical, and physical safeguards to protect personal data from unauthorized access, use, disclosure, alteration, loss, misuse, or destruction, including:</p>
              <BulletList items={[
                "Encryption of data in transit (using SSL/TLS protocols) and at rest (using industry-standard encryption algorithms)",
                "Access controls, authentication mechanisms, and multi-factor authentication (MFA)",
                "Regular security audits, vulnerability assessments, and penetration testing",
                "Secure data centers with physical access controls",
                "Employee training and confidentiality obligations",
                "Incident response and breach notification procedures"
              ]} />

              <h3 className="font-semibold text-navy">8.2 Limitations</h3>
              <p>While we strive to protect your personal data, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your personal data. You acknowledge and accept the inherent risks of online data transmission and storage.</p>

              <h3 className="font-semibold text-navy">8.3 User Responsibility</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must immediately notify us of any unauthorized access or security breach.</p>
            </div>
          </Section>

          <Section id="section-9" title="9. YOUR RIGHTS UNDER THE DPDP ACT, 2023">
            <div className="space-y-4">
              <p>As a Data Principal under the DPDP Act, 2023, you have the following rights:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">9.1 Right to Access</h3>
                  <p className="text-sm">You have the right to obtain confirmation of whether we are processing your personal data and to access such data.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">9.2 Right to Correction</h3>
                  <p className="text-sm">You have the right to correct, update, or complete inaccurate, incomplete, or outdated personal data.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">9.3 Right to Erasure</h3>
                  <p className="text-sm">You have the right to request deletion or erasure of your personal data, subject to legal, regulatory, or contractual retention requirements.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">9.4 Right to Withdraw Consent</h3>
                  <p className="text-sm">Where processing is based on your consent, you have the right to withdraw such consent at any time. Withdrawal of consent will not affect the lawfulness of processing conducted prior to withdrawal.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">9.5 Right to Data Portability</h3>
                  <p className="text-sm">You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit such data to another Data Fiduciary (where technically feasible).</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">9.6 Right to Grievance Redressal</h3>
                  <p className="text-sm">You have the right to lodge a complaint with our Grievance Officer or the Data Protection Board of India if you believe your rights have been violated.</p>
                </div>
              </div>

              <h3 className="font-semibold text-navy mt-4">9.7 How to Exercise Your Rights</h3>
              <p>To exercise any of the above rights, please contact us at:</p>
              <div className="bg-slate-100 p-4 rounded-lg">
                <p><strong>Email:</strong> info@stridenex.ai</p>
                <p><strong>Subject Line:</strong> "Data Subject Request - [Your Request Type]"</p>
                <p><strong>Grievance Officer Contact:</strong> See Section 13 below</p>
              </div>
              <p className="text-sm text-slate-500">We will respond to your request within the timelines specified under the PDPP Act (typically within 30 days).</p>
            </div>
          </Section>

          <Section id="section-10" title="10. INTERNATIONAL USER RIGHTS (GDPR AND OTHER JURISDICTIONS)">
            <div className="space-y-4">
              <p>If you are located in the European Economic Area (EEA), United Kingdom, California (USA), or other jurisdictions with specific data protection laws, you may have additional rights, including:</p>

              <h3 className="font-semibold text-navy">10.1 GDPR Rights (EEA and UK Users)</h3>
              <BulletList items={[
                "Right to lodge a complaint with a supervisory authority",
                "Right to object to processing based on legitimate interests",
                "Right to restrict processing in certain circumstances",
                "Right to object to automated decision-making and profiling"
              ]} />

              <h3 className="font-semibold text-navy mt-4">10.2 CCPA Rights (California, USA Users)</h3>
              <BulletList items={[
                "Right to know what personal information is collected, used, shared, or sold",
                "Right to request deletion of personal information",
                "Right to opt-out of the sale of personal information (we do not sell personal data)",
                "Right to non-discrimination for exercising privacy rights"
              ]} />

              <p>To exercise these rights, please contact us at <a href="mailto:info@stridenex.ai" className="text-accent hover:underline">info@stridenex.ai</a>.</p>
            </div>
          </Section>

          <Section id="section-11" title="11. CHILDREN'S PRIVACY">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">11.1 Age Restrictions</h3>
              <p>Our Platform is not intended for children under the age of 13 years. We do not knowingly collect, use, or disclose personal data from children under 13 without verifiable parental consent as required under applicable laws.</p>

              <h3 className="font-semibold text-navy">11.2 Parental Consent for Minors (13-18 Years)</h3>
              <p>If you are between 13 and 18 years of age, you may use the Platform only with the consent and supervision of your parent or legal guardian. We may request verification of parental consent.</p>

              <h3 className="font-semibold text-navy">11.3 Parental Rights</h3>
              <p>Parents or legal guardians have the right to access, review, correct, or request deletion of their child's personal data. Please contact us at <a href="mailto:info@stridenex.ai" className="text-accent hover:underline">info@stridenex.ai</a> for assistance.</p>

              <h3 className="font-semibold text-navy">11.4 Discovery of Underage Data</h3>
              <p>If we discover that we have inadvertently collected personal data from a child under 13 without verifiable parental consent, we will take immediate steps to delete such data from our systems.</p>
            </div>
          </Section>

          <Section id="section-12" title="12. COOKIES AND TRACKING TECHNOLOGIES">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">12.1 What Are Cookies?</h3>
              <p>Cookies are small text files stored on your device by your web browser when you visit a website. We use cookies and similar tracking technologies (web beacons, pixels, local storage) to enhance user experience, analyze usage, and maintain session security.</p>

              <h3 className="font-semibold text-navy">12.2 Types of Cookies We Use</h3>
              <BulletList items={[
                "<strong>Essential Cookies:</strong> Necessary for the Platform to function properly (e.g., session management, authentication)",
                "<strong>Performance Cookies:</strong> Collect information about how you use the Platform (e.g., page visits, load times) to improve performance",
                "<strong>Functional Cookies:</strong> Remember your preferences and settings (e.g., language, region)",
                "<strong>Analytics Cookies:</strong> Help us understand user behavior and traffic patterns (e.g., Google Analytics)",
                "<strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness (with your consent)"
              ]} />

              <h3 className="font-semibold text-navy">12.3 Third-Party Cookies</h3>
              <p>We may allow third-party service providers (e.g., Google Analytics, Facebook Pixel) to place cookies on your device for analytics, advertising, and remarketing purposes. These third parties have their own privacy policies and data practices.</p>

              <h3 className="font-semibold text-navy">12.4 Cookie Consent and Management</h3>
              <p>By using the Platform, you consent to the use of cookies as described in this Policy. You may manage, disable, or delete cookies through your browser settings. However, disabling certain cookies may affect the functionality and performance of the Platform.</p>

              <h3 className="font-semibold text-navy">12.5 Do Not Track (DNT)</h3>
              <p>Our Platform does not currently respond to "Do Not Track" (DNT) signals sent by web browsers.</p>
            </div>
          </Section>

          <Section id="section-13" title="13. GRIEVANCE OFFICER">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="mb-4">In accordance with the PDPP Act, 2023, we have appointed a Grievance Officer to address your privacy concerns, complaints, or data subject requests.</p>

              <h3 className="font-semibold text-navy mb-2">Grievance Officer Contact Details:</h3>
              <p><strong>Name:</strong> [To be designated - Insert Name]</p>
              <p><strong>Designation:</strong> Grievance Officer</p>
              <p><strong>Email:</strong> <a href="mailto:grievance@stridenex.ai" className="text-accent hover:underline">grievance@stridenex.ai</a></p>
              <p><strong>Phone:</strong> [Insert Phone Number]</p>
              <p><strong>Address:</strong> StrideNex Private Limited, [Full Registered Office Address], Pune, Maharashtra, India</p>

              <p className="mt-4 text-sm text-slate-600"><strong>Response Timeline:</strong> The Grievance Officer will acknowledge your complaint within 48 hours and resolve it within 30 days from the date of receipt, as required under the PDPP Act.</p>
            </div>
          </Section>

          <Section id="section-14" title="14. DATA BREACH NOTIFICATION">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">14.1 Breach Response Procedures</h3>
              <p>In the event of a data breach that is likely to cause harm to your rights and freedoms, we will:</p>
              <NumberedList items={[
                "Investigate and assess the nature, scope, and impact of the breach",
                "Take immediate steps to contain and mitigate the breach",
                "Notify affected Data Principals and the Data Protection Board of India within 72 hours of becoming aware of the breach, as required under the PDPP Act"
              ]} />

              <h3 className="font-semibold text-navy">14.2 Notification Contents</h3>
              <p>Breach notifications will include:</p>
              <BulletList items={[
                "Description of the nature and extent of the breach",
                "Categories and approximate number of affected individuals and data records",
                "Likely consequences and potential risks",
                "Measures taken or proposed to address the breach and mitigate harm"
              ]} />
            </div>
          </Section>

          <Section id="section-15" title="15. AUTOMATED DECISION-MAKING AND AI PROFILING">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">15.1 AI-Driven Recommendations</h3>
              <p>Our Platform uses AI and machine learning algorithms to analyze your learning patterns, assess your skills, and provide personalized recommendations for skill development, career paths, courses, and projects.</p>

              <h3 className="font-semibold text-navy">15.2 How AI Decisions Are Made</h3>
              <p>AI-driven recommendations are generated based on:</p>
              <BulletList items={[
                "Your educational and professional background",
                "Learning progress, assessment results, and performance data",
                "Interaction patterns and usage behavior",
                "Industry trends, job market data, and employer demand signals",
                "Comparative analytics with similar user profiles"
              ]} />

              <h3 className="font-semibold text-navy">15.3 Human Oversight</h3>
              <p>While AI systems assist in generating recommendations, significant decisions (e.g., certification awards, employment referrals) may involve human review and oversight.</p>

              <h3 className="font-semibold text-navy">15.4 Right to Explanation and Objection</h3>
              <p>You have the right to:</p>
              <BulletList items={[
                "Request an explanation of how AI-driven recommendations are generated",
                "Object to automated decision-making that produces legal or similarly significant effects",
                "Request human review of AI-generated decisions"
              ]} />
              <p>To exercise these rights, contact us at <a href="mailto:info@stridenex.ai" className="text-accent hover:underline">info@stridenex.ai</a>.</p>
            </div>
          </Section>

          <Section id="section-16" title="16. MARKETING COMMUNICATIONS AND OPT-OUT">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">16.1 Marketing Consent</h3>
              <p>With your consent, we may send you promotional emails, SMS, push notifications, or other marketing communications about our products, services, offers, events, or updates.</p>

              <h3 className="font-semibold text-navy">16.2 Opt-Out Rights</h3>
              <p>You have the right to opt out of receiving marketing communications at any time by:</p>
              <BulletList items={[
                "Clicking the 'Unsubscribe' link in any marketing email",
                "Adjusting your notification preferences in your account settings",
                "Contacting us at info@stridenex.ai with your opt-out request"
              ]} />

              <h3 className="font-semibold text-navy">16.3 Transactional Communications</h3>
              <p>Please note that even if you opt out of marketing communications, you will continue to receive transactional or service-related communications (e.g., account notifications, payment confirmations, security alerts) as necessary to provide our services.</p>
            </div>
          </Section>

          <Section id="section-17" title="17. THIRD-PARTY WEBSITES AND SERVICES">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">17.1 Links to External Sites</h3>
              <p>The Platform may contain links to third-party websites, services, or resources not owned or controlled by StrideNex (e.g., educational institutions, partner organizations, social media platforms).</p>

              <h3 className="font-semibold text-navy">17.2 No Responsibility</h3>
              <p>We are not responsible for and do not endorse the privacy practices, content, or data collection practices of any third-party websites or services. Your access to and use of third-party sites is governed by their respective privacy policies and terms of use.</p>

              <h3 className="font-semibold text-navy">17.3 User Responsibility</h3>
              <p>We encourage you to review the privacy policies of any third-party websites or services you visit. You access such sites at your own risk.</p>
            </div>
          </Section>

          <Section id="section-18" title="18. UPDATES TO THIS PRIVACY POLICY">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">18.1 Right to Modify</h3>
              <p>We reserve the right to update, amend, or modify this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or business operations.</p>

              <h3 className="font-semibold text-navy">18.2 Notification of Changes</h3>
              <p>When we make material changes to this Privacy Policy, we will:</p>
              <BulletList items={[
                "Update the 'Last Updated' date at the top of this Policy",
                "Post a notice on the Platform",
                "Notify you via email or in-app notification (where applicable)",
                "Request your renewed consent where required by law"
              ]} />

              <h3 className="font-semibold text-navy">18.3 Acceptance of Changes</h3>
              <p>Your continued use of the Platform after any changes to this Privacy Policy constitutes your acceptance of the revised Policy. If you do not agree to the changes, you must discontinue use of the Platform.</p>

              <h3 className="font-semibold text-navy">18.4 Version History</h3>
              <p>Previous versions of this Privacy Policy are available upon request by contacting <a href="mailto:info@stridenex.ai" className="text-accent hover:underline">info@stridenex.ai</a>.</p>
            </div>
          </Section>

          <Section id="section-19" title="19. CONSENT AND ACCEPTANCE">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <p>By registering, accessing, or using the Platform, you expressly consent to:</p>
              <BulletList items={[
                "The collection, processing, storage, use, disclosure, and transfer of your personal data as described in this Privacy Policy",
                "The use of cookies and tracking technologies as described in Section 12",
                "Cross-border data transfers as described in Section 6",
                "AI-driven processing and automated decision-making as described in Section 15"
              ]} />

              <p className="mt-4">You acknowledge that:</p>
              <BulletList items={[
                "You have read and understood this Privacy Policy",
                "You voluntarily provide your personal data",
                "Processing of your personal data is necessary to provide our services",
                "Your information may be transferred, processed, and stored outside India in accordance with applicable safeguards"
              ]} />
            </div>
          </Section>

          <Section id="section-20" title="20. CONTACT INFORMATION">
            <div className="bg-gradient-to-r from-accent/5 to-orange-600/5 rounded-xl p-6 border border-accent/20">
              <p className="font-semibold text-navy mb-4">If you have any questions, concerns, requests, or feedback regarding this Privacy Policy or our data practices, please contact us at:</p>

              <div className="space-y-2">
                <p><strong>StrideNex Private Limited</strong></p>
                <p>Registered Office: [Full Address], Pune, Maharashtra, India</p>
                <p><strong>Email:</strong> <a href="mailto:info@stridenex.ai" className="text-accent hover:underline">info@stridenex.ai</a></p>
                <p><strong>Grievance Officer Email:</strong> <a href="mailto:grievance@stridenex.ai" className="text-accent hover:underline">grievance@stridenex.ai</a></p>
                <p><strong>Phone:</strong> [Insert Contact Number]</p>
                <p><strong>Website:</strong> <a href="https://stridenex.ai" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">www.stridenex.ai</a></p>
              </div>
            </div>
          </Section>

          <Section id="section-21" title="21. DATA PROTECTION AUTHORITY">
            <div className="space-y-4">
              <p>If you believe your data protection rights have been violated, you have the right to lodge a complaint with the <strong>Data Protection Board of India</strong> established under the Digital Personal Data Protection Act, 2023.</p>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">Data Protection Board of India</h3>
                <p>[Address will be notified by the Government of India]</p>
                <p>Website: [To be published by the Government]</p>
              </div>

              <div className="mt-6 text-center text-sm text-slate-500 border-t pt-6">
                <p>© 2026 StrideNex Private Limited. All rights reserved.</p>
                <p className="mt-2">By using the Platform, you acknowledge that you have read, understood, and consent to this Privacy Policy.</p>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}