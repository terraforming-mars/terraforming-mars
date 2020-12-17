import {CardName} from './CardName';

/* eslint-disable no-irregular-whitespace */
export const HTML_DATA: Map<string, string> =
  new Map([
    [CardName.RESEARCH_OUTPOST, ` 
        <div class="content ">
            : <span class="money resource ">-1</span>
            <div class="description ">
                (Effect: When you play a card, you pay 1 MC less for it.)
            </div><br><br>
            <div class="tile city-tile "></div>
            <div class="description ">
                (Place a city tile NEXT TO NO OTHER TILE.)
            </div>
        </div>
`],
    [CardName.REGOLITH_EATERS, ` 
        <div class="content ">
            <div class="red-arrow "></div> <div class="microbe resource "></div><br>
            OR <div class="microbe resource "></div><div class="microbe resource "></div> <div class="red-arrow "></div> <div class="tile oxygen-tile "></div>
            <div class="description ">
                (Action: Add 1 Microbe to this card, or remove 2 Microbes from this card to raise oxygen level 1 step.)
            </div>
        </div>
`],
    [CardName.RELEASE_OF_INERT_GASES, ` 
        <div class="content ">
            <div class="tile rating "></div>  <div class="tile rating "></div>
            <div class="description ">
                (Raise your terraform rating 2 steps.)
            </div>
        </div>
`],
    [CardName.ROVER_CONSTRUCTION, ` 
    <div class="content">
      <div class="points points-big">1</div>
      <div class="tile city-tile-small red-outline"></div> :
      <div class="money resource">2</div>
      <div class="description">
        (Effect: When any City tile is placed, gain 2 MC.)
      </div>
    </div>
`],
    [CardName.QUANTUM_EXTRACTOR, ` 
        <div class="content ">
          <div class="requirements">4 Science</div>
            <div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div>
            <div class="description ">
                (Effect: When you play a Space card, you pay 2 MC less for it.)
            </div>
            <div class="production-box production-box-size1a" style="margin-top:10px">
                4 <div class="energy production"></div>
            </div>
            <div class="description ">
                (Requires 4 science tags. Increase your energy production 4 steps.)
            </div>
        </div>
`],
    [CardName.ROBOTIC_WORKFORCE, ` 
        <div class="content ">
          COPY A &nbsp; <div class="production-box"><div  class="resource-tag tag-building"></div></div>
          <div class="description">
          (Duplicate only the production box of one of your building cards.)
          </div>
        </div>
`],
    [CardName.RESEARCH, ` 
        <div class="content ">
          <div class="points points-big">1</div>
          <div class="resource card"></div> <div class="resource card"></div>
          <div class="description">
          (Counts as playing 2 science cards. Draw 2 cards.)
          </div>
        </div>
`],
    [CardName.RAD_SUITS, ` 
          <div class="content ">
            <div class="points points-big">1</div>
            <div class="requirements">2 Cities</div>
            <div class="production-box"><div  class="production money">1</div></div>
            <div class="description">
              (Requires two cities in play. Increase your MC up 1 step.)
            </div>
          </div>
`],
    [CardName.RESTRICTED_AREA, ` 
          <div class="content ">
              <div class="money resource ">2</div> <div class="red-arrow "></div> <div class="card resource "></div>
              <div class="description ">
                  (Action: Spend 2 MC to draw a card.)
              </div><br>
              <div class="tile special-tile"><div class="special-tile-symbol special-tile--restricted-area"></div></div>
              <div class="description ">
                (Place this tile.)
              </div>
          </div>
`],
    [CardName.RAD_CHEM_FACTORY, ` 
        <div class="content">
          <div class="production-box production-box-size1a">
            <div class="production-prefix minus"></div><div class="energy production"></div><br>
          </div>
          <div class="nowrap">
            <div class="tile rating"></div><div class="tile rating"></div>
          </div>
          <div class="description">
            (Decrease your Energy production 1 step. Raise your TR 2 steps.)
          </div>
        </div>
`],
    [CardName.ROTATOR_IMPACTS, ` 
            <div class="content hover-hide-res">
                <div class="requirements requirements-max">max 14% Venus</div>
                <div class=" money resource ">6</div> (<span class="resource titanium"></span>)
                <span class="red-arrow "></span><div class="asteroid resource"></div><br>
                OR <div class="asteroid resource"></div> <span class="red-arrow "></span> <div class="tile venus-tile">V</div>
                <div class="description ">
                  (Action: spend 6 MC to add an asteroid resource to this card (TITANIUM MAY BE USED), or spend 1 resource from this card to increase Venus 1 step)
                  <br>(Venus must be 14% or lower)
                </div>
            </div>
`],
    [CardName.RESEARCH_COORDINATION, ` 
              <div class="content ">
                After being played, when you perform an action, the wild tag counts as any tag of your choice.
              </div>
`],
    [CardName.QUANTUM_COMMUNICATIONS, ` 
            <div class="content ">
              <div class="points points-big ">1</div>
              <div class="requirements">4 Science</div>
              <div class="production-box production-box-size2a">
                <div class="money production">1</div> / <div class="colony colony-icon-small red-outline"></div>
              </div><br>
              <div class="description">
                (Requires 4 Science tags. Increase your MC production 1 step for each colony in play.)
              </div>
            </div>
`],
    [CardName.RED_SPOT_OBSERVATORY, `
              <div class="content ">
                <div class="points points-big">2</div>
                <div class="requirements">3 Science</div>
                <div class="red-arrow "></div> <div class="resource floater"></div> OR
                <div class="resource floater"></div> <div class="red-arrow "></div>  <div class="resource card"></div>
                <div class="description ">
                  (Action: Add 1 floater to this card, or spend 1 floater here to draw a card.)
                </div>
                <div class="resource card"></div><div class="resource card"></div>
                <div class="description bottom">(Requires 3 Science tags.</div>
                <div class="description bottom">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Draw 2 cards.)</div>
              </div>
`],
    [CardName.REFUGEE_CAMP, ` 
              <div class="content ">
                  <div class="points points-big">1/<div class="resource camp" style="vertical-align:middle;"></div></div>
                  <div class="production-box production-box-size1a ">
                      <div class="production-prefix minus"></div><div class="money production ">1</div>
                  </div>
                  <span class="red-arrow " style="margin-left:5px; "></span>
                  <div class="resource camp"></div>
                  <div class="description ">
                      (Action: Decrease your MC production 1 step to add a camp resource to this card.)
                      <br><br>
                      (1 VP for each camp resource on this card.)
                  </div>
              </div>
`],
    [CardName.RESEARCH_COLONY, ` 
            <div class="content ">
              <div class="tile colony"></div>* <div class="resource card first"></div><div class="resource card"></div>
              <div class="description mt-10" >
                (Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.)
              </div>
            </div>
`],
    [CardName.RIM_FREIGHTERS, ` 
              <div class="content ">
                  <div class="tile trade"></div> : <div class="resource resource--white">-1</div>
                  <div class="description ">
                      (Effect: When you trade, you pay 1 less resource for it.)
                  </div>
              </div>
`],
    [CardName.MINING_GUILD, ` 
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource steel"></div> /
        <div class="resource titanium"></div> :
        <div class="production-box">
          <div class="production steel"></div>
        </div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: Each time you get any steel or titanium as a placement bonus on the map, increase your steel production 1 step.)
        </div>
      </div>
      <span class=" mining guild" style="font-size:24px;
              margin-left:20px;
                      color:#c9380e;
                      text-shadow: -1px 0 #333333, 0 1px #333333, 1px 0 #333333, 0 -1px #333333, 2px 2px 2px  black;
                      display:inline-block;
                      -webkit-transform:scale(1.5,1); /* Safari and Chrome */
                      -moz-transform:scale(1.5,1); /* Firefox */
                      -ms-transform:scale(1.5,1); /* IE 9 */
                      -o-transform:scale(1.5,1); /* Opera */
                      transform:scale(1.5,1); /* W3C */
                      ">
                  MINING<br>GUILD
              </span><br>
      <div class="resource money" style="margin-left:35px;">30</div>&nbsp;&nbsp;
      5<div class="resource steel"></div>
      <div class="production-box" style="margin-top:5px;margin-left:20px;">
        <div class="production steel"></div>
      </div>
      <div class="description" style="margin-top:-5px;text-align:center;">
        (You start with 30 MC, 5 steel, and 1 steel production)
      </div>
    </div>
`],
    [CardName.THARSIS_REPUBLIC, ` 
      
      <div class="contentCorporation ">
          <div class="corporationEffectBox ">
              <div class="corporationEffectBoxLabel ">EFFECT</div>
              <div class="tile city-tile-small red-outline"></div>*: <div class="production-box"><div class="production money">1</div></div>&nbsp;&nbsp;
                <div class="tile city-tile-small"></div>:<div class="resource money">3</div>
              <div class="description " style="text-align:center;margin-top:0px; ">
                  (Effect: When any city tile is placed ON MARS, increase your MC production 1 step. When you place a city tile, gain 3 MC.)
              </div>
          </div>
          <div style="color: #020202;font-size:24px;text-shadow:6px 6px 6px grey;">
            <div style="text-shadow:none;box-shadow:3px 3px 6px grey;margin-right:2px;border: 1px solid red;display:inline-block;background-color:#ff5f00;">&#x25b2;<span style="color: #020202;font-size:14px;padding:0px;border:none;margin-left:-5px;">&#x25b2;</span>
            </div>THARSIS<br>&nbsp; REPUBLIC</div>
          <div class="description " style="text-align:center ">
          <div class="resource money " style="margin-left:60px;">40</div> <div class="tile city-tile" style="margin-left:40px;margin-top:-20px;"> </div><br>
              (You start with 40 MC. As your first action in the game,place a city tile.)
          </div>
      </div>
`],
    [CardName.UNITED_NATIONS_MARS_INITIATIVE, ` 
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">ACTION</div>
        <div class="resource money">3</div> <span class="red-arrow"></span>
        <div class="tile rating"></div>*
        <div class="description" style="text-align:center;margin-top:0px;">
          (Action:If your Terraform Rating was raised this generation, you may pay 3 MC to raise it 1 step more.)
        </div>
      </div>
      <div class="background-color-active" style="font-size:16px;
                      width:100px;
                      color: white;
                      margin-left:19px;
                      margin-bottom:8px;
                      padding:5px;
                      padding-top:5px;
                      padding-bottom:5px;
                      text-align:center;
                      font-weight:normal;
                      box-shadow:3px 3px 6px grey;
                      ">
                  UNITED NATIONS MARS INITIATIVE
              </div>
      <div class="description" style="text-align:center;margin-left:50px;">
        <div class="resource money">40</div> &nbsp;&nbsp;&nbsp;(You start with 40 MC.)
      </div>
    </div>
`],
    [CardName.TERACTOR, ` 
    
    
    <div class="contentCorporation">
      <div class="corporationEffectBox">
        <div class="corporationEffectBoxLabel">EFFECT</div>
        <div class="resource-tag tag-earth"></div> :
        <div class="resource money">-3</div>
        <div class="description" style="text-align:center;margin-top:0px;">
          (Effect: When you play an Earth tag, you pay 3 MC less for it.)
        </div>
      </div>
      <span style="font-size:34px;
                      color: orangered;
                      font-family: 'Times New Roman';
                      font-weight:normal;
                      text-shadow: -1px 0 #333333, 0 1px #333333, 1px 0 #333333,0px -1px #333333, 6px 3px 5px  grey;">
                  TERACTOR
              </span><br><br>
      <div class="description" style="text-align:center;">
        <div class="resource money">60</div><br> (You start with 60 MC.)
      </div>
    </div>
`],
    [CardName.MANUTECH, ` 
      
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="production-box">
          <div class="production wild"></div>
          </div> :
          <div class="resource wild"></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: For each step you increase the production of a resource, including this, you also gain that resource.)
          </div>
        </div>
        <span class="manutech" style="font-size:30px;
                        color: #e63900;
                        text-shadow:  6px 3px 5px  grey;">
                    <span style="color:white;background:#e63900;text-shadow:none;padding-left:2px;">MA</span>NUTECH
                </span><br>
        <div class="production-box" style="margin-top:15px;margin-left:50px;">
          <div class="production steel"></div>
        </div>
        <div class="resource money" style="margin-left:20px;">35</div>
        <div class="description" style="text-align:center;">
          (You start with 1 steel production, and 35 MC)
        </div>
      </div>
`],
    [CardName.ROBINSON_INDUSTRIES, `
      
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="resource money">4</div>
          <div class="red-arrow"></div>
          <div class="production-box">
          <div class="production wild"></div>
          </div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Action: Spend 4 MC to increase (one of) your LOWEST PRODUCTION 1 step.)
          </div>
        </div>
        <div class="robinson" style="letter-spacing:4px;border-bottom:3px solid #ccc;margin-top:5px;">ROBINSON</div>
        <div class="robinson" style="border-bottom:3px solid #ccc;">•—•—•—•—•—•—•&nbsp;</div>
        <div class="robinson" style="letter-spacing:2px;">INDUSTRIES</div>
        <div class="resource money" style="margin-left:59px;margin-top:10px;">47</div>
        <div class="description" style="text-align:center;">
          (You start with 47 MC.)
        </div>
`],
    [CardName.VALLEY_TRUST, ` 
        
        
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource-tag tag-science"></div> : <div class="resource money">-2</div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play an Science tag, you pay 2MC less for it.)
                </div>
            </div>
            <div style="color:rgb(2,125,195);background:linear-gradient(to right,rgb(2,125,195) 10%,white,white,white, white,white,white, white);box-shadow:3px 3px 10px 1px rgb(58,58,58);width:135px;line-height:24px;border-radius:10px 0px 0px 10px">
              <div style="display:inline-block;margin-left:25px;margin-top: 3px;margin-bottom:15px;font-size:26px;text-shadow: 2px 2px #ccc;text-align:center">VALLEY TRUST</div>
            </div>
            <div class="description" style="text-align:center;">
            <div class="resource money" style="margin-left:12px;margin-top:10px;">37</div> <div class="resource card-corporation" style="margin-left:50px"><span style="background:linear-gradient(to right, rgb(235,118,171), #e64d91);padding-left:4px;padding-right:4px;border-radius:2px;">PREL</span></div>
            <div class="description" style="margin-top:-2px;">
              (You start with 37 MC. As your first action, draw 3 Prelude cards, and play one of them. Discard the other two.)
            </div>
        </div>
`],
    [CardName.VITOR, ` 
        
        
        <div class="contentCorporation ">
            <div class="corporationEffectBox ">
                <div class="corporationEffectBoxLabel ">EFFECT</div>
                <div class="resource points-big"
                style="background: linear-gradient(#cc8b00, rgb(128, 87, 0),rgb(128, 87, 0));
                width: 40px;
                height: 34px;
                font-weight: normal;
                line-height: 31px;
                font-size: 28px;
                text-align: center;
                border-radius: 12px;
                border-style: outset;
                background-color: rgb(205,162,130);
                background: linear-gradient(#cc8b00, rgb(128, 87, 0),rgb(128, 87, 0));
                box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3);
                ">?</div> : <div class="resource money">3</div>
                <div class="description " style="text-align:center;margin-top:0px; ">
                    (Effect: When you play a card with a NON-NEGATIVE VP icon, including this, gain 3MC.)
                </div>
            </div>
            <div class="vitor" style="font-size:24px;
            margin-top:10px;
            margin-left:50px;
            margin-bottom:35px;
            display:inline-block;
            box-shadow:6px 6px 6px grey;
            -webkit-transform:scale(2,1); /* Safari and Chrome */
            -moz-transform:scale(2,1); /* Firefox */
            -ms-transform:scale(2,1); /* IE 9 */
            -o-transform:scale(2,1); /* Opera */
            transform:scale(2,1); /* W3C */
            ;">
            <span style="color:white;background:orangered;padding-left:3px;">VIT</span>
            <span style="background:linear-gradient(to right, orangered,white);margin-left:-8px;">O</span>
            <span style="margin-left:-7px;background:white;padding-right:3px;">R</span>
            </div>
            <div class="description " style="text-align:center;margin-top:-5px ">
            <div class="resource money">45</div><span
            style="background:orange;padding:2px;padding-left:25px;padding-right:25px;
            font-size:14px;font-weight:bold;margin-left:20px;border-radius:3px;box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3);">AWARDS</span> <br>
              (You start with 45 MC. As your first action, fund an award for free.)
            </div>
        </div>
`],
    [CardName.ARIDOR, ` 
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <span class="resource-tag" style="background:linear-gradient(to bottom right, green, yellow, red)">&nbsp;</span>&nbsp;:
          <div class="production-box">
            <div class="production money">1</div>
          </div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (When you get a new type of tag in play (event cards do not count), increase your MC production 1 step.)
          </div>
        </div>
        <div class="aridor">ARIDOR</div>
        <div class="resource money" style="margin-left:20px;">40</div>
        <span style="background:#444;color:#eee;padding:4px;padding-left: 8px;padding-right: 8px; border-radius:20px;font-weight:normal;margin-left:20px;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3); border:1px solid #eee;">COLONY</span>
        <div class="description" style="text-align:center;margin-top:0px;">
          (You start with 40MC. As your first action add a colony tile.)
        </div>
      </div>
`],
    [CardName.MONS_INSURANCE, ` 
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="production-box corp-effect-box">
          -<div class="resource wild corp-effect"></div>
          </div>
          OR - <div class="resource wild red-outline"></div>:
          PAY<div class="resource money" style="margin-right:-2px">3</div>
          <div class="description" style="text-align:center;margin-top:-2px;">
            (Effect: When a player causes another player to decrease production or lose resources, pay 3MC to the victim, or as much as possible.)
          </div>
        </div>
        <div class="mons" style="margin-top:18px">
          <div class="mons0">&#x25b2;</div>
          <div class="mons1">mons</div>
          <div class="mons2">INSURANCE</div>
        </div>
        <div class="resource money" style="margin-left: 145px;
              margin-right: 20px;
              margin-top: -80px;
              position: absolute;">48</div>
        <div class="production-box production-box-size2a" style="
              position: absolute;
              margin-top: -46px;
              margin-left: 92px;">
          <div class="production money">4</div> <div class="production money red-outline">-2</div>*
        </div>
        <div class="description" style="margin-top:11px;text-align:center;">
          (You start with 48 MC. Increase your MC production 4 steps. ALL OPPONENTS DECREASE THEIR MC PRODUCTION 2 STEPS. THIS DOES NOT TRIGGER THE EFFECT BELOW.)
        </div>
      </div>
`],
    [CardName.UTOPIA_INVEST, ` 


<div class="contentCorporation">
  <div class="corporationEffectBox">
    <div class="corporationEffectBoxLabel">ACTION</div>
    <div class="production-box">
      <div class="production wild"></div>
    </div>
    <div class="red-arrow"></div>
    4<div class="resource wild"></div>
    <div class="description utopia-ability-description">
      (Action: Decrease any production to gain 4 resources of that kind.)
    </div>
  </div>
  <div class="utopia-corp-name">
    <div class="utopia-corp-name-1">UTOPIA</div>
    <div class="utopia-corp-name-2">INVEST</div>
  </div>
  <div class="utopia-starting-resources">
    <div class="resource money">40</div>
  </div>
  <div class="production-box production-box-size2 utopia-production-box">
    <div class="production steel"></div><div class="production titanium"></div>
  </div>
  <div class="description utopia-description-box">
    (You start with 40 MC. Increase your steel and titanium production 1 step each.)
  </div>
</div>
`],
    [CardName.STORMCRAFT_INCORPORATED, ` 
      
      
      <div class="contentCorporation">
        <div class="corporationEffectBox hover-hide-res" style="margin-top: 136px; height: 149px">
          <div class="corporationEffectBoxLabel" style="margin-bottom:5px;" >ACTION</div>
          <div class="red-arrow"></div> <div class="resource floater" style="margin-bottom:5px;"></div>* <br>
          <div class="resource floater"></div> = <div class="resource heat"></div><div class="resource heat"></div>
          <div class="description" style="text-align:center;margin-top:-5px;">
            (Action: Add a floater to ANY card.<br> Effect: Floaters on this card may be used as 2 heat each.)
          </div><br>
        </div>
        <div class="stormcraft1">STORM</div><div class="stormcraft2">CRAFT</div>
        <div class="stormcraft3">INCOR</div><div class="stormcraft4">PORATED</div>
        <div class="resource money" style="margin-left:60px;">48</div>
        <div class="description" style="margin-left: 20px">
          (You start with 48 MC.)
        </div>
      </div>
`],
    [CardName.ARCADIAN_COMMUNITIES, `
      
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="corporation-action-text"><span class="red-arrow"></span>ACTION: PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA ADJACENT TO ONE OF YOUR TILES OR MARKED AREAS</div>
          <div class="corporationEffectBoxLabel">EFFECT</div>
            <div class="corporation-effect-text">EFFECT: MARKED AREAS ARE RESERVED FOR YOU. WHEN YOU PLACE A TILE THERE, GAIN 3 MC</div>
        </div>
        <div class="corporation-logo">ARCADIAN COMMUNITIES</div>

        <div class="corporation-startswith nowrap">
          <div class="resource money">40</div>
          10<div class="resource steel"></div>
          <div class="resource special">&nbsp;</div>*
        </div>
        <div class="description" >(You start with 40 MC and 10 steel. AS YOUR FIRST ACTION, PLACE A COMMUNITY (PLAYER MARKER) ON A NON-RESERVED AREA.)</div>
      </div>
`],
    [CardName.BEGINNER_CORPORATION, `
      
      <div class="contentCorporation">
        <div class="corporation-frame">BEGINNER CORPORATION</div>
        <div class="resource money">42</div>
        <div class="description">
          You start with 42 MC. Instead of choosing from 10 cards during setup, you get 10 cards for free.)
        </div>
      </div>
`],
    [CardName.PHILARES, ` 
      
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          <div class="tile empty-tile-small red-outline"></div><div class="tile empty-tile-small"></div>
          : <div class="resource wild"></div>
          <div class="description" style="text-align:center;margin-top:0px;">
            (Effect: Each new adjacency between your tile and an opponent's tile gives you a standard resource of your choice (regardless of who just placed a tile).)
          </div>
        </div>
        <div class="philares">
          PHIL<span style="color:#ff5858">A</span>RES
        </div>
        <div class="resource money" style="margin-left:35px;margin-right:20px;margin-top:20px;">47</div>
        <div class="tile greenery-tile">
        </div>
        <div class="description" style="margin-top:-3px;text-align:center;">
          (You start with 47 MC. As your first action, place a greenery tile and raise the oxygen 1 step.)
        </div>
      </div>
`],
    [CardName.RECYCLON, ` 
      
      
      <div class="contentCorporation">
        <div class="corporationEffectBox hover-hide-res">
          <div class="corporationEffectBoxLabel" style="margin-bottom:10px">EFFECT</div>
          <div class="resource-tag tag-building"></div> :<div class="resource microbe"></div> OR
          2<div class="resource microbe"></div>:<div class="production-box" style="margin-left:5px;"><div class="production plant"></div></div><br>
          <div class="description" style="margin-top:-3px;text-align:center;">(Effect: When you play a building tag, including this, gain 1 microbe to this card, or remove 2 microbes here and raise your plant production 1 step.)
        </div>
        </div>
        <div class="recyclon-fix"> RECYCLON</div>
      </div>
      <div class="recyclon-fix-2">
        <div class="resource money" style="margin-left:60px;margin-right:25px;">38</div>
        <div class="production-box" style="margin-left:20px;"><div class="production steel"></div></div>
        <div class="description" style="margin-top:0px;text-align:center;">(You start with 38 MC and 1 steel production.)</div>
      </div>
`],
    [CardName.SPLICE, `
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel" style="margin-bottom:2px">EFFECT</div>
          <div class="resource-tag tag-microbe red-outline"></div> : <div class="resource money red-outline">2</div> * OR <div class="resource microbe red-outline"></div> *<br>
          <div class="resource-tag tag-microbe red-outline" style="margin-top:-4px;"></div> : <div class="resource money" style="margin-right:91px;margin-left:5px;margin-top:-4px;">2</div> <br>
          <div class="description" style="margin-top:-3px;text-align:center;">(Effect: when a microbe tag is played, incl. this, THAT PLAYER gains 2 MC, or adds a microbe to THAT card, and you gain 2 MC.)
        </div>
        </div>
        <div class="splice"><div style="margin-left:2px"> SPLI<span style="color:red">C</span>E</div>
                    <div STYLE="height:3px;background:red;margin-top:-3px;"></div>
                    <div STYLE="font-size:10px">TACTICAL GENOMICS</div>
                </div>
                <div class="resource money" style="margin-left:60px;margin-right:25px;">44</div>
        <div class="resource card"><div class="card-icon tag-microbe"></div></div>
        <div class="description" style="margin-top:-2px;margin-left:-7px;margin-right:-7px;text-align:center;">(You start with 44 MC. As your first action, reveal cards until you have revealed a microbe tag. Take that card into hand and discard the rest.)</div>
      </div>
`],
    [CardName.LAKEFRONT_RESORTS, `
            
            <div class="contentCorporation ">
                <div class="corporationEffectBox" style="height:140px;margin-top:150px">
                    <div class="corporationEffectBoxLabel" style="margin-bottom:4px;">EFFECT</div>
                    <div class="nowrap">
                      <div class="resource ocean-resource red-outline"></div>*: <div class="production-box"><div class="production money">1</div></div>
                      <div class="tile empty-tile-small"></div>
                      <div class="resource ocean-resource" style="margin-left:-3px;"></div>:<div class="resource money">3</div>
                    </div>
                    <div class="description " style="text-align:center;margin-top:0px; ">
                        (Effect: When any ocean tile is placed, increase your MC production 1 step. Your bonus for placing adjacent to oceans is 3MC instead of 2MC.)
                    </div>
                </div>
                <div style="font-size:22px;margin-top:10px;margin-left:10px;font-family:Times;color:white;
                text-shadow:0 1px 0px #444, 0px -1px 0px #444, -1px 0px 0px #444, 1px 0px 0px #444;letter-spacing:4px;">
                  LAKEFRONT <br> &nbsp;&nbsp;RESORTS
                  </div>
                <div class="resource money " style="margin-left:75px;margin-top:10px;">54</div>
                <div class="description " style="text-align:center;margin-left:15px;">
                    (You start with 54 MC.)
                </div>
            </div>
`],
    [CardName.FACTORUM, `
          
          <div class="contentCorporation">
            <div class="corporationEffectBox">
              <div class="corporationEffectBoxLabel">ACTION</div>

              <div class="corporation-action-icons nowrap">
                <div class="red-arrow"></div><div class="production-box">
                  <div class="production energy"></div>
                </div> * OR
                <div class="resource money">3</div><div class="red-arrow"></div>
                <div class="resource card"><div class="card-icon tag-building"></div></div>
              </div>

              <div class="description">
                (Action: Increase your energy production 1 step IF YOU HAVE NO ENERGY RESOURCES, or spend 3MC to draw a building card.)
              </div>
            </div>

            <div class="factorum">FACTORUM</div>
            <div class="corporation-starts-with">
              <div class="resource money">37</div>
              <div class="production-box">
                <div class="production steel"></div>
              </div>
            </div>
            <div class="description">
              (You start with 37 MC. Increase your steel production 1 step.)
            </div>
          </div>
          `],
    [CardName.ASTRODRILL, `
      
      <div class="contentCorporation">
        <div class="corporationEffectBox hover-hide-res" style="height:165px;margin-top:127px">
          <div class="corporationEffectBoxLabel" >ACTION</div>
          <div class="red-arrow"></div> <div class="asteroid resource"></div> * / <div class="resource wild"></div> OR <br>
          <div class="asteroid resource"></div><div class="red-arrow"></div> 3 <div class="resource titanium"></div>
          <div class="description" style="text-align:center;">
            (Action: Add an asteroid resource to ANY card OR gain any standard resource, OR remove an asteroid resource from this card to gain 3 titanium.)
          </div><br>
        </div>
        <div class="astrodrill">Astrodrill</div>
        <div class="resource money" style="margin:3px 40px 0px 50px">38</div>
        3 <div class="asteroid resource"></div>
        <div class="description" style="text-align:center">
          (You start with 38 MC and 3 asteroid resources.)
        </div>
      </div>
`],
    [CardName.PHARMACY_UNION, `
    
    <div class="contentCorporation">

      <div class="corp-logo">Pharmacy Union</div>

      <div class="card-effect-icons">
        <div class="resource money startmc">54</div>
        <div class="resource card"><div class="card-icon tag-science"></div></div>
      </div>

      <div class="description card-effect-text">
        (You start with 54 MC. When this corporation is revealed, draw a Science card.)
      </div>

      <div class="corporationEffectBox hover-hide-res">
        <div class="corporationEffectBoxLabel">Effect</div>
        <div class="resource-tag tag-microbe red-outline"></div> : <div class="resource disease">D</div><div class="resource money">-4</div>
        <div class="corp-effectrow2">
          <div class="resource-tag tag-science"></div> : - <div class="resource disease">D</div><div class="rating tile"></div> / 3 <div class="rating tile"></div>
        </div>
        <div class="description">
          (Effect: When ANY microbe tag is played, add a disease here and lose 4 MC. When you play a science tag, remove a disease here and gain 1 TR OR if there are no diseases here, you may turn this card face down to gain 3 TR)
        </div>
      </div>
    </div>

`],
    [CardName.REGO_PLASTICS, ` 
    <div class="content ">
        <div class="points points-big">1</div>
        <div class="resource steel"></div> : + <div class="resource money">1</div>
        <div class="description">
            (Effect: Your steel resources are worth 1 MC extra.)
        </div>
    </div>
`],
    [CardName.RECRUITMENT, ` 
  <div class="content ">
    <div class="minus"></div> <div class="delegate delegate-red"></div>* &nbsp;&nbsp; <div class="plus"></div> <div class="delegate"></div>
      <div class="description ">
        (Exchange one NEUTRAL NON-LEADER delegate with one of your own from the reserve.)
      </div>
  </div>
`],
    [CardName.RED_TOURISM_WAVE, ` 
  <div class="content ">
    <div class="requirements"><span class="party">Reds</span></div>
    <div class="resource money">1</div> / <div class="tile empty-tile-small"></div>*

      <div class="description ">
        (Requires that Reds are ruling or that you have 2 delegates there. Gain 1 MC from each EMPTY AREA ADJACENT TO YOUR TILES.)
      </div>
  </div>
`],
    [CardName.AGRICOLA_INC, ` 
      
      <div class="contentCorporation">
        <div class="pointsCorporation">?</div>
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>

          <div class="description effect">
            (Effect: At game end, score -2 / 0 / 1 / 2 VP PER TAG TYPE for 0 / 1-2 / 3-4 / 5+ tags.)
          </div>
        </div>
      </div>

      <div class="agricola">Agricola Inc</div>
      <div class="resource money">40</div>

      <div class="production-box production-box-size2">
        <div class="money production ">1</div>
        <div class="production plant"></div>
      </div>
      
      <div class="description">
        (You start with 1 plant production, 1 MC production and 40 MC.)
      </div>
`],
    [CardName.PROJECT_WORKSHOP, `
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>

          <div style="margin-top:-2px">
            FLIP <div class="resource card card-small"><div class="card-icon card-icon-blue"></div></div>
            <div class="red-arrow "></div>
            ? <div class="tile rating"></div>
            <div class="resource card card-small"></div>
            <div class="resource card card-small"></div>
          </div>

          <div>
            OR <div class="money production">3</div>
            <div class="red-arrow "></div>
            <div class="resource card card-small"><div class="card-icon card-icon-blue"></div></div>
          </div>

          <div class="effect description">
            (Action: Flip and discard a played blue card to convert any VP on it into TR and draw 2 cards, or spend 3 MC to draw a blue card.)
          </div>
        </div>
      </div>

      <div class="project_workshop">PROJECT WORKSHOP</div>
      <div class="resource money">39</div>
      <div class="resource steel"></div>
      <div class="resource titanium"></div>
      <div class="resource card card-medium"><div class="card-icon card-icon-blue"></div></div>
      
      <div class="description">
        (You start with 39 MC, 1 steel and 1 titanium.
        <br>
        As your first action, draw a blue card.)
      </div>
`],
    [CardName.INCITE, `
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">EFFECT</div>
          + <div class="influence"></div>
          <br>
          <div class="delegate effect"></div> : <div class="money resource effect-money">-2</div>
          <div class="description effect">
            (Effect: You have influence +1. When you send a delegate using the lobbying action, you pay 2 MC less for it.)
          </div>
        </div>
      </div>

      <div class="incite">INCITE</div>
      <div class="resource money">32</div>
      <div class="delegate"></div><div class="delegate"></div>
      
      <div class="description start-text">
        (You start with 32 MC. As your first action, place two delegates in one party.)
      </div>
`],
    [CardName.PLAYWRIGHTS, `
      
      <div class="contentCorporation">
        <div class="corporationEffectBox">
          <div class="corporationEffectBoxLabel">ACTION</div>
          <div class="resource money effect-money">?</div>
          <div class="red-arrow"></div>
          REPLAY &nbsp;<div class="resource card red-outline"><div class="card-icon tag-event"></div></div>&nbsp;*
          
          <div class="description effect">
            (Action: Replay a played event from any player by paying its cost ONLY in MC (discounts and rebates apply), then REMOVE IT FROM PLAY.)
          </div>
        </div>
      </div>

      <div class="playwrights">Playwrights</div>
      <div class="resource money">38</div>
      <div class="production-box">
        <div class="production energy"></div>
      </div>
      
      <div class="description start-text">
        (You start with 38 MC and 1 Energy production.)
      </div>
`],
    [CardName.MIDAS, `
      

      <div class="midas">Midas</div>
      <div class="resource money">120</div>
      <span class="start-tr-text">-7</span>
      <div class="tile rating"></div>

      <div class="description">
        (You start with 120 MC. Lower your TR 7 steps.)
      </div>
`],
    [CardName.RESTRICTED_AREA_ARES, `
    <div class="card-number">A23</div>
    <div class="content ">
        <div class="money resource ">2</div> <div class="red-arrow "></div> <div class="card resource "></div>
        <div class="description ">
            (Action: Spend 2 M€ to draw a card.)
        </div><br>
        <div class="ares-tile board-space-tile--restricted_area_ares"></div>
        <div class="description ">
          (Place this tile which grants an <b>adjacency bonus</b> of 1 card.)
        </div>
    </div>
`],
  ]);
