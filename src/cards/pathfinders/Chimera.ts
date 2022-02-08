import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

// Issue shown at https://media.discordapp.net/attachments/891004790589517875/905968892940267540/Chimera.PNG
export class Chimera extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.CHIMERA,
      tags: [Tags.WILDCARD, Tags.WILDCARD],
      startingMegaCredits: 36,

      metadata: {
        cardNumber: 'PfC5',
        description: 'You start with 36 M€, 1 steel, and 1 titanium.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(36).steel(1).titanium(1);
          b.corpBox('effect', (ce) => {
            ce.effect('When you perform an action, these wild tags count as any tags of your choice. ' +
              'For claiming Milestones and Awards, both symbols count as one. ' +
              '(Other wild tags still do not count toward Awards.)',
            (ce) => ce.wild(2, {played}).startEffect.wild(2, {played}).slash().wild(1, {played}).asterix());
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.STEEL, 1);
    player.addResource(Resources.TITANIUM, 1);
    return undefined;
  }
}
