# Deploy on EC2 after RDS + instance exist

## 1. RDS security group

Inbound **MySQL (3306)** from the **EC2 instance security group** (not `0.0.0.0/0`).

## 2. EC2 security group

**22** — SSH from your IP. **8090** — API (temporary/testing); prefer **443** + reverse proxy later. **8080** — Jenkins only if needed.

## 3. Install Java 17 on EC2

Amazon Linux 2023: `sudo dnf install -y java-17-amazon-corretto-headless`

Ubuntu: `sudo apt update && sudo apt install -y openjdk-17-jre-headless`

## 4. Build JAR

Locally or on Jenkins: `mvn clean package -DskipTests`. Artifact: `target/photoshop-backend-1.0.0.jar`.

## 5. Server layout

```text
/opt/photoshop/photoshop-backend-1.0.0.jar
/opt/photoshop/photoshop-backend.env   # from photoshop-backend.env.example
```

## 6. systemd

Follow comments in `photoshop-backend.service.example`, then:

`sudo systemctl status photoshop-backend`

## 7. Smoke test

`curl -sS "http://127.0.0.1:8090/api/services?page=0&size=1"`

Public (if SG allows): `http://YOUR_PUBLIC_IP:8090/api/...`

## 8. Frontend

Set API base URL to `https://your-api-host/api` and match **CORS** in `photoshop-backend.env`.

---

## How credentials work (deployed)

- The **Next.js** app must use an env var such as **`NEXT_PUBLIC_API_BASE_URL`** pointing at this API (for example `https://your-api-host/api`). That value is baked in at build time for static export / Vercel builds.
- **Users live only in the MySQL database** attached to this backend. Local dev and production are **separate** unless they share the same RDS instance.
- **Login uses email + password** (there is no separate username). The shared route is **`/login`**; `/admin` requires a JWT with **`ROLE_ADMIN`**.

### First-time users on production

1. Open **`/login`** on the deployed site and use **Register** if that email does not exist in prod yet, then **Login**.
2. **Registration** creates **`ROLE_USER`** only. To open `/admin`, the account must also have **`ROLE_ADMIN`**.

### Getting the first admin

**Option A — env bootstrap (recommended one-time):** In `photoshop-backend.env`, set (with real values):

```bash
APP_BOOTSTRAP_ADMIN_ENABLED=true
APP_BOOTSTRAP_ADMIN_EMAIL=admin@yourdomain.com
APP_BOOTSTRAP_ADMIN_PASSWORD=your-strong-password
```

Restart the service **once**. The app creates that admin **only if** no user with `ROLE_ADMIN` exists yet; if the email already exists as a normal user, it **promotes** it and leaves the password unchanged. Then set **`APP_BOOTSTRAP_ADMIN_ENABLED=false`**, remove the password from the file, and restart.

**Option B — SQL (if you already registered and only need the role):** After you know your `users.id` (from a `SELECT` on `users` by email), insert into the element-collection table Hibernate uses for roles (default name **`user_roles`**, column **`user_id`** + **`roles`**):

```sql
-- Example: grant admin to user id 1 (adjust id and verify table/column names in your schema).
INSERT INTO user_roles (user_id, roles) VALUES (1, 'ROLE_ADMIN');
```

Passwords in `users.password` must be **BCrypt**; do not put plain text there.

### Default README sample logins

Documented sample emails such as `admin@photoshop.com` are **not** created automatically unless you enable the bootstrap above with those values (or insert rows manually).
