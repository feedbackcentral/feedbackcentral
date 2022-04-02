# Supabase Project

This is the supabase project for Feedback Central, to get started create a copy of `config.example.toml` and edit the secrets/any other variables that you need to be changed. Then you can run `supabase start` to get a local version running. Once this is done you can follow any of the other steps below.

## Functions

| Name              | Description                                                                                                           | Status |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- | ------ |
| classify_feedback | This function makes requests to MindsDB to get a prediction for feedback which is stored within the Supabase instance |   👷🏼   |

### Statuses
All functions have a status, this is show by one of the following emoji:
- 👷🏼 In Development
- 🧪 In Testing
- 🚀 Production
- 🚧 Deprecated
- 🗑️ Deleted