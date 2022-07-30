import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../common/CardResource';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {all, played} from '../Options';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';

export class IntragenSanctuaryHeadquarters extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.INTRAGEN_SANCTUARY_HEADQUARTERS,
      tags: [Tags.ANIMAL, Tags.MOON],
      startingMegaCredits: 38,
      resourceType: CardResource.ANIMAL,
      initialActionText: 'Place a colony tile on the Moon.',
      victoryPoints: VictoryPoints.resource(1, 2),

      metadata: {
        description: 'You start with 38 M€. ' +
        'As your first action, place a colony tile on the Moon and raise the Colony Rate 1 step. 1 VP for every 2 animals on this card.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE}).br;
          b.effect('When any player plays an animal tag (including this), add 1 animal on this card.', (eb) => {
            eb.animals(1, {played, all}).startEffect.animals(1);
          }).br;
        }),
      },
    });
  }

  public override resourceCount = 0;

  public initialAction(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }

  public play() {
    // Gains the initial resource from its own tag.
    this.resourceCount = 1;
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: ICorporationCard) {
    this.onCardPlayed(player, card);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard | ICorporationCard) {
    const count = card.tags.filter((tag) => tag === Tags.ANIMAL).length;
    player.addResourceTo(this, count);
    return undefined;
  }
}
