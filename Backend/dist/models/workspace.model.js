import mongoose from "mongoose";
const workspaceShema = new mongoose.Schema({
    name: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    teams: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
}, { timestamps: true });
//# sourceMappingURL=workspace.model.js.map