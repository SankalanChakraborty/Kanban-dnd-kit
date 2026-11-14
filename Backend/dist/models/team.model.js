import mongoose from "mongoose";
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    teamMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            role: {
                type: String,
            },
        },
    ],
}, { timestamps: true });
//# sourceMappingURL=team.model.js.map