// Smoke / E2E test script — runs against http://localhost:8000
// Skips: Stripe payment + S3 upload (not configured)
//
// Run: node scripts/api-smoke.mjs

const BASE = process.env.BASE_URL || "http://localhost:8000";
const ts = Date.now();

// Two test identities
const userA = {
  userName: `alice_${ts}`,
  email: `alice_${ts}@example.com`,
  password: "Password123",
  fullName: "Alice Test",
};
const adminUser = {
  userName: `admin_${ts}`,
  email: `admin_${ts}@example.com`,
  password: "Password123",
  fullName: "Admin Test",
};

let pass = 0;
let fail = 0;
const log = (ok, label, extra = "") => {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}${extra ? "  " + extra : ""}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}${extra ? "  " + extra : ""}`);
  }
};

const req = async (method, path, { token, body, raw } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (raw) return { status: res.status, json, text };
  return { status: res.status, json };
};

const section = (title) => console.log(`\n=== ${title} ===`);

const main = async () => {
  // ── 0. Health ────────────────────────────────────────────────
  section("0. Healthcheck");
  {
    const r = await req("GET", "/api/v1/healthcheck");
    log(r.status === 200, "GET /healthcheck", `status=${r.status}`);
  }

  // ── 1. Register users ────────────────────────────────────────
  section("1. Auth — register");
  let userAToken, adminToken;
  {
    const r = await req("POST", "/api/v1/auth/register", { body: userA });
    log([200, 201].includes(r.status), "register userA", `status=${r.status} msg=${r.json?.message}`);
  }
  {
    const r = await req("POST", "/api/v1/auth/register", { body: adminUser });
    log([200, 201].includes(r.status), "register adminUser", `status=${r.status}`);
  }

  // ── 2. Login ─────────────────────────────────────────────────
  section("2. Auth — login");
  const tokenOf = (j) =>
    j?.data?.accessToken ||
    j?.data?.["Access Token"] ||
    j?.data?.tokens?.accessToken;
  {
    const r = await req("POST", "/api/v1/auth/login", {
      body: { email: userA.email, password: userA.password },
    });
    userAToken = tokenOf(r.json);
    log(r.status === 200 && !!userAToken, "login userA", `status=${r.status} tokenPresent=${!!userAToken}`);
  }
  {
    const r = await req("POST", "/api/v1/auth/login", {
      body: { email: adminUser.email, password: adminUser.password },
    });
    adminToken = tokenOf(r.json);
    log(r.status === 200 && !!adminToken, "login adminUser", `status=${r.status}`);
  }

  if (!userAToken || !adminToken) {
    console.log("\nABORT: cannot proceed without tokens");
    return summary();
  }

  // ── 3. current-user ──────────────────────────────────────────
  section("3. Auth — current-user");
  let userAId, adminId;
  {
    const r = await req("GET", "/api/v1/auth/current-user", { token: userAToken });
    userAId = r.json?.data?._id || r.json?.data?.user?._id;
    log(r.status === 200 && !!userAId, "GET /current-user (userA)", `status=${r.status}`);
  }
  {
    const r = await req("GET", "/api/v1/auth/current-user", { token: adminToken });
    adminId = r.json?.data?._id || r.json?.data?.user?._id;
    log(r.status === 200 && !!adminId, "GET /current-user (admin)", `status=${r.status}`);
  }

  // ── 4. Promote admin via direct DB write (out-of-band) ───────
  section("4. Promote test admin to super_admin (DB)");
  // We elevate via a one-shot Mongoose script invocation
  const { spawnSync } = await import("node:child_process");
  const promoteScript = `
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../src/models/user.models.js";
await mongoose.connect(process.env.MONGO_URI);
const u = await User.findOneAndUpdate({ email: "${adminUser.email}" }, { role: "super_admin", isEmailVerified: true });
console.log("promoted:", u ? u.email : "not found");
await mongoose.disconnect();
`;
  const fs = await import("node:fs");
  fs.writeFileSync("scripts/_promote.mjs", promoteScript);
  const out = spawnSync(process.execPath, ["scripts/_promote.mjs"], { encoding: "utf8" });
  log(/promoted: /.test(out.stdout), "DB promote admin to super_admin", out.stdout.trim() || out.stderr.trim());
  fs.unlinkSync("scripts/_promote.mjs");

  // re-login admin so token reflects new role
  {
    const r = await req("POST", "/api/v1/auth/login", {
      body: { email: adminUser.email, password: adminUser.password },
    });
    adminToken = tokenOf(r.json);
    log(r.status === 200 && !!adminToken, "re-login admin (new role token)");
  }

  // ── 5. Course CRUD (admin) ───────────────────────────────────
  section("5. Course CRUD");
  let courseId;
  {
    // createCourse expects multipart form-data with thumbnail file. We attempt JSON; if 400 due to thumbnail, log it.
    const r = await req("POST", "/api/v1/courses", {
      token: adminToken,
      body: {
        title: `Test Course ${ts}`,
        label: "test",
        description: "Course used by smoke test",
        totalPrice: 100,
        discountPercent: 10,
      },
    });
    if (r.status === 201) {
      courseId = r.json?.data?._id;
      log(true, "POST /courses (json, no thumbnail)", `id=${courseId}`);
    } else {
      log(false, "POST /courses requires multipart thumbnail — skipping further course-creation tests", `status=${r.status} msg=${r.json?.message}`);
    }
  }

  // If we can't create via JSON, create one directly via DB so subsequent tests can run
  if (!courseId) {
    const fs2 = await import("node:fs");
    const seedScript = `
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { Course } from "../src/models/course.models.js";
import { User } from "../src/models/user.models.js";
await mongoose.connect(process.env.MONGO_URI);
const admin = await User.findOne({ email: "${adminUser.email}" });
const c = await Course.create({
  title: "Seeded Course ${ts}",
  label: "test",
  description: "seeded by smoke",
  totalPrice: 100,
  discountPercent: 10,
  payableAmount: 90,
  thumbnail: [{ url: "http://example.com/t.png", mimetype: "image/png", size: 100 }],
  createdBy: admin._id,
});
console.log("seeded_course:" + c._id.toString());
await mongoose.disconnect();
`;
    fs2.writeFileSync("scripts/_seed.mjs", seedScript);
    const out2 = spawnSync(process.execPath, ["scripts/_seed.mjs"], { encoding: "utf8" });
    const match = out2.stdout.match(/seeded_course:([a-f0-9]+)/);
    courseId = match?.[1];
    log(!!courseId, "DB-seeded course as fallback", `id=${courseId}`);
    fs2.unlinkSync("scripts/_seed.mjs");
  }

  {
    const r = await req("GET", "/api/v1/courses");
    log(r.status === 200, "GET /courses", `status=${r.status} count=${Array.isArray(r.json?.data) ? r.json.data.length : "?"}`);
  }
  {
    const r = await req("GET", `/api/v1/courses/${courseId}`);
    log(r.status === 200, "GET /courses/:courseId", `status=${r.status}`);
  }

  // ── 6. Subject CRUD ──────────────────────────────────────────
  section("6. Subject CRUD");
  let subjectId;
  {
    const r = await req("POST", `/api/v1/courses/${courseId}/subjects`, {
      token: adminToken,
      body: { title: "Subject 1", order: 1 },
    });
    subjectId = r.json?.data?._id;
    log(r.status === 201 && !!subjectId, "POST subject", `status=${r.status}`);
  }
  {
    // GET requires active purchase OR admin
    const r = await req("GET", `/api/v1/courses/${courseId}/subjects`, { token: adminToken });
    log(r.status === 200, "GET subjects (admin)", `status=${r.status} count=${r.json?.data?.length}`);
  }
  {
    const r = await req("GET", `/api/v1/courses/${courseId}/subjects`, { token: userAToken });
    log(r.status === 403, "GET subjects (no purchase) -> 403", `status=${r.status}`);
  }
  {
    const r = await req("PUT", `/api/v1/courses/${courseId}/subjects/${subjectId}`, {
      token: adminToken,
      body: { title: "Subject 1 (renamed)" },
    });
    log(r.status === 200, "PUT subject", `status=${r.status}`);
  }

  // ── 7. Lesson CRUD ───────────────────────────────────────────
  section("7. Lesson CRUD");
  let lessonId;
  {
    const r = await req("POST", `/api/v1/courses/${courseId}/subjects/${subjectId}/lessons`, {
      token: adminToken,
      body: {
        title: "Lesson 1",
        order: 1,
        videoUrl: "https://example.com/video1.mp4",
        duration: 60000,
      },
    });
    lessonId = r.json?.data?._id;
    log(r.status === 201 && !!lessonId, "POST lesson", `status=${r.status}`);
  }
  {
    const r = await req("GET", `/api/v1/courses/${courseId}/subjects/${subjectId}/lessons`, { token: adminToken });
    log(r.status === 200, "GET lessons (admin)", `status=${r.status} count=${r.json?.data?.length}`);
  }

  // ── 8. Grant userA an active purchase via DB so review + content access work ──
  section("8. Seed purchased course for userA (DB)");
  {
    const fs3 = await import("node:fs");
    const grantScript = `
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { PurchasedCourse } from "../src/models/purchasedCourse.models.js";
await mongoose.connect(process.env.MONGO_URI);
const p = await PurchasedCourse.findOneAndUpdate(
  { user: "${userAId}", course: "${courseId}" },
  { user: "${userAId}", course: "${courseId}", status: "active", validTillDate: new Date(Date.now()+86400000*365) },
  { upsert: true, new: true }
);
console.log("granted:" + p._id);
await mongoose.disconnect();
`;
    fs3.writeFileSync("scripts/_grant.mjs", grantScript);
    const out3 = spawnSync(process.execPath, ["scripts/_grant.mjs"], { encoding: "utf8" });
    log(/granted:/.test(out3.stdout), "grant purchase via DB", out3.stdout.trim() || out3.stderr.trim());
    fs3.unlinkSync("scripts/_grant.mjs");
  }
  {
    const r = await req("GET", `/api/v1/courses/${courseId}/subjects`, { token: userAToken });
    log(r.status === 200, "GET subjects (userA after purchase)", `status=${r.status}`);
  }
  {
    const r = await req("GET", "/api/v1/purchased/my-course", { token: userAToken });
    log(r.status === 200, "GET /purchased/my-course", `status=${r.status} count=${r.json?.data?.length}`);
  }

  // ── 9. Reviews ───────────────────────────────────────────────
  section("9. Reviews");
  let reviewId;
  {
    const r = await req("POST", `/api/v1/courses/${courseId}/reviews`, {
      token: userAToken,
      body: { rating: 9, review: "Great course!" },
    });
    reviewId = r.json?.data?._id;
    log(r.status === 201 && !!reviewId, "POST review", `status=${r.status}`);
  }
  {
    const r = await req("GET", `/api/v1/courses/${courseId}/reviews`);
    log(r.status === 200, "GET reviews (public, only approved)", `status=${r.status} count=${r.json?.data?.length}`);
  }
  {
    const r = await req("GET", `/api/v1/courses/${courseId}/reviews?status=pending`, { token: adminToken });
    log(r.status === 200 && r.json?.data?.length >= 1, "GET reviews?status=pending (admin)", `status=${r.status} count=${r.json?.data?.length}`);
  }
  {
    const r = await req("PUT", `/api/v1/courses/${courseId}/reviews/${reviewId}`, {
      token: adminToken,
      body: { status: "approved" },
    });
    log(r.status === 200, "PUT review status -> approved", `status=${r.status}`);
  }
  {
    const r = await req("GET", `/api/v1/courses/${courseId}`);
    const avg = r.json?.data?.[0]?.averageRating ?? r.json?.data?.averageRating;
    log(r.status === 200 && Number(avg) > 0, "course aggregates recomputed", `avg=${avg}`);
  }

  // ── 10. Admin Panel (read-only) ──────────────────────────────
  section("10. Admin Panel");
  for (const path of ["users", "courses", "subjects", "lessons", "reviews", "orders", "admin-requests"]) {
    const r = await req("GET", `/api/v1/admin/panel/${path}`, { token: adminToken });
    log(r.status === 200, `GET /admin/panel/${path}`, `status=${r.status} total=${r.json?.data?.total}`);
  }

  // ── 11. RBAC negative tests ──────────────────────────────────
  section("11. RBAC negative tests");
  {
    const r = await req("POST", `/api/v1/courses/${courseId}/subjects`, {
      token: userAToken,
      body: { title: "x", order: 5 },
    });
    log(r.status === 403, "userA cannot create subject (403)", `status=${r.status}`);
  }
  {
    const r = await req("DELETE", `/api/v1/courses/${courseId}`, { token: userAToken });
    log(r.status === 403, "userA cannot delete course (403)", `status=${r.status}`);
  }
  {
    const r = await req("GET", "/api/v1/admin/panel/users");
    log(r.status === 401, "anonymous cannot hit admin panel (401)", `status=${r.status}`);
  }

  // ── 12. Validator/error handler ──────────────────────────────
  section("12. Validation & error handler");
  {
    const r = await req("POST", "/api/v1/auth/login", { body: { email: "not-email" } });
    log(r.status === 422 || r.status === 400, "invalid login payload -> 4xx", `status=${r.status}`);
  }
  {
    const r = await req("GET", "/api/v1/does-not-exist");
    log(r.status === 404, "404 from notFoundHandler", `status=${r.status}`);
  }

  // ── 13. Order endpoint (Stripe disabled) ─────────────────────
  section("13. Order — expect 500 because Stripe not configured");
  {
    const r = await req("POST", `/api/v1/courses/${courseId}/orders`, { token: userAToken });
    log(r.status === 500, "POST /orders without Stripe -> 500", `status=${r.status} msg=${r.json?.message}`);
  }

  // ── 14. Cleanup (best effort) ────────────────────────────────
  section("14. Cleanup");
  {
    const r = await req("DELETE", `/api/v1/courses/${courseId}/subjects/${subjectId}/lessons/${lessonId}`, { token: adminToken });
    log(r.status === 200, "DELETE lesson", `status=${r.status}`);
  }
  {
    const r = await req("DELETE", `/api/v1/courses/${courseId}/subjects/${subjectId}`, { token: adminToken });
    log(r.status === 200, "DELETE subject", `status=${r.status}`);
  }
  {
    const r = await req("DELETE", `/api/v1/courses/${courseId}`, { token: adminToken });
    log(r.status === 200, "DELETE course", `status=${r.status}`);
  }

  return summary();
};

const summary = () => {
  console.log(`\n=== SUMMARY: ${pass} passed, ${fail} failed ===`);
  process.exit(fail === 0 ? 0 : 1);
};

main().catch((e) => {
  console.error("Test runner crashed:", e);
  process.exit(2);
});
