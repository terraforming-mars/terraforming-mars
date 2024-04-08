import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {MiningCard} from '../base/MiningCard';

export class Deepmining extends MiningCard {
  protected readonly title = 'Select an identified space with a steel or titanium bonus';
  protected override readonly placeTile = false;

  constructor() {
    super(
      CardName.DEEPMINING,
      11,
      {
        cardNumber: 'U29',
        renderData: CardRenderer.builder((b) => {
          b.excavate(1).asterix().br;
          b.production((pb) => pb.steel(1).or().titanium(1)).asterix();
        }),
        description: 'Excavate an IDENTIFIED underground resource ANYWHERE ON MARS with a steel or titanium placement bonus. ' +
        'Increase that production 1 step.',
      });
  }

  public override getAvailableSpaces(player: IPlayer): ReadonlyArray<Space> {
    return UnderworldExpansion.identifiedSpaces(player.game)
      .filter((space) => space.excavator === undefined)
      .filter((space) => space.bonus.includes(SpaceBonus.STEEL) || space.bonus.includes(SpaceBonus.TITANIUM));
  }

  protected override spaceSelected(player: IPlayer, space: Space) {
    UnderworldExpansion.excavate(player, space);
    super.spaceSelected(player, space);
  }
}
