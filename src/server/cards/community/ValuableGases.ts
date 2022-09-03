import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SelectProjectCardToPlay} from '../../inputs/SelectProjectCardToPlay';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class ValuableGases extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.VALUABLE_GASES,
      tags: [Tag.JOVIAN, Tag.VENUS],
      startingMegacredits: 6,

      metadata: {
        cardNumber: 'Y06',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(6).br.br;
          b.text('play', Size.MEDIUM, true).cards(1, {secondaryTag: Tag.VENUS}).colon();
          b.floaters(4, {digit});
        }),
        description: 'Gain 6 M€. Play a Venus card from your hand and add 4 floaters to it.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.megaCredits += 6;

    const playableCards = player.getPlayableCards().filter((card) => card.tags.includes(Tag.VENUS));

    if (playableCards.length > 0) {
      return new SelectProjectCardToPlay(
        player,
        playableCards,
        {
          cb: (card) => {
            if (card.resourceType === CardResource.FLOATER) {
              player.addResourceTo(card, 4);
            }
          },
        });
    }

    return undefined;
  }
}

