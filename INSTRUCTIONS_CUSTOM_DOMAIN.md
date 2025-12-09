# How to Connect Your GoDaddy Domain (`cucs.in`) to Railway

To serve your application on your custom domain, you have two main options. 

## Option 1: Subdomain (Recommended)
**Example:** `vl-pro.cucs.in` or `lms.cucs.in`

This is the cleanest and easiest method. It keeps your app at the "root" of that specific subdomain.

### Step 1: Get DNS Value from Railway
1. Go to your **Railway Dashboard**.
2. Click on your project/service.
3. Go to **Settings** -> **Networking** -> **Custom Domain**.
4. Enter your desired domain: `vl-pro.cucs.in`.
5. Railway will provide a **DNS Record** to add. It usually looks like a **CNAME** pointing to `project-name.up.railway.app` or similar.

### Step 2: Configure GoDaddy
1. Log in to **GoDaddy**.
2. Go to **My Products** -> **Domains** -> Find `cucs.in` -> Click **DNS** or **Manage DNS**.
3. Click **Add New Record**.
4. **Type:** `CNAME`
5. **Name:** `vl-pro` (This matches the subdomain part)
6. **Value:** (Paste the value provided by Railway, e.g., `xxx.up.railway.app`)
7. **TTL:** `1 Hour` (or default)
8. Click **Save**.

### Meaning
Your app will be accessible at `https://vl-pro.cucs.in`.

---

## Option 2: Sub-directory (The "/vl-pro" path)
**Example:** `cucs.in/vl-pro`

**⚠️ Constraints:**
DNS servers do NOT handle paths (the `/vl-pro` part). They only point domains to servers. To achieve this, you must point the **entire** `cucs.in` domain to Railway, and then tell your Next.js app to only run on the `/vl-pro` path.

### Step 1: Point `cucs.in` to Railway
1. In Railway Settings -> Custom Domain, enter `cucs.in` (without subdomains).
2. Get the **A Record** or **CNAME** (often Railway gives a CNAME for root, or specific instructions for root domains).
3. In GoDaddy, update the **A Record** for `@` to point to the IP provided by Railway (or allow CNAME flattening if supported).

### Step 2: Update `next.config.mjs`
You must tell Next.js to serve everything under `/vl-pro`.

**Modify `next.config.mjs`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/vl-pro", // <--- Adds the /vl-pro prefix
};

export default nextConfig;
```

### Meaning
- Your app will be at `https://cucs.in/vl-pro`.
- **Note:** `https://cucs.in/` (root) will result in a 404 unless you set up a redirect or have another page there.
- All your links and images must be relative or account for this base path (Next.js `<Link>` handles this automatically with `basePath` set).

---

## Verdict
I strictly recommend **Option 1 (Subdomain)** (`vl-pro.cucs.in`). It is less prone to broken links and easier to manage without changing your code configuration.
