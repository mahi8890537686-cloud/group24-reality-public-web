'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, Share2 } from 'lucide-react';
import { incrementBlogViews } from '@/lib/firestore/blogs';

interface ViewsAndShareProps {
  blogId: string;
  views: number;
}

export default function ViewsAndShare({ blogId, views }: ViewsAndShareProps) {
  const [copied, setCopied] = useState(false);
  const incremented = useRef(false);

  useEffect(() => {
    if (incremented.current) return;
    incremented.current = true;
    incrementBlogViews(blogId).catch(() => {});
  }, [blogId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1 text-gray-400">
        <Eye className="w-3.5 h-3.5" />
        {views + 1} views
      </span>
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
      >
        <Share2 className="w-3.5 h-3.5" />
        {copied ? 'Link Copied!' : 'Share'}
      </button>
    </div>
  );
}
