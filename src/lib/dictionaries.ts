import type { Locale } from "@/lib/locale";
import type { NavItemDef } from "@/lib/navigation";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { navItems, profile, projects, siteMeta, skills, timeline } from "@/lib/site";

/**
 * One locale's view of every user-visible string. English values are derived
 * from `site.ts` (single source of truth); Hindi and Malayalam are committed
 * pre-translations, so pages render statically with zero client-side
 * translation code and nothing is sent to a third party.
 *
 * Keep array order aligned with `site.ts` (`timeline`, `projects`, `skills`):
 * `dictionaries.test.ts` guards the lengths, but the order itself must match.
 */
export interface Dictionary {
  locale: Locale;
  skipToContent: string;
  primaryNav: string;
  mobileNav: string;
  openMenu: string;
  closeMenu: string;
  navAbout: string;
  navExperience: string;
  navProjects: string;
  navSkills: string;
  navBlog: string;
  resumeShort: string;
  downloadResume: string;
  toLight: string;
  toDark: string;
  language: string;
  heroIntro: string;
  heroRole: string;
  heroTagline: string;
  heroFocus: readonly string[];
  focusAreas: string;
  viewProjects: string;
  githubProfile: string;
  linkedinProfile: string;
  xProfile: string;
  highlights: string;
  factsEmail: string;
  factsCollege: string;
  /** Template with `{short}` and `{year}`, e.g. "CEC Chengannur · class of 2028". */
  collegeLineTemplate: string;
  statsProjects: string;
  statsClass: string;
  aboutTitle: string;
  bio: readonly string[];
  quickFacts: string;
  degreeLabel: string;
  degreeValue: string;
  collegeLabel: string;
  collegeValue: string;
  cgpaLabel: string;
  experienceTitle: string;
  timelineTitles: readonly string[];
  timelinePeriods: readonly string[];
  timelineSummaries: readonly (readonly string[])[];
  projectsTitle: string;
  projectTaglines: readonly string[];
  projectDescriptions: readonly string[];
  projectHighlights: readonly string[];
  liveDemo: string;
  moreExperiments: string;
  /** Template with `{name}`, e.g. "Aegis on GitHub". */
  onGithubTemplate: string;
  skillsTitle: string;
  skillGroups: readonly string[];
  skillItems: readonly (readonly string[])[];
  blogCtaTitle: string;
  comingSoon: string;
  blogCtaBody: string;
  blogCtaLink: string;
  blogTitle: string;
  blogLede: string;
  emptyTitle: string;
  emptyBody: string;
  pipeline: string;
  planned: readonly string[];
  followGithub: string;
  a11yTitle: string;
  a11yLede: string;
  a11ySemanticTitle: string;
  a11ySemanticBody: string;
  a11yContrastTitle: string;
  a11yContrastBody: string;
  a11yMotionTitle: string;
  a11yMotionBefore: string;
  a11yMotionAfter: string;
  backToPortfolio: string;
  footerAccessibility: string;
  sendEmail: string;
  footerDegree: string;
  footerCollege: string;
  footerLocation: string;
  metaTitle: string;
  metaDescription: string;
  blogMetaDescription: string;
  a11yMetaDescription: string;
}

