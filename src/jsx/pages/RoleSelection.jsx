import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/custom/church-logo.jpeg';

// Using Font Awesome style icons (will work with react-icons after installation)
const roles = [
  { 
    id: 'student', 
    title: 'Student', 
    icon: '🎓', // Graduate cap
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    login: '/student-login',
    description: 'Apply and manage your theological studies'
  },
  { 
    id: 'teacher', 
    title: 'Teacher', 
    icon: '👨‍🏫', // Teacher
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
    login: '/login',
    description: 'Manage courses and student progress'
  },
  { 
    id: 'accountant', 
    title: 'Finance', 
    icon: '💰', // Money bag
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
    login: '/login',
    description: 'Handle financial operations and billing'
  },
  { 
    id: 'admin', 
    title: 'Admin', 
    icon: '⚙️', // Gear/Settings
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
    login: '/login',
    description: 'System administration and management'
  },
];

export default function RoleSelection() {
  return (
    <div className="bg-light" style={{minHeight:'100vh'}}>
      <header className="bg-white shadow-sm fixed-top">
        <div className="container py-3 d-flex align-items-center justify-content-between">
          <Link to="/" className="text-decoration-none d-flex align-items-center">
            <img src={Logo} alt="PTS Kumba" style={{height:'50px'}} className="me-3"/>
            <div>
              <span className="fw-bold text-dark fs-5">PTS Kumba</span>
              <div className="small text-muted">Presbyterian Theological Seminary</div>
            </div>
          </Link>
          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-link text-decoration-none">
              <i className="material-symbols-outlined">home</i>
            </Link>
            <Link to="/signup" className="btn btn-primary">
              <i className="material-symbols-outlined me-1">description</i>
              Apply
            </Link>
          </div>
        </div>
      </header>

      <main className="container" style={{paddingTop:'120px', paddingBottom:'60px'}}>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark mb-3">Select Your Role</h1>
          <p className="lead text-muted">Choose your role to access your personalized dashboard</p>
        </div>
        
        <div className="row g-4 justify-content-center">
          {roles.map((role) => (
            <div key={role.id} className="col-lg-3 col-md-6">
              <div className="role-card card h-100 border-0 shadow-lg text-center position-relative overflow-hidden">
                {/* Background gradient */}
                <div 
                  className="position-absolute w-100 h-100 opacity-10"
                  style={{background: role.color, top: 0, left: 0, zIndex: 1}}
                />
                
                <div className="card-body p-4 position-relative" style={{zIndex: 2}}>
                  {/* Icon */}
                  <div 
                    className="role-icon d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                    style={{
                      width:'80px',
                      height:'80px', 
                      background: role.color,
                      borderRadius: '20px',
                      fontSize: '36px'
                    }}
                  >
                    <span className="text-white">{role.icon}</span>
                  </div>
                  
                  {/* Title */}
                  <h4 className="fw-bold text-dark mb-2">{role.title}</h4>
                  
                  {/* Description */}
                  <p className="text-muted small mb-4">{role.description}</p>
                  
                  {/* Login Button Only */}
                  <Link 
                    to={role.login} 
                    className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm"
                    style={{
                      background: role.color,
                      border: 'none',
                      padding: '12px 24px'
                    }}
                  >
                    <i className="material-symbols-outlined">login</i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
      
      {/* Custom Styles */}
      <style>{`
        .role-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .role-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }
        
        .role-icon {
          transition: all 0.3s ease;
        }
        
        .role-card:hover .role-icon {
          transform: scale(1.1);
        }
        
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
        }
        

        
        @media (max-width: 768px) {
          .role-card {
            margin-bottom: 1rem;
          }
          
          .display-4 {
            font-size: 2rem;
          }
          
          .role-icon {
            width: 70px !important;
            height: 70px !important;
            font-size: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}


