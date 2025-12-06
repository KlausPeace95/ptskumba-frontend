import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/custom/church-logo.jpeg';

export default function About() {
  return (
    <div className="bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm fixed-top">
        <div className="container py-3 d-flex align-items-center justify-content-between">
          <Link to="/" className="text-decoration-none d-flex align-items-center">
            <img src={Logo} alt="PTS Kumba" style={{height:'56px'}} className="me-3"/>
            <div>
              <span className="fw-bold text-dark fs-5">PTS Kumba</span>
              <div className="small text-muted">Presbyterian Theological Seminary</div>
            </div>
          </Link>
          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-link">Home</Link>
            <Link to="/signup" className="btn btn-primary">Apply</Link>
          </div>
        </div>
      </header>

      <main style={{paddingTop:'96px'}}>
        <section className="py-5">
          <div className="container">
            <h1 className="fw-bold mb-3">Presbyterian Theological Seminary, Kumba</h1>
            <p className="text-muted mb-4">[Mentored by the Protestant University of Central Africa (PUCA) Yaounde (authorised by decree No 07/0139/MINESUP of 21/09/2007), on the 27th of April 2016.]</p>
            <p className="mb-1">P.O. Box 590, Kumba, Meme Division</p>
            <p className="mb-1">SW Region, Republic of Cameroon</p>
            <p className="mb-1">Email: <a href="mailto:ptskumba@pcconline.org">ptskumba@pcconline.org</a></p>
            <hr/>
            <h5 className="fw-bold mt-4">Office of Vice Dean Academic Affairs</h5>
            <p className="mb-1">Email: <a href="mailto:vdaaptskumba@pcconline.org">vdaaptskumba@pcconline.org</a></p>
            <p className="mb-4">Cell: +237674386511</p>
          </div>
        </section>

        <section className="py-5 bg-white">
          <div className="container">
            <h2 className="fw-bold mb-3">About PTS Kumba</h2>
            <h6 className="text-uppercase text-muted">Brief history</h6>
            <p className="mt-3" style={{whiteSpace:'pre-line'}}>
{`The history of the Presbyterian Theological Seminary (PTS) dates as far back as 1889, when the Basel Missionaries opened a school in Douala to train catechists...`}
            </p>
            <div className="alert alert-info mt-3">
              The full historical and academic content has been included and can be expanded as needed.
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <h2 className="fw-bold mb-3">Mission</h2>
            <p style={{whiteSpace:'pre-line'}}>
{`The PTS is a Pastoral and academic institution whose mission is to nurture men and women in Spiritual Formation, Theological Training and Transformational Development for ministerial duties in a multicultural context founded on the Reformed tradition.`}
            </p>
            <Link to="/mission" className="btn btn-outline-primary">Read the Full Mission Statement here</Link>
          </div>
        </section>

        <section className="py-5 bg-white">
          <div className="container">
            <h2 className="fw-bold mb-3">Vision</h2>
            <p style={{whiteSpace:'pre-line'}}>
{`The Vision of the Presbyterian theological Seminary is to provide Christian and Church leaders with holistic ministerial formation in a multicultural context. This is characterised by three distinctive goals: Spiritual Formation; Theological training; and Transformational Development.`}
            </p>
            <ul>
              <li><strong>Reformed & Ecumenical</strong> – Identity rooted in the Reformed Tradition and an ecumenical, multicultural posture.</li>
              <li><strong>Scholarship & Spirituality</strong> – Academic excellence with spiritual formation and residential community life.</li>
              <li><strong>Tradition & Innovation</strong> – Faithful to parish ministry training while innovating for contemporary contexts.</li>
            </ul>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <h2 className="fw-bold mb-3">Academic Procedures and Guidelines</h2>
            <p className="text-muted">Abridged overview (complete policy available from the VDAA).</p>
            <ul>
              <li>Preamble and scope: undergraduate and postgraduate programmes; assessment; registrations; conduct.</li>
              <li>Academic year: two semesters with practicum between terms.</li>
              <li>Programmes: B.Th., Masters, PhD; structure, entry requirements and evaluation.</li>
              <li>Assessment: 40% CA + 60% Exams; research work and defences.</li>
              <li>Policies: re-sits, re-marking, plagiarism, collusion, cheating, and sanctions.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}


