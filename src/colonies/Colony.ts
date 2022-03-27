/* eslint-disable indent */ // TODO(kberg): Reformat separately
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {CardName} from '../common/cards/CardName';
import {ColonyBenefit} from '../common/colonies/ColonyBenefit';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {DiscardCards} from '../deferredActions/DiscardCards';
import {DrawCards} from '../deferredActions/DrawCards';
import {GiveColonyBonus} from '../deferredActions/GiveColonyBonus';
import {IncreaseColonyTrack} from '../deferredActions/IncreaseColonyTrack';
import {LogHelper} from '../LogHelper';
import {MAX_COLONY_TRACK_POSITION, PLAYER_DELEGATES_COUNT} from '../common/constants';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {Player} from '../Player';
import {PlayerId} from '../common/Types';
import {PlayerInput} from '../PlayerInput';
import {Resources} from '../common/Resources';
import {ScienceTagCard} from '../cards/community/ScienceTagCard';
import {SelectColony} from '../inputs/SelectColony';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {StealResources} from '../deferredActions/StealResources';
import {Tags} from '../common/cards/Tags';
import {SendDelegateToArea} from '../deferredActions/SendDelegateToArea';
import {Game} from '../Game';
import {Turmoil} from '../turmoil/Turmoil';
import {ShouldIncreaseTrack} from '../common/colonies/ShouldIncreaseTrack';
import {SerializedColony} from '../SerializedColony';
import {IColony, TradeOptions} from './IColony';
import {colonyMetadata, IColonyMetadata, IInputColonyMetadata} from '../common/colonies/IColonyMetadata';
import {ColonyName} from '../common/colonies/ColonyName';

export abstract class Colony implements IColony {
    // Players can't build colonies on Miranda until someone has played an Animal card.
    // isActive is the gateway for that action and any other card with that type of constraint
    public isActive: boolean = true;
    public visitor: undefined | PlayerId = undefined;
    public colonies: Array<PlayerId> = [];
    public trackPosition: number = 1;

    public metadata: IColonyMetadata;

    protected constructor(metadata: IInputColonyMetadata) {
      this.metadata = colonyMetadata(metadata);
    }

    public get name(): ColonyName {
      return this.metadata.name;
    }

    public endGeneration(game: Game): void {
      if (this.isActive) {
        this.increaseTrack();
      }
      // Syndicate Pirate Raids hook. If it is in effect, then only the syndicate pirate raider will
      // retrieve their fleets.
      // See Player.ts for the other half of this effect, and Game.ts which disables it.
      if (game.syndicatePirateRaider) {
        if (game.syndicatePirateRaider === this.visitor) {
          this.visitor = undefined;
        }
      } else {
        this.visitor = undefined;
      }
    }

    public increaseTrack(value: number = 1): void {
      this.trackPosition = Math.min(this.trackPosition + value, MAX_COLONY_TRACK_POSITION);
    }

    public decreaseTrack(value: number = 1): void {
      this.trackPosition = Math.max(this.trackPosition - value, this.colonies.length);
    }

    public isColonyFull(): boolean {
      return this.colonies.length >= 3;
    }

    public addColony(player: Player, options?: {giveBonusTwice: boolean}): void {
      player.game.log('${0} built a colony on ${1}', (b) => b.player(player).colony(this));

      this.giveBonus(player, this.metadata.buildType, this.metadata.buildQuantity[this.colonies.length], this.metadata.buildResource);
      if (options?.giveBonusTwice === true) { // Vital Colony hook.
        this.giveBonus(player, this.metadata.buildType, this.metadata.buildQuantity[this.colonies.length], this.metadata.buildResource);
      }

      this.colonies.push(player.id);
      if (this.trackPosition < this.colonies.length) {
        this.trackPosition = this.colonies.length;
      }

      // Poseidon hook
      const poseidon = player.game.getPlayers().find((player) => player.isCorporation(CardName.POSEIDON));
      if (poseidon !== undefined) {
        poseidon.addProduction(Resources.MEGACREDITS, 1);
      }
    }

