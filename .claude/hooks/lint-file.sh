#!/bin/bash
# PostToolUse(Edit|Write): auto-fix + report ESLint on the edited TS/TSX file. Never blocks.
input=$(cat)
file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.file_path||"")}catch{}})' <<<"$input")
case "$file" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac
cd "$(dirname "$0")/../.." || exit 0
out=$(pnpm exec eslint --fix "$file" 2>&1)
if [ $? -ne 0 ]; then
  msg=$(printf '%s' "$out" | tail -20 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(JSON.stringify(s)))')
  printf '{"systemMessage": %s}\n' "$msg"
fi
exit 0
