/**
 * Shared helper functions for MarsBot bonus card definitions.
 */
import {CardResource} from '@/common/CardResource';
import {GlobalParameter} from '@/common/GlobalParameter';
import {CardName} from '@/common/cards/CardName';
import {IGame} from '@/server/IGame';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {pickByFlippedCard} from '@/server/automa/MarsBotCardFlip';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';
import {Board} from '@/server/boards/Board';
import {GlobalParameterTracks} from '@/server/boards/GlobalParameterTracks';
import {ICard} from '@/server/cards/ICard';
import {venusStepsBetween} from '@/server/venusNext/venusScale';

/**
 * Removes the player's animal or microbe worth the most VP, for the bonus card `source`.
 *
 * False when no card has one MarsBot may remove. Cards that score their resources come first, then
 * the rest; a tie goes to a flipped project card (BGG 3360797).
 */
export function maybeRemoveAnimalOrMicrobe(marsBot: IMarsBot, source: CardName): boolean {
  const game = marsBot.game;
  const humanPlayer = marsBot.humanPlayer;
  // Protected Habitat blocks animal/microbe removal
  const isProtected = humanPlayer.playedCards.has(CardName.PROTECTED_HABITATS);

  // Pets and Bioengineering Enclosure protect their resources from opponents
  const candidates = isProtected ? [] : humanPlayer.playedCards.filter((played) =>
    (played.resourceCount ?? 0) > 0 && played.protectedResources !== true &&
    (played.resourceType === CardResource.ANIMAL || played.resourceType === CardResource.MICROBE));
  if (candidates.length > 0) {
    const best = Math.max(...candidates.map(vpPerResource));
    const tied = candidates.filter((played) => vpPerResource(played) === best);
    const card = tied.length > 1 ? pickByFlippedCard(game, tied) ?? tied[0] : tied[0];
    humanPlayer.removeResourceFrom(card, 1, {removingPlayer: marsBot.player, log: false});
    game.log('MarsBot (${0}): removed 1 ${1} from ${2}',
      (b) => b.cardName(source).rawString(card.resourceType ?? '').card(card));
    return true;
  }
  if (isProtected) {
    game.log('MarsBot (${0}): blocked by Protected Habitats', (b) => b.cardName(source));
  } else {
    game.log('MarsBot (${0}): no animal/microbe resources to remove', (b) => b.cardName(source));
  }
  return false;
}

/** The VP one resource on `card` is worth, or 0 when the card doesn't score its resources (Vermin included). */
function vpPerResource(card: ICard): number {
  const vp = card.victoryPoints;
  if (typeof vp === 'object' && vp.resourcesHere !== undefined) {
    return (vp.each ?? 1) / (vp.per ?? 1);
  }
  return 0;
}

/**
 * Places an ocean next to 2 or more oceans, for the Lobbyists card `source`.
 *
 * False when no ocean space touches 2 oceans, or the oceans are complete.
 */
export function lobbyistsOceanBranch(marsBot: IMarsBot, source: CardName): boolean {
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
    game.log('MarsBot (${0}): skips the ocean', (b) => b.cardName(source));
    return true;
  }
  game.addOcean(marsBot.player, space);
  marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
  game.log('MarsBot (${0}): places an ocean', (b) => b.cardName(source));
  return true;
}

/** Checks whether the `type` parameter is 1 or 2 steps from the nearer of its next bonus step and its maximum. */
export function isNearBonusStep(game: IGame, type: keyof GlobalParameterTracks): boolean {
  const steps = stepsToNextBonus(game, type);
  return steps >= 1 && steps <= 2;
}

/**
 * Counts the steps from the current level of the `type` parameter to the nearer of the next bonus step
 * printed on the board's track and the track's maximum.
 *
 * A temperature step is 2 degrees, an oxygen step 1%, and a Venus step 2% up to 30%, then 1%.
 * Returns 0 when the track is at its maximum.
 */
function stepsToNextBonus(game: IGame, type: keyof GlobalParameterTracks): number {
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

/**
 * Raises the temperature 2 steps when it is 1 or 2 steps from a bonus step or its maximum, for the
 * Lobbyists card `source`.
 *
 * False when the temperature is further away.
 */
export function lobbyistsTempBranch(marsBot: IMarsBot, source: CardName): boolean {
  const game = marsBot.game;
  if (isNearBonusStep(game, 'temperature')) {
    // Pristar's cube cancels only the first of the 2 steps
    const steps = marsBot.interceptsParameterRaise(GlobalParameter.TEMPERATURE) ? 1 : 2;
    game.increaseTemperature(marsBot.player, steps);
    game.log('MarsBot (${0}): raises the temperature ${1} step(s)', (b) => b.cardName(source).number(steps));
    return true;
  }
  return false;
}

/**
 * Places a greenery and raises the oxygen once more when the oxygen is 1 or 2 steps from a bonus step
 * or its maximum, for the Lobbyists card `source`.
 *
 * False when the oxygen is further away, or no greenery space is left.
 */
export function lobbyistsOxygenBranch(marsBot: IMarsBot, source: CardName): boolean {
  const game = marsBot.game;
  if (isNearBonusStep(game, 'oxygen')) {
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
      game.log('MarsBot (${0}): places a greenery and raises the oxygen', (b) => b.cardName(source));
      return true;
    }
  }
  return false;
}

