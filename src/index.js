const parseArgs = require("minimist");
const arguments = parseArgs(process.argv.slice(2));

const { reference, repository, type } = arguments;

if (!repository) throw Error("No repository");

const fetch = require("node-fetch");
const fs = require("fs");
const prismicDom = require("prismic-dom");

const fetchJson = (url) => fetch(url).then((response) => response.json());

const endpoint = `https://${repository}.prismic.io/api/v2`;

const getStructure = async () => {
  const response = await fetchJson(endpoint);
  return {
    masterRef: response.refs[0].ref,
    types: Object.keys(response.types),
  };
};

const getDocumentsByType = async ({ reference, type }) => {
  const { results } = await fetchJson(
    `${endpoint}/documents/search?ref=${reference}&q=[[at(document.type, "${type}")]]`
  );
  return results;
};

(async () => {
  fs.mkdir("prismic_static", () => null);

  const structure = await getStructure();
  reference = reference || structure.reference;

  if (type) {
  } else {
  }
  types.map(async (type) => {
    fs.mkdir(`prismic_static/${type}`, () => null);
    const documents = await getDocumentsByType({ ref: masterRef, type });
    documents.map((document) => {
      if (!document.data.html) return;
      const slug = document.slugs[0];
      fs.writeFile(
        `./prismic_static/${type}/${slug}.html`,
        prismicDom.RichText.asHtml(document.data.html),
        (err) => false
      );
    });
  });
})();
