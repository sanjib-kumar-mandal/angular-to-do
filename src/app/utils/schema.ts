export const faqSchema = (
  data: Array<{ question: string; answer: string }>
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.map((el) => {
      return {
        '@type': 'Question',
        name: el.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: el.answer,
        },
      };
    }),
  };
};

export const websiteSchema = (data: {
  appName: string;
  url: URL;
  description: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${data.appName}`,
    url: `${data.url.origin}${data.url.pathname}`,
    description: data.description ?? '',
    publisher: {
      '@type': 'Organization',
      name: `${data.appName}`,
      logo: {
        '@type': 'ImageObject',
        url: `${data.url.origin}/assets/logo/logo.png`,
      },
    },
  };
};
