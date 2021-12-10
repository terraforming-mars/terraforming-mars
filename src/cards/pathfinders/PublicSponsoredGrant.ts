import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {all} from '../Options';

export class PublicSponsoredGrant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.PUBLIC_SPONSORED_GRANT,
      cost: 6,
      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),

      metadata: {
        cardNumber: 'PfTVD',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(2, {all}).br;
          b.cards(1, {secondaryTag: Tags.WILDCARD}).cards(1, {secondaryTag: Tags.WILDCARD}).asterix();
        }),
        description: 'Requires Scientists are ruling or that you have 2 delegates there. All players lose 2M€. Choose a tag (NOT CITY, ? OR PLANETARY TRACK) and draw 2 cards with that tag.',
      },
    });
  }

  private draw2Cards(player: Player, tag: Tags) {
    player.drawCard(2, {tag: tag});
  }

  public play(player: Player) {
    player.game.getPlayers().forEach((p) => p.deductResource(Resources.MEGACREDITS, Math.min(p.megaCredits, 2), {log: true}));

    // TODO(kberg): Add a test that fails when a new tag is added.
    const tags = [
      Tags.BUILDING,
      Tags.SPACE,
      Tags.SCIENCE,
      Tags.ENERGY,
      Tags.PLANT,
      Tags.MICROBE,
      Tags.ANIMAL,
      Tags.EVENT];

    const options = tags.map((tag) => {
      return new SelectOption(tag, undefined, () => {
        this.draw2Cards(player, tag);
        return undefined;
      });
    });

    return new OrOptions(...options);
  }
}
