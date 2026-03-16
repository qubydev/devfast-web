"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { RiGithubFill, RiCheckboxCircleFill, RiUploadCloud2Fill, RiRefreshLine, RiDeleteBin6Line } from "react-icons/ri";

interface TemplateForm {
    id: string;
    githubURL: string;
    title: string;
    description: string;
    technologies: string[];
    trusted: boolean;
    nextSteps: string;
}

const defaultForm: TemplateForm = {
    id: "",
    githubURL: "",
    title: "",
    description: "",
    technologies: [],
    trusted: false,
    nextSteps: "",
};

export default function AdminPage() {
    const [form, setForm] = useState<TemplateForm>(defaultForm);
    const [techInput, setTechInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleTrusted = () => {
        setForm((prev) => ({ ...prev, trusted: !prev.trusted }));
    };

    const handleReset = () => {
        setForm(defaultForm);
        setTechInput("");
        toast("Form cleared", { icon: "🗑️" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.id || !form.githubURL || !form.title) {
            toast.error("ID, GitHub URL, and Title are required.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Uploading template...");

        try {
            const res = await fetch("/api/admin/template", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message || `Server error: ${res.status}`);
            }

            toast.success("Template uploaded successfully!", { id: toastId });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            toast.error(message, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-2xl mx-auto px-4 py-12">

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Identity</p>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium" htmlFor="id">Template ID <span className="text-destructive">*</span></label>
                            <input
                                id="id"
                                name="id"
                                value={form.id}
                                onChange={handleChange}
                                placeholder="e.g. nextjs-saas-starter"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium" htmlFor="title">Title <span className="text-destructive">*</span></label>
                            <input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Next.js SaaS Starter"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="A short description of what this template does..."
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                        <div className="flex items-center gap-2 mb-1">
                            <RiGithubFill className="text-foreground text-base" />
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">GitHub</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium" htmlFor="githubURL">GitHub URL <span className="text-destructive">*</span></label>
                            <input
                                id="githubURL"
                                name="githubURL"
                                value={form.githubURL}
                                onChange={handleChange}
                                placeholder="e.g. https://github.com/user/repo"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Details</p>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Technologies</label>
                            <input
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onBlur={() => {
                                    const parsed = techInput.split(",").map((t) => t.trim()).filter(Boolean);
                                    setForm((prev) => ({ ...prev, technologies: parsed }));
                                }}
                                placeholder="e.g. React, TypeScript, Tailwind CSS"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                            />
                            {form.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {form.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium"
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const next = form.technologies.filter((t) => t !== tech);
                                                    setForm((prev) => ({ ...prev, technologies: next }));
                                                    setTechInput(next.join(", "));
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition"
                                            >
                                                <RiDeleteBin6Line className="text-sm" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium" htmlFor="nextSteps">Next Steps</label>
                            <textarea
                                id="nextSteps"
                                name="nextSteps"
                                value={form.nextSteps}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Instructions or steps to get started with this template..."
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none h-40"
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
                            <div>
                                <p className="text-sm font-medium">Trusted Template</p>
                                <p className="text-xs text-muted-foreground">Mark this template as verified and trusted</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleTrusted}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${form.trusted
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                                    }`}
                            >
                                <RiCheckboxCircleFill className="text-sm" />
                                {form.trusted ? "Trusted" : "Not Trusted"}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg border border-border bg-secondary text-secondary-foreground px-4 py-2.5 text-sm font-medium hover:bg-secondary/70 transition disabled:opacity-50"
                        >
                            <RiRefreshLine className="text-base" />
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                        >
                            <RiUploadCloud2Fill className="text-base" />
                            {loading ? "Uploading..." : "Upload Template"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}