import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectHowToPayForProjectCard} from '../../inputs/SelectHowToPayForProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ValuableGases extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.VALUABLE_GASES,
      tags: [Tags.JOVIAN, Tags.VENUS],

      metadata: {
        cardNumber: 'Y06',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(6).br.br;
          b.text('play', CardRenderItemSize.MEDIUM, true).cards(1).secondaryTag(Tags.VENUS).colon();
          b.floaters(4).digit;
        }),
        description: 'Gain 6 MC. Play a Venus card from your hand and add 4 floaters to it.',
      },
    });
  }

  public play(player: Player) {
    player.megaCredits += 6;

    const playableCards = player.getPlayableCards().filter((card) => card.tags.includes(Tags.VENUS));

    if (playableCards.length > 0) {
      return new SelectHowToPayForProjectCard(
        player,
        playableCards,
        (selectedCard, howToPay) => {
          const result = player.checkHowToPayAndPlayCard(selectedCard, howToPay);
          if (selectedCard.resourceType === ResourceType.FLOATER) {
            player.addResourceTo(selectedCard, 4);
          }
          return result;
        },
      );
    }

    return undefined;
  }
}

