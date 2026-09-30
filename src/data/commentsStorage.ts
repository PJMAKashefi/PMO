export interface ProposalComment {
  id: string;
  chapterId: string;
  targetId: string; // e.g. "ch4", "sec-4.1", "sec-4.2", or paragraph key
  targetTitle: string; // Name of section or chapter
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

const COMMENTS_STORAGE_KEY = 'seakit_proposal_comments_v2_clean';

export function getProposalComments(): ProposalComment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProposalComments(comments: ProposalComment[]): void {
  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save comments', e);
  }
}

export function addProposalComment(comment: Omit<ProposalComment, 'id' | 'createdAt'>): ProposalComment {
  const all = getProposalComments();
  const newComment: ProposalComment = {
    ...comment,
    id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  all.push(newComment);
  saveProposalComments(all);
  return newComment;
}

export function deleteProposalComment(id: string): void {
  const all = getProposalComments();
  const filtered = all.filter((c) => c.id !== id);
  saveProposalComments(filtered);
}
