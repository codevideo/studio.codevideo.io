/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  flags: {
    DEV_SSR: true
  },
  siteMetadata: {
    title: `CodeVideo Studio`,
    description: `Make educational software videos in minutes, not weeks`,
    siteUrl: `https://studio.codevideo.io`,
    author: `Chris Frewin <hi@fullstackcraft.com>`,
  },
  plugins: [
    'gatsby-plugin-postcss'
  ],
}
