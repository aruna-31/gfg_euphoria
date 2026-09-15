import { teamService } from './teamService';
import { evaluationService } from './evaluationService';
import { roundService } from './roundService';

class ReportService {
  public async exportTeamsCSV(): Promise<string> {
    const teams = await teamService.getAllTeams();
    const headers = 'Team ID,Team Name,College,Leader Name,Leader Email,Phone,Problem ID,Members Count,Total Score,Status\n';
    const rows = (teams || [])
      .map(
        (t) =>
          `"${t.id || ''}","${(t.name || '').replace(/"/g, '""')}","${(t.college || '').replace(/"/g, '""')}","${(t.leaderName || '').replace(/"/g, '""')}","${(t.leaderEmail || '').replace(/"/g, '""')}","${(t.leaderPhone || '').replace(/"/g, '""')}","${t.problemStatementId || 'N/A'}","${t.members?.length || 0}","${t.totalScore ?? 0}","${t.status || 'ACTIVE'}"`
      )
      .join('\n');
    return headers + rows;
  }

  public async exportParticipantsCSV(): Promise<string> {
    const teams = await teamService.getAllTeams();
    const headers = 'Participant ID,Name,Email,College,Team ID,Team Name,Role,Is Leader\n';
    const lines: string[] = [];

    (teams || []).forEach((t) => {
      (t.members || []).forEach((m) => {
        lines.push(
          `"${m.id || ''}","${(m.name || '').replace(/"/g, '""')}","${(m.email || '').replace(/"/g, '""')}","${(m.college || t.college || '').replace(/"/g, '""')}","${t.id || ''}","${(t.name || '').replace(/"/g, '""')}","${m.roleInTeam || (m.isLeader ? 'Leader' : 'Member')}","${m.isLeader ? 'YES' : 'NO'}"`
        );
      });
    });

    return headers + lines.join('\n');
  }

  public async exportMarksheetCSV(): Promise<string> {
    const [teams, rounds, evaluations] = await Promise.all([
      teamService.getAllTeams(),
      roundService.getAllRounds(),
      evaluationService.getAllEvaluations(),
    ]);

    const safeRounds = Array.isArray(rounds) && rounds.length > 0 ? rounds : [
      { id: 1, number: 1, name: 'Round 1' },
      { id: 2, number: 2, name: 'Round 2' },
      { id: 3, number: 3, name: 'Round 3' },
    ];

    const roundHeaders = safeRounds.map((r) => `Round ${r.number || r.id} Score`).join(',');

    // Unique round + evaluator pairs if any
    const evaluatorColumns = (evaluations || []).filter(
      (evaluation, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.roundId === evaluation.roundId &&
            candidate.evaluatorId?.toLowerCase() === evaluation.evaluatorId?.toLowerCase()
        ) === index
    );

    const evaluatorHeaders = evaluatorColumns.length > 0
      ? ',' + evaluatorColumns.map((e) => `R${e.roundId} (${e.evaluatorId})`).join(',')
      : '';

    const headers = `Team ID,Team Name,College,Leader Name,Leader Email,Problem ID,${roundHeaders}${evaluatorHeaders},Total Score,Rank,Evaluator Feedback\n`;

    const rows = (teams || []).map((t) => {
      const teamEvals = (evaluations || []).filter((e) => e.teamId === t.id);

      const rScores = safeRounds
        .map((r) => {
          const evalForRound = teamEvals.find((e) => e.roundId === r.id);
          const roundNum = Number(r.number || r.id);
          const scoresRecord = t.roundScores as Record<string | number, number> | undefined;
          const score = scoresRecord?.[roundNum] ?? scoresRecord?.[r.id] ?? evalForRound?.totalScore ?? 0;
          return `"${score}"`;
        })
        .join(',');

      const evaluatorScores = evaluatorColumns.length > 0
        ? ',' + evaluatorColumns
            .map((column) => {
              const ev = teamEvals.find(
                (candidate) =>
                  candidate.roundId === column.roundId &&
                  candidate.evaluatorId?.toLowerCase() === column.evaluatorId?.toLowerCase()
              );
              return `"${ev?.totalScore ?? ''}"`;
            })
            .join(',')
        : '';

      const feedbackCombined = teamEvals
        .map((e) => {
          let str = `[Round ${e.roundId}]: ${e.feedback || 'Evaluated'}`;
          if (e.strengths) str += ` (Strengths: ${e.strengths})`;
          if (e.improvements) str += ` (Improvements: ${e.improvements})`;
          return str;
        })
        .join(' | ')
        .replace(/"/g, '""');

      const computedTotal = typeof t.totalScore === 'number' && !isNaN(t.totalScore)
        ? t.totalScore
        : teamEvals.reduce((sum, e) => sum + (e.totalScore || 0), 0);

      return `"${t.id || ''}","${(t.name || '').replace(/"/g, '""')}","${(t.college || '').replace(/"/g, '""')}","${(t.leaderName || '').replace(/"/g, '""')}","${(t.leaderEmail || '').replace(/"/g, '""')}","${t.problemStatementId || 'N/A'}",${rScores}${evaluatorScores},"${computedTotal}","${t.rank || '-'}","${feedbackCombined}"`;
    });

    return headers + rows.join('\n');
  }

  public downloadFile(filename: string, content: string, mimeType: string = 'text/csv;charset=utf-8;') {
    // UTF-8 Byte Order Mark (BOM) ensures characters and quotes open cleanly in Excel & Google Sheets
    const blob = new Blob(['\uFEFF' + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

export const reportService = new ReportService();
