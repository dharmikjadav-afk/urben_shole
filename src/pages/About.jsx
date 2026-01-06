import "./About.css";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiTruck,
} from "react-icons/fi";

function About() {
  return (
    <>

      <section className="about-hero">
        <div className="about-overlay" />

        <div className="about-hero-content" data-aos="fade-up">
          <span className="about-badge">About UrbanSole</span>
          <h1>
            Crafted for <span>Confidence</span>
          </h1>
          <p>
            UrbanSole is more than footwear. We design premium shoes that blend
            comfort, durability, and modern style for everyday confidence.
          </p>
        </div>
      </section>


      <section className="about-section">
        <div className="about-grid">
          <div data-aos="fade-right">
            <h2>Our Story</h2>
            <p>
              UrbanSole was born with a simple idea — shoes should feel as good
              as they look. In a world of fast fashion, we focus on thoughtful
              design, premium materials, and everyday practicality.
            </p>
            <p>
              Whether it’s a long workday, a casual walk, or an active
              lifestyle, UrbanSole supports every step with confidence and
              comfort.
            </p>
          </div>

          <div className="about-image" data-aos="fade-left">
            <img
              src="ourstory2.jpg"
              alt="UrbanSole Story"
            />
          </div>
        </div>
      </section>


      <section className="about-values">
        <div className="section-header" data-aos="fade-up">
          <h2>What We Stand For</h2>
          <p>Our values shape everything we create</p>
        </div>

        <div className="values-grid">
          <div className="value-card" data-aos="fade-up">
            <FiAward />
            <h4>Premium Quality</h4>
            <p>Carefully selected materials for long-lasting comfort.</p>
          </div>

          <div className="value-card" data-aos="fade-up" data-aos-delay="100">
            <FiTrendingUp />
            <h4>Modern Design</h4>
            <p>Minimal, stylish footwear crafted for today’s lifestyle.</p>
          </div>

          <div className="value-card" data-aos="fade-up" data-aos-delay="200">
            <FiShield />
            <h4>Trusted Durability</h4>
            <p>Built to perform — day after day, step after step.</p>
          </div>
        </div>
      </section>


      <section className="about-craft">
        <div className="about-grid reverse">
          <div className="about-image" data-aos="fade-right">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552"
              alt="Craftsmanship"
            />
          </div>

          <div data-aos="fade-left">
            <h2>Designed With Purpose</h2>
            <p>
              Every UrbanSole shoe goes through a detailed design process —
              combining ergonomic support, breathable materials, and lightweight
              construction.
            </p>
            <p>
              Our goal is simple: shoes that move naturally with you and feel
              great from morning to night.
            </p>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="stats-grid">
          <div className="stat-card" data-aos="zoom-in">
            <FiUsers />
            <h3>50K+</h3>
            <p>Happy Customers</p>
          </div>

          <div className="stat-card" data-aos="zoom-in" data-aos-delay="100">
            <FiTruck />
            <h3>100%</h3>
            <p>Reliable Delivery</p>
          </div>

          <div className="stat-card" data-aos="zoom-in" data-aos-delay="200">
            <FiAward />
            <h3>Premium</h3>
            <p>Material Quality</p>
          </div>
        </div>
      </section>


      <section className="about-cta" data-aos="fade-up">
        <h2>Step Into Premium Comfort</h2>
        <p>
          Join thousands who trust UrbanSole for everyday confidence and style.
        </p>
        <Link to="/shop" className="cta-btn">
          Explore Collection
        </Link>
      </section>
    </>
  );
}

export default About;
