# EFshield: el. parduotuvės demo

Statinė HTML/CSS/JS demonstracinė versija naujai **EFshield** parduotuvei. EFshield gamina du skydus: vieną „Wi-Fi“ maršrutizatoriui, kitą telefonui. Skydas sumažina prietaiso skleidžiamų bangų stiprumą į pasirinktą pusę, o ryšio neblokuoja.

Galutinė platforma: **WordPress + WooCommerce + XStore** (Elementor). Šiame etape sukurti du puslapių tipai: **pradžios puslapis** ir **prekės puslapis** (abi prekės iš vieno šablono).

Puslapiai pažymėti `noindex, nofollow`. Prieš tikrą paleidimą žymą išimti.

## Peržiūra

Gyva versija: https://arvydastry.github.io/efshield/ (GitHub Pages iš šakos `main`; atsinaujina po kiekvieno įkėlimo į saugyklą).

Vietoje:

```bash
python3 serve.py
```

Tada naršyklėje atidaryti http://localhost:8190. Puslapiai atsidaro ir tiesiai iš failų, tik „YouTube“ vaizdo įrašas tada gali nepasileisti.

- `?static=1` adreso gale išjungia visą judesį (patogu ekrano nuotraukoms). Tas pats įvyksta, kai lankytojo sistemoje įjungta „mažiau judesio“.
- Be „JavaScript“ puslapiai lieka perskaitomi: visas tekstas matomas, informacijos skiltys išskleistos, interaktyvi schema paslepiama.

## Puslapiai

| Failas | Kas tai |
|---|---|
| `index.html` | Pradžios puslapis: hero su tikra kliento nuotrauka, judančiomis bangomis ir abiejų prekių kainomis; faktų juosta; abu skydai su spalvos pasirinkimu; teiginys apie dizainą; tamsi scena „Skydas veikia kaip veidrodis“ su interaktyvia schema ir matavimo skaičiais; trys panaudojimo vietos; video juosta; idėjos istorija; keturi patarimai; kontaktų forma |
| `preke-wifi-skydas.html` | Prekės puslapis: WIFI skydas, 30,00 € |
| `preke-telefono-skydas.html` | Prekės puslapis: Telefono skydas, 25,00 € |

Abiejuose puslapių tipuose veikia krepšelis (šoninis langas, kiekiai, suma, išsaugomas naršyklėje), spalvos pasirinkimas, vaizdo įrašo langas, mobilus meniu ir slenkant pasislepianti antraštė. Prekės puslapyje papildomai: galerija su priartinimu ir peržiūros langu, kiekis, informacijos skiltys, blokas su antru skydu („Telefonui turime atskirą skydą“ arba „Maršrutizatoriui turime atskirą skydą“) ir lipni pirkimo juosta. Spalva perduodama nuoroda: `preke-wifi-skydas.html?spalva=baltas`. Nuorodos į dar nesukurtus puslapius (paskyra, apmokėjimas, taisyklės) rodo pranešimą.

## Dizaino kryptis

Išeities taškas: dviejų prekių parduotuvė namų ūkiams, kuriems rūpi, kas vyksta jų namuose. Kalba rami ir tiksli, o visa tapatybė išvesta iš paties gaminio.

