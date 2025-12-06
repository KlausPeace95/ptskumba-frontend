import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/store'
import BgImage from "../../assets/images/bg1.png";
import pol from "../../assets/images/pol.jpg";
import churchLogo from "../../assets/custom/church-logo.jpeg";

function Signup() {
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [middleName, setMiddleName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [errors, setErrors] = useState({});

	const navigate = useNavigate();
	const { signup, loading } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Frontend validation
		const newErrors = {};
		if (!email) newErrors.email = 'Email is required';
		if (!firstName) newErrors.firstName = 'First name is required';
		if (!lastName) newErrors.lastName = 'Last name is required';
		if (!password) newErrors.password = 'Password is required';
		if (!passwordConfirm) newErrors.passwordConfirm = 'Password confirmation is required';
		if (password && passwordConfirm && password !== passwordConfirm) {
			newErrors.passwordConfirm = 'Passwords do not match';
		}
		if (password && password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters long';
		}
		
		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		try {
			await signup({
				email: email,
				first_name: firstName,
				middle_name: middleName,
				last_name: lastName,
				phone_number: phoneNumber,
				password: password,
				password_confirm: passwordConfirm
			});

			// Navigate to student application form after successful signup
			navigate('/student-application');
		} catch (error) {
			console.error('Signup error:', error);
			// The error is already set in the store, but we can show specific form errors
			if (error.message.includes('email')) {
				setErrors({ email: 'This email is already registered' });
			} else if (error.message.includes('password')) {
				setErrors({ password: 'Password does not meet requirements' });
			} else {
				setErrors({ general: error.message || 'Registration failed. Please try again.' });
			}
		}
	}

	const element = document.querySelector("body");
	let dataTheme = element ? element.getAttribute("data-theme-version") : 'light';

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
														<p className="text-white-50">Create Your Account</p>
													</div>
												</Link>
											</div>
											{ dataTheme === "light" ?
												<img src={BgImage} className="slideskew img-fix bitcoin-img" /> :
												<img src={BgImage} className="slideskew img-fix bitcoin-img" />
											}
										</div>
									</div>
									<div className="col-xl-6 col-md-6">
										<div className="sign-in-your px-4 py-5">
											<div className="text-center mb-4">
												<div className="student-icon-wrapper mb-3">
													<i className="material-symbols-outlined"></i>
												</div>
												<h4 className="fs-24 fw-bold text-primary">Create Account</h4>
												<p className="text-muted">Sign up to start your application</p>
											</div>

											<form onSubmit={handleSubmit}>
												{errors.general && (
													<div className="alert alert-danger mb-3">
														{errors.general}
													</div>
												)}

												<div className="mb-3">
													<label className="mb-2 text-dark fw-semibold">
														<i className="material-symbols-outlined me-2">mail</i>
														Email <span className='text-danger'>*</span>
													</label>
													<input 
														type="email" 
														className={`form-control ${errors.email ? 'is-invalid' : ''}`}
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														placeholder="Enter your email"
														required
													/>
													{errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
												</div>

												<div className="row">
													<div className="col-md-6 mb-3">
														<label className="mb-2 text-dark fw-semibold">
															<i className="material-symbols-outlined me-2">person</i>
															First Name <span className='text-danger'>*</span>
														</label>
														<input 
															type="text" 
															className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
															value={firstName}
															onChange={(e) => setFirstName(e.target.value)}
															placeholder="Enter your first name"
															required
														/>
														{errors.firstName && <div className="invalid-feedback d-block">{errors.firstName}</div>}
													</div>
													<div className="col-md-6 mb-3">
														<label className="mb-2 text-dark fw-semibold">
															<i className="material-symbols-outlined me-2">person</i>
															Last Name <span className='text-danger'>*</span>
														</label>
														<input 
															type="text" 
															className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
															value={lastName}
															onChange={(e) => setLastName(e.target.value)}
															placeholder="Enter your last name"
															required
														/>
														{errors.lastName && <div className="invalid-feedback d-block">{errors.lastName}</div>}
													</div>
												</div>

												<div className="mb-3">
													<label className="mb-2 text-dark fw-semibold">
														<i className="material-symbols-outlined me-2"></i>
														Middle Name
													</label>
													<input 
														type="text" 
														className="form-control"
														value={middleName}
														onChange={(e) => setMiddleName(e.target.value)}
														placeholder="Enter your middle name (optional)"
													/>
												</div>

												<div className="mb-3">
													<label className="mb-2 text-dark fw-semibold">
														<i className="material-symbols-outlined me-2"></i>
														Phone Number
													</label>
													<input 
														type="tel" 
														className="form-control"
														value={phoneNumber}
														onChange={(e) => setPhoneNumber(e.target.value)}
														placeholder="Enter your phone number (optional)"
													/>
												</div>

												<div className="mb-3">
													<label className="mb-2 text-dark fw-semibold">
														<i className="material-symbols-outlined me-2">lock</i>
														Password <span className='text-danger'>*</span>
													</label>
													<input 
														type="password" 
														className={`form-control ${errors.password ? 'is-invalid' : ''}`}
														value={password}
														onChange={(e) => setPassword(e.target.value)}
														placeholder="Create a password"
														minLength={8}
														required
													/>
													{errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
												</div>

												<div className="mb-4">
													<label className="mb-2 text-dark fw-semibold">
														<i className="material-symbols-outlined me-2">lock</i>
														Confirm Password <span className='text-danger'>*</span>
													</label>
													<input 
														type="password" 
														className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
														value={passwordConfirm}
														onChange={(e) => setPasswordConfirm(e.target.value)}
														placeholder="Confirm your password"
														minLength={8}
														required
													/>
													{errors.passwordConfirm && <div className="invalid-feedback d-block">{errors.passwordConfirm}</div>}
												</div>

												<div className="text-center mb-4">
													<button type="submit" className="btn btn-primary btn-lg w-100 student-login-btn" disabled={loading}>
														{loading ? (
															<>
																<span className="spinner-border spinner-border-sm me-2"></span>
																Creating account...
															</>
														) : (
															<>
																<i className="material-symbols-outlined me-2">how_to_reg</i>
																Create Account
															</>
														)}
													</button>
												</div>
											</form>

										{/* Navigation Links */}
										<div className="student-nav-links">
											<div className="row g-2">
												<div className="col-6">
													<Link to="/login" className="btn btn-outline-secondary w-100">
														<i className="material-symbols-outlined me-1">person</i>
														Staff Login
													</Link>
												</div>
												<div className="col-6">
													<Link to="/" className="btn btn-outline-dark w-100">
														<i className="material-symbols-outlined me-1">home</i>
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

			{/* Custom Styles — copied from StudentLogin for consistent UI */}
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
		</div>
	);
}

export default Signup;


