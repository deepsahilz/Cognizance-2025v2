import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import sarah from "../assets/images/sarah.jpeg";
import miguel from "../assets/images/miguel.png";

export default function Landing() {
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: false,
      mirror: false,
      offset: 120,
    });

    // Refresh AOS when components fully load
    window.addEventListener("load", AOS.refresh);

    return () => {
      window.removeEventListener("load", AOS.refresh);
    };
  }, []);

  // Toast notification functions
  const showSuccessToast = () =>
    toast.success("Sign up successful! Welcome to PayCraft!");
  const showTrialToast = () => toast.info("Your 14-day trial has started!");
  const showContactToast = () =>
    toast.info("Our sales team will contact you shortly!");

  return (
    <div className="hero-wrapper">
      <Helmet>
        <title>PayCraft - Fair Payments for Web Developers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* <nav data-aos="fade-down" data-aos-delay="100">
        <div className="logo">Pay<span>Craft</span></div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#pricing">Pricing</a>
        </div>
        <button className="cta-button" onClick={showSuccessToast}>Sign Up Free</button>
      </nav> */}

      <section className="hero">
        <div
          className="hero-content"
          data-aos="fade-right"
          data-aos-delay="200"
        >
          
          <h1>Empowering Freelancers, Ensuring Fair Payments</h1>
          <p>
            PayCraft provides transparent, timely payments with comprehensive
            project tracking. Say goodbye to payment delays and hello to fair
            compensation for your work.
          </p>
          <button className="cta-button" onClick={showSuccessToast}>
            Get Started Free
          </button>
        </div>
        <div className="hero-img">
          <div className="payment-card" data-aos="fade-up" data-aos-delay="800">
            <h4>Website Development</h4>
            <div className="payment-amount">0.8 ETH</div>
            <span className="payment-status">Paid on time</span>
          </div>
          <div className="payment-card" data-aos="fade-up" data-aos-delay="1000">
            <h4>E-commerce Platform</h4>
            <div className="payment-amount">1.5 ETH</div>
            <span className="payment-status">In escrow</span>
          </div>
          <div className="payment-card" data-aos="fade-up" data-aos-delay="1200">
            <h4>Mobile App UI</h4>
            <div className="payment-amount">0.9 ETH</div>
            <span className="payment-status">Payment due</span>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-title" data-aos="fade-up">
          <h2>Why Choose PayCraft?</h2>
          <p>
            Our platform is designed with freelance web developers in mind,
            ensuring you get paid fairly for every line of code.
          </p>
        </div>

        <div className="feature-grid">
          <div
            className="feature-card"
            data-aos="zoom-in-up"
            data-aos-delay="100"
          >
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
              </svg>
            </div>
            <h3>On-time Payments</h3>
            <p>
              Get paid on schedule with automated reminders and payment
              processing. No more chasing clients for overdue invoices.
            </p>
          </div>

          <div
            className="feature-card"
            data-aos="zoom-in-up"
            data-aos-delay="200"
          >
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
              </svg>
            </div>
            <h3>Complete Transparency</h3>
            <p>
              View detailed breakdowns of project costs, hours tracked, and
              payment status at every stage of your project.
            </p>
          </div>

          <div
            className="feature-card"
            data-aos="zoom-in-up"
            data-aos-delay="300"
          >
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M13 16.938V19h5v2H6v-2h5v-2.062A8.001 8.001 0 0 1 4 9V3h16v6a8.001 8.001 0 0 1-7 7.938zM6 5v4a6 6 0 1 0 12 0V5H6zM1 5h2v4H1V5zm20 0h2v4h-2V5z" />
              </svg>
            </div>
            <h3>Fair Dispute Resolution</h3>
            <p>
              Our unbiased mediation process ensures both parties are heard and
              disputes are resolved fairly and quickly.
            </p>
          </div>

          <div
            className="feature-card"
            data-aos="zoom-in-up"
            data-aos-delay="400"
          >
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16zm-5 4h4v2h-4v-2z" />
              </svg>
            </div>
            <h3>Multiple Payment Options</h3>
            <p>
              Choose from various payment methods including bank transfers,
              PayPal, Stripe, and even cryptocurrency options.
            </p>
          </div>

          <div
            className="feature-card"
            data-aos="zoom-in-up"
            data-aos-delay="500"
          >
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.083 15.2l1.202.721a.5.5 0 0 1 0 .858l-8.77 5.262a1 1 0 0 1-1.03 0l-8.77-5.262a.5.5 0 0 1 0-.858l1.202-.721L12 20.05l8.083-4.85zm0-4.7l1.202.721a.5.5 0 0 1 0 .858L12 17.65l-9.285-5.571a.5.5 0 0 1 0-.858l1.202-.721L12 15.35l8.083-4.85zm-7.569-9.191l8.771 5.262a.5.5 0 0 1 0 .858L12 13 2.715 7.429a.5.5 0 0 1 0-.858l8.77-5.262a1 1 0 0 1 1.03 0zM12 3.332L5.887 7 12 10.668 18.113 7 12 3.332z" />
              </svg>
            </div>
            <h3>Milestone Tracking</h3>
            <p>
              Break projects into clear milestones with associated payments to
              ensure smooth project progression and fair compensation.
            </p>
          </div>

          <div
            className="feature-card"
            data-aos="zoom-in-up"
            data-aos-delay="600"
          >
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5 3v16h16v2H3V3h2zm15.293 3.293l1.414 1.414L16 13.414l-3-2.999-4.293 4.292-1.414-1.414L13 7.586l3 2.999 4.293-4.292z" />
              </svg>
            </div>
            <h3>Performance Analytics</h3>
            <p>
              Track your earnings, project completion rates, and client
              satisfaction scores to continually improve your freelance
              business.
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="section-title" data-aos="fade-up">
          <h2>How PayCraft Works</h2>
          <p>
            Our simple, four-step process ensures you get paid fairly for every
            project.
          </p>
        </div>

        <div className="steps-container">
          <div className="step" data-aos="fade-right" data-aos-delay="100">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Your Project</h3>
              <p>
                Set up your web development project with detailed scope,
                timeline, and milestones. Invite your client to join the
                platform.
              </p>
            </div>
          </div>

          <div className="step" data-aos="fade-right" data-aos-delay="300">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Client Funds Escrow</h3>
              <p>
                Your client funds a secure escrow account for the project or
                milestone. Funds are held safely until work is completed and
                approved.
              </p>
            </div>
          </div>

          <div className="step" data-aos="fade-right" data-aos-delay="500">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Track Progress & Time</h3>
              <p>
                Use our built-in time tracking and progress reporting tools to
                document your work. Updates are shared automatically with your
                client.
              </p>
            </div>
          </div>

          <div className="step" data-aos="fade-right" data-aos-delay="700">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Get Paid Automatically</h3>
              <p>
                Once milestones are approved, payment is automatically released
                from escrow to your preferred payment method within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="who-is-for py-16 bg-[#0F172A]" id="who-is-for">
        <div className="container mx-auto text-center">
          {/* Section Title */}
          <div className="section-title mb-8" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-white">Who Is This For?</h2>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 who-is-for-content">
            {/* Freelancer Card */}
            <div
              className="feature-card bg-[#1E293B] p-6 shadow-lg rounded-lg text-center"
              data-aos="zoom-in-up"
              data-aos-delay="100"
            >
              <div className="feature-icon mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-12 h-12 text-blue-400 mx-auto"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
                </svg>
              </div>
              <strong className="text-lg text-white">Freelancers</strong>
              <p className="text-gray-300 mt-2">
                Say goodbye to unpaid invoices.
              </p>
            </div>

            {/* Client Card */}
            <div
              className="feature-card bg-[#1E293B] p-6 shadow-lg rounded-lg text-center"
              data-aos="zoom-in-up"
              data-aos-delay="300"
            >
              <div className="feature-icon mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-12 h-12 text-green-400 mx-auto"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
                </svg>
              </div>
              <strong className="text-lg text-white">Clients</strong>
              <p className="text-gray-300 mt-2">
                Hire with confidence, knowing your money is protected.
              </p>
            </div>

            {/* Agencies & Teams Card */}
            <div
              className="feature-card bg-[#1E293B] p-6 shadow-lg rounded-lg text-center"
              data-aos="zoom-in-up"
              data-aos-delay="500"
            >
              <div className="feature-icon mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-12 h-12 text-purple-400 mx-auto"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
                </svg>
              </div>
              <strong className="text-lg text-white">Agencies & Teams</strong>
              <p className="text-gray-300 mt-2">
                Scale effortlessly with automated payment flows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <div className="section-title" data-aos="fade-up">
          <h2>Developers Love Us</h2>
          <p>
            Don't just take our word for it. Here's what freelance web
            developers are saying about PayCraft.
          </p>
        </div>

        <div className="testimonial-grid">
          <div
            className="testimonial-card"
            data-aos="flip-left"
            data-aos-delay="100"
          >
            <div className="testimonial-text">
              "After years of chasing payments and dealing with unclear project
              scopes, PayCraft has completely transformed my freelance business.
              I now get paid on time, every time."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src={sarah} alt="Developer portrait" />
              </div>
              <div>
                <div className="author-name">Sarah Johnson</div>
                <div className="author-title">Full-Stack Developer</div>
              </div>
            </div>
          </div>

          <div
            className="testimonial-card"
            data-aos="flip-left"
            data-aos-delay="300"
          >
            <div className="testimonial-text">
              "The milestone feature is a game-changer. Breaking down projects
              into manageable chunks with associated payments has improved both
              my cash flow and client relationships."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img
                  src="https://mediaassets.cbre.com/cdn/-/media/project/cbre/shared-site/headshots/a/l/e/alex-chen.jpg?rev=c074d60b5f3b4ec2bd02785b7d2f30a6&hash=0d3e560e170e011afca49ed68e78d01f&key=personhero-default&device=desktop"
                  alt="Developer portrait"
                />
              </div>
              <div>
                <div className="author-name">Alex Chen</div>
                <div className="author-title">Front-end Developer</div>
              </div>
            </div>
          </div>

          <div
            className="testimonial-card"
            data-aos="flip-left"
            data-aos-delay="500"
          >
            <div className="testimonial-text">
              "I had a dispute with a client that could have ended badly, but
              PayCraft's mediation service resolved it fairly. The transparency
              tools also prevent most issues before they start."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img src={miguel} alt="Developer portrait" />
              </div>
              <div>
                <div className="author-name">Miguel Santos</div>
                <div className="author-title">WordPress Developer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="section-title" data-aos="fade-up">
          <h2>Simple, Transparent Pricing</h2>
          <p>
            Choose the plan that fits your freelance business needs. No hidden
            fees, ever.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card" data-aos="fade-up" data-aos-delay="100">
            <h3 className="pricing-name">Starter</h3>
            <div className="pricing-price">
              $0<small>/month</small>
            </div>
            <ul className="pricing-features">
              <li>Up to 3 active projects</li>
              <li>Basic time tracking</li>
              <li>Standard payment processing (3% fee)</li>
              <li>Email support</li>
              <li>48-hour payment release</li>
            </ul>
            <button className="cta-button" onClick={showSuccessToast}>
              Sign Up Free
            </button>
          </div>

          <div
            className="pricing-card featured"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h3 className="pricing-name">Professional</h3>
            <div className="pricing-price">
              $19<small>/month</small>
            </div>
            <ul className="pricing-features">
              <li>Unlimited active projects</li>
              <li>Advanced time tracking & reporting</li>
              <li>Reduced payment processing (1.5% fee)</li>
              <li>Priority support</li>
              <li>24-hour payment release</li>
              <li>Custom contract templates</li>
            </ul>
            <button className="cta-button" onClick={showTrialToast}>
              Start 14-Day Trial
            </button>
          </div>

          <div className="pricing-card" data-aos="fade-up" data-aos-delay="500">
            <h3 className="pricing-name">Agency</h3>
            <div className="pricing-price">
              $49<small>/month</small>
            </div>
            <ul className="pricing-features">
              <li>Team collaboration features</li>
              <li>Client portal & white-labeling</li>
              <li>Minimal payment processing (0.5% fee)</li>
              <li>24/7 premium support</li>
              <li>Same-day payment release</li>
              <li>API access for custom integrations</li>
            </ul>
            <button className="cta-button" onClick={showContactToast}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <section className="cta" data-aos="zoom-in">
        <h2>Ready to Get Paid What You're Worth?</h2>
        <p>
          Join thousands of web developers who have transformed their freelance
          business with fair, transparent, and on-time payments.
        </p>
        <button className="cta-button-alt" onClick={showTrialToast}>
          Start Your Free Trial Today
        </button>
      </section>

      <footer>
        <div className="footer-grid">
          <div className="footer-col" data-aos="fade-up" data-aos-delay="100">
            <h4>PayCraft</h4>
            <ul className="footer-links">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
            </ul>
          </div>

          <div className="footer-col" data-aos="fade-up" data-aos-delay="200">
            <h4>Features</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Payment Protection</a>
              </li>
            </ul>
          </div>

          <div className="footer-col" data-aos="fade-up" data-aos-delay="300">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Freelancer Guide</a>
              </li>
            </ul>
          </div>

          <div className="footer-col" data-aos="fade-up" data-aos-delay="400">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Security</a>
              </li>
              <li>
                <a href="#">Compliance</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 PayCraft. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        :root {
          --primary: #3edbd3;
          --secondary: #4a7bf7;
          --accent: #ff6ec7;
          --dark-bg: #0f172a;
          --darker-bg: #0b1120;
          --card-bg: #1e293b;
          --light-text: #f8fafc;
          --muted-text: #94a3b8;
          --border-radius: 12px;
        }

        // .hero-wrapper{
        //     margin: 0;
        //     padding: 0;
        //     box-sizing: border-box;
        //     font-family: 'Space Grotesk', sans-serif;
        // }

        // .hero-wrapper {
        //     background: linear-gradient(135deg, var(--dark-bg) 0%, var(--darker-bg) 100%);
        //     color: var(--light-text);
        //     line-height: 1.6;
        // }

        // nav {
        //     display: flex;
        //     justify-content: space-between;
        //     align-items: center;
        //     padding: 1.5rem 5%;
        //     background: rgba(15, 23, 42, 0.8);
        //     backdrop-filter: blur(10px);
        //     position: fixed;
        //     width: 100%;
        //     top: 0;
        //     z-index: 1000;
        // }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: -0.5px;
        }

        .logo span {
          color: var(--secondary);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--light-text);
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: var(--primary);
        }

        .cta-button {
          background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
          color: var(--darker-bg);
          padding: 0.7rem 1.5rem;
          border: none;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(62, 219, 211, 0.2);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 5% 5rem;
          background: linear-gradient(
              135deg,
              rgba(15, 23, 42, 0.9) 0%,
              rgba(11, 17, 32, 0.9) 100%
            ),
            url("/api/placeholder/1920/1080") center/cover;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 70% 30%,
            rgba(62, 219, 211, 0.15) 0%,
            transparent 70%
          );
        }

        .hero-content {
          flex: 1;
          padding-right: 2rem;
          position: relative;
          z-index: 2;
        }

        .hero-img {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .payment-card {
          background: var(--card-bg);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          width: 280px;
          position: absolute;
          transition: all 0.3s;
        }

        .payment-card:nth-child(1) {
          transform: rotate(-10deg) translateX(-60px);
          z-index: 1;
        }

        .payment-card:nth-child(2) {
          z-index: 3;
        }

        .payment-card:nth-child(3) {
          transform: rotate(10deg) translateX(60px);
          z-index: 2;
        }

        .payment-card:hover {
          transform: scale(1.05);
          z-index: 4;
        }

        .payment-card h4 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }

        .payment-amount {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }

        .payment-status {
          background: rgba(62, 219, 211, 0.2);
          color: var(--primary);
          padding: 0.3rem 0.8rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 500;
          display: inline-block;
        }

        .hero h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          letter-spacing: -1px;
          font-weight: 700;
          background: linear-gradient(
            90deg,
            var(--light-text) 0%,
            var(--primary) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: var(--muted-text);
          max-width: 600px;
        }

        .accent {
          color: var(--primary);
        }

        .section-title {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .section-title::after {
          content: "";
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
          border-radius: 3px;
        }

        .section-title h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -1px;
          background: linear-gradient(
            90deg,
            var(--light-text) 0%,
            var(--primary) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .section-title p {
          color: var(--muted-text);
          max-width: 700px;
          margin: 0 auto;
        }

        .features {
          padding: 5rem 5%;
          background: var(--darker-bg);
          position: relative;
          overflow: hidden;
        }

        .features::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 20% 80%,
            rgba(74, 123, 247, 0.1) 0%,
            transparent 70%
          );
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          position: relative;
          z-index: 2;
        }

        .feature-card {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .feature-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          background: rgba(62, 219, 211, 0.1);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feature-icon svg {
          width: 30px;
          height: 30px;
          fill: var(--primary);
        }

        .feature-card h3 {
          margin-bottom: 1rem;
          font-size: 1.3rem;
          color: var(--light-text);
        }

        .feature-card p {
          color: var(--muted-text);
        }

        .how-it-works {
          padding: 5rem 5%;
          background: var(--dark-bg);
          position: relative;
        }

        .how-it-works::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 80% 40%,
            rgba(255, 110, 199, 0.1) 0%,
            transparent 70%
          );
        }

        .steps-container {
          display: flex;
          flex-direction: column;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .step {
          display: flex;
          margin-bottom: 3rem;
          position: relative;
        }

        .step:last-child {
          margin-bottom: 0;
        }

        .step::after {
          content: "";
          position: absolute;
          top: 40px;
          left: 20px;
          width: 2px;
          height: calc(100% + 15px);
          background: linear-gradient(to bottom, var(--primary), transparent);
          z-index: 1;
        }

        .step:last-child::after {
          display: none;
        }

        .step-number {
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
          color: var(--darker-bg);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
          margin-right: 1.5rem;
          position: relative;
          z-index: 2;
        }

        .step-content {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: var(--border-radius);
          border: 1px solid rgba(255, 255, 255, 0.05);
          flex: 1;
        }

        .step-content h3 {
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
          color: var(--light-text);
        }

        .step-content p {
          color: var(--muted-text);
        }

        .testimonials {
          padding: 5rem 5%;
          background: var(--darker-bg);
          position: relative;
          overflow: hidden;
        }

        .testimonials::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 20% 30%,
            rgba(62, 219, 211, 0.1) 0%,
            transparent 70%
          );
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          position: relative;
          z-index: 2;
        }

        .testimonial-card {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .testimonial-text {
          font-style: italic;
          margin-bottom: 1.5rem;
          color: var(--muted-text);
          position: relative;
        }

        .testimonial-text::before {
          content: '"';
          font-size: 3rem;
          position: absolute;
          top: -20px;
          left: -10px;
          color: rgba(62, 219, 211, 0.2);
          font-family: serif;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 1rem;
          border: 2px solid var(--primary);
        }

        .author-name {
          font-weight: 600;
          color: var(--light-text);
        }

        .author-title {
          color: var(--primary);
          font-size: 0.9rem;
        }

        .pricing {
          padding: 5rem 5%;
          background: var(--dark-bg);
          position: relative;
          overflow: hidden;
        }

        .pricing::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 80% 80%,
            rgba(74, 123, 247, 0.1) 0%,
            transparent 70%
          );
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .pricing-card {
          background: var(--card-bg);
          padding: 3rem 2rem;
          border-radius: var(--border-radius);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pricing-card.featured {
          transform: scale(1.05);
          border: 2px solid var(--primary);
        }

        .pricing-card.featured::before {
          content: "Popular";
          position: absolute;
          top: 1rem;
          right: -2rem;
          background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
          color: var(--darker-bg);
          padding: 0.3rem 3rem;
          transform: rotate(45deg);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .pricing-card.featured:hover {
          transform: translateY(-5px) scale(1.05);
        }

        .pricing-name {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--light-text);
        }

        .pricing-price {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: var(--primary);
        }

        .pricing-price small {
          font-size: 1rem;
          font-weight: 400;
          color: var(--muted-text);
        }

        .pricing-features {
          list-style: none;
          margin-bottom: 2rem;
          text-align: left;
        }

        .pricing-features li {
          padding: 0.7rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--muted-text);
        }

        .pricing-features li::before {
          content: "✓";
          margin-right: 8px;
          color: var(--primary);
        }

        .pricing-features li:last-child {
          border-bottom: none;
        }

        .cta {
          padding: 5rem 5%;
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
          color: var(--darker-bg);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .cta h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
          color: var(--darker-bg);
          position: relative;
        }

        .cta p {
          margin-bottom: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          color: rgba(11, 17, 32, 0.8);
          position: relative;
        }

        .cta-button-alt {
          background: var(--darker-bg);
          color: var(--primary);
          padding: 1rem 2rem;
          border: none;
          border-radius: var(--border-radius);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 20px rgba(11, 17, 32, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
        }

        .cta-button-alt:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 30px rgba(11, 17, 32, 0.4);
        }

        footer {
          background: var(--darker-bg);
          color: var(--light-text);
          padding: 4rem 5% 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .footer-col h4 {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          color: var(--primary);
          position: relative;
          display: inline-block;
        }

        .footer-col h4::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(
            90deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 0.8rem;
        }

        .footer-links a {
          color: var(--muted-text);
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--muted-text);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .hero {
            flex-direction: column;
            text-align: center;
            height: auto;
            padding-top: 8rem;
            padding-bottom: 8rem;
          }

          .hero-content {
            padding-right: 0;
            margin-bottom: 5rem;
          }

          .nav-links {
            display: none;
          }

          .section-title h2,
          .cta h2 {
            font-size: 2rem;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .payment-card {
            position: relative;
            margin: 1rem auto;
          }

          .payment-card:nth-child(1) {
            transform: rotate(-5deg) translateX(-20px) translateY(-40px);
          }

          .payment-card:nth-child(3) {
            transform: rotate(5deg) translateX(20px) translateY(-80px);
          }
        }
      `}</style>
    </div>
  );
}
