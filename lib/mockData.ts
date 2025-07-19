import type { User, Ticket, Task, Lead, Contact, SaleOrder, CalendarEvent, TimeOffRequest, Approval, TimesheetEntry, KnowledgeBaseArticle, Appraisal, Survey, ChatMessage, Role, Notification, Subscriber, Reseller } from '../types';
import { TicketStatus, TaskStatus, LeadStatus, LeadType, ContactType, SaleStatus, ApprovalStatus, ApprovalType, Permission, SubscriberStatus, ProblemType } from '../types';

// --- MOCK DATA ---
export const initialResellers: Reseller[] = [
    {id: 1, name: 'MMN_Ame_Dis@601_609'},
    {id: 2, name: 'Bawshar_Reseller_1'},
    {id: 3, name: 'Al-Hail_Reseller_A'},
];

export const initialSubscribers: Subscriber[] = [
    {
        _id: 'sub1',
        id: 1,
        name: 'Abdullah Al-Farsi',
        username: '96415719170',
        password: 'password123',
        balance: 0,
        owner: 'MMN_Ame_Dis@601_609',
        resellerId: 1,
        profile: 'Spark',
        expirationDate: '2025-07-18T11:18:02Z',
        debtDays: 0,
        incorrectPinTries: 0,
        status: SubscriberStatus.INACTIVE,
        lastSeenOnline: '2025-07-18T19:40:11Z',
        remainingDownload: 0,
        remainingUpload: 0,
        remainingTraffic: 0,
        remainingUptime: 0,
        totalPurchases: 12,
        createdOn: '2023-07-01T19:04:03Z',
        createdBy: 'admin',
    },
    {
        _id: 'sub2',
        id: 2,
        name: 'Hassan Al-Riyami',
        username: '96411223344',
        password: 'password456',
        balance: 15.500,
        owner: 'Bawshar_Reseller_1',
        resellerId: 2,
        profile: 'Nitro',
        expirationDate: '2024-11-20T23:59:59Z',
        debtDays: 0,
        incorrectPinTries: 0,
        status: SubscriberStatus.ACTIVE,
        lastSeenOnline: new Date().toISOString(),
        remainingDownload: 512,
        remainingUpload: 512,
        remainingTraffic: 1024,
        remainingUptime: 2592000,
        totalPurchases: 25,
        createdOn: '2022-01-15T10:00:00Z',
        createdBy: 'admin',
    },
     {
        _id: 'sub3',
        id: 3,
        name: 'Zainab Al-Hinai',
        username: '96499887766',
        password: 'password789',
        balance: -5.000,
        owner: 'Al-Hail_Reseller_A',
        resellerId: 3,
        profile: 'Basic',
        expirationDate: '2024-05-01T00:00:00Z',
        debtDays: 15,
        incorrectPinTries: 1,
        status: SubscriberStatus.EXPIRED,
        lastSeenOnline: '2024-05-01T01:10:00Z',
        remainingDownload: 0,
        remainingUpload: 0,
        remainingTraffic: 0,
        remainingUptime: 0,
        totalPurchases: 5,
        createdOn: '2023-11-01T12:00:00Z',
        createdBy: 'fatima@example.com',
    }
];


