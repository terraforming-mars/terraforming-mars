import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {Request} from '../Request';
import {Response} from '../Response';
import { SQLite } from '../database/SQLite';

export class ApiStatsPage extends Handler {
  public static readonly INSTANCE = new ApiStatsPage();
  private constructor() {
    super();
  }

  private async getStatsPage(): Promise<any> {
    // Only works with sqlite for now
    const db = Database.getInstance() as SQLite;
    const res = await db.getCompletedGames();
    const final = await Promise.all(res.map(async (r) => {
      const g = await db.getGame(r.game_id);
      const players = g.players.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color,
        score: p.victoryPointsByGeneration.slice(-1)[0],
        tieBreakScore: p.victoryPointsByGeneration.slice(-1)[0] + p.megaCredits / 1000000,
        megaCredits: p.megaCredits,
        corp: p.pickedCorporationCard,
        actions: p.actionsTakenThisGame,
        cardsPlayed: p.playedCards.length,
        cards: p.playedCards.map(c => c.name),
        timer: p.timer.sumElapsed,
       }));
      return {
        gameId: r.game_id,
        generations: g.generation, 
        createdTimeMs: g.createdTimeMs,
        durationMs: r.completed_time * 1000 - g.createdTimeMs,
        claimedMilestones: g.claimedMilestones,
        fundedAwards: g.fundedAwards,
        map: g.gameOptions.boardName,
        players,
        winner: 0,
    };
    }));
    // Load in person game data from google sheet
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1R_Iqge6XPY7GC32V-I0Nl9hjMC7AqI0pn_qM7wA8Oi8/values/Sheet1?key=AIzaSyDAHivgQUlxM9FKaTYuzfKpOKgf0f9hpXI');
    const inPersonData = await response.json();
    const inPersonGames = inPersonData.values.map((g: any) => {
      return {
        createdTimeMs: Number(new Date(g[0])),
        durationMs: 0,
        generations: 0,
        claimedMilestones: [],
        fundedAwards: [],
        players: g.slice(1).map((p: string, i: number) => {
          return {
            name: p,
            score: 5 - i,
            tieBreakScore: 5 - i,
            cards: [],
          };
        })
      }
    });
    final.push(...inPersonGames);
    /*
    {
      "range": "Sheet1!A1:Z1000",
      "majorDimension": "ROWS",
      "values": [
      [
      "2024-12-25",
      "Howard",
      "Aredy",
      "Tino"
      ],
      [
      "2024-12-25",
      "Tino",
      "Howard",
      "Aredy"
      ],
      [
      "2024-1-3",
      "Tino",
      "Howard",
      "Aredy",
      "Sam"
      ]
      ]
      }
      */
    /*
    // Load old game data
    function processOldGames() {
      // Loop through oldgames
      const dir = fs.readdirSync("./oldgames");
      const output: any[] = [];
      dir.forEach((file) => {
        const json = JSON.parse(fs.readFileSync("./oldgames/" + file).toString());
        // Process each one into new data format
        const players = json.players.map((p: any) => ({
          id: p.id,
          color: p.color,
          actions: p.actionsTakenThisGame,
          // Remove first card since it's a corp
          cards: p.tableau.slice(1).map((c: any) => c.name),
          cardsPlayed: p.tableau.length - 1,
          corp: p.tableau[0].name,
          name: p.name,
          score: p.victoryPointsBreakdown.total,
          tieBreakScore: p.victoryPointsBreakdown.total + p.megaCredits / 1000000,
          megaCredits: p.megaCredits,
          timer: p.timer.sumElapsed,
        }));
        output.push({
          // TODO parse these from data
          claimedMilestones: json.game.milestones.filter((ms: any) => ms.playerName).map((ms: any) => {
            return {
              name: ms.name,
              playerId: json.players.find((p: any) => p.name === ms.playerName)?.id,
            };
          }),
          fundedAwards: json.game.awards.filter((award: any) => award.playerName).map((award: any) => {
            return {
              name: award.name,
              playerId: json.players.find((p: any) => p.name === award.playerName)?.id
            };
          }),
          generations: json.game.generation,
          createdTimeMs: json.game.expectedPurgeTimeMs - 17 * 24 * 60 * 60 * 1000,
          durationMs:
            json.players[0].timer.startedAt -
            (json.game.expectedPurgeTimeMs - 17 * 24 * 60 * 60 * 1000),
          map: json.game.gameOptions.boardName,
          players,
          winner: 0,
        });
      });
      // Save as single output JSON array
      return output;
    }
    final.push(...processOldGames());
    */
    final.sort(
      (a, b) => b.createdTimeMs - a.createdTimeMs
    );
    // Add winner for each game (tiebreak by megacredits, assume players will never have more than 1000000)
    final.forEach(f => {
      const maxScore = Math.max(...f.players.map(p => p.tieBreakScore));
      f.winner = f.players.findIndex((p) => p.tieBreakScore === maxScore);
    });
    return { data: final };
  }

  public override async get(req: Request, res: Response, _ctx: Context): Promise<void> {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const stats = await this.getStatsPage();
      responses.writeJson(res, stats, 2);
    } catch (err) {
      console.error(err);
      responses.badRequest(req, res, 'could not load admin stats');
    }
  }
}
