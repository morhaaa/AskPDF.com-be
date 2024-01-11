import User from "../model/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

class RegisterController {
  public async handleNewUser(req: Request, res: Response) {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate)
      return res.status(409).json({ message: "Username already exist" }); //Conflict

    try {
      //encrypt the password
      const hashedPwd = await bcrypt.hash(password, 10);

      //create and store the new user
      const result = await User.create({
        email: email,
        username: username,
        password: hashedPwd,
      });

      console.log(result);

      res.status(201).json({ success: `New user ${username} created!` });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
}

export default RegisterController;
