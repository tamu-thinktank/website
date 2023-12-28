# things

## form

- calendar features
  - officers select times to set on form
  - applicants select available times (added to db)
- resumes to shared drive

## applicant view

- form at `/apply`

## officer view

- signin at `/admin`
  - only `allowedEmails` from `.env` can signin
  - only users with access to the shared drive can see resumes

- view all applicants

- when clicked on applicant, show app form, render resume pdf on website
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
