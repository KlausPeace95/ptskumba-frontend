import React,{useState, useContext, useEffect} from 'react';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

//Import Components
import { ThemeContext } from "../../../context/ThemeContext";
import { SVGICON } from './Content';

import { UnpaidStudentTable } from './Elements/UnpaidStudentTable';
import Calendar from './Elements/Calendar';
import { getProfile, getUserRole, getCurrentUser } from '../../../services/UsersService';
import { AcademicService } from '../../../services/AcademicService';
import { 
    getAdminApplications, 
    updateApplicationStatus,
    getApplicationStatistics 
} from '../../../services/ApplicationService';

import { BlogService } from '../../../services/BlogService';

import {
  getAcademicYears,
  getTerms,
  getSchoolEvents
} from '../../../services/AdministrationService';

import {
  getPeriods,
  generateTimetable,
  getTimetableStats,
  exportTimetable,
  getWeeklySchedule,
  getDailySchedule
} from '../../../services/PeriodService';

import {
  getAllStudents,
  getStudentStats,
  bulkUploadStudents,
  exportStudentsData,
  searchStudentsByName,
  getStudentsByClassLevel,
  testSISConnection,
  testCreateStudentEndpoint
} from '../../../services/SISService';

import {
  getAllTeachers,
  getTeacherStats,
  bulkUploadTeachers,
  exportTeachersData,
  searchTeachersByName,
  getTeachersBySubject,
  testTeachersConnection,
  testCreateTeacherEndpoint
} from '../../../services/TeachersService';

import {
  getTeacherAttendance,
  getStudentAttendance,
  getPeriodAttendance
} from '../../../services/AttendanceService';

const SchoolPerformance = loadable(() =>
 	pMinDelay(import("./Elements/SchoolPerformance"), 500)
);
const SchoolOverView = loadable(() =>
 	pMinDelay(import("./Elements/SchoolOverView"), 1000)
);

