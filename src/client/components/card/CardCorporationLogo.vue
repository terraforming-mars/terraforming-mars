<template>
  <div class="card-corporation-logo">
    <template v-if="logos[title] === 'bespoke'">
      <template v-if="title === CardName.AERON_GENOMICS">
        <div class="card-aeron-genomics-logo">
          <div class="aeron-genomics-svg-logo"><img src="assets/underworld/corp-logo-aeron-genomics.svg"></div>
          <div class="aeron-genomics-title">AERON GENOMICS</div>
        </div>
      </template>
      <template v-else-if="title === CardName.AGRICOLA_INC">
        <span class="card-agricola-logo">Agricola Inc</span>
      </template>
      <template v-else-if="title === CardName.ANUBIS_SECURITIES">
        <div class="card-anubis-securities-logo">
          <div class="anubis-securities-svg-logo"><img src="assets/underworld/corp-logo-anubis-securities.svg"></div>
          <div class="anubis-securities-title">
            <span class="anubis-row-1">ANUBIS</span>
            <br>
            <span class="anubis-row-2">SECURITIES</span>
          </div>
        </div>
      </template>
      <template v-else-if="title === CardName.ARBORIST_COLLECTIVE">
        <div class="card-arborist-collective-logo">
          <div class="arborist-collective-svg-logo"><img src="assets/underworld/corp-logo-arborist-collective.svg"></div>
          <div class="arborist-collective-title">
            <div class="arborist-collective-row-1">ARBORIST</div>
            <hr>
            <div class="arborist-collective-row-2">COLLECTIVE</div>
          </div>
        </div>

      </template>
      <template v-else-if="title === CardName.ARCADIAN_COMMUNITIES">
        <span class="card-arcadian-logo"><span>Arcadian</span><br><span>Communities</span></span>
      </template>
      <template v-else-if="title === CardName.ASTRODRILL">
        <span class="card-astrodril-logo">AstroDrill</span>
      </template>
      <template v-else-if="title === CardName.ATHENA">
        <div class="card-athena-logo">Athena</div>
      </template>
      <template v-else-if="title === CardName.CELESTIC">
        <div class="card-celestic-logo">
          <span
            style="background: linear-gradient(to right, rgb(251,192,137),rgb(251,192,137),rgb(23,185,236));padding-left: 5px;">CEL</span>
          <span style="background:linear-gradient(to right,rgb(23,185,236),rgb(251,192,137))">ES</span>
          <span style="background:rgb(251,192,137);padding-right:5px;">TIC</span>
        </div>
      </template>
      <template v-else-if="title === CardName.CHEUNG_SHING_MARS">
        <div class="card-cheung-shing-logo">
          <span
            style="color:red;border:4px solid red;border-radius:50%;padding:3px 5px 3px 5px;font-size:30px;line-height:14px;box-shadow: 3px 3px 3px grey, inset 0 0 3px 3px grey;text-shadow: 3px 3px 3px grey;">㨐</span>
        </div>
        <div
          style="display: inline-block; width:140px; font-size:19px; line-height: 22px; vertical-align: middle; margin-bottom: 15px;font-weight:normal;">
          &nbsp;Cheung Shing <br>
          <div style="margin-left:10px"> ■■MARS■■ </div>
        </div>
      </template>
      <template v-else-if="title === CardName.CRESCENT_RESEARCH_ASSOCIATION">
        <div class="card-crescent-research-association-logo">
          <div class="crescent-research-association-image"></div>
          <div class="crescent-research-association-title">
            <div class="crescent-research-association-row1">CRESCENT RESEARCH</div>
            <hr>
            <div class="crescent-research-association-row2">ASSOCIATION</div>
          </div>
        </div>
      </template>
      <template v-else-if="title === CardName.CURIOSITY_II">
        <div class="card-curiosity-ii-logo">Curiosity II</div>
      </template>
      <template v-else-if="title === CardName.DEMETRON_LABS">
        <div class="card-demetron-labs-logo">
          <div class="row1">DEMETRON</div>
          <div class="row2">LABS</div>
        </div>
      </template>
      <template v-else-if="title === CardName.ECOTEC">
        <div class="card-ecotec-logo"></div>
      </template>
      <template v-else-if="title === CardName.ERIS">
        <div class="card-eris-logo">Eris</div>
      </template>
      <template v-else-if="title === CardName.GAGARIN_MOBILE_BASE">
        <div class="card-gagarin-mobile-base-logo">
          <div class="gagarin-mobile-base-svg-logo"><img src="assets/pathfinders/corp-logo-gagarin-mobile-base.svg"></div>
          <div class="gagarin-mobile-base-title">
            Gagarin Mobile Base
          </div>
        </div>
      </template>
      <template v-else-if="title === CardName.HADESPHERE">
        <div class="card-hadesphere-logo">
          <div class="row1">HADESPHERE</div>
          <div class="row2">INDUSTRIES</div>
        </div>
      </template>
      <template v-else-if="title === CardName.HECATE_SPEDITIONS">
        <div class="card-hecate-speditions-logo">
          <div class="row1">HECATE</div>
          <div class="hecate-speditions-svg-logo"><img src="assets/underworld/corp-logo-hecate-speditions.svg"></div>
          <div class="row2">SPEDITIONS</div>
        </div>
      </template>
      <template v-else-if="title === CardName.HENKEI_GENETICS">
        <div class="card-henkei-genetics-logo">
          <span class="jp"></span>
          <span class="eng">Henkei Genetics</span>
        </div>
      </template>
      <template v-else-if="title === CardName.INCITE">
        <span class="card-incite-logo">Incite</span>
      </template>
      <template v-else-if="title === CardName.INTERPLANETARY_CINEMATICS">
        <div style="color: #020202;font-size:17px;margin-top:10px;margin-left:-87px;">INTERPLANETARY</div>
        <div
          style="height:5px;margin-top:-2px;width:143px;background:linear-gradient(to right,yellow,black,yellow,black,yellow);border:5px solid #cc3333;box-shadow:3px 3px 6px grey;">
        </div>
        <div
          style="color: #020202;font-size:24px;margin-left:-89px;margin-top:-5px; display:inline-block; -webkit-transform:scale(0.5,1); -moz-transform:scale(0.5,1); -ms-transform:scale(0.5,1); -o-transform:scale(0.5,1); transform:scale(1,0.5); margin-bottom:15px;">
          CINEMATICS</div>
      </template>
      <template v-else-if="title === CardName.INVENTRIX">
        <span class="card-inventrix-logo">
          <span
            style="color: #020202;background-color:#6bb5c7;padding-left:4px;padding-right:4px;font-size:26px;box-shadow: 6px 6px 10px grey;">X</span>
          INVENTRIX</span>
      </template>
      <template v-else-if="title === CardName.KEPLERTEC">
        <div class="card-keplertec-logo">
          <div class="keplertec-svg-logo"><img src="assets/underworld/corp-logo-keplertec.svg"></div>
          <div class="keplertec-title">KEPLERTEC</div>
        </div>
      </template>
      <template v-else-if="title === CardName.KINGDOM_OF_TAURARO">
        <div class="card-kingdom-of-tauraro-logo">
          <div class="kingdom-of-tauraro-svg-logo"><img src="assets/underworld/corp-logo-kingdom-of-tauraro.svg"></div>
          <div class="kingdom-of-tauraro-title">Kingdom of<br>Tauraro</div>
        </div>
      </template>
      <template v-else-if="title === CardName.KUIPER_COOPERATIVE">
        <div class="card-kuiper-logo">Kuiper<br >Cooperative</div>
      </template>
      <template v-else-if="title === CardName.LAKEFRONT_RESORTS">
        <div class="card-lakefront-logo">LAKEFRONT <br> &nbsp;&nbsp;RESORTS</div>
      </template>
      <template v-else-if="title === CardName.MANUTECH">
        <span class="card-manutech-logo"><span
            style="color:white;background:#e63900;text-shadow:none;padding-left:2px;">MA</span>NUTECH</span>
      </template>
      <template v-else-if="title === CardName.MARS_MATHS">
        <div class="card-mars-maths-logo" style="font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif">
          <span style="color: rgb(0, 0, 0);">MARS</span>
          <span style="color: rgb(208, 96, 3);box-shadow: -6px -6px #d58c56;">MATHS</span>
        </div>
      </template>
      <template v-else-if="title === CardName.MINING_GUILD">
        <span class="card-mining-guild-logo">MINING<br>GUILD</span>
      </template>
      <template v-else-if="title === CardName.MONS_INSURANCE">
        <div class="card-mons-logo">
          <div class="mons0">▲</div>
          <div class="mons1">mons</div>
          <div class="mons2">INSURANCE</div>
        </div>
      </template>
      <template v-else-if="title === CardName.NIRGAL_ENTERPRISES">
        <div class="card-nirgal-enterprises-logo">
          <div>NIRGAL</div>
          <div>ENTERPRISES</div>
        </div>
      </template>
      <template v-else-if="title === CardName.PALLADIN_SHIPPING">
        <div class="card-palladin-shipping-logo"></div>
      </template>
      <template v-else-if="title === CardName.PHARMACY_UNION">
        <div class="card-pharmacy-union-logo">Pharmacy<br >Union</div>
      </template>
      <template v-else-if="title === CardName.PHILARES">
        <div class="card-philares-logo">PHIL<span style="color:#ff5858">A</span>RES</div>
      </template>
      <template v-else-if="title === CardName.PLAYWRIGHTS">
        <div class="card-playwrights-logo">Playwrights</div>
      </template>
      <template v-else-if="title === CardName.POLDERTECH_DUTCH">
        <div class="card-poldertech-1-logo">PolderTECH</div>
        <div class="card-poldertech-2-logo">Dutch</div>
      </template>
      <template v-else-if="title === CardName.PROJECT_WORKSHOP">
        <div class="card-project-workshop-logo">PROJECT<br >WORKSHOP</div>
      </template>
      <template v-else-if="title === CardName.RECYCLON">
        <div class="card-recyclon-logo">Recyclon</div>
      </template>
      <template v-else-if="title === CardName.ROBINSON_INDUSTRIES">
        <div class="card-robinson-logo">
          <div style="letter-spacing:4px;border-bottom:3px solid #ccc;margin-top:5px;">ROBINSON</div>
          <div style="border-bottom:3px solid #ccc;">•—•—•—•—•—•—•&nbsp;</div>
          <div style="letter-spacing:2px;">INDUSTRIES</div>
        </div>
      </template>
      <template v-else-if="title === CardName.SAGITTA_FRONTIER_SERVICES">
        <div class="card-sagitta-logo">Sagitta</div>
      </template>
      <template v-if="title === CardName.SATURN_SYSTEMS">
        <div class="card-saturn-logo">
          SATURN <span style="font-size:20px;display:inline-block;">&#x25CF;</span> SYSTEMS
        </div>
      </template>
      <template v-else-if="title === CardName.SEPTUM_TRIBUS">
        <span class="card-septem-tribus-logo">Septem Tribus</span>
      </template>
      <template v-else-if="title === CardName.SOLBANK">
        <div class="card-solbank-logo">
          <span class="solbank-first">SOL</span>
          <span class="solbank-second">Bank</span>
        </div>
      </template>
      <template v-else-if="title === CardName.SPLICE">
        <div class="card-splice-logo">
          <div>SPLI<span style="color:red">C</span>E</div>
          <div style="height:3px;background:red;margin-top:-3px;"></div>
          <div style="font-size:10px;line-height:18px;">TACTICAL GENOMICS</div>
        </div>
      </template>
      <template v-else-if="title === CardName.STORMCRAFT_INCORPORATED">
        <div class="card-stormcraft-logo">
          <div class="stormcraft1">STORM</div>
          <div class="stormcraft2">CRAFT</div>
          <div class="stormcraft3">INCOR</div>
          <div class="stormcraft4">PORATED</div>
        </div>
      </template>
      <template v-else-if="title === CardName.TERRALABS_RESEARCH">
        <div
          style="font-size: 13px;left:32px;top:10px;font-family:Prototype, sans-serif;color:#222;transform:scale(2,1);position:absolute;">
          TERRALABS</div>
        <div
          style="position:absolute;top:28px;left:46px;font-size:8px;letter-spacing:2px;font-family:Prototype, sans-serif;transform:scale(2,1)">
          RESEARCH</div>
      </template>
      <template v-else-if="title === CardName.THARSIS_REPUBLIC">
        <div class="card-tharsis-logo">
          <div class="card-tharsis-logo-image"></div>
          <div class="card-tharsis-logo-text">Tharsis Republic</div>
        </div>
      </template>
      <template v-else-if="title === CardName.TYCHO_MAGNETICS">
        <div class="card-tycho-magnetics-logo">
          <div>TYCHO</div>
          <div>MAGNETICS</div>
        </div>
      </template>
      <template v-else-if="title === CardName.UNITED_NATIONS_MARS_INITIATIVE">
        <span class="card-unmi-logo">UNITED NATIONS<br >MARS INITIATIVE</span>
      </template>
      <template v-else-if="title === CardName.UNITED_NATIONS_MISSION_ONE">
        <span class="card-unmo-logo">UNITED NATIONS<br >MISSION ONE</span>
      </template>
      <template v-else-if="title === CardName.UTOPIA_INVEST">
        <div class="card-utopia-logo">
          <div class="utopia-corp-name-1">UTOPIA</div>
          <div class="utopia-corp-name-2">INVEST</div>
        </div>
      </template>
      <template v-else-if="title === CardName.VALLEY_TRUST">
        <div class="card-valley-trust-logo">
          <div
            style="display:inline-block;margin-left:25px;padding-top: 2px;margin-bottom:0px;font-size:26px;text-shadow: 2px 2px #ccc;text-align:center">
            VALLEY<br > TRUST</div>
        </div>
      </template>
      <template v-else-if="title === CardName.VITOR">
        <div class="card-vitor-logo">
          <span style="color:white;background:orangered;padding-left:3px;">VIT</span>
          <span style="background:linear-gradient(to right, orangered,white);">O</span>
          <span style="background:white;padding-right:3px;">R</span>
        </div>
      </template>
      <template v-else-if="title === CardName.VOLTAGON">
        <div class="card-voltagon-logo">
          <div class="voltagon-svg-logo"><img src="assets/underworld/corp-logo-voltagon.svg"></div>
          <div class="voltagon-title">VOLTAGON</div>
        </div>
      </template>
    </template>
    <template v-else>
      <div :class="logoClass">{{capsTitle}}</div>
    </template>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {CardName} from '@/common/cards/CardName';


