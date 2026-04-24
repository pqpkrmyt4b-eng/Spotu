import { useState, useEffect, useRef } from "react";

const COUNTRY_FLAGS = {
FR: { flag: "FR", name: "France", lang: "fr" },
US: { flag: "US", name: "Etats-Unis", lang: "en" },
GB: { flag: "GB", name: "Royaume-Uni", lang: "en" },
DE: { flag: "DE", name: "Allemagne", lang: "de" },
ES: { flag: "ES", name: "Espagne", lang: "es" },
IT: { flag: "IT", name: "Italie", lang: "it" },
PT: { flag: "PT", name: "Portugal", lang: "pt" },
BE: { flag: "BE", name: "Belgique", lang: "fr" },
CH: { flag: "CH", name: "Suisse", lang: "fr" },
CA: { flag: "CA", name: "Canada", lang: "fr" },
MA: { flag: "MA", name: "Maroc", lang: "fr" },
SN: { flag: "SN", name: "Senegal", lang: "fr" },
DZ: { flag: "DZ", name: "Algerie", lang: "fr" },
TN: { flag: "TN", name: "Tunisie", lang: "fr" },
BR: { flag: "BR", name: "Bresil", lang: "pt" },
MX: { flag: "MX", name: "Mexique", lang: "es" },
JP: { flag: "JP", name: "Japon", lang: "ja" },
CN: { flag: "CN", name: "Chine", lang: "zh" },
AU: { flag: "AU", name: "Australie", lang: "en" },
NL: { flag: "NL", name: "Pays-Bas", lang: "nl" },
};

async function detectCountry() {
try {
const res = await fetch("https://ipapi.co/json/");
const data = await res.json();
return data.country_code || "FR";
} catch {
return "FR";
}
}

function getFlagEmoji(countryCode) {
if (!countryCode) return "🌍";
const codePoints = countryCode
.toUpperCase()
.split("")
.map(char => 127397 + char.charCodeAt(0));
return String.fromCodePoint(...codePoints);
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
--bg: #0a0a0f; --surface: #13131a; --card: #1a1a24;
--accent: #e8ff47; --accent2: #ff6b35; --text: #f0f0f5;
--muted: #6b6b80; --border: rgba(255,255,255,0.07); --error: #ff4747;
}
body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }
.app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--bg); position: relative; }

/* AUTH */
.auth-screen { min-height: 100vh; display: flex; flex-direction: column; padding: 0 24px 40px; animation: fadeUp 0.4s ease both; }
.auth-logo { font-family: 'Bebas Neue', sans-serif; font-size: 52px; letter-spacing: 4px; color: var(--accent); }
.auth-tagline { font-size: 14px; color: var(--muted); margin-top: 8px; }
.auth-title { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 2px; margin-bottom: 6px; }
.auth-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
.form-group { margin-bottom: 14px; }
.form-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; display: block; }
.form-input { width: 100%; padding: 16px 18px; background: var(--card); border: 1px solid var(--border); border-radius: 16px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: var(--accent); }
.form-input::placeholder { color: var(--muted); }
.form-input.err { border-color: var(--error); }
.error-msg { font-size: 12px; color: var(--error); margin-top: 6px; }
.auth-btn { width: 100%; padding: 18px; background: var(--accent); color: #0a0a0f; border: none; border-radius: 16px; font-weight: 800; font-size: 17px; cursor: pointer; font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s; }
.auth-btn:disabled { opacity: 0.6; }
.social-btn { width: 100%; padding: 16px; background: var(--card); color: var(--text); border: 1px solid var(--border); border-radius: 16px; font-weight: 600; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
.auth-switch { text-align: center; margin-top: 24px; font-size: 14px; color: var(--muted); }
.auth-switch span { color: var(--accent); font-weight: 600; cursor: pointer; }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--muted); font-size: 12px; }
.auth-divider::before,.auth-divider::after { content:''; flex:1; height:1px; background:var(--border); }
.alert-box { background: rgba(255,71,71,0.1); border: 1px solid rgba(255,71,71,0.3); border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; color: var(--error); font-size: 14px; }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(0,0,0,0.3); border-top-color: #0a0a0f; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ONBOARDING */
.onboarding { min-height: 100vh; padding: 60px 24px 40px; animation: fadeUp 0.4s ease both; }
.step-dots { display: flex; gap: 6px; margin-bottom: 32px; }
.step-dot { height: 4px; border-radius: 2px; background: var(--border); flex: 1; transition: background 0.3s; }
.step-dot.active { background: var(--accent); }
.onboard-title { font-family: 'Bebas Neue', sans-serif; font-size: 34px; letter-spacing: 2px; margin-bottom: 8px; }
.onboard-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
.sport-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
.sport-option { background: var(--card); border: 1.5px solid var(--border); border-radius: 16px; padding: 16px 8px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; color: var(--muted); font-weight: 500; transition: all 0.2s; }
.sport-option.selected { border-color: var(--accent); background: rgba(232,255,71,0.08); color: var(--accent); }
.sport-option span:first-child { font-size: 28px; }
.level-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.level-option { background: var(--card); border: 1.5px solid var(--border); border-radius: 16px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s; }
.level-option.selected { border-color: var(--accent); background: rgba(232,255,71,0.06); }
.level-name { font-weight: 600; font-size: 15px; }
.level-desc { font-size: 12px; color: var(--muted); margin-top: 2px; }
.level-option.selected .level-name { color: var(--accent); }
.onboard-btn { width: 100%; padding: 18px; background: var(--accent); color: #0a0a0f; border: none; border-radius: 16px; font-weight: 800; font-size: 17px; cursor: pointer; font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px; }

/* NAV */
.nav { display: flex; justify-content: space-around; padding: 12px 0 16px; background: rgba(10,10,15,0.97); backdrop-filter: blur(20px); border-top: 1px solid var(--border); position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; z-index: 100; }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; background: none; border: none; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
.nav-item.active { color: var(--accent); }
.nav-item.active .nav-icon { background: rgba(232,255,71,0.15); }
.nav-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.2s; }

/* HEADER */
.header { padding: 52px 20px 16px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 2px; color: var(--accent); }
.avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; }

