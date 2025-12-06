import { lazy, Suspense, useEffect } from 'react';
/// Components
import Index from './jsx/index';
import { Route, Routes, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/store';
/// Style
import './assets/vendor/swiper/css/swiper-bundle.min.css';
// import "./assets/vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./assets/css/style.css";
import PtsLanding from './jsx/pages/PtsLanding';
import RoleSelection from './jsx/pages/RoleSelection';
import About from './jsx/pages/About';
import Mission from './jsx/pages/Mission';
// Public application components
import ApplicationForm from './jsx/components/Applications/ApplicationForm';
import Programs from './jsx/components/Applications/Programs';
import ProgramDetails from './jsx/components/Applications/ProgramDetails';

const SignUp = lazy(() => import('./jsx/pages/Signup'));
const Login = lazy(() => import('./jsx/pages/Login'));
const StudentLogin = lazy(() => import('./jsx/pages/StudentLogin'));
const StudentDashboard = lazy(() => import('./jsx/components/Dashboard/StudentDashboard'));

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

function App() {
    const { user, getUserRole, initialized, initializeAuth } = useAuthStore();

    useEffect(() => {
        if (!initialized) {
            initializeAuth();
        }
    }, [initialized, initializeAuth]);
    
    if (!initialized) {
        return (
            <div id="preloader">
                <div className="sk-three-bounce">
                    <div className="sk-child sk-bounce1"></div>
                    <div className="sk-child sk-bounce2"></div>
                    <div className="sk-child sk-bounce3"></div>
                </div>
            </div>
        );
    }
    
    const userRole = getUserRole();

    if (user) {
        let dashboardRoute = '/dashboard';
        if (userRole === 'accountant') {
            dashboardRoute = '/finance-dashboard';
        } else if (userRole === 'parent') {
            dashboardRoute = '/parent-dashboard';
        } else if (userRole === 'student') {
            dashboardRoute = '/student-dashboard';
        }

        return (
            <>
                <Suspense 
                    fallback={
                        <div id="preloader">
                            <div className="sk-three-bounce">
                                <div className="sk-child sk-bounce1"></div>
                                <div className="sk-child sk-bounce2"></div>
                                <div className="sk-child sk-bounce3"></div>
                            </div>
                        </div>
                    }
                >
                    <Index userRole={userRole} dashboardRoute={dashboardRoute} />
                </Suspense>
            </>
        );
    } else {
        return (
            <Suspense 
                fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
            >
                <Routes>
                    {/* New public flow */}
                    <Route path='/' element={<PtsLanding />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/mission' element={<Mission />} />
                    <Route path='/roles' element={<RoleSelection />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/student-login' element={<StudentLogin />} />
                    <Route path='/signup' element={<SignUp />} />
                    {/* Public application routes (accessible before authentication) */}
                    <Route path='/student-application' element={<ApplicationForm />} />
                    <Route path='/programs' element={<Programs />} />
                    <Route path='/programs/:id' element={<ProgramDetails />} />
                    <Route path='/student-dashboard' element={<StudentDashboard />} />
                    <Route path='/page-register' element={<SignUp />} />
                    <Route path='*' element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        );
    }
}

export default withRouter(App); 