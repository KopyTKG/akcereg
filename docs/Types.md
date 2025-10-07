Table of Contents
=================
- [Next API Types](#next-api-types)
    - [`tPredmet`](#tpredmet)
    - [`tPredmetBody`](#tpredmetbody)
    - [`tPredmetPostBody`](#tpredmetpostbody)
    - [`tPredmetHledat`](#tpredmethledat)
    - [`tHledatBody`](#thledatbody)
    - [`tTerminPatchBody`](#tterminpatchbody)
    - [`tStudentPredmetuNaTerminu`](#tstudentpredmetunaterminu)
    - [`tTerminGetBody`](#ttermingetbody)
    - [`tTermin`](#ttermin)
    - [`tFiltrBody`](#tfiltrbody)
    - [`tUcitelBody`](#tucitelbody)
    - [`tStudentiBody`](#tstudentibody)
- [STAG API Types](#stag-api-types)
    - [`tGetStudentiByPredmet`](#tgetstudentibypredmet)
    - [`tStudentPredmetu`](#tstudentpredmetu)
    - [`tGetStagUserListForLoginTicketV2`](#tgetstaguserlistforloginticketv2)
    - [`tStagUserInfo`](#tstaguserinfo)
    - [`tGetPredmetInfo`](#tgetpredmetinfo)
    - [`tGetStudentInfo`](#tgetstudentinfo)
    - [`tGetRozvrhByStudent`](#tgetrozvrhbystudent)
    - [`tRozvrhovaAkce`](#trozvrhovaakce)
    - [`tUcitel`](#tucitel)


---
---
<!-- Next API types  -->

## Next API Types
Types used in NextJS API routes as return bodies or intrernal types in them.

> [!WARNING]
> These docs are not finished yet. Please be aware that some types may be missing or incomplete.
> You won't find types from old `src/lib/types.ts` file here yet.

<!-- api/predmety -->
### `tPredmet`
> [!NOTE]
> Type is 1:1 mapped to `predmet` table in the database.
```ts
type tPredmet = {
  kod_predmetu: string;
  zkratka_predmetu: string;
  katedra: string;
  pocet_cviceni: number;
}
```

### `tPredmetBody`
> [!NOTE]
> Type used as return body from `$HOST/api/predmety` route.
```ts
type tPredmetBody = {
   predmety: tPredmet[];
}
```

<!-- api/predmet --> 

### `tPredmetPostBody`
> [!NOTE]
> Type used as return body for `POST` method in `$HOST/api/predmet`
```ts
type tPredmetPostBody = {
 kod: string | null
 zkratka: string
 katedra: string
 cviceni: number
}
```

<!-- api/hledat -->

### `tPredmetHledat`
> [!NOTE]
> Type used in `tHledatBody` as part of search response body.
```ts
type tPredmetHledat = {
 kod_predmetu: string
 cviceni: number[]
}
```

### `tHledatBody`
> [!NOTE]
> Type used as return body from `$HOST/api/hledat` route.
```ts
type tHledatBody = {
 student: tGetStudentInfo
 predmety: tPredmetHledat[]
}
```

<!-- api/termin -->

### `tTerminPatchBody`
> [!NOTE]
> Type used as response body for `PATCH` method in `$HOST/api/termin`
```ts
type tTerminPatchBody = {
 ucebna: string
 datum_start: string
 datum_konec: string
 max_kapacita: number
 kod_predmetu: string
 jmeno: string
 cislo_cviceni: number
 popis: string
 upozornit: boolean
 vyucuje_prijmeni: string
 vyucuje_jmeno: string
}
```

### `tStudentPredmetuNaTerminu`
> [!NOTE]
> Type used in `tTerminGetBody`.
> `tStudentPredemtyNaTerminu` extends [`tStudentPredmetu`](#tstudentpredmetu) from STAG API types.
```ts
interface tStudentPredmetuNaTerminu extends tStudentPredmetu {
 datum_splneni: Date | null
}
```

### `tTerminGetBody`
> [!NOTE]
> Type used as return body for `GET` method in `$HOST/api/termin`
```ts
type tTerminGetBody = {
 termin: tTermin
 studenti: tStudentPredmetuNaTeminu[]
}
```

<!-- api/filtr -->

### `tTermin`
> [!NOTE]
> Type used in `tFiltrBody`.
```ts
type tTermin = {
 id: string
 ucebna: string
 datum_start: Date
 datum_konec: Date
 aktualni_kapacita: number
 max_kapacita: number
 kod_predmet: string
 jmeno: string
 cislo_cviceni: number
 popis: string
 vypsal_id: string
 vypsal: {
  titulPred: string | null
  jmeno: string
  prijmeni: string
  titulZa: string | null
 }
 predmet: {
  pocet_cviceni: number
 }
 historie_terminu: {
  student_id: string
 } | null
}
```

### `tFiltrBody`
> [!NOTE]
> Type used as return body for `$HOST/api/filtr` route.
```ts
type tFiltrBody = {
 terminy: tTermin[]
}
```

<!-- /api/ucitel -->

### `tUcitelBody`
> [!NOTE]
> Type used as return body from `$HOST/api/ucitel` route.
```ts
type tUcitelBody = {
 terminy: tTermin[]
}
```

<!-- api/ucitel/predmety/studenti -->

### `tStudentiBody`
> [!NOTE]
> Type used as return body from `$HOST/api/ucitel/predmety/studenti` route.
> `tStudentiBody` contains array of [`tStudentPredmetu`](#tstudentpredmetu) from STAG API types.
```ts
type tStudentiBody = {
 kod: string
 studenti: tStudentPredmetu[]
}
```

---
## STAG API Types
Types used in STAG API routes as return bodies or intrernal types in them.

> [!IMPORTANT]
> All routes are from STAG API, see: [stag-demo.zcu.cz](https://stag-demo.zcu.cz/ws)

<!-- getStudentiByPredmet -->

### `tGetStudentiByPredmet`
> [!NOTE]
> Type used as return body from `getStudentiByPredmet` STAG API route.
```ts
type tGetStudentiByPredmet = {
 studentPredmetu: tStudentPredmetu[]
}
```

### `tStudentPredmetu`
> [!NOTE]
> Type used in `tGetStudentiByPredmet` and `tStudentPredmetuNaTerminu`.
```ts
type tStudentPredmetu = {
 osCislo: string
 encOsCislo: string | null
 jmeno: string
 prijmeni: string
 titulPred: string | null
 titulZa: string | null
 stav: string
 userName: string | null
 stprIdno: string
 nazevSp: string
 fakultaSp: string
 kodSp: string
 formaSp: string
 typSp: string
 typSpKey: string
 mistoVyuky: string
 rocnik: string
 financovani: string
 oborKomb: string
 oborIdnos: string
 email: string
 maxDobaDatum: string | null
 simsP58: string | null
 simsP59: string | null
 cisloKarty: string | null
 pohlavi: string
 rozvrhovyKrouzek: string | null
 studijniKruh: string
 evidovanBankovniUcet: string | null
 statutPredmetu: string
 casPrihlaseni: { value: string }
}
```

<!-- getStagUserListForLoginTicketV2 -->

### `tGetStagUserListForLoginTicketV2`
> [!NOTE]
> Type used as return body from `getStagUserListForLoginTicketV2` STAG API route.
```ts
type tGetStagUserListForLoginTicketV2 = {
 jmeno: string
 prijmeni: string
 titulPred: string | null
 titulZa: string | null
 email: string
 dbId: string | null
 stagUserInfo: tStagUserInfo[]
}
```

### tStagUserInfo
> [!NOTE]
> Type used in `tGetStagUserListForLoginTicketV2`.
```ts
type tStagUserInfo = {
 userName: string
 role: string
 roleNazev: string
 fakulta: string
 katedra: string
 ucitIdno: number | null
 osCislo: string | null
 encId: string | null
 email: string
}
```

<!-- getPredmetInfo -->

### `tGetPredmetInfo`
> [!NOTE]
> Type used as return body from `getPredmetInfo` STAG API route.
```ts
type tGetPredmetInfo = {
 katedra: string
 zkratka: string
 rok: string
 nazev: string
 nazevDlouhy: string
 maVyuku: string
 vyukaZS: string
 vyukaLS: string
 jakCastoJeNabizen: string
 jakCastoJeNabizenUpresneni: string | null
 kreditu: number
 viceZapis: string
 minObsazeni: number
 garanti: string
 garantiSPodily: string
 garantiUcitIdno: string
 prednasejici: string
 prednasejiciSPodily: string
 prednasejiciUcitIdno: string
 cvicici: string
 cviciciSPodily: string
 cviciciUcitIdno: string
 seminarici: string
 seminariciSPodily: string
 seminariciUcitIdno: string
 schvalujiciUznani: string
 schvalujiciUznaniUcitIdno: string
 examinatori: string
 examinatoriUcitIdno: string
 podminujiciPredmety: string
 vylucujiciPredmety: string
 podminujePredmety: string
 literatura: string
 nahrazPredmety: string
 metodyVyucovaci: string
 metodyHodnotici: string
 akreditovan: string
 jednotekPrednasek: number
 jednotkaPrednasky: string
 jednotekCviceni: number
 jednotkaCviceni: string
 jednotekSeminare: number
 jednotkaSeminare: string
 anotace: string
 typZkousky: string
 maZapocetPredZk: string
 formaZkousky: string | null
 pozadavky: string
 prehledLatky: string
 predpoklady: string
 ziskaneZpusobilosti: string
 casovaNarocnost: string
 predmetUrl: string | null
 vyucovaciJazyky: string
 poznamka: string
 ectsZobrazit: string
 ectsAkreditace: string
 ectsNabizetUPrijezdu: string
 poznamkaVerejna: string | null
 skupinaAkreditace: string
 skupinaAkreditaceKey: string
 zarazenDoPrezencnihoStudia: string
 zarazenDoKombinovanehoStudia: string
 studijniOpory: string
 praxePocetDnu: number
 urovenNastavena: string | null
 urovenVypoctena: string
 automatickyUznavatZppZk: string
 hodZaSemKombForma: string | null
}
```

<!-- getStudentInfo -->

### `tGetStudentInfo`
> [!NOTE]
> Type used as return body from `getStudentInfo` STAG API route.
```ts
type tGetStudentInfo = {
 osCislo: string
 jmeno: string
 prijmeni: string
 titulPred: string | null
 titulZa: string | null
 stav: string
 userName: string | null
 stprIdno: string
 nazevSp: string
 fakultaSp: string
 kodSp: string
 formaSp: string
 typSp: string
 typSpKey: string
 mistoVyuky: string
 rocnik: string
 financovani: string
 oborKomb: string
 oborIdnos: string
 email: string
 maxDobaDatum: string | null
 simsP58: string | null
 simsP59: string | null
 cisloKarty: string | null
 pohlavi: string
 rozvrhovyKrouzek: string | null
 studijniKruh: string
 evidovanBankovniUcet: string | null
}
```

<!-- getRozvrhByStudent -->

### `tGetRozvrhByStudent`
> [!NOTE]
> Type used as return body from `getRozvrhByStudent` STAG API route
```ts
type tGetRozvrhByStudent = {
 rozvrhovaAkce: tRozvrhovaAkce[]
}
```

### `tRozvrhovaAkce`
> [!NOTE]
> Type used in `tGetRozvrhByStudent`.
```ts
type tRozvrhovaAkce = {
 roakIdno: number
 nazev: string
 katedra: string
 predmet: string
 statut: string
 ucitIdno: number | null
 ucitel: tUcitel | null
 rok: string
 budova: string | null
 mistnost: string | null
 kapacitaMistnosti: number | null
 planObsazeni: number
 obsazeni: number
 typAkce: string
 typAkceZkr: string
 semestr: string
 platnost: string
 den: string | null
 denZkr: string | null
 vyucJazyk: string | null
 hodinaOd: number | null
 hodinaDo: number | null
 pocetVyucHodin: number
 hodinaSkutOd: { value: string } | null
 hodinaSkutDo: { value: string } | null
 tydenOd: number
 tydenDo: number
 tyden: string
 tydenZkr: string
 grupIdno: number | null
 jeNadrazena: string
 maNadrazenou: string
 kontakt: string
 krouzky: string | null
 casovaRada: string | null
 datum: { value: string } | null
 datumOd: { value: string } | null
 datumDo: { value: string } | null
 druhAkce: string
 vsichniUciteleUcitIdno: string
 vsichniUciteleJmenaTituly: string
 vsichniUciteleJmenaTitulySPodily: string
 vsichniUcitelePrijmeni: string
 referencedIdno: number
 poznamkaRozvrhare: string | null
 nekonaSe: string | null
 owner: string
 zakazaneAkce: string | null
}
```

### `tUcitel`
> [!NOTE]
> Type used in `tRozvrhovaAkce`.
```ts
type tUcitel = {
 ucitIdno: number
 jmeno: string
 prijmeni: string
 titulPred: string | null
 titulZa: string | null
 platnost: string
 zamestnanec: string
 podilNaVyuce: number
}
```
