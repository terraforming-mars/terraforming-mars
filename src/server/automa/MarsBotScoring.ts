import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {DifficultyLevel, getAutomaMaxGeneration, MARSBOT_MAX_GENERATION, MARSBOT_MAX_GENERATION_PRELUDE} from '../../common/automa/AutomaTypes';
import {MarsBotTurnResolver} from './MarsBotTurnResolver';
import {IProjectCard} from '../cards/IProjectCard';
import {Space} from '../boards/Space';
import {Board} from '../boards/Board';
import {MADetail} from '../../common/game/VictoryPointsBreakdown';

export interface MarsBotVPBreakdown {
  terraformRating: number;
  milestones: number;
  awards: number;
  greenery: number;
  cityAdjacentGreenery: number;
  neuralInstance: number;
  mcToVP: number;
  cardVP: number; // Only in Hard/Brutal mode
  total: number;
  detailsMilestones: Array<MADetail>;
  detailsAwards: Array<MADetail>;
}

/**
 * Calculates MarsBot's final score with automa-specific rules.
 */
export class MarsBotScoring {
  constructor(
    private readonly game: IGame,
    private readonly marsBot: IPlayer,
    private readonly humanPlayer: IPlayer,
    private readonly turnResolver: MarsBotTurnResolver,
    private readonly difficulty: DifficultyLevel,
    private readonly neuralInstanceSpace: Space | undefined,
    private readonly playedProjectCards: ReadonlyArray<IProjectCard> = [],
    private readonly corpVpBonus: number = 0,
  ) {}

  private getMaxGeneration(): number {
    const opts = this.game.gameOptions;
    return getAutomaMaxGeneration(opts.preludeExtension);
  }

  /** Check if MarsBot instantly wins because max generation reached. */
  public isInstantWin(): boolean {
    return this.game.generation >= this.getMaxGeneration();
  }

  /** Calculate MarsBot's complete VP breakdown. */
  public calculate(): MarsBotVPBreakdown {
    const tr = this.marsBot.getTerraformRating();
    const milestoneResult = this.calculateMilestoneVP();
    const awardResult = this.calculateAwardVP();
    const greenery = this.countGreeneryVP();
    const cityAdjacentGreenery = this.countCityAdjacentGreeneryVP();
    const neuralInstance = this.calculateNeuralInstanceVP();
    const mcToVP = this.calculateMCtoVP();
    const cardVP = this.calculateCardVP();

    return {
      terraformRating: tr,
      milestones: milestoneResult.total,
      awards: awardResult.total,
      greenery,
      cityAdjacentGreenery,
      neuralInstance,
      mcToVP,
      cardVP,
      total: tr + milestoneResult.total + awardResult.total + greenery + cityAdjacentGreenery + neuralInstance + mcToVP + cardVP + this.corpVpBonus,
      detailsMilestones: milestoneResult.details,
      detailsAwards: awardResult.details,
    };
  }

  private calculateMilestoneVP(): {total: number, details: Array<MADetail>} {
    const details: Array<MADetail> = [];
    let total = 0;
    for (const cm of this.game.claimedMilestones) {
      if (cm.player === this.marsBot) {
        total += 5;
        details.push({message: 'Claimed ${0} milestone', messageArgs: [cm.milestone.name], victoryPoint: 5});
      }
    }
    return {total, details};
  }

  private calculateAwardVP(): {total: number, details: Array<MADetail>} {
    const details: Array<MADetail> = [];
    let total = 0;
    for (const fa of this.game.fundedAwards) {
      const award = fa.award;
      const marsBotScore = this.turnResolver.getMarsBotAwardValue(award);
      const humanScore = award.getScore(this.humanPlayer);

      if (marsBotScore >= humanScore) {
        total += 5;
        details.push({message: '${0} place for ${1} award (funded by ${2})', messageArgs: ['1st', award.name, fa.player.name], victoryPoint: 5});
      }
    }
    return {total, details};
  }

  private countGreeneryVP(): number {
    return this.game.board.getGreeneries(this.marsBot).length;
  }

  private countCityAdjacentGreeneryVP(): number {
    let vp = 0;
    for (const space of this.game.board.getCities(this.marsBot)) {
      const adj = this.game.board.getAdjacentSpaces(space);
      vp += adj.filter((s) => Board.isGreenerySpace(s)).length;
    }
    return vp;
  }

  private calculateNeuralInstanceVP(): number {
    if (this.neuralInstanceSpace === undefined) return 0;
    const adj = this.game.board.getAdjacentSpaces(this.neuralInstanceSpace);
    // 1 VP per adjacent space NOT occupied by human (empty or MarsBot-owned)
    return adj.filter((s) => s.player !== this.humanPlayer).length;
  }

  private calculateMCtoVP(): number {
    if (this.game.generation >= this.getMaxGeneration()) return 0;
    const opts = this.game.gameOptions;
    const mcPerVP = getMcPerVP(this.game.generation, opts.preludeExtension);
    if (mcPerVP === undefined) return 0;
    return Math.floor(this.turnResolver.mcSupply / mcPerVP);
  }

  /** Hard/Brutal mode: 1 VP per card with non-negative VP icon in MarsBot's played pile. */
  private calculateCardVP(): number {
    if (this.difficulty !== 'hard' && this.difficulty !== 'brutal') return 0;
    return this.playedProjectCards.filter((card) => {
      const vp = card.getVictoryPoints(this.marsBot);
      return vp >= 0;
    }).length;
  }
}

function buildMcToVpTable(maxGen: number): ReadonlyArray<{maxGeneration: number, mcPerVP: number}> {
  const table: Array<{maxGeneration: number, mcPerVP: number}> = [];
  for (let mcPerVP = 8; mcPerVP >= 1; mcPerVP--) {
    table.push({maxGeneration: maxGen - mcPerVP, mcPerVP});
  }
  return table;
}

const MC_TO_VP_TABLE = buildMcToVpTable(MARSBOT_MAX_GENERATION);
const MC_TO_VP_TABLE_PRELUDE = buildMcToVpTable(MARSBOT_MAX_GENERATION_PRELUDE);

export function getMcPerVP(generation: number, preludeExtension: boolean): number | undefined {
  const table = preludeExtension ? MC_TO_VP_TABLE_PRELUDE : MC_TO_VP_TABLE;
  const entry = table.find((e) => generation <= e.maxGeneration);
  return entry?.mcPerVP;
}
