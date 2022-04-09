# Feedback Central

[![Netlify Status](https://api.netlify.com/api/v1/badges/2efe5fbd-dffa-46a7-a2f0-10a11f2ba280/deploy-status)](https://app.netlify.com/sites/feedback-central/deploys) ![Tests](https://github.com/feedbackcentral/feedbackcentral/actions/workflows/test.yml/badge.svg) ![CodeQL](https://github.com/feedbackcentral/feedbackcentral/actions/workflows/codeql.yml/badge.svg)

The AI Powered Feedback Aggregator for the Supabase 2022 Hackathon

## Feedback Ingest Architecture

### Supabase functions

#### SourceChecker

This function scans the sources table for sources that have their
`next_ingest >= now`, then for each of the sources, created a record in
`IngestJobs` table.

The `IngestJobs` table has a `trigger` on `INSERT`, which then calls
`IngestSource`.

#### IngestSource

This function takes the source as payload, and then reacts accordingly to the
type of source:

- Twitter: Scrape twitter for mentions, hashtags, or text since last timestamp
- G2: Get answers since last timestamp

Then stores each piece of feedback into it's own row in the feedback table.
