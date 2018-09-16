/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "6b803c5b3856a17ebc014c2f65e1155c"
  },
  {
    "url": "about-me/index.html",
    "revision": "f51766d4e159c6d1efbc964fa7280518"
  },
  {
    "url": "ai/data-mining/index.html",
    "revision": "4ee28f7bedc72aedc41b43c6ea0558b3"
  },
  {
    "url": "ai/machine-learning/index.html",
    "revision": "caba1a604243d2f598704f373ec31743"
  },
  {
    "url": "assets/css/0.styles.33d1fe29.css",
    "revision": "0915e4b733bef59130780839239451cc"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.f70559e0.js",
    "revision": "f29448d577d90433079ab10c795e1f6b"
  },
  {
    "url": "assets/js/11.14b41240.js",
    "revision": "59f6681f6ab843e10548270b87f27900"
  },
  {
    "url": "assets/js/12.4463fe0f.js",
    "revision": "bf51b98ae3f1f329ed05a229f210037e"
  },
  {
    "url": "assets/js/13.c83817e9.js",
    "revision": "6269369f0518f553de6cc26a9cfd9a7d"
  },
  {
    "url": "assets/js/14.3a6d5c00.js",
    "revision": "7cd30a24b81604c9d1cc558b66630208"
  },
  {
    "url": "assets/js/15.6a68f6d6.js",
    "revision": "6a997199b1a3ec71a55a4e9d720f2014"
  },
  {
    "url": "assets/js/16.3c2359f1.js",
    "revision": "fde8b5280df3ce3809b904f229c18752"
  },
  {
    "url": "assets/js/17.b55d4c3d.js",
    "revision": "ff34e95a841e6d996a9bb90fedf1a5a6"
  },
  {
    "url": "assets/js/18.ad8b8cc9.js",
    "revision": "f1d8f6802031f4d084653205573d6792"
  },
  {
    "url": "assets/js/19.6b8d4106.js",
    "revision": "858464469f7105fb0771f9a73d09f668"
  },
  {
    "url": "assets/js/2.285762ea.js",
    "revision": "93afbd4e91ed17280e84a6930dc81b17"
  },
  {
    "url": "assets/js/20.1ba9905a.js",
    "revision": "7f522e2b00e847e0cf1160bac3b069ca"
  },
  {
    "url": "assets/js/3.bb1fba44.js",
    "revision": "751740282a9700e12df3a07a6e4c1cfc"
  },
  {
    "url": "assets/js/4.a530815d.js",
    "revision": "b62a350364a97396f3f11aeeac4ce7e4"
  },
  {
    "url": "assets/js/5.0d9e80ab.js",
    "revision": "e28a98857936311ccff33b0333cb130a"
  },
  {
    "url": "assets/js/6.b8f578b0.js",
    "revision": "9a856329a18c6bb45ea42e5faf113203"
  },
  {
    "url": "assets/js/7.45a3569f.js",
    "revision": "ccdc82ee132a08b0651af77a9630dc90"
  },
  {
    "url": "assets/js/8.8c5f7c2e.js",
    "revision": "858e690da2ae7bce51795002ad2d550c"
  },
  {
    "url": "assets/js/9.9e283a89.js",
    "revision": "d10ced03b9c39554ad4afc4f1cc7aafb"
  },
  {
    "url": "assets/js/app.5d55d55f.js",
    "revision": "20f3991220edc45219116a4ab7bfc6d5"
  },
  {
    "url": "backend/koa/index.html",
    "revision": "1447fb297de95306f39c57aa2ca8b78c"
  },
  {
    "url": "backend/mongodb/index.html",
    "revision": "4445528d333d8cfaa70babcc5be5b5b0"
  },
  {
    "url": "backend/node/index.html",
    "revision": "99f1c4524ce1b4b74aba9f728adeb1de"
  },
  {
    "url": "frontend/react/index.html",
    "revision": "cf51ba58616ccd3f2c995ef3e003527b"
  },
  {
    "url": "frontend/vue/index.html",
    "revision": "d9996791d04899ba5c2ab0c732182bbf"
  },
  {
    "url": "frontend/wx/index.html",
    "revision": "5ea2672a98cbfc91bd123f75439bfcd6"
  },
  {
    "url": "frontend/wx/mpvue-wx-mini-app-first-look.html",
    "revision": "f224679d240914b64caf4bc8577c8046"
  },
  {
    "url": "frontend/wx/test.html",
    "revision": "f27e350776e80bdbe2ce1dd20ca7445d"
  },
  {
    "url": "index.html",
    "revision": "8a7cfab041248d25e324919ad054991f"
  },
  {
    "url": "ops/c-s-ops.html",
    "revision": "3296b4df291d8ea49d266882446a7924"
  },
  {
    "url": "ops/docker-ops.html",
    "revision": "4d3d25e68338e8e81146c501b0c21808"
  },
  {
    "url": "ops/domain-and-website-approve.html",
    "revision": "2825d5eef569162dd1f9bd0f6d615877"
  },
  {
    "url": "ops/index.html",
    "revision": "5afb8476b9aa3410820a2c48184fa085"
  },
  {
    "url": "ops/remote-private-git-first-look.html",
    "revision": "79abd33f064fa7e5dc05d66a0ebf6c7c"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