const logos: Partial<Record<CardName, 'image' | 'css' | 'bespoke'>> = {
  [CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS]: 'image',
  [CardName.AEROTECH]: 'image',
  [CardName.AERON_GENOMICS]: 'bespoke',
  [CardName.AGRICOLA_INC]: 'bespoke',
  [CardName.AMBIENT]: 'image',
  [CardName.ANUBIS_SECURITIES]: 'bespoke',
  [CardName.APHRODITE]: 'css',
  [CardName.ARBORIST_COLLECTIVE]: 'bespoke',
  [CardName.ARCADIAN_COMMUNITIES]: 'bespoke',
  [CardName.ARIDOR]: 'css',
  [CardName.ARKLIGHT]: 'css',
  [CardName.ASTRODRILL]: 'bespoke',
  [CardName.ATHENA]: 'bespoke',
  [CardName.AURORAI]: 'image',
  [CardName.BIO_SOL]: 'image',
  [CardName.CELESTIC]: 'bespoke',
  [CardName.CHEUNG_SHING_MARS]: 'bespoke',
  [CardName.CHIMERA]: 'image',
  [CardName.COLLEGIUM_COPERNICUS]: 'image',
  [CardName.CREDICOR]: 'css',
  [CardName.CRESCENT_RESEARCH_ASSOCIATION]: 'bespoke',
  [CardName.CURIOSITY_II]: 'bespoke',
  [CardName.DEMETRON_LABS]: 'bespoke',
  [CardName.ECOLINE]: 'css',
  [CardName.ECOTEC]: 'bespoke',
  [CardName.ERIS]: 'bespoke',
  [CardName.FACTORUM]: 'css',
  [CardName.GAGARIN_MOBILE_BASE]: 'bespoke',
  [CardName.HABITAT_MARTE]: 'image',
  [CardName.HADESPHERE]: 'bespoke',
  [CardName.HECATE_SPEDITIONS]: 'bespoke',
  [CardName.HELION]: 'css',
  [CardName.HENKEI_GENETICS]: 'bespoke',
  [CardName.INCITE]: 'bespoke',
  [CardName.INTERPLANETARY_CINEMATICS]: 'bespoke',
  [CardName.INTRAGEN_SANCTUARY_HEADQUARTERS]: 'image',
  [CardName.INVENTRIX]: 'bespoke',
  [CardName.JENSON_BOYLE_CO]: 'css',
  [CardName.JUNK_VENTURES]: 'css',
  [CardName.KEPLERTEC]: 'bespoke',
  [CardName.KINGDOM_OF_TAURARO]: 'bespoke',
  [CardName.KUIPER_COOPERATIVE]: 'bespoke',
  [CardName.LAKEFRONT_RESORTS]: 'bespoke',
  [CardName.LUNA_FIRST_INCORPORATED]: 'image',
  [CardName.LUNA_HYPERLOOP_CORPORATION]: 'image',
  [CardName.LUNA_TRADE_FEDERATION]: 'image',
  [CardName.MANUTECH]: 'bespoke',
  [CardName.MARS_DIRECT]: 'image',
  [CardName.MARS_FRONTIER_ALLIANCE]: 'image',
  [CardName.MARS_MATHS]: 'bespoke',
  [CardName.MARTIAN_INSURANCE_GROUP]: 'image',
  [CardName.MIDAS]: 'css',
  [CardName.MIND_SET_MARS]: 'image',
  [CardName.MINING_GUILD]: 'bespoke',
  [CardName.MONS_INSURANCE]: 'bespoke',
  [CardName.MORNING_STAR_INC]: 'css',
  [CardName.NANOTECH_INDUSTRIES]: 'image',
  [CardName.NIRGAL_ENTERPRISES]: 'bespoke',
  [CardName.ODYSSEY]: 'image',
  [CardName.PALLADIN_SHIPPING]: 'bespoke',
  [CardName.PHARMACY_UNION]: 'bespoke',
  [CardName.PHILARES]: 'bespoke',
  [CardName.PHOBOLOG]: 'css',
  [CardName.PLAYWRIGHTS]: 'bespoke',
  [CardName.POINT_LUNA]: 'css',
  [CardName.POLARIS]: 'image',
  [CardName.POLDERTECH_DUTCH]: 'bespoke',
  [CardName.POLYPHEMOS]: 'css',
  [CardName.POSEIDON]: 'css',
  [CardName.PRISTAR]: 'css',
  [CardName.PROJECT_WORKSHOP]: 'bespoke',
  [CardName.RECYCLON]: 'bespoke',
  [CardName.RINGCOM]: 'image',
  [CardName.ROBIN_HAULINGS]: 'image',
  [CardName.ROBINSON_INDUSTRIES]: 'bespoke',
  [CardName.SAGITTA_FRONTIER_SERVICES]: 'bespoke',
  [CardName.SATURN_SYSTEMS]: 'bespoke',
  [CardName.SEPTUM_TRIBUS]: 'bespoke',
  [CardName.SOLBANK]: 'bespoke',
  [CardName.SOYLENT_SEEDLING_SYSTEMS]: 'image',
  [CardName.SPIRE]: 'image',
  [CardName.SPLICE]: 'bespoke',
  [CardName.STEELARIS]: 'image',
  [CardName.STORMCRAFT_INCORPORATED]: 'bespoke',
  [CardName.TEMPEST_CONSULTANCY]: 'image',
  [CardName.TERACTOR]: 'css',
  [CardName.TERRALABS_RESEARCH]: 'bespoke',
  [CardName.THARSIS_REPUBLIC]: 'bespoke',
  [CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE]: 'image',
  [CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE]: 'image',
  [CardName.THE_GRAND_LUNA_CAPITAL_GROUP]: 'image',
  [CardName.THORGATE]: 'css',
  [CardName.TYCHO_MAGNETICS]: 'bespoke',
  [CardName.UNITED_NATIONS_MARS_INITIATIVE]: 'bespoke',
  [CardName.UNITED_NATIONS_MISSION_ONE]: 'bespoke',
  [CardName.UTOPIA_INVEST]: 'bespoke',
  [CardName.VALLEY_TRUST]: 'bespoke',
  [CardName.VIRON]: 'css',
  [CardName.VITOR]: 'bespoke',
  [CardName.VOLTAGON]: 'bespoke',
};

export default defineComponent({
  name: 'CardCorporationLogo',
  props: {
    title: {
      type: String as () => CardName,
      required: true,
    },
  },
  computed: {
    logos(): typeof logos {
      return logos;
    },
    CardName(): typeof CardName {
      return CardName;
    },
    logoClass(): string {
      const type = logos[this.title];
      switch (type) {
      case 'image':
      case 'css':
        const local = this.title.toLowerCase()
          .replaceAll(' ', '-')
          .replaceAll('&', '')
          .replaceAll('--', '-');
        return `card-${local}-logo`;
      default:
        return '';
      }
    },
    capsTitle(): string {
      return logos[this.title] === 'image' ? '' : this.title.toUpperCase();
    },
  },
});

</script>

