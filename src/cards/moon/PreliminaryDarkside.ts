import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../Resources';
import {Card} from '../Card';

export class PreliminaryDarkside extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRELIMINARY_DARKSIDE,
      cardType: CardType.EVENT,
      tags: [Tags.MOON],
      cost: 13,

      metadata: {
        description: 'Gain 3 titanium or 4 steel. Raise the Mining Rate 1 step.',
        cardNumber: 'M63',
        renderData: CardRenderer.builder((b) => {
          b.titanium(3).digit.or().steel(4).digit.br;
          b.moonMiningRate();
        }),
      },
    });
  };

  public play(player: Player) {
    MoonExpansion.raiseMiningRate(player);
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
