const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

const handler = async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/auth/, "");

  // Step 1: Redirect user to GitHub for authorization
  if (!path || path === "/" || path === "") {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/.netlify/functions/auth/callback`;
    const scope = "repo,user";

    const authUrl = `${GITHUB_AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl },
    });
  }

  // Step 2: Handle callback from GitHub
  if (path === "/callback") {
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("Missing code parameter", { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(`Error: ${tokenData.error_description}`, { status: 401 });
    }

    // Send the token back to Decap CMS via postMessage
    const html = `
<!DOCTYPE html>
<html>
  <head><title>Authentication</title></head>
  <body>
    <script>
      (function() {
        function receiveMessage(e) {
          console.log("receiveMessage %o", e);
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: "github" })}',
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new Response("Not found", { status: 404 });
};

export default handler;

export const config = {
  path: ["/.netlify/functions/auth", "/.netlify/functions/auth/*"],
};
