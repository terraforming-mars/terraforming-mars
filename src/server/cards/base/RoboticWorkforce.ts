import {Tag} from '../../../common/cards/Tag';
import {RoboticWorkforceBase} from './RoboticWorkforceBase';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '../../IPlayer';
import {Priority} from '../../deferredActions/Priority';

export class RoboticWorkforce extends RoboticWorkforceBase {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ROBOTIC_WORKFORCE,
      tags: [Tag.SCIENCE],
      cost: 9,
      metadata: {
        cardNumber: '086',
        hasExternalHelp: true,
        renderData: CardRenderer.builder((b) => {
          b.text('Copy A', Size.SMALL, true).nbsp;
          b.production((pb) => pb.tag(Tag.BUILDING));
        }),
        description: 'Duplicate only the production box of one of your building cards.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.defer(
      this.selectBuildingCard(
        player,
        this.getPlayableBuildingCards(player),
        'Select builder card to copy',
      ),
      Priority.ROBOTIC_WORKFORCE,
    );
    return undefined;
  }
}
