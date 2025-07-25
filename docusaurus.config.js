// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const dotenv = require("dotenv");
const isDev = process.env.NODE_ENV === "development";
dotenv.config({ path: ".env.local" });

const versions = require("./versions.json");
const lightCodeTheme = require("./codeblock-theme");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const simplePlantUML = require("@akebifiky/remark-simple-plantuml");
const homeShowcaseProjectsPlugin = require("./plugins/home-showcase");
const cryptoPricePlugin = require("./plugins/crypto-price");
const xdrPricePlugin = require("./plugins/xdr-price");
const icpXdrPricePlugin = require("./plugins/icp-xdr-price");
const tailwindPlugin = require("./plugins/tailwind");
const matomoPlugin = require("./plugins/matomo");
const customWebpack = require("./plugins/custom-webpack");
const roadmapDataPlugin = require("./plugins/roadmap-data");
const blogPostsPlugin = require("./plugins/blog-posts");
const externalRedirectsPlugin = require("./plugins/external-redirects");
const whatIsIcpDataPlugin = require("./plugins/what-is-the-ic-cards");
const howItWorksCardsPlugin = require("./plugins/howitworks-cards");
const howItWorksArticlesPlugin = require("./plugins/howitworks-articles");
const math = require("remark-math");
const katex = require("rehype-katex");
const votingRewardsPlugin = require("./plugins/voting-rewards");
const {
  getSplatRedirects,
  getRedirects,
  getExactUrlRedirects,
  getExternalRedirects,
} = require("./plugins/utils/redirects");
const fs = require("fs");
const validateShowcasePlugin = require("./plugins/validate-showcase.js");
const contentfulPlugin = require("./plugins/contentful");
const snsDataPlugin = require("./plugins/sns-data");
const airtablePlugin = require("./plugins/airtable");
const youtubePlugin = require("./plugins/youtube");

const remarkPlugins = [
  math,
  simplePlantUML,
  require("remark-code-import"),
  require("./plugins/remark/validate-links.js"),
];
const rehypePlugins = [katex];

const isDeployPreview = !!process.env.PREVIEW_CANISTER_ID;

if (process.env.PREVIEW_CANISTER_ID) {
  console.log("PREVIEW_CANISTER_ID:", process.env.PREVIEW_CANISTER_ID);
}

const navbarItems = [
  {
    type: "search",
    position: "right",
  },
];

const subnavItems = [
  {
    type: "doc",
    position: "left",
    docId: "home",
    label: "Home",
  },
  {
    type: "docSidebar",
    position: "left",
    sidebarId: "build",
    label: "Building apps",
    activeBasePath: "/docs/build/",
  },
  {
    type: "docSidebar",
    position: "left",
    sidebarId: "defi",
    label: "DeFi",
    activeBasePath: "/docs/defi/",
  },
  {
    type: "docSidebar",
    position: "left",
    sidebarId: "btc",
    label: "Build on Bitcoin",
    activeBasePath: "/docs/build-on-btc/",
  },
  {
    type: "docSidebar",
    position: "left",
    sidebarId: "motoko",
    label: "Motoko",
    activeBasePath: "/docs/motoko/",
  },
  {
    type: "docSidebar",
    position: "left",
    sidebarId: "references",
    label: "References",
    activeBasePath: "/docs/references/",
  },
  {
    type: "dropdown",
    position: "left",
    label: "Resources",
    items: [
      {
        label: "Awesome Internet Computer",
        href: "https://github.com/dfinity/awesome-internet-computer#readme",
      },
      {
        label: "Sample projects",
        href: "https://internetcomputer.org/samples",
      },
      {
        label: "SDK Release Notes",
        type: "doc",
        docId: "other/updates/release-notes/release-notes",
      },
      { label: "Developer Grants", href: "https://dfinity.org/grants" },
      {
        label: "ICP Ninja",
        href: "https://icp.ninja",
      },
      {
        label: "ICP Developer Forum",
        href: "https://forum.dfinity.org/",
      },
      {
        label: "ICP Developer Discord",
        href: "https://discord.internetcomputer.org",
      },
    ],
  },
  /**
   * Add UI tests in development mode
   * process.env.NODE_ENV === "development" && {
   *   label: "UI Tests",
   *   href: "/docs/tests/all",
   */
].filter(Boolean);

