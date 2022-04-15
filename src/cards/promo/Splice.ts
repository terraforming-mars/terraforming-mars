import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {Resources} from '../../common/Resources';
import {all, played} from '../Options';

export class Splice extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.SPLICE,
      tags: [Tags.MICROBE],
      startingMegaCredits: 48, // 44 + 4 as card resolution when played
      initialActionText: 'Draw a card with a microbe tag',

      metadata: {
        cardNumber: 'R28',
        description: 'You start with 44 M€. As your first action, reveal cards until you have revealed a microbe tag. Take it and discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(44).nbsp.cards(1, {secondaryTag: Tags.MICROBE});
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

  public initialAction(player: Player) {
    player.drawCard(1, {tag: Tags.MICROBE});
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    return this._onCardPlayed(player, card);
  }

  public onCorpCardPlayed(player: Player, card: ICorporationCard) {
    return this._onCardPlayed(player, card);
  }

  private _onCardPlayed(player: Player, card: IProjectCard | ICorporationCard): OrOptions | undefined {
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

    const getMegacredits = new SelectOption(`Gain ${megacreditsGain} MC`, 'Gain M€', () => {
      player.addResource(Resources.MEGACREDITS, megacreditsGain, {log: true});
      return undefined;
    });

    // Splice owner get 2M€ per microbe tag
    player.game.getCardPlayer(this.name)?.addResource(Resources.MEGACREDITS, megacreditsGain, {log: true});

    // Card player choose between 2 M€ and a microbe on card, if possible
    if (card.resourceType !== undefined && card.resourceType === CardResource.MICROBE) {
      return new OrOptions(addResource, getMegacredits);
    } else {
      player.addResource(Resources.MEGACREDITS, megacreditsGain, {log: true});
      return undefined;
    }
  }

  public play() {
    return undefined;
  }
}