- **Tapatybė iš gaminio.** Skydas yra juoda arba balta dėžutė su Gyvybės gėle. Todėl puslapis juodai baltas, kampai statūs (kaip dėžutės), o apskritimai naudojami tik bangoms, simboliui, spalvų taškams ir vaizdo įrašo mygtukui.
- **Viena akcentinė spalva: bangų oranžinė `#FF5300`.** Ji paimta iš EFshield „Facebook“ viršelio, kuriame ja nupieštos bangos. Taisyklė: oranžinė reiškia bangas arba matavimą. Už skydo oranžinės nebelieka. Fokusas, pažymėjimai ir mygtukai yra juodi.
- **Šriftai.** Mona Sans (kintamas; antraštėms naudojamas išplėstas plotis) ir Doto (taškinis, kaip matuoklio ekranas) tik išmatuotiems skaičiams ir žingsnių numeriams. Abu laikomi `assets/fonts/` (OFL licencija). Mona Sans turi visus lietuviškus rašmenis. Doto failas apkarpytas iki skaitmenų, lotyniškų raidžių be diakritinių ženklų ir skyrybos ženklų (nėra ą, č, ę, ė, į, š, ų, ū, ž, lietuviškų kabučių ir €), todėl tinka tik skaičiams.
- **Viena tamsi scena puslapyje.** Joje yra interaktyvi schema: skydą galima pasukti į miegamąjį, svetainę ar vaikų kambarį ir pamatyti, kuri pusė lieka pridengta. Tai atsakymas į klausimą „kaip tai veikia“, ne dekoracija. Visa kita šviesu.
- **Judesys.** Hero bangos sklinda nuo maršrutizatoriaus antenų ir sustoja ties skydu; nuotraukos slenka skirtingu greičiu (paralaksas); prekės pakrypsta pagal pelę, o užvedus pelę už jų pasirodo bangos; teiginio žodžiai ryškėja slenkant; panaudojimo kortelės kraunasi viena ant kitos; tamsi scena įslenka su paraštėmis ir išsiplečia; faktų juosta greitėja slenkant; mygtukuose nuo pelės taško išsiplečia banga. Prekės puslapyje pavadinimas ir pirkimo blokas iškyla įkeliant puslapį, prekė švelniai priartėja kaskart pakeitus spalvą, o bangų žiedai už jos slenka kitu greičiu nei pati prekė.
- **Prekių nuotraukos** iškirptos iš fono ir visur turi tą patį šešėlį. Juodas skydas rodomas šviesiame fone, baltas tamsiame.
- **Ikonos:** Phosphor (Light), tik sąsajai (krepšelis, meniu, pristatymas).
- Nėra išgalvotų atsiliepimų, skaičių, ženklelių ar partnerių logotipų.

## Kas tikra, o kas demo

**Tikra (iš kliento šaltinių):** prekių pavadinimai ir kainos (30,00 € ir 25,00 €, 2025–2026 m. svetainė), prekių aprašymai, veikimo principas, panaudojimo būdai, keturi patarimai, idėjos istorija, kontaktai, nemokamas pristatymas Lietuvoje, grąžinimo sąlygos, mokėjimo būdai, matavimo skaičiai (6 V/m ir 0,5 V/m, 2019 m. bandymas su telefono skydu), prekių ir interjero nuotraukos, renginio nuotrauka, logotipas, bandymo vaizdo įrašas „YouTube“.

**Demo arba laikinas turinys:**

- Pexels nuotraukos ir vaizdo įrašas (panaudojimo kortelės, patarimai, video juosta, viena galerijos nuotrauka): iliustracijos, kurias geriau pakeisti tikromis.
- Krepšelis, forma ir apmokėjimas nieko nesiunčia.
- Interaktyvi schema yra iliustracija, ne matavimas (tai parašyta ir puslapyje).
- „Skirtumas: 12 kartų“ apskaičiuotas iš kliento skaičių (6 ÷ 0,5). Tą patį skaičių klientas pats minėjo 2020 m. „Facebook“ įraše.
- Suma 55,00 € bloke su antru skydu (eilutė „WIFI skydas ir telefono skydas“) yra dviejų kainų suma, be nuolaidos.
- Atsiliepimų skiltis tuščia: „Atsiliepimų dar nėra.“

## Tekstų pakeitimai, palyginti su kliento šaltiniais

Kliento tekstai palikti, taisytos rašybos ir skyrybos klaidos. Sąmoningi pakeitimai:

