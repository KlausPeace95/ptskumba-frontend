import React  from 'react';
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/store';

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

function LogoutPage(props){
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    function onLogout() {
        logout();
        navigate('/login');
    }
    return(
        <>
            <button  className="dropdown-item ai-icon btn btn-primary light" onClick={onLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"  strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span className="ms-2 text-primar" >Logout </span>
            </button>
        </>
    )
} 

export default withRouter(LogoutPage);