import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '../layouts/PublicFooter';
import Logo from '../../assets/custom/church-logo.jpeg';

import hero1 from '../../assets/custom/kenny-eliason-zFSo6bnZJTw-unsplash.jpg';
import hero2 from '../../assets/custom/marvin-meyer-SYTO3xs06fU-unsplash.jpg';
import campus1 from '../../assets/custom/2147851843.jpg';
import campus2 from '../../assets/custom/2148844716.jpg';
import campus3 from '../../assets/custom/2148844750.jpg';
import pastor1 from '../../assets/custom/pastor1.jpg';
import pastor2 from '../../assets/custom/pastor2.jpg';
import pastor3 from '../../assets/custom/pastor3.jpg';

export default function PtsLanding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const heroSlides = [
    {
      image: hero1,
      title: "Forming ministers for the Church and society",
      subtitle: "Presbyterian Theological Seminary, Kumba — nurturing men and women in Spiritual Formation, Theological Training and Transformational Development."
    },
    {
      image: hero2,
      title: "Excellence in Theological Education",
      subtitle: "Over 70 years of academic excellence, producing leaders who transform communities across Africa and beyond."
    },
    {
      image: campus1,
      title: "Beautiful Campus Environment",
      subtitle: "Study in a peaceful, conducive environment designed to foster spiritual growth and academic achievement."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 60000); // Much slower transition (1 minute)
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm fixed-top">
        <div className="container">
          <nav className="navbar navbar-expand-lg py-3">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src={Logo} alt="PTS Kumba" style={{height:'64px'}} className="me-3"/>
              <div>
                <span className="fw-bold text-dark fs-4">PTS Kumba</span>
                <div className="small text-muted">Presbyterian Theological Seminary</div>
              </div>
            </Link>
            <div className="ms-auto d-flex gap-2">
              <button onClick={() => scrollToSection('home')} className="btn btn-link">Home</button>
              <Link to="/about" className="btn btn-link">About</Link>
              <button onClick={() => scrollToSection('stats')} className="btn btn-link">Statistics</button>
              <Link to="/roles" className="btn btn-outline-primary">Role Selection</Link>
              <Link to="/signup" className="btn btn-primary">Apply</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Full-Screen Hero */}
      <section id="home" className="position-relative text-white" style={{height:'100vh', overflow:'hidden'}}>
        {/* Background Slider */}
        <div className="position-absolute w-100 h-100">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`position-absolute w-100 h-100 transition-opacity ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'opacity 1s ease-in-out'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="position-relative h-100 d-flex align-items-center" style={{paddingTop:'80px'}}>
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h1 className="display-3 fw-bold mb-4 text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontWeight: '700'}}>{heroSlides[activeSlide].title}</h1>
                <p className="lead fs-5 text-white mb-5" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)', fontWeight: '500'}}>{heroSlides[activeSlide].subtitle}</p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/signup" className="btn btn-primary btn-lg px-5 py-3">
                    <i className="material-symbols-outlined me-2"></i>
                    Apply Now
                  </Link>
                  <Link to="/roles" className="btn btn-outline-light btn-lg px-5 py-3">
                    <i className="material-symbols-outlined me-2"></i>
                    Select Role
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5">
          <div className="d-flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`btn rounded-circle ${index === activeSlide ? 'btn-primary' : 'btn-outline-light'}`}
                style={{width:'12px', height:'12px', padding:'0'}}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Left/Right Navigation */}
        <button 
          className="btn btn-outline-light position-absolute start-0 top-50 translate-middle-y ms-4"
          onClick={() => setActiveSlide(prev => prev === 0 ? heroSlides.length - 1 : prev - 1)}
          style={{borderRadius:'50%', width:'50px', height:'50px'}}
        >
          <i className="material-symbols-outlined"></i>
        </button>
        <button 
          className="btn btn-outline-light position-absolute end-0 top-50 translate-middle-y me-4"
          onClick={() => setActiveSlide(prev => (prev + 1) % heroSlides.length)}
          style={{borderRadius:'50%', width:'50px', height:'50px'}}
        >
          <i className="material-symbols-outlined"></i>
        </button>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="bg-white bg-opacity-10 rounded-4 p-4 h-100">
                <h2 className="display-4 fw-bold text-white">92%</h2>
                <p className="mb-0">of our graduates get jobs related to their degree</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="bg-white bg-opacity-10 rounded-4 p-4 h-100">
                <h2 className="display-4 fw-bold text-white">3500+</h2>
                <p className="mb-0">students trained since establishment</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="bg-white bg-opacity-10 rounded-4 p-4 h-100">
                <h2 className="display-4 fw-bold text-white">70+</h2>
                <p className="mb-0">years of excellence in theological education</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="bg-white bg-opacity-10 rounded-4 p-4 h-100">
                <h2 className="display-4 fw-bold text-white">25+</h2>
                <p className="mb-0">countries where our graduates serve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3">About PTS Kumba</h2>
              <p className="text-muted">Founded in 1952 (roots back to 1889), the Seminary trains pastors and leaders through rigorous biblical scholarship, spiritual formation and practical ministry. Officially affiliated to the Protestant University of Central Africa (PUCA) since April 2016.</p>
              <ul className="list-unstyled text-muted">
                <li className="mb-2">
                  <i className="material-symbols-outlined text-primary me-2" style={{fontSize:'18px'}}>verified</i>
                  Reformed and Ecumenical identity
                </li>
                <li className="mb-2">
                  <i className="material-symbols-outlined text-primary me-2" style={{fontSize:'18px'}}>school</i>
                  Scholarship and Spirituality
                </li>
                <li className="mb-2">
                  <i className="material-symbols-outlined text-primary me-2" style={{fontSize:'18px'}}>balance</i>
                  Tradition and Innovation
                </li>
              </ul>
              <div className="mt-4">
                <button onClick={() => scrollToSection('contact')} className="btn btn-outline-primary me-2">Contact</button>
                <Link to="/programs" className="btn btn-primary">Explore Programs</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src={campus2} 
                alt="PTS Kumba Campus" 
                className="img-fluid rounded-4 shadow-lg"
                style={{width:'100%', height:'400px', objectFit:'cover'}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">Success Stories</h2>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <img src={pastor1} alt="Graduate" className="rounded-circle mb-3" style={{width:'80px', height:'80px', objectFit:'cover'}}/>
                  <h6 className="fw-bold">Rev. John Mbome</h6>
                  <small className="text-muted d-block mb-3">B.Th. Graduate, 2018</small>
                  <p className="text-muted small">"PTS Kumba provided me with solid theological foundation that has guided my ministry for over 5 years."</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <img src={pastor2} alt="Graduate" className="rounded-circle mb-3" style={{width:'80px', height:'80px', objectFit:'cover'}}/>
                  <h6 className="fw-bold">Dr. Mary Ndongo</h6>
                  <small className="text-muted d-block mb-3">Ph.D. Graduate, 2020</small>
                  <p className="text-muted small">"The research opportunities and faculty mentorship at PTS shaped my academic and ministerial journey."</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <img src={pastor3} alt="Graduate" className="rounded-circle mb-3" style={{width:'80px', height:'80px', objectFit:'cover'}}/>
                  <h6 className="fw-bold">Rev. Paul Etongue</h6>
                  <small className="text-muted d-block mb-3">M.Th. Graduate, 2019</small>
                  <p className="text-muted small">"PTS Kumba equipped me with both theoretical knowledge and practical skills for effective ministry."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs highlight */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Academic Programs</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Bachelor of Theology (B.Th.)</h5>
                  <p className="text-muted mb-3">Three-year intensive program with strong biblical, historical and pastoral formation.</p>
                  <Link to="/programs" className="btn btn-outline-primary btn-sm">Learn more</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Master Programs (M.Th., M.A.)</h5>
                  <p className="text-muted mb-3">Advanced theological and leadership studies with thesis and practicum components.</p>
                  <Link to="/programs" className="btn btn-outline-primary btn-sm">Learn more</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Doctor of Philosophy (Ph.D.)</h5>
                  <p className="text-muted mb-3">Research-focused degree culminating in dissertation, seminars and defense.</p>
                  <Link to="/programs" className="btn btn-outline-primary btn-sm">Learn more</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Faculty */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Leadership & Faculty</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src={pastor1} alt="Faculty" className="card-img-top"/>
                <div className="card-body">
                  <h6 className="fw-bold mb-0">Faculty Member</h6>
                  <small className="text-muted">Biblical Studies</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src={pastor2} alt="Faculty" className="card-img-top"/>
                <div className="card-body">
                  <h6 className="fw-bold mb-0">Faculty Member</h6>
                  <small className="text-muted">Systematic Theology</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src={pastor3} alt="Faculty" className="card-img-top"/>
                <div className="card-body">
                  <h6 className="fw-bold mb-0">Faculty Member</h6>
                  <small className="text-muted">Practical Theology</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <h2 className="fw-bold mb-3">Contact & Accreditation</h2>
              <p className="text-muted mb-2">Presbyterian Theological Seminary, Kumba</p>
              <ul className="list-unstyled text-muted">
                <li>P.O. Box 590, Kumba, Meme Division, SW Region, Republic of Cameroon</li>
                <li>Email: <a href="mailto:ptskumba@pcconline.org">ptskumba@pcconline.org</a></li>
                <li>Office of Vice Dean Academic Affairs: <a href="mailto:vdaaptskumba@pcconline.org">vdaaptskumba@pcconline.org</a>, Cell: +237674386511</li>
                <li>Affiliated to PUCA, Yaounde (Decree No 07/0139/MINESUP of 21/09/2007), 27 April 2016</li>
              </ul>
            </div>
            <div className="col-lg-5">
              <div className="bg-white rounded-4 shadow-sm p-4">
                <h6 className="fw-bold">Get Updates</h6>
                <div className="d-flex gap-2 mt-2">
                  <input type="email" className="form-control" placeholder="Enter your email"/>
                  <button className="btn btn-primary">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}


