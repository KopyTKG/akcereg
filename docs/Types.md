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
- [STAG API Types](#stag-api-types)


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
> `tStudentPredemtyNaTerminu` extends [`tStudentPredmetu`](#) from STAG API types.
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