1. **Teiginiai apie sveikatą neperkelti.** Šaltiniuose daug teiginių apie žalą ir naudą sveikatai: ligos, „žalingos bangos“, „itin pavojingos vaikams“, „gerina miego kokybę“, „padeda išlaikyti emocinį balansą“, „sumažina elektromagnetinį stresą organizmui“. Demo kalba apie tai, ką skydas daro fiziškai (sumažina lauko stiprumą į uždengtą pusę, ryšio neblokuoja) ir ką klientas išmatavo. Tokie teiginiai reklamoje turi būti pagrįsti, todėl sprendimas paliktas klientui (žr. klausimus žemiau).
2. **Antraštė.** Vietoje „Apsaugok save namuose nuo elektromangetinių spindulių“: „Skydai nuo telefono ir „Wi-Fi“ bangų“. Po ja kliento sakinys apie tai, kad uždengtoje pusėje spinduliuotė sumažėja kelis kartus, papildytas žodžiais „o ryšys lieka“.
3. **Švelnesni veiksmažodžiai.** „Blokuoja tiesioginius spindulius … sukurdamas saugią zoną“ pakeista į „susilpnina tiesiogines bangas … ir sukuria ramesnę zoną“. „Jūsų nebeįtakos šie impulsai, nes skyde yra sluoksnis, kuris blokuoja šiuos signalus“ pakeista į „jame esantis sluoksnis susilpnina šias bangas jūsų kryptimi“. „Nepraleidžia elektromagnetinio lauko į pasirinktą pusę“ pakeista į „pasirinktoje pusėje laukas susilpnėja kelis kartus“. Priežastis: paties kliento matavimas rodo sumažėjimą, o ne visišką užtvėrimą.
4. **Išimti sakiniai.** „Visi šie impulsai veikia mūsų kūnus, ypač miego metu“ (telefono skydo aprašymas); „Įkrovimo metu spinduliuotė sustiprėja“ (antras patarimas); „ir atsistato“ (trečias patarimas); „Mažiems vaikams elektromagnetinės bangos itin pavojingos…“ (panaudojimo būdas).
5. **Panaudojimo būdai.** Trys vietoje keturių. „Suteiks dar daugiau ramybės“ pakeista į „jis lieka įjungtas, o bangos jūsų kryptimi susilpnėja“. „Apsaugosite ir save, ir savo vaikus“ pakeista į „sumažinsite bangų srautą ten, kur būnate jūs ir jūsų vaikai“. „Garso racijos“ pakeistos į „mobiliąsias aukles“. Ketvirtas būdas (kompiuteris ant kelių) nerodomas: neaišku, kuris skydas ir kaip jam naudojamas.
6. **Idėjos istorija.** Citata „Pajutau aiškius savijautos ir nuovargio skirtumus.“ yra pažodinė. Pastraipa po ja sutrumpinta: išimta išvada, kad „tam tikri prietaisai … nėra itin saugūs mūsų organizmui“.
7. **Pristatymo vaizdo įrašas nenaudojamas.** Jame yra teiginių apie vaikų sveikatą ir angliški subtitrai. Rodomas tik bandymo įrašas su matuokliu.
8. **Smulkūs.** „Salionas“ pakeistas į „svetainė“, „dalinai“ į „iš dalies“, „impulsai“ į „bangos“. Formos laukas „Jus dominantys klausimai, pasidalinimai“ pavadintas „Jūsų klausimas“, mygtukas „Pateikti“ pavadintas „Siųsti klausimą“, formos įžanga perrašyta trumpiau. Antrame patarime pridėta „nuo lovos ar fotelio“, ketvirto patarimo antraštė perrašyta. Idėjos istorijos pabaigoje išimta „ir poveikį“. Telefono skydo aprašyme pridėta „prie lovos“.

## Įgyvendinimas XStore temoje

Kiekviena sekcija šablonuose (`src/templates/`) turi komentarą su XStore arba Elementor atitikmeniu. Atitikmenys patikrinti pagal XStore demo svetainių HTML, 8theme dokumentaciją ir Elementor pagalbą. „Savaime“ reiškia, kad tai padaro pats valdiklis; „papildomai“ reiškia, kad reikia child theme CSS arba scenarijaus.

### Pradžios puslapis ir bendros dalys

