import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        returnTo: "/profile",
      });
    } catch (error: any) {
      // Add your own custom error handling
      res.status(error.status || 400).end(error.message);
    }
  },
});
