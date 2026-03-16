"use client";

import { useState, useRef } from "react"
import { CiSearch } from "react-icons/ci"
import { Check, X, ChevronDown, SlidersHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import Image from "next/image";

type Tech = {
    name: string
    value: string
    cdn: string
}

type TechnologiesMap = Record<string, Tech[]>

type SearchPayload = {
    text: string
    technologies: string[]
}

type SearchBarProps = {
    onChange?: (payload: SearchPayload) => void,
    onSubmit?: () => void
}

const TECHNOLOGIES: TechnologiesMap = {
    Frontend: [
        { name: "React", value: "react", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Next.js", value: "nextjs", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
        { name: "Vue", value: "vue", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
        { name: "Nuxt.js", value: "nuxtjs", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg" },
        { name: "Angular", value: "angular", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
        { name: "Svelte", value: "svelte", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" },
        { name: "Astro", value: "astro", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg" }
    ],
    Languages: [
        { name: "JavaScript", value: "javascript", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { name: "TypeScript", value: "typescript", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { name: "Python", value: "python", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "Java", value: "java", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
        { name: "PHP", value: "php", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
        { name: "C#", value: "csharp", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
        { name: "Go", value: "go", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" }
    ],
    Backend: [
        { name: "Node.js", value: "nodejs", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Express", value: "express", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { name: "NestJS", value: "nestjs", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg" },
        { name: "Fastify", value: "fastify", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastify/fastify-original.svg" },
        { name: "Django", value: "django", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
        { name: "Flask", value: "flask", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
        { name: "Laravel", value: "laravel", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg" },
        { name: "Spring Boot", value: "spring", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
        { name: "Ruby on Rails", value: "rails", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg" },
        { name: "ASP.NET", value: "dotnet", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg" }
    ],
    Database: [
        { name: "MongoDB", value: "mongodb", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "PostgreSQL", value: "postgresql", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { name: "MySQL", value: "mysql", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { name: "SQLite", value: "sqlite", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
        { name: "Redis", value: "redis", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
        { name: "Firebase", value: "firebase", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
        { name: "Supabase", value: "supabase", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" }
    ],
    API_ORMS: [
        { name: "Prisma", value: "prisma", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" },
    ],
    Styling_UI: [
        { name: "Tailwind CSS", value: "tailwindcss", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
        { name: "Bootstrap", value: "bootstrap", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
        { name: "Sass", value: "sass", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
        { name: "Material UI", value: "mui", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" },
        { name: "Chakra UI", value: "chakraui", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chakraui/chakraui-original.svg" }
    ],
    Dev_Tools: [
        { name: "Vite", value: "vite", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
        { name: "Webpack", value: "webpack", cdn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" }
    ]
}


export function SearchBar({ onChange, onSubmit }: SearchBarProps) {
    const [query, setQuery] = useState("")
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const inputRef = useRef<HTMLInputElement>(null)

    const notify = (newQuery: string, newSelected: Set<string>) => {
        onChange?.({
            text: newQuery.trim(),
            technologies: Array.from(newSelected)
        })
    }

    const toggle = (value: string) => {
        const next = new Set(selected)

        if (next.has(value)) {
            next.delete(value)
        } else {
            next.add(value)
        }

        setSelected(next)
        notify(query, next)
    }

    const clearAll = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const empty = new Set<string>()
        setSelected(empty)
        notify(query, empty)
    }

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        notify(val, selected)
    }

    return (
        <div className="flex flex-col gap-2 w-full min-w-0">
            {/* Search row */}
            <div className="flex items-center gap-2 w-full min-w-0">
                <label
                    htmlFor="search-input"
                    className="
                    flex items-center gap-1 flex-1 min-w-0
                    h-10
                    rounded-md border border-input
                    bg-transparent px-2.5
                    transition-[color,box-shadow]
                    focus-within:border-ring
                    focus-within:ring-3
                    focus-within:ring-ring/50
                    "
                >
                    <CiSearch className="size-4 text-muted-foreground shrink-0" />
                    <input
                        ref={inputRef}
                        id="search-input"
                        value={query}
                        onChange={handleQueryChange}
                        placeholder="Search templates..."
                        className="flex-1 min-w-0 bg-transparent outline-none border-none text-sm text-foreground caret-foreground placeholder:text-muted-foreground"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                onSubmit?.()
                            }
                        }}
                    />
                </label>

                {/* Technology filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="
                            flex items-center gap-1.5 shrink-0
                            h-10 px-3
                            rounded-md border border-input
                            bg-background text-foreground text-xs
                            hover:bg-accent hover:text-accent-foreground
                            transition-colors focus:outline-none
                            focus:ring-2 focus:ring-ring focus:ring-offset-1
                            "
                        >
                            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                            <span className="hidden sm:inline text-muted-foreground">
                                {selected.size > 0 ? `${selected.size} selected` : "Filter"}
                            </span>
                            {selected.size > 0 && (
                                <span className="sm:hidden flex items-center justify-center size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                                    {selected.size}
                                </span>
                            )}
                            <ChevronDown className="size-3 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-[min(384px,calc(100vw-2rem))] p-0"
                        onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                            <span className="text-sm font-semibold text-foreground">Select Technologies</span>
                            {selected.size > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
                                >
                                    <X className="size-3" />
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="overflow-y-auto max-h-72 p-2.5 space-y-3">
                            {Object.entries(TECHNOLOGIES).map(([category, techs]) => (
                                <div key={category}>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1.5">
                                        {category.replace(/_/g, " ")}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {techs.map((tech) => {
                                            const isSelected = selected.has(tech.value)
                                            return (
                                                <button
                                                    key={tech.value}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        toggle(tech.value)
                                                    }}
                                                    className={`
                                                    flex items-center gap-1.5 px-2 py-1 rounded-md text-xs
                                                    border transition-colors cursor-pointer select-none
                                                    ${isSelected
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground hover:border-accent"
                                                        }
                                                        `}
                                                >
                                                    <Image
                                                        src={tech.cdn}
                                                        alt={tech.name}
                                                        width={100}
                                                        height={100}
                                                        className="size-3.5"
                                                        style={isSelected ? { filter: "brightness(0) invert(1)" } : {}}
                                                    />
                                                    {tech.name}
                                                    {isSelected && <Check className="size-3" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}