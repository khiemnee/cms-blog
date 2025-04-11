import express from "express";
import User from "../model/user.js";
import checkAuth from "../middleware/auth.js";
import checkRole from "../middleware/role.js";

const userRouter = new express.Router();

userRouter.post("/auth/register", async (req, res) => {
  try {
    const user = new User({
      ...req.body,
    });

    const token = await user.generateToken();

    await user.save();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findCredentials(req.body.email, req.body.password);
    await user.generateToken();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/auth/me", checkAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(501).send(error.message);
  }
});

userRouter.get("/users", checkAuth, checkRole("admin"), async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(404).send({
        error: "users not found",
      });
    }

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

userRouter.get("/users/:id", checkAuth, async (req, res) => {
  try {
    const users = await User.findById(req.params.id);

    if (!users) {
      return res.status(404).send({
        error: "user not found",
      });
    }

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

userRouter.delete(
  "/users/:id",
  checkAuth,
  checkRole("admin"),
  async (req, res) => {
    try {
        console.log(req.params.id)
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).send({
          error: "user not found",
        });
      }

      await User.deleteOne({ _id: user._id });

      res.status(200).send();
    } catch (error) {
        res.status(500).send(error.message)
    }
  }
);

userRouter.patch('/users/:id',checkAuth,checkRole('admin'),async (req,res)=>{
    try {
        
        const updates = Object.keys(req.body)
        const user = await User.findById(req.params.id)

        if(!user){
            return res.status(404).send('user not found')
        }

        const allowed = ['name','role','email','password','avatar']

        const isAllowed = updates.every((values)=>allowed.includes(values))

        if(!isAllowed){
            return res.status(400).send({
                error : 'field is invalid'
            })
        }

        updates.forEach((value)=>user[value] = req.body[value])

        await user.save()

        res.status(200).send(user)

    } catch 
    (error) {
        res.status(500).send(error.message)
    }
})

export default userRouter;