/** @type {import("./src/components/Common/MarketingNav").MarketingNavType} */
const marketingNav = {
  mainItems: [
    {
      name: "Learn",
      auxItems: [
        {
          name: "Videos on youtube",
          href: "https://www.youtube.com/dfinity",
        },
        { name: "ICP Wiki", href: "https://wiki.internetcomputer.org/" },
        {
          name: "White paper",
          href: "https://internetcomputer.org/whitepapers/The%20Internet%20Computer%20for%20Geeks.pdf",
        },
        {
          name: "History of ICP",
          href: "https://wiki.internetcomputer.org/wiki/History",
        },
      ],

      sections: [
        {
          name: "Start Here",
          items: [
            // {
            //   name: "The Basics",
            //   href: "/basics",
            //   description: "New to ICP? Read this first",
            // },
            {
              name: "What is ICP",
              href: "/what-is-the-ic",
              description: "Get to know ",
            },
            {
              name: "Capabilities",
              href: "/capabilities",
              description: "Transforming the internet",
            },
            {
              name: "Learn Hub",
              href: "https://learn.internetcomputer.org",
              description: "Expand your ICP knowledge",
            },
            {
              name: "ICP Dashboard",
              href: "https://dashboard.internetcomputer.org/",
              description: "Track key metrics",
            },
            {
              name: "ICP Roadmap",
              href: "/roadmap",
              description: "Highlighting upcoming milestones",
            },
            /*
            {
              name: "ICP Learn Hub",
              href: "https://csojb-wiaaa-aaaal-qjftq-cai.icp0.io/",
              description: "Overview of the technology",
            },*/
            {
              name: "Sustainability",
              href: "/capabilities/sustainability",
              description: "Building green, efficient tech",
            },
            {
              name: "Library",
              href: "/library",
              description: "Resources to get you started",
            },
            /*
            {
              name: "ICP as a Bitcoin L2",
              href: "/bitcoin-integration",
              description: "Bringing smart contracts to Bitcoin",
            },*/
            /*{
              name: "Ethereum Integration",
              href: "/ethereum-integration",
              description: "Native ETH on Internet Computer",
            },*/
            /*
            {
              name: "HTTPS Outcalls",
              href: "/https-outcalls",
              description: "Connecting smart contracts to Web2",
            },*/
          ],
          featured: {
            title: "Chain Fusion",
            href: "/chainfusion",
            image: "/img/nav/featured-chainfusion.webp",
          },
        },
      ],

      socialIcons: [
        {
          label: "Github",
          href: "https://github.com/dfinity",
          iconUrl: "/img/svgIcons/purple/github.svg",
        },
        {
          label: "Discord",
          href: "https://discord.internetcomputer.org",
          iconUrl: "/img/svgIcons/purple/discord.svg",
        },
        {
          label: "X",
          href: "https://twitter.com/dfinitydev",
          iconUrl: "/img/svgIcons/purple/twitter.svg",
        },
        {
          label: "Forum",
          href: "https://forum.dfinity.org/",
          iconUrl: "/img/svgIcons/purple/forum.svg",
        },
      ],
    },
    {
      name: "Use",
      auxItems: [
        {
          name: "Create an internet identity",
          href: "https://identity.ic0.app/",
        },
        { name: "NNS and Staking", href: "https://nns.ic0.app/" },
      ],

      sections: [
        {
          name: "Step into Web3",
          items: [
            {
              name: "Explore dApps",
              href: "/ecosystem",
              description: "Jump into the ICP Ecosystem",
            },
            {
              name: "Use cases",
              href: "/use-cases",
              description: "Built for the real world",
            },
            {
              name: "ICP Token",
              href: "/icp-tokens",
              description: "How to buy native Utility Token",
            },
            {
              name: "Internet Identity",
              href: "/internet-identity",
              description: "Web3 authentication",
            },
            {
              name: "Staking & Governance",
              href: "/nns",
              description: "Govern and get rewards",
            },
            {
              name: "AI on ICP",
              href: "/ai",
              description: "Run AI models as real smart contracts",
            },
            /*
            {
              name: "DAOs on ICP",
              href: "/sns",
              description: "Community-owned services",
            },*/
            /*
            {
              name: "Enterprise Cloud 3.0",
              href: "/enterprise",
              description: "Extend Web2 software with blockchain",
            },*/
            /*
            {
              name: "Gaming",
              href: "/gaming",
              description: "Paradigm shift in Web3 gaming",
            },*/
            /*
            {
              name: "SoFi",
              href: "/social-media-dapps",
              description: "Reclaim social media",
            },*/
            /*
            {
              name: "DeFi",
              href: "/defi",
              description: "Onchain swaps",
            },*/
            /*
            {
              name: "NFTs",
              href: "/nft",
              description: "NFT’s live fully onchain",
            },*/
          ],
          featured: {
            title: "Run AI models as real smart contracts",
            href: "/ai",
            image: "/img/nav/featured-ai.webp",
          },
        },
        // {
        //   name: "Interoperability",
        //   items: [
        //     {
        //       name: "ckBTC",
        //       href: "/ckbtc",
        //       description: "Bitcoin on Web3",
        //     },
        //   ],
        //   featured: {
        //     title: "ckETH coming soon",
        //     image: "/img/nav/featured-interoperability.webp",
        //   },
        // },
      ],

      socialIcons: [
        {
          label: "Github",
          href: "https://github.com/dfinity",
          iconUrl: "/img/svgIcons/purple/github.svg",
        },
        {
          label: "Discord",
          href: "https://discord.internetcomputer.org",
          iconUrl: "/img/svgIcons/purple/discord.svg",
        },
        {
          label: "X",
          href: "https://twitter.com/dfinitydev",
          iconUrl: "/img/svgIcons/purple/twitter.svg",
        },
        {
          label: "Forum",
          href: "https://forum.dfinity.org/",
          iconUrl: "/img/svgIcons/purple/forum.svg",
        },
      ],
    },
    {
      name: "Develop",
      auxItems: [
        {
          name: "Feedback Board",
          href: "https://dx.internetcomputer.org/",
        },
        { name: "Developer grants", href: "https://dfinity.org/grants" },
        {
          name: "Using cycles",
          href: "/docs/building-apps/getting-started/tokens-and-cycles",
        },
      ],

      sections: [
        {
          name: "Start Coding",
          items: [
            {
              name: "Developer Docs",
              href: "/docs/home",
              description: "Find the resources you need quickly",
            },
            {
              name: "Sample code",
              href: "/samples",
              description: "Get inspired by existing projects",
            },
            {
              name: "Web IDE",
              href: "https://icp.ninja",
              description: "Deploy your first dapp with ICP.Ninja",
            },
            {
              name: "Programming languages",
              description: "ICP supports multiple languages",
              href: "/docs/building-apps/essentials/canisters",
            },
            {
              name: "Build on BTC",
              description: "Leveraging Chain Fusion Technology",
              href: "/bitcoin",
            },
            {
              name: "Hackathons",
              description: "Join like-minded hackers",
              href: "https://dfinity.org/hackathons",
            },
            {
              name: "Education Hub",
              href: "/education-hub",
              description: "Comprehensive Learning Resources",
            },
            {
              name: "Developer Forum",
              href: "https://forum.dfinity.org/",
              description: "Join discussions",
            },
          ],
          featured: {
            title: "Developer Docs",
            href: "/docs/home",
            image: "/img/nav/featured-building.webp",
          },
        },
      ],

      socialIcons: [
        {
          label: "Github",
          href: "https://github.com/dfinity",
          iconUrl: "/img/svgIcons/purple/github.svg",
        },
        {
          label: "Discord",
          href: "https://discord.internetcomputer.org",
          iconUrl: "/img/svgIcons/purple/discord.svg",
        },
        {
          label: "X",
          href: "https://twitter.com/dfinitydev",
          iconUrl: "/img/svgIcons/purple/twitter.svg",
        },
        {
          label: "Forum",
          href: "https://forum.dfinity.org/",
          iconUrl: "/img/svgIcons/purple/forum.svg",
        },
      ],
    },
    {
      name: "Participate",
      auxItems: [
        {
          name: "Community grants",
          href: "https://dfinity.org/community-grants/",
        },
        {
          name: "Help & Support",
          href: "https://support.dfinity.org/hc/en-us",
        },
      ],

      sections: [
        {
          name: "Get Involved",
          items: [
            {
              name: "Sovereign network",
              href: "/node-providers",
              description: "Become a Node Provider",
            },
            {
              name: "Events",
              href: "/events",
              description: "Meet fellow Web3 enthusiasts",
            },
            {
              name: "News",
              href: "/news",
              description: "Stay up to date",
            },
            {
              name: "ICP community",
              href: "https://linktr.ee/icp_hubs_network",
              description: "Join the global community",
            },
            {
              name: "Community Blog",
              href: "https://medium.com/dfinity",
              description: "Keep up to date",
            },
            {
              name: "ICP Alliance",
              href: "https://dfinity.org/alliance",
              description: "Lead the Next Web",
            },
          ],
          featured: {
            title: "ICP Alliance",
            subtitle: "Lead the Next Web",
            href: "https://dfinity.org/alliance",
            image: "/img/nav/featured-alliance.webp",
          },
        },
      ],

      socialIcons: [
        {
          label: "Github",
          href: "https://github.com/dfinity",
          iconUrl: "/img/svgIcons/purple/github.svg",
        },
        {
          label: "Discord",
          href: "https://discord.internetcomputer.org",
          iconUrl: "/img/svgIcons/purple/discord.svg",
        },
        {
          label: "X",
          href: "https://twitter.com/dfinitydev",
          iconUrl: "/img/svgIcons/purple/twitter.svg",
        },
        {
          label: "Forum",
          href: "https://forum.dfinity.org/",
          iconUrl: "/img/svgIcons/purple/forum.svg",
        },
      ],
    },
  ],
  auxItems: [
    {
      name: "ICP Dashboard",
      href: "https://dashboard.internetcomputer.org/",
    },
    {
      name: "Developer Grants",
      href: "https://dfinity.org/grants",
    },
    {
      name: "Help & Support",
      href: "https://support.dfinity.org/hc/en-us",
    },
  ],
};

