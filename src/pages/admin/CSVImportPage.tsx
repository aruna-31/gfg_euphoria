import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  importService,
  ColumnMapping,
  DEFAULT_COLUMN_MAPPING,
} from '../../services/importService';
import { reportService } from '../../services/reportService';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { SAMPLE_VALID_CSV, SAMPLE_INVALID_CSV } from '../../mock/sampleCSV';
import { CSVImportResult } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Sliders,
  Table as TableIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CSVImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const { playSuccess, playAlert } = useAudio();

  // Wizard Step: 1: Upload, 2: Map, 3: Validate, 4: Preview, 5: Complete
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Raw file & parsing
  const [fileName, setFileName] = useState('teams_batch_dataset.csv');
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(DEFAULT_COLUMN_MAPPING);

  // Validation output
  const [validationResult, setValidationResult] = useState<CSVImportResult | null>(null);
  const [previewFilter, setPreviewFilter] = useState<'ALL' | 'ERRORS_ONLY' | 'VALID_ONLY'>('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample data directly into the parser
  const loadSampleCSV = (csvContent: string, name: string) => {
    setFileName(name);
    const parsed = importService.parseCSVRaw(csvContent);
    setRawHeaders(parsed.headers);
    setRawRows(parsed.rows);

    // Auto-align default mapping if matches
    const autoMap: ColumnMapping = { ...DEFAULT_COLUMN_MAPPING };
    parsed.headers.forEach((h) => {
      const lower = h.toLowerCase();
      if (lower.includes('team_id') || lower === 'teamid') autoMap.teamId = h;
      if (lower.includes('team_name') || lower === 'teamname') autoMap.teamName = h;
      if (lower.includes('college')) autoMap.collegeName = h;
      if (lower.includes('leader_name')) autoMap.leaderName = h;
      if (lower.includes('leader_email')) autoMap.leaderEmail = h;
    });
    setColumnMapping(autoMap);

    setCurrentStep(2);
    addToast('INFO', `Loaded ${name} with ${parsed.rows.length} records.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          loadSampleCSV(text, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  // Run validation
  const handleProceedToValidation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const result = importService.validateCSV(rawRows, columnMapping, fileName);
      setValidationResult(result);
      setIsProcessing(false);
      setCurrentStep(3);

      if (result.invalidRows === 0) {
        playSuccess();
      } else {
        playAlert();
      }
    }, 400);
  };

  // Download error log
  const handleDownloadErrorReport = () => {
    if (!validationResult || validationResult.issues.length === 0) return;
    const csvContent = importService.generateErrorReportCSV(validationResult.issues);
    reportService.downloadFile(`import_errors_${Date.now()}.csv`, csvContent);
    addToast('INFO', 'Downloaded validation error report.');
  };

  // Confirm and Commit Import
  const handleConfirmImport = async () => {
    setIsProcessing(true);
    try {
      const count = await importService.commitImport(rawRows, columnMapping, true);
      setImportedCount(count);

      playSuccess();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00b259', '#00e575', '#ffffff'],
      });

      setCurrentStep(5);
      addToast('SUCCESS', `Successfully ingested ${count} teams into live directory!`);
    } catch {
      addToast('ALERT', 'Import commit encountered an issue. Please retry.');
      playAlert();
    } finally {
      setIsProcessing(false);
    }
  };

  const stepsHeader = [
    { num: 1, label: 'Upload CSV' },
    { num: 2, label: 'Map Columns' },
    { num: 3, label: 'Validation' },
    { num: 4, label: 'Preview' },
    { num: 5, label: 'Complete' },
  ];

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2b20] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">CSV Team Ingestion Pipeline</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Batch import participant rosters, colleges, and single-identity team leader accounts.
          </p>
        </div>

        <Badge variant="green" size="sm">
          REST / CSV ABSTRACTION
        </Badge>
      </div>

      {/* 5-Step Visual Wizard Bar */}
      <div className="grid grid-cols-5 gap-2 bg-[#090e0b] p-2.5 rounded-xl border border-[#1b2b20]">
        {stepsHeader.map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;

          return (
            <div
              key={s.num}
              className={`p-2 rounded-lg text-center transition-all ${
                isCurrent
                  ? 'bg-[#00b259] text-black font-bold shadow-md shadow-[#00b259]/20'
                  : isDone
                  ? 'bg-[#101b13] text-[#00e575] border border-[#00b259]/30 font-medium'
                  : 'text-gray-500 bg-transparent'
              }`}
            >
              <div className="text-[10px] font-mono leading-none">STEP 0{s.num}</div>
              <div className="text-xs truncate font-semibold mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Upload CSV */}
      {currentStep === 1 && (
        <Card className="p-8 space-y-6 text-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#223528] hover:border-[#00b259]/50 rounded-2xl p-10 cursor-pointer bg-[#080d0a] hover:bg-[#0c130f] transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-[#142017] border border-[#233829] flex items-center justify-center text-[#00e575] mx-auto mb-3">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">
              Drag and drop your Hackathon CSV file here
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              or <span className="text-[#00e575] underline font-medium">browse local files</span> from your computer
            </p>
            <p className="text-[11px] font-mono text-gray-500 mt-3">
              Expected fields: team_id, team_name, college_name, team_leader_email, member rosters...
            </p>
          </div>

          {/* Quick Demo Sample Loaders */}
          <div className="pt-4 border-t border-[#1a2b20] text-left">
            <span className="text-xs font-mono text-gray-400 block mb-2 font-semibold">
              OR TEST WITH PRE-LOADED SAMPLES:
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => loadSampleCSV(SAMPLE_VALID_CSV, 'pristine_teams_batch.csv')}
                className="px-3.5 py-2 rounded-xl bg-[#0e1711] hover:bg-[#142319] border border-[#1e2f23] text-xs text-emerald-300 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#00e575]" />
                <span>Load 100% Valid CSV (5 Teams)</span>
              </button>

              <button
                onClick={() => loadSampleCSV(SAMPLE_INVALID_CSV, 'teams_with_anomalies.csv')}
                className="px-3.5 py-2 rounded-xl bg-[#0e1711] hover:bg-[#142319] border border-[#1e2f23] text-xs text-amber-300 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Load Sample with Validation Anomalies (Duplicate IDs, Invalid Email)</span>
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2: Map Columns */}
      {currentStep === 2 && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#1b2b20] pb-3">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                Step 2: Map CSV Headers to Backend Schema
              </h3>
              <p className="text-xs text-gray-400">
                Found {rawHeaders.length} headers in <strong className="text-white">{fileName}</strong> ({rawRows.length} rows).
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentStep(1)}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Re-upload
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Team ID */}
            <div className="p-3 bg-[#080d0a] rounded-xl border border-[#1b2b20]">
              <label className="font-bold text-gray-200 block mb-1">
                Team Identifier (Required)
              </label>
              <select
                value={columnMapping.teamId}
                onChange={(e) => setColumnMapping({ ...columnMapping, teamId: e.target.value })}
                className="w-full bg-[#0e1711] border border-[#203627] rounded-lg p-2 text-white font-mono"
              >
                {rawHeaders.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Name */}
            <div className="p-3 bg-[#080d0a] rounded-xl border border-[#1b2b20]">
              <label className="font-bold text-gray-200 block mb-1">
                Team Name (Required)
              </label>
              <select
                value={columnMapping.teamName}
                onChange={(e) => setColumnMapping({ ...columnMapping, teamName: e.target.value })}
                className="w-full bg-[#0e1711] border border-[#203627] rounded-lg p-2 text-white font-mono"
              >
                {rawHeaders.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* College */}
            <div className="p-3 bg-[#080d0a] rounded-xl border border-[#1b2b20]">
              <label className="font-bold text-gray-200 block mb-1">
                College / Institution Name
              </label>
              <select
                value={columnMapping.collegeName}
                onChange={(e) => setColumnMapping({ ...columnMapping, collegeName: e.target.value })}
                className="w-full bg-[#0e1711] border border-[#203627] rounded-lg p-2 text-white font-mono"
              >
                {rawHeaders.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Leader Name */}
            <div className="p-3 bg-[#080d0a] rounded-xl border border-[#1b2b20]">
              <label className="font-bold text-gray-200 block mb-1">
                Team Leader Full Name (Required)
              </label>
              <select
                value={columnMapping.leaderName}
                onChange={(e) => setColumnMapping({ ...columnMapping, leaderName: e.target.value })}
                className="w-full bg-[#0e1711] border border-[#203627] rounded-lg p-2 text-white font-mono"
              >
                {rawHeaders.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Leader Email */}
            <div className="p-3 bg-[#080d0a] rounded-xl border border-[#1b2b20] sm:col-span-2">
              <label className="font-bold text-[#00e575] block mb-1">
                Team Leader Registered Email (Login Identity • Required)
              </label>
              <select
                value={columnMapping.leaderEmail}
                onChange={(e) => setColumnMapping({ ...columnMapping, leaderEmail: e.target.value })}
                className="w-full bg-[#0e1711] border border-[#203627] rounded-lg p-2 text-white font-mono"
              >
                {rawHeaders.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1b2b20] flex justify-end gap-3">
            <Button
              variant="primary"
              onClick={handleProceedToValidation}
              isLoading={isProcessing}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Run In-Depth Validation
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Validation Summary */}
      {currentStep === 3 && validationResult && (
        <Card className="p-6 space-y-6">
          <div className="border-b border-[#1b2b20] pb-3">
            <h3 className="text-sm font-bold font-mono uppercase text-white">
              Step 3: Validation Results
            </h3>
            <p className="text-xs text-gray-400">
              Audit for duplicate keys, invalid email patterns, and missing mandatory values.
            </p>
          </div>

          {/* 3 Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0e1f14] border border-[#1f3f2a] flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-[#00e575]" />
              <div>
                <span className="text-2xl font-mono font-bold text-white block">
                  {validationResult.validRows}
                </span>
                <span className="text-xs text-[#00e575] font-semibold">Valid Ingestion Records</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1f1a0e] border border-[#3f351f] flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <div>
                <span className="text-2xl font-mono font-bold text-white block">
                  {validationResult.issues.filter((i) => i.severity === 'WARNING').length}
                </span>
                <span className="text-xs text-amber-300 font-semibold">Non-blocking Warnings</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#211111] border border-[#441f1f] flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <span className="text-2xl font-mono font-bold text-white block">
                  {validationResult.invalidRows}
                </span>
                <span className="text-xs text-red-300 font-semibold">Critical Errors Detected</span>
              </div>
            </div>
          </div>

          {/* Issues List if any */}
          {validationResult.issues.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-gray-300">
                  Detected Anomalies Log ({validationResult.issues.length} Issues)
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadErrorReport}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download Error Report (.CSV)
                </Button>
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-[#18261c] border border-[#1b2b20] rounded-xl bg-[#080d0a]">
                {validationResult.issues.map((issue, idx) => (
                  <div key={idx} className="p-2.5 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          issue.severity === 'ERROR'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        ROW {issue.row}
                      </span>
                      <span className="font-mono text-gray-400">{issue.field}:</span>
                      <span className="text-gray-200 truncate">{issue.issue}</span>
                    </div>
                    {issue.value && (
                      <span className="text-[10px] font-mono text-gray-500 bg-[#121c15] px-2 py-0.5 rounded shrink-0">
                        Value: "{issue.value}"
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#1b2b20] flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentStep(2)}>
              Back to Mapping
            </Button>

            <Button
              variant="primary"
              onClick={() => setCurrentStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Table Preview
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Table Preview */}
      {currentStep === 4 && validationResult && (
        <Card className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2b20] pb-3">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                Step 4: Data Ingestion Preview
              </h3>
              <p className="text-xs text-gray-400">
                Inspect mapped entries prior to committing to the hackathon directory.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Filter:</span>
              <select
                value={previewFilter}
                onChange={(e) => setPreviewFilter(e.target.value as any)}
                className="bg-[#080d0a] border border-[#1b2b20] rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-[#00b259]"
              >
                <option value="ALL">All Rows ({validationResult.totalRows})</option>
                <option value="VALID_ONLY">Valid Only ({validationResult.validRows})</option>
                <option value="ERRORS_ONLY">Errors Only ({validationResult.invalidRows})</option>
              </select>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto border border-[#1b2b20] rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#070b09] border-b border-[#17251c] text-[11px] font-mono text-gray-400 uppercase">
                <tr>
                  <th className="py-2.5 px-3 w-14 text-center">Row</th>
                  <th className="py-2.5 px-3">Team ID</th>
                  <th className="py-2.5 px-3">Team Name</th>
                  <th className="py-2.5 px-3">College</th>
                  <th className="py-2.5 px-3">Team Leader Email</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#142017]">
                {(validationResult.previewData || []).map((row: any, idx: number) => {
                  const rowNum = idx + 2;
                  const rowErrors = validationResult.issues.filter((i) => i.row === rowNum && i.severity === 'ERROR');
                  const hasError = rowErrors.length > 0;

                  if (previewFilter === 'VALID_ONLY' && hasError) return null;
                  if (previewFilter === 'ERRORS_ONLY' && !hasError) return null;

                  return (
                    <tr
                      key={idx}
                      className={hasError ? 'bg-red-500/10 text-red-200' : 'hover:bg-[#0e1611] text-gray-300'}
                    >
                      <td className="py-2.5 px-3 text-center font-mono">{rowNum}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-white">
                        {row[columnMapping.teamId] || <span className="text-red-400 italic">EMPTY</span>}
                      </td>
                      <td className="py-2.5 px-3">
                        {row[columnMapping.teamName] || <span className="text-red-400 italic">EMPTY</span>}
                      </td>
                      <td className="py-2.5 px-3">
                        {row[columnMapping.collegeName] || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {row[columnMapping.leaderEmail] || <span className="text-red-400 italic">EMPTY</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {hasError ? (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/40">
                            INVALID
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#00b259]/20 text-[#00e575] px-2 py-0.5 rounded border border-[#00b259]/40">
                            READY
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-[#1b2b20] flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentStep(3)}>
              Back to Validation Summary
            </Button>

            <Button
              variant="primary"
              onClick={handleConfirmImport}
              isLoading={isProcessing}
              disabled={validationResult.validRows === 0}
            >
              Confirm & Ingest {validationResult.validRows} Valid Records
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: Complete */}
      {currentStep === 5 && (
        <Card className="p-10 text-center space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#00b259]/20 border border-[#00b259]/40 text-[#00e575] flex items-center justify-center mx-auto shadow-xl shadow-[#00b259]/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Ingestion Pipeline Completed!</h2>
          <p className="text-xs text-gray-400">
            Successfully imported <strong className="text-[#00e575]">{importedCount} teams</strong> into the active hackathon registry. Single-identity credentials and team workspaces are now generated.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setCurrentStep(1);
                setValidationResult(null);
              }}
            >
              Import Another File
            </Button>
            <Button variant="primary" onClick={() => navigate('/admin/teams')}>
              Inspect Teams Roster
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
