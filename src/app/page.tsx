"use client";

import { SearchBar } from '@/components/client/search-bar';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect } from 'react';
import { TemplateType } from '@/models/template';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaGithub } from 'react-icons/fa';
import { IoMdDownload } from "react-icons/io";
import { PkgInstallCmd } from '@/components/pkg-install-cmd';
import { formatNumberAbbreviated } from '@/lib/helpers';
import { Spinner } from '@/components/ui/spinner';
import toast from 'react-hot-toast';

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

type SearchQuery = {
  text: string;
  technologies: string[];
};

export default function Home() {
  const [query, setQuery] = useState<SearchQuery>({
    text: "",
    technologies: [],
  });

  const [results, setResults] = useState<TemplateType[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const search = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.text) params.set("text", query.text);
      query.technologies.forEach((t) => params.append("technologies", t));
      params.set("page", String(page));

      const res = await fetch(`/api/template?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResults(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch templates.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    search(1);
  }, []);

  return (
    <main className="flex flex-col items-center pb-8">
      <div className="max-w-5xl p-4 w-full flex items-center gap-2">
        <SearchBar onChange={setQuery} onSubmit={() => search(1)} />
        <Button className="h-10" onClick={() => search(1)} disabled={loading}>
          Search
        </Button>
      </div>

      <div className="max-w-5xl w-full px-4">
        {loading ? (
          <div className="flex items-center justify-center pt-10">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No templates found. Try adjusting your search criteria.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {results.map((template) => (
                <div key={template._id.toString()} className="border rounded-lg p-4 flex flex-col gap-2">

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-primary text-xs font-semibold">{template.id}</span>
                      {template.trusted && (
                        <RiVerifiedBadgeFill className="text-blue-500" />
                      )}
                    </div>
                    <span className="text-sm text-primary font-bold">
                      <IoMdDownload className="inline mr-1" />
                      {formatNumberAbbreviated(template.downloads)}
                    </span>
                  </div>

                  <p className="font-medium">{template.title}</p>

                  {template.description && (
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {template.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-primary/10 px-2 py-0.5 rounded text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <div className="flex-1 min-w-0 overflow-x-auto">
                      <PkgInstallCmd pkg={template.id} />
                    </div>
                    <a
                      href={template.githubURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                    >
                      <Button variant="ghost" size="icon">
                        <FaGithub className="size-5" />
                      </Button>
                    </a>
                  </div>

                </div>
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => search(pagination.page - 1)}
                >
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages || loading}
                  onClick={() => search(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}