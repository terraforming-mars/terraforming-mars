import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';
import {Space} from '../boards/Space';
import {UnderworldData} from './UnderworldData';
import {Random} from '../../common/utils/Random';
import {TemporaryBonusToken, UNDERGROUND_RESOURCE_TOKENS, UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';
import {inplaceShuffle} from '../utils/shuffle';
import {Resource} from '../../common/Resource';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {CardResource} from '../../common/CardResource';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {IGame} from '../IGame';
import {SpaceType} from '../../common/boards/SpaceType';
import {CardName} from '../../common/cards/CardName';
import {PlayerInput} from '../PlayerInput';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {message} from '../logs/MessageBuilder';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {Units} from '../../common/Units';
import {Message} from '../../common/logs/Message';
import {GlobalParameter} from '../../common/GlobalParameter';
import {Tag} from '../../common/cards/Tag';
import {UnderworldPlayerData} from '../../common/underworld/UnderworldPlayerData';
import {GainAnyResourceButScienceDeferred} from '../deferredActions/GainAnyResourceButScienceDeferred';
import {GainResourcesDeferred} from '../deferredActions/GainResourcesDeferred';
import {GainProduction} from '../deferredActions/GainProduction';
import {Priority} from '../deferredActions/Priority';

const TOKEN_COUNTS: Record<UndergroundResourceToken, [number, number]> = {
  'nothing': [5, 7],

  'corruption1': [13, 19],
  'corruption2': [2, 3],

  'card1': [4, 6],
  'card2': [1, 1],

  'mcprod1pertemp': [2, 3],

  'steel2plant': [2, 4],
  'steel1production': [4, 6],
  'steel2pertemp': [3, 4],

  'titaniumandplant': [3, 4],
  'titanium2': [3, 5],
  'titanium1production': [1, 2],
  'titanium1pertemp': [3, 4],

  'plant2': [4, 6],
  'plant3': [1, 1],
  'plant1production': [4, 6],
  'plant2pertemp': [3, 4],

  'energy2': [2, 3],
  'energy1production': [5, 8],
  'heat2production': [3, 4],

  'microbe2': [4, 6],
  'microbe2pertemp': [1, 2],

  'tr': [2, 3],
  'ocean': [2, 3],
  'sciencetag': [2, 3],
  'planttag': [2, 3],
  'anyresource1': [2, 4],
  'place6mc': [2, 3],

  'oceanrequirementmod': [2, 3],
  'oxygenrequirementmod': [2, 3],
  'temprequirementmod': [2, 3],
} as const;

export class UnderworldExpansion {
  private constructor() {}

  public static initialize(rnd: Random, extraTokens: boolean): UnderworldData {
    const tokens = this.allTokens(extraTokens);
    inplaceShuffle(tokens, rnd);
    return {
      tokens: tokens,
    };
  }

  /**
   * Creates an empty UnderworldData for games that don't include it.
   */
  public static initializeGameWithoutUnderworld(): UnderworldData {
    return {tokens: []};
  }

  private static allTokens(extraTokens: boolean): Array<UndergroundResourceToken> {
    const tokens: Array<UndergroundResourceToken> = [];
    for (const token of UNDERGROUND_RESOURCE_TOKENS) {
      const entry = TOKEN_COUNTS[token];
      const count = extraTokens ? entry[1] : entry[0];
      for (let idx = 0; idx < count; idx++) {
        tokens.push(token as UndergroundResourceToken);
      }
    }
    return tokens;
  }

  public static initializePlayer(): UnderworldPlayerData {
    return {
      corruption: 0,
      tokens: [],
      activeBonus: undefined,
    };
  }

  public static canIdentify(space: Space): boolean {
    if (space.undergroundResources !== undefined) {
      return false;
    }
    if (space.excavator !== undefined) {
      return false;
    }
    if (space.tile !== undefined) {
      return false;
    }
    // Players may still identify on Martian Nature Wonders, but Rey Skywalker blocks tokens.
    if (space.cube === 'rey-skywalker') {
      return false;
    }

    if (space.spaceType === SpaceType.COLONY || space.spaceType === SpaceType.RESTRICTED) {
      return false;
    }
    return true;
  }

  /**
   * Return the spaces that have not yet been identified.
   *
   * This doesn't take into account that there may not be available tokens in the supply.
   * But canIdentifyN supports that.
   */
  public static identifiableSpaces(player: IPlayer): ReadonlyArray<Space> {
    return player.game.board.spaces.filter(UnderworldExpansion.canIdentify);
  }

  public static canIdentifyN(player: IPlayer, count: number): boolean {
    const tokens = player.game.underworldData.tokens.length;
    if (tokens >= count) {
      return true;
    }

    const spaces = this.identifiableSpaces(player).length;
    return spaces >= count;
  }

  /**
   * Identify the token at `space`, optionally trigger callbacks.
   *
   * Returns |true| if it identifies a space, and |false| if it does not.
   */
  public static identify(game: IGame, space: Space, player: IPlayer | undefined): boolean {
    validateUnderworldExpansion(game);

    if (!this.canIdentify(space)) {
      return false;
    }

    const undergroundResource = this.drawExcavationToken(game);
    space.undergroundResources = undergroundResource;
    game.triggerForAllCards((p, c) => c.onIdentificationByAnyPlayer?.(p, player, undergroundResource));
    return true;
  }

  public static identifyAdjacentSpaces(player: IPlayer, space: Space): ReadonlyArray<Space> {
    const game = player.game;
    const spaces = [];
    for (const adjacentSpace of game.board.getAdjacentSpaces(space)) {
      const identified = this.identify(game, adjacentSpace, player);
      if (identified === true) {
        spaces.push(adjacentSpace);
      }
    }
    return spaces;
  }

  /**
   * Return a list of spaces `player` may excavate.
   *
   * If `ignorePlacementRestictions` is true, `player` can excavate any space on Mars that has
   * not yet been excavated, even unidentified spaces.
   *
   * Otherwise, `player` may excavate any unexcavated space (even unidentified spaces) that
   *   1. has no tile
   *   2. next to their tiles.
   *   3. next to their excavation markers
   *
   * If a player played Concession Rights this generation, they automatically ignore placement restrictions.
   */
  public static excavatableSpaces(player: IPlayer, options?: {ignorePlacementRestrictions?: boolean, ignoreTunnelingLoophole?: boolean}) {
    const board = player.game.board;

    // Compute any space that any player can excavate.
    const anyExcavatableSpaces = board.spaces.filter((space) => {
      if (space.spaceType === SpaceType.COLONY || space.spaceType === SpaceType.RESTRICTED) {
        return false;
      }

      if (space.excavator !== undefined) {
        return false;
      }

      if (space.tile !== undefined) {
        return false;
      }
      // Players may still excavate from Martian Nature Wonders, but Rey Skywalker blocks tokens.
      if (space.cube === 'rey-skywalker') {
        return false;
      }

      if (space.undergroundResources === 'ocean' && !player.canAfford({cost: 4, tr: {oceans: 1}})) {
        return false;
      }

      return true;
    });

    if (options?.ignorePlacementRestrictions === true) {
      return anyExcavatableSpaces;
    }

    const tunnelingLoophole = player.tableau.get(CardName.TUNNELING_LOOPHOLE);
    if (tunnelingLoophole?.generationUsed === player.game.generation) {
      if (options?.ignoreTunnelingLoophole !== true) {
        return anyExcavatableSpaces;
      }
    }

    const spaces = anyExcavatableSpaces.filter((space) => {
      return board.getAdjacentSpaces(space).some((s) => {
        return s.excavator === player || (s.player === player && Board.hasRealTile(s));
      });
    });
    if (spaces.length === 0) {
      return anyExcavatableSpaces;
    }
    return spaces;
  }

  public static canExcavateN(player: IPlayer, count: number): boolean {
    const tokens = player.game.underworldData.tokens.length;
    // Optimization
    if (tokens >= count) {
      return true;
    }

    // Ignoring placement restrictions is acceptable since the player might have
    // to choose spaces outside their excavatable area.
    const spaces = this.excavatableSpaces(player, {ignorePlacementRestrictions: true}).length;
    return tokens + spaces >= count;
  }


  public static excavate(player: IPlayer, space: Space): UndergroundResourceToken {
    const game = player.game;
    validateUnderworldExpansion(game);
    if (space.tile !== undefined) {
      throw new Error(`cannot excavate space ${space.id} which has a tile.`);
    }
    // Players may still excavate from Martian Nature Wonders, but Rey Skywalker blocks tokens.
    if (space.cube === 'rey-skywalker') {
      throw new Error(`cannot excavate space ${space.id} which has a cube.`);
    }

    if (space.undergroundResources === undefined) {
      this.identify(player.game, space, player);
    }

    const undergroundResource = space.undergroundResources;
    if (undergroundResource === undefined) {
      throw new Error('No available identification tokens');
    }

    player.game.log('${0} excavated ${1} at ${2}', (b) =>
      b.player(player).undergroundToken(undergroundResource).space(space));

    space.excavator = player;
    space.undergroundResources = undefined;

    this.claimToken(player, undergroundResource, /* isExcavate= */ true, space);

    for (const adjacentSpace of game.board.getAdjacentSpaces(space)) {
      UnderworldExpansion.identify(game, adjacentSpace, player);
    }

    const leaser = game.getCardPlayerOrUndefined(CardName.EXCAVATOR_LEASING);
    if (leaser !== undefined) {
      leaser.stock.add(Resource.MEGACREDITS, 1, {log: true});
    }

    return undergroundResource;
  }

  public static claim(player: IPlayer, space: Space) {
    const game = player.game;
    validateUnderworldExpansion(game);

    if (space.undergroundResources === undefined) {
      this.identify(player.game, space, player);
    }

    const undergroundResource = space.undergroundResources;
    if (undergroundResource === undefined) {
      throw new Error('No available identification tokens');
    }

    space.undergroundResources = undefined;

    this.claimToken(player, undergroundResource, /* isExcavate= */false, space);
  }

  public static claimToken(player: IPlayer, token: UndergroundResourceToken, isExcavate: boolean, space: Space | undefined) {
    if (space) {
      player.game.log('${0} claimed ${1} at ${2}', (b) =>
        b.player(player).undergroundToken(token).space(space));
    } else {
      player.game.log('${0} claimed ${1}', (b) => b.player(player).undergroundToken(token));
    }

    validateUnderworldExpansion(player.game);
    this.grant(player, token);
    player.underworldData.tokens.push({token, shelter: false, active: player.underworldData.activeBonus === token});
    for (const card of player.tableau) {
      card.onClaim?.(player, isExcavate, space);
    }
  }

  /* public for tests */
  public static grant(player: IPlayer, token: UndergroundResourceToken): void {
    switch (token) {
    case 'nothing':
      break;
    case 'card1':
      player.drawCard(1);
      break;
    case 'card2':
      player.drawCard(2);
      break;
    case 'corruption1':
      UnderworldExpansion.gainCorruption(player, 1, {log: true});
      break;
    case 'corruption2':
      UnderworldExpansion.gainCorruption(player, 2, {log: true});
      break;
    case 'steel2plant':
      player.stock.add(Resource.STEEL, 2, {log: true});
      player.stock.add(Resource.PLANTS, 1, {log: true});
      break;
    case 'steel1production':
      player.production.add(Resource.STEEL, 1, {log: true});
      break;
    case 'titanium2':
      player.stock.add(Resource.TITANIUM, 2, {log: true});
      break;
    case 'titanium1production':
      player.production.add(Resource.TITANIUM, 1, {log: true});
      break;
    case 'plant2':
      player.stock.add(Resource.PLANTS, 2, {log: true});
      break;
    case 'plant3':
      player.stock.add(Resource.PLANTS, 3, {log: true});
      break;
    case 'plant1production':
      player.production.add(Resource.PLANTS, 1, {log: true});
      break;
    case 'titaniumandplant':
      player.stock.adjust(Units.of({plants: 1, titanium: 1}), {log: true});
      break;
    case 'energy2':
      player.stock.add(Resource.ENERGY, 2, {log: true});
      break;
    case 'energy1production':
      player.production.add(Resource.ENERGY, 1, {log: true});
      break;
    case 'heat2production':
      player.production.add(Resource.HEAT, 2, {log: true});
      break;
    case 'microbe2':
      player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));
      break;
    case 'anyresource1':
      player.game.defer(new GainAnyResourceButScienceDeferred(player));
      break;
    case 'tr':
      player.increaseTerraformRating();
      break;
    case 'ocean':
      const canAddOcean = player.game.canAddOcean();
      const canAfford = player.canAfford({cost: 4, tr: {oceans: 1}});
      const hasWhales = player.tableau.has(CardName.WHALES);
      if (canAddOcean || hasWhales) {
        if (canAfford) {
          player.game.defer(new SelectPaymentDeferred(player, 4, {title: message('Select how to pay 4 M€ for ocean bonus')}))
            .andThen(() => player.game.defer(new PlaceOceanTile(player)));
        } else {
          player.game.log('${0} cannot afford to place an ocean', (b) => b.player(player));
        }
      } else {
        player.game.log('There is no room to place an ocean');
      }
      break;
    case 'mcprod1pertemp':
    case 'microbe2pertemp':
    case 'plant2pertemp':
    case 'steel2pertemp':
    case 'titanium1pertemp':
    case 'oceanrequirementmod':
    case 'oxygenrequirementmod':
    case 'temprequirementmod':
      UnderworldExpansion.activateBonus(player, token);
      break;
    case 'sciencetag':
      player.tags.extraScienceTags++;
      player.triggerOnNonCardTagAdded(Tag.SCIENCE);
      break;
    case 'planttag':
      player.tags.extraPlantTags++;
      player.triggerOnNonCardTagAdded(Tag.PLANT);
      break;

    // This doesn't reward anything.
    case 'place6mc':
      break;
    default:
      throw new Error('Unknown reward: ' + token);
    }
  }

  private static activateBonus(player: IPlayer, token: TemporaryBonusToken) {
    const activeBonus = player.underworldData.activeBonus;
    for (const claimedToken of player.underworldData.tokens) {
      claimedToken.active = false;
    }
    player.underworldData.activeBonus = token;
    if (activeBonus !== undefined) {
      player.game.log('For the rest of this generation, ${0} will gain ${1}, replacing ${2}',
        (b) => b.player(player).undergroundToken(token).undergroundToken(activeBonus));
    } else {
      player.game.log('For the rest of this generation, ${0} will gain ${1}',
        (b) => b.player(player).undergroundToken(token));
    }
    player.underworldData.activeBonus = token;
  }

  public static maybeBlockAttack(target: IPlayer, perpetrator: IPlayer, msg: Message | string, cb: (proceed: boolean) => PlayerInput | undefined): PlayerInput | undefined {
    if (target.game.gameOptions.underworldExpansion === false) {
      return cb(true);
    }
    const privateMilitaryContractor = target.tableau.get(CardName.PRIVATE_MILITARY_CONTRACTOR);
    const militaryContractorFighters = privateMilitaryContractor?.resourceCount ?? 0;
    if (target.underworldData.corruption === 0 && militaryContractorFighters === 0) {
      return cb(true);
    }
    const options = new OrOptions()
      .setTitle(message('Spend 1 corruption to block an attack by ${0}?', (b) => b.player(perpetrator)))
      .setWarning(msg);
    if (privateMilitaryContractor !== undefined && militaryContractorFighters > 0) {
      options.options.push(
        new SelectOption(
          message('Block with ${0} fighters.', (b) => b.cardName(CardName.PRIVATE_MILITARY_CONTRACTOR)),
          'Spend fighter')
          .andThen(() => {
            target.removeResourceFrom(privateMilitaryContractor, 1);
            target.game.log(
              '${0} spent 1 fighter on ${1} to block an attack by ${2}',
              (b) => b.player(target).cardName(CardName.PRIVATE_MILITARY_CONTRACTOR).player(perpetrator));
            return cb(false);
          }),
      );
    }
    if (target.underworldData.corruption > 0) {
      options.options.push(
        new SelectOption('Block with corruption', 'Spend corruption')
          .andThen(() => {
            target.underworldData.corruption--;
            target.game.log(
              '${0} spent 1 corruption to block an attack by ${1}',
              (b) => b.player(target).player(perpetrator));
            return cb(false);
          }),
      );
    }
    options.options.push(
      new SelectOption('Do not block', 'Do not block')
        .andThen(() => {
          return cb(true);
        }),
    );
    return options;
  }

  public static gainCorruption(player: IPlayer, count: number, options?: {log: boolean}) {
    player.underworldData.corruption += count;
    if (options?.log === true) {
      player.game.log('${0} gained ${1} corruption', (b) => b.player(player).number(count));
    }
  }

  public static loseCorruption(player: IPlayer, count: number, options?: {log: boolean}) {
    player.underworldData.corruption -= count;
    if (options?.log === true) {
      player.game.log('${0} spent ${1} corruption', (b) => b.player(player).number(count));
    }
  }

  static removeAllUnclaimedTokens(game: IGame) {
    if (game.underworldData === undefined) {
      return;
    }
    for (const space of game.board.spaces.filter((space) => space.undergroundResources)) {
      if (space.undergroundResources !== undefined && space.excavator === undefined) {
        game.underworldData.tokens.push(space.undergroundResources);
        space.undergroundResources = undefined;
      }
    }
    inplaceShuffle(game.underworldData.tokens, game.rng);
    game.log('All unidentified underground resources have been shuffled back into the pile.');
  }

  static removeTokenFromSpace(game: IGame, space: Space) {
    if (game.underworldData === undefined) {
      return;
    }
    if (space.undergroundResources !== undefined && space.excavator === undefined) {
      game.underworldData.tokens.push(space.undergroundResources);
      space.undergroundResources = undefined;
    } else {
      throw new Error('Cannot reclaim that space');
    }
    inplaceShuffle(game.underworldData.tokens, game.rng);
  }

  /** Add the set of tokens to the pool, and then shuffle the pool */
  static addTokens(game: IGame, tokens: ReadonlyArray<UndergroundResourceToken>) {
    validateUnderworldExpansion(game);

    if (game.underworldData === undefined) {
      return;
    }
    game.underworldData.tokens.push(...tokens);
    inplaceShuffle(game.underworldData.tokens, game.rng);
  }

  static endGeneration(game: IGame) {
    for (const player of game.players) {
      player.underworldData.activeBonus = undefined;
      for (const claimedToken of player.underworldData.tokens) {
        claimedToken.active = false;
      }
    }
  }

  static gainCardResource(player: IPlayer, resource: CardResource, steps: number, count: number) {
    for (let i = 0; i < steps; i++) {
      player.game.defer(new AddResourcesToCard(player, resource, {count}));
    }
  }

  static gainStandardResource(player: IPlayer, resource: Resource, steps: number, count: number) {
    // The default priority runs before ATTACK_OPPONENT, so in this case an opponent (here, known as `player`
    // gains their plants from your asteroid-type card before you remove them afterwards from the same card.
    player.game.defer(
      new GainResourcesDeferred(player, resource, {count: count * steps, log: true}),
      Priority.DEFAULT);
  }

  // TODO(kberg): add viz for temperature bonus.
  static onTemperatureChange(game: IGame, steps: number) {
    game.playersInGenerationOrder.forEach((player) => {
      switch (player.underworldData.activeBonus) {
      case 'microbe2pertemp':
        this.gainCardResource(player, CardResource.MICROBE, steps, 2);
        break;

      case 'mcprod1pertemp':
        player.game.defer(new GainProduction(player, Resource.MEGACREDITS, {count: steps, log: true}));
        break;
      case 'plant2pertemp':
        this.gainStandardResource(player, Resource.PLANTS, steps, 2);
        break;
      case 'steel2pertemp':
        this.gainStandardResource(player, Resource.STEEL, steps, 2);
        break;
      case 'titanium1pertemp':
        this.gainStandardResource(player, Resource.TITANIUM, steps, 1);
        break;
      case undefined:
        break;
      }
    });
  }

  public static drawExcavationToken(game: IGame): UndergroundResourceToken {
    validateUnderworldExpansion(game);
    const token = game.underworldData?.tokens.pop();
    if (token === undefined) {
      throw new Error('No underground tokens');
    }
    return token;
  }

  public static onTilePlaced(game: IGame, space: Space) {
    space.excavator = undefined;
    if (space.undergroundResources !== undefined) {
      UnderworldExpansion.removeTokenFromSpace(game, space);
    }
  }

  private static GLOBAL_PARAMETER_MAPPING: Record<GlobalParameter, TemporaryBonusToken | undefined> = {
    [GlobalParameter.OCEANS]: 'oceanrequirementmod',
    [GlobalParameter.OXYGEN]: 'oxygenrequirementmod',
    [GlobalParameter.TEMPERATURE]: 'temprequirementmod',
    [GlobalParameter.VENUS]: undefined,
    [GlobalParameter.MOON_HABITAT_RATE]: undefined,
    [GlobalParameter.MOON_MINING_RATE]: undefined,
    [GlobalParameter.MOON_LOGISTIC_RATE]: undefined,
  } as const;

  public static getGlobalParameterRequirementBonus(player: IPlayer, parameter: GlobalParameter) {
    const activeBonus = player.underworldData.activeBonus;
    if (activeBonus !== undefined && activeBonus === this.GLOBAL_PARAMETER_MAPPING[parameter]) {
      return 3;
    }
    return 0;
  }

  static removeClaimedToken(player: IPlayer, idx: number) {
    const tokens = player.underworldData.tokens;
    const [token] = tokens.splice(idx, 1);
    if (token.active) {
      player.game.log('${0} discarded ${1}, ending its bonus for this generation', (b) => b.player(player).undergroundToken(token.token));
      player.underworldData.activeBonus = undefined;
    }
    if (token.token === 'sciencetag') {
      player.tags.extraScienceTags = Math.max(player.tags.extraScienceTags - 1, 0);
    } else if (token.token === 'planttag') {
      player.tags.extraPlantTags = Math.max(player.tags.extraPlantTags - 1, 0);
    }
  }
}

function validateUnderworldExpansion(game: IGame) {
  if (game.gameOptions.underworldExpansion !== true) {
    throw new Error('Underworld expansion not in this game');
  }
}
