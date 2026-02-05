# AURKIBIDEA

1. [SARRERA](#sarrera)
2. [HELBURUAK](#helburuak)
   - 2.1 [HELBURU OROKORRA](#helburu-orokorra)
   - 2.2 [HELBURU ESPEZIFIKOAK](#helburu-espezifikoak)
3. [ZEREGINAK ETA KRONOGRAMA](#zereginak-eta-kronograma)
4. [BALIABIDEAK](#baliabideak)
   - 4.1 [BALIABIDE MATERIALAK](#baliabide-materialak)
   - 4.2 [GIZA BALIABIDEAK](#giza-baliabideak)
5. [INSTALAZIO PROZESUA](#instalazio-prozesua)
6. [CREATIVE COMMONS LIZENTZIA](#creative-commons-lizentzia)
7. [IZANDAKO ARAZOAK, ETA AURRERA EGITEKO MODUA](#izandako-arazoak-eta-aurrera-egiteko-modua)
8. [ONDORIOAK](#ondorioak)
   - 8.1 [ZER IKASI DUGU?](#zer-ikasi-dugu)
   - 8.2 [DENBORA](#denbora)
   - 8.3 [TALDE-LANA](#talde-lana)
   - 8.4 [ETORKIZUNEKO ALDAKETAK](#etorkizuneko-aldaketak)
9. [BIBLIOGRAFIA](#bibliografia)
10. [ERANSKINAK](#eranskinak)

---

## SARRERA

Proiektu honek ikasleen artean antzemandako behar zehatz bati erantzun dio: pisu partekatuetan bizi direnen eguneroko kudeaketa erraztea eta optimizatzea. Izan ere, ikasle askok zailtasunak zituzten etxeko zereginak modu eraginkorrean banatzeko, gastuak modu gardenean kontrolatzeko eta etxebizitzaren funtzionamendu orokorra koordinatzeko. Lehen, informazio hori kanal desberdinetan sakabanatuta egoten zen (WhatsApp, Excel, paperezko fakturak…), eta horrek koordinazio falta eta desadostasunak eragiten zituen.

Egoera horri irtenbidea emateko, pisu partekatu baten kudeaketa integrala ahalbidetzen duen plataforma bateratua garatu dugu. Plataformak web aplikazio intuitibo eta erabilerraz baten bidez jarduten du, eta horri esker, erabiltzaileek modu erraz eta azkarrean kudeatzen dituzte zereginak, gastuak eta ordainketak. Era berean, erosketak planifikatzeko eta taldeko komunikazioa antolatzeko tresnak integratu dira, etxebizitzaren koordinazioa modu argian gauzatuz.

Emaitza gisa, ikasleek denbora gehiago dute orain ikasketetan arreta jartzeko, kudeaketa mekanikoak automatizatu baitira. Informazioa zentralizatuta egoteak gastuen eta zereginen jarraipen automatikoa ahalbidetu du, gatazkak murriztuz eta erantzukizunak argituz. Horrela, plataforma ez da soilik tresna teknikoa izan, baizik eta antolaketa eta lankidetza hobetzeko konponbide integral bihurtu da, eguneroko bizitza sinplifikatuz eta taldeko harmonia sustatuz.

---

## HELBURUAK

### HELBURU OROKORRA

Proiektu honen helburu nagusia pisukideen arteko gastu-kudeaketa eta elkarbizitza erraztuko duen webgune eskalagarri eta irisgarri bat diseinatzea, garatzea eta ekoizpen-ingurunean hedatzea da.

Helburu hori lortzeko, arkitektura teknologiko aurreratu eta modular bat inplementatu da, hiru zutarri nagusitan oinarrituta: erabiltzailearen esperientzia (React bidezko interfaze moderno eta inklusibo batekin), kudeaketa-logika sendoa (Laravel eta Odoo konbinatuz prozesuak automatizatzeko) eta azpiegitura profesionala (Docker eta AWS Elastic Beanstalk erabiliz hedapen segurua bermatzeko). Azken finean, soluzio tekniko honek gastuen kontrola automatizatu nahi du, gardentasuna, segurtasuna eta irisgarritasuna bermatuz, guztia dokumentazio zehatz batekin.

### HELBURU ESPEZIFIKOAK

Helburu orokorra lortzeko, honako helburu tekniko eta funtzional hauek bete dira:

**Plangintza eta Diseinua Zehaztea** Kodea idazten hasi aurretik, proiektuaren oinarriak finkatzea izan da lehen helburua. Alde batetik, lan-karga eta denborak kontrolatzeko Gantt diagrama bat diseinatzea eta jarraitzea ezarri da. Bestetik, alderdi bisuala eta funtzionala argitzea: webgunearen bozetoak eta nabigazio-mapa marraztea, estilo-gida propio bat definitzea eta, horretan oinarrituta, prototipo funtzional bat sortzea. Era berean, erabiltzaile bakoitzak izango dituen aukerak argitzeko, erabilera-kasuen diagramak zehaztea bilatu da.

**Ingurunea Prestatzea eta konfigurazioa** lan-ingurune profesional bat eraikitzea izan da bigarren helburua. Horretarako, GitHub bidez bertsioen kontrol zorrotza eramatea eta proiektuaren lizentzia mota zehaztea erabaki da. Maila teknikoan, garapen-ingurunea estandarizatzeko Docker-en erabilera menperatzea izan da xedea, edukiontzien bidez Laravel eta Odooren arteko komunikazio eraginkorra lortuz.

**Garapen Teknikoari** dagokionez, helburua sistema osoa garatzea izan da. Backend-ean, datu-basea egituratzea (taulak eta seederrak sortuz) eta logika inplementatzea (modeloak eta controlerrak sortuz). Frontend-ean, erabiltzailearen interfazea osatuko duten bistak (Views) garatzea. Bi mundu hauen arteko konexioa bermatzeko, APIen funtzionamendua ulertzea eta datuen trukaketa (JSON eta XML formatuetan) zuzen kudeatzea ezarri da funtsezko helburutzat.

Helburu nagusietako bat **plataforma guztiz inklusibo eta erabilerraza** garatzea izan da. Alde batetik, irisgarritasun unibertsala bermatu nahi izan da W3C-ren WCAG 2.1 jarraibideak (AA maila) aplikatuz, webgunea gaitasun fisiko edo kognitibo ezberdinak dituzten pertsonentzat eskuragarri egon dadin. Bestetik, erabiltzailearen esperientzia (UX) optimizatzea bilatu da, edozein gailutara egokitzen den diseinu moldagarria (Responsive) eta interfaze minimalista baten bidez, nabigazioa intuitiboa eta ikasketa-kurba txikikoa izan dadin.

Era berean, webgunearen errendimendua eta ikusgarritasuna maximizatzea ezarri da helburutzat. Horretarako, posizionamendu organikoa (SEO) lantzea erabaki da hitz gakoen eta meta-etiketen bidez, trafikoa modu naturalean erakartzeko. Azkenik, multimedia-baliabideen kudeaketa efizientea lehenetsi da, irudiak eta grafikoak formatu optimizatuetan eta lizentzia legalak errespetatuz integratuz, sistemaren abiadura eta lege-betetzea bermatzeko.

Proiektuaren alderdi teknikoa definitzerakoan, helburu nagusia sistema sendo baina aldi berean erabilerraz bat lortzea izan da. Hasteko, erabiltzaileak ikusten duen zatia (interfazea) React bidez garatu dugu; horrela, webgunea modernoa izatea eta nabigazioa intuitiboa izatea lortu nahi izan dugu, inor ez dadin galdu erabiltzerakoan.

**React** JavaScript-en oinarritutako liburutegi ezagun bat da, erabiltzailearen interfazea eraikitzeko erabiltzen dena. Gure kasuan, pantailan ikusten den guztiaren eta interaktibitatearen arduraduna da. Bere abantaila nagusia da webgunea oso dinamikoa bihurtzen duela: orrialdea behin eta berriz kargatu beharrik gabe, edukiak berehala aldatzen dira, mugikorretako aplikazio baten antzeko sentsazio arina emanez.

Diseinu horren atzean dagoen "burmuina" edo logika kudeatzeko, **Laravel** framework-a aukeratu dugu. Bera arduratzen da datuak seguru gordetzeaz eta webgunearen funtzionamendua arina izateaz.

Laravel PHP lengoaian oinarritutako tresna (framework) oso indartsu bat da. Gure proiektuan, API bezala funtzionatzen du; hau da, frontend-aren eta datuen arteko zubi-lana egiten du. Bere ardura da eskaerak jasotzea, segurtasuna egiaztatzea eta informazioa behar bezala banatzea, dena modu ordenatu eta seguruan kudeatuz.

Azpiegiturari dagokionez, **Docker** eta **AWS** izan dira gure oinarriak. Dockerrek gure aplikazioa 'edukiontzi' batzuetan biltzeko balio digu, funtzionatzeko behar duen guztia (kodea, liburutegiak...) pakete batean sartuz; horrela, gure ordenagailuan garatutakoak Internetera igotzean berdin-berdin funtzionatuko duela ziurtatzen dugu.

Bestalde, edukiontzi horiek exekutatzeko eta ostatatzeko, **AWS (Amazon Web Services)** aukeratu dugu. Zehazki, Elastic Beanstalk zerbitzua erabili dugu hedapenerako. Tresna honek azpiegituraren kudeaketa guztiz automatizatzen du: guk Docker edukiontzia igo besterik ez dugu egin behar, eta Elastic Beanstalk bera arduratzen da zerbitzariak hornitzeaz, konfiguratzeaz eta eskalatzeaz. Horri esker, gure webgunea mundu osoan eskuragarri eta seguru egotea bermatzen dugu, sistemen administrazio konplexuan denbora galdu gabe.

Honek aukera ematen digu webgunea beti eskuragarri edukitzeko eta, etorkizunean jende gehiagok erabiliko balu, arazorik gabe handitzeko. Azkenik, argi genuen hasieratik sistema hau irisgarria izan behar zela; hau da, edonork erabiltzeko modukoa, bakoitzaren gaitasunak edozein direla ere.

Azkenik, egindako lan guztia dokumentatzea izan dugu helburu, pauso bakoitza erregistratuz, eta prozesua amaitzeko, egindako lana eta lortutako emaitzak bezeroari modu profesionalean aurkeztea.

---

## ZEREGINAK ETA KRONOGRAMA

---

## BALIABIDEAK

### BALIABIDE MATERIALAK

Proiektu hau aurrera ateratzeko, oinarri-oinarrizko baliabideetatik hasi gara lanean. Hardwareari dagokionez, Windows 11 SE sistema eragilea duten ordenagailuak erabili ditugu, baina lan-fluxua askoz erosoagoa eta azkarragoa izateko, monitore eta sagu gehigarriak konektatu dizkiegu; horri esker, pantaila batean kodea idatzi eta bestean emaitza ikusi ahal izan dugu. Excalidraw eta Figma diseinu-tresnak erabili ditugu webgunearen itxura, bozetoak eta prototipoak marrazteko; horrela, kodea idazten hasi orduko, bagenekien zehazki nola geratu behar zen dena.

Behin diseinua argi izanda, garapen teknikoa Visual Studio Code editorea erabiliz egin dugu. Bertan lengoaia ezberdin asko uztartu ditugu: webgunearen logika egiteko PHP eta datuak kudeatzeko SQLite; eta erabiltzaileak ikusten duena (botoiak, koloreak, animazioak) sortzeko, JavaScript, HTML, CSS eta TypeScript. Gainera, zerbitzarietan instalazioak eta konfigurazioak egiteko Bash komando-lerroak erabili ditugu.

Hau guztia ez dugu hutsetik egin; tresna indartsuetan oinarritu gara. Alde batetik, Laravel framework-a erabili dugu backend-ean eta React liburutegia erabili dugu frontend-ean. Proiektuaren zati garrantzitsu bat Odoo ERPa izan da; horren barruan gure modulu propioak sortzeko Python erabili dugu, eta datu guztiak gordetzeko PostgreSQL datu-basea baliatu dugu.

Lan hau taldean egitea erronka bat da, eta hori kudeatzeko GitHub erabili dugu. Honi esker, taldekide bakoitzak egindako aldaketak hodeian gordetzen dira eta bertsioen kontrola eramaten dugu. GitHubekin komunikatzeko, GitBash kontsola erabili dugu eta dokumentazioa txukun idazteko Markdown formatua erabili dugu.

Azkenik, sistema guztiak bateratzeko eta Interneten jartzeko, teknologia aurreratuak erabili ditugu. Docker oso garrantzitsua izan da: gure aplikazioa "edukiontzi" batean sartzeko balio du, gure ordenagailuan bezala funtziona dezan edozein lekutan. Edukiontzi horren barruan, Laravel eta Odoo elkarrekin komunikatzen dira API bidez, datuak JSON edo XML formatuan trukatuz. Bukatzeko, guztia munduarentzat eskuragarri jartzeko, AWS (Amazon Web Services) erabili dugu. Zehazki, Elastic Beanstalk zerbitzua aukeratu dugu; honek, gure Docker edukiontzia hartu eta automatikoki prestatzen ditu zerbitzariak, guk azpiegituraren kudeaketa konplexuaz arduratu beharrik gabe.

### GIZA BALIABIDEAK

Proiektu honetan 3 pertsona ibili gara lanean, Martzel Galdaera, Eleder Uribelarrea eta Josune Jimenez. Elederrek hartu du kordinatzaile rola.

---

## INSTALAZIO PROZESUA

Proiektuarekin lanean hasteko, ezinbestekoa da gure ekipoetan (Windows 11) oinarrizko softwarea eta garapen-tresnak behar bezala konfiguratzea. Jarraian, ingurunea prestatzeko eman beharreko pausoak zehazten dira, bertsio bateragarriak eta exekutatu beharreko komandoak barne.

### 1. Aurrebaldintzak

Instalazioekin hasi aurretik, ziurtatu behar dugu gure inguruneak gutxieneko bertsio hauek betetzen dituela:

- **PHP**: 8.2 bertsioa edo berriagoa.
- **Composer**: 2.0 bertsioa gutxienez.
- **Node.js**: 18.x bertsioa (LTS).
- **Kudeatzaileak**: NPM (gomendatua) edo Yarn.
- **Datu-basea**: SQLite (garapen lokalorako) eta Docker (Odoo zerbitzariarentzat).

### 2. Instalazio Prozesua Pausoz Pauso

#### A) PHP Lengoaia (Backend)

Lehenik eta behin, PHP instalatuta dugun egiaztatu behar dugu. C: diskoan php8.2 (edo berriagoa) karpeta baduzu, hurrengo pausora pasa zaitezke. Bertsio zaharragoak badituzu (adibidez, php5.4), ezabatu karpeta horiek gatazkak saihesteko.

Instalatu gabe baduzu, ireki PowerShell eta exekutatu komando hauek:
```powershell
# 1. Deskargatu eta deskonprimitu
Invoke-WebRequest -Uri "https://windows.php.net/downloads/releases/archives/php-8.2-Win32-vs16-x64.zip" -OutFile "$env:USERPROFILE\Downloads\php82.zip"
New-Item -ItemType Directory -Path "C:\php82" -Force
Expand-Archive -Path "$env:USERPROFILE\Downloads\php82.zip" -DestinationPath "C:\php82"

# 2. Gehitu sistemaren aldagaietara (PATH)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\php82", [EnvironmentVariableTarget]::Machine)
```

Ondoren, egiaztatu `php -v` idatziz. Bertsio zuzena bada, Laravelerako luzapenak aktibatu behar dira. Horretarako, `C:\php82\php.ini` fitxategia editatu (Block de notas erabiliz) eta puntu-koma (`;`) kendu lerro hauen hasieratik: curl, mbstring, bcmath, xml, mysqli, openssl, pdo_mysql, fileinfo.

#### B) Composer (Dependentzia Kudeatzailea)

Laravel proiektuaren liburutegiak kudeatzeko ezinbestekoa da. Instalatzeko:
```powershell
Invoke-WebRequest -Uri "https://getcomposer.org/installer" -OutFile "$env:USERPROFILE\Downloads\composer-setup.php"
php "$env:USERPROFILE\Downloads\composer-setup.php" --install-dir=C:\php82 --filename=composer
```

Ziurtatu ondo dagoela `composer -V` komandoarekin.

#### C) Node.js eta NPM (Frontend)

React-ek eta interfazearen konpilazioak JavaScript ingurune hau behar dute.
```powershell
# Node.js deskargatu eta instalatu
Invoke-WebRequest -Uri "https://nodejs.org/dist/latest-lts/win-x64/node.exe" -OutFile "C:\nodejs\node.exe"
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\nodejs", [EnvironmentVariableTarget]::Machine)

# NPM instalatu
Invoke-WebRequest -Uri "https://registry.npmjs.org/npm/-/npm-10.8.2.tgz" -OutFile "$env:USERPROFILE\Downloads\npm.tgz"
tar -xzf "$env:USERPROFILE\Downloads\npm.tgz" -C "C:\nodejs"
```

Egiaztatu `node -v` eta `npm -v` komandoekin.

#### D) Docker (Odoo eta Zerbitzuak)

Hau da zatirik garrantzitsuena ERP sistemarekin konektatzeko. Odoo ez dugu zuzenean Windowsen instalatzen, edukiontzi batean baizik.
```powershell
winget install -e --id Docker.DockerDesktop
```

**Oharra**: Instalazioaren ondoren ordenagailua berrabiarazi beharko duzu.

#### E) Garapen Tresnak (Git, VSCode eta SQLite)

Kodea editatzeko eta bertsioak kudeatzeko:
```powershell
# VSCode eta Git instalatzeko
winget install --id Microsoft.VisualStudioCode -e --source winget
winget install --id Git.Git -e --source winget

# SQLite (aukerakoa, baina gomendagarria proba lokaletarako)
Invoke-WebRequest -Uri "https://www.sqlite.org/2025/sqlite-tools-win32-x86-3420000.zip" -OutFile "$env:USERPROFILE\Downloads\sqlite.zip"
New-Item -ItemType Directory -Force -Path "C:\sqlite"
Expand-Archive -Path "$env:USERPROFILE\Downloads\sqlite.zip" -DestinationPath "C:\sqlite"
```

### 3. Proiektua martxan jartzea

Tresnak instalatuta edukitzeak ez du esan nahi proiektua prest dagoenik. GitHubetik kodea jaitsi ondoren, ezinbestekoa da pauso hauek jarraitzea aplikazioak funtziona dezan:

**Biltegia klonatu:**
```bash
git clone [GitHub-eko_URL-a]
cd proiektuaren-karpeta
```

**Dependentziak instalatu:** Backend-eko (Laravel) eta Frontend-eko (React) liburutegiak deskargatu behar dira, hauek ez baitira Giten igotzen.
```bash
composer install
npm install
```

**Ingurunea konfiguratu (.env):** Proiektuak `.env.example` fitxategia dakar. Hau kopiatu eta izena aldatu behar diogu `.env` izateko. Bertan gure datu-basearen konexioak eta pasahitzak egokituko ditugu.
```bash
cp .env.example .env
```

**Gakoa sortu eta Datu-basea prestatu:** Laravelen segurtasun gakoa sortu eta taulak sortu behar dira.
```bash
php artisan key:generate
php artisan migrate
```

**Zerbitzariak abiarazi:** Azkenik, garapen ingurunea ikusteko bi terminal zabaldu behar dira:

- **Terminal 1 (Backend)**: `php artisan serve`
- **Terminal 2 (Frontend)**: `npm run dev`

Honekin, proiektua prest egongo da nabigatzailean ikusteko eta garatzen jarraitzeko.

---

## CREATIVE COMMONS LIZENTZIA

<p align="justify">Proiektu hau Creative Commons Aitortu-EzKomertzial-PartekatuBerdin (CC BY-NC-SA 4.0) lizentziapean argitaratzea erabaki dugu.</p>

<p align="justify">Lizentzia mota honek aukera ematen du lan hau kopiatu, banatu eta egokitzeko, betiere egilea aitortzen bada, helburu komertzialik gabe erabiltzen bada eta eratorritako lanak lizentzia beraren pean partekatzen badira.</p>

<p align="justify">Aukera hau justifikatzen da proiektua ikasketa eta ikaskuntza helburuetarako sortu delako. Ez da helburu ekonomikorik bilatzen, baizik eta beste ikasle edo garatzaile batzuek lan hau erreferentzia edo ikasketa-material gisa erabili ahal izatea. Horrez gain, lizentzia honek egiletza babesten du, hau da, proiektuaren edukia edo kodea erabili nahi duen edonork jatorrizko egileei aitortza egin behar die.</p>

<p align="justify">“Partekatu berdin” baldintzak, berriz, bermatzen du beste norbaitek proiektua egokitzen badu edo bere bertsio propioa sortzen badu, hura ere lizentzia beraren azpian banatu beharko duela, lankidetza eta ezagutza irekia sustatuz.</p>

<p align="justify">Laburbilduz, CC BY-NC-SA 4.0 lizentzia hautatu dugu, proiektuaren izaera ez-komertziala, hezitzailea eta kolaboratiboa babesteko, eta aldi berean, gure egiletza eta lanaren jatorrizko balioa aitortzeko.</p>

---

## IZANDAKO ARAZOAK, ETA AURRERA EGITEKO MODUA

Proiektuaren garapenean zehar, hainbat erronka teknikori aurre egin behar izan diegu. Hasieran, ez dugu jakin nola gauzatu Laravel eta Odooren arteko konexioa. Hori dela eta, proiektuaren ikuspegia aldatzea erabaki dugu: bi plataformak zuzenean konektatu beharrean, SQLite erabiltzea lehenetsi dugu, Laravel-i zegokion zatia amaitu ondoren Odoorekin integrazioa egiteko asmoarekin.

Era berean, Odoo-ko modulu bat garatzeko ezagutzarik ez dugu izan arren, jasotako laguntzari eta ikasketa-prozesuari esker, aurrera ateratzea lortu dugu. Azkenik, React-ekin esperientzia handirik ez izateak lana zaildu badigu ere, klaseak jarraituz eta ariketak eginez, teknologia hori behar bezala erabiltzen ikasi dugu.

---

## ONDORIOAK

Proiektu hau amaitzeak ez du soilik web-aplikazio baten garapena suposatu; ibilbide intentsiboa izan da, non teoria praktika bihurtu den. Hilabete hauetako lanaren ondoren, hainbat ondorio atera ditugu lau ardatz nagusitan:

### ZER IKASI DUGU?

Teknologia ezberdinak (React, Laravel eta Odoo) sistema bakar batean integratzen ikasi dugu. Bereziki garrantzitsua izan da Docker eta AWS menperatzea; horiei esker, aplikazioa ingurune lokalean garatzeaz gain, benetako zerbitzari batean hedatzen eta mantentzen ikasi dugu.

### DENBORA

Plangintza bat izan arren, egiaztatu dugu erroreak konpontzeak eta azpiegitura konfiguratzeak kode berria idazteak baino denbora gehiago eskatzen dutela askotan. Garapen-proiektuetan beti aurreikusi behar da marjina handiagoa ezusteko teknikoetarako.

### TALDE-LANA

Talde-lanari dagokionez, esperientzia oso positiboa izan da. Lanak banatzen eta koordinatzen jakin dugu, eta sortu diren arazoak elkarlanean konpondu ditugu. Komunikazioa funtsezkoa izan da, eta prozesu osoan zehar taldekide guztien arteko harremanak eta elkarlanaren dinamika oso onak izan dira. Horrek lan-giro egonkor eta produktiboa sortu du, eta ikasi dugu proiektu bat ez dela soilik norbanakoen lana, baizik eta taldearen arteko koordinazioaren emaitza zuzena.

### ETORKIZUNEKO ALDAKETAK

**Odoo eta Laravel integrazioa:** Hau izan da erronkarik handiena eta ez dugu lortu bi sistemen arteko konexioa guztiz burutzea. Etorkizuneko lehentasun nagusia API bidezko komunikazio hori konpontzea litzateke, webgunean sortutako datuak ERP sisteman automatikoki erregistratuta gera daitezen.

---

## BIBLIOGRAFIA

- Amazon. (s/f). AWS Academy. Awsacademy.com. Recuperado el 2 de diciembre de 2025, de http://awsacademy.instructure.com/
- Bunq. (s/f). Tree count. tricount. Recuperado el 2 de diciembre de 2025, de https://tricount.com/es-es/
- Lane, A. (s/f). Diseño web para daltonicos: Como optimizar tu tienda virtual. Shopify. Recuperado el 3 de diciembre de 2025, de https://www.shopify.com/es/blog/73836037-como-lograr-una-tienda-online-amigable-para-personas-con-problemas-visuales
- Los mejores colores web accesibles para personas con daltonismo. (s/f). Microsiervos. Recuperado el 3 de diciembre de 2025, de https://www.microsiervos.com/archivo/arte-y-diseno/los-mejores-colores-web-accesibles-para-personas-con-daltonismo.html
- Odoo. (s/f-a). Odoo. Odoo.com. Recuperado el 2 de diciembre de 2025, de https://www.odoo.com/documentation/19.0/
- Odoo. (s/f-b). Odoo Administrar modulos. Odoo.com. Recuperado el 2 de diciembre de 2025, https://www.odoo.com/documentation/15.0/es/administration/odoo_sh/getting_started/first_module.html
- Ratliff, S. (2025, abril 9). Docker: Accelerated container application development. Docker. https://www.docker.com/

---

## ERANSKINAK

### Eranskina 1: Talde kontratua

![Talde Kontratua](./images/talde_kontratua.png)

### Eranskina 2: Gantt diagrama

![Gantt Diagrama](./images/gantt_diagrama.png)

### Eranskina 3: Erronkarekin bat egin

![Erronkarekin-bat-egin](./images/erronkarekin_bat_egin.png)

### Eranskina 4: Erabilpen kasu diagrama

![Erabilpen kasu diagrama](./images/erabilpen_kasu_diagrama.png)

### Eranskina 5: Bozetoak

![Bozetoak](./images/bozetoak.png)

### Eranskina 6: Estilo gida

![Estilo_gida](./images/estilo_gida.png)

### Eranskina 7: Nabigazio mapa

![Nabigazio Mapa](./images/nabigazio_mapa.png)



---

## Lizentzia

[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

Lan hau [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa] lizentziapean dago.

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

---
