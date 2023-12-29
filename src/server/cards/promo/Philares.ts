import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {Space} from '../../boards/Space';
import {SelectAmount} from '../../inputs/SelectAmount';
import {AndOptions} from '../../inputs/AndOptions';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {BoardType} from '../../boards/BoardType';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class Philares extends CorporationCard {
  constructor() {
    super({
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

    const selectMegacredit = new SelectAmount('Megacredits', 'Select', 0, resourceCount)
      .andThen((amount) => {
        megacreditsAmount = amount;
        return undefined;
      });
    const selectSteel = new SelectAmount('Steel', 'Select', 0, resourceCount)
      .andThen((amount) => {
        steelAmount = amount;
        return undefined;
      });
    const selectTitanium = new SelectAmount('Titanium', 'Select', 0, resourceCount)
      .andThen((amount) => {
        titaniumAmount = amount;
        return undefined;
      });
    const selectPlants = new SelectAmount('Plants', 'Select', 0, resourceCount)
      .andThen((amount) => {
        plantsAmount = amount;
        return undefined;
      });
    const selectEnergy = new SelectAmount('Energy', 'Select', 0, resourceCount)
      .andThen((amount) => {
        energyAmount = amount;
        return undefined;
      });
    const selectHeat = new SelectAmount('Heat', 'Select', 0, resourceCount)
      .andThen((amount) => {
        heatAmount = amount;
        return undefined;
      });

    const selectResources = new AndOptions(selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat)
      .andThen(() => {
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
      } );
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
      cardOwner.defer(() => {
        cardOwner.game.log('${0} must select ${1} bonus resource(s) from ${2}\' ability', (b) => b.player(cardOwner).number(eligibleTiles.length).card(this));
        return this.selectResources(cardOwner, eligibleTiles.length);
      },
      cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : Priority.GAIN_RESOURCE_OR_PRODUCTION,
      );
    }
  }
}
