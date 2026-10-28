import Image from "next/image";

// Logo preloader: the Samarth mark in the middle of the screen with a green ring spinning
// around it, shown for ~2.5s on the first page of a visit and then faded out.
// It is plain server-rendered HTML with its own styles, so it shows before any JavaScript
// or stylesheet loads. The inline script hides it on later pages of the same session.
const styles = `
.preloader{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:preloader-out .4s ease 2.5s forwards}
.preloader-ring{position:relative;display:flex;align-items:center;justify-content:center;width:150px;height:150px}
.preloader-ring::before{content:"";position:absolute;inset:0;border-radius:9999px;border:3px solid #d6ecdb;border-top-color:#1f8a3d;animation:preloader-spin 1s linear infinite}
.preloader-logo{width:auto;height:84px}
html[data-preloader-seen] .preloader{display:none}
@keyframes preloader-spin{to{transform:rotate(360deg)}}
@keyframes preloader-out{to{opacity:0;visibility:hidden}}
@media (prefers-reduced-motion:reduce){.preloader-ring::before{animation-duration:3s}}
`;

const script = `try{if(sessionStorage.getItem("preloader-seen"))document.documentElement.dataset.preloaderSeen="";else sessionStorage.setItem("preloader-seen","1")}catch(e){}`;

export default function Preloader() {
  return <>
    <style dangerouslySetInnerHTML={{ __html: styles }} />
    <script dangerouslySetInnerHTML={{ __html: script }} />
    <div className="preloader" role="status" aria-label="Loading Samarth Enterprises">
      <div className="preloader-ring">
        <Image src="/logo/samarth-mark.png" alt="" width={229} height={300} priority className="preloader-logo" />
      </div>
    </div>
  </>;
}
