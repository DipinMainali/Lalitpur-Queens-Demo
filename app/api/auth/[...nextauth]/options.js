import CredentialsProvider from "next-auth/providers/credentials";
import dbConnection from "@/utils/dbconnection";
import User from "@/models/user.model";

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
        await dbConnection();
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
