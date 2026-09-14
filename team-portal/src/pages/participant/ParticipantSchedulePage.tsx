import React, { useEffect, useState } from 'react';
import { participantService, ScheduleEvent } from '../../services/participantService';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, MapPin, CheckCircle2, Flame, CircleDot } from 'lucide-react';

export const ParticipantSchedulePage: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    participantService.getSchedule().then((data) => {
      setSchedule(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-400 font-mono text-xs">Loading Schedule...</div>;
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="border-b border-[#141f17] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Hackathon Master Schedule
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Chronological milestone timeline, evaluation checkpoints, and auditorium briefings.
        </p>
      </div>

      <div className="relative border-l border-[#1b2b20] ml-4 sm:ml-6 space-y-6">
        {schedule.map((item, idx) => (
          <div key={item.id} className="relative pl-6 sm:pl-8 group">
            {/* Timeline Dot Icon */}
            <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-[#080d0a] border-2 border-[#1e3024] flex items-center justify-center group-hover:border-[#00b259] transition-colors">
              {item.status === 'COMPLETED' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00b259]" />
              ) : item.status === 'LIVE' ? (
                <span className="w-2.5 h-2.5 rounded-full bg-[#00e575] animate-ping" />
              ) : (
                <CircleDot className="w-3 h-3 text-gray-600" />
              )}
            </div>

            <Card className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-[#142117]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#00e575]" />
                  <span className="text-xs font-mono font-bold text-white">{item.time}</span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${
                    item.status === 'COMPLETED'
                      ? 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                      : item.status === 'LIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-bold'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{item.description}</p>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>{item.location}</span>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
