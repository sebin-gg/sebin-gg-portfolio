const CLARITY_PROJECT_ID = "zas9c0vkoo";
const PRODUCTION_HOST = "sebin-gg.vercel.app";

export function clarityInitScriptSource(): string {
  const id = JSON.stringify(CLARITY_PROJECT_ID);
  const host = JSON.stringify(PRODUCTION_HOST);
  // The hostname guard keeps localhost and preview deploys out of the project:
  // only production sessions record, so dev traffic cannot pollute metrics.
  const script = `
(function () {
  if (window.location.hostname !== ${host}) return;
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,"clarity","script",${id});
})();
`;
  return script;
}
