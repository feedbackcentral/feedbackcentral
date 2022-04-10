# Feedback Central

[![Netlify Status](https://api.netlify.com/api/v1/badges/2efe5fbd-dffa-46a7-a2f0-10a11f2ba280/deploy-status)](https://app.netlify.com/sites/feedback-central/deploys) ![Tests](https://github.com/feedbackcentral/feedbackcentral/actions/workflows/test.yml/badge.svg) ![CodeQL](https://github.com/feedbackcentral/feedbackcentral/actions/workflows/codeql.yml/badge.svg)

The AI Powered Feedback Aggregator for the Supabase 2022 Hackathon

## Project URLs
The project is available at [feedbackcentral.io](https://feedbackcentral.io), any pull request also has an automatically generated preview URL.

## How to use the project?
For Olyno/Victor to fill out

## How we use Supabase?
### Database
All of our data is stored in the Supabase hosted PostgreSQL using RLS to protect the data from bad actors.

#### Postgres Functions

We have a couple functions in plpgsql:
- `public.regen_integration_keypair`, this uses pgcrypto to generate a keypair used for validation of requests. It returns the private key and that is the only time it can ver be exposed as we then store the public key as a hex string in the database
- `public.???` This function is used by pg_cron to asynchronously call the ingest function with the relevant headers which are signatures created by `pg_crypto`

### Auth
We support magic links and Twitter OAuth, this is managed by GoTrue from Supabase. This links into the RLS system and the permissions for organizations/teams

### Edge Functions
We have 2 major edge functions:

#### `classify_feedback`
This function takes in the id for a piece of feedback and sends that off to [OpenAI](https://openai.com/) to classify it, once it has been classified the response is sent back as a response and persisted into the database so it dosen't need to be fetched again.

#### `ingest`
This function is run on a cron job or by an integration wanting to record. This function uses a public/private key signature system to validate the request is valid.

## Our Team

| <img src="https://github.com/harryet.png" width="96" height="96"/> | <img src="https://github.com/olyno.png" width="96" height="96"/> | <img src="https://github.com/VictorPeralta.png" width="96" height="96"/> |
|--------------------------------------------------------------------|------------------------------------------------------------------|--------------------------------------------------------------------------|
| <a href="https://github.com/HarryET">HarryET</a>                   | <a href="https://github.com/Olyno">Olyno</a>                     | <a href="https://github.com/VictorPeralta">VictorPeralta</a>             |
| <a href="https://twitter.com/TheHarryET">@TheHarryET</a>           | <a href="https://twitter.com/OlynoWorker">@OlynoWorker</a>       | <a href="https://twitter.com/PeraltaDev">@PeraltaDev</a>                 |