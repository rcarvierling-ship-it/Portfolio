"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
    const pathname = usePathname();

    // Don't show on home page
    if (pathname === "/") return null;

    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav aria-label="Breadcrumb" className="mb-4 hidden md:block">
            <ol className="flex items-center text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <li>
                    <Link
                        href="/"
                        className="hover:text-foreground transition-colors hover:underline decoration-dashed underline-offset-4"
                    >
                        _HOME
                    </Link>
                </li>
                {segments.map((segment, index) => {
                    const path = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;

                    return (
                        <Fragment key={path}>
                            <li className="mx-2 text-muted-foreground/40 select-none">/</li>
                            <li>
                                {isLast ? (
                                    <span className="text-foreground font-medium">
                                        {segment.replace(/-/g, "_")}
                                    </span>
                                ) : (
                                    <Link
                                        href={path}
                                        className="hover:text-foreground transition-colors hover:underline decoration-dashed underline-offset-4"
                                    >
                                        {segment.replace(/-/g, "_")}
                                    </Link>
                                )}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
