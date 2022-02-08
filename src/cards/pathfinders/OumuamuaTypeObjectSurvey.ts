import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {ResourceType} from '../../common/ResourceType';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../../common/cards/Tags';
import {digit, played} from '../Options';
import {Resources} from '../../common/Resources';
import {Size} from '../render/Size';

export class OumuamuaTypeObjectSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.OUMUAMUA_TYPE_OBJECT_SURVEY,
      cost: 20,
      tags: [Tags.SPACE, Tags.SCIENCE],
      requirements: CardRequirements.builder((b) => b.tag(Tags.SPACE, 1).tag(Tags.SCIENCE, 1)),

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

  private discard(player: Player, card: IProjectCard) {
    player.game.dealer.discard(card);
    player.game.log('${0} discarded ${1}', (b) => b.player(player).card(card));
  }

  private processCard(player: Player, card: IProjectCard): boolean {
    const tags = card.tags;
    if (tags.includes(Tags.SCIENCE) || tags.includes(Tags.MICROBE)) {
      player.playCard(card, undefined);
      return true;
    } else if (tags.includes(Tags.SPACE)) {
      player.addProduction(Resources.ENERGY, 3, {log: true});
      this.discard(player, card);
      return true;
    } else {
      this.discard(player, card);
      return false;
    }
  }

  public play(player: Player) {
    const game = player.game;
    game.defer(new AddResourcesToCard(player, ResourceType.DATA, {count: 2}));
    const cards = [game.dealer.dealCard(player.game), game.dealer.dealCard(player.game)];

    player.game.log('${0} revealed ${1} and ${2}', (b) => b.player(player).card(cards[0]).card(cards[1]));
    if (this.processCard(player, cards[0])) {
      this.discard(player, cards[1]);
    } else {
      this.processCard(player, cards[1]);
    }

    return undefined;
  }
}
