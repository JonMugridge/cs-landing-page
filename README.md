# Customer Success hub

A starter intranet page for the SmartSearch Customer Success team: quick links to our tools, team news, CS documents, and internal and external training (SmartSearch and Credas).

Status: **concept / pilot for 2027.** Placeholders in square brackets, like `[CEZANNE_URL]`, still need filling in.

---

## What's in this repository

```
index.html                 The hub home page
login.html                 The sign-in page
staticwebapp.config.json   Sign-in rules for Azure Static Web Apps
assets/css/tokens.css      SmartSearch design system colours and type
assets/css/styles.css      Page styles
assets/js/app.js           Loads the content files and builds the page
assets/js/icons.js         Icons (Heroicons, MIT licence)
assets/img/                SmartSearch logo
data/links.json            Quick links
data/news.json             Team news
data/documents.json        CS documents
data/training.json         Training videos, guides and GitHub training
```

The page design lives in the code. **All the content lives in the `data` folder**, so updating the hub means editing those files, not the code.

---

## How sign-in works (and what it doesn't do)

The hub is designed to be hosted on **Azure Static Web Apps**, which has Microsoft sign-in built in.

- Anyone who isn't signed in is sent to `login.html`.
- "Sign in with your work account" sends them to **Microsoft's own sign-in page**. The hub never sees or stores passwords.
- After signing in, they're returned to the hub, and their email address shows in the header.

**Important:** signing in to the hub does **not** sign people in to HubSpot, Cezanne, Attention or the other tools. Each tool checks its own login. To avoid separate passwords for each tool, IT needs to set up single sign-on (SSO) between Microsoft and each tool, where the tool supports it. With SSO in place, the quick links open each tool already signed in.

Do not try to store people's passwords for other tools in this site. That would be a serious security risk.

---

## Updating content

Content files can be edited directly on GitHub: open the file, click the pencil icon, make the change, and commit. If the site is connected to Azure (see below), it updates automatically within a few minutes.

JSON is strict about punctuation. Every item except the last in a list needs a comma after its closing `}`, and all text goes in double quotes. If the page shows a message like "News could not be loaded", the file most likely has a missing comma or quote.

### Quick links (`data/links.json`)

```json
{ "name": "HubSpot", "description": "Customers, tickets and deals", "icon": "users", "url": "https://app.hubspot.com/" }
```

`icon` must be one of the names in `assets/js/icons.js`.

### News (`data/news.json`)

```json
{
  "title": "New onboarding checklist",
  "date": "2027-02-03",
  "author": "Marketing",
  "summary": "One or two sentences about the update.",
  "url": "https://link-to-the-full-post"
}
```

Use the date format `YYYY-MM-DD`. The newest item gets the "New" tag automatically.

### Documents (`data/documents.json`)

```json
{ "title": "CS playbook", "url": "https://link-to-the-document" }
```

### Training (`data/training.json`)

```json
{
  "title": "Welcome To Credas",
  "product": "Credas",
  "type": "video",
  "audience": ["internal", "external"],
  "url": "https://share.synthesia.io/...",
  "description": "An introduction to Credas and an overview of the platform."
}
```

- `product`: `SmartSearch`, `Credas`, or `Both` (shows under either product)
- `type`: `video`, `guide` or `github`
- `audience`: `["internal"]`, `["external"]` or both
- `keywords` (optional): extra search words, e.g. `["github", "training", "connect"]`

---

## Previewing on your own computer

The simplest option is the Azure Static Web Apps CLI, which also imitates the sign-in step:

```
npm install -g @azure/static-web-apps-cli
swa start .
```

Then open the address it prints (usually http://localhost:4280). This needs Node.js installed. Check the current Azure Static Web Apps CLI documentation if these commands have changed.

Opening `index.html` straight from your file system won't load the content files, because browsers block that.

---

## Putting it online (Azure Static Web Apps)

This needs someone with access to your company's Azure account, most likely IT.

1. In the Azure portal, create a **Static Web App** and connect it to this GitHub repository.
2. For build settings, choose **Custom**, set **App location** to `/`, and leave **Output location** empty. There is no build step.
3. Azure adds a deployment workflow to the repository automatically. From then on, every change committed to the main branch goes live by itself.

### Restricting sign-in to SmartSearch staff only

By default, the built-in Microsoft sign-in can accept **any** Microsoft account, not just SmartSearch ones. For an intranet, IT should restrict it to the company's own Microsoft tenant. As far as I'm aware, this needs the Static Web Apps **Standard** plan plus an app registration in Microsoft Entra ID. Roughly:

1. Create an app registration in Entra ID for the hub.
2. Add its client ID and secret to the Static Web App's application settings as `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET`.
3. Add this block to `staticwebapp.config.json`, replacing `<TENANT_ID>` with the company's tenant ID:

```json
"auth": {
  "identityProviders": {
    "azureActiveDirectory": {
      "registration": {
        "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>/v2.0",
        "clientIdSettingName": "AZURE_CLIENT_ID",
        "clientSecretSettingName": "AZURE_CLIENT_SECRET"
      }
    }
  }
}
```

Check Microsoft's current Azure Static Web Apps authentication documentation before doing this, as the exact steps and plan requirements may have changed.

---

## Making it the browser start page

Each person can set it in Chrome under **Settings → On startup → Open a specific page**. IT can also set it for everyone through device management (for example, Intune or Group Policy).

---

## Known limitations and next steps

- **News needs a GitHub edit.** Marketing would need GitHub access to post news this way. A friendlier option for later is to keep news in a SharePoint list and have the hub read it through Microsoft Graph, which needs developer work.
- **Search covers training only.** It searches all training (both tabs, both products) by title, description, format and keywords. Pressing Enter opens the result directly when there is exactly one match.
- **Placeholders.** Links in square brackets show as unclickable (`#`) until they are replaced with real addresses.
