#!/usr/bin/env bash
# Blocks commits that include sensitive files.
# Wired into PreToolUse on Bash(git commit:*) via settings.json.

STAGED=$(git diff --cached --name-only 2>/dev/null)

if echo "$STAGED" | grep -qE '\.(env|key|pem|p12|pfx)$|^\.env(\.|$)|secrets\.json|creds\.md|credentials\.json|\.npmrc|\.netrc'; then
  echo "BLOCKED: sensitive file detected in staged changes:"
  echo "$STAGED" | grep -E '\.(env|key|pem|p12|pfx)$|^\.env(\.|$)|secrets\.json|creds\.md|credentials\.json|\.npmrc|\.netrc'
  exit 2
fi

exit 0
