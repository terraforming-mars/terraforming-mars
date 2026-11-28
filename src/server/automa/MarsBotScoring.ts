import {IGame} from '../IGame';
import {getAutomaMaxGeneration} from '../../common/automa/AutomaTypes';
import {IMarsBot} from './IMarsBot';
import {Space} from '../boards/Space';
import {Board} from '../boards/Board';
import {MADetail} from '../../common/game/VictoryPointsBreakdown';
import {MarsBotVPModel} from '../../common/models/MarsBotModel';
import {Turmoil} from '../turmoil/Turmoil';

/** The calculation of MarsBot's final score, with its automa-specific rules. */
export class MarsBotScoring {
  constructor(
    private readonly marsBot: IMarsBot,
  ) {}

  /** Calculates MarsBot's complete VP breakdown. */
  public calculate(): MarsBotVPModel {
    const tr = this.marsBot.player.terraformRating;
    const milestoneResult = this.calculateMilestoneVP();
    const awardResult = this.calculateAwardVP();
    const greenery = this.countGreeneryVP();
    const cities = this.marsBot.game.board.getCities(this.marsBot.player);
    const cityAdjacentGreenery = this.countCityAdjacentGreeneryVP(cities);
    const neuralInstance = this.calculateNeuralInstanceVP();
    const mcToVP = this.calculateMCtoVP();
    const vermin = this.calculateVerminPenalty(cities);
    const turmoilVP = this.calculateTurmoilVP();
    const corpVP = this.marsBot.corpVictoryPoints();

    return {
      terraformRating: tr,
      milestones: milestoneResult.total,
      awards: awardResult.total,
      greenery,
      cityAdjacentGreenery,
      neuralInstance,
      mcToVP,
      cardVP: 0,
      vermin,
      turmoilVP,
      corpVP,
      total: tr + milestoneResult.total + awardResult.total + greenery + cityAdjacentGreenery + neuralInstance + mcToVP + vermin + turmoilVP + corpVP,
      detailsMilestones: milestoneResult.details,
      detailsAwards: awardResult.details,
    };
  }

  private calculateMilestoneVP(): {total: number, details: Array<MADetail>} {
    const details: Array<MADetail> = [];
    let total = 0;
    for (const cm of this.marsBot.game.claimedMilestones) {
      if (cm.player === this.marsBot.player) {
        total += 5;
        details.push({message: 'Claimed ${0} milestone', messageArgs: [cm.milestone.name], victoryPoint: 5});
      }
    }
    return {total, details};
  }

  private calculateAwardVP(): {total: number, details: Array<MADetail>} {
    const details: Array<MADetail> = [];
    let total = 0;
    for (const fa of this.marsBot.game.fundedAwards) {
      const award = fa.award;
      const marsBotScore = this.marsBot.awardValue(award);
      const humanScore = award.getScore(this.marsBot.humanPlayer);

      if (marsBotScore >= humanScore) {
        total += 5;
        details.push({message: '${0} place for ${1} award (funded by ${2})', messageArgs: ['1st', award.name, fa.player.name], victoryPoint: 5});
      }
    }
    return {total, details};
  }

  private countGreeneryVP(): number {
    return this.marsBot.game.board.getGreeneries(this.marsBot.player).length;
  }

  private countCityAdjacentGreeneryVP(cities: ReadonlyArray<Space>): number {
    let vp = 0;
    for (const space of cities) {
      const adj = this.marsBot.game.board.getAdjacentSpaces(space);
      vp += adj.filter((s) => Board.isGreenerySpace(s)).length;
    }
    return vp;
  }

  /** Scores 1 VP for each space next to the Neural Instance that the human doesn't occupy, empty or MarsBot's. */
  private calculateNeuralInstanceVP(): number {
    if (this.marsBot.neuralInstanceSpace === undefined) {
      return 0;
    }
    const adj = this.marsBot.game.board.getAdjacentSpaces(this.marsBot.neuralInstanceSpace);
    return adj.filter((s) => s.player !== this.marsBot.humanPlayer).length;
  }

  private calculateMCtoVP(): number {
    const mcPerVP = currentMcPerVP(this.marsBot.game);
    if (mcPerVP === undefined) {
      return 0;
    }
    return Math.floor(this.marsBot.megacredits / mcPerVP);
  }

  /** Scores -1 VP for each of MarsBot's cities while Vermin is in effect, with 10 or more animals on its card. */
  private calculateVerminPenalty(cities: ReadonlyArray<Space>): number {
    if (!this.marsBot.game.verminInEffect) {
      return 0;
    }
    return -1 * cities.length;
  }

  /** Scores 1 VP for each Party Leader or Chairman position MarsBot holds (rulebook C, p.7). */
  private calculateTurmoilVP(): number {
    if (!this.marsBot.game.gameOptions.turmoilExtension || this.marsBot.game.turmoil === undefined) {
      return 0;
    }
    return Turmoil.getTurmoil(this.marsBot.game).getVictoryPoints(this.marsBot.player);
  }
}

function buildMcToVpTable(maxGen: number): ReadonlyArray<{maxGeneration: number, mcPerVP: number}> {
  const table: Array<{maxGeneration: number, mcPerVP: number}> = [];
  for (let mcPerVP = 8; mcPerVP >= 1; mcPerVP--) {
    table.push({maxGeneration: maxGen - mcPerVP, mcPerVP});
  }
  return table;
}

/** M€ per VP in `generation`, or undefined from the generation limit on. */
function getMcPerVP(generation: number, preludeExtension: boolean): number | undefined {
  const table = buildMcToVpTable(getAutomaMaxGeneration(preludeExtension));
  const entry = table.find((e) => generation <= e.maxGeneration);
  return entry?.mcPerVP;
}

/** M€ per VP for the generation the game is in, or undefined once the generation limit is reached. */
export function currentMcPerVP(game: IGame): number | undefined {
  return getMcPerVP(game.generation, game.gameOptions.preludeExtension);
}
