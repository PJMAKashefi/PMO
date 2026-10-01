import { StakeholderCategoryId, UserAccount } from '../types';

export interface UserCredential extends UserAccount {
  username: string;
  password: string;
}

export const SYSTEM_ACCOUNTS: UserCredential[] = [
  // 1. General Sea-Kit Team / Staff Login
  {
    username: 'seakit',
    password: 'usv',
    displayName: 'Sea-Kit Team Member',
    category: 'engineering',
    roleTitle: 'Sea-Kit Stakeholder',
    department: 'Sea-Kit International Ltd',
    isAssetOwner: false,
    isOwner: false,
  },
  // 2. Dedicated Executive Login for Mr. Nushi
  {
    username: 'b.nushi',
    password: 'fugro',
    displayName: 'Mr. Nushi',
    category: 'asset_owner',
    roleTitle: 'Director Asset Management',
    department: 'Asset Management',
    isAssetOwner: true,
    isOwner: false,
  },
  // Backwards compatibility convenience aliases
  {
    username: 'bujar.nushi',
    password: 'fugro',
    displayName: 'Mr. Nushi',
    category: 'asset_owner',
    roleTitle: 'Director Asset Management',
    department: 'Asset Management',
    isAssetOwner: true,
    isOwner: false,
  },
  {
    username: 'mr.nushi',
    password: 'fugro',
    displayName: 'Mr. Nushi',
    category: 'asset_owner',
    roleTitle: 'Director Asset Management',
    department: 'Asset Management',
    isAssetOwner: true,
    isOwner: false,
  },
  // In case Mr. Nushi uses the typo from the email text
  {
    username: 'b.nut',
    password: 'fugro',
    displayName: 'Mr. Nushi',
    category: 'asset_owner',
    roleTitle: 'Director Asset Management',
    department: 'Asset Management',
    isAssetOwner: true,
    isOwner: false,
  },
  // 3. System Admin & Creator Accounts (Full Universal Access)
  {
    username: 'ali.kashefi',
    password: 'pjmak',
    displayName: 'Ali Kashefi',
    category: 'executive',
    roleTitle: 'Lead Consultant & PMO Architect',
    department: 'PJMAK Advisory',
    isAssetOwner: true,
    isOwner: true,
  },
  {
    username: 'alikashefi',
    password: 'pjmak',
    displayName: 'Ali Kashefi',
    category: 'executive',
    roleTitle: 'Lead Consultant & PMO Architect',
    department: 'PJMAK Advisory',
    isAssetOwner: true,
    isOwner: true,
  },
  {
    username: 'ali',
    password: 'pjmak',
    displayName: 'Ali Kashefi',
    category: 'executive',
    roleTitle: 'Lead Consultant & PMO Architect',
    department: 'PJMAK Advisory',
    isAssetOwner: true,
    isOwner: true,
  },
  {
    username: 'admin',
    password: 'pjmak',
    displayName: 'System Administrator',
    category: 'executive',
    roleTitle: 'System Administrator',
    department: 'PJMAK PMO Management',
    isAssetOwner: true,
    isOwner: true,
  },
  {
    username: 'admin',
    password: 'admin',
    displayName: 'System Administrator',
    category: 'executive',
    roleTitle: 'System Administrator',
    department: 'PJMAK PMO Management',
    isAssetOwner: true,
    isOwner: true,
  },
  {
    username: 'ali.kashefi',
    password: 'fugro',
    displayName: 'Ali Kashefi',
    category: 'executive',
    roleTitle: 'Lead Consultant & PMO Architect',
    department: 'PJMAK Advisory',
    isAssetOwner: true,
    isOwner: true,
  },
  {
    username: 'ali.kashefi',
    password: 'usv',
    displayName: 'Ali Kashefi',
    category: 'executive',
    roleTitle: 'Lead Consultant & PMO Architect',
    department: 'PJMAK Advisory',
    isAssetOwner: true,
    isOwner: true,
  },
];

export function getAccountForRole(category: StakeholderCategoryId, roleTitle?: string): UserCredential | undefined {
  return SYSTEM_ACCOUNTS[0];
}
