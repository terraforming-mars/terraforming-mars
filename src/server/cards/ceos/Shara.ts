import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Tag} from '../../../common/cards/Tag';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {Resources} from '../../../common/Resources';
import {PathfindersData} from '../../pathfinders/PathfindersData';
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
          // TODO: Confirm Balance
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


  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    const data = player.game.pathfindersData;
    if (data === undefined) {
      return undefined;
    }
    player.game.defer(
      new DeclareCloneTag(
        player,
        this,
        (tag) => {
          // const value = PathfindersData.getValue(data, tag) - player.game.generation;
          const value = PathfindersData.getValue(data, tag);
          player.addResource(Resources.MEGACREDITS, value, {log: true});
        },
      ),
    );
    return undefined;
  }
}
