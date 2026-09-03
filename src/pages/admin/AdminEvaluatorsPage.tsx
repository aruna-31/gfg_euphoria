import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluatorService } from '../../services/evaluatorService';
import { Evaluator } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ShieldCheck, Mail, Building, Plus, Users } from 'lucide-react';

export const AdminEvaluatorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluators();
  }, []);

  const loadEvaluators = async () => {
    setLoading(true);
    try {
      const data = await evaluatorService.getAllEvaluators();
      setEvaluators(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b20] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Evaluators & Jury Directory</h1>
            <Badge variant="green" size="sm">
              {evaluators.length} ACTIVE JURORS
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Manage jury members, track workloads, and review scoring throughput.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate('/admin/assignments')}
          leftIcon={<Users className="w-3.5 h-3.5" />}
        >
          Manage Assignments
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evaluators.map((evaluator) => (
          <Card key={evaluator.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <Avatar src={evaluator.avatarUrl} name={evaluator.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white leading-tight truncate">
                    {evaluator.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{evaluator.organization}</p>
                  <p className="text-[11px] font-mono text-[#00e575] mt-0.5">
                    {evaluator.designation}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080d0a] border border-[#18261d] space-y-1 mb-3 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Assigned Teams:</span>
                  <span className="font-mono font-bold text-white">
                    {evaluator.assignedTeamIds.length}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Completed Reviews:</span>
                  <span className="font-mono text-[#00e575]">{evaluator.completedCount}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Pending In Docket:</span>
                  <span className="font-mono text-amber-400">{evaluator.pendingCount}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {evaluator.expertise.map((exp, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-[#0d1611] text-gray-300 px-2 py-0.5 rounded border border-[#1b2b20]"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#17251c] flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-gray-400">{evaluator.email}</span>
              <Badge variant="green" size="sm">
                ACTIVE
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
