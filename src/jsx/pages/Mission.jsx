import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/custom/church-logo.jpeg';

export default function Mission() {
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
            <Link to="/about" className="btn btn-link">About</Link>
            <Link to="/signup" className="btn btn-primary">Apply</Link>
          </div>
        </div>
      </header>

      <main style={{paddingTop:'96px'}}>
        {/* Back to About */}
        <section className="py-3 bg-primary">
          <div className="container">
            <Link to="/about" className="btn btn-outline-light btn-sm">
              <i className="fas fa-arrow-left me-2"></i>Back to About
            </Link>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-5">
          <div className="container">
            <h1 className="fw-bold mb-4 text-primary">Mission Statement</h1>
            <div className="row">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h3 className="fw-bold mb-3">The Mission of PTS</h3>
                    <p className="lead mb-4">
                      The Mission of the Presbyterian Theological Seminary (PTS), Kumba is derived from the Mission Statement of the Presbyterian Church in Cameroon, which encompasses the Four-Fold Ministry of Healing, Teaching, Preaching and Liberation based on the Holy Scriptures (Old Testament and New Testament).
                    </p>
                    <p className="mb-4">
                      The PTS is a Pastoral and academic institution whose mission is to nurture men and women in Spiritual Formation, Theological Training and Transformational Development for ministerial duties in a multicultural context founded on the Reformed tradition. The Theoretical and Practical formation of theological students is complimented by the exercise of the ministry of the Word and Sacraments as they bear witness to Jesus Christ through the mediation of the Holy Spirit in the mission of the whole Church and the Presbyterian Church in Cameroon in Particular.
                    </p>
                    <p className="mb-0">
                      The PTS maintains a history of academic excellence in the tradition of scholarship in the teaching of Biblical, Systematic, Historical, Pastoral, Philosophical, social and Theological disciplines.
                    </p>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h3 className="fw-bold mb-3">Full Mission Statement</h3>
                    <p className="mb-3">
                      The Presbyterian Theological Seminary is a pastoral and academic institution serving the Lord Jesus Christ through his Church. Its mission is to train men and women for ministerial duties in Cameroon and abroad. The theoretical and practical formation of theological students is complemented by the exercise of the ministry of Word and Sacraments as they bear witness to Jesus Christ through the mediation of the Holy Spirit in the mission of the whole Church and the Presbyterian Church in Cameroon in particular.
                    </p>
                    <p className="mb-3">
                      The mission of the Church emanates from God's redemptive act in this world through Jesus Christ, the Holy Spirit and Jesus' Great Commission to His disciples to evangelise and announce the message of salvation to humanity. The Seminary maintains an academic excellence in the tradition of scholarship in the teaching of biblical, systematic, historical, practical/pastoral, philosophical, social and theological disciplines.
                    </p>
                    <p className="mb-3">
                      The mission statement of the Seminary is based on the Presbyterian Church in Cameroon's teaching on scriptures (Old Testament and New Testament) as the supreme rule of faith and practice. The scriptures bear witness to Jesus Christ and the Holy Spirit, and only in obedience to the witness of the scriptures will the Church in Cameroon be able to walk towards her goal, the coming Kingdom of God. The Seminary, which operates under the auspices of the Presbyterian Church in Cameroon, accepts the Apostles' Creed and the Nicene Creed as the appropriate expressions of its faith and as a safeguard against heretical teachings. The Seminary believes in and teaches the Trinitarian Doctrine.
                    </p>
                    <p className="mb-0">
                      The Seminary uses all theological resources to instil in the students an appropriate interpretation of the timeless message of and about Jesus Christ within the changing socio-historical, political, economic, cultural and social circumstances in Cameroon, Africa and the world at large.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm sticky-top" style={{top: '120px'}}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Quick Navigation</h5>
                    <nav className="nav flex-column">
                      <a className="nav-link px-0" href="#mission">Mission Statement</a>
                      <a className="nav-link px-0" href="#vision">Vision</a>
                      <a className="nav-link px-0" href="#academic-procedures">Academic Procedures</a>
                      <a className="nav-link px-0" href="#programs">Academic Programs</a>
                      <a className="nav-link px-0" href="#courses">Course Structure</a>
                      <a className="nav-link px-0" href="#contact">Contact Information</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-5 bg-white" id="vision">
          <div className="container">
            <h2 className="fw-bold mb-4 text-primary">Vision</h2>
            <div className="row">
              <div className="col-lg-8">
                <p className="lead mb-4">
                  The Vision of the Presbyterian theological Seminary is to provide Christian and Church leaders with holistic ministerial formation in a multicultural context. This is characterised by three distinctive goals: Spiritual Formation; Theological training; and Transformational Development.
                </p>
                
                <h4 className="fw-bold mb-3">Four Distinctive Commitments</h4>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card border-start border-primary border-3 h-100">
                      <div className="card-body">
                        <h5 className="fw-bold text-primary">Reformed & Ecumenical</h5>
                        <p className="mb-0">
                          The Presbyterian Theological Seminary is an institution of the Presbyterian Church in Cameroon based on the reformed Tradition, an identity we jealously clinch to and consider to be a fundamental basis of wisdom and strength for our mission. However, the PTS has an ecumenical, intercultural, multicultural and international institution which sees Christ as the centre of our common humanity.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-start border-success border-3 h-100">
                      <div className="card-body">
                        <h5 className="fw-bold text-success">Scholarship & Spirituality</h5>
                        <p className="mb-0">
                          As fundamental to the Reformed heritage, the PTS holds fast to academic excellence as a dedicated expression of her obedience to God's endowments. The PTS nurtures intellectual curiosity through the fostering of theological research and at the same time, the development of individuals and communal spirituality. An important part of the academic and spiritual experience at the PTS is the residential community, complimented by the field education experiences.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="card border-start border-warning border-3">
                      <div className="card-body">
                        <h5 className="fw-bold text-warning">Tradition and Innovation</h5>
                        <p className="mb-0">
                          The cardinal principle of the Reformed Tradition is the impulse towards innovation: Ecclesia simper reformanda est (The Church must always be Reformed) or: Ecclesia Reformata, Semper Reformanda (The Church reformed, always Reforming). The PTS maintains its core commitment to preparing pastors for parish ministry in the Presbyterian Church in Cameroon while providing room in the curriculum for innovative Christian ministry and service within a multicultural, social and political context.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Procedures */}
        <section className="py-5" id="academic-procedures">
          <div className="container">
            <h2 className="fw-bold mb-4 text-primary">Academic Procedures and Guidelines</h2>
            <div className="row">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">Preamble</h4>
                    <p className="mb-3">
                      The academic procedures and guidelines of the Presbyterian Theological Seminary (PTS), Kumba prescribes the measures guiding the conduct of academic processes for the maintenance of academic integrity in the pursuit of excellence.
                    </p>
                    <p><strong>The manual applies to:</strong></p>
                    <ul className="mb-0">
                      <li>Undergraduate and postgraduate programmes</li>
                      <li>Beginning and end of programmes</li>
                      <li>Assessment procedures and grading system</li>
                      <li>Academic registrations/transfer and completion of credits</li>
                      <li>Academic conduct and misconduct</li>
                    </ul>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">Academic Year Structure</h4>
                    <p className="mb-3">
                      The academic year at the PTS is usually the period between August of each year and May/June of the following year. It begins with a week of orientation of both new and old students, teaching and auxiliary staff and an opening service to crown the week.
                    </p>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="fw-bold text-primary">First Semester</h6>
                            <p className="small mb-2">August - December (16 weeks)</p>
                            <ul className="small mb-0">
                              <li>12 contact teaching weeks</li>
                              <li>2 weeks for examination</li>
                              <li>1 interdisciplinary week</li>
                              <li>1 week for evaluation and closing</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="fw-bold text-success">Second Semester</h6>
                            <p className="small mb-2">January - May/June (18 weeks)</p>
                            <ul className="small mb-0">
                              <li>12 contact teaching weeks</li>
                              <li>2 weeks for examination</li>
                              <li>1 week Easter break</li>
                              <li>1 interdisciplinary week</li>
                              <li>1 week for defence of Research Papers/Theses</li>
                              <li>1 week for evaluation and closing</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info mt-3">
                      <h6 className="fw-bold">Practical Month (Practicum)</h6>
                      <p className="mb-0">During the six-week period between the first and second semesters, students are assigned to various Presbyteries of the Presbyterian Church in Cameroon (PCC) for practical field experiences.</p>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">Assessment and Grading</h4>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="text-center p-3 bg-primary text-white rounded">
                          <h2 className="fw-bold mb-1">40%</h2>
                          <p className="mb-0">Continuous Assessment (CA)</p>
                          <small>35% written research + 5% attendance/participation</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="text-center p-3 bg-success text-white rounded">
                          <h2 className="fw-bold mb-1">60%</h2>
                          <p className="mb-0">Final Examination</p>
                          <small>3-hour written examination</small>
                        </div>
                      </div>
                    </div>

                    <h5 className="fw-bold mb-3">Grading System</h5>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Mark/100</th>
                            <th>Letter Grade</th>
                            <th>Grade Point</th>
                            <th>Evaluation</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>80-100</td>
                            <td>A</td>
                            <td>4.00</td>
                            <td>Excellent</td>
                          </tr>
                          <tr>
                            <td>70-79</td>
                            <td>B+</td>
                            <td>3.50</td>
                            <td>Very Good</td>
                          </tr>
                          <tr>
                            <td>60-69</td>
                            <td>B</td>
                            <td>3.00</td>
                            <td>Good</td>
                          </tr>
                          <tr>
                            <td>55-59</td>
                            <td>C+</td>
                            <td>2.50</td>
                            <td>Fair</td>
                          </tr>
                          <tr>
                            <td>50-54</td>
                            <td>C</td>
                            <td>2.00</td>
                            <td>Average</td>
                          </tr>
                          <tr>
                            <td>45-49</td>
                            <td>D+</td>
                            <td>1.50</td>
                            <td>Below Average</td>
                          </tr>
                          <tr>
                            <td>40-44</td>
                            <td>D</td>
                            <td>1.00</td>
                            <td>Poor</td>
                          </tr>
                          <tr>
                            <td>0-39</td>
                            <td>F</td>
                            <td>0.00</td>
                            <td>Fail</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Programs */}
        <section className="py-5 bg-white" id="programs">
          <div className="container">
            <h2 className="fw-bold mb-4 text-primary">Academic Programmes</h2>
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                        <i className="fas fa-graduation-cap fa-lg"></i>
                      </div>
                    </div>
                    <h4 className="fw-bold text-center mb-3">Bachelor of Theology (B.Th.)</h4>
                    <ul className="list-unstyled">
                      <li className="mb-2"><strong>Duration:</strong> 3 years intensive programme</li>
                      <li className="mb-2"><strong>Credits:</strong> 180 credit points (1800 hours)</li>
                      <li className="mb-2"><strong>Structure:</strong> 6 consecutive semesters</li>
                      <li className="mb-2"><strong>Requirements:</strong> Full-time resident studies</li>
                      <li className="mb-2"><strong>Research:</strong> Research Paper in final semester</li>
                    </ul>
                    
                    <h6 className="fw-bold mt-3 mb-2">Admission Requirements:</h6>
                    <ul className="small">
                      <li>Communicant members of PCC in good standing</li>
                      <li>Age: 25-35 years old</li>
                      <li>O-Level GCE with at least 4 papers including English</li>
                      <li>A-Level with 2 papers / Baccalaureate</li>
                      <li>Religious Studies as added advantage</li>
                      <li>Pastor and Presbyterial Secretary recommendation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                        <i className="fas fa-user-graduate fa-lg"></i>
                      </div>
                    </div>
                    <h4 className="fw-bold text-center mb-3">Master Programmes</h4>
                    <ul className="list-unstyled">
                      <li className="mb-2"><strong>Duration:</strong> 2 years</li>
                      <li className="mb-2"><strong>Credits:</strong> 120 credit points</li>
                      <li className="mb-2"><strong>Structure:</strong> 4 semesters</li>
                      <li className="mb-2"><strong>Courses:</strong> 15 courses (6 credits each)</li>
                      <li className="mb-2"><strong>Practicum:</strong> 6 credit points</li>
                      <li className="mb-2"><strong>Thesis:</strong> 24 credits</li>
                    </ul>

                    <h6 className="fw-bold mt-3 mb-2">Programme Types:</h6>
                    <ul className="small">
                      <li>Master of Theology (MTh)</li>
                      <li>Master of Arts in Church Leadership (MACL)</li>
                    </ul>

                    <h6 className="fw-bold mt-3 mb-2">Entry Requirements:</h6>
                    <ul className="small">
                      <li>Bachelor's degree transcript</li>
                      <li>Curriculum Vitae</li>
                      <li>Medical certificate</li>
                      <li>Research paper abstract</li>
                      <li>Two recommendation letters</li>
                      <li>Written declaration of motivation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                        <i className="fas fa-university fa-lg"></i>
                      </div>
                    </div>
                    <h4 className="fw-bold text-center mb-3">Doctor of Philosophy (PhD)</h4>
                    <ul className="list-unstyled">
                      <li className="mb-2"><strong>Duration:</strong> 3-5 years maximum</li>
                      <li className="mb-2"><strong>Structure:</strong> Research-intensive programme</li>
                      <li className="mb-2"><strong>Year 1:</strong> Specialized coursework and comprehensive examination</li>
                      <li className="mb-2"><strong>Years 2-3:</strong> Dissertation writing</li>
                      <li className="mb-2"><strong>Requirements:</strong> Academic seminars and publications</li>
                    </ul>

                    <h6 className="fw-bold mt-3 mb-2">Academic Requirements:</h6>
                    <ul className="small">
                      <li>Attendance at 2+ academic seminars</li>
                      <li>Published or presented academic paper</li>
                      <li>Successful comprehensive examination</li>
                      <li>Original dissertation research</li>
                    </ul>

                    <div className="alert alert-warning mt-3">
                      <small><strong>Note:</strong> Earliest completion time is 2 years. Extensions up to 5 years total with additional fees.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Structure */}
        <section className="py-5" id="courses">
          <div className="container">
            <h2 className="fw-bold mb-4 text-primary">Academic Departments & Course Structure</h2>
            
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px'}}>
                      <span className="fw-bold">BST</span>
                    </div>
                    <h5 className="fw-bold">Biblical Studies</h5>
                    <p className="text-muted small mb-0">Old Testament, New Testament, Hebrew, Greek, Biblical Interpretation</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px'}}>
                      <span className="fw-bold">STH</span>
                    </div>
                    <h5 className="fw-bold">Systematic Theology</h5>
                    <p className="text-muted small mb-0">Dogmatics, Christian Ethics, Reformed Theology, Contextual Theology</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px'}}>
                      <span className="fw-bold">WCM</span>
                    </div>
                    <h5 className="fw-bold">World Christianity and Mission Studies</h5>
                    <p className="text-muted small mb-0">Church History, African Theology, Missiology, Ecumenics</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px'}}>
                      <span className="fw-bold">PRT</span>
                    </div>
                    <h5 className="fw-bold">Practical Theology</h5>
                    <p className="text-muted small mb-0">Homiletics, Worship, Pastoral Care, Christian Education</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px'}}>
                      <span className="fw-bold">DSS</span>
                    </div>
                    <h5 className="fw-bold">Development and Social Sciences</h5>
                    <p className="text-muted small mb-0">Peace Studies, Entrepreneurship, Resource Mobilization, Psychology</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Course Coding System</h4>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="bg-light p-3 rounded">
                      <h6 className="fw-bold text-primary mb-2">Course Letters</h6>
                      <p className="small mb-0">Abbreviations of course names (e.g., OTM = Old Testament)</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-light p-3 rounded">
                      <h6 className="fw-bold text-success mb-2">First Digit</h6>
                      <p className="small mb-0">Year level (2=Level 200, 3=Level 300, etc.)</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-light p-3 rounded">
                      <h6 className="fw-bold text-warning mb-2">Second Digit</h6>
                      <p className="small mb-0">Department (1=Biblical, 2=Systematic, 3=History, etc.)</p>
                    </div>
                  </div>
                </div>

                <h5 className="fw-bold mt-4 mb-3">Course Status Legend</h5>
                <div className="row g-2">
                  <div className="col-auto">
                    <span className="badge bg-primary">C - Compulsory</span>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-success">IR - Institutional Requirement</span>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-info">E - Electives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-5 bg-white" id="contact">
          <div className="container">
            <h2 className="fw-bold mb-4 text-primary">Contact Information</h2>
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">General Information</h4>
                    <div className="d-flex align-items-start mb-3">
                      <i className="fas fa-map-marker-alt text-primary me-3 mt-1"></i>
                      <div>
                        <strong>Address:</strong><br />
                        P.O. Box 590, Kumba, Meme Division<br />
                        SW Region, Republic of Cameroon
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-envelope text-primary me-3"></i>
                      <div>
                        <strong>Email:</strong> 
                        <a href="mailto:ptskumba@pcconline.org" className="ms-2">ptskumba@pcconline.org</a>
                      </div>
                    </div>
                                          <div className="small text-muted">
                        Mentored by the Protestant University of Central Africa (PUCA) Yaounde<br />
                        (authorised by decree No 07/0139/MINESUP of 21/09/2007), on the 27th of April 2016.
                      </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">Academic Affairs Office</h4>
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-user-tie text-success me-3"></i>
                      <div>
                        <strong>Office of Vice Dean Academic Affairs</strong>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-envelope text-success me-3"></i>
                      <div>
                        <strong>Email:</strong> 
                        <a href="mailto:vdaaptskumba@pcconline.org" className="ms-2">vdaaptskumba@pcconline.org</a>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-phone text-success me-3"></i>
                      <div>
                        <strong>Cell:</strong> 
                        <a href="tel:+237674386511" className="ms-2">+237674386511</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