export const initialRoles: Role[] = [
  {
    _id: 'role1', id: 1, name: 'roles.1', permissions: Object.values(Permission)
  },
  {
    _id: 'role2', id: 2, name: 'roles.2', permissions: [
      Permission.VIEW_DASHBOARD, Permission.VIEW_TICKETS_ALL, Permission.MANAGE_TICKETS, Permission.USE_TICKET_AI_SUMMARY,
      Permission.VIEW_SUBSCRIBERS, Permission.MANAGE_SUBSCRIBERS,
      Permission.VIEW_TASKS_OWN, Permission.VIEW_TASKS_ALL, Permission.VIEW_KNOWLEDGEBASE, Permission.MANAGE_KNOWLEDGEBASE,
      Permission.VIEW_DISCUSS, Permission.VIEW_CALENDAR, Permission.VIEW_CONTACTS, Permission.VIEW_LEADS,
      Permission.VIEW_TIME_OFF, Permission.MANAGE_TIME_OFF, Permission.VIEW_TIMESHEETS, Permission.MANAGE_TIMESHEETS
    ]
  },
  {
    _id: 'role3', id: 3, name: 'roles.3', permissions: [
      Permission.VIEW_DASHBOARD, Permission.VIEW_TICKETS_OWN, Permission.CREATE_TICKET, Permission.VIEW_KNOWLEDGEBASE
    ]
  },
  {
    _id: 'role4', id: 4, name: 'roles.4', permissions: [
      Permission.VIEW_DASHBOARD, Permission.VIEW_LEADS, Permission.MANAGE_LEADS,
      Permission.VIEW_SUBSCRIBERS, Permission.MANAGE_SUBSCRIBERS,
      Permission.VIEW_SALES, Permission.MANAGE_SALES, Permission.VIEW_CONTACTS, Permission.MANAGE_CONTACTS,
      Permission.VIEW_DISCUSS, Permission.VIEW_CALENDAR, Permission.VIEW_TASKS_ALL, Permission.MANAGE_TASKS
    ]
  },
  {
    _id: 'role5', id: 5, name: 'roles.5', permissions: [ // Reseller
      Permission.VIEW_DASHBOARD, Permission.VIEW_TICKETS_ALL, Permission.MANAGE_TICKETS,
      Permission.VIEW_USERS, Permission.MANAGE_RESELLER_EMPLOYEES,
      Permission.VIEW_SUBSCRIBERS, Permission.VIEW_KNOWLEDGEBASE,
      Permission.VIEW_DISCUSS, Permission.VIEW_CALENDAR
    ]
  },
  {
    _id: 'role6', id: 6, name: 'roles.6', permissions: [ // Reseller Employee
      Permission.VIEW_DASHBOARD, Permission.VIEW_TICKETS_OWN, Permission.MANAGE_TICKETS,
      Permission.VIEW_TASKS_OWN, Permission.VIEW_KNOWLEDGEBASE,
    ]
  }
];

export const initialUsers: User[] = [
  { _id: 'user1', id: '1', name: 'Ali Al-Ahmad', email: 'ali@example.com', role: 'role1', roleId: 1, avatar: 'https://i.pravatar.cc/150?u=1' },
  { _id: 'user2', id: '2', name: 'Fatima Al-Zahra', email: 'fatima@example.com', role: 'role2', roleId: 2, avatar: 'https://i.pravatar.cc/150?u=2' },
  { _id: 'user3', id: '3', name: 'Khalid Abdullah', email: 'khalid@example.com', role: 'role2', roleId: 2, avatar: 'https://i.pravatar.cc/150?u=3' },
  { _id: 'user4', id: '4', name: 'Sara Ibrahim', email: 'sara@example.com', role: 'role3', roleId: 3, avatar: 'https://i.pravatar.cc/150?u=4' },
  { _id: 'user5', id: '5', name: 'Mohammed Hassan', email: 'mohamed@example.com', role: 'role3', roleId: 3, avatar: 'https://i.pravatar.cc/150?u=5' },
  { _id: 'user6', id: '6', name: 'Noura Salem', email: 'noura@example.com', role: 'role4', roleId: 4, avatar: 'https://i.pravatar.cc/150?u=6' },
  { _id: 'user7', id: '7', name: 'Yasser Al-Amri (Reseller)', email: 'yasser@reseller.com', role: 'role5', roleId: 5, avatar: 'https://i.pravatar.cc/150?u=7', resellerId: 1 },
  { _id: 'user8', id: '8', name: 'Omar Said (Reseller Emp)', email: 'omar@reseller.com', role: 'role6', roleId: 6, avatar: 'https://i.pravatar.cc/150?u=8', resellerId: 1 },
];

