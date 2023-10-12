import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {IPlayer} from '../../IPlayer';
import {BoardType} from '../../boards/BoardType';
import {Space} from '../../boards/Space';
import {Resource} from '../../../common/Resource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SimpleDeferredAction, Priority} from '../../deferredActions/DeferredAction';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Phase} from '../../../common/Phase';

const VALID_BONUSES: Array<SpaceBonus> = [
  SpaceBonus.TITANIUM,
  SpaceBonus.STEEL,
  SpaceBonus.PLANT,
  SpaceBonus.HEAT,
  SpaceBonus.MEGACREDITS,
  SpaceBonus.ANIMAL,
  SpaceBonus.MICROBE,
  SpaceBonus.ENERGY,
  SpaceBonus.DATA,
  SpaceBonus.SCIENCE,
];

export class GeologicalExpedition extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.GEOLOGICAL_EXPEDITION,
      cost: 18,
      tags: [Tag.MARS, Tag.SCIENCE],
      victoryPoints: 2,

      metadata: {
        cardNumber: 'Pf17',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you place a tile ON MARS gain 1 additional resource on the space. If the space has no bonus, gain 1 steel.', (eb) => {
            eb.emptyTile().startEffect.plus().wild(1).or().steel(1).asterix();
          }).br;
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    if (boardType !== BoardType.MARS || space.spaceType === SpaceType.COLONY) return;
    if (cardOwner !== activePlayer) return;
    if (cardOwner.game.phase === Phase.SOLAR) return;
    // Don't grant bonuses when overplacing.
    if (space.tile?.covers !== undefined) return;

    const bonuses = space.bonus;
    if (bonuses.length === 0) {
      activePlayer.stock.add(Resource.STEEL, 1, {log: true /* , from: this.name */});
      return;
    }
    const filtered = bonuses.filter((bonus) => VALID_BONUSES.includes(bonus));
    const unique = Array.from(new Set(filtered));
    const options = new OrOptions();
    options.title = 'Select an additional bonus from this space.';
    unique.forEach((bonus) => {
      options.options.push(new SelectOption(
        SpaceBonus.toString(bonus),
        'Select')
        .andThen(() => {
          activePlayer.game.grantSpaceBonus(activePlayer, bonus, 1);
          return undefined;
        }));
    });
    if (options.options.length === 1) {
      options.options[0].cb();
      return;
    }
    if (options.options.length === 0) {
      // should not happen.
      return;
    }
    const action = new SimpleDeferredAction(activePlayer, () => options);
    action.priority = Priority.GAIN_RESOURCE_OR_PRODUCTION;
    activePlayer.game.defer(action);
  }
}
