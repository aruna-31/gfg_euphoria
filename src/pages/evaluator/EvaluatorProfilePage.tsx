import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_EVALUATORS } from '../../mock/evaluatorsData';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Award, Mail, Building, Briefcase, ShieldCheck } from 'lucide-react';

export const EvaluatorProfilePage: React.FC = () => {
  const { user } = useAuth();
  const evaluator =
    MOCK_EVALUATORS.find((e) => e.email.toLowerCase() === user?.email.toLowerCase()) ||
    MOCK_EVALUATORS[0];

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      <div className="border-b border-[#141f17] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Evaluator Profile
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Jury panel credentials and assigned evaluation scope.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#141f17]">
          <Avatar src={evaluator.avatarUrl} name={evaluator.name} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-white">{evaluator.name}</h2>
            <p className="text-xs text-amber-400 font-mono mt-0.5">{evaluator.designation}</p>
            <p className="text-xs text-gray-400 mt-1">{evaluator.organization}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-[#070a08] border border-[#141f17]">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Official Email</span>
            <div className="flex items-center gap-2 text-xs text-gray-200">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>{evaluator.email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070a08] border border-[#141f17]">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Affiliated Organization</span>
            <div className="flex items-center gap-2 text-xs text-gray-200">
              <Building className="w-3.5 h-3.5 text-gray-500" />
              <span>{evaluator.organization}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070a08] border border-[#141f17]">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Assigned Teams Queue</span>
            <span className="text-xs font-mono font-bold text-white">
              {evaluator.assignedTeamIds.length} Teams Assigned
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070a08] border border-[#141f17]">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Jury Status</span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Active Jury Member
            </span>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[#141f17]">
          <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2 font-semibold">
            Domain Expertise Areas:
          </span>
          <div className="flex flex-wrap gap-2">
            {evaluator.expertise.map((exp) => (
              <span
                key={exp}
                className="px-2.5 py-1 rounded-lg bg-[#070a08] border border-[#1a2b1f] text-xs font-mono text-[#00e575]"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
