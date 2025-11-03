/**
 * Custom tsx configuration to handle non-JS imports
 */

module.exports = {
  // Mock PNG, JPG, SVG and other asset imports
  loader: {
    '.png': 'empty',
    '.jpg': 'empty',
    '.jpeg': 'empty',
    '.gif': 'empty',
    '.svg': 'empty',
    '.webp': 'empty',
    '.ico': 'empty',
    '.woff': 'empty',
    '.woff2': 'empty',
    '.ttf': 'empty',
    '.eot': 'empty',
    '.css': 'empty'
  }
};