| Demo blokas | XStore / Elementor atitikmuo | Pastabos |
|---|---|---|
| Viršutinė juosta (pristatymas, telefonas, el. paštas) | Header Builder (Elementor), viršutinis konteineris: Text Editor + XStore „Icon List“ | Matomumas pagal ekrano plotį nustatomas kiekvienam valdikliui. „Promo text“ yra senojo (Customizer) antraštės kūrėjo elementas, Elementor versijoje jo nėra. |
| Antraštė | Header Builder: „Site Logo“, „Nav Menu“, „Account“, „Cart“, „Mobile Menu“; konteinerio sticky tipas „smart“ | Reikia PRO Elements arba Elementor Pro. XStore lipni antraštė veikia per JS, todėl demo sticky ir slėpimo scenarijus neperkeliami. Meniu punktai veda į puslapio vietas: reikia „Menu Anchor“ arba CSS ID. |
| Hero su bangomis | Elementor Container (2 stulpeliai): Heading + Text Editor + 2× XStore „Text Button“ + nuorodos į prekes; dešinėje vienas HTML valdiklis su nuotrauka ir bangų SVG | Nuotrauka ir SVG turi likti viename HTML valdiklyje, nes naudoja tą pačią koordinačių sistemą. Papildomai: bangų animacija, atsiradimo judesys įkeliant puslapį, paralaksas, bangų sluoksnio judėjimas paskui pelę. Lankus sugeneruoja `build.py` (`hero_arcs`): į temą perkelti kaip paruoštą SVG. Hero nuotraukai rankomis grąžinti `preload` ir `fetchpriority`, išimti ją iš lazy-load. |
| Faktų juosta | XStore „Marquee“ (`etheme_marquee`) | Savaime: begalinė juosta, sustojimas užvedus. Papildomai: pagreitėjimas pagal slinkimo greitį ir besisukantis skyriklis tarp teiginių (jis priklauso nuo puslapio SVG rinkinio). |
| Dvi prekės su spalvos pasirinkimu | XStore „Product Grid“ (`etheme_product_grid`) su „Variation swatches“ kortelėse | Savaime: prekių užklausa, kaina, spalvų taškai, varianto nuotrauka. Spalva turi būti globalus atributas, o žymekliai įjungiami kiekvienam valdikliui atskirai. Papildomai: nelygus 7/5 išdėstymas, plytelės fonas, patamsėjantis pasirinkus baltą, matomi spalvų pavadinimai, bangos užvedus, pakreipimas. |
| Teiginys su ryškėjančiais žodžiais ir dviem nuotraukomis | Elementor Text Editor (arba Heading) + 2× Image su „XStore Parallax“ (Advanced > `scroll_effects`) | Skirtingo greičio nuotraukos: savaime. Žodžių ryškėjimas slenkant: papildomai (`home.js`). XStore „Animated Headline“ to nedaro: jis keičia žodžius arba apibrėžia vieną žodį figūra. |
| Tamsi scena: interaktyvi schema | Elementor Container (tamsus fonas) + HTML valdiklis su `assets/js/field.js` | Visa schema (piešimas, vilkimas, rodyklių klavišai, vietų mygtukai, būsenos tekstas) yra vienas failas be GSAP. Atsarginis variantas be scenarijaus: XStore „Image Comparison“ su dviem paveikslėliais. |
| Tamsi scena: išmatuoti skaičiai | Heading arba HTML valdikliai su demo skaitikliu (`core.js`) | Elementor „Counter“ netinka: rašo „0.5“ vietoje „0,5“ ir pavadinimą deda po skaičiumi. Doto šriftui reikia CSS (`font-variation-settings`). |
| Panaudojimo kortelės | 3× Elementor Container (Image + Heading + Text Editor + nuoroda į prekę) | Krovimasis viena ant kitos: papildomai (CSS `position:sticky` ir `home.js`), savo valdiklio XStore neturi. XStore „Banner“ netinka: tekstą deda ant nuotraukos, o mygtukas nėra tikra nuoroda. |
| Video juosta | Elementor Container, fonas „Video“ (failas savo serveryje) + Heading + Text Editor + XStore „Text Button“ | Savaime: foninis vaizdo įrašas, atsarginis paveikslėlis, perdanga. Papildomai: veidrodinis apvertimas, grojimas tik tada, kai juosta matoma, ir tik plakatas, kai judesys išjungtas. |
| Idėjos istorija | XStore „Blockquote“ (`etheme_blockquote`) + Heading + Text Editor + Image su prierašu ir „XStore Parallax“ | Antraštės žodžių iškilimas ir nuotraukos atidengimas: bendras scenarijus (`core.js`). |
| Patarimai | Elementor „Accordion“ (telefone) arba Text Editor sąrašas + Image stulpelis | Papildomai: nuotraukos keitimas užvedus ir punktų numeriai. XStore „Toggle Text“ yra kitas valdiklis („rodyti daugiau“). |
| Kontaktų forma | XStore „Contact Form 7“ valdiklis (`et-contact-form-7`) arba Elementor forma (PRO Elements) + XStore „Icon List“ | Formos įskiepyje atkurti 180 ženklų ribą su skaitikliu, lietuviškus klaidų tekstus, sutikimo langelį ir sėkmės pranešimą. Demo tikrinimo kodas neperkeliamas. |
| Poraštė | Footer Builder (Elementor): „Site Logo“, Text Editor, „Menu List“ (`et_menu_list`), XStore „Icon List“, „Follow“ | Nuoroda „Krepšelis“ demo atidaro šoninį langą; temoje ją nukreipti į krepšelio puslapį. |
| Krepšelio šoninis langas | Header Builder „Cart“ valdiklis, off-canvas, `automatically_open_canvas` | Demo krepšelis yra maketas (naršyklės atmintis) ir neperkeliamas. XStore langas rodo WooCommerce mini krepšelį. Demo papildymams (eilutė „Pristatymas Lietuvoje: nemokamas“, vienas mygtukas „Apmokėti“ su suma, pastaba apie mokėjimą, tuščio krepšelio vaizdas) reikia mini krepšelio kabliukų (hooks) ir CSS. |
| Mobilus meniu | Header Builder „Mobile Menu“ valdiklis (off-canvas) | Demo išvaizda (juodas skydelis per visą ekraną, didelės nuorodos, kontaktai apačioje): valdiklio stiliaus nustatymai ir CSS. |
| Vaizdo įrašo langas | XStore „Modal Popup“ (`etheme_modal_popup`) su Elementor „Video“ valdikliu (įjungti „Privacy Mode“) arba „Video“ valdiklio „Lightbox“ | Valdiklio „Video popup“ nėra. Demo įrašą atidaro matavimo bloko mygtukas ir prekės galerijos miniatiūra. |

