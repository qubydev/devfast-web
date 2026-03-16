import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Template from "@/models/template";
import { z } from "zod";

const getSchema = z.object({
    text: z.string().optional(),

    technologies: z.array(z.string()).optional(),

    page: z.coerce
        .number()
        .min(1, "Page must be at least 1")
        .default(1),

    limit: z.coerce
        .number()
        .min(1)
        .max(50)
        .default(10),
});

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const { searchParams } = req.nextUrl;

        const rawQuery = {
            text: searchParams.get("text") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
            technologies: searchParams.getAll("technologies"),
        };

        const parsed = getSchema.safeParse(rawQuery);

        if (!parsed.success) {
            const errors = parsed.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            return NextResponse.json(
                {
                    error: "Invalid query parameters",
                    fields: errors,
                    message: errors[0]?.message ?? "Invalid request schema",
                },
                { status: 400 }
            );
        }

        const { text, technologies, page, limit } = parsed.data;

        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = {};

        if (technologies && technologies.length > 0) {
            query.technologies = { $all: technologies };
        }

        if (text) {
            const regex = new RegExp(text, "i");

            query.$or = [
                { id: regex },
                { title: regex },
                { description: regex },
                { technologies: regex },
            ];
        }

        const [templates, total] = await Promise.all([
            Template.find(query)
                .sort({ downloads: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Template.countDocuments(query),
        ]);

        return NextResponse.json({
            data: templates,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in GET /api/templates:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};