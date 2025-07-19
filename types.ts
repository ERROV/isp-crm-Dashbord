// types.ts
import type { Types } from 'mongoose';

export enum Permission {
  // General
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',

  // Users
  VIEW_USERS = 'VIEW_USERS',
  MANAGE_USERS = 'MANAGE_USERS', // Create, Edit, Delete

  // Roles
  VIEW_ROLES = 'VIEW_ROLES',
  MANAGE_ROLES = 'MANAGE_ROLES',

  // Tickets
  VIEW_TICKETS_OWN = 'VIEW_TICKETS_OWN',
  VIEW_TICKETS_ALL = 'VIEW_TICKETS_ALL',
  CREATE_TICKET = 'CREATE_TICKET',
  MANAGE_TICKETS = 'MANAGE_TICKETS', // Assign, change status, forward
  DELETE_TICKET = 'DELETE_TICKET',
  USE_TICKET_AI_SUMMARY = 'USE_TICKET_AI_SUMMARY',

  // Subscribers
  VIEW_SUBSCRIBERS = 'VIEW_SUBSCRIBERS',
  MANAGE_SUBSCRIBERS = 'MANAGE_SUBSCRIBERS',

  // Tasks
  VIEW_TASKS_OWN = 'VIEW_TASKS_OWN',
  VIEW_TASKS_ALL = 'VIEW_TASKS_ALL',
  MANAGE_TASKS = 'MANAGE_TASKS',

  // Leads (CRM)
  VIEW_LEADS = 'VIEW_LEADS',
  MANAGE_LEADS = 'MANAGE_LEADS',

  // Knowledge Base
  VIEW_KNOWLEDGEBASE = 'VIEW_KNOWLEDGEBASE',
  MANAGE_KNOWLEDGEBASE = 'MANAGE_KNOWLEDGEBASE',
  
  // Discuss
  VIEW_DISCUSS = 'VIEW_DISCUSS',

  // Calendar
  VIEW_CALENDAR = 'VIEW_CALENDAR',
  MANAGE_CALENDAR = 'MANAGE_CALENDAR',

  // Contacts
  VIEW_CONTACTS = 'VIEW_CONTACTS',
  MANAGE_CONTACTS = 'MANAGE_CONTACTS',

  // Sales
  VIEW_SALES = 'VIEW_SALES',
  MANAGE_SALES = 'MANAGE_SALES',

  // HR
  VIEW_EMPLOYEES = 'VIEW_EMPLOYEES',
  MANAGE_EMPLOYEES = 'MANAGE_EMPLOYEES',
  VIEW_APPROVALS = 'VIEW_APPROVALS',
  MANAGE_APPROVALS = 'MANAGE_APPROVALS',
  VIEW_TIME_OFF = 'VIEW_TIME_OFF',
  MANAGE_TIME_OFF = 'MANAGE_TIME_OFF', // Request time off
  VIEW_APPRAISALS = 'VIEW_APPRAISALS',
  MANAGE_APPRAISALS = 'MANAGE_APPRAISALS',
  VIEW_TIMESHEETS = 'VIEW_TIMESHEETS',
  MANAGE_TIMESHEETS = 'MANAGE_TIMESHEETS',

  // Surveys
  VIEW_SURVEYS = 'VIEW_SURVEYS',
  MANAGE_SURVEYS = 'MANAGE_SURVEYS',
  MANAGE_RESELLER_EMPLOYEES = 'MANAGE_RESELLER_EMPLOYEES',
}


export interface Role {
  _id?: string;
  id?: number; // for mock data
  name: string; 
  permissions: Permission[];
}

export interface User {
  _id?: string;
  id?: string; // for mock data, changed to string
  name: string;
  email: string;
  password?: string; // Should not be sent to client
  role: Role | Types.ObjectId | string;
  roleId?: number; // for mock data
  avatar: string;
  resellerId?: number | string;
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum ProblemType {
    SLOW_SPEED = 'SLOW_SPEED',
    NO_CONNECTION = 'NO_CONNECTION',
    BILLING_INQUIRY = 'BILLING_INQUIRY',
    CONFIGURATION = 'CONFIGURATION',
    OTHER = 'OTHER',
}

export enum SubscriberStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
}