### Prekės puslapis (Single Product Builder)

| Demo blokas | XStore / Elementor atitikmuo | Pastabos |
|---|---|---|
| Kelias | „Breadcrumb“ (`woocommerce-etheme_breadcrumb`) | Demo „Parduotuvė“ veda į pradžios puslapio prekių sekciją; WooCommerce ves į parduotuvės arba kategorijos puslapį. |
| Galerija | „Product Images“ (`woocommerce-product-etheme_product_images`): miniatiūros apačioje, zoom, lightbox, „Product with video“ | Savaime: miniatiūros, priartinimas, peržiūros langas, varianto nuotrauka, vaizdo įrašas galerijoje. Papildomai: oranžinės bangos už prekės (slenka kitu greičiu), tamsus fonas baltam skydui, spalvos parinkimas paspaudus miniatiūrą, prekės priartėjimas pakeitus spalvą, galerijos aukščio riba, kad miniatiūros tilptų į pirmą ekraną. |
| Pavadinimas, kaina, trumpas aprašymas | „Title“, „Price“, „Short Description“ | „su PVM“: WooCommerce nustatymas „Price display suffix“. Eilutei po pavadinimu („Namų „Wi-Fi“ maršrutizatoriui“) valdiklio nėra: papildomas laukas arba pirma trumpo aprašymo eilutė. Lipnus stulpelis: XStore „Sticky Content“. Pavadinimo ir pirkimo bloko iškilimas įkeliant puslapį: child theme CSS. |
| Spalva, kiekis, „Į krepšelį“ | „Add to Cart“ (`woocommerce-product-etheme_add_to_cart`) + XStore „Variation swatches“ | Savaime: spalvų žymekliai, kiekis, plataus mygtuko variantas, krepšelio langas po įdėjimo. Demo žymeklis (rėmelis su tašku ir pavadinimu, eilutė „Spalva: juoda“): CSS ir kelios JS eilutės, arba priimti standartinį XStore tašką su užuomina. |
| Pristatymas, grąžinimas, atsiskaitymas | XStore „Icon List“ (`etheme_icon_list`) | Sales Booster „Safe & Secure Checkout“ čia netinka: jis rodo tik mokėjimo logotipus. |
| Tamsi scena „Kaip pastatyti“ / „Kaip naudoti“ | Elementor Container produkto šablone + Text Editor (žingsniai) + HTML valdiklis (`field.js`) + skaičiai | Žingsniai ir schemos vietos skiriasi pagal prekę, todėl reikia dviejų šablonų su „Display Conditions“ arba prekės laukų. |
| Informacijos skiltys | „Tabs“ (`woocommerce-product-etheme_tabs`), tipas „accordion“ visuose ekranuose | Papildomi skirtukai „Pristatymas ir grąžinimas“ ir „Dažni klausimai“, WooCommerce atsiliepimų skirtukas. Vienas DUK atsakymas skiriasi pagal prekę. Kairėje: Heading + XStore „Icon List“. |
| Blokas su antru skydu („Telefonui turime atskirą skydą“) | Atskiras blokas su dviem XStore „Add To Cart“ valdikliais | Temos „Bought Together“ veikia tik paprastoms prekėms, o skydai turi spalvos variantus (žr. rizikas). |
| Lipni pirkimo juosta | „Sticky Cart“ (`woocommerce-product-etheme_sticky_cart`) | Pakeičia demo juostą. Demo papildomai rodo pasirinktą spalvą ir pasislepia prie poraštės. |

### Bendri dalykai

