#!/usr/bin/env bash
# Drop the agent kit into a target repository.
#
#   ./agent-kit/install.sh /path/to/repo            # AGENTS.md + .agents/ (skills + validator)
#   ./agent-kit/install.sh /path/to/repo --evals    # also copy the live-model eval runner
#
# Never overwrites an existing file; it reports and skips.
set -euo pipefail

target="${1:-}"
[ -n "$target" ] || { echo "usage: $0 <target-repo> [--evals]" >&2; exit 1; }
[ -d "$target" ] || { echo "not a directory: $target" >&2; exit 1; }

with_evals=false
[ "${2:-}" = "--evals" ] && with_evals=true

source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/template" && pwd)"
copied=0
skipped=0

copy() {
  local from="$1" to="$2"
  if [ -e "$to" ]; then
    echo "  skip    ${to#"$target"/} (exists)"
    skipped=$((skipped + 1))
    return
  fi
  mkdir -p "$(dirname "$to")"
  cp -R "$from" "$to"
  echo "  copied  ${to#"$target"/}"
  copied=$((copied + 1))
}

echo "Installing agent kit into $target"
copy "$source_dir/AGENTS.md"                     "$target/AGENTS.md"
copy "$source_dir/.agents/README.md"             "$target/.agents/README.md"
copy "$source_dir/.agents/skills/_TEMPLATE"      "$target/.agents/skills/_TEMPLATE"
copy "$source_dir/.agents/tools"                 "$target/.agents/tools"

if $with_evals; then
  copy "$source_dir/.agents/evals"               "$target/.agents/evals"
  copy "$source_dir/vitest.skills.config.ts"     "$target/vitest.skills.config.ts"
fi

echo
echo "$copied copied, $skipped skipped."
echo
echo "Next:"
echo "  1. Fill every [FILL] section in AGENTS.md with commands you have actually run."
echo "  2. cp -R .agents/skills/_TEMPLATE .agents/skills/<your-skill>  (rename the frontmatter name to match)"
echo "  3. node .agents/tools/validate-skills.mjs"
if $with_evals; then
  echo "  4. Add devDeps: vitest valibot @flue/runtime @earendil-works/pi-ai — see .agents/evals/README.md"
fi
