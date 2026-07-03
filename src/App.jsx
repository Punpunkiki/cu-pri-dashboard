import React, { useMemo, useState, useEffect } from "react";
import {
  Activity, AlertOctagon, AlertTriangle, ArrowUpRight,
  BadgeCheck, Bell, Building2, Check, CheckCircle2, ChevronRight, ClipboardCheck,
  Clock, Copy, Database, FileDown, Filter, Gauge, LayoutDashboard, Leaf,
  MessageSquare, Package, Phone, RefreshCw, Search, Send, ShieldCheck, Snowflake,
  Thermometer, TrendingUp, Users, Wifi, Wrench, Zap, Info, ExternalLink, Sun, Moon
} from "lucide-react";
import {
  ResponsiveContainer, ComposedChart, AreaChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ReferenceArea
} from "recharts";

/* ================================================================
   CU-PRI · Predictive Refrigerant Intelligence — Companion Software
   จุฬาลงกรณ์มหาวิทยาลัย · มาตรการ EE-04 · Race to Zero
   Notifications: LINE Messaging API + OA Broadcast (ไม่ใช้ LINE Notify)
   ================================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.pri-root{
  --pink:#E8578D; --pink-soft:#F7B8D0; --pink-deep:#C2376E;
  --bg:#141318; --panel:#1C1B23; --panel2:#26242F; --line:rgba(255,255,255,.09);
  --txt:#F3F0F6; --mut:#A6A0B1; --faint:#6F687C;
  --ok:#2FBF8F; --warn:#F2B33D; --crit:#FF5147;
  --blue:#5EB3FF; --violet:#B88CFF; --orange:#FF8A5C;
  --mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  font-family:'IBM Plex Sans Thai','Noto Sans Thai',-apple-system,'Segoe UI',sans-serif;
  background:var(--bg); color:var(--txt); min-height:100vh; display:flex;
  -webkit-font-smoothing:antialiased; line-height:1.5;
}
.pri-root *{box-sizing:border-box}
.pri-root ::selection{background:rgba(232,87,141,.35)}
.pri-root button{font:inherit}
.pri-root :focus-visible{outline:2px solid var(--pink);outline-offset:2px;border-radius:6px}

/* ---------- shell ---------- */
.pri-side{width:238px;flex:none;border-right:1px solid var(--line);padding:20px 14px 16px;
  display:flex;flex-direction:column;gap:4px;position:sticky;top:0;height:100vh;background:#161519}
.pri-logo{display:flex;gap:10px;align-items:center;padding:2px 8px 16px}
.pri-logo-t{font-weight:700;font-size:14.5px;letter-spacing:.2px;line-height:1.25}
.pri-logo-s{font-size:10.5px;color:var(--mut);font-family:var(--mono)}
.pri-nav{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:var(--mut);
  cursor:pointer;border:1px solid transparent;background:none;width:100%;text-align:left;font-size:13.5px}
.pri-nav:hover{color:var(--txt);background:rgba(255,255,255,.045)}
.pri-nav.on{color:var(--txt);background:linear-gradient(90deg,rgba(232,87,141,.16),rgba(232,87,141,.04));
  border-color:rgba(232,87,141,.35)}
.pri-nav.on svg{color:var(--pink)}
.pri-nav-s{display:block;font-size:10px;color:var(--faint);font-family:var(--mono);margin-top:1px}
.pri-side-foot{margin-top:auto;border-top:1px solid var(--line);padding-top:12px;font-size:10.5px;
  color:var(--faint);display:flex;flex-direction:column;gap:6px}
.pri-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:99px;
  padding:4px 10px;font-size:10.5px;color:var(--mut);font-family:var(--mono)}

.pri-main{flex:1;min-width:0;padding:22px 28px 70px;
  background:radial-gradient(1100px 460px at 88% -8%,rgba(232,87,141,.075),transparent 60%)}
.pri-top{display:flex;justify-content:space-between;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:18px}
.pri-h1{font-size:21px;font-weight:700;letter-spacing:.1px}
.pri-h1 small{display:block;font-size:12px;color:var(--mut);font-weight:400;margin-top:3px}
.pri-syncpill{display:flex;align-items:center;gap:8px;border:1px solid rgba(47,191,143,.4);
  background:rgba(47,191,143,.08);color:#7CE4BC;border-radius:99px;padding:6px 12px;font-size:11.5px;font-family:var(--mono)}
.pri-date{font-size:11.5px;color:var(--faint);font-family:var(--mono);text-align:right}

/* ---------- primitives ---------- */
.pri-card{background:var(--panel);border:1px solid var(--line);border-radius:14px}
.pri-sec{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--pink);
  font-weight:600;font-family:var(--mono);display:flex;align-items:center;gap:8px}
.pri-sec::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,rgba(232,87,141,.4),transparent)}
.pri-btn{display:inline-flex;align-items:center;gap:7px;border-radius:10px;padding:8px 14px;font-size:12.5px;
  font-weight:600;cursor:pointer;border:1px solid var(--line);background:var(--panel2);color:var(--txt)}
.pri-btn:hover{border-color:rgba(255,255,255,.22)}
.pri-btn.pink{background:var(--pink);border-color:var(--pink);color:#fff}
.pri-btn.pink:hover{background:var(--pink-deep);border-color:var(--pink-deep)}
.pri-btn.ghost{background:transparent}
.pri-st{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;padding:3px 10px;border-radius:99px;font-weight:600;white-space:nowrap}
.st-ok{background:rgba(47,191,143,.12);color:#63DFB2;border:1px solid rgba(47,191,143,.35)}
.st-warn{background:rgba(242,179,61,.12);color:#F7C863;border:1px solid rgba(242,179,61,.4)}
.st-crit{background:rgba(255,81,71,.14);color:#FF8B84;border:1px solid rgba(255,81,71,.45)}
.pri-dot{width:7px;height:7px;border-radius:99px;flex:none}
.pri-dot.crit{animation:priPulse 1.4s ease-in-out infinite}
@keyframes priPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,81,71,.5)}55%{box-shadow:0 0 0 6px rgba(255,81,71,0)}}
.pri-fade{animation:priFade .35s ease both}
@keyframes priFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.pri-fade,.pri-dot.crit,.pri-spin{animation:none!important}}
.pri-spin{animation:priSpin 1s linear infinite}
@keyframes priSpin{to{transform:rotate(360deg)}}
.pri-mono{font-family:var(--mono)}
.pri-mut{color:var(--mut)} .pri-faint{color:var(--faint)}

/* ---------- KPI strip ---------- */
.pri-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:12px;margin:14px 0 18px}
.pri-kpi{padding:14px 16px;display:flex;flex-direction:column;gap:4px;position:relative;overflow:hidden}
.pri-kpi-l{font-size:12px;color:var(--mut);display:flex;align-items:center;gap:7px}
.pri-kpi-v{font-family:var(--mono);font-size:25px;font-weight:600;letter-spacing:-.5px}
.pri-kpi-s{font-size:10.5px;color:var(--faint);font-family:var(--mono)}
.pri-kpi-d{margin-top:auto;padding-top:4px;font-size:10.5px;font-family:var(--mono);
  display:flex;align-items:center;gap:3px}

/* ---------- dashboard columns ---------- */
.pri-cols{display:grid;grid-template-columns:335px minmax(0,1fr);gap:16px;align-items:start}
@media(max-width:1100px){.pri-cols{grid-template-columns:1fr}}
.pri-search{display:flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--line);
  border-radius:10px;padding:8px 12px;margin-bottom:8px}
.pri-search input{background:none;border:none;color:var(--txt);font:inherit;font-size:12.5px;width:100%;outline:none}
.pri-filters{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}
.pri-fbtn{border:1px solid var(--line);background:none;color:var(--mut);border-radius:99px;
  padding:4px 11px;font-size:11px;cursor:pointer;font-weight:500}
