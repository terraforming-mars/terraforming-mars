import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Tag} from '../../../common/cards/Tag';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {Resource} from '../../../common/Resource';
import {clone} from '../Options';

export class Shara extends CeoCard {
  constructor() {
    super({
      name: CardName.SHARA,
      metadata: {
        cardNumber: 'LXXX',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY').br;
          b.planetaryTrack().text('2').nbsp.megacredits(0, {clone}).asterix();
          // TODO(d-little): Confirm Balance
          // There is an option here to balance Shara by subtracting money equal to the current generation.
          // However, this might put Shara on the too-weak side of the equation due to the limits on the Pathfinder influence track.
          // For now, do not subtract the MC, but if users complain that Shara is OP we should revisit this balance.
          // b.planetaryTrack().text('2').nbsp.megacredits(0, {clone}).asterix().minus().megacredits(0, {multiplier}).asterix();
        }),
        // description: 'Once per game, choose a planet tag. This card counts as having immediately played 2 of that tag. Then gain M€ equal to that tags planety influence track minus the current generation.',
        description: 'Once per game, choose a planet tag. This card counts as having immediately played 2 of that tag. Then gain M€ equal to that tags planety influence track.',
      },
    });
  }

  public cloneTag: Tag = Tag.CLONE;

  public override get tags(): Array<Tag> {
    return [this.cloneTag, this.cloneTag];
  }


  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const data = player.game.pathfindersData;
    if (data === undefined) {
      return undefined;
    }
    player.game.defer(new DeclareCloneTag(player, this))
      .andThen((tag) => {
        // const value = data[tag] - player.game.generation;
        const value = data[tag];
        player.stock.add(Resource.MEGACREDITS, value, {log: true});
      });
    return undefined;
  }
}
