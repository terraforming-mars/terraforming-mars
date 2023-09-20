import {ICorporationCard} from '../corporation/ICorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {Space} from '../../boards/Space';
import {SelectAmount} from '../../inputs/SelectAmount';
import {AndOptions} from '../../inputs/AndOptions';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {SimpleDeferredAction, Priority} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {BoardType} from '../../boards/BoardType';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class Philares extends Card implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.PHILARES,
      tags: [Tag.BUILDING],
      startingMegaCredits: 47,

      firstAction: {
        text: 'Place a greenery tile and raise the oxygen 1 step',
        greenery: {},
      },

      metadata: {
        cardNumber: 'R25',
        description: 'You start with 47 M€. As your first action, place a greenery tile and raise the oxygen 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(47).nbsp.greenery();
          b.corpBox('effect', (ce) => {
            ce.effect('Each new adjacency between your tile and an opponent\'s tile gives you a standard resource of your choice [regardless of who just placed a tile].', (eb) => {
              eb.emptyTile('normal', {size: Size.SMALL, all}).nbsp;
              eb.emptyTile('normal', {size: Size.SMALL}).startEffect.wild(1);
            });
          });
        }),
      },
    });
  }

  private selectResources(philaresPlayer: IPlayer, resourceCount: number): AndOptions {
    let megacreditsAmount = 0;
    let steelAmount = 0;
    let titaniumAmount = 0;
    let plantsAmount = 0;
    let energyAmount = 0;
    let heatAmount = 0;

    const selectMegacredit = new SelectAmount('Megacredits', 'Select', (amount: number) => {
      megacreditsAmount = amount;
      return undefined;
    }, 0, resourceCount);
    const selectSteel = new SelectAmount('Steel', 'Select', (amount: number) => {
      steelAmount = amount;
      return undefined;
    }, 0, resourceCount);
    const selectTitanium = new SelectAmount('Titanium', 'Select', (amount: number) => {
      titaniumAmount = amount;
      return undefined;
    }, 0, resourceCount);
    const selectPlants = new SelectAmount('Plants', 'Select', (amount: number) => {
      plantsAmount = amount;
      return undefined;
    }, 0, resourceCount);
    const selectEnergy = new SelectAmount('Energy', 'Select', (amount: number) => {
      energyAmount = amount;
      return undefined;
    }, 0, resourceCount);
    const selectHeat = new SelectAmount('Heat', 'Select', (amount: number) => {
      heatAmount = amount;
      return undefined;
    }, 0, resourceCount);

    const selectResources = new AndOptions(
      () => {
        if (
          megacreditsAmount +
                    steelAmount +
                    titaniumAmount +
                    plantsAmount +
                    energyAmount +
                    heatAmount > resourceCount
        ) {
          throw new Error('Need to select ' + resourceCount + ' resource(s)');
        }
        philaresPlayer.stock.add(Resource.MEGACREDITS, megacreditsAmount, {log: true});
        philaresPlayer.stock.add(Resource.STEEL, steelAmount, {log: true});
        philaresPlayer.stock.add(Resource.TITANIUM, titaniumAmount, {log: true});
        philaresPlayer.stock.add(Resource.PLANTS, plantsAmount, {log: true});
        philaresPlayer.stock.add(Resource.ENERGY, energyAmount, {log: true});
        philaresPlayer.stock.add(Resource.HEAT, heatAmount, {log: true});
        return undefined;
      }, selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat);
    selectResources.title = 'Philares effect: select ' + resourceCount + ' resource(s)';

    return selectResources;
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    // Nerfing on The Moon.
    if (boardType !== BoardType.MARS) {
      return;
    }

    if (space.player === undefined) {
      return;
    }
    const adjacentSpaces = cardOwner.game.board.getAdjacentSpaces(space);
    const adjacentSpacesWithPlayerTiles = adjacentSpaces.filter((space) => space.tile !== undefined && space.player !== undefined);

    const eligibleTiles = (cardOwner.id === activePlayer.id) ?
      adjacentSpacesWithPlayerTiles.filter((space) => space.player?.id !== cardOwner.id) :
      adjacentSpacesWithPlayerTiles.filter((space) => space.player?.id === cardOwner.id);

    if (eligibleTiles.length > 0) {
      cardOwner.game.defer(
        new SimpleDeferredAction(cardOwner, () => {
          cardOwner.game.log('${0} must select ${1} bonus resource(s) from ${2}\' ability', (b) => b.player(cardOwner).number(eligibleTiles.length).card(this));
          return this.selectResources(cardOwner, eligibleTiles.length);
        }),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : Priority.GAIN_RESOURCE_OR_PRODUCTION,
      );
    }
  }
}
