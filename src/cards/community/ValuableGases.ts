import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../common/cards/CardName';
import {CardResource} from '../../common/CardResource';
import {SelectHowToPayForProjectCard} from '../../inputs/SelectHowToPayForProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {digit} from '../Options';

export class ValuableGases extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.VALUABLE_GASES,
      tags: [Tags.JOVIAN, Tags.VENUS],
      startingMegacredits: 6,

      metadata: {
        cardNumber: 'Y06',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(6).br.br;
          b.text('play', Size.MEDIUM, true).cards(1, {secondaryTag: Tags.VENUS}).colon();
          b.floaters(4, {digit});
        }),
        description: 'Gain 6 M€. Play a Venus card from your hand and add 4 floaters to it.',
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
          if (selectedCard.resourceType === CardResource.FLOATER) {
            player.addResourceTo(selectedCard, 4);
          }
          return result;
        },
      );
    }

    return undefined;
  }
}

