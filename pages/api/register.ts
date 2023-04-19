import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "../../lib/prismadb";
import { error } from "console";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();

      const { email, password, name } = req.body;

      const existingUSer = await prismadb.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUSer) {
        return res.status(422).json({ error: "Email Taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prismadb.user.create({
        data: {
          email,
          name,
          hashedPassword,
          image: "",
          emailVerified: new Date(),
        },
      });

      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
};

export default handler;