export interface Subscriber {
    _id: string;
    id?: number; // for mock data
    name: string; // The person's name for searching
    username: string; // PPPoE username
    password?: string;
    balance: number;
    owner: string; // This is the reseller's name, can be linked via an ID later
    profile: string;
    expirationDate: string;
    debtDays: number;
    incorrectPinTries: number;
    status: SubscriberStatus;
    lastSeenOnline?: string;
    remainingDownload: number; // in GB
    remainingUpload: number; // in GB
    remainingTraffic: number; // in GB
    remainingUptime: number; // in seconds
    totalPurchases: number;
    createdBy: Types.ObjectId | string;
    resellerId?: string | number;
    createdOn?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type DescriptionPart = {
    type: 'text' | 'image';
    content: string; // text content or base64 image data
}

export interface Ticket {
  _id?: string;
  id?: number;
  title: string;
  descriptionParts: DescriptionPart[];
  status: TicketStatus;
  clientId: Types.ObjectId | string | User;
  subscriberId?: Types.ObjectId | string | Subscriber | number; 
  agentId?: Types.ObjectId | string | User;
  resellerId?: string | number; // Keeping this simple for now
  createdAt: string;
  updatedAt: string;
  comments: { 
    author: Types.ObjectId | string | User;
    text: string;
    date: string;
   }[];
  problemType: ProblemType;
  diagnosis?: string;
  actionTaken?: string;
  result?: string;
}

export interface Notification {
  id: number;
  userId: string;
  messageKey: string;
  messagePayload?: Record<string, string | number>;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface Reseller {
    id: number;
    name: string;
}

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    assigneeId?: string;
    dueDate: string;
}

export enum LeadStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    QUALIFIED = 'QUALIFIED',
    UNQUALIFIED = 'UNQUALIFIED',
    LOST = 'LOST',
}

export enum LeadType {
    NEW = 'NEW',
    RETURN = 'RETURN',
}

export interface Lead {
    id: number;
    status: LeadStatus;
    leadType: LeadType;
    customerType: string;
    firstName: string;
    secondName: string;
    thirdName: string;
    fourthName: string;
    familyName: string;
    whatsappNumber: string;
    phone1: string;
    phone2?: string;
    phone3?: string;
    exchange: string;
    area: string;
    dist: string;
    street: string;
    homeNumber: string;
    rcNumber?: string;
    dpNumber: string;
    olt: number;
    dpPort: number;
    slot: number;
    ssid: string;
    customerDevices: number;
    addedOnSite: boolean;
    nearestPoint: string;
    sourceCompensation: number;
    attachments: any[]; // Define properly later
    description: string;
    createdAt: string;
    creatorId: string;
}

export enum ContactType {
    CUSTOMER = 'CUSTOMER',
    VENDOR = 'VENDOR',
    PARTNER = 'PARTNER',
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    type: ContactType;
}

export enum SaleStatus {
    QUOTATION = 'QUOTATION',
    ORDERED = 'ORDERED',
    INVOICED = 'INVOICED',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

export interface SaleOrder {
    id: number;
    orderNumber: string;
    contactId: number;
    orderDate: string;
    status: SaleStatus;
    amount: number;
}

export interface CalendarEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    userId: string;
}

export enum ApprovalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum ApprovalType {
    TIME_OFF = 'TIME_OFF',
    EXPENSE = 'EXPENSE',
}

export interface TimeOffRequest {
    id: number;
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: ApprovalStatus;
}

export interface Approval {
    id: number;
    requesterId: string;
    requestType: ApprovalType;
    requestId: number;
    details: string;
    status: ApprovalStatus;
    createdAt: string;
}

export interface TimesheetEntry {
    id: number;
    userId: string;
    date: string;
    hours: number;
    description: string;
}

export interface KnowledgeBaseArticle {
    id: number;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
}

export interface Appraisal {
    id: number;
    employeeId: string;
    reviewerId: string;
    appraisalDate: string;
    rating: number;
    comments: string;
}

export interface Survey {
    id: number;
    title: string;
    description: string;
    creatorId: string;
    createdAt: string;
}

export interface ChatMessage {
    id: number;
    userId: string;
    text: string;
    timestamp: string;
}