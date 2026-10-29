'use client';

import { useEffect, useState } from 'react';

type SanitizedHtmlProps = {
    html: string;
    className: string;
};

export default function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
    const [sanitizedContent, setSanitizedContent] = useState<{
        source: string;
        html: string;
    } | null>(null);

    useEffect(() => {
        let isCurrent = true;

        void import('dompurify')
            .then(({ default: DOMPurify }) => {
                if (isCurrent) {
                    setSanitizedContent({
                        source: html,
                        html: DOMPurify.sanitize(html, {
                            USE_PROFILES: { html: true },
                        }),
                    });
                }
            })
            .catch(() => {
                if (isCurrent) {
                    setSanitizedContent({ source: html, html: '' });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [html]);

    const safeHtml = sanitizedContent?.source === html ? sanitizedContent.html : '';

    return <div className={className} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}
