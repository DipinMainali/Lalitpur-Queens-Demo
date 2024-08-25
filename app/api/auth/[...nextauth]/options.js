import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/backend/db";
import { User } from "@/backend/models/models";

const options = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      authorize: async (credentials, req) => {
        await dbConnect();
        const user = await User.findOne({
          type: "admin",
          username: credentials?.username,
          password: credentials?.password,
        });

        if (user) {
          // If authentication is successful, return the user object
          return user;
        } else {
          // If authentication fails, return null
          return null;
        }
      },
    }),
  ],
};

export default options;
