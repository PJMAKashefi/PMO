import React, { useState } from 'react';
import { ProposalComment, addProposalComment, deleteProposalComment, getProposalComments } from '../data/commentsStorage';
import { MessageSquarePlus, MessageSquare, Send, Trash2, X, User, Download } from 'lucide-react';
import { UserAccount } from '../types';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  targetId: string;
  targetTitle: string;
  currentUser: UserAccount | null;
  comments: ProposalComment[];
  onCommentAdded: () => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  chapterId,
  targetId,
  targetTitle,
  currentUser,
  comments,
  onCommentAdded,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen) return null;

  const relevantComments = comments.filter(
    (c) => c.chapterId === chapterId && c.targetId === targetId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addProposalComment({
      chapterId,
      targetId,
      targetTitle,
      authorName: currentUser?.displayName || 'Mr. Nushi',
      authorRole: currentUser?.roleTitle || 'Director Asset Management',
      text: commentText.trim(),
    });

    setCommentText('');
    onCommentAdded();
  };

  const handleDelete = (id: string) => {
    deleteProposalComment(id);
    onCommentAdded();
  };

  const handleExportAllComments = () => {
    const all = getProposalComments();
    if (all.length === 0) return;

    let content = `PMO ESTABLISHMENT PROPOSAL — EXECUTIVE COMMENTS & NOTES (PJMAK)\n`;
    content += `Reviewer: ${currentUser?.displayName || 'Mr. Nushi'} (${currentUser?.roleTitle || 'Director Asset Management'})\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `=================================================================\n\n`;

    all.forEach((c, idx) => {
      content += `[Note #${idx + 1}] Target Section: ${c.targetTitle}\n`;
      content += `Author: ${c.authorName} (${c.authorRole})\n`;
      content += `Date: ${new Date(c.createdAt).toLocaleString()}\n`;
      content += `Observation/Feedback:\n${c.text}\n`;
      content += `-----------------------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SeaKit_Proposal_Executive_Notes_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Section Feedback &amp; Comments</h3>
              <p className="text-2xs text-slate-300 truncate max-w-xs sm:max-w-md">
                {targetTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {comments.length > 0 && (
              <button
                type="button"
                onClick={handleExportAllComments}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Download All Notes as Text File"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Notes</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Existing Comments List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[160px] bg-slate-50/50">
          {relevantComments.length === 0 ? (
            <div className="text-center py-6 text-slate-400 space-y-1">
              <MessageSquarePlus className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No comments or notes added yet for this section.</p>
              <p className="text-2xs text-slate-400">
                Share your executive perspective, questions, or annotations below.
              </p>
            </div>
          ) : (
            relevantComments.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 flex items-center justify-center font-bold text-3xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {c.authorName}
                      </span>
                      <span className="text-3xs text-slate-500">{c.authorRole}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xs text-slate-400 font-mono">
                      {new Date(c.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove Comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-wrap pl-8">
                  {c.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white space-y-2">
          <div className="flex items-start gap-2">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Add your comment or observation as ${currentUser?.displayName || 'Mr. Nushi'}...`}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer shrink-0 mt-0.5"
              title="Post Comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <span className="text-3xs text-slate-400 block">
            Comments remain confidential and securely saved to this proposal review session.
          </span>
        </form>
      </div>
    </div>
  );
};
