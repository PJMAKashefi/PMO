import { StakeholderCategoryId, UserAccount } from '../types';

export interface UserCredential extends UserAccount {
  username: string;
  password: string;
  isExpired?: boolean;
  expiredMessage?: string;
}

export const SYSTEM_ACCOUNTS: UserCredential[] = [
  // 1. General Sea-Kit Team / Staff Login (Expired after 72-hour review window)
  {
    username: 'seakit',
    password: 'usv',
    displayName: 'Sea-Kit Team Member',
    category: 'engineering',
    roleTitle: 'Sea-Kit Stakeholder',
    department: 'Sea-Kit International Ltd',
    isAssetOwner: false,
    isOwner: false,
    isExpired: true,
    expiredMessage: 'Access Expired: The initial 72-hour stakeholder diagnostic window for this account has concluded. Please contact PJMAK Advisory (Ali Kashefi) to reactivate or request an extended session token.',
  },
  // 2. Dedicated Executive Login for Mr. Nushi (Expired after 72-hour review window)
  {
    username: 'b.nushi',
    password: 'fugro',
    displayName: 'Mr. Nushi',
    category: 'asset_owner',
    roleTitle: 'Director Asset Management',
    department: 'Asset Management',
    isAssetOwner: true,
    isOwner: false,
    isExpired: true,
    expiredMessage: 'Access Expired: The preliminary 72-hour executive review window for this credential has concluded. In accordance with security protocol, please contact Ali Kashefi (PJMAK Advisory) to reactivate access.',
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
    isExpired: true,
    expiredMessage: 'Access Expired: The preliminary 72-hour executive review window for this credential has concluded. In accordance with security protocol, please contact Ali Kashefi (PJMAK Advisory) to reactivate access.',
  },
  // 3. Single Master Admin & Owner Account (Always Permanent & Active)
  {
    username: 'PJMAK',
    password: 'admin',
    displayName: 'Ali Kashefi (PJMAK Lead)',
    category: 'executive',
    roleTitle: 'PMO Architect & System Owner',
    department: 'PJMAK Advisory',
    isAssetOwner: true,
    isOwner: true,
    isExpired: false,
  },
];

export function getAccountForRole(category: StakeholderCategoryId, roleTitle?: string): UserCredential | undefined {
  return SYSTEM_ACCOUNTS[0];
}
