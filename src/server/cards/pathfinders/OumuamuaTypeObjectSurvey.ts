import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardResource} from '../../../common/CardResource';
import {CardRequirements} from '../CardRequirements';
import {Tag} from '../../../common/cards/Tag';
import {digit, played} from '../Options';
import {Resources} from '../../../common/Resources';
import {Size} from '../../../common/cards/render/Size';

export class OumuamuaTypeObjectSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.OUMUAMUA_TYPE_OBJECT_SURVEY,
      cost: 20,
      tags: [Tag.SPACE, Tag.SCIENCE],
      requirements: CardRequirements.builder((b) => b.tag(Tag.SPACE, 1).tag(Tag.SCIENCE, 1)),

      metadata: {
        cardNumber: 'Pf53',
        renderData: CardRenderer.builder((b) => {
          b.data({amount: 2}).asterix().cards(2, {size: Size.SMALL}).asterix().br;
          b.science(1, {played}).microbes(1, {played}).colon().text('play ', Size.SMALL, false, true);
          b.space({played}).colon().production((pb) => pb.energy(3, {digit})).br;
          b.text(
            'Draw 2 cards face up. If the first has a science or microbe tag, play it outright ignoring requirements and cost. ' +
            'If not, and it has a space tag, gain 3 energy prod. If it has none of those, apply the check to the second card.',
            Size.SMALL, false, false);
        }),
        description: 'Requires 1 space tag and 1 science tag. Add 2 data to ANY card. ',
      },
    });
  }

  private keep(player: Player, card: IProjectCard) {
    player.cardsInHand.push(card);
    player.game.log('${0} kept ${1}', (b) => b.player(player).card(card));
  }

  private processCard(player: Player, card: IProjectCard): boolean {
    const tags = card.tags;
    if (player.tags.cardHasTag(card, Tag.SCIENCE) || player.tags.cardHasTag(card, Tag.MICROBE)) {
      player.playCard(card, undefined);
      return true;
    } else if (tags.includes(Tag.SPACE)) {
      player.production.add(Resources.ENERGY, 3, {log: true});
      this.keep(player, card);
      return true;
    } else {
      this.keep(player, card);
      return false;
    }
  }

  public override bespokePlay(player: Player) {
    const game = player.game;
    // TODO(kberg): Make sure this action occurs after the card play, in case the played card has data.
    game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 2}));
    const cards = [game.projectDeck.draw(player.game), game.projectDeck.draw(player.game)];

    player.game.log('${0} revealed ${1} and ${2}', (b) => b.player(player).card(cards[0]).card(cards[1]));
    if (this.processCard(player, cards[0])) {
      this.keep(player, cards[1]);
    } else {
      this.processCard(player, cards[1]);
    }

    return undefined;
  }
}