const Home = () => {
	const { changeBackground } = useContext(ThemeContext);
	const [adminProfile, setAdminProfile] = useState(null);
	const [applicationsData, setApplicationsData] = useState({
		total: 0,
		draft: 0,
		submitted: 0,
		under_review: 0,
		approved: 0,
		rejected: 0,
		waitlisted: 0
	});
	const [recentApplications, setRecentApplications] = useState([]);
	const [authStatus, setAuthStatus] = useState({
		isAuthenticated: false,
		token: null,
		userRole: null,
		lastLogin: null
	});
	const [apiStatus, setApiStatus] = useState({
		applications: 'unknown',
		users: 'unknown',
		academic: 'unknown',
		timetable: 'unknown',
		sis: 'unknown'
	});
	const [counts, setCounts] = useState({
		departments: 0,
		subjects: 0,
		classrooms: 0,
		classLevels: 0,
		gradeLevels: 0,
		classYears: 0,
		streams: 0,
		studentClasses: 0,
		reasonsLeft: 0,
		academicYears: 0,
		terms: 0,
		schoolEvents: 0,
		periods: 0,
		articles: 0,
		carouselImages: 0,
		teacherAttendance: 0,
		studentAttendance: 0,
		periodAttendance: 0,
	});
	
	// Timetable specific state
	const [timetableStats, setTimetableStats] = useState({
		total: 0,
		byDay: {},
		byTeacher: {},
		byClassroom: {},
		bySubject: {}
	});
	const [timetableLoading, setTimetableLoading] = useState(false);

	// SIS specific state
	const [studentStats, setStudentStats] = useState({
		total: 0,
		byGender: {},
		byClassLevel: {},
		byReligion: {},
		byRegion: {},
		withParents: 0,
		withoutParents: 0,
		withSiblings: 0,
		withoutSiblings: 0
	});
	const [sisLoading, setSisLoading] = useState(false);
	const [bulkUploadFile, setBulkUploadFile] = useState(null);
	const [bulkUploadResult, setBulkUploadResult] = useState(null);

	// Teachers specific state
	const [teacherStats, setTeacherStats] = useState({
		total: 0,
		byGender: {},
		bySubject: {},
		bySalary: {
			total: 0,
			average: 0,
			highest: 0,
			lowest: 0
		},
		withSubjects: 0,
		withoutSubjects: 0
	});
	const [teachersLoading, setTeachersLoading] = useState(false);
	const [teacherBulkUploadFile, setTeacherBulkUploadFile] = useState(null);
	const [teacherBulkUploadResult, setTeacherBulkUploadResult] = useState(null);

	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);

	// Check authentication status
	useEffect(() => {
		const checkAuthStatus = () => {
			const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
			const userData = localStorage.getItem('userData');
			const user = userData ? JSON.parse(userData) : null;
			
			setAuthStatus({
				isAuthenticated: !!token,
				token: token,
				userRole: user ? getUserRole() : null,
				lastLogin: user?.lastLogin || 'Unknown'
			});
		};
		
		checkAuthStatus();
		const interval = setInterval(checkAuthStatus, 30000); // Check every 30 seconds
		return () => clearInterval(interval);
	}, []);

	// Test API endpoints
	const testAPIEndpoints = async () => {
		setApiStatus({ applications: 'testing', users: 'testing', academic: 'testing', timetable: 'testing', sis: 'testing' });
		
		try {
			// Test Applications API
			try {
				await getAdminApplications();
				setApiStatus(prev => ({ ...prev, applications: 'working' }));
			} catch (error) {
				console.error('Applications API test failed:', error);
				setApiStatus(prev => ({ ...prev, applications: 'failed' }));
			}

			// Test Users API
			try {
				await getProfile();
				setApiStatus(prev => ({ ...prev, users: 'working' }));
			} catch (error) {
				console.error('Users API test failed:', error);
				setApiStatus(prev => ({ ...prev, users: 'failed' }));
			}

			// Test Academic API
			try {
				await AcademicService.getDepartments();
				setApiStatus(prev => ({ ...prev, academic: 'working' }));
			} catch (error) {
				console.error('Academic API test failed:', error);
				setApiStatus(prev => ({ ...prev, academic: 'failed' }));
			}

			// Test Timetable API
			try {
				await getPeriods();
				setApiStatus(prev => ({ ...prev, timetable: 'working' }));
				console.log('✅ Timetable API test passed');
			} catch (error) {
				console.error('❌ Timetable API test failed:', error);
				setApiStatus(prev => ({ ...prev, timetable: 'failed' }));
			}

			// Test SIS API
			try {
				console.log('🔍 Testing SIS API endpoints...');
				
				// Test connection first
				const connectionTest = await testSISConnection();
				console.log('SIS Connection test:', connectionTest);
				
				if (connectionTest.status === 'working') {
					// Test student creation endpoint
					const createTest = await testCreateStudentEndpoint();
					console.log('SIS Create Student test:', createTest);
					
					if (createTest.status === 'working') {
						setApiStatus(prev => ({ ...prev, sis: 'working' }));
						console.log('✅ SIS API comprehensive test passed');
					} else {
						setApiStatus(prev => ({ ...prev, sis: 'partial' }));
						console.log('⚠️ SIS API partially working (read-only)');
					}
				} else {
					setApiStatus(prev => ({ ...prev, sis: 'failed' }));
					console.log('❌ SIS API connection failed');
				}
			} catch (error) {
				console.error('❌ SIS API test failed:', error);
				setApiStatus(prev => ({ ...prev, sis: 'failed' }));
			}
		} catch (error) {
			console.error('API testing failed:', error);
		}
	};

	// Load applications data
	const loadApplicationsData = async () => {
		try {
			const adminApps = await getAdminApplications();
			if (adminApps && Array.isArray(adminApps)) {
				const stats = {
					total: adminApps.length,
					draft: adminApps.filter(app => app.status === 'draft').length,
					submitted: adminApps.filter(app => app.status === 'submitted').length,
					under_review: adminApps.filter(app => app.status === 'under_review').length,
					approved: adminApps.filter(app => app.status === 'approved').length,
					rejected: adminApps.filter(app => app.status === 'rejected').length,
					waitlisted: adminApps.filter(app => app.status === 'waitlisted').length
				};
				setApplicationsData(stats);
				
				// Get recent applications (last 5)
				const recent = adminApps
					.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
					.slice(0, 5);
				setRecentApplications(recent);
			}
		} catch (error) {
			console.error('Failed to load applications data:', error);
		}
	};

	// Update application status
	const updateApplicationStatus = async (applicationId, newStatus, comments = '') => {
		try {
			await updateApplicationStatus(applicationId, {
				status: newStatus,
				reviewer_comments: comments
			});
			
			// Reload applications data
			await loadApplicationsData();
			
			// Show success message
			alert(`Application status updated to ${newStatus}`);
		} catch (error) {
			console.error('Failed to update application status:', error);
			alert('Failed to update application status: ' + (error?.response?.data?.error || error.message));
		}
	};

	// Timetable Management Functions
	const loadTimetableStats = async () => {
		try {
			setTimetableLoading(true);
			const stats = await getTimetableStats();
			setTimetableStats(stats);
			console.log('✅ Timetable stats loaded:', stats);
		} catch (error) {
			console.error('❌ Failed to load timetable stats:', error);
			setError('Failed to load timetable statistics');
		} finally {
			setTimetableLoading(false);
		}
	};

	const handleGenerateTimetable = async () => {
		try {
			setTimetableLoading(true);
			const result = await generateTimetable();
			console.log('✅ Timetable generated:', result);
			alert('✅ Timetable generated successfully!');
			
			// Reload timetable stats and periods count
			await loadTimetableStats();
			await loadAdminDashboardData(); // This will reload periods count
		} catch (error) {
			console.error('❌ Failed to generate timetable:', error);
			alert('❌ Failed to generate timetable: ' + (error?.response?.data?.error || error.message));
		} finally {
			setTimetableLoading(false);
		}
	};

	const handleExportTimetable = async (format = 'json') => {
		try {
			setTimetableLoading(true);
			const data = await exportTimetable(format);
			console.log('✅ Timetable exported:', data);
			
			// Create download link for JSON
			if (format === 'json') {
				const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `timetable-${new Date().toISOString().split('T')[0]}.json`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}
			
			alert('✅ Timetable exported successfully!');
		} catch (error) {
			console.error('❌ Failed to export timetable:', error);
			alert('❌ Failed to export timetable: ' + (error?.response?.data?.error || error.message));
		} finally {
			setTimetableLoading(false);
		}
	};

	// SIS Management Functions
	const loadStudentStats = async () => {
		try {
			setSisLoading(true);
			const stats = await getStudentStats();
			setStudentStats(stats);
			console.log('✅ Student stats loaded:', stats);
		} catch (error) {
			console.error('❌ Failed to load student stats:', error);
			setError('Failed to load student statistics');
		} finally {
			setSisLoading(false);
		}
	};

	const handleBulkUploadStudents = async () => {
		if (!bulkUploadFile) {
			alert('❌ Please select a file first');
			return;
		}

		try {
			setSisLoading(true);
			const result = await bulkUploadStudents(bulkUploadFile);
			setBulkUploadResult(result);
			console.log('✅ Bulk upload completed:', result);
			
			// Show success message with details
			const message = `✅ Bulk upload completed!\n\n` +
				`📊 ${result.message}\n` +
				`🔄 Updated students: ${result.updated_students?.length || 0}\n` +
				`⏭️ Skipped students: ${result.skipped_students?.length || 0}\n` +
				`❌ Failed: ${result.not_created?.length || 0}`;
			
			alert(message);
			
			// Reload student stats
			await loadStudentStats();
			
			// Clear file
			setBulkUploadFile(null);
		} catch (error) {
			console.error('❌ Failed to bulk upload students:', error);
			alert('❌ Failed to bulk upload students: ' + (error?.response?.data?.error || error.message));
		} finally {
			setSisLoading(false);
		}
	};

	const handleExportStudents = async (format = 'json') => {
		try {
			setSisLoading(true);
			await exportStudentsData(format);
			alert('✅ Students data exported successfully!');
		} catch (error) {
			console.error('❌ Failed to export students data:', error);
			alert('❌ Failed to export students data: ' + (error?.response?.data?.error || error.message));
		} finally {
			setSisLoading(false);
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			// Validate file type
			const validTypes = [
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
				'application/vnd.ms-excel', // .xls
				'text/csv' // .csv
			];
			
			if (validTypes.includes(file.type)) {
				setBulkUploadFile(file);
				console.log('✅ File selected:', file.name);
			} else {
				alert('❌ Please select a valid Excel or CSV file');
				event.target.value = '';
			}
		}
	};

	// Dedicated Student API Testing Function
	const testStudentEndpoints = async () => {
		try {
			setSisLoading(true);
			console.log('🔍 Starting comprehensive student API tests...');

			// Test 1: Connection Test
			console.log('Test 1: Testing SIS API connection...');
			const connectionResult = await testSISConnection();
			console.log('✅ Connection test result:', connectionResult);

			// Test 2: Create Student Test
			console.log('Test 2: Testing student creation endpoint...');
			const createResult = await testCreateStudentEndpoint();
			console.log('✅ Create student test result:', createResult);

			// Test 3: Get Students Test
			console.log('Test 3: Testing get students endpoint...');
			try {
				const students = await getAllStudents({ page: 1, page_size: 5 });
				console.log('✅ Get students test passed. Found:', students.length || students.results?.length || 0, 'students');
			} catch (error) {
				console.error('❌ Get students test failed:', error);
			}

			// Test 4: Student Stats Test
			console.log('Test 4: Testing student statistics endpoint...');
			try {
				const stats = await getStudentStats();
				console.log('✅ Student stats test passed. Total students:', stats.total);
			} catch (error) {
				console.error('❌ Student stats test failed:', error);
			}

			// Show comprehensive results
			const overallStatus = connectionResult.status === 'working' && createResult.status === 'working' ? 'working' : 
								connectionResult.status === 'working' ? 'partial' : 'failed';
			
			const message = `📊 Student API Test Results:\n\n` +
							`🔗 Connection: ${connectionResult.status} - ${connectionResult.message}\n` +
							`➕ Create Student: ${createResult.status} - ${createResult.message}\n` +
							`📈 Overall Status: ${overallStatus}\n\n` +
							`${overallStatus === 'working' ? '✅ All student endpoints are working correctly!' :
							  overallStatus === 'partial' ? '⚠️ Student endpoints partially working (read-only access)' :
							  '❌ Student endpoints are not accessible'}`;

			alert(message);
			
			// Update API status
			setApiStatus(prev => ({ ...prev, sis: overallStatus }));

		} catch (error) {
			console.error('❌ Student API testing failed:', error);
			alert('❌ Student API testing failed: ' + error.message);
		} finally {
			setSisLoading(false);
		}
	};

	// ===== TEACHER MANAGEMENT FUNCTIONS =====

	// Load teacher statistics
	const loadTeacherStats = async () => {
		try {
			setTeachersLoading(true);
			const stats = await getTeacherStats();
			setTeacherStats(stats);
			console.log('✅ Teacher stats loaded:', stats);
		} catch (error) {
			console.error('❌ Failed to load teacher stats:', error);
		} finally {
			setTeachersLoading(false);
		}
	};

	// Handle teacher bulk upload
	const handleTeacherBulkUpload = async () => {
		if (!teacherBulkUploadFile) {
			alert('❌ Please select a file first');
			return;
		}

		try {
			setTeachersLoading(true);
			console.log('🔍 Starting teacher bulk upload...');
			
			const result = await bulkUploadTeachers(teacherBulkUploadFile);
			console.log('✅ Teacher bulk upload result:', result);
			
			const message = `📊 Teacher Bulk Upload Results:\n\n` +
							`✅ Successfully uploaded: ${result.message || 'Unknown'}\n` +
							`❌ Failed to upload: ${result.not_created?.length || 0}`;
			
			alert(message);
			
			// Reload teacher stats
			await loadTeacherStats();
			
			// Clear file
			setTeacherBulkUploadFile(null);
		} catch (error) {
			console.error('❌ Failed to bulk upload teachers:', error);
			alert('❌ Failed to bulk upload teachers: ' + (error?.response?.data?.error || error.message));
		} finally {
			setTeachersLoading(false);
		}
	};

	// Handle teacher export
	const handleExportTeachers = async (format = 'json') => {
		try {
			setTeachersLoading(true);
			await exportTeachersData(format);
			alert('✅ Teachers data exported successfully!');
		} catch (error) {
			console.error('❌ Failed to export teachers data:', error);
			alert('❌ Failed to export teachers data: ' + (error?.response?.data?.error || error.message));
		} finally {
			setTeachersLoading(false);
		}
	};

	// Handle teacher file change
	const handleTeacherFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			// Validate file type
			const validTypes = [
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
				'application/vnd.ms-excel', // .xls
				'text/csv' // .csv
			];
			
			if (validTypes.includes(file.type)) {
				setTeacherBulkUploadFile(file);
				console.log('✅ Teacher file selected:', file.name);
			} else {
				alert('❌ Please select a valid Excel or CSV file');
				event.target.value = '';
			}
		}
	};

	// Dedicated Teacher API Testing Function
	const testTeacherEndpoints = async () => {
		try {
			setTeachersLoading(true);
			console.log('🔍 Starting comprehensive teacher API tests...');

			// Test 1: Connection Test
			console.log('Test 1: Testing Teachers API connection...');
			const connectionResult = await testTeachersConnection();
			console.log('✅ Connection test result:', connectionResult);

			// Test 2: Create Teacher Test
			console.log('Test 2: Testing teacher creation endpoint...');
			const createResult = await testCreateTeacherEndpoint();
			console.log('✅ Create teacher test result:', createResult);

			// Test 3: Get Teachers Test
			console.log('Test 3: Testing get teachers endpoint...');
			try {
				const teachers = await getAllTeachers({ page: 1, page_size: 5 });
				console.log('✅ Get teachers test passed. Found:', teachers.length || teachers.results?.length || 0, 'teachers');
			} catch (error) {
				console.error('❌ Get teachers test failed:', error);
			}

			// Test 4: Teacher Stats Test
			console.log('Test 4: Testing teacher statistics endpoint...');
			try {
				const stats = await getTeacherStats();
				console.log('✅ Teacher stats test passed. Total teachers:', stats.total);
			} catch (error) {
				console.error('❌ Teacher stats test failed:', error);
			}

			// Show comprehensive results
			const overallStatus = connectionResult.status === 'working' && createResult.status === 'working' ? 'working' : 
								connectionResult.status === 'working' ? 'partial' : 'failed';
			
			const message = `📊 Teacher API Test Results:\n\n` +
							`🔗 Connection: ${connectionResult.status} - ${connectionResult.message}\n` +
							`➕ Create Teacher: ${createResult.status} - ${createResult.message}\n` +
							`📈 Overall Status: ${overallStatus}\n\n` +
							`${overallStatus === 'working' ? '✅ All teacher endpoints are working correctly!' :
							  overallStatus === 'partial' ? '⚠️ Teacher endpoints partially working (read-only access)' :
							  '❌ Teacher endpoints are not accessible'}`;

			alert(message);
			
			// Update API status
			setApiStatus(prev => ({ ...prev, teachers: overallStatus }));

		} catch (error) {
			console.error('❌ Teacher API testing failed:', error);
			alert('❌ Teacher API testing failed: ' + error.message);
		} finally {
			setTeachersLoading(false);
		}
	};

	useEffect(() => {
		async function loadAdminDashboardData() {
			try {
				const [
					departments,
					subjects, 
					classrooms,
					classLevels,
					gradeLevels,
					classYears,
					streams,
					studentClasses,
					reasonsLeft,
					academicYears,
					terms,
					schoolEvents,
					periods,
					articles,
					carouselImages,
					teacherAttendance,
					studentAttendance,
					periodAttendance
				] = await Promise.all([
					AcademicService.getDepartments().catch((e) => { console.debug('Departments error', e?.response?.data || e.message); return []; }),
					AcademicService.getSubjects().catch((e) => { console.debug('Subjects error', e?.response?.data || e.message); return []; }),
					AcademicService.getClassrooms().catch((e) => { console.debug('Classrooms error', e?.response?.data || e.message); return []; }),
					AcademicService.getClassLevels().catch((e) => { console.debug('Class Levels error', e?.response?.data || e.message); return []; }),
					AcademicService.getGradeLevels().catch((e) => { console.debug('Grade Levels error', e?.response?.data || e.message); return []; }),
					AcademicService.getClassYears().catch((e) => { console.debug('Class Years error', e?.response?.data || e.message); return []; }),
					AcademicService.getStreams().catch((e) => { console.debug('Streams error', e?.response?.data || e.message); return []; }),
					AcademicService.getStudentClasses().catch((e) => { console.debug('Student Classes error', e?.response?.data || e.message); return []; }),
					AcademicService.getReasonsLeft().catch((e) => { console.debug('Reasons Left error', e?.response?.data || e.message); return []; }),
					getAcademicYears().catch((e) => { console.debug('Academic Years error', e?.response?.data || e.message); return []; }),
					getTerms().catch((e) => { console.debug('Terms error', e?.response?.data || e.message); return []; }),
					getSchoolEvents().catch((e) => { console.debug('School Events error', e?.response?.data || e.message); return []; }),
					getPeriods().catch((e) => { console.debug('Periods error', e?.response?.data || e.message); return []; }),
					BlogService.getArticlesCount().catch((e) => { console.debug('Articles count error', e?.response?.data || e.message); return 0; }),
					BlogService.getCarouselImagesCount().catch((e) => { console.debug('Carousel images count error', e?.response?.data || e.message); return 0; }),
					getTeacherAttendance().catch((e) => { console.debug('Teacher Attendance error', e?.response?.data || e.message); return []; }),
					getStudentAttendance().catch((e) => { console.debug('Student Attendance error', e?.response?.data || e.message); return []; }),
					getPeriodAttendance().catch((e) => { console.debug('Period Attendance error', e?.response?.data || e.message); return []; }),
				]);

				// Fetch admin profile
				try {
					const profile = await getProfile();
					setAdminProfile(profile);
				} catch (profileError) {
					console.debug('Profile error, using stored data:', profileError);
					const storedUser = getCurrentUser();
					if (storedUser) {
						setAdminProfile(storedUser);
					}
				}

				// Load applications data
				await loadApplicationsData();
				
				// Load timetable statistics
				await loadTimetableStats();
				
				// Load student statistics
				await loadStudentStats();
				
				// Load teacher statistics
				await loadTeacherStats();
				
				console.log('[Admin Dashboard] All academic, administration, and period data loaded', { 
					departments, subjects, classrooms, classLevels, gradeLevels, 
					classYears, streams, studentClasses, reasonsLeft,
					academicYears, terms, schoolEvents, periods
				});
				
				setCounts({
					departments: Array.isArray(departments) ? departments.length : 0,
					subjects: Array.isArray(subjects) ? subjects.length : 0,
					classrooms: Array.isArray(classrooms) ? classrooms.length : 0,
					classLevels: Array.isArray(classLevels) ? classLevels.length : 0,
					gradeLevels: Array.isArray(gradeLevels) ? gradeLevels.length : 0,
					classYears: Array.isArray(classYears) ? classYears.length : 0,
					streams: Array.isArray(streams) ? streams.length : 0,
					studentClasses: Array.isArray(studentClasses) ? studentClasses.length : 0,
					reasonsLeft: Array.isArray(reasonsLeft) ? reasonsLeft.length : 0,
					academicYears: Array.isArray(academicYears) ? academicYears.length : 0,
					terms: Array.isArray(terms) ? terms.length : 0,
					schoolEvents: Array.isArray(schoolEvents) ? schoolEvents.length : 0,
					periods: Array.isArray(periods) ? periods.length : 0,
					articles: articles,
					carouselImages: carouselImages,
					teacherAttendance: Array.isArray(teacherAttendance) ? teacherAttendance.length : 0,
					studentAttendance: Array.isArray(studentAttendance) ? studentAttendance.length : 0,
					periodAttendance: Array.isArray(periodAttendance) ? periodAttendance.length : 0,
				});
			} catch (err) {
				console.debug('Dashboard load error', err?.response?.data || err.message);
			}
		}
		loadAdminDashboardData();
	}, []);

	const cardBlog = [
		{title:'Departments', svg: SVGICON.department, number:String(counts.departments), change:'dept-data bg-primary'},
		{title:'Subjects', svg: SVGICON.course, number:String(counts.subjects), change:'course-data bg-info'},
		{title:'Academic Years', svg: SVGICON.academicYear, number:String(counts.academicYears), change:'academic-year-data bg-success'},
		{title:'Terms', svg: SVGICON.term, number:String(counts.terms), change:'term-data bg-warning'},
		{title:'School Events', svg: SVGICON.schoolEvent, number:String(counts.schoolEvents), change:'event-data bg-secondary'},
		{title:'Classrooms', svg: SVGICON.user, number:String(counts.classrooms), change:'classroom-data bg-dark'},
		{title:'Class Levels', svg: SVGICON.user2, number:String(counts.classLevels), change:'level-data bg-danger'},
		{title:'Student Classes', svg: SVGICON.user, number:String(counts.studentClasses), change:'student-class-data bg-light'},
		{title:'Periods', svg: SVGICON.course, number:String(counts.periods), change:'period-data bg-info'},
		{title:'Articles', svg: SVGICON.article, number:String(counts.articles), change:'article-data bg-success'},
		{title:'Carousel Images', svg: SVGICON.image, number:String(counts.carouselImages), change:'carousel-data bg-warning'},
		{title:'Teacher Attendance', svg: SVGICON.user, number:String(counts.teacherAttendance), change:'teacher-attendance-data bg-primary'},
		{title:'Student Attendance', svg: SVGICON.user, number:String(counts.studentAttendance), change:'student-attendance-data bg-info'},
		{title:'Period Attendance', svg: SVGICON.user, number:String(counts.periodAttendance), change:'period-attendance-data bg-success'},
	];

	return(
		<>
			{/* Authentication Status & Debug Information */}
			<div className="row">
				<div className="col-xl-12">
					<div className="card border-primary">
						<div className="card-header bg-primary text-white">
							<h4 className="heading mb-0">🔐 Authentication & System Status</h4>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-3">
									<h6>Authentication Status</h6>
									<p><strong>Status:</strong> 
										<span className={`badge ${authStatus.isAuthenticated ? 'bg-success' : 'bg-danger'}`}>
											{authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
										</span>
									</p>
									<p><strong>User Role:</strong> {authStatus.userRole || 'Unknown'}</p>
									<p><strong>Token Present:</strong> {authStatus.token ? 'Yes' : 'No'}</p>
									<p><strong>Last Login:</strong> {authStatus.lastLogin}</p>
								</div>
								<div className="col-md-3">
									<h6>API Endpoints Status</h6>
									<p><strong>Applications:</strong> 
										<span className={`badge ${apiStatus.applications === 'working' ? 'bg-success' : apiStatus.applications === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
											{apiStatus.applications}
										</span>
									</p>
									<p><strong>Users:</strong> 
										<span className={`badge ${apiStatus.users === 'working' ? 'bg-success' : apiStatus.users === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
											{apiStatus.users}
										</span>
									</p>
									<p><strong>Academic:</strong> 
										<span className={`badge ${apiStatus.academic === 'working' ? 'bg-success' : apiStatus.academic === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
											{apiStatus.academic}
										</span>
									</p>
									<p><strong>Timetable:</strong> 
										<span className={`badge ${apiStatus.timetable === 'working' ? 'bg-success' : apiStatus.timetable === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
											{apiStatus.timetable}
										</span>
									</p>
									<p><strong>SIS:</strong> 
										<span className={`badge ${apiStatus.sis === 'working' ? 'bg-success' : apiStatus.sis === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
											{apiStatus.sis}
										</span>
									</p>
								</div>
								<div className="col-md-3">
									<h6>Student Applications</h6>
									<p><strong>Total:</strong> {applicationsData.total}</p>
									<p><strong>Submitted:</strong> {applicationsData.submitted}</p>
									<p><strong>Under Review:</strong> {applicationsData.under_review}</p>
									<p><strong>Pending Action:</strong> {applicationsData.submitted + applicationsData.under_review}</p>
								</div>
								<div className="col-md-3">
									<h6>Quick Actions</h6>
									<div className="d-grid gap-2">
										<button className="btn btn-primary btn-sm" onClick={testAPIEndpoints}>
											<i className="fas fa-sync me-2"></i>Test APIs
										</button>
										<button className="btn btn-success btn-sm" onClick={loadApplicationsData}>
											<i className="fas fa-refresh me-2"></i>Refresh Apps
										</button>
										<a href="/admin/applications" className="btn btn-info btn-sm">
											<i className="fas fa-list me-2"></i>View All Apps
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Timetable Statistics & Management */}
			<div className="row">
				<div className="col-xl-12">
					<div className="card border-info">
						<div className="card-header bg-info text-white">
							<h4 className="heading mb-0">📅 Timetable Management & Statistics</h4>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-3">
									<h6>Timetable Overview</h6>
									<p><strong>Total Periods:</strong> {timetableStats.total}</p>
									<p><strong>By Day:</strong></p>
									<ul className="list-unstyled">
										{Object.entries(timetableStats.byDay).map(([day, count]) => (
											<li key={day}><small>{day}: {count} periods</small></li>
										))}
									</ul>
								</div>
								<div className="col-md-3">
									<h6>Teacher Distribution</h6>
									{Object.entries(timetableStats.byTeacher).slice(0, 5).map(([teacher, count]) => (
										<p key={teacher}><small><strong>{teacher}:</strong> {count} periods</small></p>
									))}
									{Object.keys(timetableStats.byTeacher).length > 5 && (
										<p><small className="text-muted">... and {Object.keys(timetableStats.byTeacher).length - 5} more</small></p>
									)}
								</div>
								<div className="col-md-3">
									<h6>Classroom Usage</h6>
									{Object.entries(timetableStats.byClassroom).slice(0, 5).map(([classroom, count]) => (
										<p key={classroom}><small><strong>{classroom}:</strong> {count} periods</small></p>
									))}
									{Object.keys(timetableStats.byClassroom).length > 5 && (
										<p><small className="text-muted">... and {Object.keys(timetableStats.byClassroom).length - 5} more</small></p>
									)}
								</div>
								<div className="col-md-3">
									<h6>Timetable Actions</h6>
									<div className="d-grid gap-2">
										<button 
											className="btn btn-warning btn-sm" 
											onClick={handleGenerateTimetable}
											disabled={timetableLoading}
										>
											{timetableLoading ? (
												<><i className="fas fa-spinner fa-spin me-2"></i>Generating...</>
											) : (
												<><i className="fas fa-magic me-2"></i>Generate Timetable</>
											)}
										</button>
										<button 
											className="btn btn-info btn-sm" 
											onClick={() => handleExportTimetable('json')}
											disabled={timetableLoading}
										>
											{timetableLoading ? (
												<><i className="fas fa-spinner fa-spin me-2"></i>Exporting...</>
											) : (
												<><i className="fas fa-download me-2"></i>Export Schedule</>
											)}
										</button>
										<button 
											className="btn btn-secondary btn-sm" 
											onClick={loadTimetableStats}
											disabled={timetableLoading}
										>
											<i className="fas fa-refresh me-2"></i>Refresh Stats
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* SIS - Student Information System */}
			<div className="row">
				<div className="col-xl-12">
					<div className="card border-success">
						<div className="card-header bg-success text-white">
							<h4 className="heading mb-0">👨‍🎓 Student Information System (SIS)</h4>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-3">
									<h6>Student Overview</h6>
									<p><strong>Total Students:</strong> {studentStats.total}</p>
									<p><strong>With Parents:</strong> {studentStats.withParents}</p>
									<p><strong>Without Parents:</strong> {studentStats.withoutParents}</p>
									<p><strong>With Siblings:</strong> {studentStats.withSiblings}</p>
									<p><strong>Without Siblings:</strong> {studentStats.withoutSiblings}</p>
								</div>
								<div className="col-md-3">
									<h6>Gender Distribution</h6>
									{Object.entries(studentStats.byGender).map(([gender, count]) => (
										<p key={gender}><small><strong>{gender}:</strong> {count} students</small></p>
									))}
								</div>
								<div className="col-md-3">
									<h6>Class Level Distribution</h6>
									{Object.entries(studentStats.byClassLevel).slice(0, 5).map(([level, count]) => (
										<p key={level}><small><strong>{level}:</strong> {count} students</small></p>
									))}
									{Object.keys(studentStats.byClassLevel).length > 5 && (
										<p><small className="text-muted">... and {Object.keys(studentStats.byClassLevel).length - 5} more</small></p>
									)}
								</div>
								<div className="col-md-3">
									<h6>SIS Actions</h6>
									<div className="d-grid gap-2">
										<button 
											className="btn btn-primary btn-sm" 
											onClick={testStudentEndpoints}
											disabled={sisLoading}
										>
											{sisLoading ? (
												<><i className="fas fa-spinner fa-spin me-2"></i>Testing...</>
											) : (
												<><i className="fas fa-vial me-2"></i>Test Student APIs</>
											)}
										</button>
										<button 
											className="btn btn-success btn-sm" 
											onClick={loadStudentStats}
											disabled={sisLoading}
										>
											{sisLoading ? (
												<><i className="fas fa-spinner fa-spin me-2"></i>Loading...</>
											) : (
												<><i className="fas fa-refresh me-2"></i>Refresh Stats</>
											)}
										</button>
										<button 
											className="btn btn-info btn-sm" 
											onClick={() => handleExportStudents('json')}
											disabled={sisLoading}
										>
											{sisLoading ? (
												<><i className="fas fa-spinner fa-spin me-2"></i>Exporting...</>
											) : (
												<><i className="fas fa-download me-2"></i>Export Students</>
											)}
										</button>
										<a 
											href="/student" 
											className="btn btn-warning btn-sm"
										>
											<i className="fas fa-users me-2"></i>Manage Students
										</a>
										<a 
											href="/add-student" 
											className="btn btn-secondary btn-sm"
										>
											<i className="fas fa-user-plus me-2"></i>Add New Student
										</a>
									</div>
								</div>
							</div>
							
							{/* Bulk Upload Section */}
							<div className="row mt-4">
								<div className="col-12">
									<h6>📤 Bulk Upload Students</h6>
									<div className="row">
										<div className="col-md-6">
											<div className="input-group">
												<input
													type="file"
													className="form-control"
													accept=".xlsx,.xls,.csv"
													onChange={handleFileChange}
													disabled={sisLoading}
												/>
												<button 
													className="btn btn-warning" 
													onClick={handleBulkUploadStudents}
													disabled={!bulkUploadFile || sisLoading}
												>
													{sisLoading ? (
														<><i className="fas fa-spinner fa-spin me-2"></i>Uploading...</>
													) : (
														<><i className="fas fa-upload me-2"></i>Upload</>
													)}
												</button>
											</div>
											<small className="text-muted">
												Supported formats: Excel (.xlsx, .xls), CSV (.csv)
											</small>
										</div>
										<div className="col-md-6">
											{bulkUploadFile && (
												<div className="alert alert-info">
													<strong>File selected:</strong> {bulkUploadFile.name}
													<br />
													<small>Size: {(bulkUploadFile.size / 1024).toFixed(2)} KB</small>
												</div>
											)}
										</div>
									</div>
									
									{/* Bulk Upload Results */}
									{bulkUploadResult && (
										<div className="mt-3">
											<h6>📊 Upload Results</h6>
											<div className="row">
												<div className="col-md-3">
													<div className="text-center">
														<h4 className="text-success">{bulkUploadResult.message?.split(' ')[0] || '0'}</h4>
														<p className="mb-0">Students Uploaded</p>
													</div>
												</div>
												<div className="col-md-3">
													<div className="text-center">
														<h4 className="text-info">{bulkUploadResult.updated_students?.length || 0}</h4>
														<p className="mb-0">Updated</p>
													</div>
												</div>
												<div className="col-md-3">
													<div className="text-center">
														<h4 className="text-warning">{bulkUploadResult.skipped_students?.length || 0}</h4>
														<p className="mb-0">Skipped</p>
													</div>
												</div>
												<div className="col-md-3">
													<div className="text-center">
														<h4 className="text-danger">{bulkUploadResult.not_created?.length || 0}</h4>
														<p className="mb-0">Failed</p>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Student Applications Overview */}
			<div className="row">
				<div className="col-xl-12">
					<div className="card border-success">
						<div className="card-header bg-success text-white">
							<h4 className="heading mb-0">📚 Student Applications Overview</h4>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-primary">{applicationsData.total}</h3>
										<p className="mb-0">Total Applications</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-warning">{applicationsData.draft}</h3>
										<p className="mb-0">Draft</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-info">{applicationsData.submitted}</h3>
										<p className="mb-0">Submitted</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-secondary">{applicationsData.under_review}</h3>
										<p className="mb-0">Under Review</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-success">{applicationsData.approved}</h3>
										<p className="mb-0">Approved</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-danger">{applicationsData.rejected}</h3>
										<p className="mb-0">Rejected</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Applications */}
			{recentApplications.length > 0 && (
				<div className="row">
					<div className="col-xl-12">
						<div className="card border-info">
							<div className="card-header bg-info text-white">
								<h4 className="heading mb-0">🆕 Recent Applications</h4>
							</div>
							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-hover">
										<thead>
											<tr>
												<th>Application ID</th>
												<th>Student Name</th>
												<th>Program</th>
												<th>Status</th>
												<th>Submitted</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{recentApplications.map((app) => (
												<tr key={app.id}>
													<td>{app.application_id}</td>
													<td>{app.full_name}</td>
													<td>{app.program_name}</td>
													<td>
														<span className={`badge ${
															app.status === 'approved' ? 'bg-success' :
															app.status === 'rejected' ? 'bg-danger' :
															app.status === 'under_review' ? 'bg-warning' :
															app.status === 'submitted' ? 'bg-info' :
															'bg-secondary'
														}`}>
															{app.status.replace('_', ' ')}
														</span>
													</td>
													<td>{new Date(app.created_at).toLocaleDateString()}</td>
													<td>
														<div className="btn-group btn-group-sm">
															{app.status === 'submitted' && (
																<>
																	<button 
																		className="btn btn-success btn-sm"
																		onClick={() => updateApplicationStatus(app.id, 'under_review', 'Application moved to review')}
																	>
																		<i className="fas fa-eye"></i>
																	</button>
																	<button 
																		className="btn btn-warning btn-sm"
																		onClick={() => updateApplicationStatus(app.id, 'waitlisted', 'Application waitlisted')}
																	>
																		<i className="fas fa-clock"></i>
																	</button>
																</>
															)}
															{app.status === 'under_review' && (
																<>
																	<button 
																		className="btn btn-success btn-sm"
																		onClick={() => updateApplicationStatus(app.id, 'approved', 'Application approved')}
																	>
																		<i className="fas fa-check"></i>
																	</button>
																	<button 
																		className="btn btn-danger btn-sm"
																		onClick={() => updateApplicationStatus(app.id, 'rejected', 'Application rejected')}
																	>
																		<i className="fas fa-times"></i>
																	</button>
																</>
															)}
															<a href={`/admin/applications/${app.id}`} className="btn btn-info btn-sm">
																<i className="fas fa-eye"></i>
															</a>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-body pb-xl-4 pb-sm-3 pb-0">	
							<div className="row">
								{cardBlog.map((item, ind)=>(
									<div className="col-xl-3 col-6" key={ind}>
										<div className="content-box">
											<div className={`icon-box icon-box-xl ${item.change}`}>
												{item.svg}
											</div>
											<div  className="chart-num">
												<p>{item.title}</p>
												<h2 className="font-w700 mb-0">{item.number}</h2>
											</div>
										</div>
									</div>
								))}								
							</div>	
						</div>
					</div>
				</div>
			</div>	
			<div className="row">
				<div className="col-xl-6 ">
					<div className="card crypto-chart ">
						<div className="card-header pb-0 border-0 flex-wrap">
							<div className="mb-2 mb-sm-0">
								<div className="chart-title mb-3">
									<h2 className="heading">School Performance</h2>	
								</div>
							</div>
							<div className="p-static">
								<div className="d-flex align-items-center mb-3 mb-sm-0">
									<div className="round weekly" id="dzOldSeries">
										<div>
											<input type="checkbox" id="checkbox1" name="radio" value="weekly" />
											<label htmlFor="checkbox1" className="checkmark"></label>
										</div>
										<div>
											<span className="fs-14">This Week</span>
											<h4 className="fs-5 font-w700 mb-0">1.245</h4>
										</div>
									</div>
									<div className="round" id="dzNewSeries">
										<div>
											<input type="checkbox" id="checkbox" name="radio" value="monthly" />
											<label htmlFor="checkbox" className="checkmark"></label>
										</div>
										<div>
											<span className="fs-14">Last Week</span>
											<h4 className="fs-5 font-w700 mb-0">1.356</h4>
										</div>	
									</div>
								</div>
							</div>
						</div>
						<div className="card-body pt-2 custome-tooltip pb-0 px-2">
							<SchoolPerformance />
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="card h-auto">
						<SchoolOverView />
					</div>
				</div>
			</div>

			{/* Teacher Management Section */}
			<div className="row">
				<div className="col-xl-12">
					<div className="card border-warning">
						<div className="card-header bg-warning text-dark">
							<h4 className="heading mb-0">👨‍🏫 Teacher Management System</h4>
						</div>
						<div className="card-body">
							{/* Teacher Statistics */}
							<div className="row mb-4">
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-primary">{teacherStats.total}</h3>
										<p className="mb-0">Total Teachers</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-success">{teacherStats.byGender.Male || 0}</h3>
										<p className="mb-0">Male Teachers</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-info">{teacherStats.byGender.Female || 0}</h3>
										<p className="mb-0">Female Teachers</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-warning">{teacherStats.withSubjects}</h3>
										<p className="mb-0">With Subjects</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-secondary">{teacherStats.bySalary.average.toLocaleString()}</h3>
										<p className="mb-0">Avg Salary</p>
									</div>
								</div>
								<div className="col-md-2">
									<div className="text-center">
										<h3 className="text-danger">{teacherStats.bySalary.highest.toLocaleString()}</h3>
										<p className="mb-0">Highest Salary</p>
									</div>
								</div>
							</div>

							{/* Teacher Actions */}
							<div className="row">
								<div className="col-md-6">
									<h6>🔧 Teacher Actions</h6>
									<div className="d-flex gap-2 flex-wrap mb-3">
										<button 
											className="btn btn-primary btn-sm"
											onClick={testTeacherEndpoints}
											disabled={teachersLoading}
										>
											{teachersLoading ? (
												<><i className="fas fa-spinner fa-spin me-2"></i>Testing...</>
											) : (
												<><i className="fas fa-vial me-2"></i>Test Teacher APIs</>
											)}
										</button>
										<button 
											className="btn btn-success btn-sm"
											onClick={() => handleExportTeachers('json')}
											disabled={teachersLoading}
										>
											<i className="fas fa-download me-2"></i>Export JSON
										</button>
										<button 
											className="btn btn-info btn-sm"
											onClick={() => handleExportTeachers('csv')}
											disabled={teachersLoading}
										>
											<i className="fas fa-file-csv me-2"></i>Export CSV
										</button>
									</div>
									<div className="d-flex gap-2 flex-wrap">
										<a 
											href="/teachers" 
											className="btn btn-outline-primary btn-sm"
										>
											<i className="fas fa-list me-2"></i>Manage Teachers
										</a>
										<a 
											href="/teachers/add" 
											className="btn btn-outline-success btn-sm"
										>
											<i className="fas fa-user-plus me-2"></i>Add New Teacher
										</a>
									</div>
								</div>
							</div>
							
							{/* Teacher Bulk Upload Section */}
							<div className="row mt-4">
								<div className="col-12">
									<h6>📤 Bulk Upload Teachers</h6>
									<div className="row">
										<div className="col-md-6">
											<div className="input-group">
												<input
													type="file"
													className="form-control"
													accept=".xlsx,.xls,.csv"
													onChange={handleTeacherFileChange}
													disabled={teachersLoading}
												/>
												<button 
													className="btn btn-warning" 
													onClick={handleTeacherBulkUpload}
													disabled={!teacherBulkUploadFile || teachersLoading}
												>
													{teachersLoading ? (
														<><i className="fas fa-spinner fa-spin me-2"></i>Uploading...</>
													) : (
														<><i className="fas fa-upload me-2"></i>Upload</>
													)}
												</button>
											</div>
											<small className="text-muted">
												Supported formats: Excel (.xlsx, .xls), CSV (.csv)
											</small>
										</div>
										<div className="col-md-6">
											{teacherBulkUploadFile && (
												<div className="alert alert-info">
													<strong>File selected:</strong> {teacherBulkUploadFile.name}
													<br />
													<small>Size: {(teacherBulkUploadFile.size / 1024).toFixed(2)} KB</small>
												</div>
											)}
										</div>
									</div>
									
									{/* Teacher Bulk Upload Results */}
									{teacherBulkUploadResult && (
										<div className="mt-3">
											<h6>📊 Upload Results</h6>
											<div className="row">
												<div className="col-md-3">
													<div className="text-center">
														<h4 className="text-success">{teacherBulkUploadResult.message?.split(' ')[0] || '0'}</h4>
														<p className="mb-0">Teachers Uploaded</p>
													</div>
												</div>
												<div className="col-md-3">
													<div className="text-center">
														<h4 className="text-info">{teacherBulkUploadResult.updated_teachers?.length || 0}</h4>
														<p className="mb-0">Updated</p>
													</div>
												</div>
												<div className="col-md-3">
													<div className="text-center">
														<h4 className="text-warning">{teacherBulkUploadResult.skipped_teachers?.length || 0}</h4>
														<p className="mb-0">Skipped</p>
													</div>
												</div>
												<div className="col-md-3">
													<div className="text-center">
														<h4 className="text-danger">{teacherBulkUploadResult.not_created?.length || 0}</h4>
														<p className="mb-0">Failed</p>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Debug Information Section */}
			<div className="row">
				<div className="col-xl-12">
					<div className="card border-info">
						<div className="card-header bg-info text-white">
							<h4 className="heading mb-0">🔍 Blog & System Debug Information</h4>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-3">
									<h6>Blog Status</h6>
									<p><strong>Articles:</strong> {counts.articles}</p>
									<p><strong>Carousel Images:</strong> {counts.carouselImages}</p>
									<p><strong>Total Blog Items:</strong> {counts.articles + counts.carouselImages}</p>
								</div>
								<div className="col-md-3">
									<h6>Academic Status</h6>
									<p><strong>Departments:</strong> {counts.departments}</p>
									<p><strong>Subjects:</strong> {counts.subjects}</p>
									<p><strong>Classrooms:</strong> {counts.classrooms}</p>
								</div>
								<div className="col-md-3">
									<h6>Administration Status</h6>
									<p><strong>Academic Years:</strong> {counts.academicYears}</p>
									<p><strong>Terms:</strong> {counts.terms}</p>
									<p><strong>School Events:</strong> {counts.schoolEvents}</p>
								</div>
								<div className="col-md-3">
									<h6>Attendance Status</h6>
									<p><strong>Teacher Attendance:</strong> {counts.teacherAttendance}</p>
									<p><strong>Student Attendance:</strong> {counts.studentAttendance}</p>
									<p><strong>Period Attendance:</strong> {counts.periodAttendance}</p>
								</div>
							</div>
							<div className="mt-3">
								<h6>Quick Actions</h6>
								<div className="d-flex gap-2 flex-wrap">
									<a href="/blog/articles" className="btn btn-primary btn-sm">
										<i className="fas fa-edit me-2"></i>Manage Articles
									</a>
									<a href="/blog/carousel-images" className="btn btn-success btn-sm">
										<i className="fas fa-images me-2"></i>Manage Carousel
									</a>
									<button className="btn btn-info btn-sm" onClick={() => window.location.reload()}>
										<i className="fas fa-sync me-2"></i>Refresh Dashboard
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-body">
							<Calendar />
						</div>
					</div>
				</div>
			</div>

			<div className="col-xl-12">
				<div className="card">
					<div className="card-header border-0 p-3">
						<h4 className="heading mb-0">Unpaid Student Intuition</h4>
					</div>
					<div className="card-body p-0">
						<UnpaidStudentTable />
					</div>
				</div>	
			</div>	
		</>
	)
}
export default Home;