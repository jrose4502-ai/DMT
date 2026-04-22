# Contact form (SendGrid Forms)

The site uses a **SendGrid Marketing Campaigns form** embedded in the Contact section. There is no Node.js email server in this project.

## Receiving submissions at info@digitalmarketrix.com

1. Sign in to [SendGrid](https://sendgrid.com/).
2. Open **Marketing** → **Single Sends** / **Forms** (or the product area where this form was created).
3. Open your form and set **notifications** or **recipient email** so new responses go to **info@digitalmarketrix.com**.

If you replace the form, update the `iframe` `src` in `src/components/Contact.js` with the new form URL from SendGrid.

## Local development

```bash
cd website
npm install
npm start
```

Only the React app runs; the form submits to SendGrid’s servers.
