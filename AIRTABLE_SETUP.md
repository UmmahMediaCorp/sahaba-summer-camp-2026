# Airtable Setup — Sahaba Summer Camp Registration

The code is already deployed. To turn the form on, you need to:

1. Create an Airtable base with the right fields
2. Generate a Personal Access Token (PAT)
3. Add 3 env vars to Vercel

Total time: ~10 minutes. Step-by-step below.

---

## Step 1 — Create the Airtable base (3 min)

1. Go to **https://airtable.com**, sign in (or sign up — free tier is plenty)
2. Click **+ Create a base** → pick **Start from scratch**
3. Name the base: **`Sahaba Summer Camp 2026`**
4. Rename the default table (top-left tab) from `Table 1` → **`Registrations`**

Now add the fields exactly as listed below. Click the **+** to the right of the existing columns to add each new one. **The field names must match exactly** — capitalisation, spaces, everything.

| Field Name | Field Type | Notes |
|---|---|---|
| `Parent Name` | Single line text | Rename the default "Name" column to this |
| `Phone` | Phone number | |
| `Email` | Email | |
| `Number of Children` | Single select | Add options: `1`, `2`, `3`, `4`, `5+` |
| `Age Track` | Single select | Add options: `Younger (7–10)`, `Older (11–15)`, `Mixed (both)` |
| `Children Details` | Long text | |
| `Preferred Location` | Single select | Add options: `Sahaba Youth Centre`, `Downtown Sahaba Mosque`, `Al-Faruq Islamic Centre` |
| `Notes` | Long text | |
| `Submitted At` | Date | Toggle "Include time field" on |
| `Status` | Single select (optional) | Add options: `New`, `Contacted`, `Confirmed`, `Paid`, `Declined` — for your own pipeline tracking |

**Tip on single-select fields:** Airtable's API accepts strings even if you haven't pre-created the options (because we send `typecast: true`). But adding them in advance gives you nicer colour-coded chips in the UI.

---

## Step 2 — Get your Base ID (30 sec)

1. With your base open, look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
2. The part after `/airtable.com/` starting with `app` is your **Base ID**
3. Copy it (it looks like `appAbCdEfGhIjKlMn`)

---

## Step 3 — Generate a Personal Access Token (3 min)

1. Go to **https://airtable.com/create/tokens**
2. Click **+ Create new token**
3. Name it: **`Sahaba Camp Site`**
4. **Scopes** — add only:
   - `data.records:write`
5. **Access** — click **Add a base** → pick **Sahaba Summer Camp 2026**
6. Click **Create token**
7. **Copy the token immediately** — Airtable will only show it once. It looks like `patAbCd...XYZ`.

⚠️ Treat this token like a password. Anyone with it can write rows to your base.

---

## Step 4 — Add the 3 env vars to Vercel (3 min)

1. Go to **https://vercel.com/ahmedbawazir-7431s-projects/sahaba-summer-camp-2026/settings/environment-variables**
2. Add these three, one at a time. For each, leave all three environments (Production, Preview, Development) checked:

| Key | Value |
|---|---|
| `AIRTABLE_TOKEN` | the `patAbCd...` you just copied |
| `AIRTABLE_BASE_ID` | the `appXXX...` from Step 2 |
| `AIRTABLE_TABLE_NAME` | `Registrations` |

3. Click **Save** for each.

---

## Step 5 — Redeploy (10 sec)

Env vars only take effect on the next deploy. Either:

- Push any commit and Vercel auto-deploys, OR
- Run `vercel deploy --prod --yes --scope=ahmedbawazir-7431s-projects` locally, OR
- In the Vercel dashboard → Deployments → click the three dots on the latest → **Redeploy**.

---

## Step 6 — Test (1 min)

1. Open https://sahabasummercamp.com/#register-form
2. Fill in a test registration with your own info
3. Hit **Send Registration**
4. Check your Airtable — the row should appear within 2-3 seconds

If you see the **green success message** on the site, it worked. ✅

If you see a **red error message with a fallback email link**, something is mis-configured. Most common causes:
- Field name typo (Airtable column doesn't exactly match the API field name)
- Wrong table name in env var
- Token doesn't have the base scoped to it

To debug: open the Vercel dashboard → **Logs** tab → look for the most recent `/api/register` invocation. The error message there will tell you which field Airtable didn't like.

---

## What submitters see

- **Success** → green box: "Alhamdulillah — your registration is *in*. We'll be in touch within 48 hours, in shaa Allah."
- **Network failure / API failure** → red box with a clickable "Click here to send your registration as an email" link that opens their email client with all fields pre-filled (so a submission is never truly lost).

---

## Optional follow-ups

- **Email confirmation to parent**: Add an Airtable automation to fire on new record → send confirmation email to the email field. Free on Airtable.
- **Slack notification to your team**: Same — Airtable automation → "Send Slack message" on new record.
- **Capacity tracking**: Add a formula field on the base counting `Number of Children` per Preferred Location to see when each mosque is filling up.

---

When you've finished Steps 1-4, just tell me — I'll trigger a redeploy and confirm it's live.