export const initialTickets: Ticket[] = [
  { 
    _id: 'ticket101',
    id: 101, 
    title: 'Very slow internet speed', 
    descriptionParts: [{type: 'text', content: 'I am experiencing very slow internet during the evening, the speed does not exceed 1 Mbps.'}],
    problemType: ProblemType.SLOW_SPEED,
    status: TicketStatus.OPEN, 
    clientId: '4', 
    subscriberId: 2, 
    agentId: '2', 
    resellerId: 2, 
    createdAt: '2023-10-26T10:00:00Z', 
    updatedAt: '2023-10-28T11:00:00Z', 
    comments: [
      {author: 'Sara Ibrahim', text: 'The internet is very slow!', date: '2023-10-26T10:00:00Z'}, 
      {author: 'Fatima Al-Zahra', text: 'Hello, have you tried restarting the router?', date: '2023-10-26T11:00:00Z'}
    ],
    diagnosis: 'Signal strength is low in the customer\'s area.',
    actionTaken: 'A technician visit has been scheduled to check the external wiring.',
    result: 'Pending technician visit.'
  },
  { 
    _id: 'ticket102',
    id: 102, 
    title: 'Internet service outage', 
    descriptionParts: [{type: 'text', content: 'The internet has been down for 3 hours.'}], 
    problemType: ProblemType.NO_CONNECTION,
    status: TicketStatus.IN_PROGRESS, 
    clientId: '5', 
    subscriberId: 1, 
    agentId: '8', // Assigned to reseller employee
    resellerId: 1, 
    createdAt: '2023-10-27T14:00:00Z', 
    updatedAt: '2023-10-27T14:30:00Z', 
    comments: [
      {author: 'Yasser Al-Amri (Reseller)', text: 'Forwarding to my technician Omar.', date: '2023-10-27T14:30:00Z'}
    ]
  },
   { 
    _id: 'ticket103',
    id: 103, 
    title: 'Billing inquiry', 
    descriptionParts: [{type: 'text', content: 'I was overcharged on my last bill.'}], 
    problemType: ProblemType.BILLING_INQUIRY,
    status: TicketStatus.RESOLVED, 
    clientId: '4', 
    subscriberId: 3, 
    agentId: '2', 
    resellerId: 3, 
    createdAt: '2023-10-25T09:00:00Z', 
    updatedAt: '2023-10-25T15:00:00Z', 
    comments: [
      {author: 'Fatima Al-Zahra', text: 'The issue has been resolved and your account has been credited.', date: '2023-10-25T15:00:00Z'}
    ],
    result: 'Customer account credited with the difference.'
  }
];

export const initialTasks: Task[] = [
    { id: 201, title: 'Follow up with client Sara Ibrahim', description: 'Call client regarding ticket #101 resolution.', status: TaskStatus.TODO, assigneeId: '2', dueDate: '2023-10-30T00:00:00Z' },
    { id: 202, title: 'Check network switch in Al-Hail area', description: 'Physical inspection required for the outage reported in ticket #102.', status: TaskStatus.IN_PROGRESS, assigneeId: '8', dueDate: '2023-10-29T00:00:00Z' },
    { id: 203, title: 'Prepare monthly performance report', description: 'Generate and send the report for October.', status: TaskStatus.DONE, assigneeId: '1', dueDate: '2023-11-01T00:00:00Z' },
];

export const initialLeads: Lead[] = [
    { id: 301, status: LeadStatus.NEW, leadType: LeadType.NEW, customerType: "Residential", firstName: "Yusuf", secondName: "", thirdName: "", fourthName: "", familyName: "Al-Balushi", whatsappNumber: "99XXXXXX", phone1: "99XXXXXX", exchange: "Al-Khuwair", area: "Al-Khuwair South", dist: "33", street: "Knowledge Oasis", homeNumber: "123", dpNumber: "DP45", olt: 1, dpPort: 3, slot: 2, ssid: "OMAN-WIFI-YUSUF", customerDevices: 5, addedOnSite: false, nearestPoint: "Omanoil Station", sourceCompensation: 0, attachments: [], description: "Interested in the 100Mbps fiber plan.", createdAt: new Date().toISOString(), creatorId: '6' },
    { id: 302, status: LeadStatus.CONTACTED, leadType: LeadType.RETURN, customerType: "Business", firstName: "Aisha", secondName: "", thirdName: "", fourthName: "", familyName: "Al-Maamari", whatsappNumber: "98XXXXXX", phone1: "98XXXXXX", exchange: "Bawshar", area: "Ghubra", dist: "45", street: "Sultan Qaboos St", homeNumber: "Bldg 5, Floor 2", dpNumber: "DP102", olt: 2, dpPort: 1, slot: 5, ssid: "AISHA-CORP-WIFI", customerDevices: 15, addedOnSite: true, nearestPoint: "Aster Hospital", sourceCompensation: 10, attachments: [], description: "Previous customer, wants a quote for business internet.", createdAt: new Date().toISOString(), creatorId: '6' },
];

