import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/store';
// images
import BgImage from "../../assets/images/bg1.png";
import logo from "../../assets/images/logo-full.png";
import logolight from "../../assets/images/logo-white.png";
import pol from "../../assets/images/pol.jpg";
import churchLogo from "../../assets/custom/church-logo.jpeg";

function StudentLogin() {
	const [matricule, setMatricule] = useState('');
	let errorsObj = { matricule: '' };
	const [errors, setErrors] = useState(errorsObj);

	const navigate = useNavigate();
	const { login, error, loading } = useAuthStore();

	const handleApply = (e) => {
		e.preventDefault();
		navigate('/signup');
	};

	async function onStudentLogin(e) {
		e.preventDefault();
		let errorFlag = false;
		const errorObj = { ...errorsObj };
		if (matricule === '') {
			errorObj.matricule = 'Matricule Number is Required';
			errorFlag = true;
		}
		setErrors(errorObj);
		if (errorFlag) {
			return;
		}
		
		// TODO: Implement student login with matricule when backend is ready
		// For now, simulate successful login and navigate to student dashboard
		console.log('Student login with matricule:', matricule);
		
		try {
			// Simulate successful authentication
			// This will be replaced with actual student login endpoint
			setLoading(true);
			
			// Mock successful login - remove this when backend is ready
			setTimeout(() => {
				// Navigate to student dashboard
				navigate('/student-dashboard');
			}, 1000);
			
		} catch (error) {
			console.error('Student login failed:', error);
		} finally {
			setLoading(false);
		}
	}

	const element = document.querySelector("body");
	let dataTheme = element.getAttribute("data-theme-version");

	return (
		<div className="student-login-container">
			<div className="container h-100">
				<div className="row h-100 align-items-center justify-contain-center">
					<div className="col-xl-12">
						<div className="card student-login-card">
							<div className="card-body p-0">
								<div className="row m-0">
									<div className="col-xl-6 col-md-6 sign text-center sign-bg student-bg" style={{ backgroundImage: 'url(' + pol + ')' }}>
										<div>
											<div className="text-center my-5">
												<Link to="/">
													<img className="logo-abbr" width="120" src={churchLogo} alt="PTS Kumba" />
													<div className="mt-3">
														<h5 className="text-white fw-bold">PTS Kumba</h5>
														<p className="text-white-50">Student Portal</p>
													</div>
												</Link>
											</div>
											{
												dataTheme === "light" ?
													<img src={BgImage} className="slideskew img-fix bitcoin-img" />
													:
													<img src={BgImage} className="slideskew img-fix bitcoin-img" />
											}
										</div>
									</div>
									<div className="col-xl-6 col-md-6">
										<div className="sign-in-your px-4 py-5">
											<div className="text-center mb-4">
												<div className="student-icon-wrapper mb-3">
													<i className="material-symbols-outlined">school</i>
												</div>
												<h4 className="fs-24 fw-bold text-primary">Student Login</h4>
												<p className="text-muted">Enter your matricule number to access your student dashboard</p>
											</div>

											{error && (
												<div className='alert alert-danger'>
													{error}
												</div>
											)}

											<form onSubmit={onStudentLogin}>
												<div className="mb-4">
													<label className="mb-2 text-dark fw-semibold">
														<i className="material-symbols-outlined me-2"></i>
														Matricule Number <span className='text-danger'>*</span>
													</label>
													<div className="input-group">
														<span className="input-group-text">
															<i className="material-symbols-outlined">badge</i>
														</span>
														<input 
															type="text" 
															className={`form-control ${errors.matricule ? 'is-invalid' : ''}`}
															value={matricule}
															onChange={(e) => setMatricule(e.target.value)}
															placeholder="Enter your matricule number"
															maxLength="20"
														/>
													</div>
													{errors.matricule && <div className="invalid-feedback d-block">{errors.matricule}</div>}
												</div>
												
												<div className="text-center mb-4">
													<button type="submit" className="btn btn-primary btn-lg w-100 student-login-btn" disabled={loading}>
														{loading ? (
															<>
																<span className="spinner-border spinner-border-sm me-2"></span>
																Logging in...
															</>
														) : (
															<>
																<i className="material-symbols-outlined me-2"></i>
																Access My Dashboard
															</>
														)}
													</button>
												</div>
											</form>

											{/* Application link for prospective students */}
											<div className="student-action-section">
												<div className="divider">
													<span>New Student?</span>
												</div>
												<div className="text-center mb-4">
													<button type="button" onClick={handleApply} className="btn btn-outline-success btn-lg w-100 apply-btn">
														<i className="material-symbols-outlined me-2"></i>
														Apply for Admission
													</button>
												</div>
											</div>

											{/* Navigation Links */}
											<div className="student-nav-links">
												<div className="row g-2">
													<div className="col-6">
														<Link to="/login" className="btn btn-outline-secondary w-100">
															<i className="material-symbols-outlined me-1"></i>
															Staff Login
														</Link>
													</div>
													<div className="col-6">
														<Link to="/" className="btn btn-outline-dark w-100">
															<i className="material-symbols-outlined me-1"></i>
															Home
														</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Custom Styles */}
			<style>{`
				.student-login-container {
					min-height: 100vh;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					padding: 2rem 0;
				}
				
				.student-login-card {
					border-radius: 20px;
					box-shadow: 0 20px 40px rgba(0,0,0,0.1);
					overflow: hidden;
					border: none;
				}
				
				.student-bg {
					position: relative;
					background-size: cover;
					background-position: center;
				}
				
				.student-bg::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
					z-index: 1;
				}
				
				.student-bg > div {
					position: relative;
					z-index: 2;
				}
				
				.student-icon-wrapper {
					width: 80px;
					height: 80px;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 auto;
					box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
				}
				
				.student-icon-wrapper i {
					font-size: 2.5rem;
					color: white;
				}
				
				.sign-in-your {
					background: white;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
				
				.form-control {
					border-radius: 10px;
					border: 2px solid #e9ecef;
					padding: 0.75rem 1rem;
					transition: all 0.3s ease;
				}
				
				.form-control:focus {
					border-color: #667eea;
					box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
				}
				
				.input-group-text {
					background: #f8f9fa;
					border: 2px solid #e9ecef;
					border-right: none;
					border-radius: 10px 0 0 10px;
				}
				
				.student-login-btn {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					border: none;
					border-radius: 25px;
					padding: 1rem 2rem;
					font-weight: 600;
					transition: all 0.3s ease;
				}
				
				.student-login-btn:hover {
					transform: translateY(-2px);
					box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
				}
				
				.apply-btn {
					border-radius: 25px;
					padding: 1rem 2rem;
					font-weight: 600;
					transition: all 0.3s ease;
					border: 2px solid #28a745;
				}
				
				.apply-btn:hover {
					transform: translateY(-2px);
					box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
				}
				
				.divider {
					text-align: center;
					margin: 2rem 0 1.5rem;
					position: relative;
				}
				
				.divider::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 0;
					right: 0;
					height: 1px;
					background: #e9ecef;
				}
				
				.divider span {
					background: white;
					padding: 0 1rem;
					color: #6c757d;
					font-weight: 500;
				}
				
				.student-nav-links .btn {
					border-radius: 20px;
					padding: 0.75rem 1rem;
					font-weight: 500;
					transition: all 0.3s ease;
				}
				
				.student-nav-links .btn:hover {
					transform: translateY(-1px);
				}
				
				.logo-abbr {
					border-radius: 15px;
					background: rgba(255,255,255,0.1);
					padding: 1rem;
				}
				
				@media (max-width: 768px) {
					.student-login-container {
						padding: 1rem 0;
					}
					
					.sign-in-your {
						padding: 2rem 1.5rem !important;
					}
					
					.student-icon-wrapper {
						width: 60px;
						height: 60px;
					}
					
					.student-icon-wrapper i {
						font-size: 2rem;
					}
				}
			`}</style>
		</div>
	);
}

export default StudentLogin; 