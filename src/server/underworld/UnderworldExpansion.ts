import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';
import {Space} from '../boards/Space';
import {UnderworldData} from './UnderworldData';
import {Random} from '../../common/utils/Random';
import {TemporaryBonusToken, UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';
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

export class UnderworldExpansion {
  private constructor() {}

  public static initialize(rnd: Random): UnderworldData {
    const tokens = this.allTokens();
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

  private static allTokens(): Array<UndergroundResourceToken> {
    const tokens: Array<UndergroundResourceToken> = [];
    function add(count: number, token: UndergroundResourceToken) {
      for (let idx = 0; idx < count; idx++) {
        tokens.push(token);
      }
    }

    add(5, 'nothing');

    add(13, 'corruption1');
    add(2, 'corruption2');

    add(4, 'card1');
    add(1, 'card2');

    add(2, 'mcprod1pertemp');

    add(2, 'steel2plant');
    add(4, 'steel1production');
    add(3, 'steel2pertemp');

    add(3, 'titaniumandplant');
    add(3, 'titanium2');
    add(1, 'titanium1production');
    add(3, 'titanium1pertemp');

    add(4, 'plant2');
    add(1, 'plant3');
    add(4, 'plant1production');
    add(3, 'plant2pertemp');

    add(2, 'energy2');
    add(5, 'energy1production');
    add(3, 'heat2production');

    add(4, 'microbe2');
    add(1, 'microbe2pertemp');

    add(2, 'tr');
    add(2, 'ocean');
    add(2, 'sciencetag');
    add(2, 'planttag');
    add(2, 'anyresource1');
    add(2, 'place6mc');

    add(2, 'oceanrequirementmod');
    add(2, 'oxygenrequirementmod');
    add(2, 'temprequirementmod');

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

    for (const p of game.playersInGenerationOrder) {
      for (const card of p.tableau) {
        card.onIdentificationByAnyPlayer?.(p, player, space);
      }
    }
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
      if (adjacentSpace.tile === undefined) {
        UnderworldExpansion.identify(game, adjacentSpace, player);
      }
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
    case 'data1':
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 1}));
      break;
    case 'data2':
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 2}));
      break;
    case 'data3':
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 3}));
      break;
    case 'steel2':
      player.stock.add(Resource.STEEL, 2, {log: true});
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
    case 'microbe1':
      player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 1}));
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
    case 'data1pertemp':
    case 'mcprod1pertemp':
    case 'microbe1pertemp':
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
      for (const card of player.tableau) {
        card.onNonCardTagAdded?.(player, Tag.SCIENCE);
      }
      break;
    case 'planttag':
      player.tags.extraPlantTags++;
      for (const card of player.tableau) {
        card.onNonCardTagAdded?.(player, Tag.PLANT);
      }
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

  //   // TODOc(kberg): add viz for temperature bonus.
  static onTemperatureChange(game: IGame, steps: number) {
    game.playersInGenerationOrder.forEach((player) => {
      switch (player.underworldData.activeBonus) {
      case 'data1pertemp':
      case 'microbe1pertemp':
        const resource = player.underworldData.activeBonus === 'data1pertemp' ? CardResource.DATA : CardResource.MICROBE;
        for (let i = 0; i < steps; i++) {
          player.game.defer(new AddResourcesToCard(player, resource));
        }
        break;
      case 'microbe2pertemp':
        // TODO(kberg): Replace with RunNTimes.
        for (let i = 0; i < steps; i++) {
          player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));
        }
        break;

      case 'mcprod1pertemp':
        player.production.add(Resource.MEGACREDITS, steps, {log: true});
        break;
      case 'plant2pertemp':
        player.stock.add(Resource.PLANTS, 2 * steps, {log: true});
        break;
      case 'steel2pertemp':
        player.stock.add(Resource.STEEL, 2 * steps, {log: true});
        break;
      case 'titanium1pertemp':
        player.stock.add(Resource.TITANIUM, steps, {log: true});
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
    [GlobalParameter.MOON_LOGISTICS_RATE]: undefined,
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
      // TODO(kberg): Log the discard.
      player.underworldData.activeBonus = undefined;
    }
  }
}

function validateUnderworldExpansion(game: IGame) {
  if (game.gameOptions.underworldExpansion !== true) {
    throw new Error('Underworld expansion not in this game');
  }
}
