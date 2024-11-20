import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createItem = mutation({
	args: {
		text: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('items', {
			text: args.text
		});
	}
});

export const getItems = query({
	handler: async (ctx) => {
		return ctx.db.query('items').collect();
	}
});