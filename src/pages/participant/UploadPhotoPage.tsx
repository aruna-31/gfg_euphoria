import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { teamService } from '../../services/teamService';
import { Team } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Sparkles,
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
    const t = await teamService.getTeamById(user?.teamId || 'TEAM-001');
    setTeam(t);
    if (t?.photoUrl) {
      setPreviewUrl(t.photoUrl);
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
      await new Promise((r) => setTimeout(r, 900));
      clearInterval(interval);
      setUploadProgress(100);

      const updated = await teamService.uploadPhoto(team.id, previewUrl);
      setTeam(updated);

      playSuccess();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00b259', '#38bdf8', '#ffffff'],
      });

      addToast('SUCCESS', 'Team photo successfully verified and saved!');
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
    addToast('INFO', 'Team photo removed. Reverted to generated team avatar.');
  };

  // Sample presets for quick testing
  const samplePresets = [
    { label: 'Campus Team A', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Hackathon Squad B', url: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=600&auto=format&fit=crop&q=80' },
    { label: 'Developer Trio C', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-[#1b2b20] pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white">Official Team Photo Verification</h1>
          <Badge variant={team?.photoUrl ? 'green' : 'amber'} size="sm">
            {team?.photoUrl ? 'VERIFIED' : 'PENDING'}
          </Badge>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Upload a clear photograph of all registered team members together. This photo is visible to evaluators, judges, and on the live competition podium.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Dropzone & Upload Controls */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#00e575] bg-[#00b259]/10'
                  : 'border-[#223528] bg-[#090e0b] hover:border-[#00b259]/50 hover:bg-[#0c130f]'
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
                <div className="w-14 h-14 rounded-2xl bg-[#142017] border border-[#233829] flex items-center justify-center text-[#00e575] mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-gray-200">
                  Drag & drop team photograph here
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  or <span className="text-[#00e575] underline font-medium">browse local files</span> from your computer
                </p>
                <p className="text-[11px] text-gray-500 mt-2 font-mono">
                  Supported formats: PNG, JPG, JPEG, WEBP • Maximum: 5MB
                </p>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs font-mono text-gray-300">
                  <span>Uploading to hackathon staging CDN...</span>
                  <span className="text-[#00e575]">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-[#131d16] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00b259] to-[#00e575] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Presets */}
            <div className="mt-5 pt-4 border-t border-[#1a2b20]">
              <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5 mb-2">
                <Camera className="w-3.5 h-3.5 text-[#00e575]" />
                OR SELECT A HACKATHON DEMO PHOTO:
              </span>
              <div className="flex flex-wrap gap-2">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setPreviewUrl(preset.url);
                      setError(null);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0e1711] hover:bg-[#16241b] border border-[#1e2f23] text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save & Reset Actions */}
            <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-[#1a2b20]">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={!previewUrl && !team?.photoUrl}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-400" />}
              >
                Reset to Default Avatar
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
          <div className="p-4 rounded-xl bg-[#0a0f0c] border border-[#1b2b20] text-xs text-gray-400 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-[#00e575]" />
              <span>Photo Verification Criteria</span>
            </div>
            <p>• All registered team members must be clearly visible in a single frame.</p>
            <p>• Avoid blurred selfies or heavily filtered pictures.</p>
            <p>• This photo will be printed on final podium certificates.</p>
          </div>
        </div>

        {/* Right Column: Live In-App Preview */}
        <div className="space-y-4">
          <Card className="text-center">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3 text-left">
              Live In-App Preview
            </h3>

            <div className="p-4 rounded-xl bg-[#080d0a] border border-[#1b2b20] flex flex-col items-center">
              {previewUrl ? (
                <div className="relative group w-full">
                  <img
                    src={previewUrl}
                    alt="Team Preview"
                    className="w-full h-44 object-cover rounded-xl border border-[#00b259]/40 shadow-lg shadow-[#00b259]/10"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-[#00e575] border border-[#00b259]/30">
                    PREVIEW
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#132018] to-[#1c3224] border border-[#00b259]/40 text-[#00e575] flex items-center justify-center font-mono text-2xl font-bold my-4">
                  {team?.name ? team.name.slice(0, 2).toUpperCase() : 'NV'}
                </div>
              )}

              <h4 className="text-base font-bold text-white mt-3">{team?.name}</h4>
              <p className="text-xs text-gray-400">{team?.college}</p>

              <div className="mt-3 flex items-center gap-2">
                <Badge variant="green" size="sm">
                  {team?.id}
                </Badge>
                <Badge variant="blue" size="sm">
                  Rank #{team?.rank || 1}
                </Badge>
              </div>

              <div className="mt-4 pt-3 border-t border-[#19271e] w-full text-left text-[11px] text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Team Leader:</span>
                  <span className="text-white font-medium">{team?.leaderName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Members:</span>
                  <span className="text-white font-medium">{team?.members?.length || 4}</span>
                </div>
                <div className="flex justify-between">
                  <span>Photo Status:</span>
                  <span className={team?.photoUrl ? 'text-[#00e575] font-semibold' : 'text-amber-400'}>
                    {team?.photoUrl ? 'Verified' : 'Pending Upload'}
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
