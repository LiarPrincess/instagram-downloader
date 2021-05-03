# -o - override
# -q - quiet
unzip -q -o "./COPIED/cache"  -d "./COPIED"
unzip -q -o "./COPIED/output" -d "./COPIED"
unzip -q -o "./COPIED/src"    -d "./COPIED"

# -n - do not overwrite an existing file
# -R - copies the directory and the entire subtree
cp -n -R "./COPIED/cache/"  "./cache/"
cp -n -R "./COPIED/output/" "./output/"
cp -n -R "./COPIED/src/"    "./src/"

rm -r -f "./dist"
