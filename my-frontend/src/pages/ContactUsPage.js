import React from 'react';

const ContactUsPage = () => {
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('http://localhost:8000/api/contact-messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        e.target.reset();
      } else {
        alert("Error sending message. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error sending message. Please try again.");
    }
  };

  return (
   <section className="contact-section bg-light pt-4 pb-6" style={{ marginTop: '-60px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg p-5 border-0 bg-white rounded-4 animate__animated animate__fadeInUp">
              <h2 className="text-center fw-bold mb-4 text-danger">Send Us a Message ✉️</h2>
              <form onSubmit={handleContactSubmit}>
                <div className="mb-3">
                  <input type="text" name="name" className="form-control" placeholder="Your Name" required />
                </div>
                <div className="mb-3">
                  <input type="email" name="email" className="form-control" placeholder="Your Email" required />
                </div>
                <div className="mb-3">
  <input type="text" name="phone" className="form-control" placeholder="Your Phone Number" />
</div>
                <div className="mb-3">
                  <textarea name="message" className="form-control" rows="4" placeholder="Your Message" required></textarea>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg px-5 shadow">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
