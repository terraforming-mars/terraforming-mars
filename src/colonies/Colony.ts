import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {CardName} from '../CardName';
import {ColonyBenefit} from './ColonyBenefit';
import {ColonyModel} from '../models/ColonyModel';
import {ColonyName} from './ColonyName';
import {DeferredAction} from '../deferredActions/DeferredAction';
import {DiscardCards} from '../deferredActions/DiscardCards';
import {DrawCards} from '../deferredActions/DrawCards';
import {Game} from '../Game';
import {GiveColonyBonus} from '../deferredActions/GiveColonyBonus';
import {IProjectCard} from '../cards/IProjectCard';
import {IncreaseColonyTrack} from '../deferredActions/IncreaseColonyTrack';
import {LogHelper} from '../LogHelper';
import {MAX_COLONY_TRACK_POSITION, PLAYER_DELEGATES_COUNT} from '../constants';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {Player, PlayerId} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {ResourceType} from '../ResourceType';
import {Resources} from '../Resources';
import {ScienceTagCard} from '../cards/community/ScienceTagCard';
import {SelectCardToKeep} from '../deferredActions/SelectCardToKeep';
import {SelectColony} from '../inputs/SelectColony';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SerializedColony} from '../SerializedColony';
import {StealResources} from '../deferredActions/StealResources';
import {Tags} from '../cards/Tags';
import {SendDelegateToArea} from '../deferredActions/SendDelegateToArea';

export enum ShouldIncreaseTrack { YES, NO, ASK }

export abstract class Colony implements SerializedColony {
    public abstract name: ColonyName;
    public abstract description: string;

    public isActive: boolean = true;
    public visitor: undefined | PlayerId = undefined;
    public colonies: Array<PlayerId> = [];
    public trackPosition: number = 1;
    public resourceType?: ResourceType;

    public abstract buildType: ColonyBenefit;
    public buildQuantity: Array<number> = [1, 1, 1];
    public buildResource?: Resources;
    public abstract tradeType: ColonyBenefit;
    public tradeQuantity: Array<number> = [1, 1, 1, 1, 1, 1, 1];
    public tradeResource?: Resources | Array<Resources>;
    public abstract colonyBonusType: ColonyBenefit;
    public colonyBonusQuantity: number = 1;
    public colonyBonusResource?: Resources;
    public shouldIncreaseTrack: ShouldIncreaseTrack = ShouldIncreaseTrack.YES;


