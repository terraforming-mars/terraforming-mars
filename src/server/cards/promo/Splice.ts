import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';
import {message} from '../../logs/MessageBuilder';
import {ICard} from '../ICard';
import {GainResources} from '../../deferredActions/GainResources';

export class Splice extends CorporationCard {
  constructor() {
    super({
      name: CardName.SPLICE,
      tags: [Tag.MICROBE],
      startingMegaCredits: 48, // 44 + 4 as card resolution when played

      firstAction: {
        text: 'Draw a card with a microbe tag',
        drawCard: {count: 1, tag: Tag.MICROBE},
      },

      metadata: {
        cardNumber: 'R28',
        description: 'You start with 44 M€. As your first action, reveal cards until you have revealed a microbe tag. Take it and discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(44).nbsp.cards(1, {secondaryTag: Tag.MICROBE});
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(undefined, (eb) => {
              eb.tag(Tag.MICROBE, {all}).startEffect;
              eb.megacredits(2, {all}).or().resource(CardResource.MICROBE, {all}).asterix();
            });
            ce.vSpace();
            ce.effect('when a microbe tag is played, incl. this, THAT PLAYER gains 2 M€, or adds a microbe to THAT card, and you gain 2 M€.', (eb) => {
              eb.tag(Tag.MICROBE, {all}).startEffect;
              eb.megacredits(2);
            });
          });
        }),
      },
    });
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    return this.onCardPlayed(player, card);
  }

  public onCardPlayed(player: IPlayer, card: ICard): undefined {
    const game = player.game;
    const microbeTags = player.tags.cardTagCount(card, Tag.MICROBE);
    if (microbeTags === 0) {
      return;
    }

    const gain = microbeTags * 2;

    const gainResource = new SelectOption('Add a microbe resource to this card', 'Add microbe').andThen(() => {
      player.addResourceTo(card);
      return undefined;
    });

    const gainMC = new SelectOption(
      message('Gain ${0} M€', (b) => b.number(gain)),
      'Gain M€')
      .andThen(() => {
        game.defer(new GainResources(player, Resource.MEGACREDITS, {count: gain, log: true, from: this}));
        return undefined;
      });

    // Splice owner gets 2M€ per microbe tag
    const cardPlayer = game.getCardPlayerOrThrow(this.name);
    game.defer(new GainResources(cardPlayer, Resource.MEGACREDITS, {count: gain, log: true, from: this}));

    if (card.resourceType === CardResource.MICROBE) {
      // Card player chooses between 2 M€ and a microbe on card, if possible
      player.defer(new OrOptions(gainResource, gainMC));
    } else {
      gainMC.cb(undefined);
    }
    return undefined;
  }
}
