import React from 'react';
import Layout from '../components/Layout';

const TermsPage = () => {
  return (
    <Layout>
      <div style={{ 
        minHeight: '100vh',
        padding: '48px 16px',
        maxWidth: 900,
        margin: '0 auto',
        color: '#e7e7e7'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '2.2rem', color: '#a259f7', margin: 0 }}>Terms & Conditions</h1>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
            padding: 16,
            background: 'rgba(162,89,247,0.1)',
            borderRadius: 12,
            border: '1px solid rgba(162,89,247,0.2)',
          }}
        >
          <h2 style={{ color: '#a259f7', fontSize: '1.3rem', fontWeight: 600, margin: '0 0 8px 0' }}>
            Shyara Digital — Rules & Regulations
          </h2>
          <p style={{ color: '#bdbdbd', fontSize: '0.95rem', margin: 0 }}>
            Welcome to Shyara Digital. By engaging our services, you agree to the following terms and conditions, which ensure smooth operations and mutual clarity.
          </p>
        </div>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>1. Payments</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Advance Payment is required before starting any project.</li>
            <li style={{ marginBottom: 8 }}>
              <strong>Social Media Management (SMM) / Video Editing:</strong>
              <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0 }}>
                <li style={{ marginBottom: 4 }}>50% advance before work begins.</li>
                <li style={{ marginBottom: 4 }}>Remaining 50% due within 15 days of service initiation.</li>
              </ul>
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Website Development & Festive Post Design:</strong>
              <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0 }}>
                <li style={{ marginBottom: 4 }}>50% advance before project starts.</li>
                <li style={{ marginBottom: 4 }}>Remaining balance payable upon completion, before submission/posting.</li>
              </ul>
            </li>
            <li style={{ marginBottom: 8 }}>All payments must be made via the channels communicated by Shyara Digital (UPI, Bank Transfer, PayPal, or payment gateway).</li>
            <li style={{ marginBottom: 8 }}>Invoices must be settled within 7 days of issue, unless otherwise agreed.</li>
            <li style={{ marginBottom: 8 }}>Late payments may incur a 2% fee per week after the due date.</li>
            <li style={{ marginBottom: 8 }}>No refunds will be issued after advance payment.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>2. Project Planning & Requirements</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>We require 2–3 working days after initial discussions to analyze requirements and prepare a detailed project plan.</li>
            <li style={{ marginBottom: 8 }}>Clients must provide all necessary credentials (e.g., social media logins, hosting access, brand assets) to allow us to deliver services smoothly.</li>
            <li style={{ marginBottom: 8 }}>Delays in providing credentials or content may result in adjustments to timelines.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>3. Deliverables & Revisions</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Social Media Posts & Reels will be shared for verification one day before posting.</li>
            <li style={{ marginBottom: 8 }}>Each deliverable (post, reel, video, design or website/app component) includes up to 5 revisions within the agreed scope.</li>
            <li style={{ marginBottom: 8 }}>Additional revisions beyond 5 rounds will be charged separately.</li>
            <li style={{ marginBottom: 8 }}>Final deliverables will only be shared after all payments are cleared as per payment terms.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>4. Scope Changes</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Any requests outside the agreed scope (new features, extra posts, additional designs) must be submitted as a Scope Change Request (SCR).</li>
            <li style={{ marginBottom: 8 }}>Scope changes may affect cost and delivery timelines.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>5. Refunds & Cancellations</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>No refunds are available after advance payment, in case of Social Media Management, Video Editing and Ads Management.</li>
            <li style={{ marginBottom: 8 }}>Refunds (if any) will only apply in cases where less than 20% of the project work has been delivered and the amount to be refunded will not exceed by more than 60% of the total project fee.</li>
            <li style={{ marginBottom: 8 }}>Gateway charges (PayPal, Razorpay, Stripe fees) are non-refundable.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>6. Confidentiality & Intellectual Property</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>All client data, credentials, and business information will remain confidential.</li>
            <li style={{ marginBottom: 8 }}>All deliverables remain the intellectual property of Shyara Digital until final payment is received.</li>
            <li style={{ marginBottom: 8 }}>Once fully paid, ownership of deliverables is transferred to the client (except for stock assets licensed by Shyara).</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>7. Timelines & Communication</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>Standard response time: within 24 business hours.</li>
            <li style={{ marginBottom: 8 }}>Weekly project updates will be shared via email.</li>
            <li style={{ marginBottom: 8 }}>Any delay from the client's side in approvals, credentials, or payments will extend timelines proportionally.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>8. Dispute Resolution</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>In case of disputes, both parties will first attempt resolution via discussion and email communication.</li>
            <li style={{ marginBottom: 8 }}>If unresolved, matters will be subject to the jurisdiction of Indian courts.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 12px 0' }}>9. General</h3>
          <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>By engaging our services, you confirm that you have the right to provide all content, media, and credentials necessary for the project.</li>
            <li style={{ marginBottom: 8 }}>Shyara Digital reserves the right to update these Rules & Regulations at any time.</li>
          </ul>
        </section>

        <div
          style={{
            marginTop: 32,
            padding: 20,
            background: 'rgba(162,89,247,0.05)',
            borderRadius: 12,
            border: '1px solid rgba(162,89,247,0.15)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#bdbdbd', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>
            Last updated: 16 November 2025
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;


