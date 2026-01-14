import React from 'react';
import { Phone, Mail, Home, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '2rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* Lado izquierdo: Contacto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Harremanetarako</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={20} />
            <span>6XX XXX XXX</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={20} />
            <span>pear@gmail.com</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Home size={20} style={{ marginTop: '4px' }} />
            <div>
              <p style={{ margin: 0 }}>Errebuelta Kalea, 6</p>
              <p style={{ margin: 0 }}>20570 Bergara, Gipuzkoa</p>
            </div>
          </div>
        </div>

        {/* Lado derecho: Redes Sociales */}
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Gure sare sozialak</h3>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <Instagram size={30} style={{ cursor: 'pointer' }} />
            <Facebook size={30} style={{ cursor: 'pointer' }} />
            <Twitter size={30} style={{ cursor: 'pointer' }} />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;