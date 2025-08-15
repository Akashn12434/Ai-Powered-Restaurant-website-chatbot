// src/pages/Aboutuspage.js
import React from 'react';

const AboutUsPage = () => {
  return (
  <div className="container pt-4 pb-5 mt-1">

  <h2 className="display-4 fw-bold text-dark text-center mb-4">About Us</h2>
  <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
       At RAJAMAHAL, dining is more than a meal—it's an experience crafted with passion, precision, and a love for flavor. Since our founding in 2020, we've blended global culinary artistry with local traditions to create dishes that tell stories and spark delight.

Our team of expert chefs brings creativity and mastery to every plate, constantly innovating with new dishes and seasonal specialties. From timeless classics to bold new flavors, our menu evolves to surprise and satisfy every palate.

We take pride in using fresh, locally sourced ingredients, served in an ambiance that’s both elegant and welcoming. Whether you're here for a quiet dinner or a festive gathering, our commitment to hospitality ensures every guest feels truly valued.
      </p>

      <div className="mt-5">
        <h3 className="fw-bold text-dark">Our Mission</h3>
        <p className="text-muted">To deliver extraordinary, memorable dining experiences by serving excellent food with legendary service. We prioritize our team, foster growth, and offer great value to every guest. We believe that every plate served is an opportunity to create joy and connection.</p>

        <h3 className="fw-bold text-dark mt-4">Our Vision</h3>
        <p className="text-muted">To spread smiles across the world through guest-focused hospitality, innovative concepts, and flawless execution. We aim to uplift lives while redefining modern Indian dining. Our vision is rooted in passion, creativity, and a relentless pursuit of excellence.</p>
      </div>
    </div>
  );
};

export default AboutUsPage;
