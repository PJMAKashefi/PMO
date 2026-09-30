import { StakeholderCategoryId, UserAccount } from '../types';

export interface UserCredential extends UserAccount {
  username: string;
  password: string;
}

export const SYSTEM_ACCOUNTS: UserCredential[] = [
  // Exclusive Authorized Sign-In: Mr. Nushi - Director Asset Management (Sea-Kit)
  {
    username: 'seakit',
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
    username: 'director.asset',
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
