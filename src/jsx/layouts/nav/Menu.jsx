export const MenuList = [
    //Dashboard
    {
        title: 'Dashboard',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">home</i>,
        content: [
            {
                title: 'Dashboard Light',
                to: 'dashboard',					
            },
            {
                title: 'Dashboard Dark',
                to: 'dashboard-dark',
            },

           
        ],
    },
    {
        title: 'Student',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">school</i>,
        content: [
            {
                title: 'Student',
                to: 'student',					
            },
        ],
    },
    {
        title: 'Blog',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">article</i>,
        content: [
            {
                title: 'Articles',
                to: 'blog/articles',					
            },
            {
                title: 'Carousel Images',
                to: 'blog/carousel-images',					
            },
        ],
    },
    {
        title:'Users Management',
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">people</i>,
        content: [
            {
                title: 'All Users',
                to: 'users/all-users',					
            },
            {
                title: 'Create User',
                to: 'users/create-user',					
            },
            {
                title: 'Teachers',
                to: 'users/teachers',					
            },
            {
                title: 'Add Teacher',
                to: 'users/add-teacher',					
            },
            {
                title: 'Bulk Upload Teachers',
                to: 'users/bulk-upload-teachers',					
            },
            {
                title: 'Accountants',
                to: 'users/accountants',					
            },
            {
                title: 'Add Accountant',
                to: 'users/add-accountant',					
            },
            {
                title: 'Admins',
                to: 'users/admins',					
            },
        ],
    },
    {
        title:'Department',
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">business</i>,
        content: [
            { title: 'Department List', to: 'academic/departments' },
            { title: 'Class Levels', to: 'academic/class-levels' },
            { title: 'Grade Levels', to: 'academic/grade-levels' },
            { title: 'Class Years', to: 'academic/class-years' },
            { title: 'Reasons Left', to: 'academic/reasons-left' },
            { title: 'Streams', to: 'academic/streams' },
            {
                title: 'Courses',
                classsChange: 'mm-collapse',
                content: [
                    { title: 'Subjects', to: 'academic/subjects' },
                    { title: 'Classrooms', to: 'academic/classrooms' },
                    { title: 'Student Classes', to: 'academic/student-classes' },
                    { title: 'Bulk Upload Subjects', to: 'academic/subjects/bulk-upload' },
                    { title: 'Bulk Upload Classrooms', to: 'academic/classrooms/bulk-upload' },
                    { title: 'Bulk Upload Student Classes', to: 'academic/student-classes/bulk-upload' },
                ],
            },
        ],
    },
    {
        title:'Administration',
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">admin_panel_settings</i>,
        content: [
            { title: 'Academic Years', to: 'administration/academic-years' },
            { title: 'Terms', to: 'administration/terms' },
            { title: 'School Events', to: 'administration/school-events' },
        ],
    },
    {
        title:'Attendance',
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">schedule</i>,
        content: [
            { title: 'Teacher Attendance', to: 'attendance/teacher-attendance' },
            { title: 'Student Attendance', to: 'attendance/student-attendance' },
            { title: 'Period Attendance', to: 'attendance/period-attendance' },
        ],
    },
    {
        title: 'File Manager',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-icons">folder</i>	,
        content: [
            {
                title: 'File Manager',
                to: 'file-manager',					
            },
            {
                title: 'User',
                to: 'user',
            },
            {
                title: 'Calendar',
                to: 'calendar',
            },            
            {
                title: 'Chat',
                to: 'chat',
            },
            {
                title: 'Activity',
                to: 'activity',
            },
        ],
    },        
    //Applications
    {
        title:'Applications',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">assignment</i>,
        content : [
            { title:'Programs', to: 'applications/programs' },
            { title:'My Applications', to: 'applications/my-applications' },
            { title:'Statistics', to: 'applications/statistics' },
            { title:'Admin Applications', to: 'applications/admin/applications' },
        ]
    },
    
]