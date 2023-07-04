# Patterns and Invariants

- Inputs to scripts are always named environment variables.
- Every named environment variable must be prefixed with `XMTPB_`.
- Every environment variable that is accessed in a script must be validated in
  that script.
- Every environment variable that is read in any script must be "declared" and
  documented in `./env.sh`.
- No file other than `./env.sh` may be sourced by any script.
- No environment variable may be set anywhere other than in `./env.sh`. For example, no
  environment variables may be set in a `docker-compose.yml` file.

In this way we can focus all of our documentation, testing, and validation
efforts on the single file `./env.sh`.
