import * as React from "react"
import { Helmet } from "react-helmet"

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
    <Helmet>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  )
}
