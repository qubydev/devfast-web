import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Template from '@/models/template';
import { z } from 'zod';

const getSchema = z.object({
    id: z.string().trim().min(1, "Template ID is required")
});

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const parsed = getSchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!parsed.success) {
        const errors = parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        const errorMsg = errors.length > 0 ? errors[0].message : "Invalid query parameters";

        return NextResponse.json({
            error: "Invalid query parameters",
            message: errorMsg
        }, { status: 400 });

    }

    const { id } = parsed.data;

    try {
        await connectDB();

        const template = await Template.findOne({ id }).lean();
        if (!template) {
            return NextResponse.json({
                error: `Template "${id}" does not exist`,
                message: `No template found with the specified ID "${id}".`
            }, { status: 404 });
        }

        // Increament downloads count
        const updatedTemplate = await Template.findOneAndUpdate(
            { id },
            { $inc: { downloads: 1 } },
            { new: true, lean: true }
        );

        return NextResponse.json(updatedTemplate, { status: 200 });


    } catch (error: unknown) {
        console.error("Error fetching template:", error);
        return NextResponse.json({
            error: "An error occurred while fetching the template.",
            message: "There was an unexpected error while processing your request. Please try again later."
        }, { status: 500 });
    }
}