import { CSVImportResult, CSVValidationIssue, Team } from '../types';
import { teamService } from './teamService';

export interface ColumnMapping {
  teamId: string;
  teamName: string;
  collegeName: string;
  leaderName: string;
  leaderEmail: string;
  member1Name?: string;
  member1Email?: string;
  member2Name?: string;
  member2Email?: string;
  member3Name?: string;
  member3Email?: string;
}

export const DEFAULT_COLUMN_MAPPING: ColumnMapping = {
  teamId: 'team_id',
  teamName: 'team_name',
  collegeName: 'college_name',
  leaderName: 'team_leader_name',
  leaderEmail: 'team_leader_email',
  member1Name: 'member_1_name',
  member1Email: 'member_1_email',
  member2Name: 'member_2_name',
  member2Email: 'member_2_email',
  member3Name: 'member_3_name',
  member3Email: 'member_3_email',
};

class ImportService {
  public parseCSVRaw(csvContent: string): { headers: string[]; rows: Record<string, string>[] } {
    const records: string[][] = [];
    let record: string[] = [];
    let value = '';
    let quoted = false;

    for (let index = 0; index < csvContent.length; index += 1) {
      const character = csvContent[index];
      const nextCharacter = csvContent[index + 1];
      if (character === '"' && quoted && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (character === ',' && !quoted) {
        record.push(value.trim());
        value = '';
      } else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && nextCharacter === '\n') index += 1;
        record.push(value.trim());
        if (record.some((cell) => cell.length > 0)) records.push(record);
        record = [];
        value = '';
      } else {
        value += character;
      }
    }

    record.push(value.trim());
    if (record.some((cell) => cell.length > 0)) records.push(record);
    if (records.length === 0) return { headers: [], rows: [] };