| Kas | Kaip temoje | Pastabos |
|---|---|---|
| Judesys (paralaksas, antraščių žodžiai, nuotraukų atidengimas, mygtukų banga, pakreipimas) | Paprastiems atvejams „XStore Parallax“ (Advanced: `scroll_effects`, `floating_effects`, `3d_hover_effects`) arba „Motion Effects“ (PRO Elements); visa kita yra vienas child theme scenarijus su GSAP ScrollTrigger | Scenarijai elementus randa pagal `data-*` atributus. Elementor juos deda tik ant valdiklio apvalkalo (tai Pro funkcija), todėl parinkiklius reikia nukreipti į vidinę žymą. |
| Šriftai | Child theme `@font-face` ir CSS klasės | XStore „Custom Fonts“ leidžia tik įkelti šriftą ir priskirti jį tekstui bei antraštėms. Mona Sans pločio ašies ir tarpinių storių ten nustatyti negalima. |
| SVG rinkinys (ikonos ir Gyvybės gėlė) | Įterpti iškart po `<body>` (child theme `wp_body_open`) | Rinkinį sugeneruoja `build.py`; be jo neveikia nei ikonos, nei rozetės. |

### Rizikos, kurias reikia žinoti prieš perkeliant

1. **`position:sticky` XStore apvalkale neveikia.** Tema visą puslapį apgaubia `.template-container{position:relative;overflow:hidden}`. Demo sticky naudoja antraštei, panaudojimo kortelėms, patarimų nuotraukai ir dviem prekės puslapio stulpeliams. Patikrinta vietoje: apgaubus demo tokiu elementu kortelės nebelimpa, o su `overflow:clip` vėl limpa. Child theme reikia `.template-container{overflow:clip}` (po to pertikrinti šoninius langus) arba XStore „Sticky Content“ ten, kur jo pakanka.
2. **„Bought Together“ ir variantai.** Ši parinktis rodoma tik paprastoms (simple) ir išorinėms prekėms. Abu skydai turi spalvos variantus, todėl blokas su antru skydu turi būti atskiras. Kitas kelias: kiekviena spalva kaip paprasta prekė, sujungta per „Linked Variations“, bet tada kitaip veikia žymekliai ir kortelės.
3. **Permatomos prekių nuotraukos.** Visos aštuonios prekių nuotraukos yra WebP su permatomu fonu, o demo foną parenka pagal spalvą šešiose vietose (plytelė, galerija, miniatiūros, krepšelis, lipni juosta, peržiūros langas). XStore tokios taisyklės neturi, todėl baltas skydas baltame fone dingtų. Paprasčiau fonus „įkepti“ į variantų nuotraukas (tamsus baltam skydui, šviesiai pilkas juodam).
4. **Demo krepšelis neperkeliamas.** Jis pašalinamas, o demo papildymai atkuriami WooCommerce mini krepšelyje. Poraštės nuoroda „Krepšelis“ netenka savo veiksmo.
5. **Dvi juostos ekrano apačioje.** Naudoti tik XStore „Sticky Cart“, o demo juostą pašalinti. Su variantų preke XStore virš juostos rodo savo variantų formą; gyvai tai nepatikrinta. XStore „Mobile Panel“ naudoja tą patį ekrano kraštą: išjungti arba slėpti prekės puslapyje.
6. **Skaičiai su kableliu.** Elementor „Counter“ parašys „0.5“. Palikti demo skaitiklį.
7. **Scenarijų prijungimas.** Judesio kodui reikia: scenarijaus `<head>` dalyje, kuris nustato `js` ir `is-static` klases; SVG rinkinio; GSAP ir ScrollTrigger; `data-*` atributų. XStore nuotraukas įkelia atidėtai, todėl hero nuotrauką reikia išimti iš lazy-load, o ScrollTrigger atnaujinti po nuotraukų įkėlimo.
8. **Šriftų pločio ašis.** Demo naudoja išplėstą Mona Sans plotį ir tarpinius storius (pvz., 560, 620, 660) iš vieno kintamo failo. Temos nustatymuose to nėra: planuoti tipografiją per child theme CSS. Elementor kintamų šriftų įkėlimas prašo TTF, o projekte yra tik WOFF2.

XStore patikroje liko nepatvirtinta: kaip „Sticky Cart“ atrodo su variantų preke, kaip tiksliai vadinasi „Product Grid“ nustatymas, įjungiantis spalvų žymeklius, ar PRO Elements turi „Custom Attributes“ ir kintamų šriftų įkėlimą, ar Contact Form 7 turi ženklų skaitiklį.

