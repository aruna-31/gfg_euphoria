import { teamService } from './teamService';
import { evaluationService } from './evaluationService';
import { roundService } from './roundService';

class ReportService {
  public async exportTeamsCSV(): Promise<string> {
    const teams = await teamService.getAllTeams();
    const headers = 'Team ID,Team Name,College,Leader Name,Leader Email,Phone,Problem ID,Members Count,Total Score,Status\n';
    const rows = teams
      .map(
        (t) =>
          `"${t.id}","${t.name}","${t.college}","${t.leaderName}","${t.leaderEmail}","${t.leaderPhone}","${t.problemStatementId || 'N/A'}","${t.members?.length || 0}","${t.totalScore}","${t.status}"`
      )
      .join('\n');
    return headers + rows;
  }

  public async exportParticipantsCSV(): Promise<string> {
    const teams = await teamService.getAllTeams();
    const headers = 'Participant ID,Name,Email,College,Team ID,Team Name,Role,Is Leader\n';
    const lines: string[] = [];

    teams.forEach((t) => {
      (t.members || []).forEach((m) => {
        lines.push(
          `"${m.id}","${m.name}","${m.email}","${m.college}","${t.id}","${t.name}","${m.roleInTeam || 'Member'}","${m.isLeader ? 'YES' : 'NO'}"`
        );
      });
    });

    return headers + lines.join('\n');
  }

  public async exportMarksheetCSV(): Promise<string> {
    const teams = await teamService.getAllTeams();
    const rounds = await roundService.getAllRounds();
    const evaluations = await evaluationService.getAllEvaluations();

    const roundHeaders = rounds.map((r) => `Round ${r.id} Score`).join(',');
    const headers = `Team ID,Team Name,College,${roundHeaders},Total Score,Rank,Evaluator Feedback\n`;

    const rows = teams.map((t) => {
      const rScores = rounds.map((r) => t.roundScores[r.id] || 0).join(',');
      const teamEvals = evaluations.filter((e) => e.teamId === t.id);
      const feedbackCombined = teamEvals.map((e) => `[R${e.roundId}]: ${e.feedback}`).join(' | ').replace(/"/g, '""');
      return `"${t.id}","${t.name}","${t.college}",${rScores},"${t.totalScore}","${t.rank || '-'}","${feedbackCombined}"`;
    });

    return headers + rows.join('\n');
  }

  public downloadFile(filename: string, content: string, mimeType: string = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const reportService = new ReportService();
