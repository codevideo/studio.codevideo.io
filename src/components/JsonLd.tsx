import * as React from "react"
import Head from "next/head"

export interface IJsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Renders one or more JSON-LD structured data scripts in <head>.
 * Accepts a single schema object or an array of schema objects.
 */
export function JsonLd({ schema }: IJsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <Head>
      {schemas.map((s, i) => (
        <script
          key={`json-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, "\\u003c") }}
        />
      ))}
    </Head>
  )
}
