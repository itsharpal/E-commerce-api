import { User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.id;
        
        const user = await User.findById(userId);
        if (user.role !== 'admin') {
            return res.json("You are not allowed to do this");
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

export default isAdmin;