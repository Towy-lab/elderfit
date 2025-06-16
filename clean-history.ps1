# Create a new branch without the history
git checkout --orphan temp_branch

# Add all files to the new branch
git add -A

# Commit the changes
git commit -m "Initial commit"

# Delete the main branch
git branch -D main

# Rename the current branch to main
git branch -m main

# Force push to remote repository
git push -f origin main

# Clean up
git gc --aggressive --prune=all 