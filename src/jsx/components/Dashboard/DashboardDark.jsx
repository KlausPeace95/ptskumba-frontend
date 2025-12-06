import React,{useState, useContext, useEffect} from 'react';
import  DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

//Import Components
import { ThemeContext } from "../../../context/ThemeContext";
import { SVGICON } from './Content';
import { TeacherDetails } from './Elements/TeacherDetails';
import { UnpaidStudentTable } from './Elements/UnpaidStudentTable';
import StudentsService from '../../../services/StudentsService';
import { BlogService } from '../../../services/BlogService';
import { AcademicService } from '../../../services/AcademicService';


const SchoolPerformance = loadable(() =>
 	pMinDelay(import("./Elements/SchoolPerformance"), 500)
);
const SchoolOverView = loadable(() =>
 	pMinDelay(import("./Elements/SchoolOverView"), 1000)
);


const DashboardDark = () => {
	const { changeBackground } = useContext(ThemeContext);
	const [startDate, setStartDate] = useState(null);
	const [counts, setCounts] = useState({
		students: 0,
		teachers: 0,
		events: 0,
		departments: 0,
		courses: 0,
		articles: 0,
		carouselImages: 0,
	});

	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });
	}, []);

	// Load real data from backend
	useEffect(() => {
		const loadDashboardData = async () => {
			try {
				// Load students count
				const studentsCount = await StudentsService.getStudentsCount();
				// Load blog counts
				const articlesCount = await BlogService.getArticlesCount();
				const carouselImagesCount = await BlogService.getCarouselImagesCount();
				// Load academic counts
				const departmentsCount = await AcademicService.getDepartments();
				const classLevelsCount = await AcademicService.getClassLevels();
				
				setCounts(prev => ({ 
					...prev, 
					students: studentsCount,
					articles: articlesCount,
					carouselImages: carouselImagesCount,
					departments: Array.isArray(departmentsCount) ? departmentsCount.length : 0,
					courses: Array.isArray(classLevelsCount) ? classLevelsCount.length : 0
				}));
			} catch (error) {
				console.error('Error loading dashboard data:', error);
			}
		};

		loadDashboardData();
	}, []);

	const cardBlog = [
		{title:'Students', svg: SVGICON.user, number: counts.students.toLocaleString(), change:'std-data'},
		{title:'Teachers', svg: SVGICON.user2, number: counts.teachers.toLocaleString(), change:'teach-data'},
		{title:'Events', svg: SVGICON.event, number: counts.events.toLocaleString(), change:'event-data'},
		{title:'Departments', svg: SVGICON.department, number: counts.departments.toLocaleString(), change:'dept-data bg-dark'},
		{title:'Courses', svg: SVGICON.course, number: counts.courses.toLocaleString(), change:'course-data bg-info'},
		{title:'Articles', svg: SVGICON.article, number: counts.articles.toLocaleString(), change:'article-data bg-success'},
		{title:'Carousel Images', svg: SVGICON.image, number: counts.carouselImages.toLocaleString(), change:'carousel-data bg-warning'},
	];

	return(
		<>			
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
			<div className="row">
				<div className="col-xl-4 wow fadeInUp" data-wow-delay="1.5s">
					<div className="card">
						<div className="card-header pb-0 border-0 flex-wrap">
							<div>
								<div className="mb-3">
									<h2 className="heading mb-0">School Calendar</h2>	
								</div>
							</div>
						</div>
						<div className="card-body text-center event-calender dz-calender py-0 px-1">							
							<DatePicker
								selected={startDate}								
								onChange={(date) => setStartDate(date)}						
								inline
								fixedHeight
							/>
						</div>
					</div>
				</div>
				<div className="col-xl-8">
					<div className="card">
						<div className="card-header py-3 border-0 px-3">
							<h4 className="heading m-0">Teacher Deatails</h4>
						</div>
						<div className="card-body p-0">
							<TeacherDetails />
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
export default DashboardDark;