import { getServerSession } from "./../../lib/authControllers";
import { findByIdAndDelete } from "../../lib/model";

const handler = async (req, res) => {
  const { method } = req;

  if (method !== "POST")
    return res.status(400).json({
      status: "Error",
      message: "Invalid req method!, route expects POST req",
    });

  const session = await getServerSession(req, res);
  console.log(session); // check if session is working...

  if (!session || session.user.role !== "admin")
    return res.status(400).json({
      status: "Error",
      message: "Please login to create a post!",
    });

  // delete a post...
  try {
    const { postId } = req.body;

    if (!postId && typeof postId !== "string")
      return res.status(400).json({
        status: "Error",
        message: "Post Id is required!",
      });

    const data = await findByIdAndDelete("Posts", postId);

    res.status(204).json({
      status: "Success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      error: error.message,
    });
  }
};

export default handler;
