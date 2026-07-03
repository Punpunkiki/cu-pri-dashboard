# CU-PRI · LINE OA build kit + Part G checklist

Backend/handoff artifacts for the **CU-PRI Refrigerant Intelligence** LINE Official Account.
All dashboard links point at the live deployment: **https://cu-pri-dashboard.vercel.app**

## Files
| File | What it is | Send via |
|---|---|---|
| `flex_tech_alert.json` | Technician high-risk alert (bubble + quickReply) | Push Message |
| `flex_weekly_summary.json` | Weekly executive summary card | OA Broadcast / Push |
| `flex_crit_escalation.json` | Critical (Yellow→Red) escalation card | Push Message |
| `richmenu.json` | 6-zone rich menu (2500×1686) tap areas | Messaging API `POST /v2/bot/richmenu` |

The rich-menu **image** (2500×1686 PNG) is `cupri_richmenu_2500x1686.png` in `Desktop\CU-PRI-assets\`.

## Infrastructure (as provisioned)
- **OA:** CU-PRI Refrigerant · Basic ID `@686hxlrb` · add-friend `https://line.me/R/ti/p/@686hxlrb`
- **Provider:** Chula Physical Resources Office
- **Messaging API channel ID:** `2010585249`
- **Channel secret / long-lived access token:** held by the account owner (password manager) — never commit these
- **Repo / CI:** github.com/Punpunkiki/cu-pri-dashboard → auto-deploys `main` to Vercel

## How the backend uses these
1. Capture each recipient's `userId` from webhook `follow` / `message` events.
2. Push a card: `POST https://api.line.me/v2/bot/message/push` with
   `Authorization: Bearer <CHANNEL_ACCESS_TOKEN>` and body
   `{ "to": "<userId>", "messages": [ <contents of a flex_*.json> ] }`.
3. Upload the rich menu: `POST /v2/bot/richmenu` (this JSON) → upload image →
   `POST /v2/bot/user/all/richmenu/{richMenuId}` to set as default.

## ⚠️ Note on postback zones (B/C/D)
Zones **การแจ้งเตือน / รายงานสรุป / สถานะอาคาร** use `postback` and require the webhook
backend to reply. **Until the backend is live**, either:
- switch those three to `uri` → `https://cu-pri-dashboard.vercel.app/`, or
- use a **text** action so they send a keyword the OA can later auto-reply to.
Zone A (Dashboard), E (Help→handoff view), and F (Contact→oaMessage) work with no backend.

---

# Part G — Final checklist

## ✅ Done
- [x] **OA created** — CU-PRI Refrigerant (`@686hxlrb`, Free plan)
- [x] **Add-friend URL/QR** — `https://line.me/R/ti/p/@686hxlrb` (+ QR in Developers console)
- [x] **Provider** — Chula Physical Resources Office
- [x] **Messaging API channel** — ID `2010585249`
- [x] **Channel secret** — issued, held by owner
- [x] **Long-lived access token** — issued, held by owner
- [x] **Auto-reply disabled**, greeting kept
- [x] **Greeting message** — custom Thai greeting set
- [x] **Dashboard deployed (LIFF endpoint)** — https://cu-pri-dashboard.vercel.app (public)
- [x] **Flex JSON** — 3 cards wired to the real Vercel URL (this folder)
- [x] **Rich-menu tap-area JSON** — wired to Vercel URL + real OA id (this folder)

- [x] **Keyword auto-replies (rich cards)** — 4 rich-message cards wired + active; Default catch-all off
- [x] **Webhook backend deployed** — Vercel Edge Function `api/webhook.js` (see below)

## ⏳ Pending (needs you / backend)
- [ ] **Profile picture + cover image** — upload `cupri_profile_640.png` + `cupri_cover_1080x878.png` in OA Manager → Edit profile
- [ ] **Webhook env vars + activation** — add the two secrets in Vercel, then set/enable the URL in the console (see below)
- [ ] **Flex preview** — paste any `flex_*.json` into the LINE Flex Message Simulator (developers.line.biz/flex-simulator) to verify rendering
- [ ] **Backend push service** — implement userId capture + push using the access token (needs a datastore)
- [ ] **OA verification review** (optional) — submit for a verified/premium badge if desired

---

# Backend — webhook

**Endpoint:** `https://cu-pri-dashboard.vercel.app/api/webhook` (Vercel Edge Function, `api/webhook.js`)

Handles rich-menu **postback** taps (`menu=alerts|weekly|status`, `action=enroute`) and
**follow** events, replying with branded Flex cards. Plain-text keywords are deliberately
ignored so the OA keyword auto-replies (rich-message cards) remain the single source of truth
(no double replies). Requests are verified with HMAC-SHA256 (`x-line-signature`).

**Required environment variables** (Vercel → Project → Settings → Environment Variables → all envs, then redeploy):
- `LINE_CHANNEL_SECRET` — Messaging API channel secret
- `LINE_CHANNEL_ACCESS_TOKEN` — long-lived channel access token

**Activate:** LINE Developers Console → channel `2010585249` → Messaging API →
Webhook URL = the endpoint above → **Use webhook: ON** → **Verify** (expects 200).
Also enable Webhook in OA Manager → Settings → response settings.

## Flags
- Postback zones B/C/D are inert until the webhook backend is live (see note above).
- Help (zone E) currently points at the dashboard's Handoff view; swap to a dedicated help page when one exists.
- Contact (zone F) `tel:`/`mailto:` values are placeholders — replace with real numbers.
