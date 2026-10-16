# Contentstack cookbook (CMA + GraphQL + entries)

Operational details for the build-component skill on the **Contentstack** base. The
architecture (registry, six-step recipe) is in `components/ARCHITECTURE.md`; this is the CMS API.

## Auth / hosts

From `.env.local`: `CONTENTSTACK_API_KEY`, `CONTENTSTACK_MANAGEMENT_TOKEN` (write),
`CONTENTSTACK_DELIVERY_TOKEN` (read), `CONTENTSTACK_ENVIRONMENT` (e.g. `poc`),
`CONTENTSTACK_BRANCH` (e.g. `main`), and the GraphQL hosts.

- **CMA (content modeling + entries + assets)** — `https://api.contentstack.io` (NA;
  EU/AZ/GCP differ — honor `CONTENTSTACK_API_HOST` if set). Headers on every call:
  `api_key: <API_KEY>`, `authorization: <MANAGEMENT_TOKEN>`, `branch: <BRANCH>`,
  `Content-Type: application/json`.
- **Delivery GraphQL (verify what renders)** —
  `https://graphql.contentstack.com/stacks/<API_KEY>?environment=<ENV>`, headers
  `access_token: <DELIVERY_TOKEN>`, `branch: <BRANCH>`. Returns **published** entries only.

Drive the CMA from a small Python script (`urllib`) or `curl`. Naming: content-type/field uids
are **snake_case**; the GraphQL type name is the **PascalCase** of the uid (`flexible_page` →
`FlexiblePage`). **Reserved uid:** CMA rejects field uid `options` (422) — use `choices`.

## Content types

GET schema: `GET /v3/content_types/{uid}`. To update, **PUT the whole content_type back** with
the modified `schema` (and `options`, `field_rules`): `PUT /v3/content_types/{uid}` body
`{"content_type": {title, uid, description, schema, options, field_rules}}`. Create:
`POST /v3/content_types` with the same body.

Field schemas (append to `schema`, or to a group's `schema`):
```jsonc
// text
{"display_name":"Heading","uid":"heading","data_type":"text","field_metadata":{"version":3},"multiple":false,"mandatory":false,"unique":false,"non_localizable":false}
// multiline text: field_metadata.multiline=true
// dropdown (front_end_component / theme): add data_type:"text","display_type":"dropdown",
//   "enum":{"advanced":false,"choices":[{"value":"Default"}]}, field_metadata.default_value
// boolean toggle: data_type:"boolean", field_metadata.default_value:true
// RTE (long copy): data_type:"text", field_metadata:{allow_rich_text:true,rich_text_type:"advanced",multiline:false,options:[],version:3}
// file (image/icon/logo): data_type:"file","extensions":[],field_metadata:{rich_text_type:"standard"}
// reference (cta/image/video): data_type:"reference","reference_to":["cta"],field_metadata:{ref_multiple:false,ref_multiple_content_types:true}
// multiple group (repeating rows): data_type:"group","multiple":true,"schema":[ ...sub-fields... ]
```
- **New variant of an existing type:** GET, append `{"value":"<Variant>"}` to the
  `front_end_component` enum choices, add any new fields, PUT.
- **Title field (required, always):** every new content type's `schema` must start with a text
  field named `title`, and `options.title` must be `"title"` — so entries are findable in the
  CMS list. First field:
  `{"display_name":"Title","uid":"title","data_type":"text","mandatory":true,"unique":false,"field_metadata":{"_default":true},"multiple":false}`.
- **New content type:** POST it. Then register it as an allowed section: GET `flexible_page`,
  append the new uid to the `sections` reference field's `reference_to`, PUT. (Optional: add
  `field_rules` to show variant-specific fields in the editor — authoring UX only; the delivery
  API still returns every field.)

## GraphQL (in `lib/contentstack/graphql/...`)

