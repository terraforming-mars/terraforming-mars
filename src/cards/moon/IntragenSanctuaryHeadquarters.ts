import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {ICard} from '../ICard';
import {ResourceType} from '../../ResourceType';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class IntragenSanctuaryHeadquarters implements CorporationCard {
  public name = CardName.INTRAGEN_SANCTUARY_HEADQUARTERS;
  public startingMegaCredits = 38;
  public tags = [Tags.ANIMAL, Tags.MOON];
  public cardType = CardType.CORPORATION;

  public resourceType = ResourceType.ANIMAL;
  public resourceCount = 0;

  public initialActionText = 'Place a colony tile on the Moon.';

  public readonly metadata: CardMetadata = {
    description: 'You start with 38 M€. ' +
      'As your first action, place a colony tile on the Moon and raise the Colony Rate 1 step.',
    cardNumber: '',
    renderData: CardRenderer.builder((b) => {
      b.megacredits(38).br;
      b.effect('When any player plays an animal tag (including this), add 1 animal on this card.', (eb) => {
        eb.animals(1).played.startEffect.animals(1);
      }).br,
      b.text('1 VP for every 2 animals on this card.').br;
    }),
    victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
  }

  public initialAction(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }

  public play() {
    // Gains the initial resource from its own tag.
    this.resourceCount = 1;
    return undefined;
  };

  public onCorpCardPlayed(player: Player, card: CorporationCard) {
    return this.onCardPlayed(player, card as ICard as IProjectCard);
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    const count = card.tags.filter((tag) => tag === Tags.ANIMAL).length;
    player.addResourceTo(this, count);
    return undefined;
  }

  public getVictoryPoints() {
    return Math.floor(this.resourceCount / 2);
  }
}
