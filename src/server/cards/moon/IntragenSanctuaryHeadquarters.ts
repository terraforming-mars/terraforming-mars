import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {PlaceMoonHabitatTile} from '../../moon/PlaceMoonHabitatTile';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {all, played} from '../Options';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class IntragenSanctuaryHeadquarters extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.INTRAGEN_SANCTUARY_HEADQUARTERS,
      tags: [Tag.ANIMAL, Tag.MOON],
      startingMegaCredits: 38,
      resourceType: CardResource.ANIMAL,
      initialActionText: 'Place a habitat tile on The Moon.',
      victoryPoints: VictoryPoints.resource(1, 2),

      behavior: {
        // Gains the initial resource from its own tag.
        addResources: 1,
      },

      metadata: {
        description: 'You start with 38 M€. ' +
        'As your first action, place a habitat tile on The Moon and raise the Habitat Rate 1 step. 1 VP for every 2 animals on this card.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE}).br;
          b.effect('When any player plays an animal tag (including this), add 1 animal on this card.', (eb) => {
            eb.animals(1, {played, all}).startEffect.animals(1);
          }).br;
        }),
      },
    });
  }

  public initialAction(player: Player) {
    player.game.defer(new PlaceMoonHabitatTile(player));
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: ICorporationCard) {
    this.onCardPlayed(player, card);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard | ICorporationCard) {
    const count = card.tags.filter((tag) => tag === Tag.ANIMAL).length;
    player.addResourceTo(this, count);
    return undefined;
  }
}
