import React, { useEffect, useState } from 'react';
import { participantService } from '../../services/participantService';
import { Announcement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Bell, Filter } from 'lucide-react';

export const ParticipantAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'IMPORTANT' | 'SCHEDULE' | 'RULES'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    participantService.getAnnouncements().then((data) => {
      setAnnouncements(data);
      setLoading(false);
    });
  }, []);

  const filtered = announcements.filter((a) => filter === 'ALL' || a.category === filter);

  if (loading) {
    return <div className="py-20 text-center text-gray-400 font-mono text-xs">Loading Announcements...</div>;
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="border-b border-[#141f17] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Announcements & Broadcasts
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Official operational updates directly from Hackathon Directorate.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0b120e] p-1 rounded-xl border border-[#141f17]">
          {(['ALL', 'IMPORTANT', 'SCHEDULE', 'RULES'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                filter === cat
                  ? 'bg-[#00b259] text-black font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3.5">
        {filtered.map((ann) => (
          <Card key={ann.id} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  ann.category === 'IMPORTANT'
                    ? 'bg-red-500/10 text-red-400 border-red-500/30 font-bold'
                    : ann.category === 'RULES'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {ann.category}
              </span>
              <span className="text-xs font-mono text-gray-500">
                {new Date(ann.timestamp).toLocaleString()}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1.5">{ann.title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{ann.content}</p>

            <div className="mt-4 pt-2.5 border-t border-[#141f17] flex justify-between items-center text-[11px] font-mono text-gray-500">
              <span>Issued by: {ann.author}</span>
              <span className="text-[#00e575]">Official Notice</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
