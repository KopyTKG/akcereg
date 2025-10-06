Table of Contents
=================
- [System routes](#system-routes)
- [Admin routes (Katedra)](#admin-routes)
- [Ucitel routes](#ucitel-routes)
- [Student routes](#student-routes)

> [!CAUTION]
> All routes will be migrated to NextJS API routes in future. As of now, only the routes below are implemented using NextJS API routes.
> 

#### Todo
- [ ] migrate `$HOST/terminy` to NextJS API route
- [ ] migrate all student routes to NextJS API routes
- [ ] add response types for all routes
- [ ] create types documentation

----
----

## System routes
Routes used for authentication and user session management.

### `$HOST/api/auth`

Main login path used only in `middleware.ts`. Expects raw unecrypted session ticket in cookie given by STAG.

#### Request
- `GET` request
- `Cookies`:
    - `e-svt` (REQUIRED): "SOFT" / Unecrypted session ticket.
    - `e-svh` (REQUIRED): "soft" ticket SHA3 hash.

#### Response
- `200 OK`: Returns JSON object of type [`tGetStagUserListForLoginTicketV2`](#) with user data.
- `401 Unauthorized`: Missing or invalid cookies.
- `500 Internal Server Error`: Unexpected error.

----------------------------------------------------------------------------------------------------------------------
### `$HOST/api/auth/logout`

Logs out the user by clearing session cookies and requesting STAG to invalidate the session.

#### Request
- `GET` request
- `Cookies`:
    - `x-svt` (REQUIRED): "HARD" / Encrypted session ticket.
    - `x-svh` (REQUIRED): "soft" ticket SHA3 hash.

#### Response
- `200 OK`: Returns JSON object `{ success: true }` with delete headers on successful logout.
- `500 Internal Server Error`: Unexpected error.


----------
----------


## Admin routes
Routes used for administrative tasks, accessible only to users with admin privileges.

### `$HOST/api/predmet`
Master route for almost all predmet (course) related operations.

#### Request
##### Create predmet
- `POST` request
- `Cookies`:
    - `x-svt` (REQUIRED): "HARD" / Encrypted session ticket.
    - `x-svh` (REQUIRED): "soft" ticket SHA3 hash.
- `Body` (JSON):
    ```typescript
     type t = {
      kod: string | null,
      zkratka: string,
      katedra: string,
      pocet_cviceni: number,
     }
    ```
#### Patch predmet
- `PATCH` request
- `Cookies`:
    - `x-svt` (REQUIRED): "HARD" / Encrypted session
    - `x-svh` (REQUIRED): "soft" ticket
- `Search Params`:
    - `kod_predmetu` (REQUIRED): Predmet ID to update.
- `Body` (JSON):
    ```typescript
     type t = {
      kod: string,
      zkratka: string | null,
      katedra: string | null,
      pocet_cviceni: number,
     }
    ```
#### Delete predmet
- `DELETE` request
- `Cookies`:
    - `x-svt` (REQUIRED): "HARD" / Encrypted session
    - `x-svh` (REQUIRED): "soft" ticket
- `Search Params`:
    - `kod_predmetu` (REQUIRED): Predmet ID to delete.

#### Response
- `200 OK`: Returns JSON object `{ success: true }` on successful operation.
- `401 Unauthorized`: Missing or invalid cookies, or insufficient privileges.
- `500 Internal Server Error`: Unexpected error.

----------
----------


## Ucitel routes
Routes used for teacher-specific operations, accessible only to users with teacher privileges or admin.

### `$HOST/api/termin`
Master route for all termin (class session) related operations.

#### Requests
- [Create termin](#create-termin)
- [Update termin](#update-termin)
- [Read termin](#read-termin)
- [Delete termin](#delete-termin)

##### Create termin
- `POST` request
- `Cookies`:
    - `x-svt` (REQUIRED): "HARD" / Encrypted session
    - `x-svh` (REQUIRED): "soft" ticket
- `Body` (JSON):
    ```typescript
    type t = {
     ucebna: string,
     datum_start: datetime,
     datum_konec: datetime,
     max_kapacita: number,
     cislo_cviceni: number,
     popis: string,
     jmeno: string,
     kod_predmetu: string,
     upozornit: boolean,
     vyucuje_prijmeni: string,
     vyucuje_jmeno: string,
    }
    ```
##### Response
- `200 OK`: Returns JSON object `{ mails: string[] }` on successful operation.
- `401 Unauthorized`: Missing or invalid cookies, or insufficient privileges.
- `500 Internal Server Error`: Unexpected error.

-----

### `$HOST/api/predmety`
Fetches a list of all corses (predmety) the user is teaching.

#### Request
- `GET` request
- `Cookies`:
    - `x-svt` (REQUIRED): "HARD" / Encrypted session
    - `x-svh` (REQUIRED): "soft" ticket
> [!IMPORTANT]
> in future `body` will be added with content of what role has user selected to view.

#### Response
- `200 OK`: Returns JSON array of type [`tPredmetBody`](Tyoes.md#tPredmetBody) with predmety data.
- `401 Unauthorized`: Missing or invalid cookies, or insufficient privileges.
- `500 Internal Server Error`: Unexpected error.

----

### `$HOST/api/hledat`
Searches for users (students) by `osCislo`.

#### Request
- `GET` request
- `Cookies`:
    - `x-svt` (REQUIRED): "HARD" / Encrypted session
    - `x-svh` (REQUIRED): "soft" ticket
- `Search Params`:
    - `id_stud` (REQUIRED): User's osCislo to search for.

#### Response
- `200 OK`: Returns JSON object of type [`tHledatBody`](#) with user data.
- `401 Unauthorized`: Missing or invalid cookies, or insufficient privileges.
- `500 Internal Server Error`: Unexpected error.

----
 
### `$HOST/api/filtr`
Fetches a list of all events (terminy) based on provided filters. Default filter is show all upcomming events.

#### Request
- `GET` request
- `Cookies`:
    - `x-svt` (REQUIRED): "HARD" / Encrypted session
    - `x-svh` (REQUIRED): "soft" ticket
- `Search Params`:
    - `vybrane`: Filter by predmet ID. Looks like `vybrane=ABC123-ABC112`.
    - `vse`: Show all events, including past ones. Looks like `vse=true`.


#### Response
- `200 OK`: Returns JSON array of type [`tFiltrBody`](#) with event data.
- `401 Unauthorized`: Missing or invalid cookies, or insufficient privileges.
- `500 Internal Server Error`: Unexpected error.

----------
----------


## Student routes