    /*
     * Trade with this colony.
     *
     * Before passing off the trade, this determines whether the track should advance prior to trading, and then
     * hands off the real work to `handleTrade`.
     *
     * @param bonusTradeOffset an offset that allows a player to increase the colony tile track marker before trading.
     * @param usesTradeFleet when false, the player can trade without an available trade fleet.
     * @param decreaseTrackAfterTrade when false, the track does not decrease after trading.
     * @returns
     */
    public trade(player: Player, tradeOptions: TradeOptions = {}, bonusTradeOffset = 0): void {
      const tradeOffset = player.colonyTradeOffset + bonusTradeOffset;
      const maxTrackPosition = Math.min(this.trackPosition + tradeOffset, MAX_COLONY_TRACK_POSITION);
      const steps = maxTrackPosition - this.trackPosition;

      if (steps === 0 ||
        this.metadata.shouldIncreaseTrack === ShouldIncreaseTrack.NO ||
        tradeOptions.selfishTrade === true) {
        // Don't increase
        this.handleTrade(player, tradeOptions);
        return;
      }

      if (this.metadata.shouldIncreaseTrack === ShouldIncreaseTrack.YES || (this.metadata.tradeResource !== undefined && this.metadata.tradeResource[this.trackPosition] === this.metadata.tradeResource[maxTrackPosition])) {
        // No point in asking the player, just increase it
        this.increaseTrack(steps);
        LogHelper.logColonyTrackIncrease(player, this, steps);
        this.handleTrade(player, tradeOptions);
        return;
      }

      // Ask the player if they want to increase the track
      player.game.defer(new IncreaseColonyTrack(
        player,
        this,
        steps,
        () => this.handleTrade(player, tradeOptions),
      ));
    }

    private handleTrade(player: Player, options: TradeOptions) {
      const resource = Array.isArray(this.metadata.tradeResource) ? this.metadata.tradeResource[this.trackPosition] : this.metadata.tradeResource;

      this.giveBonus(player, this.metadata.tradeType, this.metadata.tradeQuantity[this.trackPosition], resource);

      // !== false because default is true.
      if (options.giveColonyBonuses !== false) {
        player.game.defer(new GiveColonyBonus(player, this, options.selfishTrade));
      }

      // !== false because default is true.
      if (options.usesTradeFleet !== false) {
        this.visitor = player.id;
        player.tradesThisGeneration++;
      }

      // !== false because default is true.
      if (options.decreaseTrackAfterTrade !== false) {
        player.game.defer(new DeferredAction(player, () => {
          this.trackPosition = this.colonies.length;
          return undefined;
        }), Priority.DECREASE_COLONY_TRACK_AFTER_TRADE);
      }
    }

    public giveColonyBonus(player: Player, isGiveColonyBonus: boolean = false): undefined | PlayerInput {
      return this.giveBonus(player, this.metadata.colonyBonusType!, this.metadata.colonyBonusQuantity!, this.metadata.colonyBonusResource, isGiveColonyBonus);
    }


