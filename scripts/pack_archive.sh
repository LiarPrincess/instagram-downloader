rm -r -f "./COPIED"
mkdir "./COPIED"

# -r - recursive
# -q - quiet
zip -r -q "./COPIED/cache"  "./cache"
zip -r -q "./COPIED/output" "./output"
zip -r -q "./COPIED/src"    "./src"
