# things

## apply form at `/apply`

- calendar features
  - an officer selects times to set on form at `/admin/times`
  - applicants select their own available times in availability grid view
- resumes to shared drive

### editing form

- when making changes to form content, update semester / version of form in `apply/page.tsx`
- to update answers and their types, first edit the `Application` table in `schema.prisma` and then run `pnpm prisma generate`
- to update question content, edit the `q` object in `apply-form.ts`
- change labels / links of challenges in `apply-form.ts`
- run `pnpm typecheck` to see all the type errors from db changes and fix them
- modify `ApplyFormSchema` in `validations/apply.ts` to change the validations
- possibly change `defaultValues` in `apply/page.tsx`
- check `getQAs()` in `admin/applicant-page.tsx` for any changes to specific questions

## officer view at `/admin`

- requires signin with google

  - see `libraries.md/emails` for details

- view all applicants
- click on applicant -> go to page

  - show app form, render resume pdf on website
  - reject button
    - remove their available times (from db)
  - accept button
    - select first available time slot of applicant still in db
      - remove all overlapping time slots from available officer times (from db)
      - add selected time slot to officer's google calendar
    - if applicant time slot unavailable:
      - send manual email to applicant
    - send interview email
    - book zach rooms manually

- `/admin/times`: availability grid for officers
  - each user is assigned a random color on page load
  - User can select times over someone else's time section, with the color of a section representing the most recent officer who selected that time. Unselecting a section shows any other most recent user's availability in that section (if any).
  - User can select which teams they want to interview for (select all teams to interview any)
  - Can't select times if user is filtered out of view

## adding officers to login

- add to `ALLOWED_EMAILS` in `.env`
- add to <https://console.cloud.google.com>, then `APIs & Services` -> `OAuth consent screen` -> `Test users`
