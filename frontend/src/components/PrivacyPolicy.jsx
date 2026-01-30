import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-terra-500" />
            <h1 className="text-[15px] font-semibold text-stone-950 dark:text-stone-100">Privacy Policy</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-8 md:p-10">
          <p className="text-[13px] text-stone-500 dark:text-stone-400 mb-2">
            Effective Date: January 29, 2025
          </p>
          <p className="text-[13px] text-stone-500 dark:text-stone-400 mb-8">
            Last Updated: January 29, 2025
          </p>

          <div className="space-y-10">
            {/* Introduction */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                1. Introduction
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  FounderLab ("Company," "we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access or use our website, applications, and services (collectively, the "Service").
                </p>
                <p>
                  Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use the Service.
                </p>
                <p>
                  We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                2. Information We Collect
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <p>
                  We collect information that you provide directly to us, information we obtain automatically when you use the Service, and information from third-party sources, as described below.
                </p>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    2.1 Information You Provide to Us
                  </h3>
                  <p className="mb-2">We collect information you voluntarily provide when you:</p>
                  <ul className="space-y-1.5 ml-1">
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Create an account:</strong> Name, email address, password, and optional profile information such as your role, technical background, and referral source.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Use our Service:</strong> Project names, descriptions, ideas, requirements, and any other content you input into the platform during your use of our AI-assisted features.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Communicate with us:</strong> Information contained in your communications when you contact our support team, provide feedback, or otherwise correspond with us.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Subscribe to our newsletter:</strong> Email address and communication preferences.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Participate in surveys or promotions:</strong> Responses, feedback, and any other information you choose to provide.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    2.2 Information Collected Automatically
                  </h3>
                  <p className="mb-2">When you access or use our Service, we automatically collect certain information, including:</p>
                  <ul className="space-y-1.5 ml-1">
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Device Information:</strong> Device type, operating system, unique device identifiers, browser type and version, and mobile network information.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Log Information:</strong> Access times, pages viewed, IP address, and the page you visited before navigating to our Service.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Usage Information:</strong> Features used, actions taken, time spent on pages, and interaction patterns within the Service.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span><strong className="text-stone-700 dark:text-stone-300">Location Information:</strong> General location based on your IP address (country and city level only).</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    2.3 Information from Third Parties
                  </h3>
                  <p>
                    We may receive information about you from third parties, including business partners, marketing partners, social media platforms (if you choose to link your account), and publicly available sources. This information may be combined with other information we collect about you.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                3. How We Use Your Information
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>We use the information we collect for the following purposes:</p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Provide and maintain the Service:</strong> To create and manage your account, deliver the features and functionality of our Service, and process your requests.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Improve and personalize:</strong> To understand how you use our Service, develop new products and features, and personalize your experience.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Communicate with you:</strong> To send you technical notices, updates, security alerts, support messages, and administrative communications.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Marketing:</strong> To send promotional communications (with your consent where required), such as information about products, services, features, and events offered by FounderLab.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Security and fraud prevention:</strong> To detect, investigate, and prevent fraudulent transactions, abuse, and other illegal activities, and to protect the rights and property of FounderLab and others.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Legal compliance:</strong> To comply with applicable laws, regulations, legal processes, or governmental requests.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Analytics and research:</strong> To conduct research and analysis to better understand our users and improve our Service.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Legal Basis for Processing */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                4. Legal Basis for Processing (EEA/UK Users)
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  If you are located in the European Economic Area (EEA) or United Kingdom (UK), we process your personal data based on the following legal grounds:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Contract:</strong> Processing necessary to perform our contract with you (i.e., providing the Service).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Legitimate Interests:</strong> Processing necessary for our legitimate interests, such as improving our Service, preventing fraud, and marketing (where not overridden by your rights).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Consent:</strong> Processing based on your consent, which you may withdraw at any time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Legal Obligation:</strong> Processing necessary to comply with our legal obligations.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Sharing of Information */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                5. Sharing of Information
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  We do not sell, rent, or trade your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Service Providers:</strong> We share information with third-party vendors, consultants, and service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance. These providers are bound by contractual obligations to keep personal information confidential and use it only for the purposes for which we disclose it to them.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company, your information may be transferred as part of that transaction.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Protection of Rights:</strong> We may disclose information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person, or as evidence in litigation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">With Your Consent:</strong> We may share your information with your consent or at your direction.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                6. Data Security
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  We implement appropriate technical and organizational security measures designed to protect the security of your personal information. These measures include:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Encryption of data in transit using industry-standard protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Encryption of sensitive data at rest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Regular security assessments and vulnerability testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Access controls and authentication mechanisms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Employee training on data protection and security practices</span>
                  </li>
                </ul>
                <p>
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                7. Data Retention
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. To determine the appropriate retention period, we consider:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>The amount, nature, and sensitivity of the personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>The potential risk of harm from unauthorized use or disclosure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>The purposes for which we process your personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Applicable legal, regulatory, tax, accounting, or other requirements</span>
                  </li>
                </ul>
                <p>
                  When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain certain information for legal or legitimate business purposes.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                8. Your Rights and Choices
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <p>
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.1 Access and Portability
                  </h3>
                  <p>
                    You have the right to request access to the personal information we hold about you and to receive a copy of your data in a structured, commonly used, and machine-readable format.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.2 Correction
                  </h3>
                  <p>
                    You have the right to request that we correct any inaccurate or incomplete personal information we hold about you.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.3 Deletion
                  </h3>
                  <p>
                    You have the right to request that we delete your personal information in certain circumstances, such as when it is no longer necessary for the purposes for which it was collected. You can delete your account and all associated data at any time through your account settings.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.4 Restriction and Objection
                  </h3>
                  <p>
                    You have the right to request that we restrict or stop processing your personal information in certain circumstances, including where you contest the accuracy of the information or object to our processing.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.5 Withdraw Consent
                  </h3>
                  <p>
                    Where we rely on your consent to process your personal information, you have the right to withdraw that consent at any time. This will not affect the lawfulness of any processing carried out before you withdraw your consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.6 Marketing Communications
                  </h3>
                  <p>
                    You may opt out of receiving promotional communications from us by following the unsubscribe instructions included in those messages. Even if you opt out, we may still send you non-promotional communications, such as those about your account or our ongoing business relations.
                  </p>
                </div>

                <p>
                  To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below. We will respond to your request within the timeframe required by applicable law.
                </p>
              </div>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                9. International Data Transfers
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  Your information may be transferred to, stored, and processed in countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country.
                </p>
                <p>
                  When we transfer personal information outside of the European Economic Area, United Kingdom, or other regions with comprehensive data protection laws, we ensure that appropriate safeguards are in place, such as standard contractual clauses approved by the relevant authorities, or other lawful transfer mechanisms.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                10. Cookies and Tracking Technologies
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  We use cookies and similar tracking technologies to collect and track information about your use of our Service. Cookies are small data files stored on your device that help us improve our Service and your experience.
                </p>
                <p>
                  <strong className="text-stone-700 dark:text-stone-300">Types of cookies we use:</strong>
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Essential Cookies:</strong> Required for the operation of our Service. They enable core functionality such as security, network management, and account authentication.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Preference Cookies:</strong> Allow us to remember your preferences and settings, such as your theme preference.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Analytics Cookies:</strong> Help us understand how visitors interact with our Service by collecting and reporting information anonymously.</span>
                  </li>
                </ul>
                <p>
                  You can configure your browser to refuse cookies or alert you when cookies are being sent. However, if you disable cookies, some features of our Service may not function properly.
                </p>
              </div>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                11. Third-Party Links and Services
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  Our Service may contain links to third-party websites, services, or applications that are not operated by us. This Privacy Policy does not apply to third-party services, and we are not responsible for the content, privacy policies, or practices of any third-party services.
                </p>
                <p>
                  We encourage you to review the privacy policies of any third-party services you access through our Service.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                12. Children's Privacy
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  Our Service is not directed to individuals under the age of 16 ("Children"). We do not knowingly collect personal information from Children. If you are a parent or guardian and you are aware that your Child has provided us with personal information, please contact us immediately.
                </p>
                <p>
                  If we become aware that we have collected personal information from Children without verification of parental consent, we will take steps to delete that information from our servers promptly.
                </p>
              </div>
            </section>

            {/* California Privacy Rights */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                13. California Privacy Rights
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Right to Know:</strong> You have the right to request information about the categories and specific pieces of personal information we have collected, the sources of that information, the business purpose for collecting it, and the categories of third parties with whom we share it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Right to Delete:</strong> You have the right to request deletion of your personal information, subject to certain exceptions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Right to Correct:</strong> You have the right to request correction of inaccurate personal information.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Right to Opt-Out:</strong> You have the right to opt out of the sale or sharing of your personal information. We do not sell your personal information.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Non-Discrimination:</strong> We will not discriminate against you for exercising any of your privacy rights.</span>
                  </li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information in the "Contact Us" section. We may need to verify your identity before processing your request.
                </p>
              </div>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                14. Changes to This Privacy Policy
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Update the "Last Updated" date at the top of this Privacy Policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Notify you via email or through a prominent notice on our Service</span>
                  </li>
                </ul>
                <p>
                  We encourage you to review this Privacy Policy periodically for any changes. Your continued use of the Service after any modifications indicates your acceptance of the updated Privacy Policy.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                15. Contact Us
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 mt-3">
                  <p className="font-medium text-stone-800 dark:text-stone-200">FounderLab</p>
                  <p className="mt-1">
                    Email:{' '}
                    <a
                      href="mailto:privacy@founderlab.app"
                      className="text-terra-500 hover:text-terra-600 dark:hover:text-terra-400 transition-colors"
                    >
                      privacy@founderlab.app
                    </a>
                  </p>
                </div>
                <p className="mt-3">
                  We will endeavor to respond to your inquiry within 30 days or as required by applicable law. If you are located in the EEA or UK and are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