    const headers = records[0].map((header) => header.replace(/^["']|["']$/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < records.length; i++) {
      const values = records[i];
      const rowObj: Record<string, string> = { _rowIndex: String(i + 1) };

      headers.forEach((header, index) => {
        rowObj[header] = values[index] !== undefined ? values[index] : '';
      });

      rows.push(rowObj);
    }

    return { headers, rows };
  }

  public validateCSV(
    rows: Record<string, string>[],
    mapping: ColumnMapping,
    fileName: string
  ): CSVImportResult {
    const issues: CSVValidationIssue[] = [];
    const seenTeamIds = new Set<string>();
    const seenLeaderEmails = new Set<string>();
    let validCount = 0;
    let invalidCount = 0;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    rows.forEach((row, idx) => {
      const rowNum = parseInt(row._rowIndex || String(idx + 2), 10);
      let rowHasError = false;

      const teamId = row[mapping.teamId]?.trim();
      const teamName = row[mapping.teamName]?.trim();
      const collegeName = row[mapping.collegeName]?.trim();
      const leaderName = row[mapping.leaderName]?.trim();
      const leaderEmail = row[mapping.leaderEmail]?.trim();

      // Check Team ID
      if (!teamId) {
        issues.push({
          row: rowNum,
          field: 'team_id',
          value: '',
          issue: 'Missing required Team ID',
          severity: 'ERROR',
        });
        rowHasError = true;
      } else if (seenTeamIds.has(teamId.toUpperCase())) {
        issues.push({
          row: rowNum,
          field: 'team_id',
          value: teamId,
          issue: `Duplicate Team ID: ${teamId} is already defined`,
          severity: 'ERROR',
        });
        rowHasError = true;
      } else {
        seenTeamIds.add(teamId.toUpperCase());
      }

      // Check Team Name
      if (!teamName) {
        issues.push({
          row: rowNum,
          field: 'team_name',
          value: '',
          issue: 'Missing team name',
          severity: 'ERROR',
        });
        rowHasError = true;
      }

      // Check College
      if (!collegeName) {
        issues.push({
          row: rowNum,
          field: 'college_name',
          value: '',
          issue: 'College name is blank (recommended for grouping)',
          severity: 'WARNING',
        });
      }

      // Check Leader Name
      if (!leaderName) {
        issues.push({
          row: rowNum,
          field: 'team_leader_name',
          value: '',
          issue: 'Missing team leader name',
          severity: 'ERROR',
        });
        rowHasError = true;
      }

      // Check Leader Email
      if (!leaderEmail) {
        issues.push({
          row: rowNum,
          field: 'team_leader_email',
          value: '',
          issue: 'Missing team leader email (required for login credential)',
          severity: 'ERROR',
        });
        rowHasError = true;
      } else if (!emailRegex.test(leaderEmail)) {
        issues.push({
          row: rowNum,
          field: 'team_leader_email',
          value: leaderEmail,
          issue: 'Invalid email address format',
          severity: 'ERROR',
        });
        rowHasError = true;
      } else if (seenLeaderEmails.has(leaderEmail.toLowerCase())) {
        issues.push({
          row: rowNum,
          field: 'team_leader_email',
          value: leaderEmail,
          issue: `Duplicate leader email: ${leaderEmail} is already registered to another team`,
          severity: 'ERROR',
        });
        rowHasError = true;
      } else {
        seenLeaderEmails.add(leaderEmail.toLowerCase());
      }

      if (rowHasError) {
        invalidCount++;
      } else {
        validCount++;
      }
    });

    return {
      fileName,
      totalRows: rows.length,
      validRows: validCount,
      invalidRows: invalidCount,
      errorCount: issues.filter((i) => i.severity === 'ERROR').length,
      warningCount: issues.filter((i) => i.severity === 'WARNING').length,
      validTeams: [],
      issues,
      previewData: rows,
    };
  }

  public async commitImport(
    rows: Record<string, string>[],
    mapping: ColumnMapping,
    skipInvalid: boolean = true
  ): Promise<number> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newTeams: Team[] = [];

    rows.forEach((row, idx) => {
      const teamId = row[mapping.teamId]?.trim();
      const teamName = row[mapping.teamName]?.trim();
      const collegeName = row[mapping.collegeName]?.trim() || 'Independent College';
      const leaderName = row[mapping.leaderName]?.trim();
      const leaderEmail = row[mapping.leaderEmail]?.trim();

      const isValid = teamId && teamName && leaderName && leaderEmail && emailRegex.test(leaderEmail);

      if (!isValid && skipInvalid) return;

      const effectiveId = teamId || `TEAM-IMP-${idx + 1}`;
      const members = [
        {
          id: `p-${effectiveId}-lead`,
          name: leaderName || 'Team Leader',
          email: leaderEmail || '',
          college: collegeName,
          teamId: effectiveId,
          isLeader: true,
          roleInTeam: 'Team Leader',
        },
      ];

      // Add up to 3 optional members if mapped
      if (mapping.member1Name && row[mapping.member1Name]) {
        members.push({
          id: `p-${effectiveId}-1`,
          name: row[mapping.member1Name],
          email: (mapping.member1Email && row[mapping.member1Email]) || '',
          college: collegeName,
          teamId: effectiveId,
          isLeader: false,
          roleInTeam: 'Team Member',
        });
      }
      if (mapping.member2Name && row[mapping.member2Name]) {
        members.push({
          id: `p-${effectiveId}-2`,
          name: row[mapping.member2Name],
          email: (mapping.member2Email && row[mapping.member2Email]) || '',
          college: collegeName,
          teamId: effectiveId,
          isLeader: false,
          roleInTeam: 'Team Member',
        });
      }
      if (mapping.member3Name && row[mapping.member3Name]) {
        members.push({
          id: `p-${effectiveId}-3`,
          name: row[mapping.member3Name],
          email: (mapping.member3Email && row[mapping.member3Email]) || '',
          college: collegeName,
          teamId: effectiveId,
          isLeader: false,
          roleInTeam: 'Team Member',
        });
      }

      newTeams.push({
        id: effectiveId,
        name: teamName || `Team ${effectiveId}`,
        college: collegeName,
        leaderName: leaderName || 'Team Leader',
        leaderEmail: leaderEmail || '',
        leaderPhone: '+91 90000 00000',
        accessPassword: `GFG-${effectiveId}-26`,
        members,
        currentRound: 1,
        totalScore: 0,
        roundScores: {},
        status: 'REGISTERED',
        createdAt: new Date().toISOString(),
      });
    });

    return teamService.importTeams(newTeams);
  }

  public generateErrorReportCSV(issues: CSVValidationIssue[]): string {
    const header = 'Row,Field,Value,Severity,Issue Description\n';
    const rows = issues
      .map(
        (i) =>
          `"${i.row}","${i.field}","${(i.value || '').replace(/"/g, '""')}","${i.severity}","${i.issue.replace(/"/g, '""')}"`
      )
      .join('\n');
    return header + rows;
  }
}

export const importService = new ImportService();
