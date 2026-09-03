import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Sliders, ShieldCheck, Volume2, Save, Sparkles } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { addToast } = useNotification();
  const { playSuccess } = useAudio();

  const [hackathonName, setHackathonName] = useState('GFG Euphoria 2026');
  const [institution, setInstitution] = useState('Kalasalingam Academy of Research and Education (KARE)');
  const [maxMembers, setMaxMembers] = useState(4);
  const [singleLeaderEnforced, setSingleLeaderEnforced] = useState(true);
  const [photoUploadMandatory, setPhotoUploadMandatory] = useState(true);

  const handleSave = () => {
    playSuccess();
    addToast('SUCCESS', 'Platform parameters saved successfully.');
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      <div className="border-b border-[#1b2b20] pb-5">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#00e575]" />
          <h1 className="text-2xl font-extrabold text-white">Platform Settings & Rules</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Configure hackathon identity policies, maximum team capacity, and visual branding.
        </p>
      </div>

      <Card className="p-6 space-y-4 bg-[#090e0b]">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e575]">
          General Event Parameters
        </h3>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1">
            Hackathon Title
          </label>
          <input
            type="text"
            value={hackathonName}
            onChange={(e) => setHackathonName(e.target.value)}
            className="w-full bg-[#060907] border border-[#1b2b20] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00b259]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1">
            Host University / Chapter
          </label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full bg-[#060907] border border-[#1b2b20] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00b259]"
          />
        </div>

        <div className="pt-4 border-t border-[#18261d] space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e575]">
            Access & Authentication Constraints
          </h3>

          <label className="flex items-center gap-3 p-3 bg-[#060907] border border-[#18261d] rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={singleLeaderEnforced}
              onChange={(e) => setSingleLeaderEnforced(e.target.checked)}
              className="accent-[#00b259] w-4 h-4 rounded"
            />
            <div>
              <span className="text-xs font-bold text-white block">
                Single-Identity Team Leader Authentication Only
              </span>
              <span className="text-[11px] text-gray-400">
                Individual team members cannot create separate logins. All submissions restricted to leader email.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-[#060907] border border-[#18261d] rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={photoUploadMandatory}
              onChange={(e) => setPhotoUploadMandatory(e.target.checked)}
              className="accent-[#00b259] w-4 h-4 rounded"
            />
            <div>
              <span className="text-xs font-bold text-white block">
                Mandatory Group Photo Verification Before Scoring
              </span>
              <span className="text-[11px] text-gray-400">
                Teams must provide an official verified squad photo before Round 2 evaluations lock in.
              </span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-[#18261d] flex justify-end">
          <Button variant="primary" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
            Save Hackathon Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};
