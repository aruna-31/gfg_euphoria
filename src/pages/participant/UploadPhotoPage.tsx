import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { teamService } from '../../services/teamService';
import { Team } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UploadPhotoPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const { playSuccess, playAlert } = useAudio();

  const [team, setTeam] = useState<Team | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTeam();
  }, [user]);

  const loadTeam = async () => {
    try {
      const queryId = user?.teamId || user?.email || 'TEAM-001';
      let t = await teamService.getTeamById(queryId);
      if (!t && user?.email) {
        t = await teamService.getTeamByLeaderEmail(user.email);
      }
      if (!t) {
        const all = await teamService.getAllTeams();
        if (all.length > 0) {
          t = all.find((x) => x.leaderEmail.toLowerCase() === user?.email?.toLowerCase()) || all[0];
        }
      }
      setTeam(t);
      if (t?.photoUrl) {
        setPreviewUrl(t.photoUrl);
      }
    } catch (err) {
      console.error('Failed to load team in photo page:', err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      playAlert();
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file exceeds the 5MB size limit.');
      playAlert();
      return;
    }

    // Read file for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleSavePhoto = async () => {
    if (!previewUrl || !team) return;

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    try {
      await new Promise((r) => setTimeout(r, 800));
      clearInterval(interval);
      setUploadProgress(100);

      const updated = await teamService.uploadPhoto(team.id, previewUrl);
      setTeam(updated);

      playSuccess();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#10B981', '#06B6D4', '#F59E0B'],
      });

      addToast('SUCCESS', 'Team squad photo verified and saved in database!');
    } catch {
      setError('Failed to save group photo. Please retry.');
      playAlert();
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!team) return;
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    const updated = await teamService.uploadPhoto(team.id, '');
    setTeam(updated);
    addToast('INFO', 'Squad photo cleared.');
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-emerald-500/20 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white uppercase font-['Outfit',sans-serif]">Official Squad Photo Verification</h1>
          <Badge variant={team?.photoUrl ? 'gfg' : 'amber'} size="sm">
            {team?.photoUrl ? 'VERIFIED' : 'PENDING'}
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Upload a clear photograph of all registered squad members together for jury verification and the Hackodessey 4.0 live competition showcase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Dropzone & Upload Controls */}
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-[#0F1E2E]/90 border border-emerald-500/25">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#22C55E] bg-emerald-950/60'
                  : 'border-slate-700/80 bg-[#0B1520] hover:border-emerald-500/60 hover:bg-[#0E2030]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-[#22C55E] mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Drag & drop team squad photograph here
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  or <span className="text-[#22C55E] underline font-medium">browse local files</span> from your system
                </p>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Supported formats: PNG, JPG, JPEG, WEBP • Max: 5MB
                </p>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Saving to database...</span>
                  <span className="text-emerald-400 font-bold">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2F8D46] to-[#22C55E] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Save & Reset Actions */}
            <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-700/60">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={!previewUrl && !team?.photoUrl}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
              >
                Reset Photo
              </Button>

              <Button
                variant="primary"
                onClick={handleSavePhoto}
                disabled={!previewUrl || isUploading}
                isLoading={isUploading}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Save & Verify Photo
              </Button>
            </div>
          </Card>

          {/* Verification Guidelines */}
          <div className="p-4 rounded-xl bg-[#0F1E2E]/80 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span>Squad Photo Verification Criteria</span>
            </div>
            <p>• All registered squad members (Leader + squad members) should be visible.</p>
            <p>• Avoid blurred images or excessive filters.</p>
            <p>• This verified photo will be presented on jury evaluation dashboards.</p>
          </div>
        </div>

        {/* Right Column: Live In-App Preview */}
        <div className="space-y-4">
          <Card className="text-center bg-[#0F1E2E]/90 border border-emerald-500/25">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 text-left font-bold">
              Live In-App Preview
            </h3>

            <div className="p-4 rounded-xl bg-[#0B1520] border border-slate-700/60 flex flex-col items-center">
              {previewUrl ? (
                <div className="relative group w-full">
                  <img
                    src={previewUrl}
                    alt="Team Squad Preview"
                    className="w-full h-44 object-cover rounded-xl border border-emerald-500/40 shadow-lg"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-mono">
                    PREVIEW
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[#22C55E] flex items-center justify-center font-mono text-2xl font-bold my-4">
                  <Camera className="w-8 h-8" />
                </div>
              )}

              <h4 className="text-base font-bold text-white mt-3">{team?.name}</h4>
              <p className="text-xs text-slate-400">{team?.college}</p>

              <div className="mt-3 flex items-center gap-2">
                <Badge variant="gfg" size="sm">
                  {team?.id}
                </Badge>
                <Badge variant="cyan" size="sm">
                  Rank #{team?.rank || 1}
                </Badge>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 w-full text-left text-[11px] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Team Leader:</span>
                  <span className="text-white font-medium">{team?.leaderName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Squad Size:</span>
                  <span className="text-white font-medium">{team?.members?.length || 4} Members</span>
                </div>
                <div className="flex justify-between">
                  <span>Photo Status:</span>
                  <span className={team?.photoUrl ? 'text-[#22C55E] font-semibold' : 'text-amber-400'}>
                    {team?.photoUrl ? 'Verified & Stored' : 'Pending Upload'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
