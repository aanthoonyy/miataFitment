#!/usr/bin/env bash
#
# git-sync-dates.sh — set committer date := author date on every commit in a
# range, and repoint .git-blame-ignore-revs at the resulting hashes.
#
# A plain `git rebase` or `git commit --amend` preserves the author date but
# stamps the committer date with the current time. `git log` still looks right,
# so the damage is invisible until you look at GitHub, which sorts and labels by
# committer date. Run this after any rebase to put them back in step.
#
#   ./scripts/git-sync-dates.sh --dry-run
#   ./scripts/git-sync-dates.sh
#
# Messages, trees, author identity and parent order are all preserved; the only
# things that change are the committer timestamp and, if present, the blame
# ignore file's contents. Nothing is written to a ref until every commit has
# been rebuilt and verified.

set -euo pipefail

BLAME_FILE='.git-blame-ignore-revs'

die()  { printf '%s: %s\n' "${0##*/}" "$1" >&2; exit 1; }
info() { printf '%s\n' "$1" >&2; }

dry=0 base=''
while [ $# -gt 0 ]; do
	case "$1" in
		--dry-run|-n) dry=1; shift ;;
		--base) base="${2:?--base needs a rev}"; shift 2 ;;
		-h|--help) sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
		*) die "unknown option: $1" ;;
	esac
done

git rev-parse --git-dir >/dev/null 2>&1 || die "not inside a git repository"
branch=$(git symbolic-ref --quiet --short HEAD) || die "detached HEAD"
[ "$dry" -eq 1 ] || git diff --quiet HEAD -- \
	|| die "uncommitted changes to tracked files; commit or stash first"

if [ -z "$base" ]; then
	for m in main master; do
		git rev-parse --verify --quiet "$m" >/dev/null && { base=$(git merge-base "$m" HEAD); break; }
	done
	[ -n "$base" ] || die "could not guess a base; pass --base <rev>"
fi
base=$(git rev-parse --verify "$base^{commit}")

mapfile -t all < <(git rev-list --reverse "$base..HEAD")
[ "${#all[@]}" -gt 0 ] || die "no commits in $base..HEAD"

# Rebuild from the first commit whose dates disagree; everything before it is
# already correct and keeps its hash.
start=-1
for i in "${!all[@]}"; do
	if [ "$(git show -s --format=%aI "${all[i]}")" != "$(git show -s --format=%cI "${all[i]}")" ]; then
		start=$i; break
	fi
done
if [ "$start" -lt 0 ]; then
	info "all ${#all[@]} commits already have committer date == author date"
	exit 0
fi
info "${#all[@]} commits in range; first mismatch at #$((start + 1)) ($(git rev-parse --short "${all[start]}"))"

TMP=$(mktemp -d); trap 'rm -rf "${TMP:-}"' EXIT
declare -A newof=()

# A pin in the blame file may name a commit from an *earlier* rewrite, so it is
# not in the rebuild map and a plain substitution would miss it. Resolve those
# by subject: the object usually still exists (dangling, kept by the reflog),
# so read its subject and find the commit that carries it today.
declare -A pinfix=()
if git cat-file -e "HEAD:$BLAME_FILE" 2>/dev/null; then
	while read -r pin; do
		case "$pin" in ''|\#*) continue ;; esac
		git merge-base --is-ancestor "$pin" HEAD 2>/dev/null && continue  # still valid
		subj=$(git show -s --format=%s "$pin" 2>/dev/null) \
			|| { info "warning: pinned $pin is gone; cannot repoint it"; continue; }
		hits=0
		for c in "${all[@]}"; do
			if [ "$(git show -s --format=%s "$c")" = "$subj" ]; then
				pinfix["$pin"]="$c"; hits=$((hits + 1))
			fi
		done
		case "$hits" in
			0) info "warning: no current commit matches pinned $pin (\"$subj\")" ;;
			1) info "  repoint pin ${pin:0:7} -> \"$subj\"" ;;
			*) die "subject \"$subj\" matches $hits commits; cannot repoint $pin unambiguously" ;;
		esac
	done < <(git cat-file blob "HEAD:$BLAME_FILE")