- A reference/file field is exposed as `<field>Connection { edges { node { ... } } }`.
  Multi-content-type refs are a **union**: `node { __typename ... on Cta { ...CtaFields } }`.
  **Only multiple** refs/files accept a `limit` arg — single-ref connections reject it (400).
- File field → `<field>Connection { edges { node { url title } } }`.
- A multiple **group** is a plain nested list: `card_items { heading body iconConnection {...} }`.
- The section fragment lives on the PascalCase type; `pages.ts` composes it into the page query.
  Select `system { uid locale content_type_uid }` — `uid` gives the id; `locale` +
  `content_type_uid` feed the Live Preview edit tags. Declare shared fragments
  (CtaFields/ImageFields) in `fragmentDeps`.

## Live Preview / Visual Builder binding (required per section)

The base ships the SDK wiring (`components/LivePreviewInit.tsx`, `?live_preview=<hash>`
handling) and the helpers in `lib/sections/cslp.ts`. Each section binds its own fields so the
Visual Experience tab's click-to-edit tools work — an element is editable only if it carries a
`data-cslp` attribute of the form `{content_type_uid}.{entry_uid}.{locale}.{field_path}`.

- **Transform** — `cslpPrefix: cslpPrefixFrom(raw.system)` (type the raw `system` as
  `CslpSystem`). The prefix is `{ct}.{uid}.{locale}`, e.g. `hero.blt123.en-us`.
- **Component** — tag every element that renders a CMS field; `cslpTag` returns `undefined`
  without a prefix, so React omits the attribute outside preview:
  ```tsx
  <h1 data-cslp={cslpTag(section.cslpPrefix, "heading")}>{heading}</h1>
  <img data-cslp={cslpTag(section.cslpPrefix, "background_image")} ... />
  ```
- **Multiple groups** use dotted indices. Pass an item-scoped base into sub-components:
  ```tsx
  <Card cslp={cslpTag(section.cslpPrefix, `card_items.${i}`) ?? null} ... />
  // inside Card:  data-cslp={cslpTag(cslp, "heading")}   → card_items.0.heading
  ```
- Tag headings, copy, images, badges, categories, CTA/link labels. Leave fixed UI chrome
  (decorative icons, arrows) untagged.
- Quick check: load the page headless and count `document.querySelectorAll("[data-cslp]")` —
  every CMS-driven element of the new section should appear with the right dotted path.

## Entries

- Create: `POST /v3/content_types/{ct}/entries` body `{"entry": {...fields...}}`.
  - reference field → `[{"uid":"<entryUid>","_content_type_uid":"<ct>"}]`
  - file field → the **asset uid string** (not an object)
  - multiple group → an array of objects
- **Update merges** (safe single-field updates): `PUT /v3/.../entries/{uid}` with
  `{"entry":{"section_id":"faq"}}` sets just that field and preserves the rest. (On GET, file
  fields come back as asset *objects* and refs as `[{uid,_content_type_uid}]` — so prefer a
  minimal merge PUT over round-tripping the whole entry.)
- Attach to a page: GET the `flexible_page` entry, append `{uid,_content_type_uid}` to its
  `sections`, PUT (send title+url+seo+sections).
- **Publish** (required for delivery): `POST /v3/.../entries/{uid}/publish` body
  `{"entry":{"environments":["<ENV>"],"locales":["en-us"]}}`. Assets:
  `POST /v3/assets/{uid}/publish` body `{"asset":{"environments":["<ENV>"],"locales":["en-us"]}}`.

## Assets

Upload (multipart): `POST /v3/assets` with `-F "asset[upload]=@/tmp/file.png;type=image/png"
-F "asset[title]=..."` → `asset.uid`. Use that uid directly in `file` fields; publish it before
verifying.

## Verify via delivery GraphQL

POST the page query to the delivery endpoint (above) and confirm the section + its fields come
back (e.g. `sectionsConnection { edges { node { __typename ... } } }`). This confirms publishing
+ the fragment are correct before the browser screenshot.
