export const StudentMenuList = [
    // Student Dashboard
    {
        title: 'Dashboard',
        to: '/student-dashboard',
        iconStyle: <i className="material-symbols-outlined">dashboard</i>,
    },
    // Applications
    {
        title: 'Applications',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">description</i>,
        content: [
            { title: 'My Applications', to: '/student/applications' },
            { title: 'Apply for Program', to: '/student/application/new' },
            { title: 'Application Status', to: '/student/application-status' },
        ],
    },
    // Academic Records
    {
        title: 'Academics', 
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">school</i>,
        content: [
            { title: 'Grades & Transcripts', to: '/student/grades' },
            { title: 'Course Schedule', to: '/student/schedule' },
            { title: 'Assignments', to: '/student/assignments' },
        ],
    },
    // Financial Information
    {
        title: 'Finance',
        classsChange: 'mm-collapse', 
        iconStyle: <i className="material-symbols-outlined">account_balance_wallet</i>,
        content: [
            { title: 'Fee Statement', to: '/student/fees' },
            { title: 'Payment History', to: '/student/payment-history' },
            { title: 'Outstanding Balance', to: '/student/balance' },
        ],
    },
    // Student Services
    {
        title: 'Services',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">support_agent</i>,
        content: [
            { title: 'Library Services', to: '/student/library' },
            { title: 'Student Support', to: '/student/support' },
            { title: 'Events & News', to: '/student/events' },
        ],
    },
    // Profile & Settings
    {
        title: 'Profile',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">person</i>,
        content: [
            { title: 'My Profile', to: '/student/profile' },
            { title: 'Settings', to: '/student/settings' },
            { title: 'Change Password', to: '/student/change-password' },
        ],
    },
];
