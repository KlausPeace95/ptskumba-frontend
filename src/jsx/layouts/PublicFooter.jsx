import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/custom/church-logo.jpeg';

export default function PublicFooter() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: 'Platform',
            links: [
                { name: 'Student Portal', href: '/student-login' },
                { name: 'Role Selection', href: '/roles' },
                { name: 'Apply for Admission', href: '/student-application' },
                { name: 'Programs', href: '/programs' }
            ]
        },
        {
            title: 'Features',
            links: [
                { name: 'Academic Management', href: '#services' },
                { name: 'Financial Control', href: '#services' },
                { name: 'Communication Hub', href: '#services' },
                { name: 'Analytics & Reports', href: '#services' }
            ]
        },
        {
            title: 'Support',
            links: [
                { name: 'Help Center', href: 'mailto:ptskumba@pcconline.org' },
                { name: 'Documentation', href: '#' },
                { name: 'System Status', href: '#' },
                { name: 'Contact Support', href: 'tel:+237674386511' }
            ]
        },
        {
            title: 'School',
            links: [
                { name: 'About PTS Kumba', href: '/about' },
                { name: 'News & Updates', href: '#' },
                { name: 'Career Opportunities', href: '#' },
                { name: 'Academic Calendar', href: '#' }
            ]
        }
    ];

    const socialLinks = [
        { name: 'Facebook', icon: 'facebook', href: '#' },
        { name: 'Twitter', icon: 'twitter', href: '#' },
        { name: 'LinkedIn', icon: 'linkedin', href: '#' },
        { name: 'Instagram', icon: 'instagram', href: '#' }
    ];

    return (
        <footer className="bg-dark text-white">
            {/* Main Footer Content */}
            <div className="py-5">
            <div className="container">
                <div className="row g-4">
                        {/* Brand Section */}
                        <div className="col-lg-4 col-md-6">
                            <div className="footer-brand mb-4">
                        <div className="d-flex align-items-center mb-3">
                                    <img src={Logo} alt="PTS Kumba" style={{width:'50px', height:'50px'}} className="me-3"/>
                                    <div>
                                        <h5 className="mb-0 text-white fw-bold">PTS Kumba</h5>
                                        <small className="text-white-50">Presbyterian Theological Seminary</small>
                                    </div>
                                </div>
                                <p className="text-white-50 mb-4">
                                    Empowering educational institutions with comprehensive management solutions. 
                                    Trusted by 500+ schools worldwide for secure, efficient operations.
                                </p>
                                
                                {/* Contact Info */}
                                <div className="contact-info">
                                    <div className="contact-item d-flex align-items-center mb-2">
                                        <i className="material-symbols-outlined text-primary me-2" style={{fontSize:'18px'}}>location_on</i>
                                        <small className="text-white-50">P.O. Box 590, Kumba, Meme Division, SW Region, Cameroon</small>
                                    </div>
                                    <div className="contact-item d-flex align-items-center mb-2">
                                        <i className="material-symbols-outlined text-primary me-2" style={{fontSize:'18px'}}>phone</i>
                                        <small className="text-white-50">+237 674 386 511</small>
                                    </div>
                                    <div className="contact-item d-flex align-items-center mb-2">
                                        <i className="material-symbols-outlined text-primary me-2" style={{fontSize:'18px'}}>email</i>
                                        <small className="text-white-50">ptskumba@pcconline.org</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Links */}
                        {footerSections.map((section, index) => (
                            <div key={index} className="col-lg-2 col-md-6 col-6">
                                <h6 className="text-white fw-bold mb-3">{section.title}</h6>
                                <ul className="list-unstyled">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex} className="mb-2">
                                            {link.href.startsWith('#') ? (
                                                <a 
                                                    href={link.href}
                                                    className="text-white-50 text-decoration-none small hover-link"
                                                >
                                                    {link.name}
                                                </a>
                                            ) : link.href.startsWith('/') ? (
                                                <Link 
                                                    to={link.href}
                                                    className="text-white-50 text-decoration-none small hover-link"
                                                >
                                                    {link.name}
                                                </Link>
                                            ) : (
                                                <a 
                                                    href={link.href}
                                                    className="text-white-50 text-decoration-none small hover-link"
                                                    target={link.href.includes('mailto:') || link.href.includes('tel:') ? '_self' : '_blank'}
                                                    rel={link.href.includes('mailto:') || link.href.includes('tel:') ? '' : 'noopener noreferrer'}
                                                >
                                                    {link.name}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-primary bg-opacity-10 py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-3 mb-lg-0">
                            <div className="d-flex align-items-center">
                                <i className="material-symbols-outlined text-primary me-3" style={{fontSize:'32px'}}>notifications</i>
                                <div>
                                    <h6 className="text-white mb-1">Stay Updated</h6>
                                    <p className="text-white-50 small mb-0">Get the latest news and updates from PTS Kumba</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="newsletter-form d-flex gap-2">
                                <div className="flex-grow-1">
                                    <input 
                                        type="email" 
                                        className="form-control border-0" 
                                        placeholder="Enter your email address"
                                        style={{backgroundColor: 'rgba(255,255,255,0.1)', color: 'white'}}
                                    />
                                </div>
                                <button className="btn btn-primary px-4">
                                    <i className="material-symbols-outlined" style={{fontSize:'18px'}}>send</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-top border-secondary py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-3 mb-lg-0">
                            <div className="d-flex flex-wrap align-items-center gap-4">
                                <span className="text-white-50 small">© {currentYear} Presbyterian Theological Seminary, Kumba. All rights reserved.</span>
                                <div className="d-flex gap-3">
                                    <a href="#" className="text-white-50 text-decoration-none small hover-link">Privacy Policy</a>
                                    <a href="#" className="text-white-50 text-decoration-none small hover-link">Terms of Service</a>
                                    <a href="#" className="text-white-50 text-decoration-none small hover-link">Cookies</a>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="text-white-50 small">Designed by</span>
                                    <a 
                                        href="https://alzironsystems.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-primary text-decoration-none small fw-bold hover-link"
                                    >
                                        Alziron Systems
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex justify-content-lg-end align-items-center gap-4">
                                {/* System Status */}
                                <div className="d-flex align-items-center gap-2">
                                    <div className="status-indicator bg-success rounded-circle" style={{width:'8px', height:'8px'}}></div>
                                    <small className="text-white-50">All Systems Operational</small>
                                </div>
                                
                                {/* Social Links */}
                                <div className="social-links d-flex gap-2">
                                    {socialLinks.map((social, index) => (
                                        <a 
                                            key={index}
                                            href={social.href}
                                            className="social-link bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-white-50"
                                            style={{width:'36px', height:'36px'}}
                                            aria-label={social.name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="material-symbols-outlined" style={{fontSize:'16px'}}>
                                                {social.icon}
                                            </i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Custom Styles */}
            <style>{`
                .hover-link {
                    transition: color 0.2s ease;
                }
                
                .hover-link:hover {
                    color: #ffffff !important;
                }
                
                .social-link {
                    transition: all 0.2s ease;
                }
                
                .social-link:hover {
                    background-color: rgba(255,255,255,0.2) !important;
                    color: white !important;
                    transform: translateY(-2px);
                }
                
                .newsletter-form input::placeholder {
                    color: rgba(255,255,255,0.7);
                }
                
                .newsletter-form input:focus {
                    background-color: rgba(255,255,255,0.15) !important;
                    border: none !important;
                    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
                    color: white !important;
                }
                
                .status-indicator {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .social-links {
                        justify-content: center;
                        margin-top: 1rem;
                    }
                    
                    .newsletter-form {
                        flex-direction: column;
                    }
                    
                    .newsletter-form .btn {
                        align-self: stretch;
                    }
                }
            `}</style>
        </footer>
    );
}