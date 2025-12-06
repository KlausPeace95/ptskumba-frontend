import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/store';
// image
import BgImage from "../../assets/images/bg1.png";
import logo from "../../assets/images/logo-full.png";
import logolight from "../../assets/images/logo-white.png";
import pol from "../../assets/images/pol.jpg";

function Login() {
	const [email, setEmail] = useState('demo@example.com');
	let errorsObj = { email: '', password: '' };
	const [errors, setErrors] = useState(errorsObj);
	const [password, setPassword] = useState('123456');

	const navigate = useNavigate();
	const { login, error, loading, user } = useAuthStore();

	async function onLogin(e) {
		e.preventDefault();
		let errorFlag = false;
		const errorObj = { ...errorsObj };
		if (email === '') {
			errorObj.email = 'Email is Required';
			errorFlag = true;
		}
		if (password === '') {
			errorObj.password = 'Password is Required';
			errorFlag = true;
		}
		setErrors(errorObj);
		if (errorFlag) {
			return;
		}
		await login(email, password);
		if (useAuthStore.getState().user) {
			navigate('/dashboard');
		}
	}

	const element = document.querySelector("body");
	let dataTheme = element.getAttribute("data-theme-version");

	return (
		<div className="container h-100">
			<div className="row h-100 align-items-center justify-contain-center">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-body p-0">
							<div className="row m-0">
								<div className="col-xl-6 col-md-6 sign text-center sign-bg" style={{ backgroundImage: 'url(' + pol + ')' }}>
									<div>
										<div className="text-center my-5">
											<Link to={"#"}>
												<img className="logo-abbr dark-logo" width="200" src={logo} alt="" />
												<img className="logo-abbr light-logo text-center m-auto" width="200" src={logolight} alt="" />
											</Link>
										</div>
										{
											dataTheme === "light" ?
												<img src={BgImage} className="slideskew img-fix bitcoin-img" />
												:
												<img src={BgImage} className=" slideskew img-fix bitcoin-img " />
										}
									</div>
								</div>
								<div className="col-xl-6 col-md-6" >
									<div className="sign-in-your px-2">
										<h4 className="fs-20 ">Sign in your account</h4>
										<span>Welcome back! Login with your data that you entered during registration</span>
										{/* Social login buttons removed - users created from backend only */}
										{error && (
											<div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
												{error}
											</div>
										)}
										<form onSubmit={onLogin}>
											<div className="mb-3">
												<label className="mb-1"><strong>Email</strong><span className='required'>*</span></label>
												<input type="email" className="form-control"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													placeholder="Type Your Email Address"
												/>
												{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
											</div>
											<div className="mb-3">
												<label className="mb-1"><strong>Password</strong><span className='required'>*</span></label>
												<input
													type="password"
													className="form-control"
													value={password}
													placeholder="Type Your Password"
													onChange={(e) => setPassword(e.target.value)}
												/>
												{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
											</div>
											<div className="row d-flex justify-content-between mt-4 mb-2">
												<div className="mb-3">
													<div className="form-check custom-checkbox ms-1">
														<input type="checkbox" className="form-check-input" id="basic_checkbox_1" />
														<label className="form-check-label" htmlFor="basic_checkbox_1">Remember my preference</label>
													</div>
												</div>
												{/* Sign up link removed - users created from backend only */}
											</div>
											<div className="text-center">
												<button type="submit" className="btn btn-primary btn-block" disabled={loading}>Sign Me In</button>
											</div>
										</form>

										{/* Student Login Link */}
										<div className="text-center mt-4">
											<div className="border-top pt-3">
												<p className="text-muted mb-2">Are you a student?</p>
												<Link to="/student-login" className="btn btn-outline-primary">
													<i className="material-symbols-outlined me-2"></i>
													Login as a Student
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
	);
};

export default Login;
