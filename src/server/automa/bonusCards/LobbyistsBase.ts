import {GlobalParameter} from '@/common/GlobalParameter';
import {IGame} from '@/server/IGame';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {Board} from '@/server/boards/Board';
import {GlobalParameterTracks} from '@/server/boards/GlobalParameterTracks';
import {venusStepsBetween} from '@/server/venusNext/venusScale';

/**
 * The checks Lobbyists, its Venus Next version and Do It Right share.
 *
 * Each card tries its effects in order and stops at the first one that happens. Do It Right is the card
 * Inventrix adds in place of Lobbyists: the same first three effects, but it is never destroyed and does
 * nothing when none of them happens.
 */
export abstract class LobbyistsBase extends MarsBotBonusCard {
  /**
   * Raises the temperature 2 steps when it is 1 or 2 steps from a bonus step or its maximum.
   *
   * False when the temperature is further away.
   */
  protected maybeRaiseTemperature(marsBot: IMarsBot): boolean {
    const game = marsBot.game;
    if (this.isNearBonusStep(game, 'temperature')) {
      // Pristar's cube cancels only the first of the 2 steps
      const steps = marsBot.interceptsParameterRaise(GlobalParameter.TEMPERATURE) ? 1 : 2;
      game.increaseTemperature(marsBot.player, steps);
      game.log('MarsBot (${0}): raises the temperature ${1} step(s)', (b) => b.bonusCardName(this.name).number(steps));
      return true;
    }
    return false;
  }

  /**
   * Places a greenery and raises the oxygen once more when the oxygen is 1 or 2 steps from a bonus step
   * or its maximum.
   *
   * False when the oxygen is further away, or no greenery space is left.
   */
  protected maybePlaceGreeneryAndRaiseOxygen(marsBot: IMarsBot): boolean {
    const game = marsBot.game;
    if (this.isNearBonusStep(game, 'oxygen')) {
      const tilePlacer = new MarsBotTilePlacer(marsBot);
      const greenerySpace = tilePlacer.findGreenerySpace();
      if (greenerySpace !== undefined) {
        const raiseOxygen = game.getOxygenLevel() >= game.max.oxygen ||
          !marsBot.interceptsParameterRaise(GlobalParameter.OXYGEN);
        game.addGreenery(marsBot.player, greenerySpace, raiseOxygen);
        marsBot.gainMc(tilePlacer.getTotalPlacementMC(greenerySpace));
        if (game.getOxygenLevel() < game.max.oxygen && !marsBot.interceptsParameterRaise(GlobalParameter.OXYGEN)) {
          game.increaseOxygenLevel(marsBot.player, 1);
        }
        game.log('MarsBot (${0}): places a greenery and raises the oxygen', (b) => b.bonusCardName(this.name));
        return true;
      }
    }
    return false;
  }

  /**
   * Places an ocean next to 2 or more oceans.
   *
   * False when no ocean space touches 2 oceans, or the oceans are complete.
   */
  protected maybePlaceOcean(marsBot: IMarsBot): boolean {
    const game = marsBot.game;
    if (!game.canAddOcean()) {
      return false;
    }
    const tilePlacer = new MarsBotTilePlacer(marsBot);
    const space = tilePlacer.findOceanSpace((s) =>
      game.board.getAdjacentSpaces(s).filter((a) => Board.isOceanSpace(a) && a.tile !== undefined).length >= 2);
    if (space === undefined) {
      return false;
    }
    if (marsBot.interceptsParameterRaise(GlobalParameter.OCEANS)) {
      game.log('MarsBot (${0}): skips the ocean', (b) => b.bonusCardName(this.name));
      return true;
    }
    game.addOcean(marsBot.player, space);
    marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
    game.log('MarsBot (${0}): places an ocean', (b) => b.bonusCardName(this.name));
    return true;
  }

  /** Checks whether the `type` parameter is 1 or 2 steps from the nearer of its next bonus step and its maximum. */
  protected isNearBonusStep(game: IGame, type: keyof GlobalParameterTracks): boolean {
    const steps = this.stepsToNextBonus(game, type);
    return steps >= 1 && steps <= 2;
  }

  /**
   * Counts the steps from the current level of the `type` parameter to the nearer of the next bonus step
   * printed on the board's track and the track's maximum.
   *
   * A temperature step is 2 degrees, an oxygen step 1%, and a Venus step 2% up to 30%, then 1%.
   * Returns 0 when the track is at its maximum.
   */
  private stepsToNextBonus(game: IGame, type: keyof GlobalParameterTracks): number {
    const nextStop = (level: number) => Math.min(
      game.max[type],
      ...game.globalParameterTracks[type].map((threshold) => threshold.value).filter((value) => value > level));
    switch (type) {
    case 'temperature': {
      const level = game.getTemperature();
      return (nextStop(level) - level) / 2;
    }
    case 'oxygen': {
      const level = game.getOxygenLevel();
      return nextStop(level) - level;
    }
    case 'venus': {
      const level = game.getVenusScaleLevel();
      return venusStepsBetween(level, nextStop(level));
    }
    }
  }
}