/**
 * Places a MarsBot greenery and raises oxygen.
 *
 * Returns false, with no Failed Action, when no greenery space is left.
 */
export function maybePlaceGreenery(marsBot: IMarsBot): boolean {
  const game = marsBot.game;
  const tilePlacer = new MarsBotTilePlacer(marsBot);
  const space = tilePlacer.findGreenerySpace();
  if (space === undefined) {
    return false;
  }
  const raiseOxygen = game.getOxygenLevel() >= game.max.oxygen ||
    !marsBot.interceptsParameterRaise(GlobalParameter.OXYGEN);
  game.addGreenery(marsBot.player, space, raiseOxygen);
  marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
  return true;
}

/** Runs `action` and takes back any TR it gave MarsBot (for Government Intervention). */
export function withoutTRGain(marsBot: IMarsBot, action: () => void): void {
  const trBefore = marsBot.player.terraformRating;
  action();
  const trGained = marsBot.player.terraformRating - trBefore;
  if (trGained > 0) {
    marsBot.player.decreaseTerraformRating(trGained);
    marsBot.game.log('MarsBot (${0}): returns ${1} TR', (b) => b.cardName(CardName.AUTOMA_GOVERNMENT_INTERVENTION).number(trGained));
  }
}

/**
 * Runs `action` and caps MarsBot's M€ supply at what it was before, so the action pays MarsBot no
 * M€ (for Government Intervention). A supply the action lowers stays lowered.
 *
 * M€ that Lakefront Resorts' advance brings in stays (rulebook B, p.4).
 */
export function withoutMcGain(marsBot: IMarsBot, action: () => void): void {
  const mcBefore = marsBot.megacredits;
  marsBot.mcKeptThroughIntervention = 0;
  let kept = 0;
  try {
    action();
  } finally {
    kept = marsBot.mcKeptThroughIntervention ?? 0;
    marsBot.mcKeptThroughIntervention = undefined;
  }
  const returned = marsBot.megacredits - (mcBefore + kept);
  if (returned > 0) {
    marsBot.megacredits = mcBefore + kept;
    marsBot.game.log('MarsBot (${0}): returns ${1}:r:mc:', (b) => b.cardName(CardName.AUTOMA_GOVERNMENT_INTERVENTION).number(returned));
  }
}

/**
 * Runs `action` and takes back any TR or M€ it gave MarsBot (for Government Intervention).
 *
 * M€ that Lakefront Resorts' advance brings in stays (rulebook B, p.4).
 */
export function withoutTRorMcGain(marsBot: IMarsBot, action: () => void): void {
  withoutMcGain(marsBot, () => withoutTRGain(marsBot, action));
}

/**
 * Raises the global parameter furthest from completion, for the bonus card `source`.
 *
 * Distance counts steps remaining (a temperature step is 2 degrees), and a tie goes to oxygen, then
 * oceans, then temperature. With `allowCorpIntercept` false, no corp may cancel the raise. Returns
 * false when every parameter is already complete.
 */
export function advanceFurthestParameter(marsBot: IMarsBot, source: CardName, allowCorpIntercept: boolean = true): boolean {
  const game = marsBot.game;
  const tempRemaining = (game.max.temperature - game.getTemperature()) / 2;
  const oxyRemaining = game.max.oxygen - game.getOxygenLevel();
  const oceanRemaining = game.max.oceans - game.board.getOceanSpaces().length;

  const params: Array<{message: string, remaining: number, action: () => boolean}> = [
    {message: 'MarsBot (${0}): raises the oxygen, furthest from completion', remaining: oxyRemaining, action: () => {
      if (game.getOxygenLevel() < game.max.oxygen) {
        if (allowCorpIntercept && marsBot.interceptsParameterRaise(GlobalParameter.OXYGEN)) {
          return true;
        }
        game.increaseOxygenLevel(marsBot.player, 1);
        return true;
      }
      return false;
    }},
    {message: 'MarsBot (${0}): places an ocean, furthest from completion', remaining: oceanRemaining, action: () => {
      if (game.canAddOcean()) {
        const tilePlacer = new MarsBotTilePlacer(marsBot);
        const space = tilePlacer.findOceanSpace();
        if (space) {
          if (allowCorpIntercept && marsBot.interceptsParameterRaise(GlobalParameter.OCEANS)) {
            return true;
          }
          game.addOcean(marsBot.player, space);
          marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
          return true;
        }
      }
      return false;
    }},
    {message: 'MarsBot (${0}): raises the temperature, furthest from completion', remaining: tempRemaining, action: () => {
      if (game.getTemperature() < game.max.temperature) {
        if (allowCorpIntercept && marsBot.interceptsParameterRaise(GlobalParameter.TEMPERATURE)) {
          return true;
        }
        game.increaseTemperature(marsBot.player, 1);
        return true;
      }
      return false;
    }},
  ];

  // Most steps remaining first, tie order preserved (oxygen, oceans, temperature)
  params.sort((a, b) => b.remaining - a.remaining);

  for (const p of params) {
    if (p.action()) {
      game.log(p.message, (b) => b.cardName(source));
      return true;
    }
  }
  return false;
}