## Ką reikia patvirtinti su klientu

1. **Sveikatos teiginiai.** Ar tinka komunikacija be teiginių apie ligas, žalą ir naudą sveikatai? Jei klientas nori juos grąžinti, reikia įrodymų, kuriais galima remtis reklamoje.
2. **Sakiniai, kurie vis dar liečia savijautą.** Jie palikti kaip kliento žodžiai: kūrėjo citata „Pajutau aiškius savijautos ir nuovargio skirtumus.“, idėjos istorijos pastraipa („jaučiuosi kitaip…“, „stebėti savijautą veikiančius veiksnius“, nuoroda į „mokslinius straipsnius“), patarimai („Laikykite telefoną atokiau nuo kūno“, „nelaikykite po pagalve ar prie širdies“, „Kol miegame, organizmas ilsisi“), patarimų antraštė „Kaip sumažinti bangų poveikį jau dabar“, posakis „ramesnė zona“ ir vaikams skirti akcentai (kortelė „Vaikų kambariui“ su miegančio kūdikio nuotrauka, „ten, kur būnate jūs ir jūsų vaikai“). Patvirtinti arba perrašyti.
3. **Matavimas.** Skaičiai 6 V/m ir 0,5 V/m yra iš 2019 m. bandymo su telefono skydu. Reikia matavimo sąlygų (prietaisas, atstumas, kas matavo) ir, jei yra, atskiro matavimo su maršrutizatoriumi. Ar galima rašyti „12 kartų“ ir „kelis kartus“ kalbant apie WIFI skydą?
4. **Kaip naudojami skydai.** WIFI skydo aprašyme parašyta „įstačius maršrutizatoriaus antenas į šį skydą“, o kliento nuotraukoje dėžutė stovi šalia maršrutizatoriaus; demo mini abu būdus. Telefono skydo žingsniai („Telefoną padėkite ant skydo pagrindo“, „sienelę pasukite į save“) surašyti pagal prekės nuotrauką, nes kliento tekstuose yra tik „padėjus telefoną už šio skydo“. Reikia tikslios instrukcijos abiem skydams ir atsakymo, ar WIFI skydas tinka maršrutizatoriams be išorinių antenų.
5. **Pavadinimų rašyba.** Šaltiniuose yra „WIFI Skydas“, „Wifi skydas“, „EFshield“, „EFShield“, „EF Shield“. Demo: „WIFI skydas“, „Telefono skydas“, „EFshield“.
6. **Kainos ir variantai.** 30,00 € ir 25,00 € paimtos iš 2025–2026 m. svetainės. Ar spalva kainos nekeičia? Ar yra kitų variantų?
7. **Trūkstami prekių duomenys:** matmenys, svoris, medžiagos, komplektacija, garantija, gamybos vieta, kokio dydžio maršrutizatoriams tinka WIFI skydas. Demo jų nerodo, nes šaltiniuose jų nėra.
8. **Kortelė „Vaikų kambariui“.** Klientas rašo, kad skydu galima uždengti ir mobiliąją auklę. Demo šalia rodo telefono skydą: tai spėjimas, reikia patvirtinti.
9. **Pristatymas.** „Nemokamas pristatymas visoje Lietuvoje“: ar vis dar galioja, kokiais būdais (kurjeris, paštomatai), per kiek laiko, ar siunčiama į užsienį.
10. **Grąžinimas.** Taisyklėse parašyta „per 14 darbo dienų“. Patvirtinti ir atnaujinti visą taisyklių tekstą.
11. **Mokėjimai.** Demo visur rašo „el. bankininkystė per „Paysera“ arba banko pavedimas“. Tai sujungta iš dviejų šaltinių: senojoje svetainėje buvo „Paysera“ logotipas, o taisyklėse parašyta „el. bankininkystė arba banko pavedimas“. Patvirtinti.
12. **Kūrėjas.** Demo rodo tik vardą „Edgaras“, nes pavardė šaltiniuose nesutampa (svetainėje viena, „Facebook“ kita). Reikia pavardės, nuotraukos ir sutikimo dėl citatos.
13. **Prekių nuotraukos.** Jos paimtos iš „Facebook“ (2019 m.) ir iškirptos iš balto fono; baltų skydų kontūrai dėl to nelygūs. Reikia originalų didesne raiška (geriausia neutraliame fone) ir patvirtinimo, kad gaminio išvaizda nepasikeitė.
14. **Renginio nuotrauka** (festivalis „Būtent!“, Birštonas, 2019 m.): joje matyti žmonės. Ar galima ją naudoti?
15. **Atsiliepimai.** Svetainėje jų nėra. „Facebook“ yra viena apžvalga (neigiama, vieno žodžio) ir vienas teigiamas pirkėjo komentaras. Komentarą naudoti tik su autoriaus sutikimu, o „Facebook“ apžvalgų valdiklio nejungti.
16. **Vaizdo įrašai.** Rodomas tik bandymo įrašas (jo pavadinimas „YouTube“ angliškas). Ar klientas turi arba planuoja naują pristatymo įrašą be sveikatos teiginių?
17. **Įmonės rekvizitai** poraštei ir taisyklėms: demo jų nėra.
18. **Domenas.** efshield.com šiuo metu užparkuotas, HTTPS neveikia.

