#!/bin/bash
# PreToolUse(Bash): block git commit/push when content/ contains private names. Exit 2 = block.
input=$(cat)
cmd=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.command||"")}catch{}})' <<<"$input")
case "$cmd" in
  *"git commit"*|*"git push"*) ;;
  *) exit 0 ;;
esac
cd "$(dirname "$0")/../.." || exit 0
hits=$(grep -rlE "Allan|Oleg|Tôn Nguyễn|IMT Solutions" content/ src/ 2>/dev/null)
if [ -n "$hits" ]; then
  echo "Private names found in: $hits. Run 'pnpm sync' / remove them before committing." >&2
  exit 2
fi
exit 0
