const BASE = "/api";

function headers() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body && { body: JSON.stringify(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur serveur");
  return data;
}

// Auth
export const authAPI = {
  register: (body) => req("POST", "/auth/register", body),
  login:    (body) => req("POST", "/auth/login",    body),
  me:       ()     => req("GET",  "/auth/me"),
};

// Links
export const linksAPI = {
  list:   ()         => req("GET",    "/links"),
  create: (body)     => req("POST",   "/links", body),
  update: (id, body) => req("PATCH",  `/links/${id}`, body),
  remove: (id)       => req("DELETE", `/links/${id}`),
};

// Admin
export const adminAPI = {
  stats:            ()              => req("GET",    "/admin/stats"),
  users:            (params = {})   => req("GET",    `/admin/users?${new URLSearchParams(params)}`),
  updatePlan:       (id, plan)      => req("PATCH",  `/admin/users/${id}/plan`,    { plan }),
  banUser:          (id, banned)    => req("PATCH",  `/admin/users/${id}/ban`,     { banned }),
  resetUser:        (id)            => req("PATCH",  `/admin/users/${id}/reset`),
  links:            (params = {})   => req("GET",    `/admin/links?${new URLSearchParams(params)}`),
  deleteLink:       (id)            => req("DELETE", `/admin/links/${id}`),
  toggleLink:       (id)            => req("PATCH",  `/admin/links/${id}/toggle`),
  payments:         (params = {})   => req("GET",    `/admin/payments?${new URLSearchParams(params)}`),
  validatePayment:  (id)            => req("POST",   `/admin/payments/${id}/validate`),
  rejectPayment:    (id)            => req("POST",   `/admin/payments/${id}/reject`),
  stripeCheckout:  (body) => req("POST", "/payments/stripe/checkout", body),
  manualSubmit:    (body) => req("POST", "/payments/manual/submit",   body),
  mySubscription:  ()     => req("GET",  "/payments/my-subscription"),
  adminPending:    ()     => req("GET",  "/payments/admin/pending"),
  adminValidate:   (id)   => req("POST", `/payments/admin/validate/${id}`),
  adminReject:     (id)   => req("POST", `/payments/admin/reject/${id}`),
};