import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  DownloadCloud,
  FileSpreadsheet,
  Users,
  Award,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { addToast } = useNotification();
  const { playSuccess } = useAudio();
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

  const handleExportMarksheet = async () => {
    setDownloadingReport('marksheet');
    try {
      const csv = await reportService.exportMarksheetCSV();
      if (!csv) {
        throw new Error('No data found to export');
      }
      reportService.downloadFile(`gfg_euphoria_master_marksheet_${Date.now()}.csv`, csv);
      playSuccess();
      addToast('SUCCESS', 'Downloaded official Hackathon Evaluation Marksheet.');
    } catch (err) {
      console.error('Marksheet export failed:', err);
      addToast('ALERT', 'Failed to generate marksheet. Please check connectivity and retry.');
    } finally {
      setDownloadingReport(null);
    }
  };

  const handleExportTeams = async () => {
    setDownloadingReport('teams');
    try {
      const csv = await reportService.exportTeamsCSV();
      if (!csv) {
        throw new Error('No teams data found to export');
      }
      reportService.downloadFile(`gfg_euphoria_teams_roster_${Date.now()}.csv`, csv);
      playSuccess();
      addToast('SUCCESS', 'Downloaded registered Teams Roster CSV.');
    } catch (err) {
      console.error('Teams export failed:', err);
      addToast('ALERT', 'Failed to export teams roster.');
    } finally {
      setDownloadingReport(null);
    }
  };

  const handleExportParticipants = async () => {
    setDownloadingReport('participants');
    try {
      const csv = await reportService.exportParticipantsCSV();
      if (!csv) {
        throw new Error('No participants data found to export');
      }
      reportService.downloadFile(`gfg_euphoria_participants_roster_${Date.now()}.csv`, csv);
      playSuccess();
      addToast('SUCCESS', 'Downloaded complete Participants Registry CSV.');
    } catch (err) {
      console.error('Participants export failed:', err);
      addToast('ALERT', 'Failed to export participants registry.');
    } finally {
      setDownloadingReport(null);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <div className="border-b border-[#1b2b20] pb-5">
        <div className="flex items-center gap-2">
          <DownloadCloud className="w-5 h-5 text-[#00e575]" />
          <h1 className="text-2xl font-extrabold text-white">Reports & Official Data Exports</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Generate compliant audit logs, evaluation marksheets, and institution participation rosters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Report 1: Official Marksheet */}
        <Card className="p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#142217] border border-[#203627] flex items-center justify-center text-[#00e575] mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Master Evaluation Marksheet</h3>
            <p className="text-xs text-gray-400 mt-1">
              Consolidated scores per round (Round 1, Round 2, Round 3), final calculated podium ranks, and official evaluator qualitative remarks.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleExportMarksheet}
            isLoading={downloadingReport === 'marksheet'}
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            className="w-full"
          >
            Export Marksheet (.CSV)
          </Button>
        </Card>

        {/* Report 2: Teams Directory */}
        <Card className="p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#142217] border border-[#203627] flex items-center justify-center text-sky-400 mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Registered Teams Roster</h3>
            <p className="text-xs text-gray-400 mt-1">
              Team metadata, college representations, team leader contacts, verified photo status, and problem statement track assignments.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={handleExportTeams}
            isLoading={downloadingReport === 'teams'}
            leftIcon={<DownloadCloud className="w-4 h-4" />}
            className="w-full"
          >
            Export Teams List (.CSV)
          </Button>
        </Card>

        {/* Report 3: Participants List */}
        <Card className="p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#0F1E2E] border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Participant Master Registry</h3>
            <p className="text-xs text-gray-400 mt-1">
              Complete student participant database with institution breakdown, team leader flags, member roles, and contact emails.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={handleExportParticipants}
            isLoading={downloadingReport === 'participants'}
            leftIcon={<DownloadCloud className="w-4 h-4" />}
            className="w-full"
          >
            Export Participants (.CSV)
          </Button>
        </Card>
      </div>
    </div>
  );
};
