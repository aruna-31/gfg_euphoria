import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { User, Mail, School, ShieldCheck } from 'lucide-react';

export const ParticipantProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      <div className="border-b border-[#141f17] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Participant Profile
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Personal account details and university accreditation.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#141f17]">
          <Avatar src={user?.avatarUrl} name={user?.name || 'User'} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-blue-400 font-mono mt-0.5">Participant • Team Member</p>
            <p className="text-xs text-gray-400 mt-1">{user?.college}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-[#070a08] border border-[#141f17]">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Email Address</span>
            <div className="flex items-center gap-2 text-xs text-gray-200">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070a08] border border-[#141f17]">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Affiliated College</span>
            <div className="flex items-center gap-2 text-xs text-gray-200">
              <School className="w-3.5 h-3.5 text-gray-500" />
              <span>{user?.college}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070a08] border border-[#141f17]">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Assigned Team ID</span>
            <span className="text-xs font-mono font-bold text-[#00e575]">{user?.teamId}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070a08] border border-[#141f17]">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Security Status</span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Participant
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
