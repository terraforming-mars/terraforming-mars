import {BonusCardName} from '@/common/automa/BonusCardName';
import {FAILED_ACTION_MC, TrackDefinition} from '@/common/automa/AutomaTypes';
import {GlobalParameter} from '@/common/GlobalParameter';
import {SpaceId} from '@/common/Types';
import {TileType} from '@/common/TileType';
import {ColonyName} from '@/common/colonies/ColonyName';
import {inplaceRemove} from '@/common/utils/utils';
import {Random} from '@/common/utils/Random';
import {IGame} from '@/server/IGame';
import {IPlayer} from '@/server/IPlayer';
import {LogHelper} from '@/server/LogHelper';
import {Space} from '@/server/boards/Space';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {MarsBotBonusDeck} from '@/server/automa/MarsBotBonusDeck';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';
import {createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
import {MarsBotShippingBoard} from '@/server/automa/colonies/MarsBotShippingBoard';

/**
 * The MarsBot opponent: its board, its M€ and floaters, and its bonus deck.
 *
 * It is not a `Player`. It drives the `Player` that owns its tiles and holds its TR from outside.
 * Nothing creates it yet: the turn loop, the game's hooks into it, save and restore, and the
 * client model come later. Members whose logic is still in review throw.
 */
export class MarsBot implements IMarsBot {
  public readonly marsBotBoard: MarsBotBoard;
  public readonly bonusDeck: MarsBotBonusDeck;
  /** Where the bot's colonies and trades store their resources, and its floaters without Venus Next (rulebook C, p.5). */
  public readonly shippingBoard: MarsBotShippingBoard = new MarsBotShippingBoard(this);
  private readonly tilePlacer: MarsBotTilePlacer = new MarsBotTilePlacer(this);

  public megacredits: number = 0;
  public readonly failedActionMc: number = FAILED_ACTION_MC;
  public mcKeptThroughIntervention: number | undefined = undefined;
  public bonusMcBlocked: boolean = false;
  public floaters: number = 0;
  public playedProjectCards: Array<IProjectCard> = [];
  public temperatureRaises: number = 0;
  public destroyedBonusCards: number = 0;
  /** The space holding the bot's Neural Instance tile. Undefined until it places one. */
  public neuralInstanceSpace: Space | undefined = undefined;
  /** Spaces holding one of the bot's player markers and no tile yet. */
  public markerSpaceIds: Array<SpaceId> = [];
  public corpSpecificState: Map<string, number> = new Map();

  constructor(
    public readonly game: IGame,
    public readonly player: IPlayer,
    public readonly humanPlayer: IPlayer,
    boardData: ReadonlyArray<TrackDefinition>,
    private readonly random: Random,
  ) {
    this.marsBotBoard = new MarsBotBoard(boardData);
    this.bonusDeck = MarsBotBonusDeck.create(random, {
      venus: game.gameOptions.venusNextExtension,
      colonies: game.gameOptions.coloniesExtension,
    });
  }

  public gainMc(amount: number): void {
    if (amount > 0) {
      this.megacredits += amount;
    }
  }

  public loseMc(amount: number): number {
    const lost = Math.min(amount, this.megacredits);
    this.megacredits -= lost;
    return lost;
  }

  public raiseTR(steps: number): void {
    if (steps > 0) {
      this.player.increaseTerraformRating(steps);
    } else if (steps < 0) {
      this.player.decreaseTerraformRating(-steps);
    }
  }

  public addFloaters(count: number): void {
    if (this.usesTitanStorageForFloaters()) {
      this.shippingBoard.add(ColonyName.TITAN, count);
    } else {
      this.floaters += count;
    }
  }

  public spendFloaters(count: number): void {
    if (this.usesTitanStorageForFloaters()) {
      this.shippingBoard.storage.set(ColonyName.TITAN, Math.max(0, this.shippingBoard.get(ColonyName.TITAN) - count));
    } else {
      this.floaters = Math.max(0, this.floaters - count);
    }
  }

  /** True when the bot keeps its floaters in the Titan storage area: Colonies without Venus Next (rulebook C, p.4-5). */
  private usesTitanStorageForFloaters(): boolean {
    const options = this.game.gameOptions;
    return options.coloniesExtension && !options.venusNextExtension;
  }

  public advanceTrack(_trackIndex: number): void {
    throw new Error('TODO(ignac8): advance a track and resolve its icon, in #8754');
  }

  public maybeAdvanceTrack(trackIndex: number): void {
    if (!this.marsBotBoard.tracks[trackIndex].canAdvance()) {
      this.game.log('MarsBot: track ${0} at max, no effect', (b) => b.number(trackIndex + 1));
      return;
    }
    this.advanceTrack(trackIndex);
  }

  public advanceTrackOfTag(): boolean {
    throw new Error('TODO(ignac8): advance the track that carries a tag, in #8754');
  }

  public resolveProjectCard(): void {
    throw new Error('TODO(ignac8): resolve a project card, in #8754');
  }

  public maybeDrawAndResolveProjectCard(): void {
    throw new Error('TODO(ignac8): resolve a project card, in #8754');
  }

  public maybeDrawAndResolveProjectCardFirstTagOnly(): void {
    throw new Error('TODO(ignac8): resolve a project card, in #8754');
  }

  public removePlayedProjectCard(card: IProjectCard): void {
    inplaceRemove(this.playedProjectCards, card);
  }

  public placeOcean(): void {
    throw new Error('TODO(ignac8): place an ocean for a track icon, in #8754');
  }

  public placeCity(): void {
    throw new Error('TODO(ignac8): place a city for a track icon, in #8754');
  }

  public placeGreenery(): void {
    throw new Error('TODO(ignac8): place a greenery for a track icon, in #8754');
  }

  public placeNeuralInstance(space: Space): void {
    this.game.simpleAddTile(this.player, space, {tileType: TileType.NEURAL_INSTANCE});
    this.gainMc(this.tilePlacer.getTotalPlacementMC(space));
    this.neuralInstanceSpace = space;
  }

  public placeMarker(space: Space): void {
    space.player = this.player;
    this.markerSpaceIds.push(space.id);
    LogHelper.logBoardTileAction(this.player, space, 'player marker');
  }

  public removeMarker(space: Space): boolean {
    return inplaceRemove(this.markerSpaceIds, space.id);
  }

  public maybeDrawAndResolveBonusCard(): void {
    if (this.game.isDoneWithFinalProduction()) {
      this.game.log('MarsBot: the game has ended, it draws no card');
      return;
    }
    const card = this.bonusDeck.draw(this.game);
    if (card === undefined) {
      return;
    }
    const destroyed = card.resolve(this);
    // Only a destroyed card counts for the Land Specialist milestone, not one shuffled back into the deck.
    if (destroyed && !this.bonusDeck.drawPile.includes(card)) {
      this.destroyedBonusCards++;
    }
    if (!destroyed) {
      this.bonusDeck.discard(card);
    }
  }

  public resolveBonusCard(bonusCardName: BonusCardName): void {
    const card = createBonusCard(bonusCardName);
    this.game.log('MarsBot resolves bonus card: ${0}', (b) => b.bonusCardName(card.name));
    card.resolve(this);
  }

  public addBonusCardToBonusDeck(bonusCardName: BonusCardName): void {
    const drawPile = this.bonusDeck.drawPile;
    drawPile.splice(this.random.nextInt(drawPile.length + 1), 0, createBonusCard(bonusCardName));
  }

  public addBonusCardToBottomOfBonusDeck(bonusCardName: BonusCardName): void {
    // The deck draws from the end of the draw pile.
    this.bonusDeck.drawPile.unshift(createBonusCard(bonusCardName));
  }

  public addProjectCardsToBonusDeck(): void {
    throw new Error('TODO(ignac8): the action deck, in ignac8/terraforming-mars#94');
  }

  public maybeMoveBonusCardToActionDeck(): void {
    throw new Error('TODO(ignac8): the action deck, in ignac8/terraforming-mars#94');
  }

  public returnSetupBonusCardToBonusDeck(): void {
    throw new Error('TODO(ignac8): the action deck, in ignac8/terraforming-mars#94');
  }

  public drawProjectCardsToActionDeck(): void {
    throw new Error('TODO(ignac8): the action deck, in ignac8/terraforming-mars#94');
  }

  public addBonusCardToActionDeck(): void {
    throw new Error('TODO(ignac8): the action deck, in ignac8/terraforming-mars#94');
  }

  public removeBonusCard(): void {
    throw new Error('TODO(ignac8): the action deck, in ignac8/terraforming-mars#94');
  }

  public maybeDiscardProjectCardWithFewestTags(): void {
    throw new Error('TODO(ignac8): the action deck, in ignac8/terraforming-mars#94');
  }

  public maybeClaimMilestone(): boolean {
    throw new Error('TODO(ignac8): choose a milestone to claim, in #8755');
  }

  public maybeFundAward(): boolean {
    throw new Error('TODO(ignac8): choose an award to fund, in #8755');
  }

  /** Raises the temperature `steps` times. Pristar's cube cancels only the first, as the steps resolve one at a time (BGG 3431297, 3432237). */
  public raiseTemperature(steps: 1 | 2): void {
    if (this.game.getTemperature() >= this.game.max.temperature) {
      return;
    }
    const taken = this.interceptsParameterRaise(GlobalParameter.TEMPERATURE) ? steps - 1 : steps;
    if (taken === 0) {
      return;
    }
    const before = this.game.getTemperature();
    this.game.increaseTemperature(this.player, taken as 1 | 2);
    const raised = (this.game.getTemperature() - before) / 2;
    this.temperatureRaises += raised;
    this.game.log('MarsBot raises temperature ${0} step(s)', (b) => b.number(raised));
  }

  /** Returns false: the bot has no corp yet. */
  public interceptsParameterRaise(_parameter: GlobalParameter): boolean {
    return false;
  }

  public advanceFurthestParameter(bonusCardName: BonusCardName, allowCorpIntercept: boolean = true): boolean {
    const game = this.game;
    const intercepts = (parameter: GlobalParameter) => allowCorpIntercept && this.interceptsParameterRaise(parameter);
    const parameters: Array<{message: string, remaining: number, raise: () => boolean}> = [
      {message: 'MarsBot (${0}): raises the oxygen, furthest from completion', remaining: game.max.oxygen - game.getOxygenLevel(), raise: () => {
        if (game.getOxygenLevel() >= game.max.oxygen) {
          return false;
        }
        if (!intercepts(GlobalParameter.OXYGEN)) {
          game.increaseOxygenLevel(this.player, 1);
        }
        return true;
      }},
      {message: 'MarsBot (${0}): places an ocean, furthest from completion', remaining: game.max.oceans - game.board.getOceanSpaces().length, raise: () => {
        const space = game.canAddOcean() ? this.tilePlacer.findOceanSpace() : undefined;
        if (space === undefined) {
          return false;
        }
        if (!intercepts(GlobalParameter.OCEANS)) {
          game.addOcean(this.player, space);
          this.gainMc(this.tilePlacer.getTotalPlacementMC(space));
        }
        return true;
      }},
      {message: 'MarsBot (${0}): raises the temperature, furthest from completion', remaining: (game.max.temperature - game.getTemperature()) / 2, raise: () => {
        if (game.getTemperature() >= game.max.temperature) {
          return false;
        }
        if (!intercepts(GlobalParameter.TEMPERATURE)) {
          game.increaseTemperature(this.player, 1);
        }
        return true;
      }},
    ];
    // Most steps remaining first. The sort is stable, so a tie keeps the order above.
    parameters.sort((first, second) => second.remaining - first.remaining);
    for (const parameter of parameters) {
      if (parameter.raise()) {
        game.log(parameter.message, (b) => b.bonusCardName(bonusCardName));
        return true;
      }
    }
    return false;
  }

  public maybePlaceGreenery(): boolean {
    const space = this.tilePlacer.findGreenerySpace();
    if (space === undefined) {
      return false;
    }
    const raiseOxygen = this.game.getOxygenLevel() >= this.game.max.oxygen || !this.interceptsParameterRaise(GlobalParameter.OXYGEN);
    this.game.addGreenery(this.player, space, raiseOxygen);
    this.gainMc(this.tilePlacer.getTotalPlacementMC(space));
    return true;
  }

  public withoutTRGain(action: () => void): void {
    const trBefore = this.player.terraformRating;
    action();
    const trGained = this.player.terraformRating - trBefore;
    if (trGained > 0) {
      this.player.decreaseTerraformRating(trGained);
      this.game.log('MarsBot (${0}): returns ${1} TR', (b) => b.bonusCardName(BonusCardName.GOVERNMENT_INTERVENTION).number(trGained));
    }
  }

  public withoutTRorMcGain(action: () => void): void {
    const mcBefore = this.megacredits;
    this.mcKeptThroughIntervention = 0;
    this.withoutTRGain(action);
    const kept = this.mcKeptThroughIntervention ?? 0;
    this.mcKeptThroughIntervention = undefined;
    const returned = this.megacredits - (mcBefore + kept);
    if (returned > 0) {
      this.megacredits = mcBefore + kept;
      this.game.log('MarsBot (${0}): returns ${1}:r:mc:', (b) => b.bonusCardName(BonusCardName.GOVERNMENT_INTERVENTION).number(returned));
    }
  }

  public maybePlaceRandomColony(): boolean {
    throw new Error('TODO(ignac8): build a colony, in #8752');
  }

  public canPlaceColony(): boolean {
    throw new Error('TODO(ignac8): find a colony tile with room, in #8752');
  }

  public maybeTrade(): void {
    throw new Error('TODO(ignac8): trade with a colony, in #8753');
  }

  public getCorpState(key: string): number {
    return this.corpSpecificState.get(key) ?? 0;
  }

  public setCorpState(key: string, value: number): void {
    this.corpSpecificState.set(key, value);
  }
}