const en: Dictionary = {
  locale: "en",
  skipToContent: "Skip to content",
  primaryNav: "Primary",
  mobileNav: "Mobile",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  navAbout: navItems[0].label,
  navExperience: navItems[1].label,
  navProjects: navItems[2].label,
  navSkills: navItems[3].label,
  navBlog: navItems[4].label,
  resumeShort: "Résumé",
  downloadResume: "Download résumé",
  toLight: "Switch to light mode",
  toDark: "Switch to dark mode",
  language: "Language",
  heroIntro: "Introduction",
  heroRole: profile.role,
  heroTagline: profile.tagline,
  heroFocus: profile.focus,
  focusAreas: "Focus areas",
  viewProjects: "View projects",
  githubProfile: "GitHub profile",
  linkedinProfile: "LinkedIn profile",
  xProfile: "X profile",
  highlights: "Profile highlights",
  factsEmail: "Email",
  factsCollege: "College",
  collegeLineTemplate: "{short} · class of {year}",
  statsProjects: "featured projects",
  statsClass: "graduating class",
  aboutTitle: "Who I am",
  bio: profile.bio,
  quickFacts: "Quick facts",
  degreeLabel: "Degree",
  degreeValue: profile.degree,
  collegeLabel: "College",
  collegeValue: profile.college,
  cgpaLabel: "CGPA",
  experienceTitle: "Where I’ve worked & trained",
  timelineTitles: timeline.map((item) => item.title),
  timelinePeriods: timeline.map((item) => item.period),
  timelineSummaries: timeline.map((item) => [...item.summary]),
  projectsTitle: "Things I’ve built",
  projectTaglines: projects.map((project) => project.tagline),
  projectDescriptions: projects.map((project) => project.description),
  projectHighlights: projects.map((project) => project.highlight ?? ""),
  liveDemo: "Live demo",
  moreExperiments: "More experiments on",
  onGithubTemplate: "{name} on GitHub",
  skillsTitle: "Toolbox",
  skillGroups: skills.map((group) => group.group),
  skillItems: skills.map((group) => [...group.items]),
  blogCtaTitle: "Notes & write-ups",
  comingSoon: "Coming soon",
  blogCtaBody:
    "First posts are planned around OWASP drills, the brevity-prompt extension, and what 2G performance budgets taught me. No newsletter spam — just a feed.",
  blogCtaLink: "See what’s planned",
  blogTitle: "Notes & write-ups",
  blogLede: "Security walkthroughs, project post-mortems, and performance notes.",
  emptyTitle: "No posts yet",
  emptyBody:
    "I’m drafting the first few write-ups. They’ll land here as I finish them. If you want to know when that happens, the cheapest way is watching this repo on GitHub.",
  pipeline: "In the pipeline",
  planned: [
    "OWASP Bootcamp 2025: what a phishing drill actually taught me",
    "Inside brevity-prompt: cutting 40–65% of tokens with pure regex",
    "Shipping a portfolio that loads on 2G — budgets, fonts, trade-offs",
    "Local AI on the edge: building Aegis’ Ollama pipeline",
  ],
  followGithub: "Follow on GitHub",
  a11yTitle: "Accessibility statement",
  a11yLede:
    "This portfolio is designed to be lightweight, semantic, and navigable by keyboard, touch, and assistive technologies.",
  a11ySemanticTitle: "Semantic HTML & ARIA",
  a11ySemanticBody:
    "All interactive elements use standard native elements (<button>, <a>, <nav>) with explicit labels, roles, and focus outlines.",
  a11yContrastTitle: "Contrast & theme",
  a11yContrastBody:
    "Both dark and light color palettes adhere to WCAG AA contrast thresholds across all typography and interactive states.",
  a11yMotionTitle: "Motion preferences",
  a11yMotionBefore: "The site respects system ",
  a11yMotionAfter:
    " settings, disabling non-essential animations for users with vestibular sensitivities.",
  backToPortfolio: "Return to portfolio",
  footerAccessibility: "Accessibility",
  sendEmail: "Send an email",
  footerDegree: profile.degree,
  footerCollege: profile.college,
  footerLocation: profile.location,
  metaTitle: siteMeta.title,
  metaDescription: siteMeta.description,
  blogMetaDescription:
    "Write-ups on security drills, prompt engineering, and shipping fast websites. Coming soon.",
  a11yMetaDescription: "Accessibility statement and standards for Sebin Mathew’s portfolio.",
};

/** Tech stacks and tool names stay in Latin script; only group names that read as prose are translated. */
function translateSkillGroups(
  names: Record<string, string>,
  items: Record<string, readonly string[]>,
): { groups: string[]; lists: (readonly string[])[] } {
  return {
    groups: skills.map((group) => names[group.group] ?? group.group),
    lists: skills.map((group) => items[group.group] ?? [...group.items]),
  };
}

const skillHi = translateSkillGroups(
  {
    Languages: "भाषाएँ",
    "Backend & APIs": "बैकएंड और APIs",
    Frontend: "फ्रंटएंड",
    "Security & systems": "सुरक्षा और सिस्टम",
    "Data & tooling": "डेटा और टूलिंग",
    Performance: "प्रदर्शन",
    "Soft skills": "सॉफ्ट स्किल्स",
    "Spoken languages": "बोली जाने वाली भाषाएँ",
  },
  {
    Performance: ["Lighthouse", "Core Web Vitals", "प्रदर्शन बजट"],
    "Soft skills": ["परियोजना समन्वय", "कार्यक्रम आयोजन", "टीम सहयोग", "समुदाय निर्माण"],
    "Spoken languages": ["अंग्रेज़ी", "हिन्दी", "मलयालम"],
  },
);

const skillMl = translateSkillGroups(
  {
    Languages: "ഭാഷകൾ",
    "Backend & APIs": "ബാക്കെൻഡ് & APIs",
    Frontend: "ഫ്രണ്ടെൻഡ്",
    "Security & systems": "സുരക്ഷ & സിസ്റ്റങ്ങൾ",
    "Data & tooling": "ഡാറ്റ & ടൂളിംഗ്",
    Performance: "പ്രകടനം",
    "Soft skills": "സോഫ്റ്റ് സ്കിൽസ്",
    "Spoken languages": "സംസാരഭാഷകൾ",
  },
  {
    Performance: ["Lighthouse", "Core Web Vitals", "പ്രകടന ബജറ്റുകൾ"],
    "Soft skills": ["പ്രോജക്ട് ഏകോപനം", "പരിപാടി സംഘാടനം", "ടീം സഹകരണം", "കമ്മ്യൂണിറ്റി നിർമ്മാണം"],
    "Spoken languages": ["ഇംഗ്ലീഷ്", "ഹിന്ദി", "മലയാളം"],
  },
);

