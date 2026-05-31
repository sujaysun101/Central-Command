#!/usr/bin/env bash
# setup.sh -- installs the software factory into ~/.claude
# Usage: bash setup.sh

set -e
CLAUDE="$HOME/.claude"
REPO="$(cd "$(dirname "$0")" && pwd)"

echo "Installing factory agents..."
mkdir -p "$CLAUDE/agents"
cp "$REPO/agents/"*.md "$CLAUDE/agents/"

echo "Installing skills..."
mkdir -p "$CLAUDE/skills/feature-factory" "$CLAUDE/skills/build-with-tests"
cp "$REPO/skills/feature-factory/SKILL.md" "$CLAUDE/skills/feature-factory/"
cp "$REPO/skills/build-with-tests/SKILL.md" "$CLAUDE/skills/build-with-tests/"

echo "Installing hooks..."
mkdir -p "$CLAUDE/hooks"
cp "$REPO/hooks/pre-commit-gate.sh" "$CLAUDE/hooks/"
chmod +x "$CLAUDE/hooks/pre-commit-gate.sh"

echo "Installing Cursor rules into current project..."
if [ -d ".cursor" ] || [ -f ".cursorrules" ]; then
  mkdir -p ".cursor/rules"
  cp "$REPO/cursor-rules/"*.mdc ".cursor/rules/"
  echo "Cursor rules installed into .cursor/rules/"
else
  echo "No .cursor dir found -- run setup.sh from inside a project to install Cursor rules"
fi

echo ""
echo "Done. Restart Claude Code to pick up the new agents and skills."
echo "Then type: /feature-factory  I want to <feature>"
