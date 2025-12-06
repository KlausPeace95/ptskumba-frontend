import React, { useContext, useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

/// Css
import "./index.css";

/// Layout
import Nav from "./layouts/nav";
import Nav2 from "./layouts/nav/index2";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";
import WalletBar from './layouts/WalletBar';

/// Dashboard
import Home from "./components/Dashboard/Home";
import StudentLayout from "./layouts/StudentLayout";
import DashboardDark from "./components/Dashboard/DashboardDark";
import StudentDashboard from "./components/Dashboard/StudentDashboard";

//student
import Students from "./components/Student/Students";
import StudentDetails from "./components/Student/StudentDetails";
import AddNewStudent from "./components/Student/AddNewStudent";

//Teacher
import Teachers from './components/Teacher/Teachers';
import TeachersDetail from './components/Teacher/TeachersDetail';
import AddNewTeacher from './components/Teacher/AddNewTeacher';
import TeachersList from './components/Teacher/TeachersList';

//Department
import Department from './components/Department/Department';
import DepartmentDetails from './components/Department/DepartmentDetails';

//Courses
import Courses from './components/Courses/Courses';
import CourseDetails from './components/Courses/CourseDetails';

//Administration
import AcademicYears from './components/Administration/AcademicYears';
import AcademicYearDetails from './components/Administration/AcademicYearDetails';
import Terms from './components/Administration/Terms';
import TermDetails from './components/Administration/TermDetails';
import SchoolEvents from './components/Administration/SchoolEvents';
import SchoolEventDetails from './components/Administration/SchoolEventDetails';
import Attendance from './components/Administration/Attendance';

// Attendance Components
import TeacherAttendance from './components/Attendance/TeacherAttendance';
import TeacherAttendanceDetails from './components/Attendance/TeacherAttendanceDetails';
import StudentAttendance from './components/Attendance/StudentAttendance';
import StudentAttendanceDetails from './components/Attendance/StudentAttendanceDetails';
import PeriodAttendance from './components/Attendance/PeriodAttendance';
import PeriodAttendanceDetails from './components/Attendance/PeriodAttendanceDetails';

// Teacher Dashboard - NEW SIMPLE VERSION
import TeacherDashboard from './components/Dashboard/teacher-dashboard';

// Finance Dashboard
import FinanceDashboard from './components/Dashboard/FinanceDashboard';
import FinanceLayout from './layouts/FinanceLayout';

// Finance Components
import Receipts from './components/Finance/Receipts';
import Payments from './components/Finance/Payments';
import DebtRecords from './components/Finance/DebtRecords';
import StudentDebtOverview from './components/Finance/StudentDebtOverview';
import ReceiptAllocations from './components/Finance/ReceiptAllocations';
import PaymentAllocations from './components/Finance/PaymentAllocations';

// Assignments Components
import AssignmentsList from './components/Assignments/AssignmentsList';

// Application Components
import ApplicationForm from './components/Applications/ApplicationForm';
import MyApplications from './components/Applications/MyApplications';
import AdminApplications from './components/Applications/AdminApplications';
import ApplicationDetails from './components/Applications/ApplicationDetails';
import Programs from './components/Applications/Programs';
import ProgramDetails from './components/Applications/ProgramDetails';
import Statistics from './components/Applications/Statistics';
import SubmissionSuccess from './components/Applications/SubmissionSuccess';

// Users Management Components
import AllUsers from './components/Users/AllUsers';
import CreateUser from './components/Users/CreateUser';

// Debug Components
import AuthDebug from './components/Dashboard/AuthDebug';

// Blog Components
import Articles from './components/Blog/Articles';
import CarouselImages from './components/Blog/CarouselImages';

/// File Manager
import FileManager from './components/FileManager/FileManager';

import { ThemeContext } from "../context/ThemeContext";
import { AcademicService } from '../services/AcademicService';
import Departments from './components/Academic/Departments';
import ClassLevels from './components/Academic/ClassLevels';
import ClassYears from './components/Academic/ClassYears';
import ReasonsLeft from './components/Academic/ReasonsLeft';
import Streams from './components/Academic/Streams';
import Subjects from './components/Academic/Subjects';
import GradeLevels from './components/Academic/GradeLevels';
import Classrooms from './components/Academic/Classrooms';
import StudentClasses from './components/Academic/StudentClasses';


// Landing Pages
// Legacy landing pages removed
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';

const Markup = ({ userRole, dashboardRoute }) => {
  const routhPath = [
    { url: "student", component: <Students /> },
    { url: "student-detail", component: <StudentDetails /> },
    { url: "add-student", component: <AddNewStudent /> },
    { url: "teacher", component: <Teachers /> },
    { url: "teacher-detail", component: <TeachersDetail /> },
    { url: "add-teacher", component: <AddNewTeacher /> },
    { url: "department", component: <Department /> },
    { url: "department-details", component: <DepartmentDetails /> },
    { url: "courses", component: <Courses /> },
    { url: "course-details", component: <CourseDetails /> },
  ]
  
  // Role-based dashboard components
  const getDashboardComponent = () => {
    switch (userRole) {
      case 'admin':
        return <Home />; // Admin sees admin dashboard
      case 'accountant':
        return <Navigate to="/finance-dashboard" replace />; // Accountant redirected to finance dashboard
      case 'teacher':
        return <Navigate to="/teacher-dashboard" replace />; // Teacher redirected to teacher dashboard
      case 'parent':
        return <StudentDetails />; // Parent sees student details
      case 'student':
        return <StudentDashboard />; // Student sees student dashboard
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Routes>
        {/* Default route for authenticated users → redirect to their dashboard */}
        <Route path='/' element={<Navigate to={dashboardRoute} replace />} />
        {/* Public Landing Pages — marketing at "/", role-selection at "/landing-2" */}
        {/* Legacy routes removed; public landing handled in App.jsx */}
        <Route path='/login' element={<Login />} />
        <Route path='/student-login' element={<StudentLogin />} />
        
        {/* Public Application Routes */}
        <Route path='/student-application' element={<ApplicationForm />} />
        <Route path='/programs' element={<Programs />} />
        <Route path='/programs/:id' element={<ProgramDetails />} />
        {/* Redirects for old routes */}
        <Route path='/about' element={<Navigate to="/" replace />} />
        <Route path='/landing-1' element={<Navigate to="/" replace />} />
        

        
        {/* Role-based dashboard routes */}
        <Route element={<Layout1 />}>
          <Route path='/dashboard' exact element={getDashboardComponent()} />
          <Route path='/parent-dashboard' exact element={<StudentDetails />} />
          <Route path='/dashboard-dark' exact element={<DashboardDark />} />         
        </Route>
        
        {/* Teacher Dashboard - COMPLETELY INDEPENDENT, NO ADMIN LAYOUT */}
        <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
        
        {/* Finance Dashboard - Uses existing FinanceLayout */}
        <Route path='/finance-dashboard' element={<FinanceLayout />}>
          <Route index element={<FinanceDashboard />} />
          <Route path='receipts' element={<Receipts />} />
          <Route path='payments' element={<Payments />} />
          <Route path='debts' element={<DebtRecords />} />
          <Route path='student-debt-overview' element={<StudentDebtOverview />} />
          <Route path='receipt-allocations' element={<ReceiptAllocations />} />
          <Route path='payment-allocations' element={<PaymentAllocations />} />
        </Route>
        
        {/* Student routes with independent layout */}
        <Route element={<StudentLayout />}>
          <Route path='/student-dashboard' exact element={<StudentDashboard />} />
          <Route path='/student/applications' element={<MyApplications />} />
          <Route path='/student/application/:id' element={<ApplicationDetails />} />
          <Route path='/student/application/:id/edit' element={<ApplicationForm />} />
          <Route path='/student/application-status' element={<Statistics />} />
          <Route path='/student/profile' element={<StudentDetails />} />
          <Route path='/student/settings' element={<StudentDetails />} />
          <Route path='/student/grades' element={<StudentDetails />} />
          <Route path='/student/schedule' element={<StudentDetails />} />
          <Route path='/student/assignments' element={<AssignmentsList />} />
          <Route path='/student/fees' element={<StudentDetails />} />
          <Route path='/student/payment-history' element={<StudentDetails />} />
          <Route path='/student/balance' element={<StudentDetails />} />
          <Route path='/student/library' element={<StudentDetails />} />
          <Route path='/student/support' element={<StudentDetails />} />
          <Route path='/student/events' element={<StudentDetails />} />
          <Route path='/student/change-password' element={<StudentDetails />} />
        </Route>
        
        {/* Blog Routes */}
        <Route path='/blog/articles' element={<Articles />} />
        <Route path='/blog/carousel-images' element={<CarouselImages />} />
        
        <Route element={<Layout2 />}>
          {routhPath.map((data, i) => (
            <Route key={i} exact path={`/${data.url}`} element={data.component} />
          ))}
          
          {/* Dynamic routes with parameters */}
          <Route path="/student-detail/:id" element={<StudentDetails />} />
          <Route path="/add-student/:id" element={<AddNewStudent />} />
          <Route path="/teacher-detail/:id" element={<TeachersDetail />} />
          <Route path="/add-teacher/:id" element={<AddNewTeacher />} />
          <Route path="/department-details/:id" element={<DepartmentDetails />} />
          <Route path="/course-details/:id" element={<CourseDetails />} />
          
          {/* Users Management Routes */}
          <Route path='/users/all-users' element={<AllUsers />} />
          <Route path='/users/create-user' element={<CreateUser />} />
          {/* TODO: Create additional user management components */}
          <Route path='/users/teachers' element={<AllUsers />} />
          <Route path='/users/add-teacher' element={<CreateUser />} />
          <Route path='/users/bulk-upload-teachers' element={<AllUsers />} />
          <Route path='/users/accountants' element={<AllUsers />} />
          <Route path='/users/add-accountant' element={<CreateUser />} />
          <Route path='/users/admins' element={<AllUsers />} />
          <Route path='/users/details/:id' element={<AllUsers />} />
          <Route path='/users/edit/:id' element={<CreateUser />} />
          
          {/* Admin Applications Management */}
          <Route path='/admin/applications' element={<AdminApplications />} />
          <Route path='/admin/applications/:id' element={<ApplicationDetails />} />
          
          {/* Debug Routes */}
          <Route path='/debug/auth' element={<AuthDebug />} />

          {/* Academic endpoints list routes */}
          <Route path='/academic/departments' element={<Departments />} />
          <Route path='/academic/class-levels' element={<ClassLevels />} />
          <Route path='/academic/grade-levels' element={<GradeLevels />} />

          <Route path='/academic/class-years' element={<ClassYears />} />

          <Route path='/academic/reasons-left' element={<ReasonsLeft />} />

          <Route path='/academic/streams' element={<Streams />} />

          <Route path='/academic/subjects' element={<Subjects />} />
          <Route path='/academic/subjects/bulk-upload' element={
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='card'>
                    <div className='card-header'>
                      <h4>Bulk Upload Subjects</h4>
                    </div>
                    <div className='card-body'>
                      <p>POST /academic/subjects/bulk-upload/</p>
                      <p className='text-muted'>Upload a CSV or Excel file with subject data. The file should contain columns for: name, code, description</p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = e.target.querySelector('input[type="file"]');
                        const file = fileInput.files[0];
                        if (!file) {
                          alert('Please select a file to upload');
                          return;
                        }
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          await AcademicService.bulkUploadSubjects(formData);
                          alert('Subjects uploaded successfully!');
                          fileInput.value = '';
                        } catch (error) {
                          alert('Upload failed: ' + (error?.response?.data?.detail || error?.message || 'Unknown error'));
                        }
                      }}>
                        <input type='file' className='form-control mb-3' accept='.csv,.xlsx,.xls' required/>
                        <button type='submit' className='btn btn-primary'>Upload Subjects</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />

          <Route path='/academic/classrooms' element={<Classrooms />} />
          <Route path='/academic/classrooms/bulk-upload' element={
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='card'>
                    <div className='card-header'>
                      <h4>Bulk Upload Classrooms</h4>
                    </div>
                    <div className='card-body'>
                      <p>POST /academic/classrooms/bulk-upload/</p>
                      <p className='text-muted'>Upload a CSV or Excel file with classroom data. The file should contain columns for: name, capacity, description</p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = e.target.querySelector('input[type="file"]');
                        const file = fileInput.files[0];
                        if (!file) {
                          alert('Please select a file to upload');
                          return;
                        }
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          await AcademicService.bulkUploadClassrooms(formData);
                          alert('Classrooms uploaded successfully!');
                          fileInput.value = '';
                        } catch (error) {
                          alert('Upload failed: ' + (error?.response?.data?.detail || error?.message || 'Unknown error'));
                        }
                      }}>
                        <input type='file' className='form-control mb-3' accept='.csv,.xlsx,.xls' required/>
                        <button type='submit' className='btn btn-primary'>Upload Classrooms</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />

          <Route path='/academic/student-classes' element={<StudentClasses />} />
          <Route path='/academic/student-classes/bulk-upload' element={
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='card'>
                    <div className='card-header'>
                      <h4>Bulk Upload Student Classes</h4>
                    </div>
                    <div className='card-body'>
                      <p>POST /academic/student-classes/bulk-upload/</p>
                      <p className='text-muted'>Upload a CSV or Excel file with student class data. The file should contain columns for: name, description</p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = e.target.querySelector('input[type="file"]');
                        const file = fileInput.files[0];
                        if (!file) {
                          alert('Please select a file to upload');
                          return;
                        }
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          await AcademicService.bulkUploadStudentClasses(formData);
                          alert('Student Classes uploaded successfully!');
                          fileInput.value = '';
                        } catch (error) {
                          alert('Upload failed: ' + (error?.response?.data?.detail || error?.message || 'Unknown error'));
                        }
                      }}>
                        <input type='file' className='form-control mb-3' accept='.csv,.xlsx,.xls' required/>
                        <button type='submit' className='btn btn-primary'>Upload Student Classes</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          
          {/* Administration endpoints routes */}
          <Route path='/administration/academic-years' element={<AcademicYears />} />
          <Route path='/administration/academic-years/:id' element={<AcademicYearDetails />} />
          
          <Route path='/administration/terms' element={<Terms />} />
          <Route path='/administration/terms/:id' element={<TermDetails />} />
          
          <Route path='/administration/school-events' element={<SchoolEvents />} />
          <Route path='/administration/school-events/:id' element={<SchoolEventDetails />} />
          
          <Route path='/administration/attendance' element={<Attendance />} />
          
          {/* Attendance endpoints routes */}
          <Route path='/attendance/teacher-attendance' element={<TeacherAttendance />} />
          <Route path='/attendance/teacher-attendance/:id' element={<TeacherAttendanceDetails />} />
          
          <Route path='/attendance/student-attendance' element={<StudentAttendance />} />
          <Route path='/attendance/student-attendance/:id' element={<StudentAttendanceDetails />} />
          
          <Route path='/attendance/period-attendance' element={<PeriodAttendance />} />
          <Route path='/attendance/period-attendance/:id' element={<PeriodAttendanceDetails />} />
          {/* Applications module routes - Admin access */}
          <Route path='/applications/programs' element={<Programs />} />
          <Route path='/applications/programs/:id' element={<ProgramDetails />} />
          <Route path='/applications/my-applications' element={<MyApplications />} />
          <Route path='/applications/my-applications/:id' element={<ApplicationDetails />} />
          <Route path='/applications/my-applications/:id/submit' element={<ApplicationDetails />} />
          <Route path='/applications/submission-success' element={<SubmissionSuccess />} />
          <Route path='/applications/statistics' element={<Statistics />} />
          <Route path='/applications/admin/applications' element={<AdminApplications />} />
          <Route path='/admin/applications' element={<AdminApplications />} />
          <Route path='/admin/application/:id' element={<ApplicationDetails />} />

        </Route>

        {/* Student Routes - StudentLayout */}
        <Route element={<StudentLayout />}>
          <Route path='/student/applications' element={<MyApplications />} />
          <Route path='/student/application/new' element={<ApplicationForm />} />
          <Route path='/student/application/:id' element={<ApplicationDetails />} />
          <Route path='/student/application-status' element={<Statistics />} />
          <Route path='/applications/submission-success' element={<SubmissionSuccess />} />
          
          {/* Applications Routes */}
          <Route path='/applications/programs' element={<Programs />} />
          <Route path='/applications/my-applications' element={<MyApplications />} />
          <Route path='/applications/statistics' element={<Statistics />} />
          <Route path='/applications/admin/applications' element={<AdminApplications />} />
        </Route>

        {/* Teacher Management Routes - Admin Layout */}
        <Route element={<Layout2 />}>
          <Route path='/teachers' element={<TeachersList />} />
          <Route path='/teachers/add' element={<AddNewTeacher />} />
          <Route path='/teachers/edit/:id' element={<AddNewTeacher />} />
          <Route path='/teachers/:id' element={<TeachersDetail />} />
        </Route>

        <Route element={<Layout5 />}>
          <Route path='/file-manager' exact element={<FileManager />} />
        </Route>
        
        {/* Catch-all route - must be last to prevent interference with other routes */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>      
      <ScrollToTop />
    </>
  );
};

