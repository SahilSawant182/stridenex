
import Link from "next/link";
import { GraduationCap, Building2, Briefcase, ChevronRight } from "lucide-react";

const sections = [
  { id: "section-1", title: "1. Acceptance of Terms" },
  { id: "section-2", title: "2. Modifications to Terms" },
  { id: "section-3", title: "3. Eligibility and Age Restrictions" },
  { id: "section-4", title: "4. Account Registration and Security" },
  { id: "section-5", title: "5. Services and Subscriptions" },
  { id: "section-6", title: "6. Payments, Pricing, and Refund Policy" },
  { id: "section-7", title: "7. Prohibited Uses and User Conduct" },
  { id: "section-8", title: "8. Intellectual Property Rights" },
  { id: "section-9", title: "9. User-Generated Content" },
  { id: "section-10", title: "10. Disclaimers and Warranties" },
  { id: "section-11", title: "11. Limitation of Liability" },
  { id: "section-12", title: "12. Indemnification" },
  { id: "section-13", title: "13. Data Protection and Privacy" },
  { id: "section-14", title: "14. Termination and Suspension" },
  { id: "section-15", title: "15. Force Majeure" },
  { id: "section-16", title: "16. Third-Party Services and Links" },
  { id: "section-17", title: "17. Arbitration and Dispute Resolution" },
  { id: "section-18", title: "18. Governing Law and Jurisdiction" },
  { id: "section-19", title: "19. Anti-Corruption and Compliance" },
  { id: "section-20", title: "20. Severability" },
  { id: "section-21", title: "21. Entire Agreement" },
  { id: "section-22", title: "22. Assignment" },
  { id: "section-23", title: "23. No Waiver" },
  { id: "section-24", title: "24. Notices" },
  { id: "section-25", title: "25. Contact Information" },
  { id: "section-26", title: "26. Acknowledgment" },
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
    <section id={id} className="scroll-mt-24">
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

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-primary/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="/images/circularLogo.jpg"
                alt="StrideNex Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">StrideNex</h1>
              <p className="text-xs text-slate-500">Terms of Use</p>
            </div>
          </div>
          <Link
            href="/signup"
            className="text-accent hover:text-orange-600 font-medium flex items-center gap-1 transition-colors"
          >
            ← Back to Signup
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-navy to-royal text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Terms of Use</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Use</h1>
          <p className="text-lg text-white/80 max-w-3xl">
            These Terms of Use govern your access to and use of the StrideNex Platform.
            Please read them carefully.
          </p>
          {/* <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm">Students</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">Institutes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">Industry</span>
            </div>
          </div> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents - Sticky Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-primary/10 p-6">
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
              These Terms of Use ("Terms") govern your access to and use of any website, mobile application, platform, software, products, services, tools, or content (collectively, the <strong>"Platform"</strong>) operated by <strong>StrideNex Private Limited</strong> ("StrideNex", "Company", "we", "us", or "our"), a company incorporated under the Companies Act, 2013 and having its registered office at Pune, Maharashtra, India. StrideNex is an AI-driven technology company offering digital, educational, analytics, skill-development, and software solutions.
            </p>
          </div>

          <Section id="section-1" title="1. ACCEPTANCE OF TERMS">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">1.1</span> By accessing, browsing, registering on, or using the Platform in any manner, you acknowledge that you have read, understood, and agree to be legally bound by these Terms, our Privacy Policy, and all applicable laws and regulations.</p>
              <p><span className="font-semibold text-navy">1.2</span> If you do not agree to these Terms, you must immediately discontinue use of the Platform.</p>
              <p><span className="font-semibold text-navy">1.3</span> These Terms constitute a legally binding agreement between you ("User", "you", or "your") and StrideNex.</p>
            </div>
          </Section>

          <Section id="section-2" title="2. MODIFICATIONS TO TERMS">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">2.1</span> StrideNex reserves the right to modify, amend, or update these Terms at any time at its sole discretion without prior notice.</p>
              <p><span className="font-semibold text-navy">2.2</span> Any modifications will be effective immediately upon posting on the Platform with a revised "Last Updated" date. We may also notify you via email or in-platform notifications.</p>
              <p><span className="font-semibold text-navy">2.3</span> Your continued use of the Platform after such modifications constitutes your acceptance of the revised Terms. You are advised to review these Terms periodically.</p>
              <p><span className="font-semibold text-navy">2.4</span> If you do not agree to any modifications, you must cease using the Platform immediately.</p>
            </div>
          </Section>

          <Section id="section-3" title="3. ELIGIBILITY AND AGE RESTRICTIONS">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">3.1 Minimum Age:</span> You must be at least 18 years of age to register and use the Platform. If you are under 18 years of age, you may only use the Platform under the supervision of a parent or legal guardian who agrees to be bound by these Terms.</p>
              <p><span className="font-semibold text-navy">3.2 Parental Consent:</span> Users between 13-18 years must obtain verifiable parental or guardian consent before registration. We reserve the right to request proof of such consent.</p>
              <p><span className="font-semibold text-navy">3.3 Prohibited Use by Minors Under 13:</span> The Platform is not intended for children under 13 years of age. We do not knowingly collect personal data from children under 13 without verifiable parental consent.</p>
            </div>
          </Section>

          <Section id="section-4" title="4. ACCOUNT REGISTRATION AND SECURITY">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">4.1 Registration Requirement:</span> Certain features and services on the Platform require you to register and create an account by providing accurate, current, and complete information as prompted during the registration process.</p>
              <p><span className="font-semibold text-navy">4.2 Accuracy of Information:</span> You represent and warrant that all information provided during registration and at all times thereafter is true, accurate, current, and complete. You agree to promptly update your account information to maintain this accuracy.</p>
              <p><span className="font-semibold text-navy">4.3 Account Security:</span> You are solely responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to immediately notify StrideNex of any unauthorized use of your account or any other breach of security. StrideNex shall not be liable for any loss or damage arising from your failure to comply with this security obligation.</p>
              <p><span className="font-semibold text-navy">4.4 Account Termination:</span> We reserve the right to suspend, disable, or terminate your account at any time if you provide false, inaccurate, or misleading information; you violate any provision of these Terms; we suspect fraudulent, abusive, or illegal activity; or required by law or regulatory authority.</p>
              <p><span className="font-semibold text-navy">4.5 Non-Transferability:</span> Your account is personal to you and may not be transferred, assigned, or sold to any third party.</p>
            </div>
          </Section>

          <Section id="section-5" title="5. SERVICES AND SUBSCRIPTIONS">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">5.1 Description of Services:</span> StrideNex provides AI-driven skill development solutions, career guidance, educational content, industry-academia bridging services, project-based learning tools, mentorship programs, and related analytics and software services through the Platform.</p>
              <p><span className="font-semibold text-navy">5.2 Subscription-Based Access:</span> Access to certain features, content, and services is subscription-based and requires payment of applicable fees as displayed on the Platform at the time of purchase or subscription.</p>
              <p><span className="font-semibold text-navy">5.3 Non-Transferability:</span> All subscriptions, licenses, and access rights granted under these Terms are personal, non-exclusive, non-transferable, and non-sublicensable. You may not share, transfer, or resell your subscription or account access to any third party.</p>
              <p><span className="font-semibold text-navy">5.4 Service Modifications:</span> StrideNex reserves the right to modify, suspend, discontinue, or withdraw any service, feature, or content on the Platform at any time without prior notice or liability.</p>
              <p><span className="font-semibold text-navy">5.5 Cancellation for Violations:</span> StrideNex may immediately suspend or cancel your subscription and access to the Platform without refund if you engage in unauthorized sharing or distribution of account credentials; violate intellectual property rights; use automated tools to scrape, extract, or copy Platform content; engage in fraudulent activity or misuse of services; breach any provision of these Terms; or engage in conduct that harms the Platform, other users, or StrideNex's reputation.</p>
              <p><span className="font-semibold text-navy">5.6 Effect of Cancellation:</span> Upon cancellation or termination, your right to access and use the Platform will immediately cease. You will not be entitled to any refund of fees paid except as expressly provided in Section 6.</p>
            </div>
          </Section>

          <Section id="section-6" title="6. PAYMENTS, PRICING, AND REFUND POLICY">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">6.1 Payment Terms:</span> All payments for subscriptions, services, or products must be made in advance through the payment methods specified on the Platform, unless otherwise expressly agreed in writing.</p>
              <p><span className="font-semibold text-navy">6.2 Payment Processing:</span> Payments are processed through secure third-party payment gateways. StrideNex does not store your credit card, debit card, or banking information. By making a payment, you agree to the terms and conditions of the applicable payment gateway provider.</p>
              <p><span className="font-semibold text-navy">6.3 Pricing:</span> All prices are displayed in Indian Rupees (INR) or other applicable currency and are inclusive of applicable taxes (including GST at 18% or as applicable under Indian law), unless otherwise stated.</p>
              <p><span className="font-semibold text-navy">6.4 Price Changes:</span> StrideNex reserves the right to change pricing at any time without prior notice. However, changes will not affect subscriptions already purchased or active at the time of the price change.</p>
              <p><span className="font-semibold text-navy">6.5 Refund Policy - General Rule:</span> Refunds are generally not provided for digital products, services, or subscriptions once accessed, downloaded, or activated.</p>
              <p><span className="font-semibold text-navy">6.6 Exceptions to No-Refund Policy:</span> Refunds may be issued at StrideNex's sole discretion in the following cases: duplicate payments or billing errors; technical errors preventing service delivery; non-delivery of services due to Platform malfunction attributable to StrideNex; or as required under applicable consumer protection laws.</p>
              <p><span className="font-semibold text-navy">6.7 Refund Requests:</span> All refund requests must be submitted in writing to info@stridenex.ai within 7 (seven) days from the date of transaction, along with supporting documentation. StrideNex will review and respond to refund requests within 14 (fourteen) business days.</p>
              <p><span className="font-semibold text-navy">6.8 No Refunds Post-Cancellation:</span> If your subscription or access is cancelled or terminated by StrideNex due to your violation of these Terms, no refund of fees paid shall be provided.</p>
            </div>
          </Section>

          <Section id="section-7" title="7. PROHIBITED USES AND USER CONDUCT">
            <div className="space-y-3">
              <p className="font-semibold text-navy">7.1 You agree that you will NOT use the Platform to:</p>
              <BulletList items={[
                "Copy, reproduce, distribute, republish, download, display, post, transmit, sell, or commercially exploit any content, software, AI models, data, materials, or information available on the Platform",
                "Reverse engineer, decompile, disassemble, or attempt to derive the source code of any software, AI models, algorithms, or technology underlying the Platform",
                "Scrape, extract, download, or collect data, content, or information from the Platform using automated tools, bots, spiders, crawlers, or any similar data mining technology",
                "Violate any applicable local, state, national, or international law, regulation, or legal obligation",
                "Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity",
                "Interfere with, disrupt, or impose an unreasonable burden on the security, integrity, or performance of the Platform, servers, or networks connected to the Platform",
                "Upload, post, transmit, or otherwise make available any content that infringes any intellectual property rights or proprietary rights of any third party; is defamatory, obscene, pornographic, abusive, harassing, threatening, hateful, or racially or ethnically offensive; contains viruses, malware, or any malicious code; or violates any third party's privacy or data protection rights",
                "Use the Platform for any unlawful, fraudulent, or malicious purpose",
                "Attempt to gain unauthorized access to any portion of the Platform, other user accounts, or computer systems or networks connected to the Platform",
                "Engage in any activity that could damage, disable, overburden, or impair the Platform or interfere with any other party's use of the Platform"
              ]} />
              <p className="mt-4"><span className="font-semibold text-navy">7.2 Consequences of Prohibited Use:</span> Violation of any provision of this Section 7 may result in immediate suspension or termination of your account, denial of access to the Platform, and pursuit of legal remedies including civil and criminal prosecution.</p>
            </div>
          </Section>

          <Section id="section-8" title="8. INTELLECTUAL PROPERTY RIGHTS">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">8.1 Ownership by StrideNex:</span> All content, software, AI models, algorithms, databases, text, graphics, images, videos, audio, trademarks, service marks, trade names, logos, and other materials available on or through the Platform (collectively, "Content") are the exclusive intellectual property of StrideNex or its licensors and are protected under the Copyright Act, 1957, the Trade Marks Act, 1999, the Patents Act, 1970, and other applicable intellectual property laws of India and international treaties.</p>
              <p><span className="font-semibold text-navy">8.2 AI-Generated Outputs:</span> All outputs, recommendations, skill paths, analytics, reports, and other content generated by StrideNex's AI systems or algorithms ("AI Outputs") are the sole and exclusive property of StrideNex. You are granted a limited, non-exclusive, non-transferable license to view and use such AI Outputs solely for your personal, non-commercial use in connection with the services provided.</p>
              <p><span className="font-semibold text-navy">8.3 No Transfer of Rights:</span> Except as expressly stated in these Terms, no rights, title, or interest in any Content or intellectual property are transferred to you. You acknowledge that you do not acquire any ownership rights by accessing or using the Platform.</p>
              <p><span className="font-semibold text-navy">8.4 Limited License to Users:</span> Subject to your compliance with these Terms, StrideNex grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Platform and Content solely for your personal, non-commercial purposes.</p>
              <p><span className="font-semibold text-navy">8.5 Restrictions:</span> You may not modify, adapt, translate, or create derivative works based on the Content or AI Outputs; sell, rent, lease, license, distribute, or otherwise commercially exploit any Content or AI Outputs; remove, alter, or obscure any copyright, trademark, or other proprietary notices contained in or on the Content; or use any Content or AI Outputs in any manner that competes with StrideNex's business.</p>
            </div>
          </Section>

          <Section id="section-9" title="9. USER-GENERATED CONTENT">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">9.1 License Grant by User:</span> If you submit, post, upload, or otherwise provide any content, data, information, feedback, suggestions, comments, or materials to the Platform ("User Content"), you hereby grant to StrideNex a perpetual, irrevocable, worldwide, non-exclusive, royalty-free, fully paid-up, transferable, sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, display, and otherwise exploit such User Content for any purpose, including operational, promotional, marketing, and commercial purposes, in any media now known or hereafter developed.</p>
              <p><span className="font-semibold text-navy">9.2 User Representations and Warranties:</span> You represent and warrant that you own or have the necessary rights, licenses, and permissions to grant the license in Section 9.1; your User Content does not infringe, misappropriate, or violate any intellectual property rights, privacy rights, publicity rights, or other legal rights of any third party; your User Content does not contain any defamatory, obscene, unlawful, or otherwise objectionable material; and your User Content complies with all applicable laws and regulations.</p>
              <p><span className="font-semibold text-navy">9.3 User Responsibility:</span> You remain solely responsible for all User Content you submit. StrideNex does not endorse, support, or guarantee the accuracy, reliability, or legality of any User Content.</p>
              <p><span className="font-semibold text-navy">9.4 Right to Remove:</span> StrideNex reserves the right, but is not obligated, to monitor, review, edit, remove, or refuse any User Content at any time for any reason without notice or liability.</p>
              <p><span className="font-semibold text-navy">9.5 No Obligation to Use:</span> StrideNex is under no obligation to use, display, or exploit any User Content and may choose not to do so at its sole discretion.</p>
            </div>
          </Section>

          <Section id="section-10" title="10. DISCLAIMERS AND WARRANTIES">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">10.1 "AS IS" and "AS AVAILABLE" Basis:</span> THE PLATFORM, ALL CONTENT, SERVICES, PRODUCTS, AND AI OUTPUTS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
              <p><span className="font-semibold text-navy">10.2 Disclaimer of Warranties:</span> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, STRIDENEX EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT; WARRANTIES THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS; WARRANTIES REGARDING THE ACCURACY, RELIABILITY, COMPLETENESS, OR TIMELINESS OF ANY CONTENT, AI OUTPUTS, OR INFORMATION PROVIDED; AND WARRANTIES THAT DEFECTS OR ERRORS WILL BE CORRECTED.</p>
              <p><span className="font-semibold text-navy">10.3 No Guarantee of Results:</span> StrideNex does not warrant or guarantee that use of the Platform, services, or AI-driven recommendations will result in any specific educational, career, or employment outcomes, skill acquisition, job placement, admission to educational institutions, or any other particular result.</p>
              <p><span className="font-semibold text-navy">10.4 Third-Party Content and Links:</span> The Platform may contain links to third-party websites, services, or resources not owned or controlled by StrideNex. StrideNex is not responsible for and does not endorse the content, products, services, or practices of any third-party sites. You access third-party sites at your own risk.</p>
              <p><span className="font-semibold text-navy">10.5 User Responsibility:</span> You acknowledge and agree that your use of the Platform is at your sole risk. You are solely responsible for any decisions, actions, or consequences resulting from your use of the Platform, Content, or services.</p>
            </div>
          </Section>

          <Section id="section-11" title="11. LIMITATION OF LIABILITY">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">11.1 Exclusion of Damages:</span> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL STRIDENEX, ITS AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, LICENSORS, OR SUPPLIERS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITIES; LOSS OF USE OR ACCESS TO THE PLATFORM; LOSS OR CORRUPTION OF DATA; COST OF PROCUREMENT OF SUBSTITUTE SERVICES; PERSONAL INJURY OR PROPERTY DAMAGE; ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE PLATFORM; ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE PLATFORM; UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR DATA OR USER CONTENT; OR ANY OTHER MATTER RELATING TO THE PLATFORM; WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT STRIDENEX HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
              <p><span className="font-semibold text-navy">11.2 Cap on Liability:</span> STRIDENEX'S TOTAL AGGREGATE LIABILITY TO YOU FOR ANY AND ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU TO STRIDENEX IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.</p>
              <p><span className="font-semibold text-navy">11.3 Essential Basis of Bargain:</span> You acknowledge and agree that the disclaimers and limitations of liability set forth in these Terms reflect a reasonable and fair allocation of risk between you and StrideNex and form an essential basis of the bargain between the parties. StrideNex would not be able to provide the Platform on an economically reasonable basis without these limitations.</p>
              <p><span className="font-semibold text-navy">11.4 Jurisdictional Limitations:</span> Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In such jurisdictions, the exclusions and limitations in Sections 10 and 11 shall apply to the maximum extent permitted by applicable law.</p>
            </div>
          </Section>

          <Section id="section-12" title="12. INDEMNIFICATION">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">12.1 Indemnity Obligation:</span> You agree to indemnify, defend, and hold harmless StrideNex, its parent companies, subsidiaries, affiliates, officers, directors, employees, agents, partners, licensors, suppliers, and representatives (collectively, "Indemnified Parties") from and against any and all claims, demands, actions, suits, proceedings, losses, damages, liabilities, costs, and expenses (including reasonable attorneys' fees and litigation costs) arising out of or relating to:</p>
              <NumberedList items={[
                "Your use or misuse of the Platform",
                "Your violation of these Terms or any applicable law or regulation",
                "Your User Content, including any claim that your User Content infringes or misappropriates any intellectual property rights or other rights of any third party",
                "Your violation of any rights of any third party, including intellectual property rights, privacy rights, or publicity rights",
                "Any fraudulent, negligent, or wrongful conduct by you",
                "Any breach of your representations, warranties, or covenants under these Terms"
              ]} />
              <p><span className="font-semibold text-navy">12.2 Defense and Settlement:</span> StrideNex reserves the right, at its own expense, to assume the exclusive defense and control of any matter subject to indemnification by you. You agree to cooperate fully with StrideNex in the defense of any such claim. You may not settle any claim without StrideNex's prior written consent.</p>
              <p><span className="font-semibold text-navy">12.3 Survival:</span> This indemnification obligation shall survive the termination or expiration of these Terms and your use of the Platform.</p>
            </div>
          </Section>

          <Section id="section-13" title="13. DATA PROTECTION AND PRIVACY">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">13.1 Privacy Policy:</span> StrideNex processes personal data in accordance with the Digital Personal Data Protection Act, 2023 (India) and other applicable data protection laws and regulations. Please refer to our <Link href="/legal/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> for detailed information on how we collect, use, store, share, and protect your personal data.</p>
              <p><span className="font-semibold text-navy">13.2 User Rights:</span> You have the right to access, correct, update, delete, or withdraw consent for your personal data as described in our Privacy Policy. To exercise these rights or for any data protection queries, contact us at info@stridenex.ai.</p>
              <p><span className="font-semibold text-navy">13.3 Consent:</span> By using the Platform, you consent to the collection, processing, and use of your personal data as described in the Privacy Policy.</p>
            </div>
          </Section>

          <Section id="section-14" title="14. TERMINATION AND SUSPENSION">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">14.1 Termination by User:</span> You may terminate your account and cease using the Platform at any time by sending a written request to info@stridenex.ai. Upon termination, your access to the Platform will be disabled, but these Terms will continue to apply to your prior use.</p>
              <p><span className="font-semibold text-navy">14.2 Termination by StrideNex:</span> StrideNex reserves the right to suspend, disable, or terminate your account and access to the Platform, with or without notice, at any time and for any reason, including but not limited to breach or violation of these Terms; fraudulent, abusive, or illegal activity; extended periods of inactivity; request by law enforcement or other government agencies; technical or security issues; or discontinuance or material modification of the Platform.</p>
              <p><span className="font-semibold text-navy">14.3 Effect of Termination:</span> Upon termination, all licenses and rights granted to you under these Terms will immediately cease; you must immediately cease all use of the Platform and delete any Content or materials obtained from the Platform; StrideNex may delete your account data, User Content, and other information associated with your account, except as required to retain by law; and Sections 8 (Intellectual Property), 9 (User Content License), 11 (Limitation of Liability), 12 (Indemnification), 16 (Governing Law), and 17 (Dispute Resolution) shall survive termination.</p>
              <p><span className="font-semibold text-navy">14.4 No Refunds on Termination:</span> If StrideNex terminates your account due to your breach of these Terms, you will not be entitled to any refund of fees paid.</p>
            </div>
          </Section>

          <Section id="section-15" title="15. FORCE MAJEURE">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">15.1</span> StrideNex shall not be liable for any delay, failure to perform, or interruption of service resulting from causes beyond its reasonable control, including but not limited to acts of God (earthquakes, floods, storms, pandemics, epidemics); war, terrorism, civil unrest, or government action; internet, telecommunications, or network failures; cyberattacks, hacking, or distributed denial-of-service (DDoS) attacks; power outages, server failures, or other technical failures; labor disputes, strikes, or lockouts; or supplier or vendor failures.</p>
              <p><span className="font-semibold text-navy">15.2</span> In the event of a force majeure occurrence, StrideNex's obligations under these Terms shall be suspended for the duration of such event.</p>
            </div>
          </Section>

          <Section id="section-16" title="16. THIRD-PARTY SERVICES AND LINKS">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">16.1</span> The Platform may integrate with, link to, or provide access to third-party services, websites, applications, content, or resources not owned or controlled by StrideNex (collectively, "Third-Party Services").</p>
              <p><span className="font-semibold text-navy">16.2 No Endorsement:</span> StrideNex does not endorse, warrant, or assume any responsibility for any Third-Party Services. The inclusion of any link or integration does not imply endorsement by StrideNex.</p>
              <p><span className="font-semibold text-navy">16.3 User Responsibility:</span> Your use of Third-Party Services is governed by the terms and conditions and privacy policies of those third parties. You access and use Third-Party Services at your own risk.</p>
              <p><span className="font-semibold text-navy">16.4 No Liability:</span> StrideNex shall not be liable for any loss, damage, or harm arising from your use of or reliance on Third-Party Services.</p>
            </div>
          </Section>

          <Section id="section-17" title="17. ARBITRATION AND DISPUTE RESOLUTION">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">17.1 Mutual Discussion:</span> In the event of any dispute, controversy, or claim arising out of or relating to these Terms, the Platform, or the relationship between you and StrideNex (collectively, "Dispute"), the parties agree to first attempt to resolve the Dispute amicably through good-faith mutual discussions for a period of thirty (30) days.</p>
              <p><span className="font-semibold text-navy">17.2 Arbitration:</span> If the Dispute cannot be resolved through mutual discussions within thirty (30) days, either party may refer the Dispute to binding arbitration in accordance with the Arbitration and Conciliation Act, 1996, as amended.</p>
              <p><span className="font-semibold text-navy">17.3 Arbitration Procedure:</span> The arbitration shall be conducted in English by a sole arbitrator appointed by mutual agreement or, failing such agreement, in accordance with the rules of the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Pune, Maharashtra, India. The arbitrator's award shall be final and binding on both parties.</p>
              <p><span className="font-semibold text-navy">17.4 Exception for Injunctive Relief:</span> Notwithstanding the foregoing, StrideNex may seek injunctive or other equitable relief in any court of competent jurisdiction to protect its intellectual property rights or confidential information.</p>
              <p><span className="font-semibold text-navy">17.5 No Class Actions:</span> You agree that any Dispute shall be brought in an individual capacity and not as a plaintiff or class member in any purported class, collective, representative, or multi-party proceeding.</p>
            </div>
          </Section>

          <Section id="section-18" title="18. GOVERNING LAW AND JURISDICTION">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">18.1 Governing Law:</span> These Terms and any Dispute arising out of or relating to these Terms or the Platform shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.</p>
              <p><span className="font-semibold text-navy">18.2 Jurisdiction:</span> Subject to the arbitration provisions in Section 17, the courts located in Pune, Maharashtra, India shall have exclusive jurisdiction over any legal action, suit, or proceeding arising out of or relating to these Terms or the Platform.</p>
              <p><span className="font-semibold text-navy">18.3 Compliance with Local Laws:</span> You are responsible for compliance with all applicable local, state, national, and international laws and regulations in connection with your use of the Platform.</p>
            </div>
          </Section>

          <Section id="section-19" title="19. ANTI-CORRUPTION AND COMPLIANCE">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">19.1</span> You agree to comply with all applicable anti-corruption and anti-bribery laws, including but not limited to the Prevention of Corruption Act, 1988 (India), and the UK Bribery Act 2010 (if applicable).</p>
              <p><span className="font-semibold text-navy">19.2</span> You represent and warrant that you have not and will not, directly or indirectly, offer, promise, give, or authorize any payment or anything of value to any government official, political party, or candidate for political office for the purpose of influencing any act or decision or securing any improper advantage in connection with your use of the Platform or services.</p>
            </div>
          </Section>

          <Section id="section-20" title="20. SEVERABILITY">
            <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court or arbitrator of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its intent, or, if such modification is not possible, such provision shall be severed from these Terms. The invalidity, illegality, or unenforceability of any provision shall not affect the validity, legality, or enforceability of the remaining provisions, which shall continue in full force and effect.</p>
          </Section>

          <Section id="section-21" title="21. ENTIRE AGREEMENT">
            <p>These Terms, together with the Privacy Policy and any other legal notices or policies published by StrideNex on the Platform, constitute the entire agreement between you and StrideNex regarding your use of the Platform and supersede all prior or contemporaneous agreements, communications, representations, or understandings, whether written or oral, relating to the subject matter hereof. No waiver of any provision of these Terms shall be deemed a further or continuing waiver of such provision or any other provision.</p>
          </Section>

          <Section id="section-22" title="22. ASSIGNMENT">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">22.1</span> You may not assign, transfer, delegate, or sublicense any of your rights or obligations under these Terms without the prior written consent of StrideNex. Any attempted assignment in violation of this Section shall be null and void.</p>
              <p><span className="font-semibold text-navy">22.2</span> StrideNex may assign, transfer, or delegate its rights and obligations under these Terms to any third party, including in connection with a merger, acquisition, reorganization, sale of assets, or by operation of law, without your consent or prior notice.</p>
            </div>
          </Section>

          <Section id="section-23" title="23. NO WAIVER">
            <p>The failure of StrideNex to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision unless acknowledged and agreed to in writing by StrideNex. No waiver of any breach or default under these Terms shall be deemed a waiver of any subsequent breach or default.</p>
          </Section>

          <Section id="section-24" title="24. NOTICES">
            <div className="space-y-3">
              <p><span className="font-semibold text-navy">24.1</span> All notices, requests, demands, or other communications required or permitted under these Terms shall be in writing and shall be deemed given when delivered personally; when sent by confirmed electronic mail to the email address provided; three (3) business days after being sent by registered or certified mail, return receipt requested; or one (1) business day after being sent by recognized overnight courier service.</p>
              <p><span className="font-semibold text-navy">24.2 Notices to StrideNex:</span> StrideNex Private Limited, Registered Office: Pune, Maharashtra, India, Email: info@stridenex.ai</p>
              <p><span className="font-semibold text-navy">24.3 Notices to you:</span> Notices to you shall be sent to the email address associated with your account.</p>
            </div>
          </Section>

          <Section id="section-25" title="25. CONTACT INFORMATION">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="font-semibold text-navy mb-2">StrideNex Private Limited</p>
              <p className="text-slate-700">Registered Office: Pune, Maharashtra, India</p>
              <p className="text-slate-700">Email: <a href="mailto:info@stridenex.ai" className="text-accent hover:underline">info@stridenex.ai</a></p>
              <p className="text-slate-700">Website: <a href="https://stridenex.ai" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">www.stridenex.ai</a></p>
            </div>
          </Section>

          <Section id="section-26" title="26. ACKNOWLEDGMENT">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <p className="text-emerald-800">
                By using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy.
              </p>
              <p className="text-xs text-slate-500 mt-4">© 2026 StrideNex Private Limited. All rights reserved.</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}