fi

parent=$([ "$start" -eq 0 ] && echo "$base" || git rev-parse "${all[start - 1]}")
for i in $(seq "$start" $((${#all[@]} - 1))); do
	old="${all[i]}"
	tree=$(git rev-parse "$old^{tree}")

	# Repoint the blame file at hashes produced earlier in this same loop.
	if git cat-file -e "$old:$BLAME_FILE" 2>/dev/null; then
		git cat-file blob "$old:$BLAME_FILE" >"$TMP/blame"
		# Pins naming a commit from an earlier rewrite, resolved by subject above.
		for p in "${!pinfix[@]}"; do
			cur="${pinfix[$p]}"
			sed -i "s/$p/${newof[$cur]:-$cur}/g" "$TMP/blame"
		done
		# Pins naming a commit this run is rebuilding.
		for o in "${!newof[@]}"; do
			sed -i "s/$o/${newof[$o]}/g" "$TMP/blame"
		done
		if ! cmp -s "$TMP/blame" <(git cat-file blob "$old:$BLAME_FILE"); then
			# hash-object honours .gitattributes/autocrlf; --no-filters keeps the
			# bytes exactly as produced so line endings cannot drift.
			blob=$(git hash-object -w --no-filters -- "$TMP/blame")
			rm -f "$TMP/idx"
			GIT_INDEX_FILE="$TMP/idx" git read-tree "$tree"
			GIT_INDEX_FILE="$TMP/idx" git update-index --cacheinfo "100644,$blob,$BLAME_FILE"
			tree=$(GIT_INDEX_FILE="$TMP/idx" git write-tree)
			info "  patched $BLAME_FILE in $(git rev-parse --short "$old")"
		fi
	fi

	git cat-file commit "$old" | sed '1,/^$/d' >"$TMP/msg"   # raw message bytes
	ad=$(git show -s --format=%aI "$old")

	new=$(
		GIT_AUTHOR_NAME=$(git show -s --format=%an "$old") \
		GIT_AUTHOR_EMAIL=$(git show -s --format=%ae "$old") \
		GIT_AUTHOR_DATE="$ad" \
		GIT_COMMITTER_NAME=$(git show -s --format=%cn "$old") \
		GIT_COMMITTER_EMAIL=$(git show -s --format=%ce "$old") \
		GIT_COMMITTER_DATE="$ad" \
		git commit-tree "$tree" -p "$parent" -F "$TMP/msg"
	) || die "commit-tree failed on $(git rev-parse --short "$old")"

	newof["$old"]="$new"
	printf '  %s -> %s  %s  %s\n' "${old:0:7}" "${new:0:7}" \
		"$(git show -s --format=%cI "$new")" "$(git show -s --format=%s "$new")" >&2
	parent="$new"
done

# Verify before touching anything.
bad=0
for i in $(seq "$start" $((${#all[@]} - 1))); do
	n="${newof[${all[i]}]}"
	[ "$(git show -s --format=%aI "$n")" = "$(git show -s --format=%cI "$n")" ] || bad=$((bad + 1))
	diff -q <(git cat-file commit "${all[i]}" | sed '1,/^$/d') \
	        <(git cat-file commit "$n"        | sed '1,/^$/d') >/dev/null \
		|| die "message drifted on $(git rev-parse --short "${all[i]}")"
done
[ "$bad" -eq 0 ] || die "$bad commit(s) still mismatched; refusing"

info ''
info "verified: committer date == author date on all rebuilt commits, messages unchanged"

if [ "$dry" -eq 1 ]; then
	info "dry run: no refs moved."
	exit 0
fi

git branch "syncdates-backup-$(date +%Y%m%d-%H%M%S)" HEAD
git update-ref -m "sync committer dates" "refs/heads/$branch" "$parent" "$(git rev-parse HEAD)"
git reset --hard --quiet "$branch"   # refresh index/worktree if a tree changed
info "$branch is now $(git rev-parse --short "$parent")"
