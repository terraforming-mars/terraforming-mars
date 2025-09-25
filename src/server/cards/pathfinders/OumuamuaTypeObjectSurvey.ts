import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class OumuamuaTypeObjectSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OUMUAMUA_TYPE_OBJECT_SURVEY,
      cost: 20,
      tags: [Tag.SPACE, Tag.SCIENCE],
      requirements: [{tag: Tag.SPACE}, {tag: Tag.SCIENCE}],

      metadata: {
        cardNumber: 'Pf53',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.DATA, 2).asterix().cards(2, {size: Size.SMALL}).asterix().br;
          b.tag(Tag.SCIENCE).tag(Tag.MICROBE).colon().text('play ', Size.SMALL, false, true);
          b.tag(Tag.SPACE).colon().production((pb) => pb.energy(3, {digit})).br;
          b.text(
            'Draw 2 cards face up. If the first has a science or microbe tag (and is playable), play it outright, ignoring requirements and cost. ' +
            'If not, and it has a space tag, gain 3 energy prod. Otherwise, apply the check to the second card.',
            Size.SMALL, false, false);
        }),
        description: 'Requires 1 space tag and 1 science tag. Add 2 data to ANY card.',
      },
    });
  }

  private keep(player: IPlayer, card: IProjectCard) {
    player.cardsInHand.push(card);
    player.game.log('${0} kept ${1}', (b) => b.player(player).card(card));
  }

  private processCard(player: IPlayer, card: IProjectCard): boolean {
    const tags = card.tags;
    if (player.tags.cardHasTag(card, Tag.SCIENCE) || player.tags.cardHasTag(card, Tag.MICROBE)) {
      if (!card.canPlayPostRequirements(player)) {
        player.game.log('${0} cannot play ${1}', (b) => b.player(player).card(card));
      } else {
        player.playCard(card, undefined);
        return true;
      }
    }
    if (tags.includes(Tag.SPACE)) {
      player.production.add(Resource.ENERGY, 3, {log: true});
      this.keep(player, card);
      return true;
    } else {
      this.keep(player, card);
      return false;
    }
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.game.projectDeck.canDraw(2);
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    // TODO(kberg): Make sure this action occurs after the card play, in case the played card has data.
    game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 2}));
    const cards = game.projectDeck.drawNOrThrow(game, 2);

    player.game.log('${0} revealed ${1} and ${2}', (b) => b.player(player).card(cards[0], {tags: true}).card(cards[1], {tags: true}));
    if (this.processCard(player, cards[0])) {
      this.keep(player, cards[1]);
    } else {
      this.processCard(player, cards[1]);
    }

    return undefined;
  }
}
