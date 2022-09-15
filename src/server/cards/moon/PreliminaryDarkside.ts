import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../../common/Resources';
import {Card} from '../Card';
import {digit} from '../Options';

export class PreliminaryDarkside extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRELIMINARY_DARKSIDE,
      cardType: CardType.EVENT,
      tags: [Tag.MOON],
      cost: 13,

      behavior: {
        moon: {miningRate: 1},
      },

      metadata: {
        description: 'Gain 3 titanium or 4 steel. Raise the Mining Rate 1 step.',
        cardNumber: 'M63',
        renderData: CardRenderer.builder((b) => {
          b.titanium(3, {digit}).or().steel(4, {digit}).br;
          b.moonMiningRate();
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    return new OrOptions(
      new SelectOption('Gain 3 titanium.', 'Gain titanium', () => {
        player.addResource(Resources.TITANIUM, 3, {log: true});
        return undefined;
      }),
      new SelectOption('Gain 4 steel.', 'Gain steel', () => {
        player.addResource(Resources.STEEL, 4, {log: true});
        return undefined;
      }));
  }
}
