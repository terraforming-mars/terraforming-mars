import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {ResourceType} from '../../ResourceType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TheArchaicFoundationInstitute implements CorporationCard {
  public name = CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE;
  public startingMegaCredits = 55;
  public tags = [Tags.MOON, Tags.MOON];
  public cardType = CardType.CORPORATION;
  public readonly resourceType = ResourceType.RESOURCE_CUBE;
  public resourceCount = 0;

  public play() {
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (player.corporationCard?.name !== this.name) {
      return undefined;
    }
    const moonTags = card.tags.filter((t) => t === Tags.MOON);
    const count = moonTags.length;
    if (count > 0) {
      player.addResourceTo(this, count);
      if (this.resourceCount >= 3) {
        player.removeResourceFrom(this, 3, player.game, player, true);
        player.increaseTerraformRating();
      }
    };
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'You start with 55 M€.',
    cardNumber: '',
    renderData: CardRenderer.builder((b) => {
      b.megacredits(55).br;
      b.effect('When you play a Moon tag, add a bronze resource cube on this card.', (eb) => {
        eb.moon().startEffect.resourceCube();
      }).br;
      b.effect('Automatically remove every 3 bronze resource cubes collected here and increase your TR 1 step.', (eb) => {
        eb.resourceCube(3).startEffect.tr(1);
      });
    }),
  };
}