function getImageDataUrl(url) {
  return `data:image/svg+xml;base64,${fs.readFileSync(url).toString("base64")}`;
}

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "Internet Computer",
  tagline:
    "The Internet Computer hosts secure, network-resident code and data. Build web apps without Big Tech and current IT. Applications are immune to cyber attacks and unstoppable, capable of processing tokens, and can run under exclusive DAO control. Build web3 social media, games, DeFi, multichain apps, secure front-ends, ledgers, enterprise apps, and AI models. TCP/IP connected software. Now ICP hosts software.",
  url: isDeployPreview
    ? `https://${process.env.PREVIEW_CANISTER_ID}.icp0.io`
    : "https://internetcomputer.org",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon-32x32.png",
  organizationName: "dfinity",
  projectName: "portal",
  customFields: {
    searchCanisterId: "5qden-jqaaa-aaaam-abfpa-cai",
    marketingNav,
  },
  markdown: {
    mermaid: true,
  },
  scripts: [
    {
      src: "https://widget.kapa.ai/kapa-widget.bundle.js",
      "data-website-id": "08910249-851f-465b-b60f-238d84e1afc1",
      "data-project-name": "Internet Computer",
      "data-project-color": "#172234",
      "data-project-logo":
        "https://s3.coinmarketcap.com/static-gravity/image/2fb1bc84c1494178beef0822179d137d.png",
      "data-modal-override-open-class": "ask-ai-widget-trigger",
      "data-modal-ask-ai-input-placeholder":
        "Ask me a question about the Internet Computer Protocol",
      "data-modal-example-questions":
        "What is the ICP token?, How is the Internet Computer governed?, How do I start building fully onchain Web3?",
      "data-modal-disclaimer":
        " This LLM provides responses are generated automatically and may be inaccurate or outdated. Please take care to verify or validate any responses before making any critical decisions.",
      "data-user-analytics-fingerprint-enabled": "true",
      "data-modal-z-index": "1001",
      async: true,
      "data-button-hide": "true",
    },
  ],
  plugins: [
    "docusaurus-plugin-sass",
    customWebpack,
    tailwindPlugin,
    cryptoPricePlugin,
    icpXdrPricePlugin,
    xdrPricePlugin,
    homeShowcaseProjectsPlugin,
    howItWorksArticlesPlugin,
    howItWorksCardsPlugin,
    votingRewardsPlugin,
    roadmapDataPlugin,
    whatIsIcpDataPlugin,
    matomoPlugin,
    blogPostsPlugin,
    contentfulPlugin,
    snsDataPlugin,
    airtablePlugin,
    youtubePlugin,
    validateShowcasePlugin,
    externalRedirectsPlugin({
      redirects: [...getExternalRedirects(), ...getExactUrlRedirects()],
    }),

    [
      "@docusaurus/plugin-client-redirects",
      {
        fromExtensions: ["html", "md"],
        redirects: getRedirects(),
        createRedirects: (existingPath) => getSplatRedirects(existingPath),
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          lastVersion: versions[0],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          breadcrumbs: false,
          exclude: [
            "references/samples/ADDING_AN_EXAMPLE.md",
            "references/samples/archive/**",
            "references/samples/c/**",
            "references/samples/hosting/README.md",
            "references/samples/hosting/godot-html5-template/**",
            "references/samples/hosting/react/**",
            "references/samples/hosting/unity-webgl-template/**",
            "references/samples/native-apps/**",
            "references/samples/svelte/**",
            "references/samples/wasm/**",
            "motoko/old/**",
          ],
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins,
          rehypePlugins,
          editUrl: "https://github.com/dfinity/portal/edit/master/",
        },
        blog: {
          path: "blog",
          blogSidebarCount: "ALL",
          postsPerPage: "ALL",
          remarkPlugins,
          rehypePlugins,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      }),
    ],
  ],

  // TODO: Remove when ready to integrate internationalization
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: isDeployPreview
  //   ? // Deploy preview: keep it fast!
  //     ['en']
  //   : ['en', 'fr'],
  // },

  themeConfig:
    // NOTE: liveCodeBLock is enabled for possible future feature,
    // but to do that type preset- classic had to be disabled below
    // /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      image: "/img/share.webp",
      colorMode: {
        disableSwitch: false,
        defaultMode: "light",
        respectPrefersColorScheme: true,
      },
      // github codeblock theme configuration
      codeblock: {
        showGithubLink: true,
        githubLinkLabel: "View on GitHub",
        showRunmeLink: false,
        runmeLinkLabel: "Checkout via Runme",
      },
      metadata: [
        {
          // ios safari zooms in when an input field is focused
          // maximum-scale=1 solves the issue
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=5",
        },
      ],
      navbar: {
        hideOnScroll: true,

        logo: {
          alt: "DFINITY Logo",
          src: "/img/IC_logo_horizontal.svg",
        },
        // subnav redeclared to show up in mobile menu
        items: [...navbarItems, ...subnavItems],
      },
      subnav: {
        items: subnavItems,
      },

      // announcementBar:
      //   isDev || isDeployPreview
      //     ? {
      //         id: "local_dev",
      //         content: isDeployPreview
      //           ? `You are currently viewing a preview of this <a href="${
      //               process.env.PR_URL || "https://github.com/dfinity/portal"
      //             }">Pull Request</a>.`
      //           : 'You are currently locally editing the Developer Portal. Contributing guidelines are available <a href="https://github.com/dfinity/portal#contributing">here</a>.',
      //         textColor: "#091E42",
      //         isCloseable: false,
      //       }
      //     : undefined,

      footer: {
        links: [
          {
            items: [
              {
                label: "Internet Computer Association",
                href: "https://lbbne-haaaa-aaaam-absda-cai.icp0.io/",
              },
              {
                label: "Wiki",
                href: "https://wiki.internetcomputer.org/",
              },
              {
                label: "Node Providers",
                href: "/node-providers",
                target: "_self",
              },
              {
                label: "Dashboard",
                href: "https://dashboard.internetcomputer.org/",
              },
            ],
          },
          {
            items: [
              { label: "Developer Grants", href: "https://dfinity.org/grants" },
              {
                label: "Support & Feedback",
                href: "https://support.dfinity.org/hc/en-us",
              },
              {
                label: "Brand Materials",
                href: "https://dfinity.frontify.com/d/pD7yZhsmpqos",
              },
              {
                label: "Press Kit",
                href: "https://dfinity.frontify.com/d/pD7yZhsmpqos/press-kit",
              },
            ],
          },
          {
            title: "SocialMedia",
            items: [
              {
                label: "X",
                to: "https://twitter.com/dfinity",
                iconLight: getImageDataUrl(
                  "./static/img/svgIcons/purple/twitter.svg"
                ),
                icon: `data:image/svg+xml;base64,${fs
                  .readFileSync("./static/img/svgIcons/twitter-white.svg")
                  .toString("base64")}`,
              },
              {
                label: "Telegram",
                to: "https://t.me/+m8tiEFaaNR8xNjNl",
                iconLight: getImageDataUrl(
                  "./static/img/svgIcons/purple/telegram.svg"
                ),
                icon: `data:image/svg+xml;base64,${fs
                  .readFileSync("./static/img/svgIcons/telegram-white.svg")
                  .toString("base64")}`,
              },
              {
                label: "Medium",
                to: "https://medium.com/dfinity-network-blog",
                icon: "data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='white' d='m24 24h-24v-24h24zm-8.986-15.006v7.326c0 .198 0 .234-.127.362l-1.302 1.264v.27h6.32v-.27l-1.257-1.234c-.091-.07-.148-.178-.148-.3 0-.022.002-.043.005-.064v.002-9.07c-.003-.019-.005-.04-.005-.062 0-.121.058-.229.148-.298l.001-.001 1.286-1.234v-.27h-4.456l-3.176 7.924-3.609-7.924h-4.675v.271l1.502 1.813c.127.115.207.281.207.466 0 .022-.001.043-.003.064v-.003 7.126c.007.041.011.088.011.136 0 .222-.088.423-.231.571l-1.69 2.054v.27h4.8v-.27l-1.691-2.054c-.149-.154-.241-.363-.241-.595 0-.04.003-.079.008-.117v.004-6.16l4.215 9.195h.49z'/%3E%3C/svg%3E",
                iconLight: getImageDataUrl(
                  "./static/img/svgIcons/purple/medium.svg"
                ),
              },
              {
                label: "Youtube",
                to: "https://www.youtube.com/dfinity",
                icon: "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='24' height='24' viewBox='0 0 310 310' style='enable-background:new 0 0 310 310;' xml:space='preserve'%3E%3Cg id='XMLID_822_'%3E%3Cpath id='XMLID_823_' fill='white' d='M297.917,64.645c-11.19-13.302-31.85-18.728-71.306-18.728H83.386c-40.359,0-61.369,5.776-72.517,19.938 C0,79.663,0,100.008,0,128.166v53.669c0,54.551,12.896,82.248,83.386,82.248h143.226c34.216,0,53.176-4.788,65.442-16.527 C304.633,235.518,310,215.863,310,181.835v-53.669C310,98.471,309.159,78.006,297.917,64.645z M199.021,162.41l-65.038,33.991 c-1.454,0.76-3.044,1.137-4.632,1.137c-1.798,0-3.592-0.484-5.181-1.446c-2.992-1.813-4.819-5.056-4.819-8.554v-67.764 c0-3.492,1.822-6.732,4.808-8.546c2.987-1.814,6.702-1.938,9.801-0.328l65.038,33.772c3.309,1.718,5.387,5.134,5.392,8.861 C204.394,157.263,202.325,160.684,199.021,162.41z'/%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A",
                iconLight: getImageDataUrl(
                  "./static/img/svgIcons/purple/youtube.svg"
                ),
              },
              {
                label: "Reddit",
                to: "https://www.reddit.com/r/dfinity/",
                icon: "data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath fill-rule='nonzero' fill='white' d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm6.67-10a1.46 1.46 0 0 0-2.47-1 7.12 7.12 0 0 0-3.85-1.23L13 6.65l2.14.45a1 1 0 1 0 .13-.61L12.82 6a.31.31 0 0 0-.37.24l-.74 3.47a7.14 7.14 0 0 0-3.9 1.23 1.46 1.46 0 1 0-1.61 2.39 2.87 2.87 0 0 0 0 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 0 0 0-.44 1.46 1.46 0 0 0 .81-1.33zm-10 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5.81 2.75a3.84 3.84 0 0 1-2.47.77 3.84 3.84 0 0 1-2.47-.77.27.27 0 0 1 .38-.38A3.27 3.27 0 0 0 12 16a3.28 3.28 0 0 0 2.09-.61.28.28 0 1 1 .39.4v-.04zm-.18-1.71a1 1 0 1 1 1-1 1 1 0 0 1-1.01 1.04l.01-.04z'/%3E%3C/g%3E%3C/svg%3E%0A",
                iconLight: getImageDataUrl(
                  "./static/img/svgIcons/purple/reddit.svg"
                ),
              },
              {
                label: "CoinMarketCap",
                to: "https://coinmarketcap.com/currencies/internet-computer/",
                icon: "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.1307 14.3432C19.9566 14.4632 19.7533 14.534 19.5423 14.5481C19.3313 14.5623 19.1204 14.5193 18.9318 14.4237C18.489 14.1735 18.2504 13.587 18.2504 12.7878V10.3382C18.2504 9.16231 17.7846 8.32567 17.0055 8.09854C15.6887 7.71328 14.7054 9.32619 14.3259 9.93283L11.9971 13.702V9.10193C11.9712 8.04104 11.6262 7.40565 10.9736 7.21589C10.5423 7.08939 9.89545 7.14114 9.26581 8.10141L4.05907 16.4592C3.36629 15.1338 3.00708 13.6594 3.01255 12.1639C3.01255 7.12676 7.03764 3.0298 11.9971 3.0298C16.9566 3.0298 20.9961 7.12676 20.9961 12.1639V12.1898C20.9961 12.1898 20.9961 12.207 20.9961 12.2156C21.045 13.1903 20.7287 13.9665 20.1336 14.3432H20.1307ZM23.0058 12.1668V12.1179C22.9655 5.97961 18.0434 1 11.9971 1C5.95086 1 1 6.00836 1 12.1639C1 18.3194 5.93361 23.3306 11.9971 23.3306C14.7781 23.3305 17.4533 22.2645 19.4723 20.3521C19.6683 20.1674 19.7836 19.913 19.7933 19.6439C19.803 19.3748 19.7062 19.1128 19.524 18.9145C19.4369 18.8181 19.3315 18.7399 19.2139 18.6843C19.0964 18.6287 18.969 18.597 18.8392 18.5908C18.7093 18.5847 18.5795 18.6043 18.4572 18.6485C18.335 18.6927 18.2227 18.7606 18.1268 18.8484C17.2575 19.673 16.2306 20.3133 15.1077 20.7311C13.9848 21.1489 12.7891 21.3355 11.5923 21.2796C10.3955 21.2238 9.22229 20.9267 8.14317 20.4061C7.06406 19.8856 6.10127 19.1523 5.3126 18.2504L9.99895 10.7177V14.1937C9.99895 15.8641 10.6458 16.4046 11.1892 16.5627C11.7326 16.7209 12.5635 16.6116 13.4347 15.1971L16.0222 11.0081C16.1027 10.873 16.1803 10.758 16.2493 10.6573V12.7878C16.2493 14.3489 16.8761 15.5967 17.9744 16.212C18.4738 16.4816 19.0365 16.6118 19.6036 16.5891C20.1707 16.5663 20.7212 16.3914 21.1973 16.0826C22.4049 15.2977 23.0633 13.8774 22.9943 12.1668H23.0058Z' fill='white'/%3E%3C/svg%3E%0A",
                iconLight: getImageDataUrl(
                  "./static/img/svgIcons/purple/coinmarketcap.svg"
                ),
              },
              {
                label: "DSCVR",
                to: "https://dscvr.one/p/internet-computer",
                icon: "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_4579_44749)'%3E%3Cpath d='M15.5569 1.39645C14.4968 1.02636 13.3839 0.817527 12.2604 0.783161C12.1388 0.780518 12.0172 0.780518 11.8983 0.780518C11.1766 0.780518 10.4576 0.859822 9.75439 1.01579C9.74144 1.02293 9.72901 1.03006 9.71606 1.0372C9.72796 1.03006 9.73959 1.02293 9.75175 1.01579C6.75138 1.69252 4.52555 3.79675 3.4285 6.9055C2.38961 10.1438 3.2276 13.694 5.6041 16.1287C8.60183 19.1978 13.6403 20.0675 16.8654 16.8398C16.8659 16.8382 16.8667 16.8366 16.8673 16.835C19.6041 14.0934 19.6025 9.65051 16.8628 6.90815C14.1558 4.2012 11.0444 4.41004 7.84314 6.06751L7.64488 6.17061L7.81142 11.2831C7.82305 11.2485 7.83548 11.2157 7.84843 11.184C7.8368 11.217 7.82517 11.2498 7.81406 11.2831L7.91452 14.3787L8.01761 14.4765C8.8556 15.288 9.75439 15.563 10.5897 15.7427L10.4681 8.04485C10.4465 8.05542 10.4253 8.06653 10.4039 8.07763C10.425 8.0652 10.4465 8.05331 10.4681 8.04221C12.2974 7.44742 14.2087 7.82808 15.4115 9.43533C15.4136 9.43691 15.4154 9.4385 15.4176 9.44009C16.4295 10.7957 16.5736 12.6144 15.7869 14.1117C14.1214 17.2997 9.34201 17.1226 7.02101 14.7488C5.8896 13.5909 5.18114 12.0815 5.0146 10.4689C4.69209 7.41305 6.34164 4.48934 9.12524 3.18874L9.53234 3.06979C10.3042 2.86095 11.0999 2.75785 11.8983 2.75785C16.9341 2.75521 21.0157 6.83413 21.021 11.8673C21.021 13.3794 20.6456 14.8677 19.9292 16.1974C19.9168 16.222 19.9041 16.246 19.8917 16.2706C19.4777 17.0243 18.9577 17.7134 18.3484 18.3228C15.4009 21.2676 10.8329 21.7699 7.18227 19.8798C2.66982 17.5456 0.938326 12.285 2.46891 7.55845C2.56672 7.25709 2.41604 6.93194 2.12261 6.81034L2.03538 6.77333L1.89263 7.07469C1.73402 7.40777 1.58863 7.74878 1.46438 8.09772C-0.621338 13.8685 2.36582 20.234 8.13657 22.3197C8.17094 22.333 8.2053 22.3435 8.24231 22.3567C8.34303 22.3758 8.44348 22.3935 8.54393 22.4107C8.44216 22.3938 8.33986 22.376 8.23702 22.3567C14.0263 24.3764 20.3548 21.3231 22.3771 15.5365C24.3967 9.74726 21.3435 3.41873 15.5569 1.39645Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_4579_44749'%3E%3Crect width='22.2001' height='22.199' fill='white' transform='translate(0.799805 0.780518)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
                iconLight: getImageDataUrl(
                  "./static/img/svgIcons/purple/dscvr.svg"
                ),
              },
              {
                label: "Discord",
                to: "https://discord.internetcomputer.org",
                icon: "data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E %3Cpath%20d%3D%22M19.3034%205.33716C17.9344%204.71103%2016.4805%204.2547%2014.9629%204C14.7719%204.32899%2014.5596%204.77471%2014.411%205.12492C12.7969%204.89144%2011.1944%204.89144%209.60255%205.12492C9.45397%204.77471%209.2311%204.32899%209.05068%204C7.52251%204.2547%206.06861%204.71103%204.70915%205.33716C1.96053%209.39111%201.21766%2013.3495%201.5891%2017.2549C3.41443%2018.5815%205.17612%2019.388%206.90701%2019.9187C7.33151%2019.3456%207.71356%2018.73%208.04255%2018.0827C7.41641%2017.8492%206.82211%2017.5627%206.24904%2017.2231C6.39762%2017.117%206.5462%2017.0003%206.68416%2016.8835C10.1438%2018.4648%2013.8911%2018.4648%2017.3082%2016.8835C17.4568%2017.0003%2017.5948%2017.117%2017.7434%2017.2231C17.1703%2017.5627%2016.576%2017.8492%2015.9499%2018.0827C16.2789%2018.73%2016.6609%2019.3456%2017.0854%2019.9187C18.8152%2019.388%2020.5875%2018.5815%2022.4033%2017.2549C22.8596%2012.7341%2021.6806%208.80747%2019.3034%205.33716ZM8.5201%2014.8459C7.48007%2014.8459%206.63107%2013.9014%206.63107%2012.7447C6.63107%2011.5879%207.45884%2010.6434%208.5201%2010.6434C9.57071%2010.6434%2010.4303%2011.5879%2010.4091%2012.7447C10.4091%2013.9014%209.57071%2014.8459%208.5201%2014.8459ZM15.4936%2014.8459C14.4535%2014.8459%2013.6034%2013.9014%2013.6034%2012.7447C13.6034%2011.5879%2014.4323%2010.6434%2015.4936%2010.6434C16.5442%2010.6434%2017.4038%2011.5879%2017.3825%2012.7447C17.3825%2013.9014%2016.5548%2014.8459%2015.4936%2014.8459Z%22%20fill%3D%22white%22%20%2F%3E %3C%2Fsvg%3E",
                iconLight: getImageDataUrl(
                  "./static/img/svgIcons/purple/discord.svg"
                ),
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Internet Computer`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["rust"],
      },
      liveCodeBlock: {
        playgroundPosition: "bottom",
      },
    },
  themes: ["@saucelabs/theme-github-codeblock", "@docusaurus/theme-mermaid"],
  clientModules: [require.resolve("./static/load_moc.ts")],
};

module.exports = config;