const hi: Dictionary = {
  locale: "hi",
  skipToContent: "मुख्य सामग्री पर जाएँ",
  primaryNav: "मुख्य",
  mobileNav: "मोबाइल",
  openMenu: "मेन्यू खोलें",
  closeMenu: "मेन्यू बंद करें",
  navAbout: "परिचय",
  navExperience: "अनुभव",
  navProjects: "प्रोजेक्ट्स",
  navSkills: "कौशल",
  navBlog: "ब्लॉग",
  resumeShort: "रिज़्यूमे",
  downloadResume: "रिज़्यूमे डाउनलोड करें",
  toLight: "लाइट मोड पर जाएँ",
  toDark: "डार्क मोड पर जाएँ",
  language: "भाषा",
  heroIntro: "परिचय",
  heroRole: "बी.टेक कंप्यूटर साइंस छात्र · फुल-स्टैक और सुरक्षा टूलिंग",
  heroTagline: "फुल-स्टैक वेब ऐप्लिकेशन, ब्राउज़र एक्सटेंशन और लोकल सुरक्षा टूल बना रहा हूँ।",
  heroFocus: ["साइबर सुरक्षा", "बैकएंड सिस्टम", "ऑटोमेशन", "प्राइवेसी-फर्स्ट"],
  focusAreas: "मुख्य क्षेत्र",
  viewProjects: "प्रोजेक्ट्स देखें",
  githubProfile: "GitHub प्रोफ़ाइल",
  linkedinProfile: "LinkedIn प्रोफ़ाइल",
  xProfile: "X प्रोफ़ाइल",
  highlights: "प्रोफ़ाइल झलकियाँ",
  factsEmail: "ईमेल",
  factsCollege: "कॉलेज",
  collegeLineTemplate: "{short} · {year} की कक्षा",
  statsProjects: "चुनिंदा प्रोजेक्ट्स",
  statsClass: "ग्रेजुएशन वर्ष",
  aboutTitle: "मैं कौन हूँ",
  bio: [
    "मैं चेंगन्नूर इंजीनियरिंग कॉलेज में कंप्यूटर साइंस का छात्र हूँ। हाल में मैंने ब्राउज़र में चलने वाले प्रॉम्प्ट कंप्रेशन से लेकर लोकल Ollama मॉडलों पर चलने वाले एज इंसिडेंट रिस्पॉन्स डैशबोर्ड तक पर काम किया है।",
    "मैं FOCES CEC के लिए तकनीकी प्रोजेक्ट्स का समन्वय करता हूँ।",
  ],
  quickFacts: "मुख्य तथ्य",
  degreeLabel: "डिग्री",
  degreeValue: "कंप्यूटर साइंस और इंजीनियरिंग में बी.टेक",
  collegeLabel: "कॉलेज",
  collegeValue: "चेंगन्नूर इंजीनियरिंग कॉलेज",
  cgpaLabel: "CGPA",
  experienceTitle: "मैंने जहाँ काम किया और सीखा",
  timelineTitles: [
    "परियोजना समन्वयक",
    "छात्र दूत",
    "बैकएंड और AI इंजीनियर",
    "प्रतिभागी",
    "हैकाथॉन विजेता",
  ],
  timelinePeriods: ["अप्रैल 2026 – वर्तमान", "दिसंबर 2025 – वर्तमान", "2025", "2025", "अगस्त 2025"],
  timelineSummaries: [
    [
      "छात्र कंप्यूटर साइंस एसोसिएशन के लिए इंजीनियरिंग प्रोजेक्ट्स और तकनीकी कार्यशालाओं का समन्वय।",
      "कैंपस में हैकाथॉन और सामुदायिक बिल्ड सत्र आयोजित करना।",
    ],
    ["इंजीनियरिंग साथियों को ओपन-सोर्स रोडमैप, हैकाथॉन और तकनीकी बूटकैंप से जोड़ना।"],
    [
      "10 घंटे के हैकाथॉन में तीन लोगों की टीम के साथ ऑन-डिवाइस इंसिडेंट रिस्पॉन्स डैशबोर्ड बनाया।",
      "बिना क्लाउड API के नकली हमलों को वर्गीकृत करने और फ़ायरवॉल नियम सुझाने के लिए लोकल Ollama LLM जोड़े।",
    ],
    [
      "वेब भेद्यता आकलन, OSINT टोही और सक्रिय नेटवर्क प्रवेश परीक्षण किए।",
      "Gophish से नियंत्रित फ़िशिंग सिमुलेशन चलाए और Nmap से नेटवर्क परिधि का मानचित्रण किया।",
    ],
    [
      "TortoiseLang (slowlang) बनाया — एक व्यंग्यात्मक प्रोग्रामिंग भाषा और IDE, जो तेज़ टाइपिंग पर निष्पादन रोक देता है, साथ में रीयल-टाइम गति निगरानी और ASCII प्रतिक्रिया।",
      "रचनात्मक सॉफ़्टवेयर इंजीनियरिंग और हास्यपूर्ण इवेंट-आधारित आर्किटेक्चर के लिए प्रथम स्थान जीता।",
    ],
  ],
  projectsTitle: "जो मैंने बनाया है",
  projectTaglines: [
    "ऐसी भाषा जो तेज़ टाइपिंग की सज़ा देती है",
    "FOCES इवेंट मंच",
    "सामुदायिक प्रभाव ट्रैकर",
    "लोकल AI वाला साइबर ख़तरा डैशबोर्ड",
    "प्रॉम्प्ट छोटे करने वाला Chrome एक्सटेंशन",
    "मैक्सिमाइज़्ड विंडो की टाइटल बार छिपाने वाला ट्रे ऐप",
  ],
  projectDescriptions: [
    "व्यंग्यात्मक प्रोग्रामिंग भाषा और IDE — ज़्यादा तेज़ टाइप करो तो निष्पादन धीमा, फिर ASCII कछुए का गुस्सा और कविता-सी प्रतिक्रिया।",
    "FOCES वॉलंटियर प्रोजेक्ट के लिए फुल-स्टैक इवेंट प्रबंधन। Pydantic-सत्यापित API, खोज अनुक्रमण, SQLite संग्रहण, रेस्पॉन्सिव डार्क/लाइट UI। GitHub Pages पर लाइव।",
    "ऐसा मंच जहाँ स्वयंसेवक छह क्षेत्रों में प्रभाव दर्ज करते हैं, उपाधियाँ कमाते हैं और निजी डैशबोर्ड में दिखते हैं। bcrypt प्रमाणीकरण के साथ दर-सीमित REST API।",
    "स्ट्रीमिंग टर्मिनल लॉग, स्वचालित हमला सिमुलेशन, iptables शमन आदेश और Ollama से वैकल्पिक लोकल-AI विश्लेषण।",
    "ChatGPT, Claude या Gemini तक पहुँचने से पहले प्रॉम्प्ट ब्राउज़र में ही संपीड़ित करता है — 40–65% कम टोकन। शुद्ध क्लाइंट-साइड regex, शून्य बाहरी निर्भरता।",
    "हल्का Windows ट्रे ऐप जो साफ़ फुलस्क्रीन-से दृश्य के लिए मैक्सिमाइज़्ड विंडो की टाइटल बार स्वतः छिपा देता है। प्रति-ऐप नियंत्रण और ग्लोबल हॉटकी के साथ Win32 API पर एकल C# फ़ाइल।",
  ],
  projectHighlights: ["Useless Projects 2.0 by TinkerHub", "", "", "सुरक्षा", "गोपनीयता", ""],
  liveDemo: "लाइव डेमो",
  moreExperiments: "और प्रयोग",
  onGithubTemplate: "{name} — GitHub पर",
  skillsTitle: "टूलबॉक्स",
  skillGroups: skillHi.groups,
  skillItems: skillHi.lists,
  blogCtaTitle: "नोट्स और लेख",
  comingSoon: "जल्द आ रहा है",
  blogCtaBody:
    "पहले लेख OWASP ड्रिल, brevity-prompt एक्सटेंशन और 2G प्रदर्शन बजट से सीखी बातों पर होंगे। कोई न्यूज़लेटर स्पैम नहीं — बस एक फ़ीड।",
  blogCtaLink: "योजनाएँ देखें",
  blogTitle: "नोट्स और लेख",
  blogLede: "सुरक्षा वॉकथ्रू, प्रोजेक्ट पोस्टमार्टम और प्रदर्शन नोट्स।",
  emptyTitle: "अभी कोई पोस्ट नहीं",
  emptyBody:
    "मैं पहले कुछ लेख लिख रहा हूँ। जैसे-जैसे पूरे होंगे, यहाँ आएँगे। कब आए, यह जानने का सबसे आसान तरीका GitHub पर इस रेपो को वॉच करना है।",
  pipeline: "आने वाले लेख",
  planned: [
    "OWASP बूटकैंप 2025: एक फ़िशिंग ड्रिल ने असल में क्या सिखाया",
    "brevity-prompt के अंदर: शुद्ध regex से 40–65% टोकन कैसे घटाए",
    "2G पर लोड होने वाला पोर्टफ़ोलियो — बजट, फ़ॉन्ट, समझौते",
    "एज पर लोकल AI: Aegis की Ollama पाइपलाइन बनाना",
  ],
  followGithub: "GitHub पर फ़ॉलो करें",
  a11yTitle: "सुगम्यता कथन",
  a11yLede:
    "यह पोर्टफ़ोलियो हल्का, सिमेंटिक और कीबोर्ड, टच तथा सहायक तकनीकों से चलाने योग्य बनाया गया है।",
  a11ySemanticTitle: "सिमेंटिक HTML और ARIA",
  a11ySemanticBody:
    "सभी इंटरैक्टिव तत्व मानक मूल तत्वों (<button>, <a>, <nav>) से बने हैं, जिनमें स्पष्ट लेबल, भूमिकाएँ और फ़ोकस आउटलाइन हैं।",
  a11yContrastTitle: "कंट्रास्ट और थीम",
  a11yContrastBody:
    "डार्क और लाइट दोनों रंग-पट्टियाँ सभी टेक्स्ट और इंटरैक्टिव स्थितियों में WCAG AA कंट्रास्ट सीमा पर खरी उतरती हैं।",
  a11yMotionTitle: "मोशन प्राथमिकताएँ",
  a11yMotionBefore: "यह साइट सिस्टम की ",
  a11yMotionAfter:
    " सेटिंग का सम्मान करती है — वेस्टिबुलर संवेदनशीलता वाले उपयोगकर्ताओं के लिए गैर-ज़रूरी एनिमेशन बंद रहते हैं।",
  backToPortfolio: "पोर्टफ़ोलियो पर लौटें",
  footerAccessibility: "सुगम्यता",
  sendEmail: "ईमेल भेजें",
  footerDegree: "कंप्यूटर साइंस और इंजीनियरिंग में बी.टेक",
  footerCollege: "चेंगन्नूर इंजीनियरिंग कॉलेज",
  footerLocation: "कोट्टयम, केरल, भारत",
  metaTitle: "सेबिन मैथ्यू — फुल-स्टैक डेवलपर और सुरक्षा टूल्स",
  metaDescription:
    "चेंगन्नूर इंजीनियरिंग कॉलेज में कंप्यूटर साइंस छात्र। फुल-स्टैक वेब ऐप्लिकेशन, Chrome एक्सटेंशन और लोकल सुरक्षा टूलिंग बना रहा हूँ।",
  blogMetaDescription:
    "सुरक्षा ड्रिल, प्रॉम्प्ट इंजीनियरिंग और तेज़ वेबसाइट बनाने पर लेख। जल्द आ रहा है।",
  a11yMetaDescription: "सेबिन मैथ्यू के पोर्टफ़ोलियो का सुगम्यता कथन और मानक।",
};

