# Writing the release notes

A file here named after a version, `2.1.0.md`, becomes that release's body verbatim. The release
only ever looks up that exact `<version>.md`, so every other file in this folder is ours to name
and arrange as we like.

## The shape

Open with a short lead: what kind of release this is, and the one thing a reader has to know
before comparing report counts across the upgrade. Then one `###` section per change, each naming
its issue where it has one. Close with the limitations that survive and where each issue stands.

A section says what used to happen, what happens now, and shows it once with a real path and a
real specifier. One concrete example beats three sentences describing the example. Quote the
message the rule actually emits when the wording is what the reader will grep for.

Group the sections when a release has both kinds of change, new checks against changed behaviour:
that is the split a reader upgrading actually cares about.

## The length

`2.0.1.md` is the one to imitate: about 100 lines for five fixes, sections of 12 to 25 lines. A
bigger release earns more, but never proportionally more, because the reader's patience does not
scale with our diff. Twice the changes is not four times the words, and the sections that get
skipped are the ones at the bottom.

If a section is running long, it is usually defending a claim rather than stating one. Write the
claim.

## What goes in a sibling file

The notes answer five questions and nothing else: what starts reporting, what stops reporting,
what new option exists, what breaks, and where to look for more. Everything else belongs in a
sibling detail file that the notes link to once.

Per project tables, enumerations of every case that was checked, and the full working behind a
figure are sibling-file material: worth keeping, and worth keeping off the release page.
`2.1.0-measurements.md` is the example.

## Numbers

A number stays in the notes only when the reader needs it to make a decision. "Thirteen reports
appeared and sixteen disappeared" helps someone decide whether to upgrade this week. The same
figures split across eight projects and four rules do not, because the reader does not own those
projects.

Never add a figure that has not been measured, and never put back one that was removed for being
unreproducible. When a claim cannot be defended with a measurement, cut the claim instead of
adding a table to prop it up. That habit is how a release note turns into an audit trail.

If a section is still waiting on content, leave a marker in upper case where it belongs. The
release refuses to publish a curated file that still carries one, which is the point: a release
body cannot be corrected after it ships.
