The script supports conversion between "wikitext" and HTML formats, as specified in the task. 
It also supports patching with ed-style diffs.

The text format is parsed with regular expressions line by line. The HTML is parsed by searching for heading and list item tags 
with regexps, which is quite hackish and dirty, and liable to break if the HTML is hand-edited, 
but accomplishes the task at hand without writing/loading a proper HTML 
parser. Diff files are parsed with a simple PEG grammar.

The script also supports multi-level headings and nested lists, but see caveats below.

### Tests
* `test/test1.sh` [directory] - Expects M1.txt in the specified directory. It tests conversion to html and back and tests for consistency. Then it does it again to demonstrate that even if there is an inconsistency (see caveats below) in the first conversion, the relevant information is preserved.
* `test/test2.sh` [directory] - Expects M1.txt and M2.txt in the specified directory. It converts M1 to O1, produces a diff of M1 and M2, then patches O1 to produce O3. It then converts M2 directly to O2 and compares it with the patched O3, and also converts O3 to M3 and compares it with M2.
* `test/runtests.sh` - Runs the above tests with provided test cases.

### Caveats:
* Trailing empty lines in the text file produce inconsistency on back-conversion to text, because they're not recorded in the HTML. This is why test1c fails on the first conversion and comparison, but passes when the conversion is retried.
* The script produces HTML fragments, not complete HTML files.
* Nested lists don't produce 100% valid HTML, OL tags are nested directly into parent OL, and not into the parent LI. This could be fixed, but I decided not to bother for the current purpose. Fixing this would also break the current naive HTML parser (which searches for the first matching closing tag, instead of using a proper stack-based or recursive algorithm). It would then have to be replaced with e.g. a SAX parser, but I decided to invest the time into solving the patching task instead.
* The script accepts lists even before the first heading, which are then not wrapped in a section. It probably shouldn't.
