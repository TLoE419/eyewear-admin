# 🚨 Security Incident Remediation Guide

**Date**: October 9, 2025  
**Incident**: Supabase Service Role Key exposed in Git repository

## ⚠️ CRITICAL: What Was Exposed

Your Supabase **Service Role Key** was hardcoded in:

- `cloudflare-pages.toml` (line 11)

This key was likely:

- ✅ Committed to Git history
- ✅ Possibly pushed to a remote repository (GitHub, GitLab, etc.)
- ✅ Accessible to anyone with repo access

## 📋 Immediate Actions (Complete in Order)

### Step 1: Revoke the Compromised Key ⏱️ DO THIS NOW

1. Go to your Supabase project dashboard:

   ```
   https://supabase.com/dashboard/project/avzngmdgeisolmnomegs/settings/api
   ```

2. In the "Project API keys" section, find the **Service Role** key

3. **Generate a new Service Role key** or contact Supabase support to invalidate the old one
   - Note: Supabase doesn't have a built-in "revoke" button, but generating a new project will give you new keys
   - The safest option may be to reset your project API keys if Supabase supports it

### Step 2: Update Environment Variables (Use New Key)

#### For Local Development:

Create or update `.env.local` with the NEW key:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key_here
```

#### For Cloudflare Pages:

1. Go to your Cloudflare Pages dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `SUPABASE_SERVICE_ROLE_KEY` as an **encrypted** environment variable
5. Set the value to your NEW service role key

#### For Vercel (if applicable):

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add `SUPABASE_SERVICE_ROLE_KEY` with your NEW key

### Step 3: Remove Key from Git History

The key is in your Git history and needs to be purged. Here are your options:

#### Option A: Using git-filter-repo (Recommended)

```bash
# Install git-filter-repo
pip install git-filter-repo

# Backup your repo first!
cp -r /Users/tloe/Documents/eyewear-admin /Users/tloe/Documents/eyewear-admin-backup

# Remove the sensitive data
git filter-repo --path cloudflare-pages.toml --invert-paths --force

# Or use a more targeted approach to rewrite just that file:
git filter-repo --replace-text <(echo 'regex:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI2MDI5OSwiZXhwIjoyMDcyODM2Mjk5fQ\.[^"]*==>[REDACTED_SERVICE_KEY]')
```

#### Option B: Using BFG Repo-Cleaner

```bash
# Download BFG
brew install bfg  # macOS

# Create a passwords.txt file with the key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzI2MDI5OSwiZXhwIjoyMDcyODM2Mjk5fQ.YourServiceRoleKey" > passwords.txt

# Run BFG
bfg --replace-text passwords.txt /Users/tloe/Documents/eyewear-admin

# Clean up
cd /Users/tloe/Documents/eyewear-admin
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

#### Option C: Nuclear Option - New Repository

If the above seems too complex:

```bash
# 1. Create a new empty repo on GitHub/GitLab
# 2. Copy all files to a new directory (excluding .git)
rsync -av --exclude='.git' /Users/tloe/Documents/eyewear-admin/ /Users/tloe/Documents/eyewear-admin-clean/

# 3. Initialize new repo
cd /Users/tloe/Documents/eyewear-admin-clean
git init
git add .
git commit -m "Initial commit (security incident cleanup)"
git remote add origin <your-new-repo-url>
git push -u origin main

# 4. Archive or delete the old repository
```

### Step 4: Force Push (If You Cleaned History)

⚠️ **WARNING**: This will rewrite history. Coordinate with your team first!

```bash
# After cleaning with filter-repo or BFG
git push --force --all
git push --force --tags
```

### Step 5: Audit Other Files

Check if the key exists in other locations:

```bash
cd /Users/tloe/Documents/eyewear-admin
grep -r "service_role" --include="*.js" --include="*.ts" --include="*.toml" --include="*.json" .
```

Files that were found with references (already checked):

- ✅ `cloudflare-pages.toml` - **FIXED**
- ✅ `env.example` - Only has placeholder, safe
- ✅ All script files - Only reference env variable, safe
- ✅ API routes - Only reference env variable, safe

### Step 6: Add to .gitignore

Ensure these are in your `.gitignore`:

```
.env
.env.local
.env*.local
.vercel
```

### Step 7: Enable Secret Scanning (If using GitHub)

1. Go to your repository settings
2. Security & analysis
3. Enable "Secret scanning"
4. Enable "Push protection" to prevent future leaks

## 🔍 What to Monitor

After completing the above steps, monitor for:

1. **Unusual database activity** in Supabase dashboard
2. **Unexpected API calls** or storage usage
3. **New rows in tables** you didn't create
4. **Modified RLS policies** or schema changes

Check Supabase logs:

```
https://supabase.com/dashboard/project/avzngmdgeisolmnomegs/logs/postgres-logs
```

## 📚 Prevention for Future

1. ✅ **Never commit secrets to Git**
2. ✅ **Use environment variables for all sensitive data**
3. ✅ **Use secret management tools** (Doppler, Vault, AWS Secrets Manager)
4. ✅ **Enable pre-commit hooks** to scan for secrets:
   ```bash
   npm install --save-dev @commitlint/cli husky
   npx husky-init
   # Add secret scanning to pre-commit hook
   ```
5. ✅ **Use tools like git-secrets or truffleHog**
6. ✅ **Regular security audits**

## ✅ Checklist

- [ ] Revoked old Supabase service key
- [ ] Generated new service key
- [ ] Updated local .env.local with new key
- [ ] Updated Cloudflare Pages environment variables
- [ ] Removed key from cloudflare-pages.toml (already done)
- [ ] Cleaned Git history
- [ ] Force pushed cleaned history to remote
- [ ] Verified key is not in any other files
- [ ] Added proper .gitignore entries
- [ ] Enabled secret scanning on repository
- [ ] Monitored Supabase for unusual activity
- [ ] Documented incident for team
- [ ] Set up pre-commit hooks to prevent future leaks

## 🆘 Need Help?

- Supabase Support: https://supabase.com/docs/support
- GitHub Secret Scanning: https://docs.github.com/en/code-security/secret-scanning
- Git History Rewriting Guide: https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History

---

**Status**: 🔴 ACTIVE INCIDENT - Complete all steps immediately
