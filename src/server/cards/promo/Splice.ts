import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';
import {all, played} from '../Options';
import {message} from '../../logs/MessageBuilder';

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
              eb.microbes(1, {played, all}).startEffect;
              eb.megacredits(2, {all}).or().microbes(1, {all}).asterix();
            });
            ce.vSpace();
            ce.effect('when a microbe tag is played, incl. this, THAT PLAYER gains 2 M€, or adds a microbe to THAT card, and you gain 2 M€.', (eb) => {
              eb.microbes(1, {played, all}).startEffect;
              eb.megacredits(2);
            });
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    return this._onCardPlayed(player, card);
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    return this._onCardPlayed(player, card);
  }

  private _onCardPlayed(player: IPlayer, card: IProjectCard | ICorporationCard): OrOptions | undefined {
    if (card.tags.includes(Tag.MICROBE) === false) {
      return undefined;
    }
    const gainPerMicrobe = 2;
    const microbeTagsCount = player.tags.cardTagCount(card, Tag.MICROBE);
    const megacreditsGain = microbeTagsCount * gainPerMicrobe;

    const addResource = new SelectOption('Add a microbe resource to this card', 'Add microbe').andThen(() => {
      player.addResourceTo(card);
      return undefined;
    });

    const getMegacredits = new SelectOption(
      message('Gain ${0} M€', (b)=>b.number(megacreditsGain)),
      'Gain M€')
      .andThen(() => {
        player.stock.add(Resource.MEGACREDITS, megacreditsGain, {log: true});
        return undefined;
      });

    // Splice owner get 2M€ per microbe tag
    player.game.getCardPlayerOrThrow(this.name).stock.add(Resource.MEGACREDITS, megacreditsGain, {log: true});

    // Card player choose between 2 M€ and a microbe on card, if possible
    if (card.resourceType === CardResource.MICROBE) {
      return new OrOptions(addResource, getMegacredits);
    } else {
      player.stock.add(Resource.MEGACREDITS, megacreditsGain, {log: true});
      return undefined;
    }
  }
}
