import Match from "@/models/match.model";
import Standing from "@/models/standing.model";
import Team from "@/models/team.model";

/**
 * Calculates and updates standings based on completed matches
 */
export async function recalculateStandings() {
  try {
    // Get all teams
    const teams = await Team.find();

    // Get all completed matches
    const completedMatches = await Match.find({ matchStatus: "Completed" });

    // Initialize standings data for each team
    const standingsData = {};
    teams.forEach((team) => {
      standingsData[team._id.toString()] = {
        team: team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        setWon: 0,
        setLost: 0,
        points: 0,
      };
    });

    // Process each match to update standings data
    completedMatches.forEach((match) => {
      const homeTeamId = match.homeTeam._id.toString();
      const awayTeamId = match.awayTeam._id.toString();

      // Ensure both teams exist in standings data
      if (!standingsData[homeTeamId] || !standingsData[awayTeamId]) {
        return;
      }

      // Increment games played
      standingsData[homeTeamId].played++;
      standingsData[awayTeamId].played++;

      // Update sets won/lost
      if (match.scores && match.scores.totalSets) {
        standingsData[homeTeamId].setWon += match.scores.totalSets.home;
        standingsData[homeTeamId].setLost += match.scores.totalSets.away;
        standingsData[awayTeamId].setWon += match.scores.totalSets.away;
        standingsData[awayTeamId].setLost += match.scores.totalSets.home;
      }

      // Update win/draw/loss records and points
      if (match.winnerTeam === "home") {
        standingsData[homeTeamId].won++;
        standingsData[homeTeamId].points += 3; // 3 points for a win
        standingsData[awayTeamId].lost++;
      } else if (match.winnerTeam === "away") {
        standingsData[awayTeamId].won++;
        standingsData[awayTeamId].points += 3; // 3 points for a win
        standingsData[homeTeamId].lost++;
      } else if (match.winnerTeam === "draw") {
        standingsData[homeTeamId].drawn++;
        standingsData[awayTeamId].drawn++;
        standingsData[homeTeamId].points += 1; // 1 point for a draw
        standingsData[awayTeamId].points += 1; // 1 point for a draw
      }
    });

    // Update or create standings records in database
    for (const [teamId, data] of Object.entries(standingsData)) {
      await Standing.findOneAndUpdate({ "team._id": teamId }, data, {
        upsert: true,
        new: true,
      });
    }

    return true;
  } catch (error) {
    console.error("Error recalculating standings:", error);
    throw error;
  }
}
