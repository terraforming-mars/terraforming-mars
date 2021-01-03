import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard, ICard} from '../ICard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {Game} from '../../Game';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class CometAiming implements IActionCard, IProjectCard, IResourceCard {
    public name = CardName.COMET_AIMING;
    public cost = 17;
    public tags = [Tags.SPACE];
    public resourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }

    public canAct(player: Player, game: Game): boolean {
      const hasTitanium = player.titanium > 0;
      const canPlaceOcean = this.resourceCount > 0 && game.board.getOceansOnBoard() < MAX_OCEAN_TILES;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return hasTitanium || (player.canAfford(REDS_RULING_POLICY_COST) && canPlaceOcean);
      }

      return hasTitanium || canPlaceOcean;
    }

    public action(player: Player, game: Game) {
      const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);

      const addAsteroidToSelf = function() {
        player.titanium--;
        player.addResourceTo(asteroidCards[0]);
        LogHelper.logAddResource(game, player, asteroidCards[0]);
        return undefined;
      };

      const addAsteroidToCard = new SelectCard(
        'Select card to add 1 asteroid',
        'Add asteroid',
        asteroidCards,
        (foundCards: Array<ICard>) => {
          player.titanium--;
          player.addResourceTo(foundCards[0]);
          LogHelper.logAddResource(game, player, foundCards[0]);
          return undefined;
        },
      );

      const spendAsteroidResource = () => {
        this.resourceCount--;
        LogHelper.logRemoveResource(game, player, this, 1, 'place an ocean');
        game.defer(new PlaceOceanTile(player, game));
        return undefined;
      };

      if (this.resourceCount === 0) {
        if (asteroidCards.length === 1) return addAsteroidToSelf();
        return addAsteroidToCard;
      }

      if (player.titanium === 0) return spendAsteroidResource();

      const availableActions: Array<SelectOption | SelectCard<ICard>> = [];
      const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);
      const canPlaceOcean = game.board.getOceansOnBoard() < MAX_OCEAN_TILES;

      if (canPlaceOcean && !redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
        availableActions.push(new SelectOption('Remove an asteroid resource to place an ocean', 'Remove asteroid', spendAsteroidResource));
      }

      if (asteroidCards.length === 1) {
        availableActions.push(new SelectOption('Spend 1 titanium to gain 1 asteroid resource', 'Spend titanium', addAsteroidToSelf));
      } else {
        availableActions.push(addAsteroidToCard);
      }

      if (availableActions.length === 1) {
        const action = availableActions[0];

        if (action instanceof SelectOption) return (availableActions[0] as SelectOption).cb();
        return availableActions[0]; // SelectCard
      }

      return new OrOptions(...availableActions);
    }
    public metadata: CardMetadata = {
      cardNumber: 'X15',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.titanium(1).startAction.asteroids(1).asterix();
          eb.description('Action: Spend 1 titanium to add 1 asteroid resource to ANY CARD.');
        }).br;
        b.or().br;
        b.effectBox((eb) => {
          eb.asteroids(1).startAction.oceans(1);
          eb.description('Action: Remove 1 asteroid here to place an ocean.');
        });
      }),
    }
}
