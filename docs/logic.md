# things

## apply form at `/apply`

- calendar features
  - an officer selects times to set on form at `/admin/times`
  - applicants select their own available times in availability grid view
- resumes to shared drive

## officer view at `/admin`

- requires signin with google
  - only `ALLOWED_EMAILS` from `.env` can signin
  - only users with access to the shared drive can see resumes

- view all applicants
- click on applicant -> go to page
  - show app form, render resume pdf on website
  - reject button
    - remove their available times (from db)
  - accept button
    - select first available time slot of applicant still in db
      - remove all overlapping time slots from available times (from db)
      - add selected time slot to officer's google calendar
    - if applicant time slot unavailable:
      - send manual email to applicant
    - send interview email
    - book zach rooms manually

- `/admin/times`: availability grid for officers
  - each user is assigned a random color on page load
  - User can select times over someone else's time section, with the color of a section representing the most recent officer who selected that time. Unselecting a section shows any other most recent user's availability in that section (if any).
  - Can't select times if user is filtered out of view