## Kas nepatikrinta

- Tikrinta „Chrome“ naršyklėje (kompiuterio, planšetės ir telefono pločiai, klaviatūra, režimai be judesio ir be „JavaScript“). „Safari“ naršyklėje ir tikrame telefone netikrinta.
- Greitaveika nematuota.
- Logotipas yra PNG iš archyvuotos svetainės; vektorinio failo reikia iš kliento.
- Nuolat judantiems elementams (hero bangos, faktų juosta, foninis vaizdo įrašas, schemos bangos, bangų žiedai prekės galerijoje) nėra pauzės mygtuko. Judesys išsijungia per sistemos nustatymą „mažiau judesio“ arba `?static=1`.

## Medija ir šaltiniai

- Tekstai, kainos, taisyklės: https://www.facebook.com/efshield ir archyvuotos efshield.com versijos (web.archive.org, 2020–2026 m.).
- Kliento nuotraukos (`assets/img/products/`, `assets/img/client/`, `assets/img/brand/`): EFshield „Facebook“ puslapio nuotraukos; logotipas iš archyvuotos svetainės.
- Vaizdo įrašas: EFshield „YouTube“ kanalas, `EJobhXMt3JU` (bandymas su telefono skydu). Atidaromas lange per youtube-nocookie.com.
- Pexels (`assets/img/scenes/`, `assets/video/`), licencija leidžia naudoti nemokamai:

| Failas | Kur naudojama | Autorius | Pexels ID |
|---|---|---|---|
| `meditacija.webp` | kortelė „Poilsiui“ | Vlada Karpovich | 6802948 |
| `seima.webp` | kortelė „Namams“ | Mikhail Nilov | 6957830 |
| `kudikis.webp` | kortelė „Vaikų kambariui“ | kaboompics.com | 4964214 |
| `ausines-skambutis.webp` | 1 patarimas | George Milton | 6954219 |
| `krovimas-stalas.webp` | 2 patarimas | Julio Lopez | 18780712 |
| `marsrutizatorius.webp` | 3 patarimas | Pascal | 32698507 |
| `stalas-virsus.webp` | 4 patarimas | Darina Belonogova | 8004014 |
| `miegas-spintele.webp` | telefono skydo galerija | Miriam Alonso | 7622514 |
| `miegas.mp4` (apverstas veidrodiškai) | video juosta | Kampus Production | 5983686 |

- Šriftai: Mona Sans ir Doto (SIL OFL, licencijos `assets/fonts/`). Ikonos: Phosphor (MIT, `src/icons/`). Judesys: GSAP 3 ir ScrollTrigger (`assets/js/vendor/`, standartinė nemokama licencija).

## Struktūra ir redagavimas

```
src/data/site.json      visas turinys: kontaktai, prekės, panaudojimo vietos, patarimai, DUK
src/templates/          base.html, index.html, preke.html ir bendros dalys (partials/)
src/icons/              Phosphor ikonos, iš kurių surenkamas įterptas SVG rinkinys
assets/css/             base.css (sistema ir tamsi scena), home.css, pdp.css
assets/js/              core.js (krepšelis, meniu, langai, paralaksas), home.js, pdp.js, field.js (interaktyvi schema)
assets/img/             products/ (iškirptos prekės), client/ (kliento nuotraukos), scenes/ (Pexels), brand/ (logotipas)
build.py                surenka šakninius *.html (reikia Python 3 ir jinja2)
serve.py                vietinis peržiūros serveris
```

Redaguojami tik failai `src/` ir `assets/` kataloguose. Pakeitus šablonus ar `site.json`:

```bash
python3 build.py
```