    private giveBonus(player: Player, bonusType: ColonyBenefit, quantity: number, resource: Resources | undefined, isGiveColonyBonus: boolean = false): undefined | PlayerInput {
      const game = player.game;

      let action: undefined | DeferredAction = undefined;
      switch (bonusType) {
      case ColonyBenefit.ADD_RESOURCES_TO_CARD:
        const resourceType = this.metadata.resourceType!;
        action = new AddResourcesToCard(player, resourceType, {count: quantity});
        break;

      case ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD:
        action = new AddResourcesToCard(player, undefined, {count: quantity, restrictedTag: Tags.VENUS, title: 'Select Venus card to add ' + quantity + ' resource(s)'});
        break;

      case ColonyBenefit.COPY_TRADE:
        const openColonies = game.colonies.filter((colony) => colony.isActive);
        action = new DeferredAction(
          player,
          () => new SelectColony('Select colony to gain trade income from', 'Select', openColonies, (colony: IColony) => {
            game.log('${0} gained ${1} trade bonus', (b) => b.player(player).colony(colony));
            (colony as Colony).handleTrade(player, {
              usesTradeFleet: false,
              decreaseTrackAfterTrade: false,
              giveColonyBonuses: false,
            });
            return undefined;
          }),
        );
        break;

      case ColonyBenefit.DRAW_CARDS:
        action = DrawCards.keepAll(player, quantity);
        break;

      case ColonyBenefit.DRAW_CARDS_AND_BUY_ONE:
        action = DrawCards.keepSome(player, 1, {paying: true, logDrawnCard: true});
        break;

      case ColonyBenefit.DRAW_CARDS_AND_DISCARD_ONE:
        player.drawCard();
        action = new DiscardCards(player, 1, this.name + ' colony bonus. Select a card to discard');
        break;

      case ColonyBenefit.DRAW_CARDS_AND_KEEP_ONE:
        action = DrawCards.keepSome(player, quantity, {keepMax: 1});
        break;

      case ColonyBenefit.GAIN_CARD_DISCOUNT:
        player.cardDiscount += 1;
        game.log('Cards played by ${0} cost 1 M€ less this generation', (b) => b.player(player));
        break;

      case ColonyBenefit.GAIN_PRODUCTION:
        if (resource === undefined) throw new Error('Resource cannot be undefined');
        player.addProduction(resource, quantity, {log: true});
        break;

      case ColonyBenefit.GAIN_RESOURCES:
        if (resource === undefined) throw new Error('Resource cannot be undefined');
        player.addResource(resource, quantity, {log: true});
        break;

      case ColonyBenefit.GAIN_SCIENCE_TAG:
        player.scienceTagCount += 1;
        player.playCard(new ScienceTagCard(), undefined, false);
        game.log('${0} gained 1 Science tag', (b) => b.player(player));
        break;

      case ColonyBenefit.GAIN_INFLUENCE:
        Turmoil.ifTurmoil(game, (turmoil) => {
          turmoil.addInfluenceBonus(player);
          game.log('${0} gained 1 influence', (b) => b.player(player));
        });
        break;

      case ColonyBenefit.PLACE_DELEGATES:
        Turmoil.ifTurmoil(game, (turmoil) => {
          const playerHasLobbyDelegate = turmoil.lobby.has(player.id);
          let availablePlayerDelegates = turmoil.getAvailableDelegateCount(player.id, 'reserve');
          if (playerHasLobbyDelegate) availablePlayerDelegates += 1;

          const qty = Math.min(quantity, availablePlayerDelegates);

          for (let i = 0; i < qty; i++) {
            const fromLobby = (i === qty - 1 && qty === availablePlayerDelegates && playerHasLobbyDelegate);
            game.defer(new SendDelegateToArea(player, 'Select where to send delegate', {source: fromLobby ? 'lobby' : 'reserve'}));
          }
        });
        break;

      case ColonyBenefit.GIVE_MC_PER_DELEGATE:
        Turmoil.ifTurmoil(game, (turmoil) => {
          let partyDelegateCount = PLAYER_DELEGATES_COUNT - turmoil.getAvailableDelegateCount(player.id, 'reserve');
          if (turmoil.lobby.has(player.id)) partyDelegateCount--;
          if (turmoil.chairman === player.id) partyDelegateCount--;

          player.addResource(Resources.MEGACREDITS, partyDelegateCount, {log: true});
        });
        break;

      case ColonyBenefit.GAIN_TR:
        if (quantity > 0) {
          player.increaseTerraformRatingSteps(quantity, {log: true});
        }
        break;

      case ColonyBenefit.GAIN_VP:
        if (quantity > 0) {
          player.colonyVictoryPoints += quantity;
          game.log('${0} gained ${1} VP', (b) => b.player(player).number(quantity));
        }
        break;

      case ColonyBenefit.INCREASE_VENUS_SCALE:
        game.increaseVenusScaleLevel(player, quantity as 3|2|1);
        game.log('${0} increased Venus scale ${1} step(s)', (b) => b.player(player).number(quantity));
        break;

      case ColonyBenefit.LOSE_RESOURCES:
        if (resource === undefined) throw new Error('Resource cannot be undefined');
        player.deductResource(resource, quantity);
        break;

      case ColonyBenefit.OPPONENT_DISCARD:
        if (game.isSoloMode()) break;
        action = new DeferredAction(
          player,
          () => {
            const playersWithCards = game.getPlayers().filter((p) => p.cardsInHand.length > 0);
            if (playersWithCards.length === 0) return undefined;
            return new SelectPlayer(
              playersWithCards,
              'Select player to discard a card',
              'Select',
              (selectedPlayer: Player) => {
                game.defer(new DiscardCards(selectedPlayer, 1, this.name + ' colony effect. Select a card to discard'));
                return undefined;
              },
            );
          },
        );
        break;

      case ColonyBenefit.PLACE_OCEAN_TILE:
        action = new PlaceOceanTile(player, 'Select ocean space for ' + this.name + ' colony');
        break;

      case ColonyBenefit.STEAL_RESOURCES:
        if (resource === undefined) throw new Error('Resource cannot be undefined');
        action = new StealResources(player, resource, quantity);
        break;

      default:
        throw new Error('Unsupported benefit type');
      }

      if (action !== undefined) {
        if (isGiveColonyBonus) {
          /*
           * When this method is called from within the GiveColonyBonus deferred action
           * we return the player input directly instead of deferring it
           */
          return action.execute(); // undefined | PlayerInput
        } else {
          game.defer(action);
          return undefined;
        }
      } else {
        return undefined;
      }
    }

    public serialize(): SerializedColony {
      return {
        name: this.name,
        colonies: this.colonies,
        isActive: this.isActive,
        trackPosition: this.trackPosition,
        visitor: this.visitor,
      };
    }
}
