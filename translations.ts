// translations.ts
// ... (keep all existing translations)
// Just add these new keys under 'en' and 'ar' respectively.

export const translations = {
  en: {
    // COMMON
    common: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      create: 'Create',
      send: 'Send',
      view: 'View',
      details: 'Details',
      unassigned: 'Unassigned',
      select: 'Select...',
      selectRole: 'Select a role',
      loading: 'Loading...',
      unknownUser: 'Unknown User',
      featureComingSoon: 'Feature coming soon!',
      confirmDeleteMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
      description: 'Description'
    },
    
    // AUTH
    auth: {
      loginPrompt: 'Please sign in to continue.',
      signupPrompt: 'Create a new account to get started.',
      password: 'Password',
      loginButton: 'Sign In',
      signupButton: 'Sign Up',
      noAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      signupLink: 'Sign Up',
      loginLink: 'Sign In',
      invalidCredentials: 'Login failed. Please check your email and password.',
      signupSuccess: 'Signup successful! Redirecting to login...',
      signupError: 'An error occurred during signup. Please try again.',
    },

    // HEADER
    header: {
      toggleTheme: 'Toggle theme',
      notifications: 'Notifications',
      markAllAsRead: 'Mark all as read',
      noNewNotifications: 'No new notifications',
      logout: 'Logout',
    },
    
    // SIDEBAR & NAV
    sidebar: {
        dashboard: 'Dashboard',
        discuss: 'Discuss',
        calendar: 'Calendar',
        contacts: 'Contacts',
        sales: 'Sales',
        crm: 'Leads (CRM)',
        subscribers: 'Subscribers',
        helpdesk: 'Helpdesk',
        tasks: 'Tasks',
        employees: 'Employees',
        timesheets: 'Timesheets',
        timeOff: 'Time Off',
        appraisals: 'Appraisals',
        approvals: 'Approvals',
        surveys: 'Surveys',
        knowledgeBase: 'Knowledge Base',
        roleManagement: 'Role Management',
    },
    navSections: {
        general: 'General',
        salesSupport: 'Sales & Support',
        hr: 'Human Resources',
        other: 'Other',
        administration: 'Administration',
    },
    
    // PAGES
    loginPage: {
        welcome: 'Welcome Back!',
        selectUserPrompt: 'To continue, please select your user profile from the list below. This is for demonstration purposes.',
        selectProfileLabel: 'Select Profile',
        loginButton: 'Login as User'
    },
    dashboard: {
      welcome: 'Welcome, {{name}}!',
      subtitle: 'Here\'s a quick overview of your workspace.',
      openTickets: 'Open Tickets',
      pendingTasks: 'My Pending Tasks',
    },
    usersPage: {
      title: 'Employee Management',
      addUser: 'Add Employee',
      editUser: 'Edit Employee',
      table: {
        user: 'User',
        role: 'Role',
        email: 'Email',
        actions: 'Actions',
      }
    },
    ticketsPage: {
      title: 'Helpdesk Tickets',
      openTicket: 'Open a New Ticket',
      createTicketTitle: 'Create a New Support Ticket',
      ticket: 'Ticket',
      client: 'Client',
      subscriber: 'Subscriber',
      agent: 'Assigned Agent',
      reseller: 'Reseller',
      createdAt: 'Created At',
      lastUpdated: 'Last Updated',
      problemType: 'Problem Type',
      aiSummary: 'AI-Powered Summary',
      aiSummaryDisabled: "AI summary is disabled. No API key found.",
      aiSummaryError: "Error generating AI summary.",
      generateSummary: 'Generate',
      conversation: 'Conversation',
      diagnosis: 'Diagnosis',
      actionTaken: 'Action Taken',
      result: 'Result',
      forwardToReseller: 'Forward to Reseller',
      forward: 'Forward',
      addCommentPlaceholder: 'Type your comment here...',
      updateStatus: 'Update Status',
      ticketSubject: 'Ticket Subject',
      problemDescription: 'Problem Description',
      addImage: 'Add Image',
      table: {
        subject: 'Subject',
        status: 'Status',
        client: 'Client',
        lastUpdate: 'Last Update',
      }
    },
    knowledgeBase: {
        title: 'Knowledge Base',
        addArticle: 'Add Article',
        editArticle: 'Edit Article',
        meta: 'By {{author}} on {{date}}',
        noArticlesTitle: 'No Articles Found',
        noArticlesManage: 'Get started by creating the first article.',
        noArticlesUser: 'There are no articles in the knowledge base yet.',
        form: {
            title: 'Title',
            content: 'Content'
        }
    },
    tasksPage: {
        title: 'Tasks',
        addTask: 'Add Task',
        editTask: 'Edit Task',
        form: {
            title: 'Task Title',
            description: 'Description',
            assignee: 'Assignee',
            dueDate: 'Due Date',
            status: 'Status',
        },
        table: {
            task: 'Task',
            assignee: 'Assignee',
            dueDate: 'Due Date',
            status: 'Status',
            actions: 'Actions'
        }
    },
    leadsPage: {
        title: 'Leads',
        addLead: 'Add Lead',
        editLead: 'Edit Lead',
        viewKanban: 'Kanban',
        viewTable: 'Table',
        kanban: {
            new: 'New',
            contacted: 'Contacted',
            qualified: 'Qualified',
        },
        table: {
            fullName: 'Full Name',
            status: 'Status',
            phone: 'Phone',
            creator: 'Creator',
            createdAt: 'Created At',
            actions: 'Actions'
        },
        form: {
            details: 'Lead Details',
            leadType: 'Lead Type',
            customerType: 'Customer Type',
            customerInfo: 'Customer Info',
            firstName: 'First Name',
            secondName: 'Second Name',
            thirdName: 'Third Name',
            fourthName: 'Fourth Name',
            familyName: 'Family Name',
            contactInfo: 'Contact Info',
            whatsapp: 'WhatsApp',
            phone1: 'Phone 1',
            phone2: 'Phone 2',
            addressTech: 'Address & Technical Info',
            exchange: 'Exchange',
            area: 'Area',
            dist: 'District',
            street: 'Street',
            homeNumber: 'Home Number',
            rcNumber: 'RC Number',
            dpNumber: 'DP Number',
            nearestPoint: 'Nearest Point',
            olt: 'OLT',
            dpPort: 'DP Port',
            slot: 'Slot',
            ssid: 'SSID',
            additionalInfo: 'Additional Info',
            customerDevices: 'Customer Devices',
            sourceCompensation: 'Source Compensation',
            addedOnSite: 'Added On Site',
            attachments: 'Attachments',
            description: 'Description'
        }
    },
    appraisalsPage: {
        title: 'Appraisals',
        create: 'Create Appraisal',
        edit: 'Edit Appraisal',
        form: {
            employee: 'Employee',
            selectEmployee: 'Select Employee',
            date: 'Appraisal Date',
            rating: 'Rating (1-5)',
            comments: 'Comments'
        },
        table: {
            employee: 'Employee',
            reviewer: 'Reviewer',
            date: 'Date',
            rating: 'Rating'
        }
    },
    approvalsPage: {
        title: 'Approvals',
        table: {
            requester: 'Requester',
            requestType: 'Request Type',
            details: 'Details',
            status: 'Status',
            action: 'Action',
        },
        action: {
            approve: 'Approve',
            reject: 'Reject',
            done: 'Action Taken',
        },
        noRequests: 'No pending or recent approvals found.'
    },
    calendarPage: {
        prev: 'Previous',
        next: 'Next',
        addEventFor: 'Add Event for {{date}}',
        form: {
            title: 'Event Title',
            allDay: 'All Day'
        }
    },
    contactsPage: {
        title: 'Contacts',
        addContact: 'Add Contact',
        editContact: 'Edit Contact',
        form: {
            name: 'Full Name',
            email: 'Email Address',
            phone: 'Phone Number',
            company: 'Company',
            type: 'Contact Type'
        },
        table: {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            type: 'Type'
        }
    },
    discussPage: {
        title: 'Team Chat',
        placeholder: 'Type a message...',
        send: 'Send'
    },
    salesPage: {
        title: 'Sales Orders',
        createOrder: 'Create Order',
        form: {
            customer: 'Customer',
            amount: 'Amount',
            orderDate: 'Order Date',
            status: 'Status'
        },
        table: {
            orderNumber: 'Order #',
            customer: 'Customer',
            orderDate: 'Date',
            status: 'Status',
            amount: 'Amount',
        }
    },
    surveysPage: {
        title: 'Surveys',
        create: 'Create Survey',
        edit: 'Edit Survey',
        noSurveys: 'No surveys have been created yet.',
        form: {
            title: 'Survey Title',
            description: 'Description (optional)'
        },
        table: {
            title: 'Title',
            createdAt: 'Created At'
        }
    },
    timeOffPage: {
        title: 'My Time Off',
        newRequest: 'New Request',
        noRequests: 'You have not made any time off requests.',
        form: {
            title: 'Request Time Off',
            startDate: 'Start Date',
            endDate: 'End Date',
            reason: 'Reason',
            submit: 'Submit Request'
        },
        table: {
            reason: 'Reason',
            startDate: 'Start Date',
            endDate: 'End Date',
            status: 'Status'
        }
    },
    timesheetsPage: {
        title: 'My Timesheets',
        totalHours: 'Total Hours Logged: {{hours}}',
        logHours: 'Log Hours',
        noEntries: 'You have not logged any hours yet.',
        form: {
            title: 'Log Work Hours',
            date: 'Date',
            hours: 'Hours Worked',
            description: 'Work Description',
            log: 'Log Hours'
        },
        table: {
            date: 'Date',
            description: 'Description',
            hours: 'Hours'
        }
    },
    subscribersPage: {
      title: "Subscriber Lookup",
      searchPlaceholder: "Search by name or username...",
      searchResults: "Search Results",
      noSubscribers: "No subscribers found.",
      noSubscriberSelected: "Select a subscriber from the search results to see details.",
      createTicket: "Create Ticket",
      form: {
        profile: "Profile",
        status: "Status",
        reseller: "Reseller",
        expiration: "Expiration",
        lastSeen: "Last Seen Online",
        balance: "Balance",
        debtDays: "Debt Days",
        totalPurchases: "Total Purchases"
      }
    },
    settings: {
        title: 'Settings',
        layout: {
            roleManagement: 'Role Management',
        },
        roles: {
            title: 'Role Management',
            add: 'Add Role',
            edit: 'Edit Role',
            deleteWarning: 'Default roles cannot be deleted.',
            table: {
                name: 'Role Name',
                permissions: '# of Permissions'
            },
            form: {
                name: 'Role Name',
                permissions: 'Permissions'
            }
        }
    },
    
    // ENUMS
    roles: {
      "1": 'Super Admin',
      "2": 'Support Manager',
      "3": 'Client',
      "4": 'Sales Agent',
      "5": 'Reseller',
      "6": 'Reseller Employee',
      "unknown": 'Unknown Role',
    },
    ticketStatus: {
      OPEN: 'Open',
      IN_PROGRESS: 'In Progress',
      RESOLVED: 'Resolved',
      CLOSED: 'Closed'
    },
    problemType: {
        SLOW_SPEED: 'Slow Speed',
        NO_CONNECTION: 'No Connection',
        BILLING_INQUIRY: 'Billing Inquiry',
        CONFIGURATION: 'Configuration',
        OTHER: 'Other',
    },
    taskStatus: {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        DONE: 'Done'
    },
    leadStatus: {
        NEW: 'New',
        CONTACTED: 'Contacted',
        QUALIFIED: 'Qualified',
        UNQUALIFIED: 'Unqualified',
        LOST: 'Lost'
    },
    leadType: {
        NEW: 'New Customer',
        RETURN: 'Returning Customer'
    },
    contactType: {
        CUSTOMER: 'Customer',
        VENDOR: 'Vendor',
        PARTNER: 'Partner'
    },
    saleStatus: {
        QUOTATION: 'Quotation',
        ORDERED: 'Ordered',
        INVOICED: 'Invoiced',
        PAID: 'Paid',
        CANCELLED: 'Cancelled'
    },
    approvalStatus: {
        PENDING: 'Pending',
        APPROVED: 'Approved',
        REJECTED: 'Rejected'
    },
    approvalType: {
        TIME_OFF: 'Time Off',
        EXPENSE: 'Expense'
    },
    subscriberStatus: {
        ACTIVE: 'Active',
        INACTIVE: 'Inactive',
        EXPIRED: 'Expired',
    },
    permissions: {
      VIEW_DASHBOARD: 'View Dashboard',
      VIEW_USERS: 'View Users',
      MANAGE_USERS: 'Manage Users',
      VIEW_ROLES: 'View Roles',
      MANAGE_ROLES: 'Manage Roles',
      VIEW_TICKETS_OWN: 'View Own Tickets',
      VIEW_TICKETS_ALL: 'View All Tickets',
      CREATE_TICKET: 'Create Ticket',
      MANAGE_TICKETS: 'Manage Tickets',
      DELETE_TICKET: 'Delete Ticket',
      USE_TICKET_AI_SUMMARY: 'Use Ticket AI Summary',
      VIEW_SUBSCRIBERS: 'View Subscribers',
      MANAGE_SUBSCRIBERS: 'Manage Subscribers',
      VIEW_TASKS_OWN: 'View Own Tasks',
      VIEW_TASKS_ALL: 'View All Tasks',
      MANAGE_TASKS: 'Manage Tasks',
      VIEW_LEADS: 'View Leads',
      MANAGE_LEADS: 'Manage Leads',
      VIEW_KNOWLEDGEBASE: 'View Knowledge Base',
      MANAGE_KNOWLEDGEBASE: 'Manage Knowledge Base',
      VIEW_DISCUSS: 'View Discuss',
      VIEW_CALENDAR: 'View Calendar',
      MANAGE_CALENDAR: 'Manage Calendar',
      VIEW_CONTACTS: 'View Contacts',
      MANAGE_CONTACTS: 'Manage Contacts',
      VIEW_SALES: 'View Sales',
      MANAGE_SALES: 'Manage Sales',
      VIEW_EMPLOYEES: 'View Employees',
      MANAGE_EMPLOYEES: 'Manage Employees',
      VIEW_APPROVALS: 'View Approvals',
      MANAGE_APPROVALS: 'Manage Approvals',
      VIEW_TIME_OFF: 'View Time Off',
      MANAGE_TIME_OFF: 'Manage Time Off',
      VIEW_APPRAISALS: 'View Appraisals',
      MANAGE_APPRAISALS: 'Manage Appraisals',
      VIEW_TIMESHEETS: 'View Timesheets',
      MANAGE_TIMESHEETS: 'Manage Timesheets',
      VIEW_SURVEYS: 'View Surveys',
      MANAGE_SURVEYS: 'Manage Surveys',
      MANAGE_RESELLER_EMPLOYEES: 'Manage Reseller Employees',
    },
    notifications: {
        ticketAssigned: 'New ticket #{{ticketId}} from {{clientName}} has been assigned to you.',
        timeOffRequest: '{{employeeName}} has requested time off.',
        taskAssigned: 'You have been assigned a new task: "{{taskTitle}}".',
    },
  },
  ar: {
     // COMMON
    common: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      actions: 'الإجراءات',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      create: 'إنشاء',
      send: 'إرسال',
      view: 'عرض',
      details: 'تفاصيل',
      unassigned: 'غير معين',
      select: 'اختر...',
      selectRole: 'اختر دورًا',
      loading: 'جاري التحميل...',
      unknownUser: 'مستخدم غير معروف',
      featureComingSoon: 'الميزة قادمة قريبًا!',
      confirmDeleteMessage: 'هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
      description: 'الوصف'
    },
    
    // AUTH
    auth: {
      loginPrompt: 'الرجاء تسجيل الدخول للمتابعة.',
      signupPrompt: 'أنشئ حسابًا جديدًا للبدء.',
      password: 'كلمة المرور',
      loginButton: 'تسجيل الدخول',
      signupButton: 'إنشاء حساب',
      noAccount: 'ليس لديك حساب؟',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      signupLink: 'أنشئ حسابًا',
      loginLink: 'تسجيل الدخول',
      invalidCredentials: 'فشل تسجيل الدخول. الرجاء التحقق من بريدك الإلكتروني وكلمة المرور.',
      signupSuccess: 'تم إنشاء الحساب بنجاح! جاري التوجيه إلى صفحة الدخول...',
      signupError: 'حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى.',
    },
    
    // HEADER
    header: {
      toggleTheme: 'تبديل السمة',
      notifications: 'الإشعارات',
      markAllAsRead: 'تحديد الكل كمقروء',
      noNewNotifications: 'لا توجد إشعارات جديدة',
      logout: 'تسجيل الخروج',
    },
    
    // SIDEBAR & NAV
    sidebar: {
        dashboard: 'لوحة التحكم',
        discuss: 'مناقشة',
        calendar: 'التقويم',
        contacts: 'جهات الاتصال',
        sales: 'المبيعات',
        crm: 'العملاء المحتملون',
        subscribers: 'المشتركون',
        helpdesk: 'الدعم الفني',
        tasks: 'المهام',
        employees: 'الموظفون',
        timesheets: 'الجداول الزمنية',
        timeOff: 'الإجازات',
        appraisals: 'التقييمات',
        approvals: 'الموافقات',
        surveys: 'الاستبيانات',
        knowledgeBase: 'قاعدة المعرفة',
        roleManagement: 'إدارة الأدوار',
    },
    navSections: {
        general: 'عام',
        salesSupport: 'المبيعات والدعم',
        hr: 'الموارد البشرية',
        other: 'أخرى',
        administration: 'الإدارة',
    },

    // PAGES
    loginPage: {
        welcome: 'أهلاً بعودتك!',
        selectUserPrompt: 'للمتابعة، يرجى تحديد ملف تعريف المستخدم الخاص بك من القائمة أدناه. هذا لأغراض العرض التوضيحي فقط.',
        selectProfileLabel: 'اختر ملفك الشخصي',
        loginButton: 'تسجيل الدخول كمستخدم'
    },
    dashboard: {
      welcome: 'أهلاً بك، {{name}}!',
      subtitle: 'هنا نظرة سريعة على مساحة عملك.',
      openTickets: 'التذاكر المفتوحة',
      pendingTasks: 'مهامي المعلقة',
    },
    usersPage: {
      title: 'إدارة الموظفين',
      addUser: 'إضافة موظف',
      editUser: 'تعديل موظف',
      table: {
        user: 'المستخدم',
        role: 'الدور',
        email: 'البريد الإلكتروني',
        actions: 'الإجراءات',
      }
    },
    ticketsPage: {
      title: 'تذاكر الدعم الفني',
      openTicket: 'فتح تذكرة جديدة',
      createTicketTitle: 'إنشاء تذكرة دعم جديدة',
      ticket: 'تذكرة',
      client: 'العميل',
      subscriber: 'المشترك',
      agent: 'الموظف المسؤول',
      reseller: 'الموزع',
      createdAt: 'تاريخ الإنشاء',
      lastUpdated: 'آخر تحديث',
      problemType: 'نوع المشكلة',
      aiSummary: 'ملخص مدعوم بالذكاء الاصطناعي',
      aiSummaryDisabled: "ملخص الذكاء الاصطناعي معطل. لم يتم العثور على مفتاح API.",
      aiSummaryError: "خطأ في إنشاء ملخص الذكاء الاصطناعي.",
      generateSummary: 'إنشاء',
      conversation: 'المحادثة',
      diagnosis: 'التشخيص',
      actionTaken: 'الإجراء المتخذ',
      result: 'النتيجة',
      forwardToReseller: 'إعادة توجيه إلى الموزع',
      forward: 'توجيه',
      addCommentPlaceholder: 'اكتب تعليقك هنا...',
      updateStatus: 'تحديث الحالة',
      ticketSubject: 'موضوع التذكرة',
      problemDescription: 'وصف المشكلة',
      addImage: 'إضافة صورة',
      table: {
        subject: 'الموضوع',
        status: 'الحالة',
        client: 'العميل',
        lastUpdate: 'آخر تحديث',
      }
    },
    knowledgeBase: {
        title: 'قاعدة المعرفة',
        addArticle: 'إضافة مقال',
        editArticle: 'تعديل مقال',
        meta: 'بواسطة {{author}} في {{date}}',
        noArticlesTitle: 'لا توجد مقالات',
        noArticlesManage: 'ابدأ بإنشاء أول مقال.',
        noArticlesUser: 'لا توجد مقالات في قاعدة المعرفة حتى الآن.',
        form: {
            title: 'العنوان',
            content: 'المحتوى'
        }
    },
    tasksPage: {
        title: 'المهام',
        addTask: 'إضافة مهمة',
        editTask: 'تعديل مهمة',
        form: {
            title: 'عنوان المهمة',
            description: 'الوصف',
            assignee: 'المسؤول',
            dueDate: 'تاريخ الاستحقاق',
            status: 'الحالة',
        },
        table: {
            task: 'المهمة',
            assignee: 'المسؤول',
            dueDate: 'تاريخ الاستحقاق',
            status: 'الحالة',
            actions: 'الإجراءات'
        }
    },
    leadsPage: {
        title: 'العملاء المحتملون',
        addLead: 'إضافة عميل محتمل',
        editLead: 'تعديل عميل محتمل',
        viewKanban: 'كانبان',
        viewTable: 'جدول',
        kanban: {
            new: 'جديد',
            contacted: 'تم التواصل',
            qualified: 'مؤهل',
        },
        table: {
            fullName: 'الاسم الكامل',
            status: 'الحالة',
            phone: 'الهاتف',
            creator: 'المنشئ',
            createdAt: 'تاريخ الإنشاء',
            actions: 'الإجراءات'
        },
        form: {
            details: 'تفاصيل العميل المحتمل',
            leadType: 'نوع العميل المحتمل',
            customerType: 'نوع العميل',
            customerInfo: 'معلومات العميل',
            firstName: 'الاسم الأول',
            secondName: 'الاسم الثاني',
            thirdName: 'الاسم الثالث',
            fourthName: 'الاسم الرابع',
            familyName: 'اسم العائلة',
            contactInfo: 'معلومات الاتصال',
            whatsapp: 'واتساب',
            phone1: 'هاتف 1',
            phone2: 'هاتف 2',
            addressTech: 'العنوان والمعلومات الفنية',
            exchange: 'المقسم',
            area: 'المنطقة',
            dist: 'الحي',
            street: 'الشارع',
            homeNumber: 'رقم المنزل',
            rcNumber: 'رقم RC',
            dpNumber: 'رقم DP',
            nearestPoint: 'أقرب نقطة',
            olt: 'OLT',
            dpPort: 'منفذ DP',
            slot: 'Slot',
            ssid: 'SSID',
            additionalInfo: 'معلومات إضافية',
            customerDevices: 'عدد أجهزة العميل',
            sourceCompensation: 'تعويض المصدر',
            addedOnSite: 'أضيف في الموقع',
            attachments: 'المرفقات',
            description: 'الوصف'
        }
    },
    appraisalsPage: {
        title: 'تقييمات الأداء',
        create: 'إنشاء تقييم',
        edit: 'تعديل تقييم',
        form: {
            employee: 'الموظف',
            selectEmployee: 'اختر موظف',
            date: 'تاريخ التقييم',
            rating: 'التقييم (1-5)',
            comments: 'التعليقات'
        },
        table: {
            employee: 'الموظف',
            reviewer: 'المراجع',
            date: 'التاريخ',
            rating: 'التقييم'
        }
    },
    approvalsPage: {
        title: 'الموافقات',
        table: {
            requester: 'مقدم الطلب',
            requestType: 'نوع الطلب',
            details: 'التفاصيل',
            status: 'الحالة',
            action: 'الإجراء',
        },
        action: {
            approve: 'موافقة',
            reject: 'رفض',
            done: 'تم اتخاذ الإجراء',
        },
        noRequests: 'لا توجد موافقات معلقة أو حديثة.'
    },
    calendarPage: {
        prev: 'السابق',
        next: 'التالي',
        addEventFor: 'إضافة حدث ليوم {{date}}',
        form: {
            title: 'عنوان الحدث',
            allDay: 'يوم كامل'
        }
    },
    contactsPage: {
        title: 'جهات الاتصال',
        addContact: 'إضافة جهة اتصال',
        editContact: 'تعديل جهة اتصال',
        form: {
            name: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            phone: 'رقم الهاتف',
            company: 'الشركة',
            type: 'نوع جهة الاتصال'
        },
        table: {
            name: 'الاسم',
            email: 'البريد الإلكتروني',
            phone: 'الهاتف',
            type: 'النوع'
        }
    },
    discussPage: {
        title: 'دردشة الفريق',
        placeholder: 'اكتب رسالة...',
        send: 'إرسال'
    },
    salesPage: {
        title: 'طلبات المبيعات',
        createOrder: 'إنشاء طلب',
        form: {
            customer: 'العميل',
            amount: 'المبلغ',
            orderDate: 'تاريخ الطلب',
            status: 'الحالة'
        },
        table: {
            orderNumber: 'رقم الطلب',
            customer: 'العميل',
            orderDate: 'التاريخ',
            status: 'الحالة',
            amount: 'المبلغ',
        }
    },
    surveysPage: {
        title: 'الاستبيانات',
        create: 'إنشاء استبيان',
        edit: 'تعديل استبيان',
        noSurveys: 'لم يتم إنشاء أي استبيانات بعد.',
        form: {
            title: 'عنوان الاستبيان',
            description: 'الوصف (اختياري)'
        },
        table: {
            title: 'العنوان',
            createdAt: 'تاريخ الإنشاء'
        }
    },
    timeOffPage: {
        title: 'إجازاتي',
        newRequest: 'طلب جديد',
        noRequests: 'لم تقم بتقديم أي طلبات إجازة.',
        form: {
            title: 'طلب إجازة',
            startDate: 'تاريخ البدء',
            endDate: 'تاريخ الانتهاء',
            reason: 'السبب',
            submit: 'إرسال الطلب'
        },
        table: {
            reason: 'السبب',
            startDate: 'تاريخ البدء',
            endDate: 'تاريخ الانتهاء',
            status: 'الحالة'
        }
    },
    timesheetsPage: {
        title: 'جداولي الزمنية',
        totalHours: 'إجمالي الساعات المسجلة: {{hours}}',
        logHours: 'تسجيل ساعات',
        noEntries: 'لم تقم بتسجيل أي ساعات عمل بعد.',
        form: {
            title: 'تسجيل ساعات العمل',
            date: 'التاريخ',
            hours: 'ساعات العمل',
            description: 'وصف العمل',
            log: 'تسجيل الساعات'
        },
        table: {
            date: 'التاريخ',
            description: 'الوصف',
            hours: 'الساعات'
        }
    },
    subscribersPage: {
      title: "بحث عن مشترك",
      searchPlaceholder: "ابحث بالاسم أو اسم المستخدم...",
      searchResults: "نتائج البحث",
      noSubscribers: "لم يتم العثور على مشتركين.",
      noSubscriberSelected: "اختر مشتركًا من نتائج البحث لعرض التفاصيل.",
      createTicket: "إنشاء تذكرة",
       form: {
        profile: "الملف الشخصي",
        status: "الحالة",
        reseller: "الموزع",
        expiration: "انتهاء الصلاحية",
        lastSeen: "آخر ظهور على الإنترنت",
        balance: "الرصيد",
        debtDays: "أيام الدين",
        totalPurchases: "إجمالي المشتريات"
      }
    },
    settings: {
        title: 'الإعدادات',
        layout: {
            roleManagement: 'إدارة الأدوار',
        },
        roles: {
            title: 'إدارة الأدوار',
            add: 'إضافة دور',
            edit: 'تعديل دور',
            deleteWarning: 'لا يمكن حذف الأدوار الافتراضية.',
            table: {
                name: 'اسم الدور',
                permissions: 'عدد الصلاحيات'
            },
            form: {
                name: 'اسم الدور',
                permissions: 'الصلاحيات'
            }
        }
    },

    // ENUMS
     roles: {
      "1": 'مدير النظام',
      "2": 'مدير الدعم',
      "3": 'عميل',
      "4": 'مندوب مبيعات',
      "5": 'موزع',
      "6": 'موظف موزع',
      "unknown": 'دور غير معروف',
    },
    ticketStatus: {
      OPEN: 'مفتوحة',
      IN_PROGRESS: 'قيد التنفيذ',
      RESOLVED: 'تم حلها',
      CLOSED: 'مغلقة'
    },
     problemType: {
        SLOW_SPEED: 'سرعة بطيئة',
        NO_CONNECTION: 'لا يوجد اتصال',
        BILLING_INQUIRY: 'استفسار عن الفواتير',
        CONFIGURATION: 'إعدادات',
        OTHER: 'أخرى',
    },
    taskStatus: {
        TODO: 'للقيام به',
        IN_PROGRESS: 'قيد التنفيذ',
        DONE: 'تم'
    },
    leadStatus: {
        NEW: 'جديد',
        CONTACTED: 'تم التواصل',
        QUALIFIED: 'مؤهل',
        UNQUALIFIED: 'غير مؤهل',
        LOST: 'ضائع'
    },
     leadType: {
        NEW: 'عميل جديد',
        RETURN: 'عميل عائد'
    },
    contactType: {
        CUSTOMER: 'عميل',
        VENDOR: 'مورد',
        PARTNER: 'شريك'
    },
    saleStatus: {
        QUOTATION: 'عرض سعر',
        ORDERED: 'تم طلبه',
        INVOICED: 'تمت فوترته',
        PAID: 'مدفوع',
        CANCELLED: 'ملغى'
    },
    approvalStatus: {
        PENDING: 'معلق',
        APPROVED: 'تمت الموافقة',
        REJECTED: 'مرفوض'
    },
    approvalType: {
        TIME_OFF: 'إجازة',
        EXPENSE: 'مصروفات'
    },
    subscriberStatus: {
        ACTIVE: 'نشط',
        INACTIVE: 'غير نشط',
        EXPIRED: 'منتهي الصلاحية',
    },
    permissions: {
      VIEW_DASHBOARD: 'عرض لوحة التحكم',
      VIEW_USERS: 'عرض المستخدمين',
      MANAGE_USERS: 'إدارة المستخدمين',
      VIEW_ROLES: 'عرض الأدوار',
      MANAGE_ROLES: 'إدارة الأدوار',
      VIEW_TICKETS_OWN: 'عرض التذاكر الخاصة',
      VIEW_TICKETS_ALL: 'عرض كل التذاكر',
      CREATE_TICKET: 'إنشاء تذكرة',
      MANAGE_TICKETS: 'إدارة التذاكر',
      DELETE_TICKET: 'حذف تذكرة',
      USE_TICKET_AI_SUMMARY: 'استخدام ملخص الذكاء الاصطناعي للتذاكر',
      VIEW_SUBSCRIBERS: 'عرض المشتركين',
      MANAGE_SUBSCRIBERS: 'إدارة المشتركين',
      VIEW_TASKS_OWN: 'عرض المهام الخاصة',
      VIEW_TASKS_ALL: 'عرض كل المهام',
      MANAGE_TASKS: 'إدارة المهام',
      VIEW_LEADS: 'عرض العملاء المحتملين',
      MANAGE_LEADS: 'إدارة العملاء المحتملين',
      VIEW_KNOWLEDGEBASE: 'عرض قاعدة المعرفة',
      MANAGE_KNOWLEDGEBASE: 'إدارة قاعدة المعرفة',
      VIEW_DISCUSS: 'عرض المناقشة',
      VIEW_CALENDAR: 'عرض التقويم',
      MANAGE_CALENDAR: 'إدارة التقويم',
      VIEW_CONTACTS: 'عرض جهات الاتصال',
      MANAGE_CONTACTS: 'إدارة جهات الاتصال',
      VIEW_SALES: 'عرض المبيعات',
      MANAGE_SALES: 'إدارة المبيعات',
      VIEW_EMPLOYEES: 'عرض الموظفين',
      MANAGE_EMPLOYEES: 'إدارة الموظفين',
      VIEW_APPROVALS: 'عرض الموافقات',
      MANAGE_APPROVALS: 'إدارة الموافقات',
      VIEW_TIME_OFF: 'عرض الإجازات',
      MANAGE_TIME_OFF: 'إدارة الإجازات',
      VIEW_APPRAISALS: 'عرض التقييمات',
      MANAGE_APPRAISALS: 'إدارة التقييمات',
      VIEW_TIMESHEETS: 'عرض الجداول الزمنية',
      MANAGE_TIMESHEETS: 'إدارة الجداول الزمنية',
      VIEW_SURVEYS: 'عرض الاستبيانات',
      MANAGE_SURVEYS: 'إدارة الاستبيانات',
      MANAGE_RESELLER_EMPLOYEES: 'إدارة موظفي الموزعين',
    },
     notifications: {
        ticketAssigned: 'تم تعيين تذكرة جديدة #{{ticketId}} من {{clientName}} لك.',
        timeOffRequest: 'طلب {{employeeName}} إجازة.',
        taskAssigned: 'تم تعيين مهمة جديدة لك: "{{taskTitle}}".',
    },
  }
};

// --- This part is a placeholder to satisfy the old structure. ---
// You would eventually generate this type from the full object.
type Paths<T, P extends string = ''> = T extends object ? { [K in keyof T]: Paths<T[K], `${P}${P extends '' ? '' : '.'}${K & string}`> }[keyof T] : P;


// Keep the existing TranslationKey for now to avoid breaking other files temporarily.
// In a full refactor, this would be updated.
export type TranslationKey = Paths<typeof translations['en']>;