.pri-fbtn.on{border-color:rgba(232,87,141,.55);color:var(--pink-soft);background:rgba(232,87,141,.1)}
.pri-list{display:flex;flex-direction:column;gap:8px;max-height:calc(100vh - 330px);min-height:260px;
  overflow:auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:#3A3744 transparent}
.pri-list::-webkit-scrollbar{width:7px}
.pri-list::-webkit-scrollbar-thumb{background:#34313E;border-radius:99px}
.pri-tile{display:flex;flex-direction:column;gap:8px;padding:12px 13px;border-radius:12px;border:1px solid var(--line);
  background:var(--panel);cursor:pointer;text-align:left;color:inherit;width:100%}
.pri-tile:hover{border-color:rgba(255,255,255,.22)}
.pri-tile.sel{border-color:rgba(232,87,141,.6);box-shadow:0 0 0 1px rgba(232,87,141,.45),0 10px 26px rgba(232,87,141,.08)}
.pri-tile-top{display:flex;justify-content:space-between;gap:8px;align-items:center}
.pri-tile-id{font-family:var(--mono);font-size:12.5px;font-weight:600}
.pri-tile-b{font-size:12px;color:var(--mut)}
.pri-tile-meta{display:flex;gap:12px;font-size:10.5px;color:var(--faint);font-family:var(--mono)}
.pri-tile-meta b{color:var(--mut);font-weight:500}

/* ---------- drill-down ---------- */
.pri-drill{padding:18px 20px 20px;display:flex;flex-direction:column;gap:16px}
.pri-drill-h{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:flex-start}
.pri-steps{display:flex;gap:0;flex-wrap:wrap;border:1px solid var(--line);border-radius:12px;overflow:hidden}
.pri-step{flex:1;min-width:150px;padding:10px 14px;display:flex;gap:9px;align-items:center;
  border-right:1px solid var(--line);background:var(--panel)}
.pri-step:last-child{border-right:none}
.pri-step .n{width:22px;height:22px;border-radius:99px;display:flex;align-items:center;justify-content:center;
  font-size:10.5px;font-family:var(--mono);flex:none;border:1px solid var(--line);color:var(--faint)}
.pri-step.done .n{background:rgba(232,87,141,.16);border-color:rgba(232,87,141,.5);color:var(--pink-soft)}
.pri-step.act .n{background:var(--pink);border-color:var(--pink);color:#fff}
.pri-step .t{font-size:11.5px;font-weight:600;line-height:1.25}
.pri-step .s{font-size:9.5px;color:var(--faint);font-family:var(--mono)}
.pri-step.dim{opacity:.45}
.pri-legend{display:flex;gap:14px;flex-wrap:wrap;font-size:11px;color:var(--mut)}
.pri-legend span{display:inline-flex;align-items:center;gap:6px}
.pri-legend i{width:14px;height:3px;border-radius:2px;display:inline-block}
.pri-reads{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}
.pri-read{background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:11px 13px}
.pri-read-l{font-size:10.5px;color:var(--mut);display:flex;gap:6px;align-items:center}
.pri-read-v{font-family:var(--mono);font-size:18px;font-weight:600;margin-top:3px}
.pri-read-s{font-size:10px;color:var(--faint);font-family:var(--mono);margin-top:1px}
.pri-two{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:14px}
@media(max-width:900px){.pri-two{grid-template-columns:1fr}}
.pri-fin{border:1px solid rgba(255,81,71,.35);border-radius:12px;padding:14px 16px;
  background:linear-gradient(180deg,rgba(255,81,71,.07),rgba(255,81,71,.02))}
.pri-fin.calm{border-color:rgba(47,191,143,.3);background:linear-gradient(180deg,rgba(47,191,143,.06),transparent)}
.pri-fin-big{font-family:var(--mono);font-size:27px;font-weight:600;letter-spacing:-.5px}
.pri-fin-rows{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;margin-top:10px}
.pri-fin-r .k{font-size:10.5px;color:var(--mut)}
.pri-fin-r .v{font-family:var(--mono);font-size:14px;font-weight:600;margin-top:1px}
.pri-note{font-size:10px;color:var(--faint);margin-top:10px;line-height:1.5}

/* ---------- tooltip ---------- */
.pri-tip{background:#211F29;border:1px solid var(--line);border-radius:10px;padding:9px 12px;font-size:11.5px;
  box-shadow:0 12px 30px rgba(0,0,0,.45)}
.pri-tip-t{font-family:var(--mono);color:var(--faint);font-size:10px;margin-bottom:5px}
.pri-tip-r{display:flex;align-items:center;gap:7px;color:var(--mut);padding:1.5px 0}
.pri-tip-r b{margin-left:auto;color:var(--txt);font-family:var(--mono);font-weight:600;padding-left:14px}
.pri-tip-r .dot{width:8px;height:8px;border-radius:99px}

/* ---------- tables ---------- */
.pri-table{width:100%;border-collapse:collapse;font-size:12px}
.pri-table th{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);text-align:left;
  padding:9px 12px;border-bottom:1px solid var(--line);font-family:var(--mono);font-weight:500;white-space:nowrap}
.pri-table td{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:top}
.pri-table tr:last-child td{border-bottom:none}
.pri-table .mono{font-family:var(--mono);font-size:11.5px}
.pri-select{background:var(--panel2);border:1px solid var(--line);color:var(--txt);border-radius:9px;
  padding:7px 10px;font:inherit;font-size:12px}

/* ---------- journeys ---------- */
.pri-jcard{padding:18px 20px;display:flex;flex-direction:column;gap:14px}
.pri-jhead{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap}
.pri-jrole{font-size:15.5px;font-weight:700}
.pri-jflow{display:flex;gap:0;overflow-x:auto;padding:6px 2px 10px}
.pri-jstep{min-width:168px;flex:1;position:relative;padding:0 18px 0 0}
.pri-jstep .ic{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;
  background:var(--panel2);border:1px solid var(--line);margin-bottom:8px}
.pri-jstep .ln{position:absolute;top:19px;left:44px;right:6px;height:1px;
  background:linear-gradient(90deg,var(--line),rgba(255,255,255,.02))}
.pri-jstep:last-child .ln{display:none}
.pri-jstep .t{font-size:12.5px;font-weight:600}
.pri-jstep .s{font-size:10.5px;color:var(--faint);margin-top:2px;line-height:1.45}
.pri-jgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
.pri-jbox{background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:11px 13px;font-size:11.5px}
.pri-jbox .h{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);
  font-family:var(--mono);margin-bottom:6px}
.pri-jbox li{margin-left:14px;color:var(--mut);padding:1px 0}
.pri-jtbd{border-left:3px solid var(--pink);padding:8px 14px;background:rgba(232,87,141,.07);
  border-radius:0 10px 10px 0;font-size:13px;font-weight:500;color:var(--pink-soft)}

/* ---------- LINE mockups ---------- */
.pri-phones{display:flex;gap:22px;flex-wrap:wrap;justify-content:center;align-items:flex-start}
.pri-phone{width:292px;border-radius:44px;background:#0C0B10;padding:10px;border:1px solid #2B2934;
  box-shadow:0 26px 60px rgba(0,0,0,.5)}
.pri-screen{border-radius:35px;overflow:hidden;background:linear-gradient(#BAC8DC,#ACBED4);height:606px;
  display:flex;flex-direction:column;color:#1E2530;position:relative}
.pri-sbar{display:flex;justify-content:space-between;align-items:center;padding:9px 20px 4px;
  font-family:var(--mono);font-size:10.5px;color:#25314A;font-weight:600}
.pri-lhead{background:#26364F;color:#fff;display:flex;align-items:center;gap:9px;padding:9px 12px}
.pri-lhead .nm{font-size:12px;font-weight:600;line-height:1.2}
.pri-lhead .sb{font-size:9px;color:#9FB4D2;font-family:var(--mono)}
.pri-chat{flex:1;overflow:auto;padding:12px 11px 8px;display:flex;flex-direction:column;gap:9px;
  scrollbar-width:none}
.pri-chat::-webkit-scrollbar{display:none}
.pri-msgrow{display:flex;gap:7px;align-items:flex-end}
.pri-oaav{width:26px;height:26px;border-radius:99px;overflow:hidden;flex:none;border:1px solid rgba(0,0,0,.12)}
.pri-bub{background:#fff;border-radius:14px;border-top-left-radius:4px;padding:9px 12px;font-size:11.5px;
  max-width:210px;box-shadow:0 1px 2px rgba(20,30,50,.12);line-height:1.5}
.pri-time{font-size:8.5px;color:#5B6B85;align-self:flex-end;font-family:var(--mono);white-space:nowrap}
.pri-flexcard{background:#fff;border-radius:14px;overflow:hidden;max-width:224px;
  box-shadow:0 2px 6px rgba(20,30,50,.16);font-size:11px}
.pri-fchead{padding:11px 13px;color:#fff}
.pri-fchead .t{font-weight:700;font-size:12.5px;line-height:1.3}
.pri-fchead .s{font-size:9px;opacity:.85;font-family:var(--mono);margin-top:2px}
.pri-fcbody{padding:11px 13px;display:flex;flex-direction:column;gap:7px}
.pri-kv{display:flex;gap:8px;font-size:10.5px;line-height:1.45}
.pri-kv .k{color:#8A8A93;flex:0 0 34%}
.pri-kv .v{color:#22222A;font-weight:500;flex:1}
.pri-fcstat{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #EFEFF3;
  padding:5px 0;font-size:11px}
.pri-fcstat:last-child{border-bottom:none}
.pri-fcstat .v{font-family:var(--mono);font-weight:600;color:#1F1F26}
.pri-fcbtn{display:block;text-align:center;border-radius:9px;padding:8px 10px;font-size:11px;font-weight:600;
  margin:0 11px}
.pri-fcfoot{padding:9px 0 12px;display:flex;flex-direction:column;gap:6px}
.pri-qrow{display:flex;gap:6px;padding:4px 10px 8px;overflow-x:auto;scrollbar-width:none}
.pri-qrow::-webkit-scrollbar{display:none}
.pri-qr{background:#fff;border:1px solid #C9D4E4;color:#33415C;border-radius:99px;padding:5px 11px;
  font-size:10px;font-weight:600;white-space:nowrap;box-shadow:0 1px 2px rgba(20,30,50,.08)}
.pri-inbar{background:#F4F6FA;border-top:1px solid #DDE4EF;display:flex;align-items:center;gap:8px;
  padding:8px 12px;font-size:10.5px;color:#8794AB}
.pri-inbar .fld{flex:1;background:#fff;border:1px solid #DCE3EF;border-radius:99px;padding:6px 12px}
.pri-phlabel{text-align:center;margin-top:12px;font-size:12px;color:var(--mut)}
.pri-phlabel b{display:block;color:var(--txt);font-size:12.5px}
.pri-bc{background:#E9EEF6;color:#5B6B85;font-size:9px;font-family:var(--mono);border-radius:99px;
  padding:3px 10px;align-self:center}

/* ---------- handoff ---------- */
.pri-swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.pri-sw{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--panel2)}
.pri-sw .c{height:56px}
.pri-sw .i{padding:9px 11px;display:flex;justify-content:space-between;align-items:center;gap:6px}
.pri-sw .n{font-size:11px;font-weight:600}
.pri-sw .h{font-family:var(--mono);font-size:10px;color:var(--mut)}
.pri-copy{border:1px solid var(--line);background:none;color:var(--mut);border-radius:7px;padding:4px;
  cursor:pointer;display:inline-flex}
.pri-copy:hover{color:var(--txt);border-color:rgba(255,255,255,.25)}
.pri-menu{border:1px solid var(--line);border-radius:14px;overflow:hidden;aspect-ratio:2500/1686;
  display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr;background:#191821}
.pri-zone{border-right:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:10px;position:relative}
.pri-zone:nth-child(3n){border-right:none}
.pri-zone:nth-child(n+4){border-bottom:none}
.pri-zone .zic{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;
  background:rgba(232,87,141,.13);border:1px solid rgba(232,87,141,.4);color:var(--pink-soft)}
.pri-zone.hero{background:linear-gradient(160deg,var(--pink),var(--pink-deep))}
.pri-zone.hero .zic{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.45);color:#fff}
.pri-zone .zt{font-size:12.5px;font-weight:700;text-align:center;line-height:1.25}
.pri-zone .zs{font-size:9px;font-family:var(--mono);color:var(--faint);text-align:center}
.pri-zone.hero .zs{color:rgba(255,255,255,.75)}
.pri-zone .zl{position:absolute;top:8px;left:10px;font-family:var(--mono);font-size:9px;color:var(--faint);
  border:1px solid var(--line);border-radius:6px;padding:1px 6px}
.pri-zone.hero .zl{color:#fff;border-color:rgba(255,255,255,.4)}
.pri-code{background:#121117;border:1px solid var(--line);border-radius:12px;padding:13px 15px;overflow:auto;
  font-family:var(--mono);font-size:10.5px;line-height:1.65;color:#C9C3D4;max-height:340px;white-space:pre}
.pri-acc{border:1px solid var(--line);border-radius:12px;overflow:hidden}
.pri-acc-h{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 15px;
  cursor:pointer;background:var(--panel);width:100%;border:none;color:var(--txt);text-align:left}
.pri-acc-h:hover{background:var(--panel2)}
.pri-acc-t{font-size:13px;font-weight:600;display:flex;align-items:center;gap:9px}

/* ---------- rich menu tap simulator ---------- */
button.pri-zone{background:none;border-top:none;border-left:none;cursor:pointer;font:inherit;color:inherit;text-align:center}
button.pri-zone:hover .zic{transform:scale(1.07)}
.pri-zone .zic{transition:transform .12s ease}
.pri-zone.zsel{box-shadow:inset 0 0 0 2.5px var(--pink);background:rgba(232,87,141,.07)}
.pri-zone.hero.zsel{box-shadow:inset 0 0 0 2.5px #fff}
.pri-sim{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:start;margin-top:14px}
@media(max-width:960px){.pri-sim{grid-template-columns:1fr;justify-items:center}}
.pri-merow{display:flex;justify-content:flex-end;gap:6px;align-items:flex-end}
.pri-me{background:#8DE055;color:#173015;border-radius:14px;border-top-right-radius:4px;padding:8px 12px;
  font-size:11px;max-width:190px;box-shadow:0 1px 2px rgba(20,30,50,.12);line-height:1.5}
.pri-webbar{background:#EDF1F7;border-bottom:1px solid #D8DFEC;display:flex;align-items:center;gap:8px;
  padding:8px 12px;font-size:10px;color:#5B6B85;font-family:var(--mono)}
.pri-webbar .url{flex:1;background:#fff;border:1px solid #DCE3EF;border-radius:99px;padding:4px 11px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pri-liff{flex:1;overflow:auto;background:#141318;color:var(--txt);padding:12px 11px;display:flex;
  flex-direction:column;gap:8px;scrollbar-width:none}
.pri-liff::-webkit-scrollbar{display:none}
.pri-mkpi{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.pri-mkpi>div{background:#1C1B23;border:1px solid rgba(255,255,255,.09);border-radius:9px;padding:7px 9px}
.pri-mkpi .v{font-family:var(--mono);font-size:14px;font-weight:600}
.pri-mkpi .l{font-size:8.5px;color:#A6A0B1}
.pri-mtile{display:flex;justify-content:space-between;align-items:center;background:#1C1B23;
  border:1px solid rgba(255,255,255,.09);border-radius:9px;padding:8px 10px;gap:8px}
.pri-help{flex:1;overflow:auto;background:#FAFBFD;color:#28303F;padding:13px 12px;display:flex;
  flex-direction:column;gap:9px;font-size:10.5px;scrollbar-width:none}
.pri-help::-webkit-scrollbar{display:none}
.pri-help h4{font-size:11.5px;margin:0 0 5px;color:#141318}
.pri-help .hp{background:#fff;border:1px solid #E3E8F1;border-radius:10px;padding:9px 11px;line-height:1.65}

/* ---------- toast ---------- */
.pri-toast{position:fixed;bottom:22px;right:22px;background:#221F2B;border:1px solid rgba(232,87,141,.5);
  color:var(--txt);border-radius:12px;padding:11px 16px;font-size:12.5px;display:flex;gap:9px;align-items:center;
  box-shadow:0 16px 40px rgba(0,0,0,.5);z-index:60;animation:priFade .25s ease both}

/* ---------- responsive shell ---------- */
@media(max-width:840px){
  .pri-root{flex-direction:column}
  .pri-side{width:100%;height:auto;position:static;flex-direction:row;align-items:center;gap:4px;
    overflow-x:auto;padding:10px 12px;border-right:none;border-bottom:1px solid var(--line)}
  .pri-logo{padding:0 10px 0 0}
  .pri-logo-s,.pri-nav-s,.pri-side-foot{display:none}
  .pri-nav{width:auto;white-space:nowrap;padding:8px 12px}
  .pri-main{padding:16px 14px 60px}
  .pri-list{max-height:none}
}

/* ---------- theme toggle button ---------- */
.pri-th{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;
  border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--mut);cursor:pointer}
.pri-th:hover{color:var(--txt);border-color:var(--pink)}

/* ---------- LIGHT THEME ---------- */
.pri-root.light{
  --bg:#F3F4F8; --panel:#FFFFFF; --panel2:#F1F2F6; --line:rgba(20,19,32,.11);
  --txt:#1A1A22; --mut:#5C5768; --faint:#8B8695;
}
.pri-root.light .pri-side{background:#FAFAFC}
.pri-root.light .pri-nav:hover{background:rgba(20,19,32,.05)}
.pri-root.light .pri-nav.on{background:linear-gradient(90deg,rgba(232,87,141,.12),rgba(232,87,141,.02))}
.pri-root.light .pri-btn:hover{border-color:rgba(20,19,32,.22)}
.pri-root.light .pri-tile:hover{border-color:rgba(20,19,32,.22)}
.pri-root.light .pri-copy:hover{border-color:rgba(20,19,32,.25)}
.pri-root.light .pri-list{scrollbar-color:#C7C7D2 transparent}
.pri-root.light .pri-list::-webkit-scrollbar-thumb{background:#C9C9D3}
.pri-root.light .pri-tip{background:#FFFFFF;box-shadow:0 12px 30px rgba(20,19,32,.15)}
.pri-root.light .pri-toast{background:#FFFFFF;box-shadow:0 16px 40px rgba(20,19,32,.18)}
.pri-root.light .pri-table td{border-bottom-color:rgba(20,19,32,.08)}
.pri-root.light .pri-syncpill{color:#0C8A62;border-color:rgba(47,159,120,.4);background:rgba(47,191,143,.13)}
.pri-root.light .st-ok{color:#0C8A62}
.pri-root.light .st-warn{color:#946200}
.pri-root.light .st-crit{color:#C62B21}
.pri-root.light .pri-fbtn.on{color:var(--pink-deep)}
.pri-root.light .pri-step.done .n{color:var(--pink-deep)}
`;

/* ================================================================ DATA */

const GWP = 2088; // R-410A

const ASSETS = [
  {
    id: "CH-MED-01", type: "Chiller 450 RT", building: "คณะแพทยศาสตร์", en: "Faculty of Medicine",
    cc: "CC-MED", ccEmis: "13,289.28 tCO2e/ปี", status: "crit", stage: 4, confidence: 92,
    cop: 4.1, copBase: 5.2, ppm: 36,
    suction: 7.4, suctionBase: 8.6, superheat: 10.7, superheatBase: 6.5,
    runtime: 18.4, runtimeDelta: 13, kwhDay: 8130, kwhDelta: 18,
    leakKgDay: 0.42, bahtDay: 6850,
    note: "ยืนยันการรั่วบริเวณท่อทางดูด (Suction Line) ใกล้วาล์วบริการ — NDIR 36 ppm ต่อเนื่อง 3 ชม.",
  },
  {
    id: "CH-SCI-02", type: "Chiller 380 RT", building: "คณะวิทยาศาสตร์", en: "Faculty of Science",
    cc: "CC-SCI", ccEmis: "9,980.35 tCO2e/ปี", status: "warn", stage: 3, confidence: 68,
    cop: 4.8, copBase: 5.1, ppm: 6,
    suction: 8.2, suctionBase: 8.5, superheat: 9.0, superheatBase: 6.4,
    runtime: 16.1, runtimeDelta: 5, kwhDay: 5940, kwhDelta: 7,
    leakKgDay: 0.09, bahtDay: 1720,
    note: "แนวโน้ม Micro-leak ระยะเริ่มต้น (สูญเสียมวล ~1–5%) — รอ Cross-validation จาก NDIR (ยังต่ำกว่าเกณฑ์ 10 ppm)",
  },
  {
    id: "CH-MED-02", type: "Chiller 450 RT", building: "คณะแพทยศาสตร์", en: "Faculty of Medicine",
    cc: "CC-MED", ccEmis: "13,289.28 tCO2e/ปี", status: "ok", stage: 2, confidence: null,
    cop: 5.3, copBase: 5.3, ppm: 2, suction: 8.6, suctionBase: 8.6, superheat: 6.3, superheatBase: 6.4,
    runtime: 14.2, runtimeDelta: 0, kwhDay: 6210, kwhDelta: 0, leakKgDay: 0, bahtDay: 0,
    note: "ทำงานตามเส้นฐานพลวัต — COP คงที่",
  },
  {
    id: "CH-SCI-01", type: "Chiller 380 RT", building: "คณะวิทยาศาสตร์", en: "Faculty of Science",
    cc: "CC-SCI", ccEmis: "9,980.35 tCO2e/ปี", status: "ok", stage: 2, confidence: null,
    cop: 5.1, copBase: 5.1, ppm: 1, suction: 8.5, suctionBase: 8.5, superheat: 6.5, superheatBase: 6.5,
    runtime: 13.8, runtimeDelta: 0, kwhDay: 5480, kwhDelta: 0, leakKgDay: 0, bahtDay: 0,
    note: "ทำงานตามเส้นฐานพลวัต",
  },
  {
    id: "CH-ENG-01", type: "Chiller 320 RT", building: "คณะวิศวกรรมศาสตร์", en: "Faculty of Engineering",
    cc: "CC-ENG", ccEmis: "—", status: "ok", stage: 2, confidence: null,
    cop: 5.4, copBase: 5.3, ppm: 1, suction: 8.4, suctionBase: 8.4, superheat: 6.1, superheatBase: 6.2,
    runtime: 12.9, runtimeDelta: -1, kwhDay: 4720, kwhDelta: -1, leakKgDay: 0, bahtDay: 0,
    note: "ซ่อมวาล์วแล้วเสร็จ 11 มิ.ย. — ประสิทธิภาพดีกว่าเส้นฐานเล็กน้อย",
  },
  {
    id: "VRF-CJ9-01", type: "VRF 96 kW", building: "อาคารจามจุรี 9", en: "Chamchuri 9 Building",
    cc: "CC-CJ9", ccEmis: "—", status: "ok", stage: 2, confidence: null,
    cop: 4.9, copBase: 4.9, ppm: 1, suction: 9.1, suctionBase: 9.1, superheat: 5.8, superheatBase: 5.8,
    runtime: 11.6, runtimeDelta: 0, kwhDay: 1860, kwhDelta: 0, leakKgDay: 0, bahtDay: 0,
    note: "เติมสารทำความเย็น 2.5 kg (บันทึกจริง 2 มิ.ย.) — เฝ้าติดตามหลังซ่อม",
  },
  {
    id: "CH-LIB-01", type: "Chiller 260 RT", building: "สำนักงานวิทยทรัพยากร (หอสมุดกลาง)", en: "Central Library",
    cc: "CC-LIB", ccEmis: "—", status: "ok", stage: 2, confidence: null,
    cop: 5.2, copBase: 5.2, ppm: 2, suction: 8.3, suctionBase: 8.3, superheat: 6.6, superheatBase: 6.6,
    runtime: 12.1, runtimeDelta: 0, kwhDay: 3980, kwhDelta: 0, leakKgDay: 0, bahtDay: 0,
    note: "สอบเทียบเซนเซอร์ตามรอบ 28 พ.ค. — ปกติ",
  },
  {
    id: "CH-MCS-01", type: "Chiller 300 RT", building: "อาคารมหาจักรีสิรินธร", en: "Maha Chakri Sirindhorn Bldg.",
    cc: "CC-MCS", ccEmis: "—", status: "ok", stage: 2, confidence: null,
    cop: 5.0, copBase: 5.0, ppm: 1, suction: 8.5, suctionBase: 8.5, superheat: 6.4, superheatBase: 6.4,
    runtime: 13.2, runtimeDelta: 1, kwhDay: 4310, kwhDelta: 1, leakKgDay: 0, bahtDay: 0,
    note: "ทำงานตามเส้นฐานพลวัต",
  },
];

const ST = {
  ok:   { label: "ปกติ",      en: "Normal",            color: "var(--ok)",   Icon: CheckCircle2 },
  warn: { label: "เฝ้าระวัง", en: "Anomaly Predictive", color: "var(--warn)", Icon: AlertTriangle },
  crit: { label: "วิกฤต",     en: "Critical Leak",      color: "var(--crit)", Icon: AlertOctagon },
};

/* deterministic 15-point (14-day) series per asset — % deviation from dynamic baseline */
function buildSeries(a) {
  const pts = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const w = (f, p) => Math.sin(i * f + p) * 0.55 + Math.cos(i * f * 0.63 + p) * 0.3;
    const ramp = (start, target, pow) => (t > start ? Math.pow((t - start) / (1 - start), pow) * target : 0);
    let suction = w(1.7, 0.4) * 0.7, superheat = w(2.3, 1.2) * 0.8;
    let runtime = w(1.3, 2.1) * 0.7, kwh = w(2.9, 0.7) * 0.9, ppm = 1.4 + w(1.1, 3.0) * 0.5;
    if (a.status === "crit") {
      suction += -ramp(0.42, 13.9, 1.6); superheat += ramp(0.42, 11.2, 1.5);
      runtime += ramp(0.46, 13, 1.5);   kwh += ramp(0.46, 18, 1.5);
      ppm += t > 0.7 ? Math.pow((t - 0.7) / 0.3, 2) * 34.5 : 0;
    } else if (a.status === "warn") {
      suction += -ramp(0.5, 3.5, 1.5); superheat += ramp(0.5, 6.1, 1.5);
      runtime += ramp(0.55, 5, 1.4);   kwh += ramp(0.55, 7, 1.4);
      ppm += t > 0.78 ? Math.pow((t - 0.78) / 0.22, 2) * 4.6 : 0;
    }
    pts.push({
      x: i, band: [-4, 4],
      suction: +suction.toFixed(1), superheat: +superheat.toFixed(1),
      runtime: +runtime.toFixed(1), kwh: +kwh.toFixed(1),
      ppm: +Math.max(0.4, ppm).toFixed(1),
    });
  }
  return pts;
}

const AUDIT = [
  { date: "28 มิ.ย. 2569", asset: "CH-MED-01", cc: "CC-MED", b: "คณะแพทยศาสตร์", event: "ยืนยันการรั่วไหล (Critical) — ท่อทางดูด, ยกระดับโดย NDIR Cross-validation", ppm: "36", kg: "5.9 (สะสม)", tco2e: "12.32", state: "crit", stateT: "กำลังดำเนินการ", wo: "WO-2569-0142" },
  { date: "24 มิ.ย. 2569", asset: "CH-MED-01", cc: "CC-MED", b: "คณะแพทยศาสตร์", event: "Anomaly Predictive — Suction ↓ / Superheat +2.8°C ต่อเนื่อง 18 ชม.", ppm: "4", kg: "~0.42/วัน", tco2e: "—", state: "warn", stateT: "ยกระดับแล้ว", wo: "WO-2569-0142" },
  { date: "19 มิ.ย. 2569", asset: "CH-SCI-02", cc: "CC-SCI", b: "คณะวิทยาศาสตร์", event: "Micro-leak แนวโน้มเริ่มต้น (สูญเสียมวล 1–5%) — เฝ้าระวังรอ NDIR", ppm: "6", kg: "~0.09/วัน", tco2e: "—", state: "warn", stateT: "เฝ้าระวัง", wo: "—" },
  { date: "11 มิ.ย. 2569", asset: "CH-ENG-01", cc: "CC-ENG", b: "คณะวิศวกรรมศาสตร์", event: "ปิดงานซ่อมวาล์ว — ทวนสอบด้วย NDIR แล้ว ป้องกันการรั่ว 3.1 kg", ppm: "1", kg: "3.1 (ป้องกัน)", tco2e: "6.47", state: "ok", stateT: "ปิดงาน", wo: "WO-2569-0117" },
  { date: "02 มิ.ย. 2569", asset: "VRF-CJ9-01", cc: "CC-CJ9", b: "อาคารจามจุรี 9", event: "เติมสารทำความเย็น R-410A (บันทึกจริงแทนค่าประมาณ)", ppm: "—", kg: "2.5", tco2e: "5.22", state: "ok", stateT: "ปิดงาน", wo: "WO-2569-0103" },
  { date: "28 พ.ค. 2569", asset: "CH-LIB-01", cc: "CC-LIB", b: "หอสมุดกลาง", event: "ตรวจสอบตามรอบ + สอบเทียบเซนเซอร์ NDIR / Pressure Transmitter", ppm: "1", kg: "—", tco2e: "—", state: "ok", stateT: "ปิดงาน", wo: "PM-2569-0061" },
  { date: "15 พ.ค. 2569", asset: "CH-MED-02", cc: "CC-MED", b: "คณะแพทยศาสตร์", event: "สัญญาณผิดปกติชั่วคราว — ตัดออกเป็น False Positive โดย Cross-validation", ppm: "2", kg: "—", tco2e: "—", state: "ok", stateT: "ปิดงาน", wo: "—" },
  { date: "06 พ.ค. 2569", asset: "CH-SCI-01", cc: "CC-SCI", b: "คณะวิทยาศาสตร์", event: "Dynamic Baselining ครบ 30 วัน — เปิดโหมดพยากรณ์ (Predictive Mode)", ppm: "—", kg: "—", tco2e: "—", state: "ok", stateT: "ปิดงาน", wo: "—" },
];

const STAGES = [
  { t: "Baselining", s: "เส้นฐานพลวัต 14–30 วัน" },
  { t: "Correlation", s: "วิเคราะห์พหุสัญญาณ" },
  { t: "Cross-validation", s: "ทวนสอบด้วย NDIR" },
  { t: "Dispatch", s: "แจ้งเตือน + Work Order" },
];

const KPI_TARGETS = [
  { k: "Early Detection Rate", t: "ตรวจจับ Micro-leak ล่วงหน้า ก่อน COP ตกเกิน 10%", target: "≥ 80%", val: 87, max: 100, unit: "%" },
  { k: "ลดการเติมสารทำความเย็น", t: "เทียบสถิติย้อนหลังของอาคารนำร่อง", target: "≥ 30%", val: 34, max: 50, unit: "%" },
  { k: "Sync Uptime (Race to Zero)", t: "Downtime ไม่เกิน 2%/เดือน", target: "≥ 98%", val: 99.4, max: 100, unit: "%" },
  { k: "ลด Emergency Call-outs", t: "เทียบเกณฑ์มาตรฐานเดิม", target: "≥ 40%", val: 45, max: 60, unit: "%" },
];

const JOURNEYS = [
  {
    role: "ช่างเทคนิคอาคาร / ทีมบำรุงรักษา", en: "Facility Technicians · First Responders",
    Icon: Wrench, color: "var(--crit)",
    trigger: "LINE Push (Messaging API) แบบเรียลไทม์ ทันทีที่ระบบยืนยันความผิดปกติ — Anomaly ต่อเนื่อง 12–24 ชม. หรือ NDIR เกินเกณฑ์ 10–50 ppm",
    goals: ["ปิดงานซ่อมก่อนเครื่องเสียหายหนัก (คอมเพรสเซอร์พัง = ฿250,000–450,000)", "ลดเวลาวิเคราะห์ปัญหา (Troubleshooting Time) ด้วยบริบทวิศวกรรมที่พร้อมปฏิบัติ"],
    pains: ["เดิมรู้ปัญหาเมื่อแอร์ไม่เย็น / เครื่องล้มเหลวแล้ว (Reactive)", "Error code อ่านยาก ไม่บอกอาการและตำแหน่งที่ต้องเข้าตรวจ"],
    touch: "LINE Push (Flex Message) → Drill-down ผ่าน LIFF → Quick Reply 'รับเรื่อง / เปิด Work Order' → บันทึกผลเข้า Audit Log",
    jtbd: "“เมื่อมีความเสี่ยงรั่วไหล ฉันต้องรู้ว่า ที่ไหน · อาการอะไร · ต้องทำอะไร — ภายในไม่กี่นาที ไม่ใช่หลังเครื่องพัง”",
    steps: [
      { Icon: Bell, t: "รับ LINE Push", s: "Flex Message พร้อมอาการ + ตำแหน่งคาดการณ์ + Confidence" },
      { Icon: Gauge, t: "เปิด Drill-down", s: "ดู Failure Signature ของเครื่องผ่าน LIFF ในแชท" },
      { Icon: ClipboardCheck, t: "รับเรื่อง / Dispatch", s: "Quick Reply 'รับเรื่อง' เปิด Work Order อัตโนมัติ" },
      { Icon: Wrench, t: "เข้าซ่อมหน้างาน", s: "ค่าก๊าซ ppm + จุดคาดการณ์นำทางการตรวจสอบ" },
      { Icon: CheckCircle2, t: "ปิดงาน + บันทึกผล", s: "ผลซ่อม/ปริมาณสารที่กู้คืน เข้าสู่ Audit Log" },
    ],
  },
  {
    role: "ผู้บริหารสำนักบริหารระบบกายภาพ", en: "Physical Resources Office Management",
    Icon: Building2, color: "var(--pink)",
    trigger: "สรุปผู้บริหารรายสัปดาห์ ทุกวันจันทร์ 08:00 น. ผ่าน LINE OA Broadcast หรืออีเมลอัตโนมัติ — ไม่รับการแจ้งเตือนรายนาที",
    goals: ["เห็นผลตอบแทนชัดเจน: COP ที่ดีขึ้น · ชั่วโมงฉุกเฉินที่เลี่ยงได้ · บาทที่ประหยัด", "มีข้อมูลตัดสินใจอนุมัติขยายผลสู่อาคารอื่น"],
    pains: ["ข้อมูลเดิมเป็นค่าประมาณคงที่ 5 ปี ตรวจสอบไม่ได้", "รายงานเทคนิครายวันมากเกินไป ไม่ตอบคำถามเชิงบริหาร"],
    touch: "LINE OA Broadcast (Flex สรุป) / อีเมล → แดชบอร์ดมุมมองผู้บริหาร → แนวโน้ม COP และการเงิน → อนุมัติ Scale-up",
    jtbd: "“ฉันต้องเห็นภายใน 1 นาทีว่าระบบนี้ประหยัดเงินและพลังงานเท่าไร และคุ้มที่จะขยายผลหรือไม่”",
    steps: [
      { Icon: MessageSquare, t: "รับสรุปรายสัปดาห์", s: "Broadcast จันทร์ 08:00 — สแกนได้ใน 1 นาที" },
      { Icon: LayoutDashboard, t: "เปิดแดชบอร์ด", s: "KPI Strip: อาคารปกติ · แจ้งเตือน · tCO2e · ฿" },
      { Icon: TrendingUp, t: "ดูแนวโน้ม", s: "COP Improvement / บาทที่ประหยัดสะสม" },
      { Icon: BadgeCheck, t: "อนุมัติขยายผล", s: "ใช้ผล Pilot อ้างอิงมาตรการ EE-04" },
    ],
  },
  {
    role: "ผู้ดูแลแพลตฟอร์ม Net Zero", en: "Sustainability Admin",
    Icon: Leaf, color: "var(--ok)",
    trigger: "รอบทวนสอบ ISO 14064-1 และรอบซิงค์ข้อมูลอัตโนมัติสิ้นเดือนเข้าสู่แพลตฟอร์ม “Race to Zero”",
    goals: ["แทนที่ตัวเลขแช่แข็ง 12,273 tCO2e/ปี ด้วยข้อมูลจริงที่ตรวจสอบย้อนกลับได้", "ผ่านการทวนสอบตามมาตรฐาน ISO 14064-1"],
    pains: ["เดิมรวบรวมใบเสร็จซื้อน้ำยาแอร์ลง Excel ตอนสิ้นปี", "หลายหน่วยงานรับผิดชอบ ข้อมูลล่าช้าและไม่ครบ"],
    touch: "แดชบอร์ด → Export Module (กรองช่วงเวลา / Cost Center) → ดาวน์โหลด Audit Log CSV → ตรวจสถานะ API Sync สู่ Race to Zero",
    jtbd: "“ฉันต้องส่งตัวเลขการปล่อยจริง (kg × GWP → tCO2e) เข้าสู่ Race to Zero โดยอัตโนมัติ และพร้อมให้ผู้ทวนสอบตรวจย้อนกลับได้ทุกรายการ”",
    steps: [
      { Icon: LayoutDashboard, t: "เปิดแดชบอร์ด", s: "เข้าสู่ Export Module ด้วยสิทธิ์ Admin" },
      { Icon: Filter, t: "กรองข้อมูล", s: "ช่วงเวลา / Cost Center (คณะ)" },
      { Icon: FileDown, t: "Export Audit Log", s: "CSV จัดรูปแบบสำหรับ ISO 14064-1" },
      { Icon: RefreshCw, t: "ยืนยันสถานะ Sync", s: "POST อัตโนมัติสิ้นเดือน → Race to Zero" },
    ],
  },
];

/* ---------------- LINE OA handoff data ---------------- */

const BRAND = [
  { n: "Chula Pink · Primary", h: "#E8578D", note: "สี OA Theme / ปุ่มหลัก / Active state" },
  { n: "Pink Soft", h: "#F7B8D0", note: "ข้อความรอง / ไฮไลต์อ่อน" },
  { n: "Charcoal · Base", h: "#141318", note: "พื้นหลังหลัก" },
  { n: "Panel", h: "#1C1B23", note: "การ์ด / พื้นผิว" },
  { n: "Status · ปกติ", h: "#2FBF8F", note: "GREEN — ทำงานปกติ" },
  { n: "Status · เฝ้าระวัง", h: "#F2B33D", note: "YELLOW — Anomaly Predictive" },
  { n: "Status · วิกฤต", h: "#FF5147", note: "RED — Critical Leak" },
];

const LOGO_SVG = `<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" rx="22" fill="#E8578D"/>
  <g stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M48 16v26"/><path d="M35 24l13 8 13-8"/><path d="M27 35l21 13 21-13" opacity=".5"/>
  </g>
  <path d="M15 67h18l7-13 9 23 7-15h25" fill="none" stroke="#141318" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15 67h18l7-13 9 23 7-15h25" fill="none" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const GREETING = `สวัสดีค่ะ 👋 ยินดีต้อนรับสู่ CU-PRI
(CU Predictive Refrigerant Intelligence)

ระบบเฝ้าระวังการรั่วไหลของสารทำความเย็นแบบเรียลไทม์ เพื่อเป้าหมาย Net Zero ของจุฬาลงกรณ์มหาวิทยาลัย 🌱

สิ่งที่บัญชีนี้จะช่วยคุณ:
🔔 แจ้งเตือนความผิดปกติของ Chiller ทันที พร้อมอาการและตำแหน่งคาดการณ์
📊 เปิดแดชบอร์ด Single Pane of Glass ได้จากเมนูด้านล่าง
📄 ผู้บริหารรับรายงานสรุปทุกวันจันทร์ 08:00 น.

เริ่มต้นใช้งาน: แตะเมนู "แดชบอร์ด" หรือพิมพ์ "สถานะ" เพื่อดูภาพรวมอาคารของท่านได้เลยค่ะ`;

const kv = (k, v) => ({
  type: "box", layout: "baseline", spacing: "sm",
  contents: [
    { type: "text", text: k, color: "#8A8A93", size: "sm", flex: 3 },
    { type: "text", text: v, color: "#1F1F26", size: "sm", flex: 7, wrap: true },
  ],
});

const FLEX_TECH = {
  type: "flex",
  altText: "⚠️ แจ้งเตือนความเสี่ยงสูง: CH-MED-01 คณะแพทยศาสตร์ — Suction ↓ / Superheat +4.2°C / ก๊าซ 20 ppm",
  contents: {
    type: "bubble", size: "mega",
    header: {
      type: "box", layout: "vertical", backgroundColor: "#B45309", paddingAll: "16px",
      contents: [
        { type: "text", text: "⚠️ แจ้งเตือนความเสี่ยงสูง", color: "#FFFFFF", weight: "bold", size: "lg" },
        { type: "text", text: "Anomaly Predictive · Leak Confidence 92%", color: "#FDE8C8", size: "xs", margin: "sm" },
      ],
    },
    body: {
      type: "box", layout: "vertical", spacing: "md", paddingAll: "16px",
      contents: [
        kv("อาคาร", "คณะแพทยศาสตร์ · ห้องเครื่องชั้น B1"),
        kv("เครื่อง", "Chiller CH-MED-01 (R-410A)"),
        kv("อาการ", "แรงดันด้านดูดตกต่ำกว่าเส้นฐาน −14% และ Superheat +4.2 °C ต่อเนื่อง 18 ชม."),
        kv("ก๊าซในห้องเครื่อง", "20 ppm (เกณฑ์เฝ้าระวัง 10–50 ppm)"),
        kv("ตำแหน่งคาดการณ์", "ท่อทางดูด (Suction Line) ใกล้วาล์วบริการ"),
        { type: "separator", margin: "md" },
        { type: "text", text: "กรุณาเข้าตรวจสอบภายใน 2 ชั่วโมง — Energy Penalty ประมาณ ฿6,850/วัน หากไม่แก้ไข", size: "xs", color: "#8A8A93", wrap: true, margin: "md" },
      ],
    },
    footer: {
      type: "box", layout: "vertical", spacing: "sm", paddingAll: "16px",
      contents: [
        { type: "button", style: "primary", color: "#141318", height: "sm", action: { type: "postback", label: "รับเรื่อง / เปิด Work Order", data: "action=ack&wo=create&asset=CH-MED-01" } },
        { type: "button", style: "secondary", height: "sm", action: { type: "uri", label: "เปิด Drill-down (LIFF)", uri: "https://liff.line.me/2000000000-XXXXXXXX?asset=CH-MED-01" } },
      ],
    },
  },
  quickReply: {
    items: [
      { type: "action", action: { type: "postback", label: "รับเรื่อง", data: "action=ack&asset=CH-MED-01", displayText: "รับเรื่อง CH-MED-01" } },
      { type: "action", action: { type: "postback", label: "เปิด Work Order", data: "action=wo&asset=CH-MED-01", displayText: "เปิด Work Order" } },
      { type: "action", action: { type: "uri", label: "ดูแดชบอร์ด", uri: "https://liff.line.me/2000000000-XXXXXXXX" } },
    ],
  },
};

const FLEX_WEEKLY = {
  type: "flex",
  altText: "📊 สรุปผู้บริหารรายสัปดาห์ 23–29 มิ.ย. 2569: COP +8.2% · ประหยัด ฿186,400 · ป้องกัน 42.8 tCO2e",
  contents: {
    type: "bubble", size: "mega",
    header: {
      type: "box", layout: "vertical", backgroundColor: "#E8578D", paddingAll: "16px",
      contents: [
        { type: "text", text: "📊 สรุปผู้บริหารรายสัปดาห์", color: "#FFFFFF", weight: "bold", size: "lg" },
        { type: "text", text: "23–29 มิ.ย. 2569 · อาคารนำร่อง 8 เครื่อง · CU-PRI", color: "#FBDCE9", size: "xs", margin: "sm" },
      ],
    },
    body: {
      type: "box", layout: "vertical", spacing: "sm", paddingAll: "16px",
      contents: [
        { type: "box", layout: "baseline", contents: [ { type: "text", text: "ประสิทธิภาพ COP เฉลี่ย", size: "sm", color: "#8A8A93", flex: 6 }, { type: "text", text: "+8.2%", size: "sm", weight: "bold", color: "#1B9E77", flex: 3, align: "end" } ] },
        { type: "box", layout: "baseline", contents: [ { type: "text", text: "ชั่วโมงฉุกเฉินที่หลีกเลี่ยงได้", size: "sm", color: "#8A8A93", flex: 6 }, { type: "text", text: "14 ชม.", size: "sm", weight: "bold", color: "#1F1F26", flex: 3, align: "end" } ] },
        { type: "box", layout: "baseline", contents: [ { type: "text", text: "ประหยัดค่าไฟ + ค่าซ่อม", size: "sm", color: "#8A8A93", flex: 6 }, { type: "text", text: "฿186,400", size: "sm", weight: "bold", color: "#1F1F26", flex: 3, align: "end" } ] },
        { type: "box", layout: "baseline", contents: [ { type: "text", text: "ป้องกันการปล่อย (เดือนนี้)", size: "sm", color: "#8A8A93", flex: 6 }, { type: "text", text: "42.8 tCO2e", size: "sm", weight: "bold", color: "#1B9E77", flex: 3, align: "end" } ] },
        { type: "separator", margin: "md" },
        { type: "text", text: "สถานะ: 🟢 ปกติ 6 · 🟡 เฝ้าระวัง 1 · 🔴 วิกฤต 1 (กำลังซ่อม, ตอบสนองภายใน 1.5 ชม.)", size: "xs", color: "#8A8A93", wrap: true, margin: "md" },
      ],
    },
    footer: {
      type: "box", layout: "vertical", paddingAll: "16px",
      contents: [
        { type: "button", style: "primary", color: "#E8578D", height: "sm", action: { type: "uri", label: "เปิดแดชบอร์ดผู้บริหาร", uri: "https://liff.line.me/2000000000-XXXXXXXX?view=executive" } },
      ],
    },
  },
};

const FLEX_CRIT = {
  type: "flex",
  altText: "🔴 ยืนยันการรั่วไหล (Critical): CH-MED-01 — NDIR 36 ppm · เข้าพื้นที่ทันที",
  contents: {
    type: "bubble", size: "mega",
    header: {
      type: "box", layout: "vertical", backgroundColor: "#DC2626", paddingAll: "16px",
      contents: [
        { type: "text", text: "🔴 ยกระดับเป็นวิกฤต (Critical Leak)", color: "#FFFFFF", weight: "bold", size: "lg", wrap: true },
        { type: "text", text: "Cross-validated โดยเซนเซอร์ NDIR · 28 มิ.ย. 2569 14:07", color: "#FBD5D5", size: "xs", margin: "sm" },
      ],
    },
    body: {
      type: "box", layout: "vertical", spacing: "md", paddingAll: "16px",
      contents: [
        kv("สถานะ", "เปลี่ยนจาก 🟡 เฝ้าระวัง → 🔴 วิกฤต"),
        kv("NDIR ห้องเครื่อง", "36 ppm (เกินเกณฑ์เฝ้าระวัง 10–50 ppm)"),
        kv("อัตรารั่วประมาณ", "0.42 kg/วัน ≈ 0.88 tCO2e/วัน (R-410A, GWP 2,088)"),
        kv("สถานที่", "คณะแพทยศาสตร์ · ห้องเครื่องชั้น B1 · CH-MED-01"),
        { type: "separator", margin: "md" },
        { type: "text", text: "⚠️ ความปลอดภัย: ระบายอากาศห้องเครื่องก่อนเข้าพื้นที่ และเตรียมอุปกรณ์ตรวจรอยรั่ว", size: "xs", color: "#B91C1C", wrap: true, margin: "md" },
      ],
    },
    footer: {
      type: "box", layout: "vertical", spacing: "sm", paddingAll: "16px",
      contents: [
        { type: "button", style: "primary", color: "#DC2626", height: "sm", action: { type: "uri", label: "โทรแจ้งหัวหน้าช่าง", uri: "tel:+6622183000" } },
        { type: "button", style: "secondary", height: "sm", action: { type: "uri", label: "นำทางไปห้องเครื่อง", uri: "https://maps.google.com/?q=13.7387,100.5306" } },
      ],
    },
  },
  quickReply: {
    items: [
      { type: "action", action: { type: "postback", label: "รับทราบ · กำลังเข้าพื้นที่", data: "action=enroute&asset=CH-MED-01", displayText: "รับทราบ กำลังเข้าพื้นที่" } },
    ],
  },
};

const RICH_MENU = {
  size: { width: 2500, height: 1686 },
  selected: true,
  name: "CU-PRI Main Menu v1",
  chatBarText: "เมนู CU-PRI",
  areas: [
    { bounds: { x: 0,    y: 0,   width: 834, height: 843 }, action: { type: "uri",      label: "แดชบอร์ด",   uri: "https://liff.line.me/2000000000-XXXXXXXX?view=dashboard" } },
    { bounds: { x: 834,  y: 0,   width: 833, height: 843 }, action: { type: "postback", label: "การแจ้งเตือน", data: "menu=alerts",  displayText: "ดูการแจ้งเตือนล่าสุด" } },
    { bounds: { x: 1667, y: 0,   width: 833, height: 843 }, action: { type: "postback", label: "รายงานสรุป",  data: "menu=weekly",  displayText: "ขอรายงานสรุปรายสัปดาห์" } },
    { bounds: { x: 0,    y: 843, width: 834, height: 843 }, action: { type: "postback", label: "สถานะอาคาร",  data: "menu=status",  displayText: "ดูสถานะอาคารทั้งหมด" } },
    { bounds: { x: 834,  y: 843, width: 833, height: 843 }, action: { type: "uri",      label: "คู่มือ",       uri: "https://cu-pri.example.chula.ac.th/help" } },
    { bounds: { x: 1667, y: 843, width: 833, height: 843 }, action: { type: "uri",      label: "ติดต่อทีม",    uri: "https://line.me/R/oaMessage/%40cupri/?ติดต่อทีม" } },
  ],
};

const MENU_ZONES = [
  { z: "A", Icon: LayoutDashboard, t: "แดชบอร์ด", en: "Dashboard (LIFF)", c: "0, 0 · 834×843", hero: true },
  { z: "B", Icon: Bell, t: "การแจ้งเตือน", en: "Alerts", c: "834, 0 · 833×843" },
  { z: "C", Icon: FileDown, t: "รายงานสรุป", en: "Weekly Report", c: "1667, 0 · 833×843" },
  { z: "D", Icon: Building2, t: "สถานะอาคาร", en: "Building Status", c: "0, 843 · 834×843" },
  { z: "E", Icon: Info, t: "คู่มือ", en: "Help", c: "834, 843 · 833×843" },
  { z: "F", Icon: Phone, t: "ติดต่อทีม", en: "Contact", c: "1667, 843 · 833×843" },
];

/* ================================================================ HELPERS */

function copyText(t) {
  return new Promise((resolve) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(() => resolve(true)).catch(() => { fallback(); });
    } else fallback();
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); resolve(true);
    }
  });
}

const fmt = (n) => n.toLocaleString("th-TH");

const StatusBadge = ({ s, size }) => {
  const d = ST[s]; const I = d.Icon;
  return (
    <span className={`pri-st st-${s}`} style={size === "lg" ? { fontSize: 12.5, padding: "5px 13px" } : null}>
      <span className={`pri-dot ${s}`} style={{ background: d.color }} />
      <I size={size === "lg" ? 15 : 13} strokeWidth={2.4} />
      {d.label} <span style={{ opacity: 0.65, fontWeight: 400 }}>· {d.en}</span>
    </span>
  );
};

const LogoMark = ({ size = 34 }) => (
  <span style={{ width: size, height: size, display: "inline-flex", flex: "none" }}
        dangerouslySetInnerHTML={{ __html: LOGO_SVG.replace('width="96" height="96"', `width="${size}" height="${size}"`) }} />
);

const Donut = ({ value, color }) => {
  const size = 92, r = 39, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(140,140,155,.22)" strokeWidth="8" fill="none" />
        {value != null && (
          <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="8" fill="none"
            strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        )}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span className="pri-mono" style={{ fontSize: 20, fontWeight: 600 }}>{value != null ? value : "—"}</span>
        <span className="pri-mono" style={{ fontSize: 8.5, color: "var(--faint)" }}>{value != null ? "/100" : "N/A"}</span>
      </div>
    </div>
  );
};

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const items = payload.filter((p) => p.dataKey !== "band");
  return (
    <div className="pri-tip">
      <div className="pri-tip-t">{label === 14 ? "วันนี้" : `${label - 14} วัน`}</div>
      {items.map((p) => (
        <div className="pri-tip-r" key={p.dataKey}>
          <span className="dot" style={{ background: p.color || p.stroke }} />
          {p.name}
          <b>{p.dataKey === "ppm" ? `${p.value} ppm` : `${p.value > 0 ? "+" : ""}${p.value}%`}</b>
        </div>
      ))}
    </div>
  );
};

const xTicks = [0, 3, 6, 9, 12, 14];
const xFmt = (v) => (v === 14 ? "วันนี้" : `${v - 14} วัน`);

/* ================================================================ DASHBOARD */

const SERIES_COLORS = {
  suction: "var(--blue)", superheat: "var(--warn)", runtime: "var(--violet)", kwh: "var(--orange)",
};

function FailureSignatureChart({ data, status }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>ลายเซ็นความล้มเหลว (Failure Signature)</div>
          <div style={{ fontSize: 10.5 }} className="pri-faint">% ความเบี่ยงเบนจากเส้นฐานพลวัต (Dynamic Baseline) · ย้อนหลัง 14 วัน</div>
        </div>
        <div className="pri-legend">
          <span><i style={{ background: "#5EB3FF" }} />แรงดันดูด (Suction)</span>
          <span><i style={{ background: "#B88CFF" }} />Runtime</span>
          <span><i style={{ background: "#FF8A5C" }} />พลังงาน (kWh)</span>
          <span><i style={{ background: "rgba(232,87,141,.35)", height: 8 }} />แถบเส้นฐาน ±4%</span>
        </div>
      </div>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
            <CartesianGrid stroke="rgba(140,140,155,.18)" vertical={false} />
            <XAxis dataKey="x" type="number" domain={[0, 14]} ticks={xTicks} tickFormatter={xFmt}
              tick={{ fill: "#6F687C", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: "rgba(140,140,155,.32)" }} tickLine={false} />
            <YAxis tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`} domain={[-18, 24]}
              tick={{ fill: "#6F687C", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} cursor={{ stroke: "rgba(140,140,155,.45)", strokeDasharray: "3 3" }} />
            <Area dataKey="band" name="เส้นฐาน" fill="rgba(232,87,141,.09)" stroke="rgba(232,87,141,.28)"
              strokeDasharray="4 4" strokeWidth={1} isAnimationActive={false} activeDot={false} />
            <ReferenceLine y={0} stroke="rgba(232,87,141,.55)" strokeDasharray="2 5"
              label={{ value: "Dynamic Baseline", position: "insideTopLeft", fill: "#E8578D", fontSize: 9.5, fontFamily: "IBM Plex Mono", dy: -4 }} />
            {status === "crit" && (
              <ReferenceArea x1={11.4} x2={14} fill="rgba(255,81,71,.07)" stroke="rgba(255,81,71,.25)" strokeDasharray="3 3"
                label={{ value: "ยืนยันการรั่ว", position: "insideTop", fill: "#FF8B84", fontSize: 9.5, fontFamily: "IBM Plex Mono" }} />
            )}
            <Line dataKey="suction" name="แรงดันดูด" stroke="#5EB3FF" strokeWidth={2.2} dot={false} isAnimationActive={false} />
            <Line dataKey="runtime" name="Runtime" stroke="#B88CFF" strokeWidth={1.8} dot={false} isAnimationActive={false} />
            <Line dataKey="kwh" name="พลังงาน kWh" stroke="#FF8A5C" strokeWidth={1.8} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GasChart({ data, status }) {
  const max = status === "crit" ? 55 : 20;
  return (
    <div className="pri-card" style={{ padding: "14px 16px" }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
        <Wifi size={14} color="var(--pink)" /> NDIR Gas Sensor — ความเข้มข้นในห้องเครื่อง
      </div>
      <div style={{ fontSize: 10 }} className="pri-faint">Bacharach MGS-450 · ตรวจจับได้ถึง ~1 ppm · เกณฑ์เฝ้าระวัง 10–50 ppm</div>
      <div style={{ height: 150, marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: -22 }}>
            <CartesianGrid stroke="rgba(140,140,155,.18)" vertical={false} />
            <XAxis dataKey="x" type="number" domain={[0, 14]} ticks={xTicks} tickFormatter={xFmt}
              tick={{ fill: "#6F687C", fontSize: 9.5, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: "rgba(140,140,155,.32)" }} tickLine={false} />
            <YAxis domain={[0, max]} tick={{ fill: "#6F687C", fontSize: 9.5, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} cursor={{ stroke: "rgba(140,140,155,.45)" }} />
            <ReferenceArea y1={10} y2={Math.min(50, max)} fill="rgba(242,179,61,.08)" stroke="rgba(242,179,61,.25)" strokeDasharray="3 3"
              label={{ value: "Early-Warning 10–50 ppm", position: "insideTopRight", fill: "#F7C863", fontSize: 9, fontFamily: "IBM Plex Mono" }} />
            <Area dataKey="ppm" name="ก๊าซ NDIR" stroke="#E8578D" strokeWidth={2}
              fill="rgba(232,87,141,.14)" dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FinancialPenalty({ a }) {
  const calm = a.status === "ok";
  const tDay = (a.leakKgDay * GWP) / 1000;
  return (
    <div className={`pri-fin ${calm ? "calm" : ""}`}>
      <div style={{ fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
        <Zap size={14} color={calm ? "var(--ok)" : "var(--crit)"} />
        Financial Penalty — ความสูญเสียหากไม่แก้ไข
      </div>
      {calm ? (
        <div style={{ marginTop: 10 }}>
          <div className="pri-fin-big" style={{ color: "var(--ok)" }}>฿0 / วัน</div>
          <div style={{ fontSize: 11.5, marginTop: 4 }} className="pri-mut">
            ไม่มีบทลงโทษพลังงาน (Avoided Energy Penalty) — เครื่องทำงานตามเส้นฐานพลวัต
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
            <div className="pri-fin-big" style={{ color: "var(--crit)" }}>฿{fmt(a.bahtDay)} / วัน</div>
            <div className="pri-mono pri-mut" style={{ fontSize: 12 }}>≈ ฿{fmt(a.bahtDay * 30)} / เดือน</div>
          </div>
          <div className="pri-fin-rows">
            <div className="pri-fin-r"><div className="k">อัตรารั่วประมาณการ</div><div className="v">{a.leakKgDay} kg/วัน</div></div>
            <div className="pri-fin-r"><div className="k">เทียบเท่าคาร์บอน (GWP 2,088)</div><div className="v">{tDay.toFixed(2)} tCO2e/วัน</div></div>
            <div className="pri-fin-r"><div className="k">พลังงานส่วนเกิน</div><div className="v">+{a.kwhDelta}% kWh</div></div>
            <div className="pri-fin-r"><div className="k">หากปล่อยไว้ 1 ปี</div><div className="v">{(tDay * 365).toFixed(0)} tCO2e</div></div>
          </div>
          <div className="pri-note">
            * ประมาณการจากค่าไฟเฉลี่ย ฿4.2/kWh และสัดส่วน Energy Penalty +{a.kwhDelta}% (ข้อสมมติ — ระบุตามข้อกำหนด) ·
            อ้างอิงกลไก: สูญเสียสาร 10–20% → ใช้พลังงานเพิ่ม 15–25%
          </div>
        </>
      )}
    </div>
  );
}

function Stepper({ stage, status }) {
  return (
    <div className="pri-steps">
      {STAGES.map((s, i) => {
        const n = i + 1;
        const cls = n < stage ? "done" : n === stage ? "act" : "dim";
        return (
          <div key={s.t} className={`pri-step ${cls}`}>
            <span className="n">{n < stage ? <Check size={12} strokeWidth={3} /> : n}</span>
            <div>
              <div className="t">{s.t}{n === stage && <span style={{ color: status === "crit" ? "var(--crit)" : "var(--pink)", fontFamily: "var(--mono)", fontSize: 9, marginLeft: 6 }}>● ACTIVE</span>}</div>
              <div className="s">{s.s}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Readout({ Icon, l, v, s, tone }) {
  return (
    <div className="pri-read">
      <div className="pri-read-l"><Icon size={13} color="var(--pink)" /> {l}</div>
      <div className="pri-read-v" style={tone ? { color: tone } : null}>{v}</div>
      <div className="pri-read-s">{s}</div>
    </div>
  );
}

function DrillDown({ a }) {
  const data = useMemo(() => buildSeries(a), [a]);
  const d = ST[a.status];
  return (
    <div className="pri-card pri-drill pri-fade" key={a.id}>
      <div className="pri-drill-h">
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Donut value={a.confidence} color={d.color} />
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span className="pri-mono" style={{ fontSize: 17, fontWeight: 700 }}>{a.id}</span>
              <StatusBadge s={a.status} size="lg" />
            </div>
            <div style={{ fontSize: 12.5, marginTop: 3 }} className="pri-mut">
              {a.building} · {a.en} · {a.type} · R-410A
            </div>
            <div style={{ fontSize: 10.5, marginTop: 2, fontFamily: "var(--mono)" }} className="pri-faint">
              Leak Confidence Score {a.confidence != null ? `${a.confidence}/100` : "— (ไม่มีความผิดปกติ)"} · Cost Center {a.cc}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11.5, maxWidth: 320, lineHeight: 1.55 }} className="pri-mut">
          <span style={{ color: d.color, fontWeight: 600 }}>สรุป: </span>{a.note}
        </div>
      </div>

      <Stepper stage={a.stage} status={a.status} />
      <FailureSignatureChart data={data} status={a.status} />

      <div className="pri-reads">
        <Readout Icon={Gauge} l="แรงดันดูด (Suction Pressure)" v={`${a.suction} bar`}
          s={`เส้นฐาน ${a.suctionBase} bar ${a.suction < a.suctionBase ? `· ↓${Math.round((1 - a.suction / a.suctionBase) * 100)}%` : "· ตามเส้นฐาน"}`}
          tone={a.suction < a.suctionBase - 0.2 ? "var(--blue)" : undefined} />
        <Readout Icon={Thermometer} l="Superheat" v={`${a.superheat} °C`}
          s={`เส้นฐาน ${a.superheatBase} °C ${a.superheat - a.superheatBase >= 2 ? `· +${(a.superheat - a.superheatBase).toFixed(1)} °C (เกณฑ์ +2–3 °C)` : "· ปกติ"}`}
          tone={a.superheat - a.superheatBase >= 2 ? "var(--warn)" : undefined} />
        <Readout Icon={Clock} l="Compressor Runtime" v={`${a.runtime} ชม./วัน`}
          s={a.runtimeDelta > 2 ? `+${a.runtimeDelta}% จากเส้นฐาน` : "ตามเส้นฐาน"}
          tone={a.runtimeDelta > 2 ? "var(--violet)" : undefined} />
        <Readout Icon={Zap} l="พลังงาน" v={`${fmt(a.kwhDay)} kWh/วัน`}
          s={a.kwhDelta > 2 ? `+${a.kwhDelta}% จากเส้นฐาน` : "ตามเส้นฐาน"}
          tone={a.kwhDelta > 2 ? "var(--orange)" : undefined} />
      </div>

      <div className="pri-two">
        <GasChart data={data} status={a.status} />
        <FinancialPenalty a={a} />
      </div>
    </div>
  );
}

function DashboardView({ selected, setSelected }) {
  const [q, setQ] = useState("");
  const [flt, setFlt] = useState("all");
  const list = useMemo(() => {
    const order = { crit: 0, warn: 1, ok: 2 };
    return ASSETS
      .filter((a) => flt === "all" || a.status === flt)
      .filter((a) => (a.id + a.building + a.en).toLowerCase().includes(q.toLowerCase()))
      .sort((x, y) => order[x.status] - order[y.status] || x.id.localeCompare(y.id));
  }, [q, flt]);
  const sel = ASSETS.find((a) => a.id === selected) || ASSETS[0];
  const counts = {
    ok: ASSETS.filter((a) => a.status === "ok").length,
    warn: ASSETS.filter((a) => a.status === "warn").length,
    crit: ASSETS.filter((a) => a.status === "crit").length,
  };

  return (
    <div className="pri-fade">
      <div className="pri-kpis">
        <div className="pri-card pri-kpi">
          <div className="pri-kpi-l"><ShieldCheck size={14} color="var(--ok)" /> อาคารปกติ (Healthy)</div>
          <div className="pri-kpi-v">{counts.ok}<span className="pri-faint" style={{ fontSize: 15 }}>/{ASSETS.length}</span></div>
          <div className="pri-kpi-s">Chiller / VRF นำร่อง 8 เครื่อง · 6 อาคาร</div>
        </div>
        <div className="pri-card pri-kpi">
          <div className="pri-kpi-l"><Bell size={14} color="var(--warn)" /> การแจ้งเตือนที่ใช้งานอยู่</div>
          <div className="pri-kpi-v">{counts.warn + counts.crit}</div>
          <div className="pri-kpi-s">🔴 วิกฤต {counts.crit} · 🟡 เฝ้าระวัง {counts.warn}</div>
        </div>
        <div className="pri-card pri-kpi">
          <div className="pri-kpi-l"><Leaf size={14} color="var(--ok)" /> tCO2e ป้องกันได้ (เดือนนี้)</div>
          <div className="pri-kpi-v">42.8</div>
          <div className="pri-kpi-s">R-410A · GWP 2,088 · เทียบฐานแช่แข็ง 12,273 tCO2e/ปี</div>
          <div className="pri-kpi-d" style={{ color: "var(--ok)" }}><ArrowUpRight size={11} />+18% MoM</div>
        </div>
        <div className="pri-card pri-kpi">
          <div className="pri-kpi-l"><Zap size={14} color="var(--pink)" /> ฿ Penalty ที่หลีกเลี่ยงได้ (เดือนนี้)</div>
          <div className="pri-kpi-v">฿186,400</div>
          <div className="pri-kpi-s">Avoided Energy Penalty + ค่าซ่อมฉุกเฉิน</div>
          <div className="pri-kpi-d" style={{ color: "var(--ok)" }}><ArrowUpRight size={11} />Payback 6–12 เดือน</div>
        </div>
      </div>

      <div className="pri-cols">
        <div>
          <div className="pri-search">
            <Search size={14} color="var(--faint)" />
            <input placeholder="ค้นหาอาคาร / รหัสเครื่อง…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="ค้นหาอาคารหรือรหัสเครื่อง" />
          </div>
          <div className="pri-filters" role="group" aria-label="กรองตามสถานะ">
            {[["all", "ทั้งหมด"], ["crit", "🔴 วิกฤต"], ["warn", "🟡 เฝ้าระวัง"], ["ok", "🟢 ปกติ"]].map(([k, l]) => (
              <button key={k} className={`pri-fbtn ${flt === k ? "on" : ""}`} onClick={() => setFlt(k)}>{l}</button>
            ))}
          </div>
          <div className="pri-list">
            {list.map((a) => (
              <button key={a.id} className={`pri-tile ${sel.id === a.id ? "sel" : ""}`} onClick={() => setSelected(a.id)}>
                <div className="pri-tile-top">
                  <span className="pri-tile-id">{a.id}</span>
                  <StatusBadge s={a.status} />
                </div>
                <div className="pri-tile-b">{a.building} <span className="pri-faint">· {a.type}</span></div>
                <div className="pri-tile-meta">
                  <span>COP <b>{a.cop}</b></span>
                  <span>NDIR <b>{a.ppm} ppm</b></span>
                  {a.confidence != null && <span>Conf. <b>{a.confidence}</b></span>}
                </div>
              </button>
            ))}
            {list.length === 0 && (
              <div className="pri-card" style={{ padding: 16, fontSize: 12 }}>
                <span className="pri-mut">ไม่พบเครื่องที่ตรงเงื่อนไข — ลองล้างคำค้นหรือเปลี่ยนตัวกรองสถานะ</span>
              </div>
            )}
          </div>
        </div>
        <DrillDown a={sel} />
      </div>
    </div>
  );
}

/* ================================================================ EXPORT / RACE TO ZERO */

function ExportView({ toast }) {
  const [period, setPeriod] = useState("q");
  const [cc, setCc] = useState("all");
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("30 มิ.ย. 2569 · 23:59 น. (อัตโนมัติสิ้นเดือน)");

  const rows = useMemo(() => AUDIT.filter((r) => cc === "all" || r.cc === cc), [cc]);

  const downloadCsv = () => {
    const head = ["วันที่", "Asset", "Cost Center", "อาคาร", "เหตุการณ์", "NDIR (ppm)", "สารทำความเย็น (kg)", "tCO2e (GWP 2088)", "สถานะ", "Work Order"];
    const csv = "﻿" + [head, ...rows.map((r) => [r.date, r.asset, r.cc, r.b, r.event, r.ppm, r.kg, r.tco2e, r.stateT, r.wo])]
      .map((a) => a.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = "CU-PRI_AuditLog_ISO14064-1.csv";
    document.body.appendChild(el); el.click(); el.remove();
    URL.revokeObjectURL(url);
    toast("ดาวน์โหลด Audit Log (CSV · UTF-8 BOM) แล้ว");
  };

  const syncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync("3 ก.ค. 2569 · เมื่อสักครู่ (Manual)");
      toast("ซิงค์ข้อมูลเข้าสู่ Race to Zero สำเร็จ · HTTP 200");
    }, 1400);
  };

  const payload = `POST https://racetozero.chula.ac.th/api/v1/emissions
Authorization: Bearer ****  ·  Content-Type: application/json

{
  "period": "2569-06",
  "source": "CU-PRI",
  "scope": 1,
  "category": "refrigerant_fugitive",
  "entries": [
    { "cost_center": "CC-MED", "refrigerant": "R-410A",
      "mass_kg": 5.9, "gwp": 2088, "tco2e": 12.32,
      "evidence": "WO-2569-0142", "method": "NDIR + thermodynamic" },
    { "cost_center": "CC-CJ9", "refrigerant": "R-410A",
      "mass_kg": 2.5, "gwp": 2088, "tco2e": 5.22,
      "evidence": "WO-2569-0103", "method": "top-up (measured)" }
  ]
}`;

  return (
    <div className="pri-fade" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="pri-kpis" style={{ margin: 0 }}>
        <div className="pri-card pri-kpi">
          <div className="pri-kpi-l"><Database size={14} color="var(--pink)" /> tCO2e บันทึกจริง (ปีงบ 2569 สะสม)</div>
          <div className="pri-kpi-v">23.6</div>
          <div className="pri-kpi-s">รั่วจริง + เติมจริง · ตรวจสอบย้อนกลับได้ทุกรายการ</div>
        </div>
        <div className="pri-card pri-kpi">
          <div className="pri-kpi-l"><Leaf size={14} color="var(--ok)" /> ป้องกันการปล่อยสะสม</div>
          <div className="pri-kpi-v">42.8 <span style={{ fontSize: 13 }} className="pri-faint">tCO2e</span></div>
          <div className="pri-kpi-s">มูลค่า T-VER แฝง ฿2,140–8,560 (@฿50–200/tCO2e)</div>
        </div>
        <div className="pri-card pri-kpi">
          <div className="pri-kpi-l"><AlertTriangle size={14} color="var(--warn)" /> ฐานเดิม (ค่าประมาณแช่แข็ง 5 ปี)</div>
          <div className="pri-kpi-v">12,273</div>
          <div className="pri-kpi-s">tCO2e/ปี · 80% ของ Scope 1 — เป้าหมายที่ระบบนี้เข้าแทนที่</div>
        </div>
        <div className="pri-card pri-kpi">
          <div className="pri-kpi-l"><TrendingUp size={14} color="var(--pink)" /> ศักยภาพเมื่อขยายผล (−30%)</div>
          <div className="pri-kpi-v">3,680</div>
          <div className="pri-kpi-s">tCO2e/ปี ≈ ฿184,000–736,000 (T-VER) · Grid EF 0.5692 tCO2/MWh</div>
        </div>
      </div>

      <div className="pri-card" style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <FileDown size={16} color="var(--pink)" /> Audit Log — บันทึกการรั่วไหล / การแจ้งเตือน
              <span className="pri-chip" style={{ borderColor: "rgba(47,191,143,.4)", color: "#7CE4BC" }}>
                <ShieldCheck size={11} /> จัดรูปแบบสำหรับ ISO 14064-1
              </span>
            </div>
            <div style={{ fontSize: 11 }} className="pri-faint">หลักฐานเชิงประจักษ์สำหรับผู้ทวนสอบ · แปลงมวล kg × GWP 2,088 → tCO2e อัตโนมัติ</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select className="pri-select" value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="ช่วงเวลา">
              <option value="m">เดือนนี้ (มิ.ย. 2569)</option>
              <option value="q">ไตรมาส 2/2569</option>
              <option value="y">ปีงบประมาณ 2569</option>
            </select>
            <select className="pri-select" value={cc} onChange={(e) => setCc(e.target.value)} aria-label="Cost Center">
              <option value="all">ทุก Cost Center</option>
              <option value="CC-MED">CC-MED · คณะแพทยศาสตร์</option>
              <option value="CC-SCI">CC-SCI · คณะวิทยาศาสตร์</option>
              <option value="CC-ENG">CC-ENG · คณะวิศวกรรมศาสตร์</option>
              <option value="CC-CJ9">CC-CJ9 · จามจุรี 9</option>
              <option value="CC-LIB">CC-LIB · หอสมุดกลาง</option>
            </select>
            <button className="pri-btn pink" onClick={downloadCsv}><FileDown size={14} /> ดาวน์โหลด CSV</button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="pri-table">
            <thead>
              <tr><th>วันที่</th><th>Asset · อาคาร</th><th style={{ minWidth: 260 }}>เหตุการณ์</th><th>NDIR</th><th>kg</th><th>tCO2e</th><th>สถานะ</th><th>Work Order</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="mono pri-mut" style={{ whiteSpace: "nowrap" }}>{r.date}</td>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{r.asset}</span><br /><span className="pri-faint" style={{ fontSize: 10.5 }}>{r.b} · {r.cc}</span></td>
                  <td className="pri-mut" style={{ fontSize: 11.5, lineHeight: 1.5 }}>{r.event}</td>
                  <td className="mono">{r.ppm}</td>
                  <td className="mono">{r.kg}</td>
                  <td className="mono" style={{ fontWeight: 600 }}>{r.tco2e}</td>
                  <td><StatusBadge s={r.state} /></td>
                  <td className="mono pri-faint">{r.wo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pri-two">
        <div className="pri-card" style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <RefreshCw size={15} color="var(--pink)" className={syncing ? "pri-spin" : ""} /> สถานะ API Sync → "Race to Zero"
              </div>
              <div style={{ fontSize: 11 }} className="pri-faint">RESTful POST อัตโนมัติทุกสิ้นเดือน · แยกตาม Cost Center · แทนที่การรวบรวมใบเสร็จลง Excel</div>
            </div>
            <button className="pri-btn" onClick={syncNow} disabled={syncing}>
              <Send size={13} /> {syncing ? "กำลังซิงค์…" : "ซิงค์ตอนนี้"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, margin: "12px 0", flexWrap: "wrap" }}>
            <span className="pri-chip" style={{ borderColor: "rgba(47,191,143,.45)", color: "#7CE4BC" }}><CheckCircle2 size={12} /> เชื่อมต่อแล้ว · Uptime 99.4%</span>
            <span className="pri-chip"><Clock size={12} /> ล่าสุด: {lastSync}</span>
            <span className="pri-chip"><Database size={12} /> รอบถัดไป: 31 ก.ค. 2569 23:59</span>
          </div>
          <pre className="pri-code" style={{ maxHeight: 230 }}>{payload}</pre>
        </div>

        <div className="pri-card" style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <BadgeCheck size={15} color="var(--pink)" /> KPI นำร่อง (Pilot 1 ปี)
          </div>
          <div style={{ fontSize: 11, marginBottom: 12 }} className="pri-faint">ตัวชี้วัดตามข้อเสนอโครงการ · สถานะ ณ เดือนที่ 6</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {KPI_TARGETS.map((k) => (
              <div key={k.k}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{k.k} <span className="pri-faint" style={{ fontWeight: 400 }}>· เป้า {k.target}</span></span>
                  <span className="pri-mono" style={{ color: "var(--ok)", fontWeight: 600 }}>{k.val}{k.unit}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "rgba(140,140,155,.2)", overflow: "hidden" }}>
                  <div style={{ width: `${(k.val / k.max) * 100}%`, height: "100%", borderRadius: 99, background: "linear-gradient(90deg,var(--pink),var(--ok))" }} />
                </div>
                <div style={{ fontSize: 9.5, marginTop: 3 }} className="pri-faint">{k.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ USER JOURNEYS */

function JourneysView() {
  return (
    <div className="pri-fade" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="pri-card" style={{ padding: "13px 16px", display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12 }}>
        <Info size={15} color="var(--pink)" style={{ flex: "none", marginTop: 2 }} />
        <span className="pri-mut">
          ผู้ใช้ 3 บทบาทได้รับข้อมูล <b style={{ color: "var(--txt)" }}>ที่ถูกคัดกรองต่างกัน</b> ผ่านสถาปัตยกรรม
          <b style={{ color: "var(--pink-soft)" }}> LINE Messaging API</b> (Push / OA Broadcast) และแดชบอร์ดเดียวกัน —
          ช่างได้รับเรียลไทม์ · ผู้บริหารได้รับรายสัปดาห์ · Sustainability Admin ใช้ Export Module
        </span>
      </div>
      {JOURNEYS.map((j) => {
        const RIcon = j.Icon;
        return (
          <div className="pri-card pri-jcard" key={j.role}>
            <div className="pri-jhead">
              <span style={{ width: 42, height: 42, borderRadius: 13, background: "var(--panel2)", border: `1px solid ${j.color}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <RIcon size={19} color={j.color} />
              </span>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div className="pri-jrole">{j.role}</div>
                <div style={{ fontSize: 11 }} className="pri-faint pri-mono">{j.en}</div>
              </div>
              <div style={{ maxWidth: 380, fontSize: 11.5, lineHeight: 1.55 }} className="pri-mut">
                <span style={{ color: j.color, fontWeight: 700, fontSize: 10, letterSpacing: ".1em", fontFamily: "var(--mono)" }}>TRIGGER · </span>{j.trigger}
              </div>
            </div>
            <div className="pri-jflow" aria-label={`ขั้นตอนของ ${j.role}`}>
              {j.steps.map((s, i) => {
                const SIcon = s.Icon;
                return (
                  <div className="pri-jstep" key={i}>
                    <span className="ln" />
                    <div className="ic"><SIcon size={17} color={j.color} /></div>
                    <div className="t"><span className="pri-mono pri-faint" style={{ fontSize: 9.5 }}>{i + 1} · </span>{s.t}</div>
                    <div className="s">{s.s}</div>
                  </div>
                );
              })}
            </div>
            <div className="pri-jgrid">
              <div className="pri-jbox"><div className="h">เป้าหมาย (Goals)</div><ul>{j.goals.map((g, i) => <li key={i}>{g}</li>)}</ul></div>
              <div className="pri-jbox"><div className="h">อุปสรรคเดิม (Pains)</div><ul>{j.pains.map((g, i) => <li key={i}>{g}</li>)}</ul></div>
              <div className="pri-jbox"><div className="h">หน้าจอ / การแจ้งเตือนที่สัมผัส (Touchpoints)</div><span className="pri-mut">{j.touch}</span></div>
            </div>
            <div className="pri-jtbd">Job to be Done — {j.jtbd}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================ LINE MOCKUPS */

function PhoneFrame({ time, children, caption, sub }) {
  return (
    <div>
      <div className="pri-phone">
        <div className="pri-screen">
          <div className="pri-sbar"><span>{time}</span><span>▲▲ ⏻ 87%</span></div>
          <div className="pri-lhead">
            <ChevronRight size={15} style={{ transform: "rotate(180deg)", opacity: 0.8 }} />
            <span className="pri-oaav"><LogoMark size={26} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="nm">CU-PRI · Refrigerant Intelligence</div>
              <div className="sb">LINE Official Account · Messaging API</div>
            </div>
          </div>
          <div className="pri-chat">{children}</div>
          <div className="pri-inbar"><span style={{ fontSize: 14 }}>＋</span><span className="fld">Aa</span><Send size={14} /></div>
        </div>
      </div>
      <div className="pri-phlabel"><b>{caption}</b>{sub}</div>
    </div>
  );
}

const OaMsg = ({ children, time }) => (
  <div className="pri-msgrow">
    <span className="pri-oaav"><LogoMark size={26} /></span>
    {children}
    <span className="pri-time">{time}<br />อ่านแล้ว</span>
  </div>
);

const FcKv = ({ k, v, strong }) => (
  <div className="pri-kv"><span className="k">{k}</span><span className="v" style={strong ? { color: strong, fontWeight: 700 } : null}>{v}</span></div>
);

function LineView() {
  return (
    <div className="pri-fade" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="pri-card" style={{ padding: "13px 16px", display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12 }}>
        <MessageSquare size={15} color="var(--pink)" style={{ flex: "none", marginTop: 2 }} />
        <span className="pri-mut">
          ทุกการแจ้งเตือนออกแบบบน <b style={{ color: "var(--pink-soft)" }}>LINE Messaging API</b> — Push Message (Flex) + Quick Reply
          และ <b style={{ color: "var(--pink-soft)" }}>OA Broadcast</b> สำหรับสรุปผู้บริหาร ·
          <b style={{ color: "var(--txt)" }}> ไม่ใช้ LINE Notify</b> (บริการยุติแล้วเมื่อ 31 มี.ค. 2025) ·
          JSON ที่ backend ส่งได้จริงอยู่ในแท็บ Handoff Pack
        </span>
      </div>

      <div className="pri-phones">
        {/* 1 — Technician real-time alert */}
        <PhoneFrame time="09:42" caption="1 · แจ้งเตือนช่างเทคนิค (Real-time Push)" sub={<span>Flex Message + Quick Reply · ยิงทันทีเมื่อ Anomaly ยืนยัน</span>}>
          <span className="pri-bc">วันนี้ · Push จากระบบ CU-PRI</span>
          <OaMsg time="09:41">
            <div className="pri-bub">ตรวจพบความผิดปกติต่อเนื่อง 18 ชม. ที่ <b>CH-MED-01</b> — รายละเอียดด้านล่างค่ะ 👇</div>
          </OaMsg>
          <OaMsg time="09:41">
            <div className="pri-flexcard">
              <div className="pri-fchead" style={{ background: "#B45309" }}>
                <div className="t">⚠️ แจ้งเตือนความเสี่ยงสูง</div>
                <div className="s">Anomaly Predictive · Confidence 92/100</div>
              </div>
              <div className="pri-fcbody">
                <FcKv k="อาคาร" v="คณะแพทยศาสตร์ · ห้องเครื่อง B1" />
                <FcKv k="เครื่อง" v="Chiller CH-MED-01 (R-410A)" />
                <FcKv k="อาการ" v="แรงดันดูดตก −14% · Superheat +4.2 °C" />
                <FcKv k="ก๊าซ NDIR" v="20 ppm (เกณฑ์ 10–50 ppm)" strong="#B45309" />
                <FcKv k="จุดคาดการณ์" v="ท่อทางดูด ใกล้วาล์วบริการ" />
                <div style={{ fontSize: 9.5, color: "#8A8A93", borderTop: "1px solid #EFEFF3", paddingTop: 7 }}>
                  เข้าตรวจภายใน 2 ชม. — Energy Penalty ~฿6,850/วัน หากไม่แก้ไข
                </div>
              </div>
              <div className="pri-fcfoot">
                <span className="pri-fcbtn" style={{ background: "#141318", color: "#fff" }}>รับเรื่อง / เปิด Work Order</span>
                <span className="pri-fcbtn" style={{ background: "#EEF1F6", color: "#33415C" }}>เปิด Drill-down (LIFF)</span>
              </div>
            </div>
          </OaMsg>
          <div className="pri-qrow">
            <span className="pri-qr">✅ รับเรื่อง</span><span className="pri-qr">🛠️ เปิด Work Order</span><span className="pri-qr">📊 ดูแดชบอร์ด</span>
          </div>
        </PhoneFrame>

        {/* 2 — Weekly executive summary */}
        <PhoneFrame time="08:00" caption="2 · สรุปผู้บริหารรายสัปดาห์ (OA Broadcast)" sub={<span>ทุกวันจันทร์ 08:00 · สแกนจบใน 1 นาที · ส่งซ้ำทางอีเมล</span>}>
          <span className="pri-bc">จันทร์ 29 มิ.ย. · Broadcast รายสัปดาห์</span>
          <OaMsg time="08:00">
            <div className="pri-flexcard">
              <div className="pri-fchead" style={{ background: "#E8578D" }}>
                <div className="t">📊 สรุปผู้บริหารรายสัปดาห์</div>
                <div className="s">23–29 มิ.ย. 2569 · อาคารนำร่อง 8 เครื่อง</div>
              </div>
              <div className="pri-fcbody" style={{ gap: 0 }}>
                <div className="pri-fcstat"><span>ประสิทธิภาพ COP เฉลี่ย</span><span className="v" style={{ color: "#1B9E77" }}>+8.2%</span></div>
                <div className="pri-fcstat"><span>ชม.ฉุกเฉินที่หลีกเลี่ยงได้</span><span className="v">14 ชม.</span></div>
                <div className="pri-fcstat"><span>ประหยัดค่าไฟ + ค่าซ่อม</span><span className="v">฿186,400</span></div>
                <div className="pri-fcstat"><span>ป้องกันการปล่อย</span><span className="v" style={{ color: "#1B9E77" }}>42.8 tCO2e</span></div>
                <div style={{ fontSize: 9.5, color: "#8A8A93", paddingTop: 8 }}>
                  🟢 ปกติ 6 · 🟡 เฝ้าระวัง 1 · 🔴 วิกฤต 1 (กำลังซ่อม — ตอบสนองใน 1.5 ชม.)
                </div>
              </div>
              <div className="pri-fcfoot">
                <span className="pri-fcbtn" style={{ background: "#E8578D", color: "#fff" }}>เปิดแดชบอร์ดผู้บริหาร</span>
              </div>
            </div>
          </OaMsg>
          <OaMsg time="08:00">
            <div className="pri-bub">ฉบับเต็มพร้อมกราฟแนวโน้ม COP ส่งถึงอีเมลของท่านแล้วค่ะ 📩</div>
          </OaMsg>
        </PhoneFrame>

        {/* 3 — Critical escalation */}
        <PhoneFrame time="14:07" caption="3 · ยกระดับวิกฤต (Yellow → Red)" sub={<span>เมื่อ NDIR Cross-validation ยืนยัน · ปุ่มโทร / นำทาง แตะครั้งเดียว</span>}>
          <span className="pri-bc">วันนี้ · Escalation อัตโนมัติ</span>
          <OaMsg time="14:07">
            <div className="pri-flexcard" style={{ boxShadow: "0 2px 10px rgba(220,38,38,.25)" }}>
              <div className="pri-fchead" style={{ background: "#DC2626" }}>
                <div className="t">🔴 ยกระดับเป็นวิกฤต (Critical Leak)</div>
                <div className="s">Cross-validated โดย NDIR · 14:07</div>
              </div>
              <div className="pri-fcbody">
                <FcKv k="สถานะ" v="🟡 เฝ้าระวัง → 🔴 วิกฤต" strong="#DC2626" />
                <FcKv k="NDIR" v="36 ppm — เกินเกณฑ์เฝ้าระวัง" strong="#DC2626" />
                <FcKv k="อัตรารั่ว" v="0.42 kg/วัน ≈ 0.88 tCO2e/วัน" />
                <FcKv k="สถานที่" v="คณะแพทยศาสตร์ · ห้องเครื่อง B1" />
                <div style={{ fontSize: 9.5, color: "#B91C1C", borderTop: "1px solid #EFEFF3", paddingTop: 7 }}>
                  ⚠️ ระบายอากาศห้องเครื่องก่อนเข้าพื้นที่
                </div>
              </div>
              <div className="pri-fcfoot">
                <span className="pri-fcbtn" style={{ background: "#DC2626", color: "#fff" }}>📞 โทรแจ้งหัวหน้าช่าง</span>
                <span className="pri-fcbtn" style={{ background: "#EEF1F6", color: "#33415C" }}>🧭 นำทางไปห้องเครื่อง</span>
              </div>
            </div>
          </OaMsg>
          <div className="pri-qrow"><span className="pri-qr">✅ รับทราบ · กำลังเข้าพื้นที่</span></div>
        </PhoneFrame>
      </div>
    </div>
  );
}

/* ================================================================ HANDOFF PACK */

function CopyBtn({ text, toast, label }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="pri-copy" aria-label={`คัดลอก ${label || ""}`}
      onClick={() => copyText(text).then(() => { setOk(true); toast("คัดลอกแล้ว ✓"); setTimeout(() => setOk(false), 1600); })}>
      {ok ? <Check size={13} color="var(--ok)" /> : <Copy size={13} />}
    </button>
  );
}

function Acc({ title, sub, json, toast, color }) {
  const [open, setOpen] = useState(false);
  const str = JSON.stringify(json, null, 2);
  return (
    <div className="pri-acc">
      <button className="pri-acc-h" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="pri-acc-t">
          <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flex: "none" }} />
          {title}
          <span className="pri-faint" style={{ fontSize: 10.5, fontWeight: 400, fontFamily: "var(--mono)" }}>{sub}</span>
        </span>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <CopyBtn text={str} toast={toast} label={title} />
          <ChevronRight size={15} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .15s", color: "var(--faint)" }} />
        </span>
      </button>
      {open && <pre className="pri-code" style={{ borderRadius: 0, borderLeft: "none", borderRight: "none", borderBottom: "none" }}>{str}</pre>}
    </div>
  );
}

/* ---------------- rich menu tap simulator: what each zone does ---------------- */

const ZONE_SIM = {
  A: {
    when: "LINE เปิดแดชบอร์ด Single Pane of Glass เป็น LIFF (เว็บวิวในแชท) — เห็น KPI Strip, ไฟจราจรทุกอาคาร และแตะการ์ดเข้า Drill-down ได้ทันที โดยไม่ต้องล็อกอินซ้ำ (ใช้ LINE Profile ผ่าน LIFF SDK)",
    backend: "Action แบบ uri — ไม่สร้างข้อความในแชท · LIFF โหลด React app ตัวนี้จากโฮสต์ HTTPS พร้อม query ?view=dashboard",
  },
  B: {
    when: "แชทแสดงข้อความของผู้ใช้ “ดูการแจ้งเตือนล่าสุด” (displayText) แล้วบอทตอบกลับรายการแจ้งเตือนที่ยังเปิดอยู่ 2 รายการ — 🔴 CH-MED-01 และ 🟡 CH-SCI-02 พร้อมปุ่มเปิด Drill-down",
    backend: "Webhook รับ postback (data=menu=alerts) → ดึง Active Alerts จากคลาวด์ → Reply Message เป็น Flex ภายใน Reply Token (ไม่เสียโควตา Push)",
  },
  C: {
    when: "บอทส่งการ์ดสรุปผู้บริหารฉบับล่าสุด (23–29 มิ.ย.) — COP +8.2% · ชั่วโมงฉุกเฉินที่เลี่ยงได้ · ฿ ที่ประหยัด · tCO2e — ใบเดียวกับที่ Broadcast อัตโนมัติทุกวันจันทร์ 08:00 น.",
    backend: "postback (data=menu=weekly) → ดึงรายงานงวดล่าสุด → Reply ด้วย FLEX_WEEKLY (JSON ชุดเดียวกับใน D4)",
  },
  D: {
    when: "บอทตอบสถานะครบทั้ง 8 เครื่อง / 6 อาคารในการ์ดเดียว — ไฟจราจรคู่ป้ายภาษาไทย พร้อมค่า NDIR / Confidence ของเครื่องที่ผิดปกติ และ COP ของเครื่องปกติ",
    backend: "postback (data=menu=status) → query สถานะเรียลไทม์ทุก Asset จากคลาวด์ → Reply Flex รายการ + ปุ่มเปิดแดชบอร์ด (LIFF)",
  },
  E: {
    when: "เปิดหน้าคู่มือ (เว็บวิว) — อธิบายความหมายไฟจราจร, เกณฑ์การตรวจจับ (Superheat +2–3 °C · NDIR 10–50 ppm · ยืนยันเมื่อต่อเนื่อง 12–24 ชม. · ไวถึง Micro-leak 1–5%) และวิธีรับเรื่อง/เปิด Work Order",
    backend: "Action แบบ uri เปิดเพจ Help บนโฮสต์เดียวกับ LIFF — ทีมแก้เนื้อหาคู่มือได้ทุกเมื่อโดยไม่ต้องอัปโหลด Rich Menu ใหม่",
  },
  F: {
    when: "LINE ส่งข้อความ “ติดต่อทีม” เข้าแชทแทนผู้ใช้ (oaMessage) แล้วบอทตอบการ์ดช่องทางติดต่อ — ศูนย์บริการวิชาการ (ผู้ประสานงานหลัก), สำนักบริหารระบบกายภาพ (เจ้าของพื้นที่), สายด่วนช่างเวร 24 ชม. พร้อมปุ่มโทร/อีเมล",
    backend: "uri แบบ line.me/R/oaMessage prefill ข้อความ → Webhook จับคีย์เวิร์ด “ติดต่อทีม” → Reply การ์ดผู้ติดต่อ (ปุ่ม tel: และ mailto:)",
  },
};

const MeMsg = ({ children, time }) => (
  <div className="pri-merow">
    <span className="pri-time">อ่านแล้ว<br />{time}</span>
    <div className="pri-me">{children}</div>
  </div>
);

const MINI_ASSETS = [
  ["crit", "CH-MED-01", "คณะแพทยศาสตร์", "NDIR 36 ppm"],
  ["warn", "CH-SCI-02", "คณะวิทยาศาสตร์", "Conf. 68/100"],
  ["ok", "CH-MED-02", "คณะแพทยศาสตร์", "COP 5.3"],
  ["ok", "CH-SCI-01", "คณะวิทยาศาสตร์", "COP 5.1"],
  ["ok", "CH-ENG-01", "คณะวิศวกรรมศาสตร์", "COP 5.4"],
  ["ok", "VRF-CJ9-01", "อาคารจามจุรี 9", "COP 4.9"],
  ["ok", "CH-LIB-01", "หอสมุดกลาง", "COP 5.2"],
  ["ok", "CH-MCS-01", "มหาจักรีสิรินธร", "COP 5.0"],
];

const LiffDashPreview = () => (
  <div className="pri-liff">
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <LogoMark size={20} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700 }}>Single Pane of Glass</div>
        <div style={{ fontSize: 7.5, color: "var(--faint)", fontFamily: "var(--mono)" }}>ศุกร์ 3 ก.ค. 2569 · 14:32 น.</div>
      </div>
      <span style={{ fontSize: 7.5, fontFamily: "var(--mono)", color: "#7CE4BC", border: "1px solid rgba(47,191,143,.4)", borderRadius: 99, padding: "2px 7px", whiteSpace: "nowrap" }}>Race to Zero ✓</span>
    </div>
    <div className="pri-mkpi">
      <div><div className="v">6<span style={{ fontSize: 9, color: "var(--faint)" }}>/8</span></div><div className="l">อาคารปกติ</div></div>
      <div><div className="v">2</div><div className="l">การแจ้งเตือน</div></div>
      <div><div className="v">42.8</div><div className="l">tCO2e ป้องกันได้</div></div>
      <div><div className="v">฿186.4k</div><div className="l">Penalty ที่เลี่ยงได้</div></div>
    </div>
    {MINI_ASSETS.slice(0, 6).map(([s, id, b, stat]) => (
      <div className="pri-mtile" key={id}>
        <span style={{ display: "flex", gap: 7, alignItems: "center", minWidth: 0 }}>
          <span className={`pri-dot ${s}`} style={{ background: ST[s].color }} />
          <span style={{ minWidth: 0 }}>
            <span className="pri-mono" style={{ fontSize: 9.5, fontWeight: 600, display: "block" }}>{id}</span>
            <span style={{ fontSize: 8, color: "var(--mut)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b}</span>
          </span>
        </span>
        <span style={{ textAlign: "right", flex: "none" }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: ST[s].color, display: "block" }}>{ST[s].label}</span>
          <span className="pri-mono" style={{ fontSize: 7.5, color: "var(--faint)" }}>{stat}</span>
        </span>
      </div>
    ))}
    <div style={{ fontSize: 8, color: "var(--faint)", textAlign: "center" }}>แตะการ์ดเพื่อเปิด Failure Signature ของเครื่องนั้น</div>
  </div>
);

const HelpPreview = () => (
  <div className="pri-help">
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <LogoMark size={22} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#141318" }}>คู่มือใช้งาน CU-PRI</div>
        <div style={{ fontSize: 8, color: "#8794AB", fontFamily: "var(--mono)" }}>cu-pri.example.chula.ac.th/help</div>
      </div>
    </div>
    <div className="hp"><h4>🚦 ไฟจราจรหมายถึงอะไร</h4>
      🟢 <b>ปกติ</b> — ทำงานตามเส้นฐาน ประหยัดพลังงาน<br />
      🟡 <b>เฝ้าระวัง</b> — ประสิทธิภาพมีแนวโน้มลดลง / เสี่ยงรั่วระยะเริ่มต้น (Anomaly Predictive)<br />
      🔴 <b>วิกฤต</b> — ยืนยันการรั่วจริง ต้องเข้าแก้ไขทันที (Critical Leak Detection)</div>
    <div className="hp"><h4>📐 เกณฑ์การตรวจจับ</h4>
      · Superheat สูงกว่าเส้นฐาน +2–3 °C<br />
      · NDIR แจ้งเตือนล่วงหน้าที่ 10–50 ppm (ตรวจได้ละเอียดถึง ~1 ppm)<br />
      · ยืนยัน Anomaly เมื่อเงื่อนไขต่อเนื่อง 12–24 ชม.<br />
      · ไวต่อ Micro-leak ตั้งแต่สูญเสียมวลเพียง 1–5%</div>
    <div className="hp"><h4>🛠️ การรับเรื่อง</h4>
      แตะปุ่ม "รับเรื่อง" ในการ์ดแจ้งเตือน → Work Order เปิดอัตโนมัติ · ผลซ่อมถูกบันทึกเข้า Audit Log (ISO 14064-1)</div>
    <div className="hp"><h4>☎️ ติดต่อ</h4>
      ศูนย์บริการวิชาการ จุฬาฯ · ช่างเวรฉุกเฉิน 24 ชม. โทร 02-218-3000</div>
  </div>
);

function SimChat({ z }) {
  if (z === "B") return (
    <>
      <span className="pri-bc">วันนี้ · ผู้ใช้กดเมนู B</span>
      <MeMsg time="14:32">ดูการแจ้งเตือนล่าสุด</MeMsg>
      <OaMsg time="14:32">
        <div className="pri-flexcard">
          <div className="pri-fchead" style={{ background: "#141318" }}>
            <div className="t">🔔 การแจ้งเตือนที่ใช้งานอยู่ (2)</div>
            <div className="s">อัปเดต 14:32 น. · เรียงตามความรุนแรง</div>
          </div>
          <div className="pri-fcbody">
            <div style={{ borderLeft: "3px solid #DC2626", paddingLeft: 8, fontSize: 10.5, lineHeight: 1.5 }}>
              <b style={{ color: "#DC2626" }}>🔴 CH-MED-01 · คณะแพทยศาสตร์</b><br />
              ยืนยันการรั่ว (ท่อทางดูด) · NDIR 36 ppm<br />
              <span style={{ color: "#8A8A93", fontSize: 9.5 }}>WO-2569-0142 · กำลังดำเนินการ</span>
            </div>
            <div style={{ borderLeft: "3px solid #B45309", paddingLeft: 8, fontSize: 10.5, lineHeight: 1.5 }}>
              <b style={{ color: "#B45309" }}>🟡 CH-SCI-02 · คณะวิทยาศาสตร์</b><br />
              Micro-leak เฝ้าระวัง · Confidence 68/100<br />
              <span style={{ color: "#8A8A93", fontSize: 9.5 }}>รอ Cross-validation จาก NDIR</span>
            </div>
          </div>
          <div className="pri-fcfoot"><span className="pri-fcbtn" style={{ background: "#141318", color: "#fff" }}>เปิด Drill-down (LIFF)</span></div>
        </div>
      </OaMsg>
    </>
  );
  if (z === "C") return (
    <>
      <span className="pri-bc">วันนี้ · ผู้ใช้กดเมนู C</span>
      <MeMsg time="14:32">ขอรายงานสรุปรายสัปดาห์</MeMsg>
      <OaMsg time="14:32">
        <div className="pri-flexcard">
          <div className="pri-fchead" style={{ background: "#E8578D" }}>
            <div className="t">📊 สรุปผู้บริหารรายสัปดาห์</div>
            <div className="s">งวดล่าสุด 23–29 มิ.ย. 2569 · 8 เครื่อง</div>
          </div>
          <div className="pri-fcbody" style={{ gap: 0 }}>
            <div className="pri-fcstat"><span>ประสิทธิภาพ COP เฉลี่ย</span><span className="v" style={{ color: "#1B9E77" }}>+8.2%</span></div>
            <div className="pri-fcstat"><span>ชม.ฉุกเฉินที่หลีกเลี่ยงได้</span><span className="v">14 ชม.</span></div>
            <div className="pri-fcstat"><span>ประหยัดค่าไฟ + ค่าซ่อม</span><span className="v">฿186,400</span></div>
            <div className="pri-fcstat"><span>ป้องกันการปล่อย</span><span className="v" style={{ color: "#1B9E77" }}>42.8 tCO2e</span></div>
            <div style={{ fontSize: 9.5, color: "#8A8A93", paddingTop: 8 }}>ส่งอัตโนมัติทุกวันจันทร์ 08:00 น. — กดเมนูนี้เพื่อเรียกดูซ้ำได้ทุกเมื่อ</div>
          </div>
          <div className="pri-fcfoot"><span className="pri-fcbtn" style={{ background: "#E8578D", color: "#fff" }}>เปิดแดชบอร์ดผู้บริหาร</span></div>
        </div>
      </OaMsg>
    </>
  );
  if (z === "D") return (
    <>
      <span className="pri-bc">วันนี้ · ผู้ใช้กดเมนู D</span>
      <MeMsg time="14:32">ดูสถานะอาคารทั้งหมด</MeMsg>
      <OaMsg time="14:32">
        <div className="pri-flexcard">
          <div className="pri-fchead" style={{ background: "#141318" }}>
            <div className="t">🏢 สถานะอาคารนำร่อง</div>
            <div className="s">8 เครื่อง · 6 อาคาร · อัปเดต 14:32 น.</div>
          </div>
          <div className="pri-fcbody" style={{ gap: 0 }}>
            {MINI_ASSETS.map(([s, id, b, stat]) => (
              <div className="pri-fcstat" key={id} style={{ fontSize: 10 }}>
                <span>{s === "crit" ? "🔴" : s === "warn" ? "🟡" : "🟢"} <b className="pri-mono" style={{ fontSize: 9.5 }}>{id}</b> <span style={{ color: "#8A8A93" }}>{b}</span></span>
                <span className="v" style={{ fontSize: 9.5, color: s === "crit" ? "#DC2626" : s === "warn" ? "#B45309" : "#1F1F26" }}>{stat}</span>
              </div>
            ))}
          </div>
          <div className="pri-fcfoot"><span className="pri-fcbtn" style={{ background: "#141318", color: "#fff" }}>เปิดแดชบอร์ด (LIFF)</span></div>
        </div>
      </OaMsg>
    </>
  );
  /* F */
  return (
    <>
      <span className="pri-bc">วันนี้ · ผู้ใช้กดเมนู F (oaMessage prefill)</span>
      <MeMsg time="14:32">ติดต่อทีม</MeMsg>
      <OaMsg time="14:32">
        <div className="pri-flexcard">
          <div className="pri-fchead" style={{ background: "#E8578D" }}>
            <div className="t">☎️ ติดต่อทีม CU-PRI</div>
            <div className="s">ผู้รับผิดชอบโครงการนำร่อง</div>
          </div>
          <div className="pri-fcbody">
            <FcKv k="ประสานงานหลัก" v="ศูนย์บริการวิชาการ จุฬาฯ" />
            <FcKv k="เจ้าของพื้นที่" v="สำนักบริหารระบบกายภาพ (อนุญาตเข้าอาคาร/ห้องเครื่อง)" />
            <FcKv k="ฉุกเฉิน 24 ชม." v="ช่างเวรอาคาร โทร 02-218-3000" strong="#DC2626" />
            <FcKv k="อีเมล" v="cu-pri@chula.ac.th (ตัวอย่าง)" />
          </div>
          <div className="pri-fcfoot">
            <span className="pri-fcbtn" style={{ background: "#141318", color: "#fff" }}>📞 โทร 02-218-3000</span>
            <span className="pri-fcbtn" style={{ background: "#EEF1F6", color: "#33415C" }}>✉️ ส่งอีเมลถึงทีม</span>
          </div>
        </div>
      </OaMsg>
    </>
  );
}

function SimPhone({ z }) {
  const webview = z === "A" || z === "E";
  return (
    <div className="pri-phone" style={{ width: 276 }} key={z}>
      <div className="pri-screen" style={{ height: 566 }}>
        <div className="pri-sbar"><span>14:32</span><span>▲▲ ⏻ 87%</span></div>
        {webview ? (
          <>
            <div className="pri-lhead" style={{ padding: "7px 12px" }}>
              <span className="pri-oaav" style={{ width: 22, height: 22 }}><LogoMark size={22} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nm" style={{ fontSize: 11 }}>{z === "A" ? "CU-PRI Dashboard (LIFF)" : "คู่มือใช้งาน CU-PRI"}</div>
                <div className="sb">เว็บวิวในแชท · เปิดจาก Rich Menu โซน {z}</div>
              </div>
              <span style={{ opacity: 0.75, fontSize: 13 }}>✕</span>
            </div>
            <div className="pri-webbar">
              <span>🔒</span>
              <span className="url">{z === "A" ? "cu-pri-dashboard.vercel.app/?view=dashboard" : "cu-pri.example.chula.ac.th/help"}</span>
              <span>⋯</span>
            </div>
            {z === "A" ? <LiffDashPreview /> : <HelpPreview />}
          </>
        ) : (
          <>
            <div className="pri-lhead">
              <ChevronRight size={15} style={{ transform: "rotate(180deg)", opacity: 0.8 }} />
              <span className="pri-oaav"><LogoMark size={26} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nm">CU-PRI · Refrigerant Intelligence</div>
                <div className="sb">LINE Official Account · Messaging API</div>
              </div>
            </div>
            <div className="pri-chat"><SimChat z={z} /></div>
            <div className="pri-inbar"><span style={{ fontSize: 14 }}>＋</span><span className="fld">Aa</span><Send size={14} /></div>
          </>
        )}
      </div>
    </div>
  );
}

function ZoneDetail({ z, toast }) {
  const i = "ABCDEF".indexOf(z);
  const zone = MENU_ZONES[i];
  const sim = ZONE_SIM[z];
  const action = RICH_MENU.areas[i].action;
  const ZIcon = zone.Icon;
  const str = JSON.stringify(action, null, 2);
  return (
    <div className="pri-card pri-fade" key={z} style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ width: 44, height: 44, borderRadius: 13, background: zone.hero ? "linear-gradient(160deg,var(--pink),var(--pink-deep))" : "var(--panel2)", border: "1px solid rgba(232,87,141,.45)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", color: zone.hero ? "#fff" : "var(--pink-soft)" }}>
          <ZIcon size={19} />
        </span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>กดโซน {z} · {zone.t} <span className="pri-faint" style={{ fontWeight: 400, fontSize: 12 }}>{zone.en}</span></div>
          <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
            <span className="pri-chip" style={{ borderColor: "rgba(232,87,141,.45)", color: "var(--pink-soft)" }}>action: {action.type}</span>
            <span className="pri-chip">พิกัด {zone.c} px</span>
          </div>
        </div>
      </div>
      <div className="pri-jbox"><div className="h">สิ่งที่ผู้ใช้เห็น (เมื่อกด)</div><span className="pri-mut" style={{ lineHeight: 1.65 }}>{sim.when}</span></div>
      <div className="pri-jbox"><div className="h">เบื้องหลังระบบ (Backend)</div><span className="pri-mut" style={{ lineHeight: 1.65 }}>{sim.backend}</span></div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }} className="pri-mut">Action JSON (ใน areas ของ Rich Menu)</span>
          <CopyBtn text={str} toast={toast} label={`Action โซน ${z}`} />
        </div>
        <pre className="pri-code" style={{ maxHeight: 150 }}>{str}</pre>
      </div>
    </div>
  );
}

function HandoffView({ toast }) {
  const [zone, setZone] = useState("A");
  return (
    <div className="pri-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Brand sheet */}
      <section>
        <div className="pri-sec" style={{ marginBottom: 12 }}>D1 · Brand Sheet — สำหรับแต่ง LINE OA</div>
        <div className="pri-card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <LogoMark size={72} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>โลโก้ / Mark — "Refrigerant Telemetry"</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.6 }} className="pri-mut">
                เกล็ดหิมะ (สารทำความเย็น) + เส้นชีพจร (การเฝ้าระวังเรียลไทม์) บนพื้นชมพูจุฬาฯ ·
                ใช้เป็นรูปโปรไฟล์ OA (640×640 px) และ Favicon ของ LIFF
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                <span className="pri-chip">OA Theme Color → เลือกธีมโทนชมพู + ปก #E8578D</span>
                <CopyBtn text={LOGO_SVG} toast={toast} label="SVG โลโก้" />
                <span className="pri-faint" style={{ fontSize: 10.5 }}>คัดลอก SVG</span>
              </div>
            </div>
          </div>
          <div className="pri-swatches">
            {BRAND.map((b) => (
              <div className="pri-sw" key={b.h + b.n}>
                <div className="c" style={{ background: b.h }} />
                <div className="i">
                  <div><div className="n">{b.n}</div><div className="h">{b.h} · {b.note}</div></div>
                  <CopyBtn text={b.h} toast={toast} label={b.n} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11 }} className="pri-faint">
            Typography: <b className="pri-mut">IBM Plex Sans Thai</b> (UI / ข้อความ) + <b className="pri-mut">IBM Plex Mono</b> (ตัวเลข / ค่าเซนเซอร์) ·
            สถานะทุกจุดจับคู่ ไอคอน + ป้ายภาษาไทย เสมอ (Colorblind-safe — ไม่พึ่งสีเพียงอย่างเดียว)
          </div>
        </div>
      </section>

      {/* Rich menu */}
      <section>
        <div className="pri-sec" style={{ marginBottom: 12 }}>D2 · Rich Menu — 2500 × 1686 px · 6 โซน</div>
        <div className="pri-two" style={{ gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)" }}>
          <div>
            <div className="pri-menu" role="group" aria-label="ต้นแบบ Rich Menu 6 โซน — แตะโซนเพื่อดูผลลัพธ์จำลอง">
              {MENU_ZONES.map((z) => {
                const ZIcon = z.Icon;
                return (
                  <button key={z.z} onClick={() => setZone(z.z)} aria-pressed={zone === z.z}
                    className={`pri-zone ${z.hero ? "hero" : ""} ${zone === z.z ? "zsel" : ""}`}>
                    <span className="zl">{z.z}</span>
                    <span className="zic"><ZIcon size={20} /></span>
                    <span className="zt">{z.t}</span>
                    <span className="zs">{z.en}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 10.5, marginTop: 8 }} className="pri-faint">
              👆 <b className="pri-mut">แตะโซน A–F เพื่อจำลองผลลัพธ์ด้านล่าง</b> · ต้นแบบนี้ส่งออกเป็น SVG ได้ แต่ต้อง
              <b className="pri-mut"> Flatten เป็น PNG หรือ JPEG (≤ 1 MB)</b> ก่อนอัปโหลดเข้า LINE ·
              โซน A ลิงก์เข้าแดชบอร์ด (LIFF) จึงใช้สีชมพูเป็นปุ่มหลัก
            </div>
          </div>
          <div className="pri-card" style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>พิกัดพื้นที่แตะ (Tap Areas)</div>
              <span style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 10.5 }} className="pri-faint">
                คัดลอก areas JSON <CopyBtn text={JSON.stringify(RICH_MENU, null, 2)} toast={toast} label="Rich Menu JSON" />
              </span>
            </div>
            <table className="pri-table">
              <thead><tr><th>โซน</th><th>เมนู</th><th>x, y</th><th>w × h</th><th>Action</th></tr></thead>
              <tbody>
                {MENU_ZONES.map((z, i) => (
                  <tr key={z.z}>
                    <td className="mono">{z.z}</td>
                    <td style={{ fontWeight: 600 }}>{z.t}<br /><span className="pri-faint" style={{ fontSize: 10 }}>{z.en}</span></td>
                    <td className="mono pri-mut">{z.c.split(" · ")[0]}</td>
                    <td className="mono pri-mut">{z.c.split(" · ")[1]}</td>
                    <td className="mono pri-faint">{RICH_MENU.areas[i].action.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pri-sec" style={{ margin: "18px 0 0" }}>D2.1 · Tap Simulator — กดแต่ละโซนแล้วเห็นอะไร</div>
        <div className="pri-sim">
          <ZoneDetail z={zone} toast={toast} />
          <div>
            <SimPhone z={zone} />
            <div className="pri-phlabel">
              <b>ผลลัพธ์เมื่อกดโซน {zone} · {MENU_ZONES["ABCDEF".indexOf(zone)].t}</b>
              {ZONE_SIM[zone] && (zone === "A" || zone === "E" ? "เปิดเป็นเว็บวิว (uri) — ไม่มีข้อความในแชท" : "บอทตอบกลับในแชท (postback / oaMessage)")}
            </div>
          </div>
        </div>
      </section>

      {/* Greeting */}
      <section>
        <div className="pri-sec" style={{ marginBottom: 12 }}>D3 · Greeting Message — เมื่อเพิ่มเพื่อน OA</div>
        <div className="pri-card" style={{ padding: "16px 18px", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 300px", background: "linear-gradient(#BAC8DC,#ACBED4)", borderRadius: 14, padding: 14 }}>
            <div className="pri-msgrow">
              <span className="pri-oaav"><LogoMark size={26} /></span>
              <div className="pri-bub" style={{ maxWidth: 420, whiteSpace: "pre-wrap" }}>{GREETING}</div>
            </div>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="pri-btn" onClick={() => copyText(GREETING).then(() => toast("คัดลอก Greeting แล้ว ✓"))}>
              <Copy size={13} /> คัดลอกข้อความ
            </button>
            <span style={{ fontSize: 10.5, maxWidth: 200, lineHeight: 1.6 }} className="pri-faint">
              วางใน LINE OA Manager → Greeting message · ทำงานคู่กับ Rich Menu ที่แตะได้ทันที
            </span>
          </div>
        </div>
      </section>

      {/* Flex JSON */}
      <section>
        <div className="pri-sec" style={{ marginBottom: 12 }}>D4 · Flex Message JSON — Backend ส่งได้จริงผ่าน Messaging API</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Acc color="#B45309" title="1 · แจ้งเตือนช่างเทคนิค (Push)" sub="bubble mega + quickReply · postback + LIFF uri" json={FLEX_TECH} toast={toast} />
          <Acc color="#E8578D" title="2 · สรุปผู้บริหารรายสัปดาห์ (Broadcast)" sub="bubble mega · สถิติ 4 แถว + ปุ่ม LIFF" json={FLEX_WEEKLY} toast={toast} />
          <Acc color="#DC2626" title="3 · ยกระดับวิกฤต (Escalation)" sub="bubble mega · tel: + maps uri + quickReply" json={FLEX_CRIT} toast={toast} />
        </div>
        <div className="pri-card" style={{ padding: "13px 16px", marginTop: 12, display: "flex", gap: 10, alignItems: "flex-start", fontSize: 11.5 }}>
          <ExternalLink size={14} color="var(--pink)" style={{ flex: "none", marginTop: 2 }} />
          <span className="pri-mut">
            <b style={{ color: "var(--txt)" }}>Deploy เป็น LIFF:</b> แดชบอร์ดนี้เป็น React app มาตรฐาน — build แล้วโฮสต์บน HTTPS →
            สร้าง LIFF app ใน LINE Developers Console เพื่อรับ LIFF ID → แทนที่ <span className="pri-mono">https://liff.line.me/2000000000-XXXXXXXX</span>
            ใน Flex JSON และ Rich Menu ทุกจุด → ผูก Rich Menu ผ่าน Messaging API · การแจ้งเตือนทั้งหมดคือ Push / Broadcast จาก OA
            (<b style={{ color: "var(--txt)" }}>ไม่ใช้ LINE Notify</b> — ยุติบริการ 31 มี.ค. 2025)
          </span>
        </div>
      </section>
    </div>
  );
}

/* ================================================================ APP SHELL */

const NAV = [
  { k: "dash", t: "แดชบอร์ด", s: "Single Pane of Glass", Icon: LayoutDashboard },
  { k: "export", t: "Export & Audit", s: "Race to Zero · ISO 14064-1", Icon: Database },
];

const TITLES = {
  dash: ["แดชบอร์ด — Single Pane of Glass", "สุขภาพระบบปรับอากาศทุกอาคารนำร่องในหน้าจอเดียว · Traffic Light + Drill-down"],
  export: ["Export Module — Race to Zero & ISO 14064-1", "Audit Log · การแปลงมวลเป็นคาร์บอน (kg × GWP) · สถานะ API Sync"],
};

export default function App() {
  const [view, setView] = useState("dash");
  const [selected, setSelected] = useState("CH-MED-01");
  const [toastMsg, setToastMsg] = useState(null);
  const [theme, setTheme] = useState("light");
  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(null), 2400); };

  useEffect(() => {
    document.body.style.background = theme === "light" ? "#F3F4F8" : "#141318";
  }, [theme]);

  return (
    <div className={`pri-root ${theme === "light" ? "light" : ""}`}>
      <style>{CSS}</style>

      <aside className="pri-side">
        <div className="pri-logo">
          <LogoMark size={36} />
          <div>
            <div className="pri-logo-t">CU-PRI</div>
            <div className="pri-logo-s">Predictive Refrigerant<br />Intelligence · จุฬาฯ</div>
          </div>
        </div>
        {NAV.map((n) => (
          <button key={n.k} className={`pri-nav ${view === n.k ? "on" : ""}`} onClick={() => setView(n.k)}>
            <n.Icon size={16} strokeWidth={2.1} />
            <span>{n.t}<span className="pri-nav-s">{n.s}</span></span>
          </button>
        ))}
        <div className="pri-side-foot">
          <span className="pri-chip"><Snowflake size={11} /> Pilot ฿500,000 · 8 เครื่อง</span>
          <span className="pri-chip"><Leaf size={11} /> มาตรการ EE-04 · Net Zero 2050</span>
          <span>ต้นแบบเชิงโต้ตอบ · ข้อมูลจำลองอ้างอิงเอกสารโครงการ · LINE Messaging API (ไม่ใช้ LINE Notify)</span>
        </div>
      </aside>

      <main className="pri-main">
        <div className="pri-top">
          <div className="pri-h1">
            {TITLES[view][0]}
            <small>{TITLES[view][1]}</small>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            <button className="pri-th" onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              title={theme === "light" ? "สลับเป็นโหมดมืด" : "สลับเป็นโหมดสว่าง"} aria-label="Toggle light/dark theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              <span className="pri-syncpill"><Activity size={12} /> Race to Zero · Synced · Uptime 99.4%</span>
              <span className="pri-date">ศุกร์ 3 ก.ค. 2569 · 14:32 น. · R-410A GWP 2,088</span>
            </div>
          </div>
        </div>

        {view === "dash" && <DashboardView selected={selected} setSelected={setSelected} />}
        {view === "export" && <ExportView toast={toast} />}
      </main>

      {toastMsg && <div className="pri-toast"><CheckCircle2 size={15} color="var(--ok)" /> {toastMsg}</div>}
    </div>
  );
}