/* FEED */
.feed { padding: 0 16px 90px; }
.section-title { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1.5px; margin: 18px 0 12px; }
.sport-pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; margin-bottom: 16px; }
.sport-pills::-webkit-scrollbar { display: none; }
.pill { padding: 7px 14px; border-radius: 100px; border: 1px solid var(--border); background: var(--surface); color: var(--muted); font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer; }
.pill.active { background: var(--accent); color: #0a0a0f; border-color: var(--accent); font-weight: 600; }

/* PARTNER CARD */
.partner-card { background: var(--card); border-radius: 20px; overflow: hidden; margin-bottom: 12px; border: 1px solid var(--border); animation: fadeUp 0.4s ease both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.card-banner { height: 90px; display: flex; align-items: flex-end; padding: 10px; }
.card-sport-badge { background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; color: white; }
.level-badge { margin-left: auto; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.card-body { padding: 12px; }
.card-user { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.user-ava { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; background: var(--surface); flex-shrink: 0; }
.user-name { font-weight: 600; font-size: 14px; }
.user-meta { font-size: 11px; color: var(--muted); margin-top: 1px; }
.card-actions { display: flex; gap: 6px; }
.btn-primary { flex: 1; padding: 9px; background: var(--accent); color: #0a0a0f; border: none; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.btn-ghost { padding: 9px 12px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 10px; font-size: 14px; cursor: pointer; }
.btn-added { padding: 9px 12px; background: rgba(232,255,71,0.1); color: var(--accent); border: 1px solid rgba(232,255,71,0.3); border-radius: 10px; font-size: 12px; font-weight: 600; cursor: default; }

/* EVENTS */
.event-card { background: var(--card); border-radius: 18px; padding: 14px; margin-bottom: 12px; border: 1px solid var(--border); animation: fadeUp 0.4s ease both; }
.event-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.event-emoji { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.event-title { font-weight: 700; font-size: 15px; }
.event-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
.event-spots { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; background: rgba(232,255,71,0.12); color: var(--accent); margin-left: auto; white-space: nowrap; }
.event-details { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.event-detail { font-size: 11px; color: var(--muted); }
.participants-row { display: flex; align-items: center; gap: 6px; }
.participant-dots { display: flex; }
.dot { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--card); display: flex; align-items: center; justify-content: center; font-size: 11px; margin-left: -5px; background: var(--surface); }
.dot:first-child { margin-left: 0; }
.join-btn { margin-left: auto; padding: 7px 14px; background: var(--accent); color: #0a0a0f; border: none; border-radius: 9px; font-weight: 700; font-size: 11px; cursor: pointer; font-family: 'DM Sans', sans-serif; }

/* MAP */
.map-screen { padding: 52px 0 90px; animation: fadeUp 0.3s ease both; }
.map-header { padding: 0 16px 14px; display: flex; justify-content: space-between; align-items: center; }
.map-container { position: relative; height: 340px; background: #0f1520; overflow: hidden; margin-bottom: 0; }
.map-bg { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.map-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(232,255,71,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,255,71,0.04) 1px, transparent 1px); background-size: 40px 40px; }
.map-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.6) 100%); }
.map-pin { position: absolute; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; }
.map-pin:hover { transform: scale(1.1); }
.pin-bubble { background: var(--card); border: 2px solid var(--accent); border-radius: 12px; padding: 6px 10px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); white-space: nowrap; }
.pin-bubble.me { border-color: var(--accent2); background: rgba(255,107,53,0.2); }
.pin-name { font-size: 11px; font-weight: 700; color: var(--text); }
.pin-sport { font-size: 14px; }
.pin-arrow { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid var(--accent); margin-top: -1px; }
.pin-arrow.me { border-top-color: var(--accent2); }
.map-you-btn { position: absolute; bottom: 12px; right: 12px; background: var(--accent); color: #0a0a0f; border: none; border-radius: 12px; padding: 10px 14px; font-weight: 700; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; }
.nearby-list { padding: 16px; }
.nearby-item { background: var(--card); border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
.nearby-item:active { transform: scale(0.98); }
.nearby-dist { margin-left: auto; font-size: 11px; color: var(--muted); }
.locate-banner { background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.2); border-radius: 14px; padding: 14px 16px; margin: 0 16px 16px; display: flex; align-items: center; gap: 12px; }
.locate-text { flex: 1; font-size: 13px; color: var(--text); }
.locate-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
.locate-btn { padding: 8px 14px; background: var(--accent); color: #0a0a0f; border: none; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; white-space: nowrap; }

/* CHAT LIST */
.chat-screen { padding: 52px 0 90px; animation: fadeUp 0.3s ease both; }
.chat-header { padding: 0 16px 14px; display: flex; justify-content: space-between; align-items: center; }
.chat-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.15s; }
.chat-item:active { background: var(--surface); }
.chat-ava { width: 46px; height: 46px; border-radius: 50%; background: var(--card); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; position: relative; }
.online-dot { position: absolute; bottom: 1px; right: 1px; width: 10px; height: 10px; border-radius: 50%; background: #47ff88; border: 2px solid var(--bg); }
.chat-info { flex: 1; min-width: 0; }
.chat-name { font-weight: 600; font-size: 15px; }
.chat-preview { font-size: 12px; color: var(--muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-time { font-size: 11px; color: var(--muted); flex-shrink: 0; }
.unread-badge { background: var(--accent); color: #0a0a0f; border-radius: 100px; font-size: 10px; font-weight: 800; padding: 2px 7px; margin-top: 4px; display: inline-block; }

/* CHAT ROOM */
.chat-room { display: flex; flex-direction: column; height: 100vh; animation: fadeUp 0.2s ease both; }
.chat-room-header { padding: 52px 16px 14px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); background: var(--bg); }
.back-btn { background: none; border: none; color: var(--muted); font-size: 22px; cursor: pointer; }
.chat-room-ava { width: 36px; height: 36px; border-radius: 50%; background: var(--card); display: flex; align-items: center; justify-content: center; font-size: 18px; }
.chat-room-name { font-weight: 700; font-size: 16px; }
.chat-room-status { font-size: 11px; color: #47ff88; }
.messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; padding-bottom: 80px; }
.msg { max-width: 75%; }
.msg.me { align-self: flex-end; }
.msg.them { align-self: flex-start; }
.msg-bubble { padding: 10px 14px; border-radius: 18px; font-size: 14px; line-height: 1.4; }
.msg.me .msg-bubble { background: var(--accent); color: #0a0a0f; border-bottom-right-radius: 4px; }
.msg.them .msg-bubble { background: var(--card); color: var(--text); border-bottom-left-radius: 4px; }
.msg-time { font-size: 10px; color: var(--muted); margin-top: 4px; padding: 0 4px; }
.msg.me .msg-time { text-align: right; }
.chat-input-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: var(--bg); border-top: 1px solid var(--border); padding: 12px 16px; display: flex; gap: 10px; align-items: center; }
.chat-input { flex: 1; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); border-radius: 100px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; }
.chat-input:focus { border-color: var(--accent); }
.chat-input::placeholder { color: var(--muted); }
.send-btn { width: 42px; height: 42px; border-radius: 50%; background: var(--accent); color: #0a0a0f; border: none; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* FRIENDS */
.friends-screen { padding: 52px 0 90px; animation: fadeUp 0.3s ease both; }
.friend-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border); }
.friend-ava { width: 44px; height: 44px; border-radius: 50%; background: var(--card); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.friend-info { flex: 1; }
.friend-name { font-weight: 600; font-size: 14px; }
.friend-sport { font-size: 11px; color: var(--muted); margin-top: 2px; }
.friend-actions { display: flex; gap: 6px; }
.icon-btn { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 15px; cursor: pointer; border: 1px solid var(--border); background: var(--surface); }

/* PROFILE */
.profile-page { padding: 52px 16px 90px; animation: fadeUp 0.3s ease both; }
.profile-hero { background: var(--card); border-radius: 24px; padding: 24px; margin-bottom: 14px; text-align: center; border: 1px solid var(--border); }
.profile-avatar { width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 30px; margin: 0 auto 10px; }
.profile-name { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 1.5px; margin-bottom: 4px; }
.profile-stats { display: flex; margin-top: 14px; border-top: 1px solid var(--border); padding-top: 14px; }
.stat { flex: 1; text-align: center; border-right: 1px solid var(--border); }
.stat:last-child { border-right: none; }
.stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--accent); line-height: 1; }
.stat-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
.sport-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; justify-content: center; }
.sport-tag { padding: 5px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 100px; font-size: 12px; color: var(--muted); }
.logout-btn { width: 100%; padding: 15px; background: transparent; color: var(--error); border: 1px solid rgba(255,71,71,0.3); border-radius: 16px; font-weight: 600; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-top: 14px; }

/* CREATE FORM */
.create-form { padding: 0 16px 90px; animation: fadeUp 0.3s ease both; }
.form-header { padding: 52px 0 20px; font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 2px; }
.sport-grid-sm { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.sport-opt-sm { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 10px 6px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; font-size: 10px; color: var(--muted); font-weight: 500; transition: all 0.2s; }
.sport-opt-sm.selected { border-color: var(--accent); background: rgba(232,255,71,0.08); color: var(--accent); }
.sport-opt-sm span:first-child { font-size: 20px; }
.submit-btn { width: 100%; padding: 15px; background: var(--accent); color: #0a0a0f; border: none; border-radius: 16px; font-weight: 800; font-size: 16px; cursor: pointer; font-family: 'Bebas Neue', sans-serif; letter-spacing: 1.5px; margin-top: 8px; }

/* TOAST */
.toast { position: fixed; top: 60px; left: 50%; transform: translateX(-50%) translateY(-80px); background: var(--accent); color: #0a0a0f; padding: 11px 22px; border-radius: 100px; font-weight: 700; font-size: 13px; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); z-index: 999; white-space: nowrap; }
.toast.show { transform: translateX(-50%) translateY(0); }
.toast.err { background: var(--error); color: white; }

/* SEARCH */
.search-bar { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 11px 16px; width: 100%; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; margin-bottom: 14px; }
.search-bar:focus { border-color: var(--accent); }
.search-bar::placeholder { color: var(--muted); }

.tab-bar { display: flex; background: var(--surface); border-radius: 12px; padding: 3px; margin-bottom: 16px; }
.tab-btn { flex: 1; padding: 8px; border: none; background: none; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 10px; }
.tab-btn.active { background: var(--card); color: var(--text); }

.empty-state { text-align: center; padding: 40px 20px; color: var(--muted); font-size: 14px; }
.empty-icon { font-size: 40px; margin-bottom: 12px; }
`;

const FAKE_USERS = [{ email:"demo@spotu.fr", password:"demo123", name:"Alex Demo", sports:["🏃 Running","🏀 Basket"], level:"Intermédiaire" }];

const ALL_USERS = [
{ id:1, name:"Camille R.", emoji:"🧗", sport:"Escalade", level:"Inter", levelColor:"#ff6b35", ava:"🙋‍♀️", bg:"linear-gradient(135deg,#1a2a1a,#2d4a1a)", location:"Paris 11e", dispo:"Weekend", age:28, lat:200, lng:160, online:true },
{ id:2, name:"Thomas M.", emoji:"🚴", sport:"Cyclisme", level:"Avancé", levelColor:"#e8ff47", ava:"🧑", bg:"linear-gradient(135deg,#1a1a2a,#1a2a3a)", location:"Paris 5e", dispo:"Matin", age:32, lat:130, lng:100, online:false },
{ id:3, name:"Sofia L.", emoji:"🎾", sport:"Tennis", level:"Débutant", levelColor:"#47d4ff", ava:"👩", bg:"linear-gradient(135deg,#2a1a1a,#3a2a1a)", location:"Paris 8e", dispo:"Soir", age:25, lat:90, lng:220, online:true },
{ id:4, name:"Alex D.", emoji:"🏃", sport:"Running", level:"Inter", levelColor:"#ff6b35", ava:"🧔", bg:"linear-gradient(135deg,#1a1a2a,#2a1a2a)", location:"Paris 13e", dispo:"Matin", age:29, lat:260, lng:180, online:true },
{ id:5, name:"Julie M.", emoji:"🏊", sport:"Natation", level:"Avancé", levelColor:"#47d4ff", ava:"👱‍♀️", bg:"linear-gradient(135deg,#1a1a2a,#0a1a2a)", location:"Paris 15e", dispo:"Soir", age:27, lat:170, lng:270, online:false },
];

const EVENTS = [
{ id:1, title:"Match de Basket 3×3", sport:"🏀", sportName:"Basket", date:"Sam 26 avr.", time:"15h00", location:"Stade Charlety", spots:3, total:6, participants:["🧑","👩","🙋‍♀️"], bg:"#ff6b3520" },
{ id:2, title:"Trail Bois de Vincennes", sport:"🏃", sportName:"Running", date:"Dim 27 avr.", time:"8h30", location:"Bois de Vincennes", spots:5, total:12, participants:["🧔","👩","🧑"], bg:"#47ff8820" },
{ id:3, title:"Session Escalade", sport:"🧗", sportName:"Escalade", date:"Lun 28 avr.", time:"19h00", location:"Block'Out Paris", spots:2, total:8, participants:["🙋‍♀️","🧑"], bg:"#e8ff4720" },
];

const SPORTS_LIST = [
{e:"⚽",n:"Foot"},{e:"🏀",n:"Basket"},{e:"🎾",n:"Tennis"},{e:"🏃",n:"Running"},
{e:"🚴",n:"Vélo"},{e:"🏊",n:"Natation"},{e:"🧗",n:"Escalade"},{e:"🏓",n:"Padel"},
{e:"⛷️",n:"Ski"},{e:"🥊",n:"Boxe"},{e:"🏐",n:"Volley"},{e:"🤸",n:"Yoga"},
{e:"🏈",n:"Foot US"},{e:"🏉",n:"Rugby"},{e:"💪",n:"Muscu"},{e:"⛹️",n:"Street Ball"},
];
const LEVELS = [
{e:"🌱",n:"Débutant",d:"Je découvre ce sport"},
{e:"⚡",n:"Intermédiaire",d:"Je pratique régulièrement"},
{e:"🔥",n:"Avancé",d:"Je suis très expérimenté"},
];

const INITIAL_CHATS = {
1: { messages: [
{from:"them",text:"Salut ! Tu fais de l'escalade ce weekend ?",time:"14:22"},
{from:"me",text:"Oui samedi matin ! Tu veux venir ?",time:"14:25"},
{from:"them",text:"Avec plaisir 💪 On se retrouve à quelle heure ?",time:"14:26"},
]},
3: { messages: [
{from:"them",text:"Hey, j'ai vu ton profil ! Tu joues au tennis ?",time:"10:05"},
{from:"me",text:"Oui niveau intermédiaire 🎾 Tu cherches un partenaire ?",time:"10:10"},
]},
};

export default function App() {
const [screen, setScreen] = useState("welcome");
const [user, setUser] = useState(null);
const [country, setCountry] = useState({ flag: "🏅", name: "", loading: true });

useEffect(() => {
detectCountry().then(code => {
const info = COUNTRY_FLAGS[code] || { flag: code, name: code, lang: "fr" };
setCountry({ ...info, code, loading: false });
});
}, []);
const [users, setUsers] = useState(FAKE_USERS);
const [loginData, setLoginData] = useState({email:"",password:""});
const [signupData, setSignupData] = useState({name:"",email:"",password:"",confirm:""});
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [onboardStep, setOnboardStep] = useState(1);
const [selectedSports, setSelectedSports] = useState([]);
const [selectedLevel, setSelectedLevel] = useState(null);
const [tempUser, setTempUser] = useState(null);

const [tab, setTab] = useState("home");
const [filter, setFilter] = useState("Tous");
const [joinedEvents, setJoinedEvents] = useState([]);
const [friends, setFriends] = useState([1, 3]);
const [pendingFriends, setPendingFriends] = useState([]);
const [chats, setChats] = useState(INITIAL_CHATS);
const [openChat, setOpenChat] = useState(null);
const [msgInput, setMsgInput] = useState("");
const [friendsTab, setFriendsTab] = useState("amis");
const [profilePhoto, setProfilePhoto] = useState(null);
const photoInputRef = useRef(null);
const [search, setSearch] = useState("");
const [selectedSportCreate, setSelectedSportCreate] = useState(null);
const [formData, setFormData] = useState({title:"",date:"",time:"",location:"",spots:""});
const [localized, setLocalized] = useState(false);
const [toast, setToast] = useState({msg:"",err:false});
const [showToast, setShowToast] = useState(false);
const messagesEndRef = useRef(null);

useEffect(() => { messagesEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [openChat, chats]);

const showMsg = (msg, err=false) => {
setToast({msg,err}); setShowToast(true);
setTimeout(() => setShowToast(false), 2400);
};

const handleLogin = () => {
const errs = {};
if (!loginData.email) errs.email = "Email requis";
if (!loginData.password) errs.password = "Mot de passe requis";
if (Object.keys(errs).length) { setErrors(errs); return; }
setLoading(true);
setTimeout(() => {
const found = users.find(u => u.email===loginData.email && u.password===loginData.password);
setLoading(false);
if (found) { setUser(found); setScreen("app"); showMsg("🎉 Bienvenue "+found.name.split(" ")[0]+" !"); }
else setErrors({general:"Email ou mot de passe incorrect"});
}, 1200);
};

const handleSignup = () => {
const errs = {};
if (!signupData.name) errs.name = "Nom requis";
if (!signupData.email||!signupData.email.includes("@")) errs.email = "Email invalide";
if (!signupData.password||signupData.password.length<6) errs.password = "6 caractères minimum";
if (signupData.password!==signupData.confirm) errs.confirm = "Mots de passe différents";
if (users.find(u=>u.email===signupData.email)) errs.email = "Email déjà utilisé";
if (Object.keys(errs).length) { setErrors(errs); return; }
setLoading(true);
setTimeout(() => {
setLoading(false);
setTempUser({name:signupData.name,email:signupData.email,password:signupData.password});
setScreen("onboard"); setOnboardStep(1);
}, 1000);
};

const finishOnboard = () => {
const nu = {...tempUser, sports:selectedSports.map(i=>`${SPORTS_LIST[i].e} ${SPORTS_LIST[i].n}`), level:LEVELS[selectedLevel].n};
setUsers(p=>[...p,nu]); setUser(nu); setScreen("app");
showMsg("🎉 Bienvenue sur Spotu !");
};

const toggleSport = i => setSelectedSports(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);

const addFriend = (id) => {
if (friends.includes(id)||pendingFriends.includes(id)) return;
setPendingFriends(p=>[...p,id]);
showMsg("👋 Demande envoyée !");
};

const acceptFriend = (id) => {
setFriends(p=>[...p,id]);
setPendingFriends(p=>p.filter(x=>x!==id));
showMsg("🤝 Ami ajouté !");
};

const startChat = (userId) => {
if (!chats[userId]) setChats(p=>({...p,[userId]:{messages:[]}}));
setOpenChat(userId);
setTab("messages");
};

const sendMsg = () => {
if (!msgInput.trim()) return;
const now = new Date();
const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
setChats(p=>({...p,[openChat]:{messages:[...(p[openChat]?.messages||[]),{from:"me",text:msgInput,time}]}}));
setMsgInput("");
const replies = ["Super ! 💪","Ok cool !","À bientôt alors 😊","Génial, hâte d'y être !","👍","C'est noté !"];
setTimeout(() => {
setChats(p=>({...p,[openChat]:{messages:[...(p[openChat]?.messages||[]),{from:"them",text:replies[Math.floor(Math.random()*replies.length)],time}]}}));
}, 1200);
};

const joinEvent = (e,id) => {
e.stopPropagation();
if (joinedEvents.includes(id)) return;
setJoinedEvents(p=>[...p,id]); showMsg("✅ Tu as rejoint l'événement !");
};

const handleCreate = () => {
if (!formData.title||selectedSportCreate===null) { showMsg("⚠️ Complète les champs requis !",true); return; }
showMsg("🎉 Événement créé !"); setFormData({title:"",date:"",time:"",location:"",spots:""}); setSelectedSportCreate(null);
setTimeout(()=>setTab("events"),500);
};

const logout = () => { setUser(null); setScreen("welcome"); setTab("home"); setLoginData({email:"",password:""}); setSignupData({name:"",email:"",password:"",confirm:""}); setErrors({}); setOpenChat(null); };

const chatUser = openChat ? ALL_USERS.find(u=>u.id===openChat) : null;

// ── WELCOME ──
if (screen==="welcome") return (
<><style>{styles}</style>
<div className="app">
<div className="auth-screen" style={{justifyContent:"center",textAlign:"center"}}>
<div style={{paddingTop:80,paddingBottom:40}}>
<span style={{fontSize:72, display:"block", marginBottom:12, transition:"all 0.4s"}}>
{country.loading ? "⏳" : getFlagEmoji(country.code || "FR")}
</span>
<div className="auth-logo">SPOTU</div>
<div className="auth-tagline">Trouve ton partenaire sportif idéal</div>
{!country.loading && country.name && (
<div style={{marginTop:10, fontSize:12, color:"var(--muted)", display:"flex", alignItems:"center", justifyContent:"center", gap:6}}>
<span style={{width:6, height:6, borderRadius:"50%", background:"#47ff88", display:"inline-block"}}/>
Communauté {country.name}
</div>
)}
</div>
<div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"flex-end",gap:12}}>
<button className="auth-btn" onClick={()=>{setScreen("signup");setErrors({});}}>CRÉER UN COMPTE</button>
<button className="social-btn" onClick={()=>{setScreen("login");setErrors({});}}>🔑 Se connecter</button>
</div>
</div>
</div></>
);

// ── LOGIN ──
if (screen==="login") return (
<><style>{styles}</style>
<div className="app">
<div className="auth-screen">
<div style={{paddingTop:52,marginBottom:28}}><button onClick={()=>setScreen("welcome")} style={{background:"none",border:"none",color:"var(--muted)",fontSize:22,cursor:"pointer"}}>←</button></div>
<div className="auth-title">CONNEXION</div>
<div className="auth-sub">Content de te revoir 👋</div>
{errors.general&&<div className="alert-box">{errors.general}</div>}
<div className="form-group">
<label className="form-label">Email</label>
<input className={`form-input ${errors.email?"err":""}`} type="email" placeholder="ton@email.fr" value={loginData.email} onChange={e=>{setLoginData(p=>({...p,email:e.target.value}));setErrors({});}} />
{errors.email&&<div className="error-msg">{errors.email}</div>}
</div>
<div className="form-group">
<label className="form-label">Mot de passe</label>
<input className={`form-input ${errors.password?"err":""}`} type="password" placeholder="••••••••" value={loginData.password} onChange={e=>{setLoginData(p=>({...p,password:e.target.value}));setErrors({});}} />
{errors.password&&<div className="error-msg">{errors.password}</div>}
</div>
<button className="auth-btn" onClick={handleLogin} disabled={loading}>{loading?<div className="spinner"/>:"SE CONNECTER"}</button>
<div className="auth-divider">ou</div>
<button className="social-btn">🍎 Continuer avec Apple</button>
<button className="social-btn">🔵 Continuer avec Google</button>
<div className="auth-switch">Pas de compte ? <span onClick={()=>{setScreen("signup");setErrors({});}}>S'inscrire</span></div>
</div>
</div></>
);

// ── SIGNUP ──
if (screen==="signup") return (
<><style>{styles}</style>
<div className="app">
<div className="auth-screen">
<div style={{paddingTop:52,marginBottom:28}}><button onClick={()=>setScreen("welcome")} style={{background:"none",border:"none",color:"var(--muted)",fontSize:22,cursor:"pointer"}}>←</button></div>
<div className="auth-title">INSCRIPTION</div>
<div className="auth-sub">Rejoins la communauté 🚀</div>
{["name","email","password","confirm"].map((f,i)=>(
<div className="form-group" key={f}>
<label className="form-label">{["Prénom & Nom","Email","Mot de passe","Confirmer"][i]}</label>
<input className={`form-input ${errors[f]?"err":""}`} type={f==="email"?"email":f.includes("pass")||f==="confirm"?"password":"text"} placeholder={["Marie Dupont","ton@email.fr","6 caractères minimum","••••••••"][i]} value={signupData[f]} onChange={e=>{setSignupData(p=>({...p,[f]:e.target.value}));setErrors({});}} />
{errors[f]&&<div className="error-msg">{errors[f]}</div>}
</div>
))}
<button className="auth-btn" onClick={handleSignup} disabled={loading}>{loading?<div className="spinner"/>:"CRÉER MON COMPTE"}</button>
<div className="auth-switch">Déjà un compte ? <span onClick={()=>{setScreen("login");setErrors({});}}>Se connecter</span></div>
</div>
</div></>
);

// ── ONBOARD ──
if (screen==="onboard") return (
<><style>{styles}</style>
<div className="app">
<div className={`toast ${showToast?"show":""} ${toast.err?"err":""}`}>{toast.msg}</div>
<div className="onboarding">
<div className="step-dots">{[1,2].map(s=><div key={s} className={`step-dot ${onboardStep>=s?"active":""}`}/>)}</div>
{onboardStep===1&&(<>
<div className="onboard-title">TES SPORTS</div>
<div className="onboard-sub">Choisis les sports que tu pratiques</div>
<div className="sport-grid">{SPORTS_LIST.map((s,i)=><div key={i} className={`sport-option ${selectedSports.includes(i)?"selected":""}`} onClick={()=>toggleSport(i)}><span>{s.e}</span><span>{s.n}</span></div>)}</div>
<button className="onboard-btn" onClick={()=>selectedSports.length?setOnboardStep(2):showMsg("⚠️ Choisis au moins un sport !",true)}>CONTINUER →</button>
</>)}
{onboardStep===2&&(<>
<div className="onboard-title">TON NIVEAU</div>
<div className="onboard-sub">En général, quel est ton niveau ?</div>
<div className="level-options">{LEVELS.map((l,i)=><div key={i} className={`level-option ${selectedLevel===i?"selected":""}`} onClick={()=>setSelectedLevel(i)}><div style={{fontSize:24}}>{l.e}</div><div><div className="level-name">{l.n}</div><div className="level-desc">{l.d}</div></div></div>)}</div>
<button className="onboard-btn" onClick={()=>selectedLevel!==null?finishOnboard():showMsg("⚠️ Choisis ton niveau !",true)}>COMMENCER 🚀</button>
</>)}
</div>
</div></>
);

// ── CHAT ROOM ──
if (tab==="messages" && openChat) return (
<><style>{styles}</style>
<div className="app">
<div className={`toast ${showToast?"show":""} ${toast.err?"err":""}`}>{toast.msg}</div>
<div className="chat-room">
<div className="chat-room-header">
<button className="back-btn" onClick={()=>setOpenChat(null)}>←</button>
<div className="chat-room-ava">{chatUser?.ava}</div>
<div>
<div className="chat-room-name">{chatUser?.name}</div>
<div className="chat-room-status">{chatUser?.online?"● En ligne":"○ Hors ligne"}</div>
</div>
</div>
<div className="messages">
{(chats[openChat]?.messages||[]).map((m,i)=>(
<div key={i} className={`msg ${m.from==="me"?"me":"them"}`}>
<div className="msg-bubble">{m.text}</div>
<div className="msg-time">{m.time}</div>
</div>
))}
<div ref={messagesEndRef}/>
</div>
<div className="chat-input-bar">
<input className="chat-input" placeholder="Écris un message..." value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} />
<button className="send-btn" onClick={sendMsg}>➤</button>
</div>
</div>
</div></>
);

// ── MAIN APP ──
return (
<><style>{styles}</style>
<div className="app">
<div className={`toast ${showToast?"show":""} ${toast.err?"err":""}`}>{toast.msg}</div>

{/* HOME */}
{tab==="home"&&(<>
<div className="header"><div className="logo">SPOTU</div><div className="avatar" onClick={()=>setTab("profile")}>🏃</div></div>
<div className="feed">
<div style={{fontSize:14,color:"var(--muted)",marginBottom:14}}>Bonjour <strong style={{color:"var(--text)"}}>{user?.name?.split(" ")[0]} 👋</strong></div>
<input className="search-bar" placeholder="🔍 Rechercher un partenaire..." value={search} onChange={e=>setSearch(e.target.value)} />
<div className="sport-pills">
{["Tous","Football","Running","Tennis","Basket","Rugby","Foot US","Muscu","Cyclisme","Escalade","Natation"].map(s=>(
<div key={s} className={`pill ${filter===s?"active":""}`} onClick={()=>setFilter(s)}>{s}</div>
))}
</div>
<div className="section-title">PARTENAIRES PRÈS DE TOI</div>
{ALL_USERS.filter(p=>(filter==="Tous"||p.sport===filter)&&(!search||p.name.toLowerCase().includes(search.toLowerCase()))).map((p,i)=>(
<div key={p.id} className="partner-card" style={{animationDelay:`${i*0.06}s`}}>
<div className="card-banner" style={{background:p.bg}}>
<div className="card-sport-badge">{p.emoji} {p.sport}</div>
<div className="level-badge" style={{background:p.levelColor+"22",color:p.levelColor}}>{p.level}</div>
</div>
<div className="card-body">
<div className="card-user">
<div className="user-ava">{p.ava}</div>
<div>
<div className="user-name">{p.name} {p.online&&<span style={{fontSize:10,color:"#47ff88"}}>● En ligne</span>}</div>
<div className="user-meta">📍 {p.location} · {p.age} ans · {p.dispo}</div>
</div>
</div>
<div className="card-actions">
<button className="btn-primary" onClick={()=>startChat(p.id)}>💬 Message</button>
{friends.includes(p.id) ? (
<div className="btn-added">✓ Ami</div>
) : pendingFriends.includes(p.id) ? (
<div className="btn-added">⏳ Envoyé</div>
) : (
<button className="btn-ghost" onClick={()=>addFriend(p.id)} title="Ajouter en ami">➕</button>
)}
<button className="btn-ghost" onClick={()=>{setTab("map");}} title="Voir sur la carte">🗺️</button>
</div>
</div>
</div>
))}
</div>
</>)}

{/* EVENTS */}
{tab==="events"&&(<>
<div className="header">
<div className="logo">ÉVÉNEMENTS</div>
<button className="btn-primary" style={{width:"auto",padding:"7px 12px",borderRadius:10,fontSize:12,flex:"none"}} onClick={()=>setTab("create")}>+ Créer</button>
</div>
<div className="feed">
{EVENTS.map((ev,i)=>(
<div key={ev.id} className="event-card" style={{animationDelay:`${i*0.06}s`}}>
<div className="event-header">
<div className="event-emoji" style={{background:ev.bg}}>{ev.sport}</div>
<div><div className="event-title">{ev.title}</div><div className="event-sub">{ev.sportName}</div></div>
<div className="event-spots">{ev.spots} places</div>
</div>
<div className="event-details">
<div className="event-detail">📅 {ev.date}</div>
<div className="event-detail">🕐 {ev.time}</div>
<div className="event-detail">📍 {ev.location}</div>
</div>
<div className="participants-row">
<div className="participant-dots">{ev.participants.map((p,j)=><div key={j} className="dot">{p}</div>)}</div>
<span style={{fontSize:11,color:"var(--muted)",marginLeft:6}}>{ev.total-ev.spots}/{ev.total}</span>
<button className="join-btn" onClick={e=>joinEvent(e,ev.id)} style={joinedEvents.includes(ev.id)?{background:"#2a2a35",color:"var(--muted)"}:{}}>
{joinedEvents.includes(ev.id)?"Inscrit ✓":"Rejoindre"}
</button>
</div>
</div>
))}
</div>
</>)}

{/* MAP */}
{tab==="map"&&(
<div className="map-screen">
<div className="map-header">
<div className="logo">CARTE</div>
<div style={{fontSize:12,color:"var(--muted)"}}>{ALL_USERS.length} sportifs</div>
</div>
{!localized&&(
<div className="locate-banner">
<span style={{fontSize:28}}>📍</span>
<div className="locate-text">
<div>Active ta localisation</div>
<div className="locate-sub">Pour trouver des partenaires autour de toi</div>
</div>
<button className="locate-btn" onClick={()=>{setLocalized(true);showMsg("📍 Localisation activée !");}}>Activer</button>
</div>
)}
<div className="map-container">
<div className="map-grid"/>
<div className="map-overlay"/>
{ALL_USERS.map(u=>(
<div key={u.id} className="map-pin" style={{left:u.lng,top:u.lat}} onClick={()=>startChat(u.id)}>
<div className="pin-bubble">
<span className="pin-sport">{u.emoji}</span>
<span className="pin-name">{u.name.split(" ")[0]}</span>
</div>
<div className="pin-arrow"/>
</div>
))}
{localized&&(
<div className="map-pin" style={{left:190,top:210}}>
<div className="pin-bubble me">
<span className="pin-sport">🏃</span>
<span className="pin-name">Moi</span>
</div>
<div className="pin-arrow me"/>
</div>
)}
<button className="map-you-btn" onClick={()=>{setLocalized(true);showMsg("📍 Position mise à jour !");}}>
{localized?"📍 Ma position":"📍 Me localiser"}
</button>
</div>
<div className="nearby-list">
<div className="section-title" style={{marginTop:0,padding:"0 0 0 0"}}>PRÈS DE TOI</div>
{ALL_USERS.map((u,i)=>(
<div key={u.id} className="nearby-item" onClick={()=>startChat(u.id)}>
<div className="friend-ava" style={{width:40,height:40,fontSize:18}}>{u.ava}</div>
<div>
<div style={{fontWeight:600,fontSize:14}}>{u.name}</div>
<div style={{fontSize:11,color:"var(--muted)"}}>{u.emoji} {u.sport} · {u.location}</div>
</div>
<div className="nearby-dist">{(0.3+i*0.4).toFixed(1)} km</div>
{u.online&&<div style={{width:8,height:8,borderRadius:"50%",background:"#47ff88"}}/>}
</div>
))}
</div>
</div>
)}

{/* MESSAGES */}
{tab==="messages"&&!openChat&&(
<div className="chat-screen">
<div className="chat-header">
<div className="logo">MESSAGES</div>
</div>
<div style={{padding:"0 16px 14px"}}>
<input className="search-bar" placeholder="🔍 Rechercher une conversation..." />
</div>
{Object.keys(chats).length===0&&(
<div className="empty-state"><div className="empty-icon">💬</div>Aucune conversation<br/>Contacte un partenaire !</div>
)}
{Object.keys(chats).map(uid=>{
const u = ALL_USERS.find(x=>x.id===parseInt(uid));
if (!u) return null;
const msgs = chats[uid]?.messages||[];
const last = msgs[msgs.length-1];
return (
<div key={uid} className="chat-item" onClick={()=>setOpenChat(parseInt(uid))}>
<div className="chat-ava">{u.ava}{u.online&&<div className="online-dot"/>}</div>
<div className="chat-info">
<div className="chat-name">{u.name}</div>
<div className="chat-preview">{last?`${last.from==="me"?"Toi: ":""}${last.text}`:"Nouvelle conversation"}</div>
</div>
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
<div className="chat-time">{last?.time||""}</div>
</div>
</div>
);
})}
</div>
)}

{/* FRIENDS */}
{tab==="friends"&&(
<div className="friends-screen">
<div className="chat-header"><div className="logo">AMIS</div></div>
<div style={{padding:"0 16px 14px"}}>
<div className="tab-bar">
<button className={`tab-btn ${friendsTab==="amis"?"active":""}`} onClick={()=>setFriendsTab("amis")}>Mes amis ({friends.length})</button>
<button className={`tab-btn ${friendsTab==="demandes"?"active":""}`} onClick={()=>setFriendsTab("demandes")}>Demandes {pendingFriends.length>0&&`(${pendingFriends.length})`}</button>
</div>
</div>
{friendsTab==="amis"&&(<>
{friends.length===0&&<div className="empty-state"><div className="empty-icon">👥</div>Aucun ami pour l'instant<br/>Explore des profils !</div>}
{ALL_USERS.filter(u=>friends.includes(u.id)).map(u=>(
<div key={u.id} className="friend-item">
<div className="friend-ava" style={{position:"relative"}}>
{u.ava}
{u.online&&<div className="online-dot"/>}
</div>
<div className="friend-info">
<div className="friend-name">{u.name}</div>
<div className="friend-sport">{u.emoji} {u.sport} · {u.location}</div>
</div>
<div className="friend-actions">
<div className="icon-btn" onClick={()=>startChat(u.id)}>💬</div>
<div className="icon-btn" onClick={()=>setTab("map")}>🗺️</div>
</div>
</div>
))}
</>)}
{friendsTab==="demandes"&&(<>
{pendingFriends.length===0&&<div className="empty-state"><div className="empty-icon">📨</div>Aucune demande en attente</div>}
{ALL_USERS.filter(u=>pendingFriends.includes(u.id)).map(u=>(
<div key={u.id} className="friend-item">
<div className="friend-ava">{u.ava}</div>
<div className="friend-info">
<div className="friend-name">{u.name}</div>
<div className="friend-sport">{u.emoji} {u.sport}</div>
</div>
<div className="friend-actions">
<button style={{padding:"7px 14px",background:"var(--accent)",color:"#0a0a0f",border:"none",borderRadius:10,fontWeight:700,fontSize:12,cursor:"pointer"}} onClick={()=>acceptFriend(u.id)}>Accepter</button>
</div>
</div>
))}
</>)}
</div>
)}

{/* CREATE */}
{tab==="create"&&(
<div className="create-form">
<div className="form-header">CRÉER UN ÉVÉNEMENT</div>
<div className="form-group"><label className="form-label">Nom *</label><input className="form-input" placeholder="Ex: Match de basket 5v5" value={formData.title} onChange={e=>setFormData(p=>({...p,title:e.target.value}))} /></div>
<div className="form-group">
<label className="form-label">Sport *</label>
<div className="sport-grid-sm">{SPORTS_LIST.map((s,i)=><div key={i} className={`sport-opt-sm ${selectedSportCreate===i?"selected":""}`} onClick={()=>setSelectedSportCreate(i)}><span>{s.e}</span><span>{s.n}</span></div>)}</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
<div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={formData.date} onChange={e=>setFormData(p=>({...p,date:e.target.value}))} /></div>
<div className="form-group"><label className="form-label">Heure</label><input className="form-input" type="time" value={formData.time} onChange={e=>setFormData(p=>({...p,time:e.target.value}))} /></div>
</div>
<div className="form-group"><label className="form-label">Lieu</label><input className="form-input" placeholder="Adresse ou lieu" value={formData.location} onChange={e=>setFormData(p=>({...p,location:e.target.value}))} /></div>
<div className="form-group"><label className="form-label">Participants max</label><input className="form-input" type="number" placeholder="Ex: 10" value={formData.spots} onChange={e=>setFormData(p=>({...p,spots:e.target.value}))} /></div>
<button className="submit-btn" onClick={handleCreate}>PUBLIER L'ÉVÉNEMENT</button>
</div>
)}

{/* PROFILE */}
{tab==="profile"&&(
<div className="profile-page">
<div className="profile-hero">
{/* Avatar with photo upload */}
<div style={{position:"relative", width:90, height:90, margin:"0 auto 12px"}}>
<div className="profile-avatar" style={{width:90, height:90, fontSize:36, overflow:"hidden"}}>
{profilePhoto
? <img src={profilePhoto} alt="profil" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
: "🏃"}
</div>
<button
onClick={()=>photoInputRef.current?.click()}
style={{position:"absolute",bottom:0,right:0,width:28,height:28,borderRadius:"50%",background:"var(--accent)",border:"2px solid var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",color:"#0a0a0f"}}>
📷
</button>
<input
ref={photoInputRef}
type="file"
accept="image/*"
style={{display:"none"}}
onChange={e=>{
const file = e.target.files?.[0];
if (!file) return;
const reader = new FileReader();
reader.onload = ev => setProfilePhoto(ev.target.result);
reader.readAsDataURL(file);
showMsg("✅ Photo de profil mise à jour !");
}}
/>
</div>
<div className="profile-name">{user?.name?.toUpperCase()}</div>
<div style={{color:"var(--muted)",fontSize:13}}>{user?.email}</div>
{country?.flag && <div style={{fontSize:13,marginTop:4}}>{country.flag} {country.name}</div>}
<div className="sport-tags">
{user?.sports?.map((s,i)=><div key={i} className="sport-tag">{s}</div>)}
{user?.level&&<div className="sport-tag" style={{color:"var(--accent)",borderColor:"rgba(232,255,71,0.3)"}}>⚡ {user.level}</div>}
</div>
<div className="profile-stats">
<div className="stat"><div className="stat-num">{friends.length}</div><div className="stat-label">Amis</div></div>
<div className="stat"><div className="stat-num">{joinedEvents.length}</div><div className="stat-label">Events</div></div>
<div className="stat"><div className="stat-num">{Object.keys(chats).length}</div><div className="stat-label">Chats</div></div>
</div>
</div>
{/* Photo gallery */}
<div style={{background:"var(--card)",borderRadius:20,padding:16,marginBottom:14,border:"1px solid var(--border)"}}>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:1,marginBottom:12}}>MES PHOTOS</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
{[...Array(6)].map((_,i)=>(
<div key={i} onClick={()=>photoInputRef.current?.click()} style={{aspectRatio:"1",borderRadius:12,background:"var(--surface)",border:"1px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,cursor:"pointer",overflow:"hidden"}}>
{i===0 && profilePhoto
? <img src={profilePhoto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
: <span style={{color:"var(--muted)"}}>+</span>}
</div>
))}
</div>
</div>
<button className="logout-btn" onClick={logout}>🚪 Se déconnecter</button>
</div>
)}

{/* BOTTOM NAV */}
<nav className="nav">
{[
{id:"home",icon:"🔍",label:"Explorer"},
{id:"map",icon:"🗺️",label:"Carte"},
{id:"events",icon:"📅",label:"Events"},
{id:"messages",icon:"💬",label:"Messages"},
{id:"friends",icon:"👥",label:"Amis"},
].map(n=>(
<button key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={()=>{setTab(n.id);setOpenChat(null);}}>
<div className="nav-icon">{n.icon}</div>{n.label}
</button>
))}
</nav>
</div></>
);
}s