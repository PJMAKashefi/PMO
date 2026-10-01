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
  // 3. Single Master Admin & Owner Account
  {
    username: 'PJMAK',
    password: 'admin',
    displayName: 'Ali Kashefi (PJMAK Lead)',
    category: 'executive',
    roleTitle: 'PMO Architect & System Owner',
    department: 'PJMAK Advisory',
    isAssetOwner: true,
    isOwner: true,
  },
];

export function getAccountForRole(category: StakeholderCategoryId, roleTitle?: string): UserCredential | undefined {
  return SYSTEM_ACCOUNTS[0];
}
