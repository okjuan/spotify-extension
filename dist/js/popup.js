!function(e){var t={};function i(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=1)}([function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WEB_PLAYER_URL=t.CONTEXT_MENU_ITEM=t.CACHE_KEY=void 0,t.CACHE_KEY="playingTrack",t.CONTEXT_MENU_ITEM="spotify-extension-search-on-spotify",t.WEB_PLAYER_URL="https://open.spotify.com"},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});(new(i(2).App)).render()},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{a(n.next(e))}catch(e){s(e)}}function c(e){try{a(n.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,c)}a((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.App=void 0;const o=i(3),s=i(4),r=i(5),c=i(0);t.App=class{constructor(){this.updateTrackInfo=(e,t)=>{this.track[e]=t},this.handleDOM=()=>{this.track?(r.displayTrackInfo(this.track),r.displayControlButtons(this.track.isPlaying?"pause":"play")):r.displayControlButtons("play"),r.registerEvents(this.sp,this.track,this.render.bind(this),this.updateTrackCache.bind(this),this.updateTrackInfo.bind(this))},this.sp=new s.Spotify,this.track=null}render(){return n(this,void 0,void 0,(function*(){yield this.sp.getAccessToken(),yield this.sp.getDevices(),this.isLogin()?this.isDeviceOpening()?this.displayPlayerBox():this.displayNoDeviceBox():r.displayBox("login-notification")}))}displayPlayerBox(){r.displayBox("player"),chrome.storage.sync.get([c.CACHE_KEY],e=>n(this,void 0,void 0,(function*(){const{playingTrack:t}=e;this.track=yield this.getTrack(t),this.shouldUpdateCache(t,this.track)?chrome.storage.sync.set({playingTrack:this.track}):this.track?this.track=t:this.track=Object.assign(Object.assign({},t),{isPlaying:!1}),this.handleDOM()})))}displayNoDeviceBox(){r.displayBox("no-device-open-notification"),chrome.storage.sync.get(["playingTrack"],(function(e){return n(this,void 0,void 0,(function*(){const{playingTrack:t}=e;t&&(t.isPlaying=!1,chrome.storage.sync.set({playingTrack:t}))}))}))}updateTrackCache(e){chrome.storage.sync.get([c.CACHE_KEY],t=>{const{playingTrack:i}=t;i&&chrome.storage.sync.set(Object.assign(Object.assign({},i),e))})}getTrack(e){return n(this,void 0,void 0,(function*(){let t=yield this.sp.getCurrentPlayBack();return(!t&&!e||t&&!t.item)&&(t=yield this.sp.getRecentlyPlayedTrack()),o.parse(t)}))}shouldUpdateCache(e,t){return!!(!e||t&&t.title!==e.title||t&&t.isPlaying!==e.isPlaying||t&&t.uri!==e.uri||t&&t.uri===e.uri&&t.progressMs!==e.progressMs)}isDeviceOpening(){return!!this.sp.device}isLogin(){return!this.sp.token.isAnonymous}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parse=void 0,t.parse=function(e){if(!e||e&&!e.item)return;const{is_playing:t,progress_ms:i,item:{name:n,artists:o,album:{images:s},uri:r}}=e,c=o&&o.length?o[0].name:"",a=s&&s.length?s[1].url:"";let l;if(e.context){const{type:t,href:i,external_urls:n,uri:o}=e.context;l={type:t,href:i,uri:o,externalUrls:n}}return{title:n,artist:c,isPlaying:t,coverPhoto:a,uri:r,progressMs:i,context:l}}},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{a(n.next(e))}catch(e){s(e)}}function c(e){try{a(n.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,c)}a((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.Spotify=void 0;const o=i(0),s="https://api.spotify.com",r=["Computer"];t.Spotify=class{constructor(){this.token={clientId:null,accessToken:null,accessTokenExpirationTimestampMs:null,isAnonymous:null},this.device=null}getDevices(){return n(this,void 0,void 0,(function*(){try{const e=s+"/v1/me/player/devices",t=yield fetch(e,{cache:"no-cache",headers:{Authorization:"Bearer "+this.token.accessToken}}),i=yield t.json(),n=i.devices?i.devices.filter(e=>r.indexOf(e.type)>-1).map(e=>({id:e.id,isActive:e.is_active,isRestricted:e.is_restricted,name:e.name,type:e.type,volumePercent:e.volume_percent})):[];return n.length>0&&(this.device=n[0]),n[0]}catch(e){return}}))}getRecentlyPlayedTrack(){return n(this,void 0,void 0,(function*(){try{const e=yield fetch("https://api.spotify.com/v1/me/player/recently-played",{headers:{Authorization:"Bearer "+this.token.accessToken}});let t=yield e.json();if(t&&t.items.length){const{track:e,context:i}=t.items[0];return{item:e,context:i}}return}catch(e){return}}))}getCurrentPlayBack(){return n(this,void 0,void 0,(function*(){try{const e=yield fetch("https://api.spotify.com/v1/me/player?additional_types=track",{headers:{Authorization:"Bearer "+this.token.accessToken}});return yield e.json()}catch(e){return}}))}pause(){return n(this,void 0,void 0,(function*(){const e=`${s}/v1/me/player/pause?device_id=${this.device.id}`;try{return yield fetch(e,{method:"PUT",headers:{Authorization:"Bearer "+this.token.accessToken}})}catch(e){throw e}}))}play(e){return n(this,void 0,void 0,(function*(){const t=`${s}/v1/me/player/play?device_id=${this.device.id}`;let i={uris:[e.uri],position_ms:e.progressMs};e.context&&(i={position_ms:e.progressMs,context_uri:e.context.uri,offset:{uri:e.uri}});try{return yield fetch(t,{method:"PUT",body:JSON.stringify(i),headers:{"Content-Type":"application/json",Authorization:"Bearer "+this.token.accessToken}})}catch(e){throw e}}))}next(){return n(this,void 0,void 0,(function*(){const e=`${s}/v1/me/player/next?device_id=${this.device.id}`;try{return yield fetch(e,{method:"POST",headers:{Authorization:"Bearer "+this.token.accessToken}})}catch(e){throw e}}))}prev(){return n(this,void 0,void 0,(function*(){const e=`${s}/v1/me/player/previous?device_id=${this.device.id}`;try{return yield fetch(e,{method:"POST",headers:{Authorization:"Bearer "+this.token.accessToken}})}catch(e){throw e}}))}shuffle(e){return n(this,void 0,void 0,(function*(){const t=`${s}/v1/me/player/shuffle?state=${e}&device_id=${this.device.id}`;try{return yield fetch(t,{method:"PUT",headers:{Authorization:"Bearer "+this.token.accessToken}})}catch(e){throw e}}))}repeat(e){return n(this,void 0,void 0,(function*(){const t=`${s}/v1/me/player/repeat?state=${e}&device_id=${this.device.id}`;try{return yield fetch(t,{method:"PUT",headers:{Authorization:"Bearer "+this.token.accessToken}})}catch(e){throw e}}))}getAccessToken(){return n(this,void 0,void 0,(function*(){const e=o.WEB_PLAYER_URL+"/get_access_token",t=yield fetch(e),i=yield t.json();return this.token=i,i}))}}},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{a(n.next(e))}catch(e){s(e)}}function c(e){try{a(n.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,c)}a((n=n.apply(e,t||[])).next())}))};function o(e){const t=document.getElementById("pause"),i=document.getElementById("play");switch(e){case"play":i.style.display="block",t.style.display="none";break;case"pause":i.style.display="none",t.style.display="block"}}Object.defineProperty(t,"__esModule",{value:!0}),t.registerEvents=t.displayBox=t.displayControlButtons=t.displayTrackInfo=void 0,t.displayTrackInfo=function(e){const t=document.getElementById("title"),i=document.getElementById("artist"),n=document.getElementById("cover-photo"),{title:o,artist:s,coverPhoto:r}=e;o&&(t.textContent=o),s&&(i.textContent=s),r&&(n.style.backgroundImage=`url('${r}')`)},t.displayControlButtons=o,t.displayBox=function(e){const t=document.getElementById("spotify-mini-player"),i=document.getElementById("spotify-mini-player-notification"),n=document.getElementById("spotify-mini-player-login-notification");switch(e){case"player":t.style.display="flex",i.style.display="none",n.style.display="none";break;case"no-device-open-notification":t.style.display="none",i.style.display="flex",n.style.display="none";break;case"login-notification":t.style.display="none",i.style.display="none",n.style.display="flex"}},t.registerEvents=function(e,t,i,s,r){const c=document.getElementById("prev"),a=document.getElementById("pause"),l=document.getElementById("play"),d=document.getElementById("next");function u(){return n(this,void 0,void 0,(function*(){o("play"),yield e.pause(),r("isPlaying",!1),s({isPlaying:!1})}))}function y(){return n(this,void 0,void 0,(function*(){o("pause"),yield e.play(t),r("isPlaying",!0),s({isPlaying:!0})}))}document.addEventListener("keydown",e=>n(this,void 0,void 0,(function*(){e.preventDefault(),"Space"===e.code&&(!0===t.isPlaying?yield u():yield y())}))),a.onclick=function(e){return n(this,void 0,void 0,(function*(){e.preventDefault(),yield u()}))},l.onclick=function(e){return n(this,void 0,void 0,(function*(){e.preventDefault(),yield y()}))},c.onclick=function(t){return n(this,void 0,void 0,(function*(){t.preventDefault(),yield e.prev(),i()}))},d.onclick=function(t){return n(this,void 0,void 0,(function*(){t.preventDefault(),yield e.next(),i()}))}}}]);