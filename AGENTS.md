# Fanboxes admin frontend — local agent rules

This repo owns the operational dashboard. Its `staging` branch is wired to
`admin.fanboxes.com`; work on a focused branch and never push/merge `staging`
as a routine save operation.

## Checks and safety

- Run `npm run check` before committing; it runs lint and the production build.
- Keep operational order, shipping, product, user, and payment workflows
  working. Add focused tests when changing behaviour that can move money or
  alter customer fulfilment.
- Never place server secrets in client code or tracked environment files.
