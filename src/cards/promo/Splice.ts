import {Tags} from '../Tags';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Splice extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.SPLICE,
      tags: [Tags.MICROBE],
      startingMegaCredits: 48, // 44 + 4 as card resolution when played
      initialActionText: 'Draw a card with a microbe tag',

      metadata: {
        cardNumber: 'R28',
        description: 'You start with 44 MC. As your first action, reveal cards until you have revealed a microbe tag. Take it and discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(44).nbsp.cards(1).secondaryTag(Tags.MICROBE);
          b.corpBox('effect', (ce) => {
            ce.vSpace(CardRenderItemSize.LARGE);
            ce.effect(undefined, (eb) => {
              eb.microbes(1).played.any.startEffect;
              eb.megacredits(2).any.or().microbes(1).any.asterix();
            });
            ce.vSpace();
            ce.effect('when a microbe tag is played, incl. this, THAT PLAYER gains 2 MC, or adds a microbe to THAT card, and you gain 2 MC.', (eb) => {
              eb.microbes(1).played.any.startEffect;
              eb.megacredits(2);
            });
          });
        }),
      },
    });
  }

  public initialAction(player: Player) {
    player.drawCard(1, {tag: Tags.MICROBE});
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    return this._onCardPlayed(player, card);
  }

  public onCorpCardPlayed(player: Player, card: CorporationCard) {
    return this._onCardPlayed(player, card);
  }

  private _onCardPlayed(player: Player, card: IProjectCard | CorporationCard): OrOptions | undefined {
    if (card.tags.includes(Tags.MICROBE) === false) {
      return undefined;
    }
    const gainPerMicrobe = 2;
    const microbeTagsCount = card.tags.filter((tag) => tag === Tags.MICROBE).length;
    const megacreditsGain = microbeTagsCount * gainPerMicrobe;

    const addResource = new SelectOption('Add a microbe resource to this card', 'Add microbe', () => {
      player.addResourceTo(card);
      return undefined;
    });

    const getMegacredits = new SelectOption(`Gain ${megacreditsGain} MC`, 'Gain MC', () => {
      player.megaCredits += megacreditsGain;
      return undefined;
    });

    // Splice owner get 2MC per microbe tag
    player.game.getCardPlayer(this.name).megaCredits += megacreditsGain;

    // Card player choose between 2 MC and a microbe on card, if possible
    if (card.resourceType !== undefined && card.resourceType === ResourceType.MICROBE) {
      return new OrOptions(addResource, getMegacredits);
    } else {
      player.megaCredits += megacreditsGain;
      return undefined;
    }
  }

  public play() {
    return undefined;
  }
}
