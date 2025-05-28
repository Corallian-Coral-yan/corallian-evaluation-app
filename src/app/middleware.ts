import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Protect all routes under /annotator
export const config = {
  matcher: ["/annotator"],
};
