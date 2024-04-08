import {Tag} from '../../../common/cards/Tag';
import {RoboticWorkforceBase} from './RoboticWorkforceBase';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {played} from '../Options';
import {IPlayer} from '../../IPlayer';

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
          b.production((pb) => pb.building(1, {played}));
        }),
        description: 'Duplicate only the production box of one of your building cards.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    return this.selectBuildingCard(player, this.getPlayableBuildingCards(player), 'Select builder card to copy');
  }
}
