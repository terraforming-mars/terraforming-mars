import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class DarksideMeteorBombardment extends Card {
  constructor() {
    super({
      name: CardName.DARKSIDE_METEOR_BOMBARDMENT,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE, Tags.EVENT],
      cost: 20,

      metadata: {
        description: 'Gain 2 steel and 2 titanium. Raise Mining Rate 2 steps.',
        cardNumber: 'M33',
        renderData: CardRenderer.builder((b) => {
          b.steel(2).titanium(2);
          b.br;
          b.moonMiningRate(2);
        }),
      },
    });
  };
  public canPlay(): boolean {
    return true;
  }

  public play(player: Player) {
    player.steel += 2;
    player.titanium += 2;
    MoonExpansion.raiseMiningRate(player, 2);
    return undefined;
  }
}
