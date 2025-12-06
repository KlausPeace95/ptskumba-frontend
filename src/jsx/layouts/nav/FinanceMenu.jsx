export const FinanceMenuList = [
    // Finance Dashboard
    {
        title: 'Finance Dashboard',
        to: '/accountant-dashboard',
        iconStyle: <i className="material-symbols-outlined">dashboard</i>,
    },
    // Receipts Management
    {
        title: 'Receipts',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">receipt</i>,
        content: [
            { title: 'All Receipts', to: 'finance/receipts' },
            { title: 'Bulk Upload', to: 'finance/receipts/bulk-upload' },
        ],
    },
    // Payments Management
    {
        title: 'Payments', 
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">payments</i>,
        content: [
            { title: 'All Payments', to: 'finance/payments' },
        ],
    },
    // Allocation Types
    {
        title: 'Allocations',
        classsChange: 'mm-collapse', 
        iconStyle: <i className="material-symbols-outlined">category</i>,
        content: [
            { title: 'Payment Allocations', to: 'finance/payment-allocations' },
            { title: 'Receipt Allocations', to: 'finance/receipt-allocations' },
        ],
    },
    // Debt Management
    {
        title: 'Debt Management',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">warning</i>,
        content: [
            { title: 'Debt Records', to: 'finance/debts' },
            { title: 'Student Debt Overview', to: 'finance/student-debt-overview' },
        ],
    },
];