export const initialContacts: Contact[] = [
    {id: 401, name: 'Ahmed Al-Farsi', email: 'ahmed.farsi@email.com', phone: '91112222', company: 'Farsi Enterprises', type: ContactType.CUSTOMER},
    {id: 402, name: 'Global Tech Suppliers', email: 'sales@gts.com', phone: '24445555', company: 'Global Tech Suppliers', type: ContactType.VENDOR},
];

export const initialSales: SaleOrder[] = [
    {id: 501, contactId: 401, orderDate: '2023-10-20T00:00:00Z', status: SaleStatus.INVOICED, amount: 35.500, orderNumber: 'SO00123'},
];

export const initialEvents: CalendarEvent[] = [
    {id: 601, title: 'Team Meeting', start: new Date().toISOString(), end: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(), allDay: false, userId: '1'}
];

export const initialTimeOffRequests: TimeOffRequest[] = [
    { id: 701, employeeId: '2', startDate: '2023-11-15', endDate: '2023-11-18', reason: 'Annual Leave', status: ApprovalStatus.PENDING },
    { id: 702, employeeId: '3', startDate: '2023-10-20', endDate: '2023-10-20', reason: 'Sick Leave', status: ApprovalStatus.APPROVED },
];

export const initialApprovals: Approval[] = [
    { id: 801, requesterId: '2', requestType: ApprovalType.TIME_OFF, requestId: 701, details: 'Annual Leave', status: ApprovalStatus.PENDING, createdAt: '2023-10-25T00:00:00Z' },
];

export const initialTimesheets: TimesheetEntry[] = [
    { id: 901, userId: '2', date: '2023-10-28', hours: 8, description: 'Handled customer tickets and follow-ups.'}
];

export const initialArticles: KnowledgeBaseArticle[] = [
    { id: 1001, title: 'How to restart your router', content: '1. Unplug the power cable.\n2. Wait for 30 seconds.\n3. Plug it back in.', authorId: '1', createdAt: '2023-10-01T00:00:00Z' }
];

export const initialAppraisals: Appraisal[] = [
    {id: 1101, employeeId: '2', reviewerId: '1', appraisalDate: '2023-09-30', rating: 5, comments: 'Excellent performance and great customer feedback.'}
];

export const initialSurveys: Survey[] = [
    {id: 1201, title: 'Customer Satisfaction Survey 2023 Q3', description: 'Survey to measure customer satisfaction.', creatorId: '1', createdAt: '2023-10-05T00:00:00Z'}
];

export const initialMessages: ChatMessage[] = [
    {id: 1301, userId: '1', text: 'Welcome to the team chat!', timestamp: '2023-10-28T10:00:00Z'},
    {id: 1302, userId: '2', text: 'Hello everyone!', timestamp: '2023-10-28T10:01:00Z'},
];

export const initialNotifications: Notification[] = [
    { id: 1401, userId: '2', messageKey: 'notifications.ticketAssigned', messagePayload: { ticketId: 102, clientName: 'Mohammed Hassan' }, link: '/tickets', isRead: false, createdAt: new Date().toISOString() },
    { id: 1402, userId: '1', messageKey: 'notifications.timeOffRequest', messagePayload: { employeeName: 'Fatima Al-Zahra' }, link: '/approvals', isRead: false, createdAt: new Date().toISOString() },
    { id: 1403, userId: '2', messageKey: 'notifications.taskAssigned', messagePayload: { taskTitle: 'Follow up with client Sara Ibrahim' }, link: '/tasks', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];