// (RouteWrapper removed; components handle params themselves)

function Layout1() {
  const { sidebariconHover } = useContext(ThemeContext);
  const [sideMenu, setSideMenu] = useState(false);
  let windowsize = window.innerWidth;
  return (
    <div id="main-wrapper" className={` show  ${sidebariconHover ? "iconhover-toggle" : ""} ${sideMenu ? "menu-toggle" : ""}`}>
      <div className={`wallet-open  ${windowsize > 1199 ? 'active' : ''}`}>
        <Nav2 />
        <div className="content-body" style={{ minHeight: window.screen.height + 20 }}>
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
        <Footer changeFooter="footer-outer" />
        <WalletBar />
      </div>
    </div>

  )
}

function Layout2() {
  const [sideMenu, setSideMenu] = useState(false);
  const { sidebariconHover } = useContext(ThemeContext);
  return (
    <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${sideMenu ? "menu-toggle" : ""}`}>
      <Nav />
      <div className="content-body" style={{ minHeight: window.screen.height + 20 }}>
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      <Footer changeFooter="out-footer style-2" />
    </div>

  )
}



function Layout5() {
  const [sideMenu, setSideMenu] = useState(false);
  const { sidebariconHover } = useContext(ThemeContext);
  return (
    <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${sideMenu ? "menu-toggle" : ""}`}>
      <Nav />
      <div className="content-body message-body mh-auto">
        <div className="container-fluid mh-auto p-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}


export default Markup;