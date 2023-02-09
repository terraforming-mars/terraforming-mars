import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Resources} from '../../../common/Resources';
import {digit} from '../Options';
import {CardType} from '../../../common/cards/CardType';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectProjectCardToPlay} from '../../inputs/SelectProjectCardToPlay';

// TODO(kberg) like #3644, this card may have similar behavior.
export class ValuableGases extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.VALUABLE_GASES_PATHFINDERS,
      tags: [Tag.JOVIAN, Tag.VENUS],

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(10).br;
          b.text('play', Size.MEDIUM, true).cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).asterix().br;
          b.projectRequirements().br;
          b.floaters(5, {digit});
        }),
        description: 'Gain 10 M€. Play an active floater card from hand, ignoring global requirements, and add 5 floaters to it.',
      },
    });
  }
  public getRequirementBonus(player: Player): number {
    if (player.lastCardPlayed === this.name) {
      // Magic number high enough to always ignore requirements.
      return 50;
    }
    return 0;
  }
  public override bespokePlay(player: Player) {
    player.addResource(Resources.MEGACREDITS, 10);

    const playableCards = player.cardsInHand.filter((card) => {
      return card.resourceType === CardResource.FLOATER &&
        card.cardType === CardType.ACTIVE &&
        player.canPlay(card);
    });
    if (playableCards.length !== 0) {
      player.game.defer(new SimpleDeferredAction(player, () => {
        return new SelectProjectCardToPlay(
          player,
          playableCards,
          {
            cb: (card) => player.addResourceTo(card, 5),
          });
      }));
    }

    return undefined;
  }
}
