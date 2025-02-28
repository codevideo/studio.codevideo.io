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
    'gatsby-plugin-postcss',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `CodeVideo Studio`,
        short_name: `CodeVideo`,
        start_url: `/`,
        background_color: `#23ffb2`,
        theme_color: `#23ffb2`,
        display: `minimal-ui`,
        icon: `src/images/favicon.svg`,
      },
    },
  ],
}
