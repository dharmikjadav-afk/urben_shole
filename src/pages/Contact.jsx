import "./Contact.css";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully (frontend simulation)");
  };

  return (
    <>

      <section className="contact-hero">
        <div className="contact-overlay" />

        <div className="contact-hero-content" data-aos="fade-up">
          <span className="contact-badge">Contact Us</span>
          <h1>
            We’re Here to <span>Help</span>
          </h1>
          <p>
            Have a question, concern, or feedback? Our team is always ready to
            assist you.
          </p>
        </div>
      </section>

      <section className="contact-info">
        <div className="info-grid">
          <div className="info-card" data-aos="fade-up">
            <FiMail />
            <h4>Email Us</h4>
            <p>support@urbansole.com</p>
          </div>

          <div className="info-card" data-aos="fade-up" data-aos-delay="100">
            <FiPhone />
            <h4>Call Us</h4>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-card" data-aos="fade-up" data-aos-delay="200">
            <FiMapPin />
            <h4>Our Office</h4>
            <p>Ahmedabad, Gujarat, India</p>
          </div>

          <div className="info-card" data-aos="fade-up" data-aos-delay="300">
            <FiClock />
            <h4>Working Hours</h4>
            <p>Mon – Sat, 10:00 AM – 7:00 PM</p>
          </div>
        </div>
      </section>


      <section className="contact-form-section">
        <div className="contact-grid">
          {/* FORM */}
          <div className="form-box" data-aos="fade-right">
            <h2>Send Us a Message</h2>
            <p>
              Fill out the form and our support team will get back to you within
              24 hours.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Email Address" required />
              </div>

              <input type="text" placeholder="Subject" required />

              <textarea rows="5" placeholder="Write your message..." required />

              <button type="submit">
                <FiSend /> Send Message
              </button>
            </form>
          </div>


          <div className="map-box" data-aos="fade-left">
            <iframe
              title="UrbanSole Location"
              src="https://maps.google.com/maps?q=Ahmedabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
      </section>


      <section className="contact-trust" data-aos="fade-up">
        <h3>Why Contact UrbanSole?</h3>
        <p>
           Fast responses <br />
          Friendly support <br /> Trusted by thousands of customers
        </p>
      </section>
    </>
  );
}

export default Contact;
