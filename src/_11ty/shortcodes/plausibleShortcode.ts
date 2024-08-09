export default () => {
  let analyticsWanted = process.env.INCLUDE_ANALYTICS as string;
  let plausibleDomain = process.env.PLAUSIBLE_DOMAIN as string;

  if (analyticsWanted) {
    return `<script async defer data-domain="${plausibleDomain}"
      src="https://plausible.io/js/plausible.js">
    </script>`;
  }

  return "";
};