const ml: Dictionary = {
  locale: "ml",
  skipToContent: "പ്രധാന ഉള്ളടക്കത്തിലേക്ക് പോകുക",
  primaryNav: "പ്രധാനം",
  mobileNav: "മൊബൈൽ",
  openMenu: "മെനു തുറക്കുക",
  closeMenu: "മെനു അടയ്ക്കുക",
  navAbout: "എന്നെക്കുറിച്ച്",
  navExperience: "പരിചയം",
  navProjects: "പ്രോജക്ടുകൾ",
  navSkills: "നൈപുണ്യം",
  navBlog: "ബ്ലോഗ്",
  resumeShort: "റെസ്യൂമെ",
  downloadResume: "റെസ്യൂമെ ഡൗൺലോഡ് ചെയ്യുക",
  toLight: "ലൈറ്റ് മോഡിലേക്ക് മാറുക",
  toDark: "ഡാർക്ക് മോഡിലേക്ക് മാറുക",
  language: "ഭാഷ",
  heroIntro: "ആമുഖം",
  heroRole: "ബി.ടെക് കമ്പ്യൂട്ടർ സയൻസ് വിദ്യാർത്ഥി · ഫുൾ-സ്റ്റാക്ക് & സുരക്ഷാ ടൂളിംഗ്",
  heroTagline:
    "ഫുൾ-സ്റ്റാക്ക് വെബ് ആപ്ലിക്കേഷനുകളും ബ്രൗസർ എക്സ്റ്റൻഷനുകളും ലോക്കൽ സുരക്ഷാ ടൂളുകളും നിർമ്മിക്കുന്നു.",
  heroFocus: ["സൈബർ സുരക്ഷ", "ബാക്കെൻഡ് സിസ്റ്റങ്ങൾ", "ഓട്ടോമേഷൻ", "സ്വകാര്യത ആദ്യം"],
  focusAreas: "പ്രധാന മേഖലകൾ",
  viewProjects: "പ്രോജക്ടുകൾ കാണുക",
  githubProfile: "GitHub പ്രൊഫൈൽ",
  linkedinProfile: "LinkedIn പ്രൊഫൈൽ",
  xProfile: "X പ്രൊഫൈൽ",
  highlights: "പ്രൊഫൈൽ പ്രധാനാംശങ്ങൾ",
  factsEmail: "ഇമെയിൽ",
  factsCollege: "കോളേജ്",
  collegeLineTemplate: "{short} · {year} ക്ലാസ്",
  statsProjects: "തിരഞ്ഞെടുത്ത പ്രോജക്ടുകൾ",
  statsClass: "ബിരുദ വർഷം",
  aboutTitle: "ഞാൻ ആരാണ്",
  bio: [
    "ഞാൻ ചെങ്ങന്നൂർ എഞ്ചിനീയറിംഗ് കോളേജിലെ കമ്പ്യൂട്ടർ സയൻസ് വിദ്യാർത്ഥിയാണ്. ബ്രൗസറിൽ പ്രവർത്തിക്കുന്ന പ്രോംപ്റ്റ് കംപ്രഷൻ മുതൽ ലോക്കൽ Ollama മോഡലുകളിൽ പ്രവർത്തിക്കുന്ന എഡ്ജ് ഇൻസിഡന്റ് റെസ്പോൺസ് ഡാഷ്ബോർഡ് വരെ അടുത്തിടെ ചെയ്തിട്ടുണ്ട്.",
    "FOCES CEC-യ്ക്ക് വേണ്ടിയുള്ള സാങ്കേതിക പ്രോജക്ടുകൾ ഞാൻ ഏകോപിപ്പിക്കുന്നു.",
  ],
  quickFacts: "ചുരുക്കവിവരങ്ങൾ",
  degreeLabel: "ബിരുദം",
  degreeValue: "കമ്പ്യൂട്ടർ സയൻസ് & എഞ്ചിനീയറിംഗിൽ ബി.ടെക്",
  collegeLabel: "കോളേജ്",
  collegeValue: "ചെങ്ങന്നൂർ എഞ്ചിനീയറിംഗ് കോളേജ്",
  cgpaLabel: "CGPA",
  experienceTitle: "ഞാൻ പ്രവർത്തിച്ചതും പരിശീലിച്ചതും എവിടെ",
  timelineTitles: [
    "പ്രോജക്ട് കോർഡിനേറ്റർ",
    "സ്റ്റുഡന്റ് അംബാസഡർ",
    "ബാക്കെൻഡ് & AI എഞ്ചിനീയർ",
    "പങ്കാളി",
    "ഹാക്കത്തോൺ വിജയി",
  ],
  timelinePeriods: [
    "ഏപ്രിൽ 2026 – ഇപ്പോൾ",
    "ഡിസംബർ 2025 – ഇപ്പോൾ",
    "2025",
    "2025",
    "ഓഗസ്റ്റ് 2025",
  ],
  timelineSummaries: [
    [
      "വിദ്യാർത്ഥി കമ്പ്യൂട്ടർ സയൻസ് അസോസിയേഷന് വേണ്ടിയുള്ള എഞ്ചിനീയറിംഗ് പ്രോജക്ടുകളും സാങ്കേതിക വർക്ക്ഷോപ്പുകളും ഏകോപിപ്പിക്കുന്നു.",
      "കാമ്പസിൽ ഹാക്കത്തോണുകളും കമ്മ്യൂണിറ്റി ബിൽഡ് സെഷനുകളും സംഘടിപ്പിക്കുന്നു.",
    ],
    [
      "എഞ്ചിനീയറിംഗ് സഹപാഠികളെ ഓപ്പൺ സോഴ്സ് റോഡ്മാപ്പുകളിലേക്കും ഹാക്കത്തോണുകളിലേക്കും സാങ്കേതിക ബൂട്ട്ക്യാമ്പുകളിലേക്കും ബന്ധിപ്പിക്കുന്നു.",
    ],
    [
      "10 മണിക്കൂർ ഹാക്കത്തോണിൽ മൂന്നംഗ സംഘത്തോടൊപ്പം ഓൺ-ഡിവൈസ് ഇൻസിഡന്റ് റെസ്പോൺസ് ഡാഷ്ബോർഡ് നിർമ്മിച്ചു.",
      "ക്ലൗഡ് API-കളില്ലാതെ അനുകരിച്ച ആക്രമണങ്ങളെ തരംതിരിക്കാനും ഫയർവാൾ നിയമങ്ങൾ നിർദ്ദേശിക്കാനും ലോക്കൽ Ollama LLM-കൾ സംയോജിപ്പിച്ചു.",
    ],
    [
      "വെബ് ദുർബലതാ വിലയിരുത്തലുകളും OSINT നിരീക്ഷണവും സജീവ നെറ്റ്വർക്ക് നുഴഞ്ഞുകയറ്റ ലാബുകളും നടത്തി.",
      "Gophish ഉപയോഗിച്ച് നിയന്ത്രിത ഫിഷിംഗ് സിമുലേഷനുകൾ നടത്തി, Nmap ഉപയോഗിച്ച് നെറ്റ്വർക്ക് പരിധി മാപ്പ് ചെയ്തു.",
    ],
    [
      "TortoiseLang (slowlang) നിർമ്മിച്ചു — വേഗത്തിൽ ടൈപ്പ് ചെയ്താൽ എക്സിക്യൂഷൻ തടയുന്ന പരിഹാസപ്രോഗ്രാമിംഗ് ഭാഷയും IDE-യും, തത്സമയ വേഗതാ നിരീക്ഷണവും ASCII പ്രതികരണങ്ങളും സഹിതം.",
      "സർഗാത്മക സോഫ്റ്റ്വെയർ എഞ്ചിനീയറിംഗിനും രസകരമായ ഇവന്റ് അധിഷ്ഠിത ആർക്കിടെക്ചറിനും ഒന്നാം സ്ഥാനം നേടി.",
    ],
  ],
  projectsTitle: "ഞാൻ നിർമ്മിച്ചവ",
  projectTaglines: [
    "വേഗത്തിൽ ടൈപ്പ് ചെയ്താൽ ശിക്ഷിക്കുന്ന ഭാഷ",
    "FOCES ഇവന്റ് പ്ലാറ്റ്ഫോം",
    "കമ്മ്യൂണിറ്റി ഇംപാക്ട് ട്രാക്കർ",
    "ലോക്കൽ AI-യോടെ സൈബർ ഭീഷണി ഡാഷ്ബോർഡ്",
    "പ്രോംപ്റ്റുകൾ ചുരുക്കുന്ന Chrome എക്സ്റ്റൻഷൻ",
    "മാക്സിമൈസ് ചെയ്ത വിൻഡോകളുടെ ടൈറ്റിൽ ബാർ മറയ്ക്കുന്ന ട്രേ ആപ്പ്",
  ],
  projectDescriptions: [
    "പരിഹാസപ്രോഗ്രാമിംഗ് ഭാഷയും IDE-യും — വേഗത്തിൽ ടൈപ്പ് ചെയ്താൽ എക്സിക്യൂഷൻ മന്ദഗതിയിലാകും, പിന്നെ ASCII ആമക്കോപവും കവിതപോലുള്ള പ്രതികരണങ്ങളും.",
    "FOCES വോളന്റിയർ പ്രോജക്ടിനുള്ള ഫുൾ-സ്റ്റാക്ക് ഇവന്റ് മാനേജ്മെന്റ്. Pydantic-സാധൂകരിച്ച API, തിരയൽ സൂചിക, SQLite സംഭരണം, റെസ്പോൺസീവ് ഡാർക്ക്/ലൈറ്റ് UI. GitHub Pages-ൽ ലൈവ്.",
    "വോളന്റിയർമാർ ആറ് മേഖലകളിൽ സ്വാധീനം രേഖപ്പെടുത്തുകയും സ്ഥാനപ്പേരുകൾ നേടുകയും സ്വകാര്യ ഡാഷ്ബോർഡിൽ പ്രത്യക്ഷപ്പെടുകയും ചെയ്യുന്ന പ്ലാറ്റ്ഫോം. bcrypt പ്രാമാണീകരണത്തോടെ നിരക്ക് പരിമിതപ്പെടുത്തിയ REST API.",
    "സ്ട്രീമിംഗ് ടെർമിനൽ ലോഗുകൾ, യാന്ത്രിക ആക്രമണ അനുകരണം, iptables ലഘൂകരണ കമാൻഡുകൾ, Ollama വഴി ഓപ്ഷണൽ ലോക്കൽ-AI വിശകലനം.",
    "ChatGPT, Claude, Gemini എന്നിവയിലെത്തും മുമ്പ് പ്രോംപ്റ്റുകൾ ബ്രൗസറിൽത്തന്നെ ചുരുക്കുന്നു — 40–65% കുറവ് ടോക്കണുകൾ. ശുദ്ധ ക്ലയന്റ്-സൈഡ് regex, ബാഹ്യ ആശ്രിതത്വങ്ങളില്ല.",
    "വൃത്തിയുള്ള ഫുൾസ്ക്രീൻ കാഴ്ചയ്ക്കായി മാക്സിമൈസ് ചെയ്ത വിൻഡോകളുടെ ടൈറ്റിൽ ബാർ സ്വയം മറയ്ക്കുന്ന ഭാരം കുറഞ്ഞ Windows ട്രേ ആപ്പ്. പ്രതി-ആപ്പ് നിയന്ത്രണവും ഗ്ലോബൽ ഹോട്കീകളുമായി Win32 API-യിൽ ഒറ്റ C# ഫയൽ.",
  ],
  projectHighlights: ["Useless Projects 2.0 by TinkerHub", "", "", "സുരക്ഷ", "സ്വകാര്യത", ""],
  liveDemo: "ലൈവ് ഡെമോ",
  moreExperiments: "കൂടുതൽ പരീക്ഷണങ്ങൾ",
  onGithubTemplate: "{name} — GitHub-ൽ",
  skillsTitle: "ടൂൾബോക്സ്",
  skillGroups: skillMl.groups,
  skillItems: skillMl.lists,
  blogCtaTitle: "കുറിപ്പുകളും എഴുത്തുകളും",
  comingSoon: "ഉടൻ വരുന്നു",
  blogCtaBody:
    "ആദ്യ പോസ്റ്റുകൾ OWASP ഡ്രില്ലുകളെക്കുറിച്ചും brevity-prompt എക്സ്റ്റൻഷനെക്കുറിച്ചും 2G പ്രകടന ബജറ്റുകൾ പഠിപ്പിച്ചതിനെക്കുറിച്ചുമായിരിക്കും. ന്യൂസ്ലെറ്റർ സ്പാമില്ല — ഒരു ഫീഡ് മാത്രം.",
  blogCtaLink: "പദ്ധതികൾ കാണുക",
  blogTitle: "കുറിപ്പുകളും എഴുത്തുകളും",
  blogLede: "സുരക്ഷാ വാക്ക്ത്രൂകൾ, പ്രോജക്ട് പോസ്റ്റ്മോർട്ടങ്ങൾ, പ്രകടന കുറിപ്പുകൾ.",
  emptyTitle: "ഇതുവരെ പോസ്റ്റുകളില്ല",
  emptyBody:
    "ആദ്യത്തെ കുറച്ച് എഴുത്തുകളുടെ പണിയിലാണ് ഞാൻ. തീരുന്ന മുറയ്ക്ക് ഇവിടെ വരും. എപ്പോൾ വരുമെന്നറിയാനുള്ള എളുപ്പവഴി GitHub-ൽ ഈ റെപ്പോ വാച്ച് ചെയ്യലാണ്.",
  pipeline: "വരാനുള്ളവ",
  planned: [
    "OWASP ബൂട്ട്ക്യാമ്പ് 2025: ഒരു ഫിഷിംഗ് ഡ്രിൽ യഥാർത്ഥത്തിൽ പഠിപ്പിച്ചത്",
    "brevity-prompt-യ്ക്കുള്ളിൽ: ശുദ്ധ regex കൊണ്ട് 40–65% ടോക്കണുകൾ കുറച്ചത്",
    "2G-യിൽ ലോഡാകുന്ന പോർട്ട്ഫോളിയോ — ബജറ്റുകൾ, ഫോണ്ടുകൾ, വിട്ടുവീഴ്ചകൾ",
    "എഡ്ജിലെ ലോക്കൽ AI: Aegis-ന്റെ Ollama പൈപ്പ്ലൈൻ നിർമ്മിച്ചത്",
  ],
  followGithub: "GitHub-ൽ പിന്തുടരുക",
  a11yTitle: "പ്രവേശനക്ഷമതാ പ്രസ്താവന",
  a11yLede:
    "ഈ പോർട്ട്ഫോളിയോ ഭാരം കുറഞ്ഞതും സെമാന്റിക്തും കീബോർഡ്, ടച്ച്, സഹായ സാങ്കേതികവിദ്യകൾ എന്നിവ കൊണ്ട് ഉപയോഗിക്കാവുന്നതുമാണ്.",
  a11ySemanticTitle: "സെമാന്റിക് HTML & ARIA",
  a11ySemanticBody:
    "എല്ലാ ഇന്ററാക്ടീവ് ഘടകങ്ങളും സാധാരണ നേറ്റീവ് ഘടകങ്ങൾ (<button>, <a>, <nav>) ഉപയോഗിച്ചാണ്, വ്യക്തമായ ലേബലുകളും റോളുകളും ഫോക്കസ് ഔട്ട്ലൈനുകളും സഹിതം.",
  a11yContrastTitle: "കോൺട്രാസ്റ്റ് & തീം",
  a11yContrastBody:
    "ഡാർക്കും ലൈറ്റും എന്നീ രണ്ട് വർണ്ണശ്രേണികളും എല്ലാ ടെക്സ്റ്റിലും ഇന്ററാക്ടീവ് അവസ്ഥകളിലും WCAG AA കോൺട്രാസ്റ്റ് പരിധി പാലിക്കുന്നു.",
  a11yMotionTitle: "ചലന മുൻഗണനകൾ",
  a11yMotionBefore: "സൈറ്റ് സിസ്റ്റത്തിന്റെ ",
  a11yMotionAfter:
    " ക്രമീകരണത്തെ ബഹുമാനിക്കുന്നു — വെസ്റ്റിബുലർ സംവേദനക്ഷമതയുള്ള ഉപയോക്താക്കൾക്ക് അനാവശ്യ ആനിമേഷനുകൾ ഒഴിവാക്കുന്നു.",
  backToPortfolio: "പോർട്ട്ഫോളിയോയിലേക്ക് മടങ്ങുക",
  footerAccessibility: "പ്രവേശനക്ഷമത",
  sendEmail: "ഇമെയിൽ അയയ്ക്കുക",
  footerDegree: "കമ്പ്യൂട്ടർ സയൻസ് & എഞ്ചിനീയറിംഗിൽ ബി.ടെക്",
  footerCollege: "ചെങ്ങന്നൂർ എഞ്ചിനീയറിംഗ് കോളേജ്",
  footerLocation: "കോട്ടയം, കേരളം, ഇന്ത്യ",
  metaTitle: "സെബിൻ മാത്യു — ഫുൾ-സ്റ്റാക്ക് ഡെവലപ്പറും സുരക്ഷാ ടൂളുകളും",
  metaDescription:
    "ചെങ്ങന്നൂർ എഞ്ചിനീയറിംഗ് കോളേജിലെ കമ്പ്യൂട്ടർ സയൻസ് വിദ്യാർത്ഥി. ഫുൾ-സ്റ്റാക്ക് വെബ് ആപ്ലിക്കേഷനുകളും Chrome എക്സ്റ്റൻഷനുകളും ലോക്കൽ സുരക്ഷാ ടൂളിംഗും നിർമ്മിക്കുന്നു.",
  blogMetaDescription:
    "സുരക്ഷാ ഡ്രില്ലുകളെക്കുറിച്ചും പ്രോംപ്റ്റ് എഞ്ചിനീയറിംഗിനെക്കുറിച്ചും വേഗമേറിയ വെബ്സൈറ്റുകൾ നിർമ്മിക്കുന്നതിനെക്കുറിച്ചും എഴുത്തുകൾ. ഉടൻ വരുന്നു.",
  a11yMetaDescription:
    "സെബിൻ മാത്യുവിന്റെ പോർട്ട്ഫോളിയോയുടെ പ്രവേശനക്ഷമതാ പ്രസ്താവനയും മാനദണ്ഡങ്ങളും.",
};

const dictionaries: Record<Locale, Dictionary> = { en, hi, ml };

/** Returns the dictionary for a locale, falling back to English. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

/**
 * Builds route-aware nav items: hrefs stay canonical from `site.ts`, labels
 * come from the dictionary. Hash links work on any locale page as-is; the
 * blog link is prefixed per locale.
 */
export function localizedNavItems(dict: Dictionary, locale: Locale): NavItemDef[] {
  const labels = [
    dict.navAbout,
    dict.navExperience,
    dict.navProjects,
    dict.navSkills,
    dict.navBlog,
  ];
  return navItems.map((item, index) => ({
    label: labels[index] ?? item.label,
    href: localizeBlogHref(item.href, locale),
  }));
}

/** Keeps hash anchors untouched; only the blog route gets a locale prefix. */
function localizeBlogHref(href: string, locale: Locale): string {
  if (href !== "/blog" || locale === DEFAULT_LOCALE) {
    return href;
  }
  return `/${locale}/blog`;
}
