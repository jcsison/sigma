#!/bin/bash

# This script lints staged and unstaged files in a Git repository.
# - If there are modified files, they are staged and linted.
# - If a branch/commit is specified (default 'main'), it lints the diff against the current HEAD.
# - If there are any deleted or renamed files that are staged, it prints a message and exits.

BRANCH_OR_COMMIT=${1:-main}

MODIFIED_FILES=$(git diff --name-only HEAD)
DIFF_FILES=$(git diff --name-only "$BRANCH_OR_COMMIT...HEAD")

if [ -n "$MODIFIED_FILES" ]; then
  git add .
  bun lint-staged
fi

if [ -n "$DIFF_FILES" ]; then
  RENAMED_OR_DELETED_FILES=$(git diff --cached --name-only --diff-filter=DR)

  if [ -n "$RENAMED_OR_DELETED_FILES" ]; then
    echo "There are renamed or deleted files that are staged. Exiting."
    exit 0
  fi

  bun lint-staged --diff="$BRANCH_OR_COMMIT...HEAD" --diff-filter=dr
fi
