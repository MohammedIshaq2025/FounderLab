import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

function TermsConditions() {
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
            <FileText className="w-4 h-4 text-terra-500" />
            <h1 className="text-[15px] font-semibold text-stone-950 dark:text-stone-100">Terms of Service</h1>
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
                1. Agreement to Terms
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("you," "your," or "User") and FounderLab ("Company," "we," "our," or "us") governing your access to and use of the FounderLab website, applications, and services (collectively, the "Service").
                </p>
                <p>
                  By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, and "you" will refer to both you and that organization.
                </p>
                <p>
                  <strong className="text-stone-700 dark:text-stone-300">IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE SERVICE.</strong>
                </p>
              </div>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                2. Eligibility
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  To use the Service, you must:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Be at least 16 years of age (or the age of majority in your jurisdiction, whichever is greater)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Have the legal capacity to enter into a binding agreement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Not be prohibited from using the Service under applicable laws</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Not have been previously suspended or removed from the Service</span>
                  </li>
                </ul>
                <p>
                  By using the Service, you represent and warrant that you meet all eligibility requirements.
                </p>
              </div>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                3. Description of Service
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  FounderLab is an AI-powered platform that assists founders, product managers, and entrepreneurs in transforming startup ideas into comprehensive Product Requirement Documents (PRDs) and related documentation. The Service includes:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>AI-guided ideation and brainstorming sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Feature mapping and prioritization tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Visual mind mapping and architecture visualization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Automated PRD generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Document export and sharing capabilities</span>
                  </li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
                </p>
              </div>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                4. Account Registration and Security
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    4.1 Account Creation
                  </h3>
                  <p>
                    To access certain features of the Service, you must create an account. When creating an account, you agree to provide accurate, current, and complete information and to update such information to keep it accurate, current, and complete.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    4.2 Account Security
                  </h3>
                  <p className="mb-2">You are responsible for:</p>
                  <ul className="space-y-1.5 ml-1">
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Maintaining the confidentiality of your account credentials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>All activities that occur under your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Notifying us immediately of any unauthorized access or use of your account</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    4.3 Account Restrictions
                  </h3>
                  <p>
                    You may not share your account credentials with any third party, create multiple accounts for deceptive purposes, or use another user's account without permission.
                  </p>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                5. Acceptable Use Policy
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    5.1 Permitted Uses
                  </h3>
                  <p>
                    You may use the Service only for lawful purposes and in accordance with these Terms. You agree to use the Service solely for its intended purpose of creating product documentation and related business planning activities.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    5.2 Prohibited Conduct
                  </h3>
                  <p className="mb-2">You agree NOT to:</p>
                  <ul className="space-y-1.5 ml-1">
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Violate any applicable federal, state, local, or international law or regulation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Infringe upon or violate the intellectual property rights or privacy rights of any third party</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Transmit any material that is defamatory, obscene, threatening, abusive, harassing, or otherwise objectionable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Impersonate or attempt to impersonate the Company, an employee, another user, or any other person or entity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Use the Service to generate spam, unsolicited communications, or content intended to deceive</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Attempt to gain unauthorized access to any portion of the Service, other accounts, computer systems, or networks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Use any robot, spider, scraper, or other automated means to access the Service without our express written permission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Interfere with, disrupt, or create an undue burden on the Service or the networks or services connected to the Service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code of the Service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-terra-500 mt-1.5">•</span>
                      <span>Use the Service to develop a competing product or service</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                6. Intellectual Property Rights
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    6.1 Company Intellectual Property
                  </h3>
                  <p>
                    The Service and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, graphics, video, audio, design, selection, and arrangement) are owned by the Company, its licensors, or other providers and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    6.2 Limited License
                  </h3>
                  <p>
                    Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Service for your personal or internal business purposes. This license does not include any right to resell or commercial use of the Service or its contents, collect or use any product listings, descriptions, or prices, make any derivative use of the Service or its contents, or download or copy account information for the benefit of a third party.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    6.3 Your Content
                  </h3>
                  <p>
                    You retain all ownership rights in the content, ideas, and materials you submit to the Service ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content solely for the purpose of providing and improving the Service. This license terminates when you delete your User Content or your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    6.4 Generated Content
                  </h3>
                  <p>
                    Subject to your compliance with these Terms, you own all rights to the documents, PRDs, and other outputs generated through your use of the Service ("Generated Content"). You are free to use, modify, distribute, and commercialize your Generated Content without restriction. We claim no ownership rights over your Generated Content.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    6.5 Feedback
                  </h3>
                  <p>
                    If you provide any feedback, suggestions, or ideas about the Service ("Feedback"), you grant us an irrevocable, perpetual, worldwide, royalty-free license to use such Feedback for any purpose without compensation or attribution to you.
                  </p>
                </div>
              </div>
            </section>

            {/* AI-Generated Content */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                7. AI-Generated Content Disclaimer
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  The Service utilizes artificial intelligence and machine learning technologies to generate content. You acknowledge and agree that:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">No Guarantee of Accuracy:</strong> AI-generated content may contain errors, inaccuracies, omissions, or may not be suitable for your specific circumstances. You are solely responsible for reviewing, validating, and verifying all generated content before use.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Not Professional Advice:</strong> Generated content does not constitute legal, financial, technical, business, or other professional advice. You should consult with qualified professionals for advice specific to your situation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Your Responsibility:</strong> You are solely responsible for all decisions made and actions taken based on AI-generated content. We disclaim all liability for any consequences arising from your use of or reliance on such content.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span><strong className="text-stone-700 dark:text-stone-300">Continuous Improvement:</strong> AI technology is continuously evolving. The quality, accuracy, and capabilities of generated content may vary and change over time.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                8. Payment Terms
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.1 Fees
                  </h3>
                  <p>
                    Certain features of the Service may require payment of fees. All fees are stated in U.S. dollars unless otherwise specified. You agree to pay all applicable fees and charges associated with your use of the Service.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.2 Billing
                  </h3>
                  <p>
                    If you purchase a subscription, you authorize us to charge your payment method on a recurring basis until you cancel. Subscription fees are billed in advance on a monthly or annual basis, depending on your selected plan.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.3 Price Changes
                  </h3>
                  <p>
                    We reserve the right to change our prices at any time. If we change prices for a subscription you have already purchased, we will provide you with at least 30 days' notice before the new prices take effect.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.4 Refunds
                  </h3>
                  <p>
                    Unless otherwise required by applicable law, all fees are non-refundable. We may, in our sole discretion, provide a refund, discount, or credit in specific circumstances.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    8.5 Taxes
                  </h3>
                  <p>
                    All fees are exclusive of applicable taxes, levies, or duties imposed by taxing authorities. You are responsible for paying all such taxes, levies, or duties.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                9. Service Availability and Modifications
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  We strive to ensure the Service is available 24 hours a day, 7 days a week. However, we do not guarantee uninterrupted or error-free operation of the Service. The Service may be temporarily unavailable due to:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Scheduled maintenance and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Emergency maintenance or repairs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Circumstances beyond our reasonable control (force majeure)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Issues with third-party services or internet connectivity</span>
                  </li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
                </p>
              </div>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                10. Disclaimer of Warranties
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p className="uppercase font-medium text-stone-700 dark:text-stone-300">
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY CONTENT OR INFORMATION</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>WARRANTIES THAT DEFECTS WILL BE CORRECTED OR THAT THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS</span>
                  </li>
                </ul>
                <p>
                  Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                11. Limitation of Liability
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p className="font-medium text-stone-700 dark:text-stone-300">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>IN NO EVENT SHALL FOUNDERLAB, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).</span>
                  </li>
                </ul>
                <p>
                  THESE LIMITATIONS APPLY WHETHER THE ALLEGED LIABILITY IS BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR ANY OTHER BASIS, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
                <p>
                  Some jurisdictions do not allow the limitation or exclusion of liability for incidental or consequential damages, so the above limitations may not apply to you.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                12. Indemnification
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  You agree to defend, indemnify, and hold harmless FounderLab, its officers, directors, employees, agents, licensors, and service providers from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including but not limited to attorney's fees) arising from or related to:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Your use of or access to the Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Your violation of these Terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Your violation of any third-party rights, including intellectual property or privacy rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Any claim that your User Content caused damage to a third party</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Your violation of any applicable law or regulation</span>
                  </li>
                </ul>
                <p>
                  We reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate with our defense of such claims.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                13. Termination
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    13.1 Termination by You
                  </h3>
                  <p>
                    You may terminate your account at any time by using the account deletion feature in your account settings or by contacting us. Upon termination, your right to use the Service will immediately cease.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    13.2 Termination by Us
                  </h3>
                  <p>
                    We may suspend or terminate your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. Upon termination, your license to use the Service will immediately cease.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    13.3 Effect of Termination
                  </h3>
                  <p>
                    Upon termination, we may delete your account and all associated data, including User Content and Generated Content. We recommend exporting any data you wish to retain before terminating your account. Sections of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property provisions, warranty disclaimers, indemnification, and limitations of liability.
                  </p>
                </div>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                14. Dispute Resolution
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    14.1 Informal Resolution
                  </h3>
                  <p>
                    Before filing a formal legal claim, you agree to attempt to resolve any dispute informally by contacting us. We will attempt to resolve the dispute informally by contacting you via email. If a dispute is not resolved within 60 days of submission, either party may proceed to formal dispute resolution.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    14.2 Arbitration Agreement
                  </h3>
                  <p>
                    Subject to applicable law, any dispute arising from or relating to these Terms or the Service shall be finally settled by binding arbitration. The arbitration shall be conducted in accordance with the rules of the American Arbitration Association. The arbitrator's decision shall be final and binding. Judgment on the arbitration award may be entered in any court of competent jurisdiction.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    14.3 Class Action Waiver
                  </h3>
                  <p>
                    YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. You agree to waive any right to participate in a class action lawsuit or class-wide arbitration.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    14.4 Exceptions
                  </h3>
                  <p>
                    Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to protect its intellectual property rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                15. Governing Law
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  These Terms and any dispute arising from or relating to them or the Service shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles.
                </p>
                <p>
                  For any disputes not subject to arbitration, you agree to submit to the personal and exclusive jurisdiction of the state and federal courts located in Delaware.
                </p>
              </div>
            </section>

            {/* General Provisions */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                16. General Provisions
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    16.1 Entire Agreement
                  </h3>
                  <p>
                    These Terms, together with our Privacy Policy and any other agreements expressly incorporated by reference, constitute the entire agreement between you and FounderLab concerning the Service.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    16.2 Severability
                  </h3>
                  <p>
                    If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    16.3 Waiver
                  </h3>
                  <p>
                    Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision. Any waiver must be in writing and signed by an authorized representative of FounderLab.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    16.4 Assignment
                  </h3>
                  <p>
                    You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    16.5 Force Majeure
                  </h3>
                  <p>
                    We shall not be liable for any failure or delay in performing our obligations due to causes beyond our reasonable control, including but not limited to acts of God, war, terrorism, riots, natural disasters, government actions, labor disputes, or failures of third-party services.
                  </p>
                </div>

                <div>
                  <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-200 mb-2">
                    16.6 Notices
                  </h3>
                  <p>
                    We may provide notices to you via email, posting on the Service, or other reasonable means. You may provide notices to us via the contact information below.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                17. Changes to Terms
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  We reserve the right to modify these Terms at any time. When we make material changes, we will:
                </p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Update the "Last Updated" date at the top of these Terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1.5">•</span>
                    <span>Provide notice via email or prominent notice on the Service</span>
                  </li>
                </ul>
                <p>
                  Your continued use of the Service after any modifications indicates your acceptance of the updated Terms. If you do not agree to the modified Terms, you must stop using the Service and terminate your account.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-[17px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
                18. Contact Us
              </h2>
              <div className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 mt-3">
                  <p className="font-medium text-stone-800 dark:text-stone-200">FounderLab</p>
                  <p className="mt-1">
                    Email:{' '}
                    <a
                      href="mailto:legal@founderlab.app"
                      className="text-terra-500 hover:text-terra-600 dark:hover:text-terra-400 transition-colors"
                    >
                      legal@founderlab.app
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;
