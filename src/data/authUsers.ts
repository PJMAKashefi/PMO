import { StakeholderCategoryId, UserAccount } from '../types';

export interface UserCredential extends UserAccount {
  username: string;
  password: string;
}

export const SYSTEM_ACCOUNTS: UserCredential[] = [
  // 1. General Sea-Kit Team / Staff Login
  {
    username: 'seakit',
    password: 'password',
    displayName: 'Sea-Kit Team Member',
    category: 'engineering',
    roleTitle: 'Sea-Kit Stakeholder',
    department: 'Sea-Kit International Ltd',
    isAssetOwner: false,
    isOwner: false,
  },
  // 2. Dedicated Executive Login for Mr. Nushi
  {
    username: 'mr.nushi',
    password: 'password',
    displayName: 'Mr. Nushi',
    category: 'asset_owner',
    roleTitle: 'Director Asset Management',
    department: 'Asset Management',
    isAssetOwner: true,
    isOwner: false,
  },
  {
    username: 'bujar.nushi',
    password: 'password',
    displayName: 'Mr. Nushi',
    category: 'asset_owner',
    roleTitle: 'Director Asset Management',
    department: 'Asset Management',
    isAssetOwner: true,
    isOwner: false,
  },
  {
    username: 'nushi',
    password: 'password',
    displayName: 'Mr. Nushi',
    category: 'asset_owner',
    roleTitle: 'Director Asset Management',
    department: 'Asset Management',
    isAssetOwner: true,
    isOwner: false,
  },
];

export function getAccountForRole(category: StakeholderCategoryId, roleTitle?: string): UserCredential | undefined {
  return SYSTEM_ACCOUNTS[0];
}
