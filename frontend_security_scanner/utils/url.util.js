function normalizeUrl(input) {
  try {
    let url = input.trim();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const parsed = new URL(url);

    return parsed.href;
  } catch {
    return null;
  }
}

module.exports = { normalizeUrl };