    public endGeneration(): void {
      if (this.isActive) {
        this.increaseTrack();
      }
      this.visitor = undefined;
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

    public addColony(player: Player, game: Game): void {
      game.log('${0} built a colony on ${1}', (b) => b.player(player).colony(this));

      this.giveBonus(player, game, this.buildType, this.buildQuantity[this.colonies.length], this.buildResource);

      this.colonies.push(player.id);
      if (this.trackPosition < this.colonies.length) {
        this.trackPosition = this.colonies.length;
      }

      // Poseidon hook
      const poseidon = game.getPlayers().find((player) => player.isCorporation(CardName.POSEIDON));
      if (poseidon !== undefined) {
        poseidon.addProduction(Resources.MEGACREDITS);
      }
    }

    public trade(player: Player, game: Game, bonusTradeOffset: number = 0, usesTradeFleet: boolean = true, decreaseTrackAfterTrade: boolean = true): void {
      const tradeOffset = player.colonyTradeOffset + bonusTradeOffset;
      const maxTrackPosition = Math.min(this.trackPosition + tradeOffset, MAX_COLONY_TRACK_POSITION);
      const steps = maxTrackPosition - this.trackPosition;

      if (steps === 0 || this.shouldIncreaseTrack === ShouldIncreaseTrack.NO) {
        // Don't increase
        this.handleTrade(player, game, usesTradeFleet, decreaseTrackAfterTrade);
        return;
      }

      if (this.shouldIncreaseTrack === ShouldIncreaseTrack.YES || (this.tradeResource !== undefined && this.tradeResource[this.trackPosition] === this.tradeResource[maxTrackPosition])) {
        // No point in asking the player, just increase it
        this.increaseTrack(steps);
        LogHelper.logColonyTrackIncrease(player, this, steps);
        this.handleTrade(player, game, usesTradeFleet, decreaseTrackAfterTrade);
        return;
      }

      // Ask the player if they want to increase the track
      game.defer(new IncreaseColonyTrack(
        player,
        game,
        this,
        steps,
        () => this.handleTrade(player, game, usesTradeFleet, decreaseTrackAfterTrade),
      ));
    }

    private handleTrade(player: Player, game: Game, usesTradeFleet: boolean, decreaseTrackAfterTrade: boolean) {
      const resource = Array.isArray(this.tradeResource) ? this.tradeResource[this.trackPosition] : this.tradeResource;

      this.giveBonus(player, game, this.tradeType, this.tradeQuantity[this.trackPosition], resource);

      game.defer(new GiveColonyBonus(player, game, this));

      if (usesTradeFleet) {
        this.visitor = player.id;
        player.tradesThisTurn++;
      }

      if (decreaseTrackAfterTrade) {
        game.defer(new DeferredAction(player, () => {
          this.trackPosition = this.colonies.length;
          return undefined;
        }));
      }
    }

    public giveColonyBonus(player: Player, game: Game, isGiveColonyBonus: boolean = false): undefined | PlayerInput {
      return this.giveBonus(player, game, this.colonyBonusType!, this.colonyBonusQuantity!, this.colonyBonusResource, isGiveColonyBonus);
    }


    private giveBonus(player: Player, game: Game, bonusType: ColonyBenefit, quantity: number, resource: Resources | undefined, isGiveColonyBonus: boolean = false): undefined | PlayerInput {
      let action: undefined | DeferredAction = undefined;
      switch (bonusType) {
      case ColonyBenefit.ADD_RESOURCES_TO_CARD:
        const resourceType = this.resourceType!;
        action = new AddResourcesToCard(player, game, resourceType, {count: quantity});
        break;

      case ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD:
        action = new AddResourcesToCard(player, game, undefined, {count: quantity, restrictedTag: Tags.VENUS, title: 'Select Venus card to add ' + quantity + ' resource(s)'});
        break;

      case ColonyBenefit.COPY_TRADE:
        const openColonies = game.colonies.filter((colony) => colony.isActive);
        const coloniesModel: Array<ColonyModel> = game.getColoniesModel(openColonies);
        action = new DeferredAction(
          player,
          () => new SelectColony('Select colony to gain trade income from', 'Select', coloniesModel, (colonyName: ColonyName) => {
            openColonies.forEach((colony) => {
              if (colony.name === colonyName) {
                game.log('${0} gained ${1} trade bonus', (b) => b.player(player).colony(colony));
                colony.trade(player, game, 0, false, false);
              }
              return undefined;
            });
            return undefined;
          }),
        );
        break;

      case ColonyBenefit.DRAW_CARDS:
        action = DrawCards.keepAll(player, quantity);
        break;

      case ColonyBenefit.DRAW_CARDS_AND_BUY_ONE:
        action = DrawCards.keepSome(player, 1, {paying: true});
        break;

      case ColonyBenefit.DRAW_CARDS_AND_DISCARD_ONE:
        player.drawCard();
        action = new DiscardCards(player, game, 1, this.name + ' colony bonus. Select a card to discard');
        break;

      case ColonyBenefit.DRAW_CARDS_AND_KEEP_ONE:
        const cardsDrawn: Array<IProjectCard> = [];
        for (let counter = 0; counter < quantity; counter++) {
          cardsDrawn.push(game.dealer.dealCard());
        };
        action = new SelectCardToKeep(player, game, 'Select card to take into hand', cardsDrawn);
        break;

      case ColonyBenefit.GAIN_CARD_DISCOUNT:
        player.cardDiscount += 1;
        game.log('Cards played by ${0} cost 1 MC less this generation', (b) => b.player(player));
        break;

      case ColonyBenefit.GAIN_PRODUCTION:
        if (resource === undefined) throw new Error('Resource cannot be undefined');
        player.addProduction(resource, quantity);
        LogHelper.logGainProduction(player, resource, quantity);
        break;

      case ColonyBenefit.GAIN_RESOURCES:
        if (resource === undefined) throw new Error('Resource cannot be undefined');
        player.setResource(resource, quantity);
        LogHelper.logGainStandardResource(player, resource, quantity);
        break;

      case ColonyBenefit.GAIN_SCIENCE_TAG:
        player.scienceTagCount += 1;
        player.playCard(game, new ScienceTagCard());
        game.log('${0} gained 1 Science tag', (b) => b.player(player));
        break;

      case ColonyBenefit.GAIN_INFLUENCE:
        if (game.turmoil !== undefined) {
          game.turmoil.addInfluenceBonus(player);
          game.log('${0} gained 1 influence', (b) => b.player(player));
        }
        break;

      case ColonyBenefit.PLACE_DELEGATES:
        if (game.turmoil !== undefined) {
          const qty = Math.min(quantity, game.turmoil.getDelegates(player.id));

          for (let i = 0; i < qty; i++) {
            game.defer(new SendDelegateToArea(player, game, 'Select where to send delegate', 1, undefined, undefined, false));
          }
        }
        break;

      case ColonyBenefit.GIVE_MC_PER_DELEGATE:
        if (game.turmoil !== undefined) {
          let partyDelegateCount = PLAYER_DELEGATES_COUNT - game.turmoil.getDelegates(player.id);
          if (game.turmoil.lobby.has(player.id)) partyDelegateCount--;
          if (game.turmoil.chairman === player.id) partyDelegateCount--;

          player.setResource(Resources.MEGACREDITS, partyDelegateCount);
          LogHelper.logGainStandardResource(player, Resources.MEGACREDITS, partyDelegateCount);
        }
        break;

      case ColonyBenefit.GAIN_TR:
        if (quantity > 0) {
          player.increaseTerraformRatingSteps(quantity, game);
          LogHelper.logTRIncrease(player, quantity);
        };
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
        player.setResource(resource, -quantity);
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
                game.defer(new DiscardCards(selectedPlayer, game, 1, this.name + ' colony effect. Select a card to discard'));
                return undefined;
              },
            );
          },
        );
        break;

      case ColonyBenefit.PLACE_OCEAN_TILE:
        action = new PlaceOceanTile(player, game, 'Select ocean space for ' + this.name + ' colony');
        break;

      case ColonyBenefit.STEAL_RESOURCES:
        if (resource === undefined) throw new Error('Resource cannot be undefined');
        action = new StealResources(player, game, resource, quantity);
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
}
